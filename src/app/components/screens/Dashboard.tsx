import { useState } from 'react';
import { Search, CalendarDays, Clock, MapPin, ChevronRight, AlertCircle, CheckCircle, Users } from 'lucide-react';
import type { CSSProperties } from 'react';
import { resources, mockBookings, mockWaitlist } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { ResourceCard } from '../ResourceCard';
import type { Resource, Screen } from '../../types';

interface DashboardProps {
  navigate: (screen: Screen) => void;
  onSelectResource: (r: Resource) => void;
}

export function Dashboard({ navigate, onSelectResource }: DashboardProps) {
  const [search, setSearch] = useState('');

  const availableNow = resources.filter(r => r.status === 'available').slice(0, 3);
  const upcomingBookings = mockBookings.filter(b => b.status === 'confirmed').slice(0, 2);
  const waitlistEntry = mockWaitlist.find(w => w.slotAvailable);
  const recentlyBooked = mockBookings.filter(b => b.status === 'completed').slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-20 md:pb-0">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#17252A' }}>Good morning, Ahmad </h1>
          <p style={{ fontSize: '13px', color: '#5E737A' }}>Friday, 12 June 2026 | Cyberjaya Campus</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#ECFDF5', fontSize: '12px', color: '#16845B', fontWeight: 500 }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#16845B' }} />
          38 resources available now
        </div>
      </div>

      {/* Search + quick filters */}
      <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5E737A' }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('explore'); }}
            placeholder="Search rooms, equipment, or facilities..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as CSSProperties}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { icon: CalendarDays, label: 'Today' },
            { icon: Clock, label: '10:00 AM - 12:00 PM' },
            { icon: Users, label: '1-4 people' },
            { icon: MapPin, label: 'FCI Block' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors hover:border-primary"
              style={{ fontSize: '13px', color: '#17252A', borderColor: '#E0E4E8' }}
            >
              <Icon size={13} style={{ color: '#5E737A' }} />
              {label}
            </button>
          ))}
          <button
            onClick={() => navigate('explore')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-colors hover:opacity-90"
            style={{ background: '#087E8B', color: '#fff', fontSize: '13px', fontWeight: 500 }}
          >
            Find resources
          </button>
        </div>
      </div>

      {/* Waitlist alert */}
      {waitlistEntry && (
        <div className="rounded-lg border flex items-start gap-3 p-4" style={{ borderColor: '#FFA500', background: '#FFFBF0' }}>
          <AlertCircle size={18} style={{ color: '#D98C10', marginTop: '1px', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#17252A' }}>
              A slot is available for {waitlistEntry.resource.name}!
            </p>
            <p style={{ fontSize: '13px', color: '#5E737A' }}>
              Claim it within {waitlistEntry.claimDeadline} minutes or it will be offered to the next person.
            </p>
          </div>
          <button
            onClick={() => navigate('waitlist')}
            className="shrink-0 px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ background: '#D98C10', color: '#fff', fontSize: '13px' }}
          >
            Claim now
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          {/* Available now */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#17252A' }}>Available right now</h2>
              <button
                onClick={() => navigate('explore')}
                className="flex items-center gap-1 hover:underline"
                style={{ fontSize: '13px', color: '#087E8B' }}
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {availableNow.map((r) => (
                <ResourceCard key={r.id} resource={r} onView={onSelectResource} />
              ))}
            </div>
          </section>

          {/* Upcoming bookings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#17252A' }}>Upcoming bookings</h2>
              <button
                onClick={() => navigate('my-bookings')}
                className="flex items-center gap-1 hover:underline"
                style={{ fontSize: '13px', color: '#087E8B' }}
              >
                My bookings <ChevronRight size={14} />
              </button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <CalendarDays size={32} className="mx-auto mb-2" style={{ color: '#5E737A' }} />
                <p style={{ fontSize: '14px', color: '#5E737A' }}>No upcoming bookings. Book a resource to get started.</p>
                <button onClick={() => navigate('explore')} className="mt-3 px-4 py-2 rounded-lg text-sm hover:opacity-90" style={{ background: '#087E8B', color: '#fff' }}>
                  Explore resources
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="bg-card rounded-lg border border-border flex items-center gap-4 p-4">
                    <img src={b.resource.image} alt={b.resource.name} className="w-14 h-14 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#17252A' }}>{b.resource.name}</p>
                      <p style={{ fontSize: '12px', color: '#5E737A' }}>{b.resource.building}, {b.resource.floor}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: '12px', color: '#17252A' }}>{b.date} | {b.startTime} - {b.endTime}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => navigate('my-bookings')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:opacity-90"
                        style={{ background: '#16845B', color: '#fff', fontSize: '12px', fontWeight: 500 }}
                      >
                        <CheckCircle size={13} />
                        Check in
                      </button>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Occupancy summary */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>Today's occupancy</h3>
            <div className="mt-3 space-y-3">
              {[
                { label: 'Study Rooms', value: 72, color: '#087E8B' },
                { label: 'Equipment', value: 45, color: '#FF6B5E' },
                { label: 'Project Spaces', value: 60, color: '#16845B' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: '12px', color: '#5E737A' }}>{label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#EEF0F3' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>My waitlist</h3>
            <div className="mt-3 space-y-2">
              {mockWaitlist.map((w) => (
                <div key={w.id} className="flex items-start gap-2.5 py-2 border-b border-border last:border-0">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: w.slotAvailable ? '#ECFDF5' : '#EEF0F3', fontSize: '11px', fontWeight: 600, color: w.slotAvailable ? '#16845B' : '#5E737A' }}>
                    {w.position}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate" style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>{w.resource.name}</p>
                    <p style={{ fontSize: '11px', color: '#5E737A' }}>{w.requestedDate}</p>
                    {w.slotAvailable && (
                      <span style={{ fontSize: '11px', color: '#16845B', fontWeight: 500 }}>Slot available!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('waitlist')} className="w-full mt-2 text-center hover:underline" style={{ fontSize: '12px', color: '#087E8B' }}>
              View all
            </button>
          </div>

          {/* Recently booked */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>Recently booked</h3>
            <div className="mt-3 flex flex-col gap-2">
              {recentlyBooked.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onSelectResource(b.resource)}
                  className="flex items-center gap-2.5 hover:bg-muted rounded-lg p-1.5 transition-colors text-left w-full"
                >
                  <img src={b.resource.image} alt={b.resource.name} className="w-8 h-8 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate" style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>{b.resource.name}</p>
                    <p style={{ fontSize: '11px', color: '#5E737A' }}>{b.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
