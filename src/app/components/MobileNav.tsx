import { LayoutDashboard, Search, CalendarDays, Clock, User } from 'lucide-react';
import type { Screen } from '../types';

interface MobileNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

const items = [
  { id: 'dashboard' as Screen, label: 'Home', icon: LayoutDashboard },
  { id: 'explore' as Screen, label: 'Explore', icon: Search },
  { id: 'my-bookings' as Screen, label: 'Bookings', icon: CalendarDays },
  { id: 'waitlist' as Screen, label: 'Waitlist', icon: Clock },
  { id: 'profile' as Screen, label: 'Profile', icon: User },
];

export function MobileNav({ currentScreen, navigate }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center safe-area-inset-bottom z-50">
      {items.map(({ id, label, icon: Icon }) => {
        const active = currentScreen === id;
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] transition-colors"
            style={{ color: active ? '#087E8B' : '#5E737A' }}
          >
            <Icon size={20} />
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
            {active && <span className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ background: '#087E8B' }} />}
          </button>
        );
      })}
    </nav>
  );
}
