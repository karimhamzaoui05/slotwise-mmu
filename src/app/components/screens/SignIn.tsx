import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { Eye, EyeOff, BookMarked, AlertCircle } from 'lucide-react';

interface SignInProps {
  onSignIn: (isAdmin: boolean) => void;
}

export function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your university email address.'); return; }
    if (!email.endsWith('@student.mmu.edu.my') && !email.endsWith('@mmu.edu.my')) {
      setError('Please use your MMU university email address.');
      return;
    }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSignIn(false); }, 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F6F8' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{ background: '#087E8B' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <BookMarked size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>SlotWise MMU</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Campus Resource Booking</p>
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            Reserve. Check in.<br />Get things done.
          </h1>
          <p className="mt-4" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            Book study rooms, equipment, lab spaces, and more - all from one place. Real-time availability, instant confirmation.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              { stat: '200+', label: 'Campus resources' },
              { stat: '4,000+', label: 'Active student users' },
              { stat: '98%', label: 'Booking satisfaction rate' },
            ].map(({ stat, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>{stat}</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          (c) 2026 Multimedia University. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#087E8B' }}>
              <BookMarked size={16} color="white" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#17252A' }}>SlotWise MMU</p>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#17252A' }}>Welcome back</h2>
          <p className="mt-1" style={{ fontSize: '14px', color: '#5E737A' }}>
            Sign in with your MMU university account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg" style={{ background: '#FEE2E2', color: '#D64545' }}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span style={{ fontSize: '13px' }}>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>
                University email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@student.mmu.edu.my"
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#E0E4E8',
                  fontSize: '14px',
                  background: '#fff',
                  '--tw-ring-color': '#087E8B',
                } as CSSProperties}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: '#E0E4E8',
                    fontSize: '14px',
                    background: '#fff',
                    '--tw-ring-color': '#087E8B',
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} style={{ color: '#5E737A' }} /> : <Eye size={16} style={{ color: '#5E737A' }} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#087E8B' }}
                />
                <span style={{ fontSize: '13px', color: '#17252A' }}>Remember me</span>
              </label>
              <button type="button" style={{ fontSize: '13px', color: '#087E8B', fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg transition-opacity focus:outline-none focus:ring-2 mt-1"
              style={{
                background: '#087E8B',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-6 border-t border-border pt-5">
            <p style={{ fontSize: '12px', color: '#5E737A', textAlign: 'center', marginBottom: '10px' }}>
              Quick demo access
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setEmail('ahmad.faris@student.mmu.edu.my'); setPassword('demo1234'); setTimeout(() => onSignIn(false), 200); }}
                className="flex-1 py-2 rounded-lg border transition-colors hover:bg-muted"
                style={{ fontSize: '13px', borderColor: '#E0E4E8', color: '#17252A' }}
              >
                Student Demo
              </button>
              <button
                onClick={() => { setEmail('admin@mmu.edu.my'); setPassword('admin1234'); setTimeout(() => onSignIn(true), 200); }}
                className="flex-1 py-2 rounded-lg border transition-colors hover:bg-muted"
                style={{ fontSize: '13px', borderColor: '#E0E4E8', color: '#17252A' }}
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
