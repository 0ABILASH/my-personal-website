import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Pencil, Trash2, Plus, Eye, ArrowUp, ArrowDown, RefreshCw, Upload, GripVertical } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { useAdminData } from '../context/AdminDataContext'
import { useToast } from '../context/ToastContext'
import Modal, { ConfirmDialog } from '../components/Modal'
import { Button, Field, TextInput, Select, TextArea, Chip, LoadingState, ErrorState, EmptyState, PageHeader, SearchInput } from '../components/ui'
import { toDriveThumb, isDriveLink } from '../utils'
import { logActivity } from '../utils/activity'

const TYPE_META = {
  visited: { label: 'Visited', tone: 'green' },
  small: { label: 'Favorites', tone: 'teal' },
  current: { label: 'Current', tone: 'blue' },
  '': { label: 'Place', tone: 'gray' },
}

function PlacesModal({ open, onClose, onSaved, place }) {
  const toast = useToast()
  const editing = !!place
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    if (!open) return
    setForm(
      place
        ? { ...place }
        : { city: '', country: '', lat: '', lng: '', emoji: '📍', date: '', type: 'visited', image: '', description: '' }
    )
    setError('')
  }

  useEffect(() => { reset() }, [open, place])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.city || !form.city.trim()) {
      setError('City is required.')
      return
    }
    if (form.lat === '' || form.lng === '') {
      setError('Latitude and longitude are required.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const payload = {
        city: form.city,
        country: form.country || '',
        lat: Number(form.lat),
        lng: Number(form.lng),
        emoji: form.emoji || '📍',
        date: form.date || '',
        type: form.type || '',
        image: form.image || '',
        description: form.description || '',
      }
      if (editing) {
        await adminApi.updatePlace(place.id, payload)
        logActivity('Updated place "' + payload.city + '"')
      } else {
        await adminApi.createPlace(payload)
        logActivity('Added place "' + payload.city + '"')
      }
      toast.success(editing ? 'Place updated.' : 'Place added.')
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Place' : 'Add Place'} footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={handleSave} loading={busy}>{editing ? 'Save Changes' : 'Add Place'}</Button>
      </>
    }>
      <div className="space-y-5">
        {error && (
          <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">{error}</p>
        )}

        <div className="grid grid-cols-[56px_1fr] gap-4">
          <Field label="Emoji">
            <TextInput value={form.emoji} onChange={(e) => set('emoji', e.target.value)} className="!text-center !text-lg" maxLength={8} />
          </Field>
          <Field label="City" required>
            <TextInput value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Tokyo" />
          </Field>
        </div>

        <Field label="Country">
          <TextInput value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Japan" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" required>
            <TextInput value={form.lat} onChange={(e) => set('lat', e.target.value)} placeholder="35.6762" inputMode="decimal" />
          </Field>
          <Field label="Longitude" required>
            <TextInput value={form.lng} onChange={(e) => set('lng', e.target.value)} placeholder="139.6503" inputMode="decimal" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {Object.entries(TYPE_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <TextInput type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
        </div>

        <Field label="Image URL" hint="Google Drive link or direct image URL. Google Drive links get a thumbnail automatically.">
          <div className="flex gap-2">
            <TextInput value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://drive.google.com/file/d/..." />
            <span className="w-10 h-10 rounded-xl bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary shrink-0">
              <Upload size={14} />
            </span>
          </div>
          {form.image && (
            <div className="mt-2 rounded-xl overflow-hidden border border-border w-20 h-14">
              <img
                src={toDriveThumb(form.image) || form.image}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
        </Field>

        <Field label="Description">
          <TextArea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="A short note about this place..." />
        </Field>
      </div>
    </Modal>
  )
}

export default function PlacesAdmin() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, loading, reload } = useAdminData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditing(null)
      setModalOpen(true)
      searchParams.delete('new')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const placesRes = data.places
  if (placesRes && !placesRes.ok) return <ErrorState message={placesRes.error} onRetry={reload} />
  if (loading && !placesRes) return <LoadingState label="Loading places..." />

  const places = placesRes ? placesRes.value : []

  const persistOrder = async (orderedFull) => {
    try {
      await adminApi.reorderPlaces(orderedFull.map((p) => p.id))
      logActivity('Reordered places')
      toast.success('Order updated.')
      reload()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const move = async (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= filtered.length) return
    const fromIdx = places.findIndex((p) => p.id === filtered[index].id)
    const toIdx = places.findIndex((p) => p.id === filtered[target].id)
    if (fromIdx < 0 || toIdx < 0) return
    const full = places.slice()
    const tmp = full[fromIdx]
    full[fromIdx] = full[toIdx]
    full[toIdx] = tmp
    await persistOrder(full)
  }

  const onDragStart = (e, index) => {
    if (filter !== 'all' || query) {
      e.preventDefault()
      toast.info('Clear search and filters to drag reorder')
      return
    }
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = async (e, targetIndex) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === targetIndex) { setDragIndex(null); return }
    const draggedId = filtered[dragIndex].id
    const targetId = filtered[targetIndex].id
    const full = places.slice()
    const fromIdx = full.findIndex((p) => p.id === draggedId)
    if (fromIdx < 0) { setDragIndex(null); return }
    const item = full.splice(fromIdx, 1)[0]
    const toIdx = full.findIndex((p) => p.id === targetId)
    full.splice(toIdx < 0 ? full.length : toIdx, 0, item)
    setDragIndex(null)
    await persistOrder(full)
  }

  const openNew = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await adminApi.deletePlace(deleting.id)
      logActivity('Deleted place "' + deleting.city + '"')
      toast.success('Place deleted.')
      setDeleting(null)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteBusy(false)
    }
  }

  const q = query.toLowerCase()
  const filtered = places.filter((p) => {
    if (filter !== 'all' && String(p.type || '').trim() !== filter) return false
    if (!q) return true
    return [p.city, p.country, p.description, p.emoji].filter(Boolean).some((s) => String(s).toLowerCase().includes(q))
  })

  return (
    <>
      <PageHeader
        title="Travel Logs"
        subtitle={places.length + ' places on your map — drag the handle to reorder'}
        actions={
          <>
            <Button variant="ghost" onClick={reload} disabled={loading} title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={openNew}>
              <Plus size={14} />
              Add Place
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search places..." className="flex-1" />
        <div className="flex gap-1.5">
          {[['all', 'All'], ['visited', 'Visited'], ['small', 'Favorites'], ['current', 'Current'], ['', 'Place']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={
                'px-3 py-2 rounded-xl text-[12px] font-semibold transition-all border cursor-pointer ' +
                (filter === k ? 'bg-accent-soft text-accent border-accent/20' : 'bg-surface border-border text-text-tertiary hover:text-text')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MapPin size={18} />} title="No places found" hint={query || filter !== 'all' ? 'Try changing your search or filter.' : 'Add your first place to get started.'} />
      ) : (
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-text-quaternary uppercase tracking-[0.16em] font-mono">
                  <th className="px-4 py-3 w-16"></th>
                  <th className="px-2 py-3">Place</th>
                  <th className="px-2 py-3 hidden sm:table-cell">Coordinates</th>
                  <th className="px-2 py-3 hidden md:table-cell">Date</th>
                  <th className="px-2 py-3">Type</th>
                  <th className="px-2 py-3 hidden md:table-cell">Image</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const t = TYPE_META[String(p.type || '').trim()] || TYPE_META['']
                  const idx = filtered.indexOf(p)
                  const isDragging = dragIndex === idx
                  return (
                    <tr key={p.id} className={'hover:bg-surface transition-colors ' + (isDragging ? 'bg-accent-soft/40' : '')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span
                            draggable
                            onDragStart={(e) => onDragStart(e, idx)}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, idx)}
                            title="Drag to reorder"
                            className="w-6 h-6 rounded text-text-quaternary hover:text-accent flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
                          >
                            <GripVertical size={13} />
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              title="Move up"
                              disabled={idx === 0}
                              onClick={() => move(idx, -1)}
                              className="w-6 h-5 rounded text-text-quaternary hover:text-accent disabled:opacity-30 disabled:cursor-default flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              title="Move down"
                              disabled={idx === filtered.length - 1}
                              onClick={() => move(idx, 1)}
                              className="w-6 h-5 rounded text-text-quaternary hover:text-accent disabled:opacity-30 disabled:cursor-default flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2.5 min-w-[160px]">
                          <span className="text-lg w-7 text-center shrink-0">{p.emoji || '📍'}</span>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold truncate">{p.city}</div>
                            {p.country && <div className="text-[10px] text-text-quaternary font-mono truncate">{p.country}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 hidden sm:table-cell">
                        <span className="text-[11px] text-text-tertiary font-mono">
                          {Number(p.lat).toFixed ? Number(p.lat).toFixed(4) + ', ' + Number(p.lng).toFixed(4) : p.lat + ', ' + p.lng}
                        </span>
                      </td>
                      <td className="px-2 py-3 hidden md:table-cell text-[11px] text-text-tertiary font-mono">{p.date || '—'}</td>
                      <td className="px-2 py-3">
                        <Chip tone={t.tone}>{t.label}</Chip>
                      </td>
                      <td className="px-2 py-3 hidden md:table-cell">
                        {p.image ? (
                          <span className="inline-block w-10 h-7 rounded-md overflow-hidden border border-border align-middle">
                            <img src={isDriveLink(p.image) ? toDriveThumb(p.image) : p.image} alt="" className="w-full h-full object-cover" />
                          </span>
                        ) : (
                          <span className="text-text-quaternary">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View on map"
                            onClick={() => window.open('/travel-log?focus=' + encodeURIComponent(p.city), '_blank')}
                            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-accent hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openEdit(p)}
                            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-accent hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleting(p)}
                            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PlacesModal open={modalOpen} onClose={closeModal} onSaved={reload} place={editing} />
      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete place"
        message={'Delete "' + (deleting ? deleting.city : '') + '" from your map? This cannot be undone.'}
      />
    </>
  )
}
