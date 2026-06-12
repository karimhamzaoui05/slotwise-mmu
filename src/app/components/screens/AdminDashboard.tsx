import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookCheck, Users, Clock, TrendingUp, AlertTriangle, PlusCircle, Lock } from 'lucide-react';
import { adminMetrics, utilizationData, bookingTrend, recentActivity, resources } from '../../data/mockData';
import type { Screen } from '../../types';

interface AdminDashboardProps {
  navigate: (screen: Screen) => void;
}

const activityIcons: Record<string, { color: string; bg: string }> = {
  booking: { color: '#16845B', bg: '#ECFDF5' },
  checkin: { color: '#087E8B', bg: '#EBF7F8' },
  cancel: { color: '#D64545', bg: '#FEE2E2' },
  noshow: { color: '#D64545', bg: '#FEE2E2' },
  waitlist: { color: '#D98C10', bg: '#FEF3C7' },
  maintenance: { color: '#5E737A', bg: '#EEF0F3' },
};

export function AdminDashboard({ navigate }: AdminDashboardProps) {
  const maintenanceResource = resources.find(r => r.status === 'maintenance');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-6">
      {/* Maintenance alert */}
      {maintenanceResource && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg border" style={{ background: '#FEF3C7', borderColor: '#FCD34D' }}>
          <AlertTriangle size={17} style={{ color: '#D98C10', marginTop: '1px' }} />
          <div className="flex-1">
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>
              {maintenanceResource.name}
            </span>
            <span style={{ fontSize: '13px', color: '#5E737A' }}> is currently under maintenance. Estimated return: {maintenanceResource.nextAvailable}.</span>
          </div>
          <button onClick={() => navigate('admin-resources')} style={{ fontSize: '13px', color: '#D98C10', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Manage
          </button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: BookCheck, label: 'Bookings Today', value: adminMetrics.bookingsToday, color: '#087E8B', bg: '#EBF7F8', suffix: '' },
          { icon: TrendingUp, label: 'Occupancy Rate', value: adminMetrics.occupancyRate, color: '#16845B', bg: '#ECFDF5', suffix: '%' },
          { icon: Clock, label: 'Pending Check-ins', value: adminMetrics.pendingCheckIns, color: '#D98C10', bg: '#FEF3C7', suffix: '' },
          { icon: Users, label: 'Waitlisted Users', value: adminMetrics.waitlistedUsers, color: '#5E6AD2', bg: '#EEF2FF', suffix: '' },
          { icon: AlertTriangle, label: 'No-shows Today', value: adminMetrics.noShows, color: '#D64545', bg: '#FEE2E2', suffix: '' },
        ].map(({ icon: Icon, label, value, color, bg, suffix }) => (
          <div key={label} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontSize: '11px', color: '#5E737A' }}>{label}</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#17252A' }}>{value}{suffix}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Utilization chart */}
        <div className="bg-card rounded-lg border border-border p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>Resource utilization (today)</h3>
            <span style={{ fontSize: '12px', color: '#5E737A' }}>% occupied</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={utilizationData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5E737A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5E737A' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ border: '1px solid #E0E4E8', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`${v}%`, 'Utilization']}
              />
              <Bar dataKey="utilization" fill="#087E8B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '12px' }}>Quick actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('admin-resources')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-muted transition-colors text-left"
              style={{ borderColor: '#E0E4E8', fontSize: '13px', color: '#17252A' }}
            >
              <PlusCircle size={16} style={{ color: '#087E8B' }} />
              Add new resource
            </button>
            <button
              onClick={() => navigate('admin-resources')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-muted transition-colors text-left"
              style={{ borderColor: '#E0E4E8', fontSize: '13px', color: '#17252A' }}
            >
              <Lock size={16} style={{ color: '#D98C10' }} />
              Block a time slot
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-muted transition-colors text-left"
              style={{ borderColor: '#E0E4E8', fontSize: '13px', color: '#17252A' }}
            >
              <AlertTriangle size={16} style={{ color: '#D64545' }} />
              Create maintenance block
            </button>
          </div>

          {/* Today's booking trend mini chart */}
          <div className="mt-5">
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#17252A', marginBottom: '8px' }}>Bookings this week</p>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={bookingTrend}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#087E8B" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#087E8B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5E737A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '1px solid #E0E4E8', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="bookings" stroke="#087E8B" fill="url(#grad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '16px' }}>Today's schedule (12 Jun)</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Time header */}
            <div className="flex mb-2">
              <div style={{ width: '160px', fontSize: '11px', color: '#5E737A', fontWeight: 600 }}>Resource</div>
              {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                <div key={t} className="flex-1 text-center" style={{ fontSize: '10px', color: '#5E737A' }}>{t}</div>
              ))}
            </div>
            {[
              { name: 'Study Pod A-03', bookings: [{ start: 0, end: 2, user: 'Ahmad F.', color: '#EBF7F8', border: '#087E8B' }, { start: 5, end: 7, user: 'Priya N.', color: '#EBF7F8', border: '#087E8B' }] },
              { name: 'Collab Room CR-2', bookings: [{ start: 2, end: 5, user: 'Team Alpha', color: '#ECFDF5', border: '#16845B' }, { start: 7, end: 10, user: 'Study Grp', color: '#ECFDF5', border: '#16845B' }] },
              { name: 'Discussion Pod D-11', bookings: [{ start: 1, end: 3, user: 'Marcus L.', color: '#EBF7F8', border: '#087E8B' }] },
            ].map(row => (
              <div key={row.name} className="flex mb-2 items-center h-9">
                <div style={{ width: '160px', fontSize: '12px', color: '#17252A', fontWeight: 500, paddingRight: '12px' }} className="truncate">
                  {row.name}
                </div>
                <div className="flex-1 relative h-full rounded" style={{ background: '#F4F6F8' }}>
                  {row.bookings.map((b, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 rounded flex items-center justify-center"
                      style={{
                        left: `${(b.start / 11) * 100}%`,
                        width: `${((b.end - b.start) / 11) * 100}%`,
                        background: b.color,
                        border: `1px solid ${b.border}`,
                        fontSize: '10px',
                        color: b.border,
                        fontWeight: 500,
                        overflow: 'hidden',
                      }}
                    >
                      {b.user}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#17252A', marginBottom: '16px' }}>Recent activity</h3>
        <div className="space-y-0">
          {recentActivity.map((a, i) => {
            const config = activityIcons[a.type] ?? { color: '#5E737A', bg: '#EEF0F3' };
            return (
              <div key={a.id} className={`flex items-center gap-4 py-3 ${i < recentActivity.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: config.bg, fontSize: '12px', fontWeight: 700, color: config.color }}>
                  {a.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '13px', color: '#17252A' }}>
                    <span style={{ fontWeight: 500 }}>{a.user}</span>
                    <span style={{ color: '#5E737A' }}> - {a.action}</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#5E737A' }}>{a.resource}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#5E737A', whiteSpace: 'nowrap' }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
