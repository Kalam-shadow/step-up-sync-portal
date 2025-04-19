
from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/', methods=['GET'])
def get_payments():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    student_id = request.args.get('student_id')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT p.*, s.Name as StudentName
        FROM Payments p
        JOIN Students s ON p.StudentID = s.StudentID
        """
        params = []
        
        if student_id:
            query += " WHERE p.StudentID = %s"
            params.append(student_id)
        
        cursor.execute(query, params)
        payments = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(payments)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/', methods=['POST'])
def record_payment():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Payments (StudentID, Amount, PaymentDate, Description, Status)
        VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            data.get('student_id'),
            data.get('amount'),
            data.get('date', datetime.now().strftime('%Y-%m-%d')),
            data.get('description'),
            data.get('status', 'Paid')
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Payment recorded successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

