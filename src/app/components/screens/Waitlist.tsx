import { useState, useEffect } from 'react';
import { Clock, MapPin, Users, X, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import type { WaitlistEntry } from '../../types';

const likelihoodConfig = {
  low: { label: 'Low chance', color: '#D64545', bg: '#FEE2E2' },
  medium: { label: 'Moderate chance', color: '#D98C10', bg: '#FEF3C7' },
  high: { label: 'High chance', color: '#16845B', bg: '#ECFDF5' },
};

interface WaitlistProps {
  entries: WaitlistEntry[];
  onLeave: (id: string) => void;
  onClaim: (entry: WaitlistEntry) => void;
}

export function Waitlist({ entries, onLeave, onClaim }: WaitlistProps) {
  const [countdown, setCountdown] = useState(647); // seconds
  const [claimedResource, setClaimedResource] = useState('');

  useEffect(() => {
    if (!entries.find(e => e.slotAvailable)) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [entries]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const leaveWaitlist = (id: string) => {
    if (window.confirm('Are you sure you want to leave this waitlist?')) {
      onLeave(id);
    }
  };

  const claimSlot = (entry: WaitlistEntry) => {
    onClaim(entry);
    setClaimedResource(entry.resource.name);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-0">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>My waitlist</h2>
          <p style={{ fontSize: '13px', color: '#5E737A' }}>{entries.length} active {entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>
      </div>

      {/* Claimed toast */}
      {claimedResource && (
        <div className="flex items-center gap-3 p-4 rounded-lg mb-5" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
          <CheckCircle size={18} style={{ color: '#16845B' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#17252A' }}>Slot claimed successfully!</p>
            <p style={{ fontSize: '13px', color: '#5E737A' }}>Your booking for {claimedResource} has been confirmed.</p>
          </div>
        </div>
      )}

      {entries.length === 0 && !claimedResource ? (
        <div className="bg-card rounded-lg border border-border py-16 flex flex-col items-center text-center">
          <Clock size={36} style={{ color: '#5E737A' }} />
          <p className="mt-3" style={{ fontSize: '15px', fontWeight: 500, color: '#17252A' }}>No active waitlist entries</p>
          <p style={{ fontSize: '13px', color: '#5E737A' }}>Join a waitlist from any resource that's currently unavailable.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const lh = likelihoodConfig[entry.likelihood];
            return (
              <div key={entry.id} className="bg-card rounded-lg border overflow-hidden" style={{ borderColor: entry.slotAvailable ? '#16845B' : '#E0E4E8' }}>
                {/* Slot available banner */}
                {entry.slotAvailable && (
                  <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#ECFDF5', borderBottom: '1px solid #D1FAE5' }}>
                    <Bell size={16} style={{ color: '#16845B' }} />
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#16845B', flex: 1 }}>
                      A slot is available! Claim it before time runs out.
                    </p>
                    <span className="font-mono text-lg font-bold" style={{ color: countdown < 120 ? '#D64545' : '#16845B' }}>
                      {formatTime(countdown)}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={entry.resource.image}
                      alt={entry.resource.name}
                      className="w-16 h-16 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>{entry.resource.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin size={12} style={{ color: '#5E737A' }} />
                            <span style={{ fontSize: '12px', color: '#5E737A' }}>{entry.resource.building}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="px-2 py-0.5 rounded" style={{ background: '#EBF7F8', fontSize: '12px', color: '#087E8B', fontWeight: 500 }}>
                            Position #{entry.position} of {entry.totalInQueue}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} style={{ color: '#5E737A' }} />
                          <span style={{ fontSize: '12px', color: '#17252A' }}>{entry.requestedDate}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#17252A' }}>{entry.requestedTime}</div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: lh.bg, color: lh.color }}>
                          {lh.label}
                        </span>
                        <span style={{ fontSize: '11px', color: '#5E737A' }}>Expires: {entry.expiresAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Queue visualization */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: '11px', color: '#5E737A' }}>Queue position</span>
                      <span style={{ fontSize: '11px', color: '#5E737A' }}>{entry.position} of {entry.totalInQueue}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#EEF0F3' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${((entry.totalInQueue - entry.position + 1) / entry.totalInQueue) * 100}%`, background: entry.position === 1 ? '#16845B' : '#087E8B' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {entry.slotAvailable ? (
                      <>
                        <button
                          onClick={() => claimSlot(entry)}
                          className="flex-1 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                          style={{ background: '#16845B', color: '#fff', fontSize: '14px' }}
                        >
                          <CheckCircle size={15} />
                          Claim booking
                        </button>
                        <button
                          onClick={() => leaveWaitlist(entry.id)}
                          className="px-4 py-2.5 rounded-lg border hover:bg-red-50 transition-colors"
                          style={{ borderColor: '#D64545', color: '#D64545', fontSize: '13px' }}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => leaveWaitlist(entry.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border hover:bg-red-50 transition-colors"
                        style={{ borderColor: '#D64545', color: '#D64545', fontSize: '13px' }}
                      >
                        <X size={13} />Leave waitlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
