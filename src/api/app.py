
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'step_up_dance_secret_key'  # Change this to a proper secret key in production
CORS(app)  # Enable CORS for all routes

# Database connection function
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',  # Change this to your MySQL username
            password='',  # Change this to your MySQL password
            database='step_up_db'  # Database name from StepUP_DB.sql
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

# API Routes

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # For a real app, you would validate against database
    # For demo purposes:
    if username == 'admin' and password == 'password':
        session['logged_in'] = True
        return jsonify({'success': True, 'message': 'Login successful'})
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logout successful'})

# Batches routes
@app.route('/api/batches', methods=['GET'])
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

# Trainers routes
@app.route('/api/trainers', methods=['GET'])
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

@app.route('/api/trainers', methods=['POST'])
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

# Students routes
@app.route('/api/students', methods=['GET'])
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

@app.route('/api/students', methods=['POST'])
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

# Attendance routes
@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    if 'logged_in' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    batch_id = request.args.get('batch_id')
    date = request.args.get('date')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT a.*, s.Name as StudentName
        FROM Attendance a
        JOIN Students s ON a.StudentID = s.StudentID
        WHERE BatchID = %s
        """
        params = [batch_id]
        
        if date:
            query += " AND AttendanceDate = %s"
            params.append(date)
        
        cursor.execute(query, params)
        attendance = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(attendance)
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
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

# Payments routes
@app.route('/api/payments', methods=['GET'])
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

@app.route('/api/payments', methods=['POST'])
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

# Contact form
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    
    # In a real app, you'd store this in database and/or send an email
    print(f"Contact form submission: {data}")
    
    return jsonify({
        'success': True,
        'message': 'Thank you for your message! We will get back to you soon.'
    })

if __name__ == '__main__':
    app.run(debug=True)
