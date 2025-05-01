
import { API_BASE_URL, handleResponse } from './base';
import { Payment } from '@/types';

// Payments
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching payments: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for payments", data);
      return [];
    }
    
    return data.map((payment: any) => ({
      id: payment.PaymentID,
      studentId: payment.StudentID,
      studentName: payment.StudentName,
      amount: payment.Amount,
      paymentDate: payment.PaymentDate,
      description: payment.Description,
      status: payment.Status,
    }));
  } catch (error) {
    console.error("Error in getPayments:", error);
    return [];
  }
};

export const recordPayment = async (paymentData: {
  student_id: number;
  amount: number;
  date: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
    credentials: 'include',
  });
  return handleResponse(response);
};
