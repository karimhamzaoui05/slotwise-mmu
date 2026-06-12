import type { BookingStatus, ResourceStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus | ResourceStatus;
}

const config: Record<string, { label: string; bg: string; color: string }> = {
  available: { label: 'Available', bg: '#ECFDF5', color: '#16845B' },
  occupied: { label: 'Occupied', bg: '#FEF3C7', color: '#D98C10' },
  maintenance: { label: 'Maintenance', bg: '#FEE2E2', color: '#D64545' },
  confirmed: { label: 'Confirmed', bg: '#EBF7F8', color: '#087E8B' },
  'checked-in': { label: 'Checked In', bg: '#ECFDF5', color: '#16845B' },
  completed: { label: 'Completed', bg: '#F0F2F4', color: '#5E737A' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#D64545' },
  'no-show': { label: 'No-show', bg: '#FEE2E2', color: '#D64545' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status] ?? { label: status, bg: '#F0F2F4', color: '#5E737A' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded"
      style={{ background: c.bg, color: c.color, fontSize: '12px', fontWeight: 500 }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}
