
import { API_BASE_URL, handleResponse } from './base';
import { Event, EventStaff } from '@/types';

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for events", data);
      return [];
    }
    
    return data.map((event: any) => ({
      id: event.EventID,
      name: event.EventName,
      date: event.EventDate,
      location: event.Location,
      description: event.Description,
      clientName: event.ClientName || "",
      clientContact: event.ClientContact || "",
      status: event.Status || "Upcoming",
      fee: event.Fee || 0,
      eventType: event.EventType || "",
    }));
  } catch (error) {
    console.error("Error in getEvents:", error);
    return [];
  }
};

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_name: eventData.name,
      event_date: eventData.date,
      location: eventData.location,
      description: eventData.description,
      client_name: eventData.clientName,
      client_contact: eventData.clientContact,
      status: eventData.status,
      fee: eventData.fee,
      event_type: eventData.eventType,
    }),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Update an existing event
export const updateEvent = async (eventId: number, eventData: EventFormData): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_name: eventData.name,
      event_date: eventData.date,
      location: eventData.location,
      description: eventData.description,
      client_name: eventData.clientName,
      client_contact: eventData.clientContact,
      status: eventData.status,
      fee: eventData.fee,
      event_type: eventData.eventType,
    }),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Delete an event
export const deleteEvent = async (eventId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// Get staff assigned to an event
export const getEventStaff = async (eventId: number): Promise<EventStaff[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/staff`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching event staff: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for event staff", data);
      return [];
    }
    
    return data.map((staff: any) => ({
      id: staff.EventStaffID,
      eventId: staff.EventID,
      trainerId: staff.TrainerID,
      trainerName: staff.TrainerName || "",
      role: staff.Role || "",
      confirmed: staff.Confirmed || false,
    }));
  } catch (error) {
    console.error("Error in getEventStaff:", error);
    return [];
  }
};

// Assign staff to an event
export const assignStaffToEvent = async (eventId: number, trainerId: number, role: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trainer_id: trainerId,
      role: role,
    }),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Remove staff from an event
export const removeStaffFromEvent = async (eventId: number, staffId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/staff/${staffId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};
