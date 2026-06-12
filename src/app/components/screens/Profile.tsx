import { useState } from 'react';
import { Bell, Mail, Monitor, LogOut, ChevronRight, Shield, Moon } from 'lucide-react';

interface ProfileProps {
  isAdmin: boolean;
  onSignOut: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-6 rounded-full transition-colors"
      style={{ background: checked ? '#087E8B' : '#B0BEC5' }}
      role="switch"
      aria-checked={checked}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export function Profile({ isAdmin, onSignOut }: ProfileProps) {
  const [notifs, setNotifs] = useState({
    emailBooking: true,
    emailReminder: true,
    inAppBooking: true,
    inAppWaitlist: true,
    inAppReminder: false,
  });
  const [defaultDuration, setDefaultDuration] = useState('2');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-0 space-y-6">
      {/* Profile card */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: '#087E8B', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
            AF
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#17252A' }}>Ahmad Faris bin Khairul</h2>
            <p style={{ fontSize: '13px', color: '#5E737A' }}>Student ID: 1211301047</p>
            <p style={{ fontSize: '13px', color: '#5E737A' }}>Faculty of Computing and Informatics</p>
            <p style={{ fontSize: '13px', color: '#5E737A' }}>ahmad.faris@student.mmu.edu.my</p>
          </div>
          {isAdmin && (
            <div className="ml-auto">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#EBF7F8', color: '#087E8B' }}>
                <Shield size={11} />Admin
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
          {[
            { label: 'Total bookings', value: '47' },
            { label: 'Hours booked', value: '89h' },
            { label: 'No-shows', value: '1' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#17252A' }}>{value}</p>
              <p style={{ fontSize: '11px', color: '#5E737A' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>
          <Bell size={16} style={{ color: '#087E8B' }} />Notification preferences
        </h3>

        <div className="space-y-4">
          <div className="pb-3 border-b border-border">
            <p className="flex items-center gap-1.5 mb-3" style={{ fontSize: '12px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Mail size={13} />Email notifications
            </p>
            {[
              { key: 'emailBooking' as const, label: 'Booking confirmations & cancellations' },
              { key: 'emailReminder' as const, label: 'Booking reminders (30 min before)' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span style={{ fontSize: '13px', color: '#17252A' }}>{label}</span>
                <Toggle checked={notifs[key]} onChange={(v) => setNotifs(n => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </div>

          <div>
            <p className="flex items-center gap-1.5 mb-3" style={{ fontSize: '12px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Monitor size={13} />In-app notifications
            </p>
            {[
              { key: 'inAppBooking' as const, label: 'Booking status updates' },
              { key: 'inAppWaitlist' as const, label: 'Waitlist slot available alerts' },
              { key: 'inAppReminder' as const, label: 'Check-in reminders' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span style={{ fontSize: '13px', color: '#17252A' }}>{label}</span>
                <Toggle checked={notifs[key]} onChange={(v) => setNotifs(n => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking preferences */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '16px' }}>Booking preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '13px', color: '#17252A' }}>Default booking duration</p>
            <p style={{ fontSize: '12px', color: '#5E737A' }}>Used when searching for available slots</p>
          </div>
          <select
            value={defaultDuration}
            onChange={(e) => setDefaultDuration(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{ borderColor: '#E0E4E8', fontSize: '13px', background: '#fff' }}
          >
            {['1', '2', '3', '4'].map(v => (
              <option key={v} value={v}>{v} hour{v !== '1' ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>
          <Moon size={16} style={{ color: '#087E8B' }} />Accessibility
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '13px', color: '#17252A' }}>Reduce motion</p>
            <p style={{ fontSize: '12px', color: '#5E737A' }}>Minimize animations throughout the app</p>
          </div>
          <Toggle checked={false} onChange={() => {}} />
        </div>
      </div>

      {/* Save + sign out */}
      <div className="flex gap-3">
        <button
          onClick={save}
          className="flex-1 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: saved ? '#16845B' : '#087E8B', color: '#fff', fontSize: '14px', fontWeight: 500 }}
        >
          {saved ? 'OK Saved' : 'Save preferences'}
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border hover:bg-red-50 transition-colors"
          style={{ borderColor: '#D64545', color: '#D64545', fontSize: '14px' }}
        >
          <LogOut size={15} />Sign out
        </button>
      </div>
    </div>
  );
}
