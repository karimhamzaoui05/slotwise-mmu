import { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, X, Edit2, Navigation, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import type { Booking, BookingStatus } from '../../types';

type Tab = 'upcoming' | 'past' | 'cancelled';

const tabs: { id: Tab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
];

const statusByTab: Record<Tab, BookingStatus[]> = {
  upcoming: ['confirmed', 'checked-in'],
  past: ['completed', 'no-show'],
  cancelled: ['cancelled'],
};

interface MyBookingsProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, status: BookingStatus) => void;
}

export function MyBookings({ bookings, onUpdateBooking }: MyBookingsProps) {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);
  const [editConflict, setEditConflict] = useState<string | null>(null);

  const filtered = bookings.filter((b) => statusByTab[tab].includes(b.status));

  const cancelBooking = (id: string) => {
    onUpdateBooking(id, 'cancelled');
    setCancelDialog(null);
  };

  const checkIn = (id: string) => {
    onUpdateBooking(id, 'checked-in');
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-0">
      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-border">
        {tabs.map((t) => {
          const count = bookings.filter((b) => statusByTab[t.id].includes(b.status)).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-2.5 border-b-2 transition-colors -mb-px"
              style={{
                borderBottomColor: tab === t.id ? '#087E8B' : 'transparent',
                color: tab === t.id ? '#087E8B' : '#5E737A',
                fontSize: '14px',
                fontWeight: tab === t.id ? 500 : 400,
              }}
            >
              {t.label}
              {count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs" style={{ background: tab === t.id ? '#EBF7F8' : '#EEF0F3', color: tab === t.id ? '#087E8B' : '#5E737A' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cancel dialog */}
      {cancelDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-sm w-full p-6">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>Cancel booking?</h3>
            <p className="mt-2" style={{ fontSize: '13px', color: '#5E737A' }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setCancelDialog(null)}
                className="flex-1 py-2 rounded-lg border hover:bg-muted"
                style={{ borderColor: '#E0E4E8', fontSize: '14px', color: '#17252A' }}
              >
                Keep booking
              </button>
              <button
                onClick={() => cancelBooking(cancelDialog)}
                className="flex-1 py-2 rounded-lg hover:opacity-90"
                style={{ background: '#D64545', color: '#fff', fontSize: '14px' }}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-card rounded-lg border border-border py-16 flex flex-col items-center text-center">
          <Calendar size={36} style={{ color: '#5E737A' }} />
          <p className="mt-3" style={{ fontSize: '15px', fontWeight: 500, color: '#17252A' }}>
            No {tab} bookings
          </p>
          <p style={{ fontSize: '13px', color: '#5E737A' }}>
            {tab === 'upcoming' ? 'Explore and reserve resources to see them here.' : `Your ${tab} bookings will appear here.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const expanded = expandedId === b.id;
            return (
              <div key={b.id} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  <img src={b.resource.image} alt={b.resource.name} className="w-16 h-16 rounded object-cover shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>{b.resource.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin size={12} style={{ color: '#5E737A' }} />
                          <span style={{ fontSize: '12px', color: '#5E737A' }}>{b.resource.building}, {b.resource.floor}</span>
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} style={{ color: '#5E737A' }} />
                        <span style={{ fontSize: '12px', color: '#17252A' }}>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} style={{ color: '#5E737A' }} />
                        <span style={{ fontSize: '12px', color: '#17252A' }}>{b.startTime} - {b.endTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2" style={{ fontSize: '12px', color: '#5E737A' }}>
                      Ref: <span style={{ fontWeight: 500, color: '#087E8B' }}>{b.bookingRef}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expanded ? null : b.id)}
                    className="shrink-0 p-1.5 rounded hover:bg-muted"
                    style={{ color: '#5E737A' }}
                  >
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Conflict error (demo) */}
                {editConflict === b.id && (
                  <div className="mx-4 mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ background: '#FEE2E2', color: '#D64545', fontSize: '13px' }}>
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    Edit conflict: A booking already exists at the new time. Please choose a different time slot.
                  </div>
                )}

                {/* Expanded actions */}
                {expanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border flex flex-wrap gap-2">
                    {b.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => checkIn(b.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:opacity-90"
                          style={{ background: '#16845B', color: '#fff', fontSize: '13px' }}
                        >
                          <CheckCircle size={13} />Check in
                        </button>
                        <button
                          onClick={() => { setEditConflict(editConflict === b.id ? null : b.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border hover:bg-muted"
                          style={{ borderColor: '#E0E4E8', color: '#17252A', fontSize: '13px' }}
                        >
                          <Edit2 size={13} />Edit
                        </button>
                        <button
                          onClick={() => setCancelDialog(b.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border hover:bg-red-50"
                          style={{ borderColor: '#D64545', color: '#D64545', fontSize: '13px' }}
                        >
                          <X size={13} />Cancel
                        </button>
                      </>
                    )}
                    {b.status === 'checked-in' && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: '#ECFDF5', color: '#16845B', fontSize: '13px' }}>
                        <CheckCircle size={13} />Checked in successfully
                      </span>
                    )}
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border hover:bg-muted"
                      style={{ borderColor: '#E0E4E8', color: '#17252A', fontSize: '13px' }}
                    >
                      <Navigation size={13} />Get directions
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
