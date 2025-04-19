
# Step Up Dance Company Web Application

A full-stack web application for Step Up Dance Company with a single-page frontend built with React and a backend API built with Flask. The application allows users to view information about the dance studio, register for classes, and contact the studio. It also includes an admin dashboard for managing students, trainers, course schedules, attendance, and payments.

## Project Structure

- `src/`: Frontend React application
  - `components/`: UI components
  - `pages/`: Pages and routes
  - `api/`: Flask backend API

## Features

### Frontend
- Single page layout with smooth scrolling navigation
- Responsive design using Tailwind CSS
- Five main sections:
  - Intro about Step Up Dance Company
  - Batches section showing batch types
  - Trainers section showing trainers and specializations
  - Student registration form
  - Contact section
- Admin login and dashboard

### Admin Dashboard
- Student management
- Trainer management
- Course scheduling
- Attendance tracking
- Payment handling

### Backend API
- Flask REST API with MySQL database
- Authentication for admin access
- Database operations for all entities

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+ and pip
- MySQL database server

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The application will be available at http://localhost:8080

### Backend Setup

1. Navigate to the `src/api` directory
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```
     source venv/bin/activate
     ```
4. Install dependencies:
   ```
   pip install flask flask-cors mysql-connector-python
   ```
5. Set up the database:
   - Create a MySQL database named `step_up_db`
   - Import the `src/api/sample_db.sql` script to create tables and sample data
   - Alternatively, import your own `StepUP_DB.sql` file
6. Configure database connection:
   - Update connection details in `src/api/app.py` if needed
7. Run the Flask server:
   ```
   python app.py
   ```
8. The API will be available at http://localhost:5000

## Admin Dashboard Access

For demo purposes, use these credentials:
- Username: admin
- Password: password

## Next Steps

1. Connect the frontend to the Flask backend API
2. Add validation to forms
3. Implement authentication with sessions/tokens
4. Add error handling and loading states
5. Deploy to production server

## License
MIT
