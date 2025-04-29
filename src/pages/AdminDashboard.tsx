import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  getStudents,
  getTrainers,
  getBatches,
  getAttendance,
  getPayments,
} from "@/services/api";
import { Attendance, Payment, Student, Trainer } from "@/types";

// Components for each section
const StudentManagement = ({ students }: { students: Student[] }) => {
  console.log("Students data:", students); // Debugging
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
        <CardDescription>View and manage all registered students</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <ul>
            {students.map((student) => (
              <li key={student.id} className="py-2 border-b">
                {student.name} - {student.age} years old - {student.contactInfo}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No students found.</p>
        )}
      </CardContent>
    </Card>
  );
};

const TrainerManagement = ({ trainers }: { trainers: Trainer[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Trainer Management</CardTitle>
      <CardDescription>Add, update, or delete trainer profiles</CardDescription>
    </CardHeader>
    <CardContent>
      {trainers.length > 0 ? (
        <ul>
          {trainers.map((trainer) => (
            <li key={trainer.id} className="py-2 border-b">
              {trainer.name} - {trainer.specialization}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No trainers found.</p>
      )}
    </CardContent>
  </Card>
);

const CourseSchedule = ({ schedule }: { schedule: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Course Schedule</CardTitle>
      <CardDescription>Manage class schedules and trainer assignments</CardDescription>
    </CardHeader>
    <CardContent>
      {schedule.length > 0 ? (
        <ul>
          {schedule.map((batch) => (
            <li key={batch.id} className="py-2 border-b">
              {batch.name} - {batch.schedule}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No schedules found.</p>
      )}
    </CardContent>
  </Card>
);

const AttendanceTracking = ({ attendance }: { attendance: Attendance[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Attendance Tracking</CardTitle>
      <CardDescription>Mark and view student attendance</CardDescription>
    </CardHeader>
    <CardContent>
      {attendance.length > 0 ? (
        <ul>
          {attendance.map((record) => (
            <li key={record.id} className="py-2 border-b">
              {record.studentName} - {record.attendanceDate} - {record.status}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No attendance records found.</p>
      )}
    </CardContent>
  </Card>
);

const PaymentHandling = ({ payments }: { payments: Payment[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Payment Handling</CardTitle>
      <CardDescription>View and update payment status</CardDescription>
    </CardHeader>
    <CardContent>
      {payments.length > 0 ? (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} className="py-2 border-b">
              {payment.studentName} - ${payment.amount} - {payment.paymentDate} - {payment.status}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No payments found.</p>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");

  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const defaultBatchId = 1; // Replace with a valid batch ID or fetch it dynamically
        const [studentsData, trainersData, scheduleData, attendanceData, paymentsData] =
          await Promise.all([
            getStudents(),
            getTrainers(),
            getBatches(),
            getAttendance(defaultBatchId), 
            getPayments(),
          ]);

        setStudents(studentsData);
        setTrainers(trainersData);
        setSchedule(scheduleData);
        setAttendance(attendanceData);
        setPayments(paymentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.message.includes("401")) {
          setError("Unauthorized access. Please log in.");
        } else {
          setError("Failed to fetch data from the backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!localStorage.getItem("isLoggedIn")) {
    navigate("/admin");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/admin");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Step Up Dance Admin
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <StudentManagement students={students} />
          </TabsContent>

          <TabsContent value="trainers" className="space-y-4">
            <TrainerManagement trainers={trainers} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <CourseSchedule schedule={schedule} />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <AttendanceTracking attendance={attendance} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentHandling payments={payments} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
