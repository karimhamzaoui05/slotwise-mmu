import { useState } from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, List, ChevronDown } from 'lucide-react';
import type { CSSProperties } from 'react';
import { resources } from '../../data/mockData';
import { ResourceCard } from '../ResourceCard';
import type { Resource, Screen } from '../../types';

interface ExploreProps {
  navigate: (screen: Screen) => void;
  onSelectResource: (r: Resource) => void;
}

const typeOptions = ['All types', 'Study Room', 'Discussion Pod', 'Lab', 'Equipment', 'Project Space'];
const buildingOptions = ['All buildings', 'Faculty of Computing and Informatics', 'Library Block', 'Engineering Block', 'Student Services Center', 'Media Resource Center', 'Innovation Hub'];
const capacityOptions = ['Any capacity', '1 person', '2-4 people', '5-10 people', '10+ people'];
const sortOptions = ['Availability', 'Capacity (High-Low)', 'Capacity (Low-High)', 'Name A-Z'];

const typeMap: Record<string, string> = {
  'Study Room': 'study-room',
  'Discussion Pod': 'discussion-pod',
  'Lab': 'lab',
  'Equipment': 'equipment',
  'Project Space': 'project-space',
};

export function ExploreResources({ navigate, onSelectResource }: ExploreProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All types');
  const [building, setBuilding] = useState('All buildings');
  const [capacity, setCapacity] = useState('Any capacity');
  const [sort, setSort] = useState('Availability');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [
    type !== 'All types' ? type : null,
    building !== 'All buildings' ? building.split(' ')[0] + '...' : null,
    capacity !== 'Any capacity' ? capacity : null,
  ].filter(Boolean) as string[];

  const filtered = resources.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.building.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All types' || r.type === typeMap[type];
    const matchBuilding = building === 'All buildings' || r.building === building;
    const matchCap =
      capacity === 'Any capacity' ||
      (capacity === '1 person' && r.capacity === 1) ||
      (capacity === '2-4 people' && r.capacity >= 2 && r.capacity <= 4) ||
      (capacity === '5-10 people' && r.capacity >= 5 && r.capacity <= 10) ||
      (capacity === '10+ people' && r.capacity > 10);
    return matchSearch && matchType && matchBuilding && matchCap;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Availability') return a.status === 'available' ? -1 : 1;
    if (sort === 'Capacity (High-Low)') return b.capacity - a.capacity;
    if (sort === 'Capacity (Low-High)') return a.capacity - b.capacity;
    if (sort === 'Name A-Z') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5E737A' }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources, buildings..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E0E4E8', fontSize: '14px', background: '#fff', '--tw-ring-color': '#087E8B' } as CSSProperties}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors"
          style={{ borderColor: showFilters ? '#087E8B' : '#E0E4E8', background: showFilters ? '#EBF7F8' : '#fff', color: showFilters ? '#087E8B' : '#17252A', fontSize: '14px' }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#087E8B', color: '#fff' }}>
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card rounded-lg border border-border p-4 mb-4 grid sm:grid-cols-4 gap-3">
          {[
            { label: 'Type', value: type, options: typeOptions, set: setType },
            { label: 'Building', value: building, options: buildingOptions, set: setBuilding },
            { label: 'Capacity', value: capacity, options: capacityOptions, set: setCapacity },
          ].map(({ label, value, options, set }) => (
            <div key={label}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              <div className="relative mt-1.5">
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E0E4E8', fontSize: '13px', background: '#fff', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5E737A' }} />
              </div>
            </div>
          ))}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort by</label>
            <div className="relative mt-1.5">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#E0E4E8', fontSize: '13px', background: '#fff', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
              >
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5E737A' }} />
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span style={{ fontSize: '12px', color: '#5E737A' }}>Active filters:</span>
          {type !== 'All types' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border" style={{ fontSize: '12px', borderColor: '#087E8B', color: '#087E8B', background: '#EBF7F8' }}>
              {type}
              <button onClick={() => setType('All types')} className="hover:opacity-70"><X size={11} /></button>
            </span>
          )}
          {building !== 'All buildings' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border" style={{ fontSize: '12px', borderColor: '#087E8B', color: '#087E8B', background: '#EBF7F8' }}>
              {building.split(' ').slice(0, 2).join(' ')}...
              <button onClick={() => setBuilding('All buildings')} className="hover:opacity-70"><X size={11} /></button>
            </span>
          )}
          {capacity !== 'Any capacity' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border" style={{ fontSize: '12px', borderColor: '#087E8B', color: '#087E8B', background: '#EBF7F8' }}>
              {capacity}
              <button onClick={() => setCapacity('Any capacity')} className="hover:opacity-70"><X size={11} /></button>
            </span>
          )}
          <button
            onClick={() => { setType('All types'); setBuilding('All buildings'); setCapacity('Any capacity'); }}
            style={{ fontSize: '12px', color: '#D64545' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: '13px', color: '#5E737A' }}>
          {sorted.length} resource{sorted.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border" style={{ background: '#fff' }}>
          <button
            onClick={() => setView('grid')}
            className="p-1.5 rounded"
            style={{ background: view === 'grid' ? '#EBF7F8' : 'transparent', color: view === 'grid' ? '#087E8B' : '#5E737A' }}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className="p-1.5 rounded"
            style={{ background: view === 'list' ? '#EBF7F8' : 'transparent', color: view === 'list' ? '#087E8B' : '#5E737A' }}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-card rounded-lg border border-border py-16 flex flex-col items-center text-center">
          <Search size={36} style={{ color: '#5E737A' }} />
          <p className="mt-3" style={{ fontSize: '15px', fontWeight: 500, color: '#17252A' }}>No resources found</p>
          <p className="mt-1" style={{ fontSize: '13px', color: '#5E737A' }}>Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearch(''); setType('All types'); setBuilding('All buildings'); setCapacity('Any capacity'); }}
            className="mt-4 px-4 py-2 rounded-lg text-sm hover:opacity-90"
            style={{ background: '#087E8B', color: '#fff' }}
          >
            Reset filters
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((r) => (
            <ResourceCard key={r.id} resource={r} onView={onSelectResource} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((r) => (
            <ResourceCard key={r.id} resource={r} onView={onSelectResource} view="list" />
          ))}
        </div>
      )}
    </div>
  );
}
