import { useState } from 'react';
import { Search, Plus, Edit2, X, ChevronDown, AlertTriangle, CheckCircle, Upload, Wrench } from 'lucide-react';
import type { CSSProperties } from 'react';
import { resources } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import type { Resource } from '../../types';

const typeLabels: Record<string, string> = {
  'study-room': 'Study Room',
  'discussion-pod': 'Discussion Pod',
  'lab': 'Lab',
  'equipment': 'Equipment',
  'project-space': 'Project Space',
};

export function AdminResources() {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [maintenanceDialog, setMaintenanceDialog] = useState<Resource | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Resource | null>(null);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'study-room', building: '', floor: '', capacity: '', active: true, description: '' });

  const filtered = resources.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setEditResource(null);
    setFormData({ name: '', type: 'study-room', building: '', floor: '', capacity: '', active: true, description: '' });
    setDrawerOpen(true);
  };

  const openEdit = (r: Resource) => {
    setEditResource(r);
    setFormData({ name: r.name, type: r.type, building: r.building, floor: r.floor, capacity: String(r.capacity), active: r.status !== 'maintenance', description: r.description });
    setDrawerOpen(true);
  };

  const saveResource = () => {
    setDrawerOpen(false);
    showToast(editResource ? `${formData.name} updated successfully.` : `${formData.name} added successfully.`);
  };

  const saveMaintenance = () => {
    setMaintenanceDialog(null);
    showToast(`Maintenance block created for ${maintenanceDialog?.name}.`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg" style={{ background: '#17252A', color: '#fff', fontSize: '13px' }}>
          <CheckCircle size={15} style={{ color: '#16845B' }} />
          {toast}
        </div>
      )}

      {/* Maintenance block dialog */}
      {maintenanceDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>Create maintenance block</h3>
            <p className="mt-1.5" style={{ fontSize: '13px', color: '#5E737A' }}>
              Block time for <strong>{maintenanceDialog.name}</strong>
            </p>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>Start date</label>
                  <input type="date" defaultValue="2026-06-12" className="mt-1 w-full px-3 py-2 rounded-lg border" style={{ fontSize: '13px', borderColor: '#E0E4E8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>End date</label>
                  <input type="date" defaultValue="2026-06-14" className="mt-1 w-full px-3 py-2 rounded-lg border" style={{ fontSize: '13px', borderColor: '#E0E4E8' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#17252A' }}>Reason</label>
                <input type="text" placeholder="e.g. Equipment repair and calibration" className="mt-1 w-full px-3 py-2 rounded-lg border" style={{ fontSize: '13px', borderColor: '#E0E4E8' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setMaintenanceDialog(null)} className="flex-1 py-2 rounded-lg border hover:bg-muted" style={{ borderColor: '#E0E4E8', fontSize: '14px', color: '#17252A' }}>Cancel</button>
              <button onClick={saveMaintenance} className="flex-1 py-2 rounded-lg hover:opacity-90" style={{ background: '#D98C10', color: '#fff', fontSize: '14px' }}>Create block</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="relative bg-card w-full max-w-md h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>
                {editResource ? 'Edit resource' : 'Add new resource'}
              </h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded hover:bg-muted">
                <X size={18} style={{ color: '#5E737A' }} />
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Resource name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Study Pod A-04"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as CSSProperties}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of the resource..."
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Type *</label>
                  <div className="relative mt-1.5">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(f => ({ ...f, type: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                    >
                      {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5E737A' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(f => ({ ...f, capacity: e.target.value }))}
                    placeholder="e.g. 4"
                    min={1}
                    className="mt-1.5 w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Building *</label>
                <input
                  value={formData.building}
                  onChange={(e) => setFormData(f => ({ ...f, building: e.target.value }))}
                  placeholder="e.g. Faculty of Computing and Informatics"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Floor</label>
                <input
                  value={formData.floor}
                  onChange={(e) => setFormData(f => ({ ...f, floor: e.target.value }))}
                  placeholder="e.g. Level 3"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E0E4E8', fontSize: '14px', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
                />
              </div>

              {/* Image upload */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Resource image</label>
                <div className="mt-1.5 border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted transition-colors" style={{ borderColor: '#E0E4E8' }}>
                  <Upload size={24} style={{ color: '#5E737A' }} />
                  <p style={{ fontSize: '13px', color: '#5E737A' }}>Drag & drop or click to upload</p>
                  <p style={{ fontSize: '11px', color: '#5E737A' }}>JPG, PNG, WebP | Max 5 MB</p>
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>Active</p>
                  <p style={{ fontSize: '12px', color: '#5E737A' }}>Visible and bookable by students</p>
                </div>
                <button
                  onClick={() => setFormData(f => ({ ...f, active: !f.active }))}
                  className="relative w-10 h-6 rounded-full transition-colors"
                  style={{ background: formData.active ? '#087E8B' : '#B0BEC5' }}
                  role="switch"
                  aria-checked={formData.active}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: formData.active ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setDrawerOpen(false)} className="flex-1 py-2.5 rounded-lg border hover:bg-muted" style={{ borderColor: '#E0E4E8', fontSize: '14px', color: '#17252A' }}>
                Cancel
              </button>
              <button
                onClick={saveResource}
                disabled={!formData.name || !formData.building}
                className="flex-1 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-40"
                style={{ background: '#087E8B', color: '#fff', fontSize: '14px' }}
              >
                {editResource ? 'Save changes' : 'Add resource'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>Resources ({filtered.length})</h2>
          <p style={{ fontSize: '13px', color: '#5E737A' }}>Manage campus booking resources</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: '#087E8B', color: '#fff', fontSize: '13px', fontWeight: 500 }}
        >
          <Plus size={16} />Add resource
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5E737A' }} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
          style={{ borderColor: '#E0E4E8', fontSize: '14px', background: '#fff', '--tw-ring-color': '#087E8B' } as React.CSSProperties}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr style={{ background: '#F4F6F8', borderBottom: '1px solid #E0E4E8' }}>
                {['Resource', 'Type', 'Location', 'Capacity', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: '11px', fontWeight: 600, color: '#5E737A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded object-cover" />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#17252A' }}>{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#EEF0F3', color: '#5E737A' }}>{typeLabels[r.type]}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p style={{ fontSize: '12px', color: '#17252A' }}>{r.building}</p>
                    <p style={{ fontSize: '11px', color: '#5E737A' }}>{r.floor}</p>
                  </td>
                  <td className="px-4 py-3.5" style={{ fontSize: '13px', color: '#17252A' }}>{r.capacity}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded hover:bg-muted"
                        title="Edit resource"
                      >
                        <Edit2 size={14} style={{ color: '#5E737A' }} />
                      </button>
                      <button
                        onClick={() => setMaintenanceDialog(r)}
                        className="p-1.5 rounded hover:bg-muted"
                        title="Add maintenance block"
                      >
                        <Wrench size={14} style={{ color: '#D98C10' }} />
                      </button>
                      <button
                        onClick={() => setDeleteDialog(r)}
                        className="p-1.5 rounded hover:bg-red-50"
                        title="Deactivate resource"
                      >
                        <X size={14} style={{ color: '#D64545' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete/deactivate confirm */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-sm w-full p-6">
            <AlertTriangle size={24} style={{ color: '#D64545' }} className="mb-3" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#17252A' }}>Deactivate {deleteDialog.name}?</h3>
            <p className="mt-2" style={{ fontSize: '13px', color: '#5E737A' }}>
              This will make the resource invisible to students and cancel all future bookings. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteDialog(null)} className="flex-1 py-2 rounded-lg border hover:bg-muted" style={{ borderColor: '#E0E4E8', fontSize: '14px', color: '#17252A' }}>Cancel</button>
              <button onClick={() => { setDeleteDialog(null); showToast(`${deleteDialog.name} deactivated.`); }} className="flex-1 py-2 rounded-lg hover:opacity-90" style={{ background: '#D64545', color: '#fff', fontSize: '14px' }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
