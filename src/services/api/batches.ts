
import { API_BASE_URL, handleResponse } from './base';
import { Batch } from '@/types';

// Batches
export const getBatches = async (): Promise<Batch[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching batches: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we always have an array
    if (!Array.isArray(data)) {
      console.error("API did not return an array for batches", data);
      return [];
    }
    
    return data.map((batch: any) => ({
      id: batch.BatchID,
      name: batch.BatchName,
      danceStyle: batch.DanceStyle || "",
      ageGroup: batch.AgeGroup || "",
      schedule: batch.Schedule || "",
      duration: batch.Duration || 60,
      level: batch.Level || "Beginner",
      fee: batch.Fee || 0,
      trainerName: batch.TrainerName || "",
      trainerID: batch.TrainerID || 0,
    }));
  } catch (error) {
    console.error("Error in getBatches:", error);
    return [];
  }
};

export const createBatch = async (batchData: {
  name: string;
  schedule: string;
  danceStyle: string;
  ageGroup: string;
  duration: number;
  level: string;
  fee: number;
  trainerID: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/batches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchData),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateBatch = async (batchId: number, batchData: {
  name: string;
  schedule: string;
  danceStyle: string;
  ageGroup: string;
  duration: number;
  level: string;
  fee: number;
  trainerID: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchData),
    credentials: 'include',
  });
  return handleResponse(response);
};
