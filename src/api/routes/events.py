from flask import Blueprint, request, jsonify
from utils.db import get_db_connection

events_bp = Blueprint('events', __name__)

# Get all events
@events_bp.route('/', methods=['GET'])
def get_events():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM Events"
        cursor.execute(query)
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(events)
    except Exception as e:
        print(f"Error fetching events: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Create a new event
@events_bp.route('', methods=['POST'])
def create_event():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Events (EventName, EventDate, Location, Description, ClientName, ClientContact, Status, Fee, EventType)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('eventname'),
            data.get('eventdate'),
            data.get('location'),
            data.get('description'),
            data.get('clientName'),
            data.get('clientContact'),
            data.get('status'),
            data.get('fee'),
            data.get('eventType')
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Event created successfully'})
    except Exception as e:
        print(f"Error creating event: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Update an existing event
@events_bp.route('/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = """
        UPDATE Events
        SET EventName = %s, EventDate = %s, Location = %s, Description = %s, ClientName = %s, ClientContact = %s, Status = %s, Fee = %s, EventType = %s
        WHERE EventID = %s
        """
        values = (
            data.get('name'),
            data.get('date'),
            data.get('location'),
            data.get('description'),
            data.get('clientName'),
            data.get('clientContact'),
            data.get('status'),
            data.get('fee'),
            data.get('eventType'),
            event_id
        )
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Event not found'}), 404
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Event updated successfully'})
    except Exception as e:
        print(f"Error updating event: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Delete an event
@events_bp.route('/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = "DELETE FROM Events WHERE EventID = %s"
        cursor.execute(query, (event_id,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Event not found'}), 404
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Event deleted successfully'})
    except Exception as e:
        print(f"Error deleting event: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Get staff assigned to an event
@events_bp.route('/<int:event_id>/staff', methods=['GET'])
def get_event_staff(event_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM EventStaff WHERE EventID = %s"
        cursor.execute(query, (event_id,))
        staff = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(staff)
    except Exception as e:
        print(f"Error fetching event staff: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Assign staff to an event
@events_bp.route('/<int:event_id>/staff', methods=['POST'])
def assign_staff_to_event(event_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO EventStaff (EventID, TrainerID, Role)
        VALUES (%s, %s, %s)
        """
        values = (event_id, data.get('trainerId'), data.get('role'))
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Staff assigned to event successfully'})
    except Exception as e:
        print(f"Error assigning staff to event: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

# Remove staff from an event
@events_bp.route('/<int:event_id>/staff/<int:staff_id>', methods=['DELETE'])
def remove_staff_from_event(event_id, staff_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        query = "DELETE FROM EventStaff WHERE EventID = %s AND EventStaffID = %s"
        cursor.execute(query, (event_id, staff_id))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Staff not found for this event'}), 404
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Staff removed from event successfully'})
    except Exception as e:
        print(f"Error removing staff from event: {e}")
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500