
from flask import Blueprint, jsonify
from utils.db import get_db_connection

batches_bp = Blueprint('batches', __name__)

@batches_bp.route('/', methods=['GET'])
def get_batches():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Batches")
        batches = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(batches)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

