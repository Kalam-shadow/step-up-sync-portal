
from flask import Flask
from flask_cors import CORS
import os

from routes.auth import auth_bp
from routes.batches import batches_bp
from routes.trainers import trainers_bp
from routes.students import students_bp
from routes.attendance import attendance_bp
from routes.payments import payments_bp

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'step_up_dance_secret_key')
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(batches_bp, url_prefix='/api/batches')
app.register_blueprint(trainers_bp, url_prefix='/api/trainers')
app.register_blueprint(students_bp, url_prefix='/api/students')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(payments_bp, url_prefix='/api/payments')

if __name__ == '__main__':
    app.run(debug=True)

