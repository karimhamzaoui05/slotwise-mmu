import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileNav } from './components/MobileNav';
import { SignIn } from './components/screens/SignIn';
import { Dashboard } from './components/screens/Dashboard';
import { ExploreResources } from './components/screens/ExploreResources';
import { ResourceDetails } from './components/screens/ResourceDetails';
import { BookingConfirmation } from './components/screens/BookingConfirmation';
import { MyBookings } from './components/screens/MyBookings';
import { Waitlist } from './components/screens/Waitlist';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { AdminResources } from './components/screens/AdminResources';
import { Profile } from './components/screens/Profile';
import { mockBookings, mockWaitlist } from './data/mockData';
import { cancelBooking, claimWaitlistEntry, updateBookingStatus } from './domain/bookings';
import type { Screen, Resource, Booking, BookingStatus, WaitlistEntry } from './types';

// MARKER-MAKE-KIT-INVOKED

interface AppState {
  screen: Screen;
  prevScreen: Screen | null;
  isAdmin: boolean;
  selectedResource: Resource | null;
  currentBooking: Booking | null;
}

const backDestinations: Partial<Record<Screen, Screen>> = {
  'resource-details': 'explore',
  'booking-confirm': 'resource-details',
  'admin-resources': 'admin-dashboard',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>(() => loadStored('slotwise-bookings', mockBookings));
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(() => loadStored('slotwise-waitlist', mockWaitlist));
  const [state, setState] = useState<AppState>({
    screen: 'signin',
    prevScreen: null,
    isAdmin: false,
    selectedResource: null,
    currentBooking: null,
  });

  useEffect(() => {
    localStorage.setItem('slotwise-bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('slotwise-waitlist', JSON.stringify(waitlistEntries));
  }, [waitlistEntries]);

  const navigate = (screen: Screen) =>
    setState((s) => ({ ...s, prevScreen: s.screen, screen }));

  const goBack = () => {
    const dest = backDestinations[state.screen] ?? state.prevScreen ?? 'dashboard';
    setState((s) => ({ ...s, screen: dest, prevScreen: null }));
  };

  const handleSignIn = (isAdmin: boolean) => {
    setState((s) => ({ ...s, isAdmin, screen: isAdmin ? 'admin-dashboard' : 'dashboard' }));
    toast.success(isAdmin ? 'Signed in as admin.' : 'Welcome back, Ahmad!');
  };

  const handleSignOut = () => {
    setState({ screen: 'signin', prevScreen: null, isAdmin: false, selectedResource: null, currentBooking: null });
  };

  const handleSelectResource = (resource: Resource) => {
    setState((s) => ({ ...s, selectedResource: resource, screen: 'resource-details' }));
  };

  const handleBook = (booking: Booking) => {
    setBookings((current) => [booking, ...current.filter((item) => item.id !== booking.id)]);
    setState((s) => ({ ...s, currentBooking: booking, screen: 'booking-confirm' }));
    toast.success('Booking confirmed! Reference: ' + booking.bookingRef);
  };

  const handleUpdateBooking = (id: string, status: BookingStatus) => {
    setBookings((current) => (
      status === 'cancelled'
        ? cancelBooking(current, id)
        : updateBookingStatus(current, id, status)
    ));
    toast.success(status === 'checked-in' ? 'Check-in completed.' : 'Booking cancelled.');
  };

  const handleJoinWaitlist = (resource: Resource) => {
    const alreadyWaiting = waitlistEntries.some((entry) => entry.resource.id === resource.id);
    if (!alreadyWaiting) {
      setWaitlistEntries((current) => [{
        id: `w-${resource.id}`,
        resource,
        requestedDate: '13 Jun 2026',
        requestedTime: '10:00 AM - 12:00 PM',
        position: 3,
        totalInQueue: 5,
        expiresAt: '15 Jun 2026, 11:59 PM',
        slotAvailable: false,
        likelihood: 'medium',
      }, ...current]);
    }
    navigate('waitlist');
    toast.success(alreadyWaiting ? 'You are already on this waitlist.' : 'Added to the waitlist.');
  };

  const handleLeaveWaitlist = (id: string) => {
    setWaitlistEntries((current) => current.filter((entry) => entry.id !== id));
    toast.success('Waitlist entry removed.');
  };

  const handleClaimWaitlist = (entry: WaitlistEntry) => {
    const result = claimWaitlistEntry(bookings, waitlistEntries, entry.id, {
      bookingId: `claimed-${entry.id}`,
      bookingRef: `SW-2026-${Math.floor(1000 + Math.random() * 8999)}`,
    });
    setWaitlistEntries(result.waitlistEntries);
    setBookings(result.bookings);
    toast.success('Waitlist slot claimed and added to your bookings.');
  };

  const handleCancelBooking = () => {
    if (state.currentBooking) {
      setBookings((current) => cancelBooking(current, state.currentBooking!.id));
    }
    toast.success('Booking cancelled successfully.');
    navigate('my-bookings');
  };

  if (state.screen === 'signin') {
    return (
      <>
        <SignIn onSignIn={handleSignIn} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="flex h-screen" style={{ background: '#F4F6F8' }}>
      <Toaster position="top-right" richColors />

      <Sidebar
        currentScreen={state.screen}
        navigate={navigate}
        isAdmin={state.isAdmin}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <TopBar
          screen={state.screen}
          navigate={navigate}
          isAdmin={state.isAdmin}
          notifCount={state.screen === 'waitlist' ? 0 : 2}
          canGoBack={state.screen in backDestinations}
          onBack={goBack}
        />

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-12 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#087E8B' }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>SW</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>SlotWise MMU</span>
          </div>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#087E8B', fontSize: '12px', fontWeight: 600, color: '#fff' }}
          >
            AF
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {state.screen === 'dashboard' && (
            <Dashboard navigate={navigate} onSelectResource={handleSelectResource} />
          )}
          {state.screen === 'explore' && (
            <ExploreResources navigate={navigate} onSelectResource={handleSelectResource} />
          )}
          {state.screen === 'resource-details' && state.selectedResource && (
            <ResourceDetails
              resource={state.selectedResource}
              navigate={navigate}
              onBook={handleBook}
              onJoinWaitlist={handleJoinWaitlist}
              bookings={bookings}
            />
          )}
          {state.screen === 'booking-confirm' && state.currentBooking && (
            <BookingConfirmation
              booking={state.currentBooking}
              navigate={navigate}
              onCancel={handleCancelBooking}
            />
          )}
          {state.screen === 'my-bookings' && (
            <MyBookings bookings={bookings} onUpdateBooking={handleUpdateBooking} />
          )}
          {state.screen === 'waitlist' && (
            <Waitlist entries={waitlistEntries} onLeave={handleLeaveWaitlist} onClaim={handleClaimWaitlist} />
          )}
          {state.screen === 'admin-dashboard' && <AdminDashboard navigate={navigate} />}
          {state.screen === 'admin-resources' && <AdminResources />}
          {state.screen === 'profile' && (
            <Profile isAdmin={state.isAdmin} onSignOut={handleSignOut} />
          )}
        </main>
      </div>

      <MobileNav currentScreen={state.screen} navigate={navigate} />
    </div>
  );
}
