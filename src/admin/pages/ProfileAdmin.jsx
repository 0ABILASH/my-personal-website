import { useState, useEffect, useCallback } from 'react'
import { Save, User, Plus, Trash2, Heart, Link2, Tags as TagsIcon } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { useToast } from '../context/ToastContext'
import { PageHeader, LoadingState, ErrorState, Button, Field, TextInput, TextArea } from '../components/ui'
import { logActivity } from '../utils'

const EMPTY_TRAIT = { label: '', sub: '' }
const EMPTY_LINK = { label: '', href: '' }
const EMPTY_INTEREST = { name: '', sub: '' }

function toListText(arr) {
  return Array.isArray(arr) ? arr.join('\n') : ''
}

function splitLines(text) {
  return String(text || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
      <div className="px-4 h-11 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">{title}</span>
        {subtitle && <span className="text-[10px] text-text-quaternary">{subtitle}</span>}
      </div>
      <div className="p-4 space-y-3.5">{children}</div>
    </div>
  )
}

export default function ProfileAdmin() {
  const toast = useToast()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState('')

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    location: '',
    locationShort: '',
    bio: '',
    status: '',
    about: '',
    tags: '',
    traits: [{ ...EMPTY_TRAIT }],
    links: [{ ...EMPTY_LINK }],
    interests: [{ ...EMPTY_INTEREST }],
  })

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const p = await adminApi.profile()
      setForm({
        name: p.name || '',
        tagline: p.tagline || '',
        location: p.location || '',
        locationShort: p.locationShort || '',
        bio: p.bio || '',
        status: p.status || '',
        about: toListText(p.about),
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        traits: (Array.isArray(p.traits) && p.traits.length ? p.traits : [{ ...EMPTY_TRAIT }]).map((t) => ({
          label: (t && t.label) || '',
          sub: (t && t.sub) || '',
        })),
        links: (Array.isArray(p.links) && p.links.length ? p.links : [{ ...EMPTY_LINK }]).map((l) => ({
          label: (l && l.label) || '',
          href: (l && l.href) || '',
        })),
        interests: (Array.isArray(p.interests) && p.interests.length ? p.interests : [{ ...EMPTY_INTEREST }]).map((i) => ({
          name: (i && i.name) || '',
          sub: (i && i.sub) || '',
        })),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const onListChange = (key, idx, field, value) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    }))
  }

  const addRow = (key, empty) => setForm((f) => ({ ...f, [key]: [...f[key], { ...empty }] }))
  const removeRow = (key, idx) => setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }))

  const save = async () => {
    setSaving(true)
    try {
      const traits = form.traits.filter((t) => t.label || t.sub)
      const links = form.links.filter((l) => l.label || l.href)
      const interests = form.interests.filter((i) => i.name || i.sub)
      const payload = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        location: form.location.trim(),
        locationShort: form.locationShort.trim(),
        bio: form.bio.trim(),
        status: form.status.trim(),
        about: splitLines(form.about),
        tags: String(form.tags).split(',').map((s) => s.trim()).filter(Boolean),
        traits,
        links,
        interests,
      }
      await adminApi.updateProfile(payload)
      setSavedAt(new Date().toISOString())
      logActivity('Updated site profile')
      toast.success('Profile saved. Public pages will update on next visit.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading profile..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="These fields drive the public Profile page and Home hero."
        actions={
          <>
            {savedAt && (
              <span className="text-[10px] text-text-quaternary font-mono">
                Last saved {new Date(savedAt).toLocaleTimeString()}
              </span>
            )}
            <Button onClick={save} loading={saving}>
              <Save size={14} />
              Save Profile
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Basics" subtitle="Used by the hero and profile header">
          <Field label="Name">
            <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Abilash" />
          </Field>
          <Field label="Tagline" hint="Shown as the blue badge under your name.">
            <TextInput value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Software Engineer" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location">
              <TextInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="India" />
            </Field>
            <Field label="Location (short)">
              <TextInput value={form.locationShort} onChange={(e) => set('locationShort', e.target.value)} placeholder="IN" />
            </Field>
          </div>
        </Section>

        <Section title="Bio & Status">
          <Field label="Bio" hint="The intro paragraph on the profile page.">
            <TextArea rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Short intro..." />
          </Field>
          <Field label="Status" hint="The pill under your bio.">
            <TextInput value={form.status} onChange={(e) => set('status', e.target.value)} placeholder="collecting another life experience." />
          </Field>
        </Section>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Section title="About Me" subtitle="One paragraph per line">
          <Field label="Paragraphs">
            <TextArea rows={7} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder={'Paragraph one\n\nParagraph two'} />
          </Field>
        </Section>

        <Section title="Tags" subtitle="Comma separated">
          <Field label="Tags">
            <TextInput value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Love, Money, Travel, Music, Tea" />
          </Field>
          <p className="text-[11px] text-text-tertiary flex items-start gap-1.5">
            <TagsIcon size={12} className="shrink-0 mt-0.5 text-text-quaternary" />
            Shown as pills at the bottom of the About section.
          </p>
        </Section>
      </div>

      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
            <User size={13} /> Status Traits
          </span>
          <Button variant="ghost" onClick={() => addRow('traits', EMPTY_TRAIT)}>
            <Plus size={13} /> Add trait
          </Button>
        </div>
        <div className="p-4 space-y-3">
          {form.traits.map((t, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <TextInput className="flex-1" placeholder="Label (e.g. Profession)" value={t.label} onChange={(e) => onListChange('traits', i, 'label', e.target.value)} />
              <TextInput className="flex-1" placeholder="Value (e.g. Software Engineer)" value={t.sub} onChange={(e) => onListChange('traits', i, 'sub', e.target.value)} />
              <button
                onClick={() => removeRow('traits', i)}
                className="w-8 h-8 shrink-0 rounded-lg border border-border text-text-tertiary hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center justify-center cursor-pointer"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <p className="text-[11px] text-text-tertiary flex items-start gap-1.5">
            <Heart size={12} className="shrink-0 mt-0.5 text-text-quaternary" />
            Icons stay tied to the current design — only label and value are editable.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
            <Link2 size={13} /> Social Links
          </span>
          <Button variant="ghost" onClick={() => addRow('links', EMPTY_LINK)}>
            <Plus size={13} /> Add link
          </Button>
        </div>
        <div className="p-4 space-y-3">
          {form.links.map((l, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <TextInput className="w-36" placeholder="Label (e.g. Instagram)" value={l.label} onChange={(e) => onListChange('links', i, 'label', e.target.value)} />
              <TextInput className="flex-1" placeholder="https://..." value={l.href} onChange={(e) => onListChange('links', i, 'href', e.target.value)} />
              <button
                onClick={() => removeRow('links', i)}
                className="w-8 h-8 shrink-0 rounded-lg border border-border text-text-tertiary hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center justify-center cursor-pointer"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Interests</span>
          <Button variant="ghost" onClick={() => addRow('interests', EMPTY_INTEREST)}>
            <Plus size={13} /> Add interest
          </Button>
        </div>
        <div className="p-4 space-y-3">
          {form.interests.map((x, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <TextInput className="flex-1" placeholder="Name (e.g. Traveling)" value={x.name} onChange={(e) => onListChange('interests', i, 'name', e.target.value)} />
              <TextInput className="flex-1" placeholder="Sub (e.g. Exploring new places)" value={x.sub} onChange={(e) => onListChange('interests', i, 'sub', e.target.value)} />
              <button
                onClick={() => removeRow('interests', i)}
                className="w-8 h-8 shrink-0 rounded-lg border border-border text-text-tertiary hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center justify-center cursor-pointer"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={save} loading={saving}>
          <Save size={14} />
          Save Profile
        </Button>
      </div>
    </>
  )
}
