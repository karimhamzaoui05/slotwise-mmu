import {
  LayoutDashboard, Search, CalendarDays, Clock, ShieldCheck, User, LogOut,
  BookMarked, ChevronRight,
} from 'lucide-react';
import type { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  isAdmin: boolean;
  onSignOut: () => void;
}

const navItems = [
  { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore' as Screen, label: 'Explore Resources', icon: Search },
  { id: 'my-bookings' as Screen, label: 'My Bookings', icon: CalendarDays },
  { id: 'waitlist' as Screen, label: 'Waitlist', icon: Clock },
];

const adminItems = [
  { id: 'admin-dashboard' as Screen, label: 'Admin Dashboard', icon: ShieldCheck },
  { id: 'admin-resources' as Screen, label: 'Resource Management', icon: BookMarked },
];

export function Sidebar({ currentScreen, navigate, isAdmin, onSignOut }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen bg-card border-r border-border sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#087E8B' }}>
          <BookMarked size={15} color="white" />
        </div>
        <div>
          <p className="leading-none" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>SlotWise</p>
          <p className="leading-none mt-0.5" style={{ fontSize: '10px', color: '#5E737A', fontWeight: 500 }}>MMU Campus Booking</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentScreen === id;
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left"
              style={{
                background: active ? '#EBF7F8' : 'transparent',
                color: active ? '#087E8B' : '#17252A',
                fontWeight: active ? 500 : 400,
                fontSize: '14px',
              }}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" style={{ color: '#087E8B' }} />}
            </button>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="px-3 pb-2" style={{ fontSize: '10px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Administration
            </p>
            {adminItems.map(({ id, label, icon: Icon }) => {
              const active = currentScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left"
                  style={{
                    background: active ? '#EBF7F8' : 'transparent',
                    color: active ? '#087E8B' : '#17252A',
                    fontWeight: active ? 500 : 400,
                    fontSize: '14px',
                  }}
                >
                  <Icon size={17} />
                  {label}
                  {active && <ChevronRight size={14} className="ml-auto" style={{ color: '#087E8B' }} />}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom user + profile */}
      <div className="border-t border-border px-3 py-3 flex flex-col gap-0.5">
        <button
          onClick={() => navigate('profile')}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left"
          style={{
            background: currentScreen === 'profile' ? '#EBF7F8' : 'transparent',
            color: currentScreen === 'profile' ? '#087E8B' : '#17252A',
            fontSize: '14px',
            fontWeight: currentScreen === 'profile' ? 500 : 400,
          }}
        >
          <User size={17} />
          Profile & Settings
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left"
          style={{ color: '#5E737A', fontSize: '14px' }}
        >
          <LogOut size={17} />
          Sign out
        </button>

        <div className="flex items-center gap-2.5 mt-2 px-3 py-2 rounded-lg" style={{ background: '#F4F6F8' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#087E8B', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
            AF
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Ahmad Faris</p>
            <p className="truncate" style={{ fontSize: '11px', color: '#5E737A' }}>1211301047</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
