
from flask import Blueprint, jsonify
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
        conn.close()
        # Return empty array in case of error
        return jsonify([]), 500
