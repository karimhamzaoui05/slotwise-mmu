import { CheckCircle, Calendar, MapPin, Clock, Copy, X, ArrowRight } from 'lucide-react';
import type { Booking, Screen } from '../../types';

interface BookingConfirmationProps {
  booking: Partial<Booking>;
  navigate: (screen: Screen) => void;
  onCancel: () => void;
}

export function BookingConfirmation({ booking, navigate, onCancel }: BookingConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Success header */}
        <div className="flex flex-col items-center py-8 px-6" style={{ background: '#ECFDF5', borderBottom: '1px solid #D1FAE5' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: '#16845B' }}>
            <CheckCircle size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#17252A' }}>Booking confirmed!</h1>
          <p className="mt-1" style={{ fontSize: '14px', color: '#5E737A', textAlign: 'center' }}>
            Your resource has been successfully reserved.
          </p>
          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#fff', border: '1px solid #D1FAE5' }}>
            <span style={{ fontSize: '12px', color: '#5E737A' }}>Booking reference:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#087E8B', letterSpacing: '0.05em' }}>
              {booking.bookingRef}
            </span>
            <button
              onClick={() => navigator.clipboard?.writeText(booking.bookingRef || '')}
              className="hover:opacity-70 transition-opacity"
              aria-label="Copy booking reference"
            >
              <Copy size={13} style={{ color: '#5E737A' }} />
            </button>
          </div>
        </div>

        {/* Booking details */}
        <div className="px-6 py-5 space-y-4">
          {booking.resource && (
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <img
                src={booking.resource.image}
                alt={booking.resource.name}
                className="w-16 h-14 rounded object-cover shrink-0"
              />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#17252A' }}>{booking.resource.name}</p>
                <p className="flex items-center gap-1" style={{ fontSize: '12px', color: '#5E737A' }}>
                  <MapPin size={12} />{booking.resource.building}, {booking.resource.floor}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EBF7F8' }}>
                <Calendar size={15} style={{ color: '#087E8B' }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#5E737A' }}>Date</p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#17252A' }}>{booking.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EBF7F8' }}>
                <Clock size={15} style={{ color: '#087E8B' }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#5E737A' }}>Time</p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#17252A' }}>
                  {booking.startTime} - {booking.endTime} ({booking.duration} hour{(booking.duration || 0) > 1 ? 's' : ''})
                </p>
              </div>
            </div>
          </div>

          {/* Check-in info */}
          <div className="rounded-lg p-3.5" style={{ background: '#F4F6F8', border: '1px solid #E0E4E8' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#17252A', marginBottom: '4px' }}>
              Important: Check-in required
            </p>
            <p style={{ fontSize: '12px', color: '#5E737A', lineHeight: 1.5 }}>
              Please check in via the app or at the resource location within <strong>15 minutes</strong> of your booking start time. Failure to check in will result in your booking being released to the waitlist.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-2.5">
          <button
            onClick={() => navigate('my-bookings')}
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: '#087E8B', color: '#fff', fontSize: '14px', fontWeight: 500 }}
          >
            View my bookings <ArrowRight size={15} />
          </button>

          <button
            className="w-full py-2.5 rounded-lg border hover:bg-muted transition-colors"
            style={{ borderColor: '#E0E4E8', color: '#17252A', fontSize: '14px' }}
            onClick={() => {
              alert('Calendar invite downloaded (demo).');
            }}
          >
            <Calendar size={15} className="inline mr-2" />
            Add to calendar
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this booking?')) onCancel();
            }}
            className="w-full py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            style={{ color: '#D64545', fontSize: '13px' }}
          >
            <X size={14} />Cancel booking
          </button>
        </div>
      </div>
    </div>
  );
}
