import { describe, expect, it } from 'vitest';
import { mockBookings, mockWaitlist } from '../data/mockData';
import {
  cancelBooking,
  claimWaitlistEntry,
  hasBookingConflict,
  timeRangesOverlap,
} from './bookings';

describe('booking overlap calculation', () => {
  it('detects partially overlapping time ranges', () => {
    expect(timeRangesOverlap('10:00', '12:00', '11:00', '13:00')).toBe(true);
  });

  it('detects a requested range contained inside an existing booking', () => {
    expect(timeRangesOverlap('10:00 AM', '12:00 PM', '10:30 AM', '11:30 AM')).toBe(true);
  });

  it('allows back-to-back bookings', () => {
    expect(timeRangesOverlap('10:00', '12:00', '12:00', '13:00')).toBe(false);
  });

  it('finds conflicts only for the same resource and date', () => {
    expect(hasBookingConflict(mockBookings, {
      resourceId: 'r1',
      date: 'Friday, 12 Jun 2026',
      startTime: '11:00 AM',
      endTime: '1:00 PM',
    })).toBe(true);

    expect(hasBookingConflict(mockBookings, {
      resourceId: 'r3',
      date: 'Friday, 12 Jun 2026',
      startTime: '11:00 AM',
      endTime: '1:00 PM',
    })).toBe(false);
  });
});

describe('waitlist claiming', () => {
  it('removes the waitlist entry and creates a confirmed booking', () => {
    const originalBookings = [...mockBookings];
    const originalWaitlist = [...mockWaitlist];

    const result = claimWaitlistEntry(mockBookings, mockWaitlist, 'w2', {
      bookingId: 'claimed-w2',
      bookingRef: 'SW-2026-9999',
    });

    expect(result.waitlistEntries.some((entry) => entry.id === 'w2')).toBe(false);
    expect(result.claimedBooking).toMatchObject({
      id: 'claimed-w2',
      bookingRef: 'SW-2026-9999',
      resource: mockWaitlist[1].resource,
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      duration: 3,
      status: 'confirmed',
    });
    expect(result.bookings[0]).toEqual(result.claimedBooking);
    expect(mockBookings).toEqual(originalBookings);
    expect(mockWaitlist).toEqual(originalWaitlist);
  });

  it('rejects a waitlist entry whose slot has not been released', () => {
    expect(() => claimWaitlistEntry(mockBookings, mockWaitlist, 'w1', {
      bookingId: 'claimed-w1',
      bookingRef: 'SW-2026-9998',
    })).toThrow('not available to claim');
  });
});

describe('booking cancellation', () => {
  it('marks only the selected booking as cancelled without mutating the input', () => {
    const originalBookings = structuredClone(mockBookings);
    const result = cancelBooking(mockBookings, 'b1');

    expect(result.find((booking) => booking.id === 'b1')?.status).toBe('cancelled');
    expect(result.find((booking) => booking.id === 'b2')?.status).toBe('confirmed');
    expect(mockBookings).toEqual(originalBookings);
  });
});
