
from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection

trainers_bp = Blueprint('trainers', __name__)

@trainers_bp.route('/', methods=['GET'])
def get_trainers():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Trainers")
        trainers = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(trainers)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@trainers_bp.route('/', methods=['POST'])
def add_trainer():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Trainers (Name, Specialization, JoiningDate, ContactInfo, Bio)
        VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            data.get('name'),
            data.get('specialization'),
            data.get('joining_date'),
            data.get('contact_info'),
            data.get('bio')
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Trainer added successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

