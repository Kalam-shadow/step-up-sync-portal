
from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection

batches_bp = Blueprint('batches', __name__)

@batches_bp.route('/', methods=['GET'])
def get_batches():
    conn = get_db_connection()
    if not conn:
        return jsonify([]), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Batches")
        batches = cursor.fetchall()
        cursor.close()
        conn.close()
        # Always return a list, even if empty
        return jsonify(batches if batches else [])
    except Exception as e:
        print(f"Error fetching batches: {e}")
        conn.close()
        # Return empty array in case of error
        return jsonify([]), 500

@batches_bp.route('/', methods=['POST'])
def create_batch():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Batches (BatchName, Schedule, DanceStyle, AgeGroup, Duration, Level, Fee)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('name'),
            data.get('schedule'),
            data.get('dance_style', 'General'),
            data.get('age_group', 'All Ages'),
            data.get('duration', 60),
            data.get('level', 'Beginner'),
            data.get('fee', 0)
        )
        cursor.execute(query, values)
        conn.commit()
        batch_id = cursor.lastrowid
        
        # Assign trainer to batch if provided
        if 'trainer_id' in data and data['trainer_id']:
            query = """
            INSERT INTO BatchTrainers (BatchID, TrainerID)
            VALUES (%s, %s)
            """
            values = (batch_id, data['trainer_id'])
            cursor.execute(query, values)
            conn.commit()
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Batch created successfully', 'id': batch_id})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@batches_bp.route('/<int:batch_id>', methods=['DELETE'])
def delete_batch(batch_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        
        # Check for students in this batch
        cursor.execute("SELECT COUNT(*) as count FROM Students WHERE BatchID = %s", (batch_id,))
        student_count = cursor.fetchone()['count']
        
        if student_count > 0:
            conn.close()
            return jsonify({'error': f'Cannot delete: {student_count} students are enrolled in this batch'}), 400
        
        # Delete batch-trainer associations first
        cursor.execute("DELETE FROM BatchTrainers WHERE BatchID = %s", (batch_id,))
        
        # Then delete the batch
        cursor.execute("DELETE FROM Batches WHERE BatchID = %s", (batch_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Batch not found'}), 404
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Batch deleted successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500
