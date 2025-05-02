from flask import Blueprint, jsonify, request, session
from utils.db import get_db_connection

batches_bp = Blueprint('batches', __name__)

@batches_bp.route('/', methods=['GET'])
def get_batches():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            B.BatchID,
            B.BatchName,
            B.DanceStyle,
            B.AgeGroup,
            B.Schedule,
            B.Duration,
            B.Level,
            B.Fee,
            B.TrainerID,
            T.Name AS TrainerName
        FROM 
            Batches B
        LEFT JOIN 
            Trainers T
        ON 
            B.TrainerID = T.TrainerID
        """
        cursor.execute(query)
        batches = cursor.fetchall()
        #rint(batches)  # Debugging line to check the fetched data
        cursor.close()
        conn.close()
        return jsonify(batches)
    except Exception as e:
        print(f"Error fetching batches: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@batches_bp.route('', methods=['POST'])
def create_batch():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Batches (BatchName, DanceStyle, AgeGroup, Schedule, Duration, Level, Fee, TrainerID)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('name'),
            data.get('danceStyle'),
            data.get('ageGroup'),
            data.get('schedule'),
            data.get('duration'),
            data.get('level'),
            data.get('fee'),
            data.get('trainerID')
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Batch created successfully'})
    except Exception as e:
        print(f"Error creating batch: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@batches_bp.route('/<int:batch_id>', methods=['PUT'])
def update_batch(batch_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        query = """
        UPDATE Batches
        SET BatchName = %s, Schedule = %s, DanceStyle = %s, AgeGroup = %s, Duration = %s, 
            Level = %s, Fee = %s, TrainerID = %s
        WHERE BatchID = %s
        """
        values = (
            data.get('name'),
            data.get('schedule'),
            data.get('danceStyle', 'General'),
            data.get('ageGroup', 'All Ages'),
            data.get('duration', 60),
            data.get('level', 'Beginner'),
            data.get('fee', 0),
            data.get('trainerID'),  # Include TrainerID in the values
            batch_id
        )
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Batch not found'}), 404
        
# Update trainer if provided
        if 'trainer_id' in data and data['trainer_id']:
            query = """
            INSERT INTO BatchTrainer (BatchID, TrainerID)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE TrainerID = %s
            """
            values = (batch_id, data['trainer_id'], data['trainer_id'])
            cursor.execute(query, values)
            conn.commit()
        
        
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Batch updated successfully'})
    except Exception as e:
        print(f"Error updating batch: {e}")
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
        # Use a dictionary cursor
        cursor = conn.cursor(dictionary=True)
        
        # Check for students in this batch
        cursor.execute("SELECT COUNT(*) as count FROM Students WHERE BatchID = %s", (batch_id,))
        student_count = cursor.fetchone()['count']  # Access using a string key
        
        if student_count > 0:
            conn.close()
            return jsonify({'error': f'Cannot delete: {student_count} students are enrolled in this batch'}), 400
        
        # Delete batch-trainer associations first
        cursor.execute("DELETE FROM BatchTrainer WHERE BatchID = %s", (batch_id,))
        
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
        print(f"Error deleting batch: {e}")
        conn.close()
        return jsonify({'error': str(e)}), 500
