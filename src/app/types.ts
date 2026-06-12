export type ResourceType = 'study-room' | 'discussion-pod' | 'lab' | 'equipment' | 'project-space';
export type ResourceStatus = 'available' | 'occupied' | 'maintenance';
export type BookingStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
export type Screen =
  | 'signin'
  | 'dashboard'
  | 'explore'
  | 'resource-details'
  | 'booking-confirm'
  | 'my-bookings'
  | 'waitlist'
  | 'admin-dashboard'
  | 'admin-resources'
  | 'profile';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  building: string;
  floor: string;
  capacity: number;
  amenities: string[];
  status: ResourceStatus;
  image: string;
  nextAvailable: string;
  description: string;
  hours: string;
  rules: string[];
  campus: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  resource: Resource;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
}

export interface WaitlistEntry {
  id: string;
  resource: Resource;
  requestedDate: string;
  requestedTime: string;
  position: number;
  totalInQueue: number;
  expiresAt: string;
  slotAvailable: boolean;
  claimDeadline?: string;
  likelihood: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  faculty: string;
  isAdmin: boolean;
}
