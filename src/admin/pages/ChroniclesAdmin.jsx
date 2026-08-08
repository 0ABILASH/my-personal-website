import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PenLine, Pencil, Trash2, Plus, Eye, ExternalLink, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { useAdminData } from '../context/AdminDataContext'
import { useToast } from '../context/ToastContext'
import Modal, { ConfirmDialog } from '../components/Modal'
import RichEditor from '../components/RichEditor'
import { Button, Field, TextInput, Select, Chip, LoadingState, ErrorState, EmptyState, PageHeader, SearchInput } from '../components/ui'
import { toDriveThumb, isDriveLink } from '../utils'
import { logActivity } from '../utils/activity'

const STATUS_META = {
  published: { label: 'Published', tone: 'green' },
  draft: { label: 'Draft', tone: 'yellow' },
}

// Tag values that the public Blogs page actually filters/colours by.
const CATEGORY_OPTIONS = ['Experiance', 'Voyage', 'update']

function tagList(c) {
  if (Array.isArray(c.tags)) return c.tags.map((t) => String(t).trim()).filter(Boolean)
  return String(c.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function ChronicleModal({ open, onClose, onSaved, chronicle }) {
  const toast = useToast()
  const editing = !!chronicle
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(
        chronicle
          ? {
              ...chronicle,
              tags: Array.isArray(chronicle.tags) ? chronicle.tags.join(', ') : String(chronicle.tags || ''),
            }
          : {
              title: '', excerpt: '', category: 'Experiance', location: '', tags: '', status: 'draft',
              date: new Date().toISOString().slice(0, 10), cover: '', audioTitle: '', audioSrc: '', content: '',
            }
      )
      setError('')
    }
  }, [open, chronicle])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title || !form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.content || !form.content.trim() || form.content.trim() === '<br>') {
      setError('Content is required.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt || '',
        category: form.category || 'Experiance',
        location: form.location || '',
        tags: String(form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status || 'draft',
        date: form.date || '',
        cover: form.cover || '',
        audioTitle: form.audioTitle || '',
        audioSrc: form.audioSrc || '',
        content: form.content,
      }
      if (editing) {
        await adminApi.updateChronicle(chronicle.id, payload)
        logActivity('Updated chronicle "' + payload.title + '"')
      } else {
        await adminApi.createChronicle(payload)
        logActivity('Created chronicle "' + payload.title + '"')
      }
      toast.success(editing ? 'Chronicle updated.' : 'Chronicle created.')
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Chronicle' : 'New Chronicle'} maxWidth="max-w-3xl" footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={handleSave} loading={busy}>{editing ? 'Save Changes' : 'Publish Draft'}</Button>
      </>
    }>
      <div className="space-y-4">
        {error && (
          <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">{error}</p>
        )}

        <Field label="Title" required>
          <TextInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Two weeks in Japan" autoFocus />
        </Field>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Excerpt">
            <TextInput value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="A short summary shown on the blogs page" />
          </Field>
          <Field label="Location">
            <TextInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Kyoto, Japan" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Category" hint="Shown as the tag on the public Blogs page">
            <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
        </div>

        <Field label="Date">
          <TextInput type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>

        <Field label="Tags" hint="Comma separated — e.g. japan, food, cities">
          <TextInput value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="japan, food, cities" />
        </Field>

        <Field label="Cover Image URL">
          <TextInput value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://drive.google.com/file/d/..." />
          {form.cover && (
            <div className="mt-2 rounded-xl overflow-hidden border border-border h-20 w-32">
              <img
                src={isDriveLink(form.cover) ? toDriveThumb(form.cover) : form.cover}
                alt="cover preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
        </Field>

        <Field label="Background Song Title">
          <TextInput value={form.audioTitle} onChange={(e) => set('audioTitle', e.target.value)} placeholder="Kanne Kalaimaane - Flute" />
        </Field>

        <Field label="Background Song URL" hint="Optional audio file played in the blog reader. Leave empty for no audio.">
          <TextInput value={form.audioSrc} onChange={(e) => set('audioSrc', e.target.value)} placeholder="https://example.com/song.mp3" />
        </Field>

        <Field label="Content" required>
          <RichEditor value={form.content} onChange={(html) => set('content', html)} placeholder="Write your Chronicle here..." />
        </Field>
      </div>
    </Modal>
  )
}

export default function ChroniclesAdmin() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, loading, reload } = useAdminData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditing(null)
      setModalOpen(true)
      searchParams.delete('new')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const cRes = data.chronicles
  if (cRes && !cRes.ok) return <ErrorState message={cRes.error} onRetry={reload} />
  if (loading && !cRes) return <LoadingState label="Loading chronicles..." />
  const chronicles = cRes ? cRes.value : []

  const openEdit = (c) => { setEditing(c); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await adminApi.deleteChronicle(deleting.id)
      logActivity('Deleted chronicle "' + deleting.title + '"')
      toast.success('Chronicle deleted.')
      setDeleting(null)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteBusy(false)
    }
  }

  const q = query.toLowerCase()
  const filtered = chronicles.filter((c) => {
    if (filter !== 'all' && String(c.status || '').trim() !== filter) return false
    if (!q) return true
    return [c.title, c.category, tagList(c).join(' ')].filter(Boolean).some((s) => String(s).toLowerCase().includes(q))
  })

  return (
    <>
      <PageHeader
        title="Blogs"
        subtitle="Write and manage blog posts published to your site."
        actions={
          <>
            <Button variant="ghost" onClick={reload} disabled={loading} title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
              <Plus size={14} />
              New Blog
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search chronicles..." className="flex-1" />
        <div className="flex gap-1.5">
          {[['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']].map(([k, label]) => (
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

      {loading ? (
        <LoadingState label="Loading chronicles..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<PenLine size={18} />} title="No chronicles found" hint={query || filter !== 'all' ? 'Try changing your search or filter.' : 'Write your first chronicle.'} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((c) => {
            const s = STATUS_META[c.status] || STATUS_META.draft
            return (
              <div key={c.id} className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden group">
                <div className="h-28 bg-bg-subtle overflow-hidden relative">
                  {c.cover ? (
                    <img
                      src={isDriveLink(c.cover) ? toDriveThumb(c.cover) : c.cover}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-quaternary">
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Chip tone={s.tone}>{s.label}</Chip>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-text-quaternary mb-1">
                    {c.date && <span>{c.date}</span>}
                    {c.category && <span>· {c.category}</span>}
                  </div>
                  <div className="text-[14px] font-bold tracking-tight truncate mb-1.5">{c.title || 'Untitled'}</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tagList(c).slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-subtle border border-border text-text-tertiary">#{String(t).trim()}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-quaternary font-mono truncate">{c.excerpt || c.category || ''}</span>
                    <div className="flex items-center gap-1">
                      {c.status === 'published' && (
                        <button
                          title="View on site"
                          onClick={() => window.open('/blogs', '_blank')}
                          className="w-8 h-8 rounded-lg text-text-tertiary hover:text-accent hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                      <button
                        title="Edit"
                        onClick={() => openEdit(c)}
                        className="w-8 h-8 rounded-lg text-text-tertiary hover:text-accent hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setDeleting(c)}
                        className="w-8 h-8 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ChronicleModal open={modalOpen} onClose={closeModal} onSaved={reload} chronicle={editing} />
      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete chronicle"
        message={'Delete "' + (deleting ? deleting.title : '') + '" permanently? This cannot be undone.'}
      />
    </>
  )
}
