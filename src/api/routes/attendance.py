from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection

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
        return jsonify({'error': 'Database connection failed'}), 500

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
        return jsonify(attendance)
    except Exception as e:
        print(f"Error fetching attendance: {e}")  # Log the error
        conn.close()
        return jsonify({'error': 'Internal Server Error'}), 500

@attendance_bp.route('/', methods=['POST'])
def mark_attendance():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Attendance (StudentID, BatchID, AttendanceDate, Status)
        VALUES (%s, %s, %s, %s)
        """
        values = (
            data.get('student_id'),
            data.get('batch_id'),
            data.get('date', datetime.now().strftime('%Y-%m-%d')),
            data.get('status', 'Present')
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Attendance marked successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

