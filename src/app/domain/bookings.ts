import type { Booking, BookingStatus, WaitlistEntry } from '../types';

interface BookingCandidate {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  ignoreBookingId?: string;
}

interface ClaimIdentifiers {
  bookingId: string;
  bookingRef: string;
}

export interface ClaimWaitlistResult {
  bookings: Booking[];
  waitlistEntries: WaitlistEntry[];
  claimedBooking: Booking;
}

export function timeToMinutes(value: string): number {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) {
    throw new Error(`Invalid time value: ${value}`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (minutes > 59 || (period ? hours < 1 || hours > 12 : hours > 23)) {
    throw new Error(`Invalid time value: ${value}`);
  }

  let normalizedHours = hours;
  if (period === 'AM') normalizedHours = hours === 12 ? 0 : hours;
  if (period === 'PM') normalizedHours = hours === 12 ? 12 : hours + 12;

  return normalizedHours * 60 + minutes;
}

export function timeRangesOverlap(
  firstStart: string,
  firstEnd: string,
  secondStart: string,
  secondEnd: string,
): boolean {
  const firstStartMinutes = timeToMinutes(firstStart);
  const firstEndMinutes = timeToMinutes(firstEnd);
  const secondStartMinutes = timeToMinutes(secondStart);
  const secondEndMinutes = timeToMinutes(secondEnd);

  if (firstStartMinutes >= firstEndMinutes || secondStartMinutes >= secondEndMinutes) {
    throw new Error('A booking end time must be later than its start time.');
  }

  return firstStartMinutes < secondEndMinutes && secondStartMinutes < firstEndMinutes;
}

function normalizeDateLabel(value: string): string {
  return value
    .trim()
    .replace(/^(today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*/i, '')
    .toLowerCase();
}

export function hasBookingConflict(bookings: Booking[], candidate: BookingCandidate): boolean {
  return bookings.some((booking) => (
    booking.id !== candidate.ignoreBookingId
    && booking.resource.id === candidate.resourceId
    && booking.status !== 'cancelled'
    && normalizeDateLabel(booking.date) === normalizeDateLabel(candidate.date)
    && timeRangesOverlap(booking.startTime, booking.endTime, candidate.startTime, candidate.endTime)
  ));
}

export function updateBookingStatus(
  bookings: Booking[],
  bookingId: string,
  status: BookingStatus,
): Booking[] {
  return bookings.map((booking) => (
    booking.id === bookingId ? { ...booking, status } : booking
  ));
}

export function cancelBooking(bookings: Booking[], bookingId: string): Booking[] {
  return updateBookingStatus(bookings, bookingId, 'cancelled');
}

export function claimWaitlistEntry(
  bookings: Booking[],
  waitlistEntries: WaitlistEntry[],
  entryId: string,
  identifiers: ClaimIdentifiers,
): ClaimWaitlistResult {
  const entry = waitlistEntries.find((item) => item.id === entryId);
  if (!entry) {
    throw new Error('Waitlist entry not found.');
  }
  if (!entry.slotAvailable) {
    throw new Error('This waitlist slot is not available to claim.');
  }

  const [startTime, endTime] = entry.requestedTime.split(' - ');
  if (!startTime || !endTime) {
    throw new Error('The waitlist entry has an invalid requested time.');
  }

  const durationMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  if (durationMinutes <= 0) {
    throw new Error('The waitlist entry has an invalid requested time range.');
  }

  const claimedBooking: Booking = {
    id: identifiers.bookingId,
    bookingRef: identifiers.bookingRef,
    resource: entry.resource,
    date: entry.requestedDate,
    startTime,
    endTime,
    duration: durationMinutes / 60,
    status: 'confirmed',
  };

  return {
    bookings: [claimedBooking, ...bookings],
    waitlistEntries: waitlistEntries.filter((item) => item.id !== entryId),
    claimedBooking,
  };
}
