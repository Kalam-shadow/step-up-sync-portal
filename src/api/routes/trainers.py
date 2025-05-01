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

        # Format JoiningDate as YYYY-MM-DD
        for trainer in trainers:
            if trainer['JoiningDate']:
                trainer['JoiningDate'] = trainer['JoiningDate'].strftime('%Y-%m-%d')

        cursor.close()
        conn.close()
        return jsonify(trainers)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@trainers_bp.route('', methods=['POST'])
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

@trainers_bp.route('/<int:trainer_id>', methods=['PUT'])
def update_trainer(trainer_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = """
        UPDATE Trainers
        SET Name = %s, Specialization = %s, JoiningDate = %s, ContactInfo = %s, Bio = %s
        WHERE TrainerID = %s
        """
        values = (
            data.get('name'),
            data.get('specialization'),
            data.get('joining_date'),
            data.get('contact_info'),
            data.get('bio'),
            trainer_id
        )

        cursor.execute(query, values)
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Trainer not found'}), 404

        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Trainer updated successfully'})
    except Exception as e:
        print(f"Error updating trainer: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500
    
@trainers_bp.route('/<int:trainer_id>', methods=['DELETE'])
def delete_trainer(trainer_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        # Use a dictionary cursor
        cursor = conn.cursor(dictionary=True)

        # Check for associations in BatchTrainer
        cursor.execute("SELECT COUNT(*) as count FROM BatchTrainer WHERE TrainerID = %s", (trainer_id,))
        association_count = cursor.fetchone()['count']  # Access using a string key

        if association_count > 0:
            # Delete associations in BatchTrainer
            cursor.execute("DELETE FROM BatchTrainer WHERE TrainerID = %s", (trainer_id,))
            conn.commit()

        # Delete the trainer
        cursor.execute("DELETE FROM Trainers WHERE TrainerID = %s", (trainer_id,))
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Trainer not found'}), 404

        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Trainer deleted successfully'})
    except Exception as e:
        print(f"Error deleting trainer: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500