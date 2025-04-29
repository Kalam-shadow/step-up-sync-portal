from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection
from datetime import datetime

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
def get_students():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify([]), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Students")
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(students if students else [])
    except Exception as e:
        print(f"Error fetching students: {e}")
        if conn:
            conn.close()
        return jsonify([]), 500

@students_bp.route('', methods=['POST'])
def register_student():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
        
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Students (Name, Age, ContactInfo, JoiningDate, EmergencyContact, BatchID)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('name'),
            data.get('age'),
            data.get('contact_info'),
            datetime.now().strftime('%Y-%m-%d'),
            data.get('emergency_contact'),
            data.get('batch_id')
        )
        cursor.execute(query, values)
        conn.commit()
        student_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return jsonify({
            'success': True, 
            'message': 'Student registered successfully',
            'id': student_id
        })
    except Exception as e:
        print(f"Error registering student: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
        
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        UPDATE Students 
        SET Name = %s, Age = %s, ContactInfo = %s, EmergencyContact = %s, BatchID = %s
        WHERE StudentID = %s
        """
        values = (
            data.get('name'),
            data.get('age'),
            data.get('contact_info'),
            data.get('emergency_contact'),
            data.get('batch_id'),
            student_id
        )
        
        print(f"Executing query: {query} with values: {values}")  # Debugging log
        
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Student not found'}), 404
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Student updated successfully'})
    except Exception as e:
        print(f"Error updating student: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        
        # Delete associated attendance records
        cursor.execute("DELETE FROM Attendance WHERE StudentID = %s", (student_id,))
        
        # Delete associated payments
        cursor.execute("DELETE FROM Payments WHERE StudentID = %s", (student_id,))
        
        # Delete the student
        cursor.execute("DELETE FROM Students WHERE StudentID = %s", (student_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Student not found'}), 404
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Student deleted successfully'})
    except Exception as e:
        print(f"Error deleting student: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500
