import { MapPin, Users, Wifi, Monitor, Zap, Wind, Camera, Speaker, Wrench, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Resource } from '../types';

const amenityIcons: Record<string, { icon: LucideIcon; label: string }> = {
  wifi: { icon: Wifi, label: 'Wi-Fi' },
  whiteboard: { icon: Monitor, label: 'Whiteboard' },
  power: { icon: Zap, label: 'Power Outlets' },
  aircon: { icon: Wind, label: 'Air-conditioned' },
  projector: { icon: Monitor, label: 'Projector' },
  'video-conf': { icon: Camera, label: 'Video Conference' },
  'tv-screen': { icon: Monitor, label: 'TV Screen' },
  'carry-bag': { icon: Speaker, label: 'Carry Bag' },
  tripod: { icon: Camera, label: 'Tripod' },
  tools: { icon: Wrench, label: 'Tools' },
};

const typeLabels: Record<string, string> = {
  'study-room': 'Study Room',
  'discussion-pod': 'Discussion Pod',
  lab: 'Lab',
  equipment: 'Equipment',
  'project-space': 'Project Space',
};

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
  view?: 'grid' | 'list';
}

export function ResourceCard({ resource, onView, view = 'grid' }: ResourceCardProps) {
  if (view === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border flex items-center gap-4 p-4 hover:shadow-sm transition-shadow">
        <img
          src={resource.image}
          alt={resource.name}
          className="w-20 h-16 rounded object-cover shrink-0"
          style={{ background: '#EEF0F3' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="truncate" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>{resource.name}</h3>
                <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#EEF0F3', color: '#5E737A' }}>{typeLabels[resource.type]}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} style={{ color: '#5E737A' }} />
                <span style={{ fontSize: '12px', color: '#5E737A' }}>{resource.building}, {resource.floor}</span>
              </div>
            </div>
            <StatusBadge status={resource.status} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Users size={12} style={{ color: '#5E737A' }} />
              <span style={{ fontSize: '12px', color: '#5E737A' }}>Up to {resource.capacity}</span>
            </div>
            {resource.status !== 'maintenance' && (
              <span style={{ fontSize: '12px', color: '#16845B' }}>Next: {resource.nextAvailable}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onView(resource)}
          className="shrink-0 px-4 py-2 rounded-lg transition-colors hover:opacity-90 focus:outline-none focus:ring-2"
          style={{ background: '#087E8B', color: '#fff', fontSize: '13px', fontWeight: 500 }}
        >
          View
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-40 bg-muted">
        <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={resource.status} />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate" style={{ fontSize: '14px', fontWeight: 600, color: '#17252A' }}>{resource.name}</h3>
            <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#EEF0F3', color: '#5E737A' }}>{typeLabels[resource.type]}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <MapPin size={12} style={{ color: '#5E737A' }} />
          <span className="truncate" style={{ fontSize: '12px', color: '#5E737A' }}>{resource.building}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <Users size={12} style={{ color: '#5E737A' }} />
            <span style={{ fontSize: '12px', color: '#5E737A' }}>Up to {resource.capacity}</span>
          </div>
          <span style={{ fontSize: '12px', color: '#5E737A' }}>{resource.floor}</span>
        </div>

        {/* Amenity icons */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {resource.amenities.slice(0, 4).map((a) => {
            const am = amenityIcons[a];
            if (!am) return null;
            const Icon = am.icon;
            return (
              <span key={a} title={am.label} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#EEF0F3' }}>
                <Icon size={12} />
              </span>
            );
          })}
          {resource.amenities.length > 4 && (
            <span style={{ fontSize: '11px', color: '#5E737A' }}>+{resource.amenities.length - 4}</span>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          {resource.status !== 'maintenance' ? (
            <span style={{ fontSize: '12px', color: '#16845B', fontWeight: 500 }}>Next: {resource.nextAvailable}</span>
          ) : (
            <span style={{ fontSize: '12px', color: '#D98C10', fontWeight: 500 }}>Unavailable until {resource.nextAvailable}</span>
          )}
          <button
            onClick={() => onView(resource)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:opacity-90"
            style={{ background: '#087E8B', color: '#fff', fontSize: '12px', fontWeight: 500 }}
          >
            <Eye size={13} />
            View
          </button>
        </div>
      </div>
    </div>
  );
}
