import { Bell, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Screen } from '../types';
import type { CSSProperties } from 'react';

const screenTitles: Record<Screen, string> = {
  signin: 'Sign In',
  dashboard: 'Dashboard',
  explore: 'Explore Resources',
  'resource-details': 'Resource Details',
  'booking-confirm': 'Booking Confirmed',
  'my-bookings': 'My Bookings',
  waitlist: 'Waitlist',
  'admin-dashboard': 'Admin Dashboard',
  'admin-resources': 'Resource Management',
  profile: 'Profile & Settings',
};

interface TopBarProps {
  screen: Screen;
  navigate: (screen: Screen) => void;
  notifCount?: number;
  isAdmin: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
}

export function TopBar({ screen, navigate, notifCount = 2, isAdmin, canGoBack, onBack }: TopBarProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {canGoBack && onBack && (
          <button
            onClick={onBack}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#087E8B' } as CSSProperties}
            aria-label="Go back"
          >
            <ChevronLeft size={18} style={{ color: '#17252A' }} />
          </button>
        )}
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#17252A' }} className="truncate">
          {screenTitles[screen]}
        </span>
        {isAdmin && (screen === 'admin-dashboard' || screen === 'admin-resources') && (
          <span className="shrink-0 ml-1 px-2 py-0.5 rounded text-xs font-medium" style={{ background: '#EBF7F8', color: '#087E8B' }}>Admin</span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#087E8B' } as CSSProperties}
          aria-label="Notifications"
        >
          <Bell size={18} style={{ color: '#17252A' }} />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#FF6B5E' }} />
          )}
        </button>

        <button
          onClick={() => navigate('profile')}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: '#087E8B', fontSize: '11px', fontWeight: 600, color: '#fff' }}>
            AF
          </div>
          <span className="hidden sm:block" style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Ahmad Faris</span>
          <ChevronRight size={14} style={{ color: '#5E737A' }} />
        </button>
      </div>
    </header>
  );
}
