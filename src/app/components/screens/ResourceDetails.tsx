import { useState } from 'react';
import { MapPin, Users, Clock, ChevronLeft, Wifi, Monitor, Zap, Wind, Camera, Wrench, Info, AlertCircle, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Resource, Screen, Booking } from '../../types';

const amenityIcons: Record<string, { icon: LucideIcon; label: string }> = {
  wifi: { icon: Wifi, label: 'Wi-Fi' },
  whiteboard: { icon: Monitor, label: 'Whiteboard' },
  power: { icon: Zap, label: 'Power Outlets' },
  aircon: { icon: Wind, label: 'Air-conditioned' },
  projector: { icon: Monitor, label: 'Projector' },
  'video-conf': { icon: Camera, label: 'Video Conference' },
  'tv-screen': { icon: Monitor, label: 'TV Screen' },
  'carry-bag': { icon: Camera, label: 'Carry Bag' },
  tripod: { icon: Camera, label: 'Tripod' },
  tools: { icon: Wrench, label: 'Tools' },
  microscope: { icon: Info, label: 'Microscope' },
  'memory-card': { icon: Info, label: 'Memory Card' },
  'extra-battery': { icon: Zap, label: 'Extra Battery' },
  hdmi: { icon: Monitor, label: 'HDMI' },
  remote: { icon: Info, label: 'Remote' },
  'carry-case': { icon: Info, label: 'Carry Case' },
  'power-cable': { icon: Zap, label: 'Power Cable' },
  components: { icon: Wrench, label: 'Components' },
  'safety-gear': { icon: Info, label: 'Safety Gear' },
  'standing-desk': { icon: Info, label: 'Standing Desk' },
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const unavailableSlots: Record<string, string[]> = {
  Mon: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  Tue: ['08:00', '09:00', '10:00', '13:00'],
  Wed: ['11:00', '12:00', '13:00', '18:00', '19:00'],
  Thu: ['10:00', '11:00', '15:00'],
  Fri: ['08:00', '09:00', '14:00', '15:00'],
  Sat: ['10:00', '11:00', '12:00'],
  Sun: [],
};

const maintenanceSlots: Record<string, string[]> = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: ['08:00'],
  Fri: [],
  Sat: [],
  Sun: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
};

interface ResourceDetailsProps {
  resource: Resource;
  navigate: (screen: Screen) => void;
  onBook: (booking: Booking) => void;
  onJoinWaitlist: (resource: Resource) => void;
}

