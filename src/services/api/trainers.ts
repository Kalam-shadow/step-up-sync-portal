
import { API_BASE_URL, handleResponse } from './base';
import { Trainer } from '@/types';

// Trainers
export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await fetch(`${API_BASE_URL}/trainers`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error fetching trainers: ${response.status}`);
  }

  const data = await response.json();
  return data.map((trainer: any) => ({
    id: trainer.TrainerID,
    name: trainer.Name,
    specialization: trainer.Specialization,
    joiningDate: trainer.JoiningDate,
    contactInfo: trainer.ContactInfo,
    bio: trainer.Bio,
  }));
};

export const registerTrainer = async (trainerData:{
  name: string;
  specialization: string;
  contact_info: string;
  bio: string;
  joining_Date: any;
}): Promise<void> => {
  const formattedJoiningDate =
    trainerData.joining_Date instanceof Date
      ? trainerData.joining_Date.toISOString().split("T")[0] // Convert to YYYY-MM-DD
      : trainerData.joining_Date;

  const response = await fetch(`${API_BASE_URL}/trainers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerData.name,
      specialization: trainerData.specialization,
      joining_date: formattedJoiningDate, // Use the formatted date
      contact_info: trainerData.contact_info,
      bio: trainerData.bio,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
};

export const updateTrainer = async (trainerId: number, trainerData: {
  name: string;
  specialization: string;
  contact_info: string;
  bio: string;
  joining_Date: string;
}): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/trainers/${trainerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerData.name,
      specialization: trainerData.specialization,
      joining_date: trainerData.joining_Date, // Ensure the correct field name is used
      contact_info: trainerData.contact_info,
      bio: trainerData.bio,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
};
