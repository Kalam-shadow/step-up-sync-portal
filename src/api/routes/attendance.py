
from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection
from datetime import datetime

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    batch_id = request.args.get('batch_id')
    date = request.args.get('date')

    if not batch_id:
        return jsonify({'error': 'Batch ID is required'}), 400

    try:
        batch_id = int(batch_id)  # Ensure batch_id is an integer
    except ValueError:
        return jsonify({'error': 'Batch ID must be an integer'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify([]), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT a.*, s.Name as StudentName
        FROM Attendance a
        JOIN Students s ON a.StudentID = s.StudentID
        WHERE a.BatchID = %s
        """
        params = [batch_id]

        if date:
            query += " AND a.AttendanceDate = %s"
            params.append(date)

        cursor.execute(query, params)
        attendance = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(attendance if attendance else [])
    except Exception as e:
        print(f"Error fetching attendance: {e}")  # Log the error
        if conn:
            conn.close()
        return jsonify([]), 500

@attendance_bp.route('/', methods=['POST'])
def mark_attendance():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        # Get the batch ID for the student
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT BatchID FROM Students WHERE StudentID = %s", (data.get('student_id'),))
        student_data = cursor.fetchone()
        
        if not student_data:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Student not found'}), 404
            
        batch_id = student_data['BatchID']
        
        # Check if attendance already exists for this student on this date
        cursor.execute(
            "SELECT * FROM Attendance WHERE StudentID = %s AND AttendanceDate = %s",
            (data.get('student_id'), data.get('date'))
        )
        existing = cursor.fetchone()
        
        if existing:
            # Update existing attendance
            query = """
            UPDATE Attendance SET Status = %s
            WHERE StudentID = %s AND AttendanceDate = %s
            """
            values = (
                data.get('status', 'Present'),
                data.get('student_id'),
                data.get('date')
            )
        else:
            # Insert new attendance record
            query = """
            INSERT INTO Attendance (StudentID, BatchID, AttendanceDate, Status)
            VALUES (%s, %s, %s, %s)
            """
            values = (
                data.get('student_id'),
                batch_id,
                data.get('date', datetime.now().strftime('%Y-%m-%d')),
                data.get('status', 'Present')
            )
            
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Attendance marked successfully'})
    except Exception as e:
        print(f"Error marking attendance: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/<int:attendance_id>', methods=['DELETE'])
def delete_attendance(attendance_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Attendance WHERE AttendanceID = %s", (attendance_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Attendance record not found'}), 404
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Attendance record deleted successfully'})
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500