export function ResourceDetails({ resource, navigate, onBook, onJoinWaitlist }: ResourceDetailsProps) {
  const [selectedDay, setSelectedDay] = useState('Fri');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [conflictError, setConflictError] = useState('');

  const today = 'Fri';

  const toggleSlot = (day: string, slot: string) => {
    if (unavailableSlots[day]?.includes(slot) || maintenanceSlots[day]?.includes(slot)) return;

    const key = `${day}:${slot}`;
    if (selectedSlots.includes(key)) {
      setSelectedSlots(selectedSlots.filter(s => s !== key));
      setConflictError('');
      return;
    }

    // Demonstrates a conflict with an existing booking.
    if (day === 'Fri' && slot === '16:00') {
      setConflictError('You already have a booking that overlaps with Fri 16:00-17:00. Please choose a different time.');
      return;
    }
    setConflictError('');
    setSelectedSlots([...selectedSlots, key]);
  };

  const selectedDaySlots = selectedSlots
    .filter((slot) => slot.startsWith(`${selectedDay}:`))
    .map((slot) => slot.slice(selectedDay.length + 1))
    .sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b));
  const canBook = resource.status !== 'maintenance' && selectedDaySlots.length > 0;

  const handleReserve = () => {
    if (!canBook) return;
    const start = selectedDaySlots[0];
    const endIdx = timeSlots.indexOf(selectedDaySlots[selectedDaySlots.length - 1]) + 1;
    const end = timeSlots[endIdx] || '22:00';
    onBook({
      id: `b-${Date.now()}`,
      bookingRef: 'SW-2026-' + Math.floor(1000 + Math.random() * 8999),
      resource,
      date: 'Friday, 12 Jun 2026',
      startTime: start,
      endTime: end,
      duration: selectedDaySlots.length,
      status: 'confirmed',
    });
  };

  const handleJoinWaitlist = () => {
    onJoinWaitlist(resource);
  };

  return (
    <div className="max-w-4xl mx-auto pb-28 md:pb-0">
      {/* Back */}
      <button
        onClick={() => navigate('explore')}
        className="flex items-center gap-1.5 mb-5 hover:underline"
        style={{ fontSize: '13px', color: '#5E737A' }}
      >
        <ChevronLeft size={16} /> Back to Explore
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left - main info */}
        <div className="md:col-span-2 space-y-5">
          {/* Image */}
          <div className="rounded-lg overflow-hidden h-56 md:h-72 bg-muted">
            <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
          </div>

          {/* Name + meta */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#17252A' }}>{resource.name}</h1>
              <span className={`shrink-0 mt-1 px-2.5 py-1 rounded text-xs font-medium ${resource.status === 'available' ? 'text-green-700 bg-green-50' : resource.status === 'occupied' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                {resource.status === 'available' ? '* Available' : resource.status === 'occupied' ? '* Occupied' : '* Maintenance'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#5E737A' }}>
                <MapPin size={14} />{resource.building}, {resource.floor}
              </span>
              <span className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#5E737A' }}>
                <Users size={14} />Up to {resource.capacity} {resource.capacity === 1 ? 'person' : 'people'}
              </span>
              <span className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#5E737A' }}>
                <Clock size={14} />{resource.hours}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#5E737A', lineHeight: 1.6 }}>{resource.description}</p>

          {/* Amenities */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '10px' }}>Amenities & features</h3>
            <div className="flex flex-wrap gap-2">
              {resource.amenities.map((a) => {
                const am = amenityIcons[a];
                const Icon = am?.icon;
                return (
                  <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ fontSize: '12px', borderColor: '#E0E4E8', color: '#17252A' }}>
                    {Icon && <Icon size={13} />}
                    {am?.label || a}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Usage rules */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <h3 className="flex items-center gap-2 mb-2" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>
              <Info size={15} style={{ color: '#D98C10' }} />Usage rules
            </h3>
            <ul className="space-y-1">
              {resource.rules.map((r, i) => (
                <li key={i} className="flex items-center gap-2" style={{ fontSize: '13px', color: '#5E737A' }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#D98C10' }} />{r}
                </li>
              ))}
            </ul>
          </div>

          {/* Availability calendar */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '12px' }}>
              Weekly availability - select your slot
            </h3>

            {/* Day selector */}
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {daysOfWeek.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className="shrink-0 px-3 py-1.5 rounded-lg border text-sm transition-colors"
                  style={{
                    background: selectedDay === d ? '#087E8B' : '#fff',
                    color: selectedDay === d ? '#fff' : '#17252A',
                    borderColor: selectedDay === d ? '#087E8B' : '#E0E4E8',
                    fontWeight: d === today ? 500 : 400,
                    fontSize: '13px',
                  }}
                >
                  {d}
                  {d === today && <span className="ml-1 text-xs" style={{ color: selectedDay === d ? 'rgba(255,255,255,0.7)' : '#5E737A' }}>Today</span>}
                </button>
              ))}
            </div>

            {/* Conflict error */}
            {conflictError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-3" style={{ background: '#FEE2E2', color: '#D64545', fontSize: '13px' }}>
                <AlertCircle size={15} className="shrink-0 mt-0.5" />{conflictError}
              </div>
            )}

            {/* Time slots grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {timeSlots.map((slot) => {
                const isUnavail = unavailableSlots[selectedDay]?.includes(slot);
                const isMaint = maintenanceSlots[selectedDay]?.includes(slot);
                const isSelected = selectedSlots.includes(`${selectedDay}:${slot}`);
                let bg = '#fff', color = '#17252A', border = '#E0E4E8', cursor = 'pointer';
                if (isMaint) { bg = '#FEE2E2'; color = '#D64545'; border = '#FCA5A5'; cursor = 'default'; }
                else if (isUnavail) { bg = '#F0F2F4'; color = '#B0BEC5'; border = '#E0E4E8'; cursor = 'not-allowed'; }
                else if (isSelected) { bg = '#EBF7F8'; color = '#087E8B'; border = '#087E8B'; }
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(selectedDay, slot)}
                    disabled={isUnavail || isMaint}
                    className="py-2 rounded text-center transition-colors border"
                    style={{ background: bg, color, borderColor: border, fontSize: '12px', cursor }}
                    title={isMaint ? 'Under maintenance' : isUnavail ? 'Already booked' : isSelected ? 'Selected' : 'Available'}
                  >
                    {slot}
                    {isSelected && <span className="block text-xs mt-0.5">OK</span>}
                    {isMaint && <span className="block text-xs mt-0.5">Maint.</span>}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { color: '#fff', border: '#E0E4E8', label: 'Available' },
                { color: '#EBF7F8', border: '#087E8B', label: 'Selected' },
                { color: '#F0F2F4', border: '#E0E4E8', label: 'Unavailable' },
                { color: '#FEE2E2', border: '#FCA5A5', label: 'Maintenance' },
              ].map(({ color, border, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded border" style={{ background: color, borderColor: border }} />
                  <span style={{ fontSize: '11px', color: '#5E737A' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - sticky booking summary */}
        <div className="md:sticky md:top-4 h-fit">
          <div className="bg-card rounded-lg border border-border p-5 space-y-4">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#17252A' }}>Booking summary</h3>

            <div className="space-y-2 py-3 border-y border-border">
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#5E737A' }}>Resource</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>{resource.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#5E737A' }}>Date</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>
                  {selectedDay === today ? 'Today (Fri 12 Jun)' : selectedDay + ', 2026'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#5E737A' }}>Time</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>
                  {selectedDaySlots.length > 0
                    ? `${selectedDaySlots[0]} - ${timeSlots[timeSlots.indexOf(selectedDaySlots[selectedDaySlots.length - 1]) + 1] || '22:00'}`
                    : '- Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: '#5E737A' }}>Duration</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>
                  {selectedDaySlots.length > 0 ? `${selectedDaySlots.length} hour${selectedDaySlots.length > 1 ? 's' : ''}` : '-'}
                </span>
              </div>
            </div>

            <div className="rounded-lg p-3" style={{ background: '#F4F6F8', fontSize: '12px', color: '#5E737A' }}>
              <p className="flex items-center gap-1.5 font-medium" style={{ color: '#17252A' }}>
                <Info size={13} />Check-in required
              </p>
              <p className="mt-1">You must check in within 15 minutes of your booking start time or your reservation will be released.</p>
            </div>

            <p style={{ fontSize: '11px', color: '#5E737A' }}>
              Free cancellation up to 30 minutes before your booking starts.
            </p>

            {resource.status === 'maintenance' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', color: '#D64545', fontSize: '13px' }}>
                  <AlertCircle size={14} />This resource is under maintenance.
                </div>
                <button
                  onClick={handleJoinWaitlist}
                  className="w-full py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors"
                  style={{ borderColor: '#087E8B', color: '#087E8B', fontSize: '14px' }}
                >
                  Join waitlist
                </button>
              </div>
            ) : !canBook ? (
              <div>
                {resource.status === 'occupied' && selectedDaySlots.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#D98C10', marginBottom: '8px' }}>
                    Currently occupied. Select an available time slot, or join the waitlist.
                  </p>
                )}
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg font-medium"
                  style={{ background: '#EEF0F3', color: '#B0BEC5', fontSize: '14px', cursor: 'not-allowed' }}
                >
                  Select a time slot to continue
                </button>
                {resource.status === 'occupied' && (
                  <button
                    onClick={handleJoinWaitlist}
                    className="w-full mt-2 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors"
                    style={{ borderColor: '#087E8B', color: '#087E8B', fontSize: '14px' }}
                  >
                    Join waitlist
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleReserve}
                className="w-full py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: '#087E8B', color: '#fff', fontSize: '14px' }}
              >
                <CheckCircle size={16} />
                Reserve resource
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
