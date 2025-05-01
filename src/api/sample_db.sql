
/*
 * Step Up Dance Company Database Schema 
 * This is a sample schema that can be used to create the database tables
 * In a real implementation, this would be the StepUP_DB.sql file
 */

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS step_up_db;
USE step_up_db;

-- Create Batches table
CREATE TABLE IF NOT EXISTS Batches (
    BatchID INT AUTO_INCREMENT PRIMARY KEY,
    BatchName VARCHAR(100) NOT NULL,
    DanceStyle VARCHAR(50) NOT NULL,
    AgeGroup VARCHAR(50),
    Schedule VARCHAR(255),
    Duration INT,  -- in minutes
    Level VARCHAR(50),
    Fee DECIMAL(10, 2),
    TrainerID INT,  -- Optional, can be used for quick reference
    FOREIGN KEY (TrainerID) REFERENCES Trainers(TrainerID)  -- Optional, can be used for quick reference
);

-- Create Trainers table
CREATE TABLE IF NOT EXISTS Trainers (
    TrainerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Specialization VARCHAR(255),
    JoiningDate DATE,
    ContactInfo VARCHAR(255),
    Bio TEXT
);

-- Create BatchTrainer relationship table
CREATE TABLE IF NOT EXISTS BatchTrainer (
    BatchTrainerID INT AUTO_INCREMENT PRIMARY KEY,
    BatchID INT,
    TrainerID INT,
    FOREIGN KEY (BatchID) REFERENCES Batches(BatchID),
    FOREIGN KEY (TrainerID) REFERENCES Trainers(TrainerID)
);

-- Create Students table
CREATE TABLE IF NOT EXISTS Students (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT,
    ContactInfo VARCHAR(255),
    JoiningDate DATE,
    EmergencyContact VARCHAR(255),
    BatchID INT,
    FOREIGN KEY (BatchID) REFERENCES Batches(BatchID)
);

-- Create Attendance table
CREATE TABLE IF NOT EXISTS Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    BatchID INT,
    AttendanceDate DATE,
    Status VARCHAR(20), -- Present, Absent, Late
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (BatchID) REFERENCES Batches(BatchID)
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    Amount DECIMAL(10, 2),
    PaymentDate DATE,
    Description VARCHAR(255),
    Status VARCHAR(20), -- Paid, Pending, Failed
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Create Events table
CREATE TABLE IF NOT EXISTS Events (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    EventName VARCHAR(100),
    EventDate DATE,
    Location VARCHAR(255),
    Description TEXT
);

-- Insert sample data for Batches
INSERT INTO Batches (BatchName, DanceStyle, AgeGroup, Schedule, Duration, Level, Fee) VALUES
('Kids Dance', 'Various', '5-12 years', 'Mon, Wed 4-5 PM', 60, 'Beginner', 1500.00),
('Teen Hip Hop', 'Hip Hop', '13-19 years', 'Tue, Thu 5-6:30 PM', 90, 'Intermediate', 2000.00),
('Adult Contemporary', 'Contemporary', '20+ years', 'Mon, Fri 7-8:30 PM', 90, 'All Levels', 2500.00),
('Professional Ballet', 'Ballet', 'All ages', 'Tue, Thu, Sat 9-11 AM', 120, 'Advanced', 3500.00);

-- Insert sample data for Trainers
INSERT INTO Trainers (Name, Specialization, JoiningDate, ContactInfo, Bio) VALUES
('Sarah Johnson', 'Contemporary & Modern Dance', '2020-01-15', 'sarah@stepdance.com', 'Sarah is a renowned contemporary dancer with over 10 years of professional experience in both teaching and performing.'),
('Michael Chen', 'Hip Hop & Street Dance', '2021-03-10', 'michael@stepdance.com', 'Michael has choreographed for multiple award-winning dance crews and specializes in urban dance styles.'),
('Elena Rodriguez', 'Ballet & Classical Dance', '2019-06-20', 'elena@stepdance.com', 'Former principal dancer with the National Ballet, Elena brings classical technique and performance excellence to her teaching.'),
('David Williams', 'Jazz & Musical Theatre', '2022-02-01', 'david@stepdance.com', 'With Broadway experience and a background in jazz dance, David trains dancers for both stage and commercial performances.');

-- Link Trainers to Batches
INSERT INTO BatchTrainer (BatchID, TrainerID) VALUES
(1, 1),  -- Kids Dance - Sarah
(2, 2),  -- Teen Hip Hop - Michael
(3, 1),  -- Adult Contemporary - Sarah
(4, 3);  -- Professional Ballet - Elena

-- Insert sample Students
INSERT INTO Students (Name, Age, ContactInfo, JoiningDate, EmergencyContact, BatchID) VALUES
('Emma Wilson', 8, 'parent@example.com', '2023-01-10', 'John Wilson: 555-123-4567', 1),
('Noah Martinez', 15, 'noah@example.com', '2023-02-05', 'Maria Martinez: 555-234-5678', 2),
('Olivia Johnson', 28, 'olivia@example.com', '2023-01-15', 'James Johnson: 555-345-6789', 3),
('Liam Smith', 22, 'liam@example.com', '2023-03-01', 'Sarah Smith: 555-456-7890', 4),
('Sophia Brown', 7, 'parent2@example.com', '2023-02-20', 'Robert Brown: 555-567-8901', 1),
('Jackson Davis', 16, 'jackson@example.com', '2023-01-25', 'Emily Davis: 555-678-9012', 2);

-- Insert sample Attendance records
INSERT INTO Attendance (StudentID, BatchID, AttendanceDate, Status) VALUES
(1, 1, '2023-03-01', 'Present'),
(2, 2, '2023-03-01', 'Present'),
(3, 3, '2023-03-01', 'Absent'),
(4, 4, '2023-03-01', 'Present'),
(5, 1, '2023-03-01', 'Present'),
(6, 2, '2023-03-01', 'Late'),
(1, 1, '2023-03-03', 'Present'),
(2, 2, '2023-03-02', 'Present');

-- Insert sample Payments
INSERT INTO Payments (StudentID, Amount, PaymentDate, Description, Status) VALUES
(1, 1500.00, '2023-01-10', 'Kids Dance - Jan to Mar 2023', 'Paid'),
(2, 2000.00, '2023-02-05', 'Teen Hip Hop - Feb to Apr 2023', 'Paid'),
(3, 2500.00, '2023-01-15', 'Adult Contemporary - Jan to Mar 2023', 'Paid'),
(4, 3500.00, '2023-03-01', 'Professional Ballet - Mar to May 2023', 'Pending'),
(5, 1500.00, '2023-02-20', 'Kids Dance - Feb to Apr 2023', 'Paid'),
(6, 2000.00, '2023-01-25', 'Teen Hip Hop - Jan to Mar 2023', 'Failed');

-- Insert sample Events
INSERT INTO Events (EventName, EventDate, Location, Description) VALUES
('Spring Dance Showcase', '2023-05-15', 'City Theater', 'Annual spring performance featuring all dance classes'),
('Summer Dance Camp', '2023-07-10', 'Step Up Dance Studio', 'Two-week intensive dance camp for kids and teens'),
('Dance Competition Prep', '2023-09-01', 'Step Up Dance Studio', 'Special workshop for competition team members');
