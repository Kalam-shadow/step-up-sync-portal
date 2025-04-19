
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
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Students")
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(students)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/', methods=['POST'])
def register_student():
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
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Student registered successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

