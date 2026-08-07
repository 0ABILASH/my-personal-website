import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, Heading1, Heading2, Link2, Image as ImageIcon, List, ListOrdered, Quote, RemoveFormatting } from 'lucide-react'

// Lightweight visual content editor for Chronicles. Produces simple HTML that
// the public Blogs page renders (sanitized). Uses execCommand, which is
// deprecated but universally supported and needs no dependencies.

export default function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null)

  // Sync external value changes (e.g. switching posts) without disrupting
  // the cursor while the user is typing.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const current = el.innerHTML
    if (current !== value) el.innerHTML = value || ''
  }, [value])

  const exec = (cmd, arg) => {
    const el = ref.current
    if (!el) return
    el.focus()
    try { document.execCommand(cmd, false, arg) } catch (e) {}
    if (onChange) onChange(el.innerHTML)
  }

  const addLink = () => {
    const url = window.prompt('Enter the link URL (https://...)')
    if (url) exec('createLink', url)
  }

  const addImage = () => {
    const url = window.prompt('Enter the image URL')
    if (url && /^(https?:)?\/\//i.test(url.trim())) {
      exec('insertHTML', '<img src="' + url.trim() + '" alt="" style="max-width:100%;border-radius:8px;margin:8px 0" />')
    }
  }

  const addBlock = (tag) => {
    exec('formatBlock', '<' + tag + '>')
  }

  const buttons = [
    { title: 'Bold', icon: <Bold size={13} />, onClick: () => exec('bold') },
    { title: 'Italic', icon: <Italic size={13} />, onClick: () => exec('italic') },
    { title: 'Underline', icon: <Underline size={13} />, onClick: () => exec('underline') },
    { title: 'Heading 1', icon: <Heading1 size={13} />, onClick: () => addBlock('h1') },
    { title: 'Heading 2', icon: <Heading2 size={13} />, onClick: () => addBlock('h2') },
    { title: 'Bullet list', icon: <List size={13} />, onClick: () => exec('insertUnorderedList') },
    { title: 'Numbered list', icon: <ListOrdered size={13} />, onClick: () => exec('insertOrderedList') },
    { title: 'Quote', icon: <Quote size={13} />, onClick: () => addBlock('blockquote') },
    { title: 'Link', icon: <Link2 size={13} />, onClick: addLink },
    { title: 'Image', icon: <ImageIcon size={13} />, onClick: addImage },
    { title: 'Clear formatting', icon: <RemoveFormatting size={13} />, onClick: () => exec('removeFormat') },
  ]

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-bg focus-within:border-accent/40 transition-all">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface/60">
        {buttons.map((b, i) => (
          <button
            key={i}
            title={b.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={b.onClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text hover:bg-surface transition-all cursor-pointer"
          >
            {b.icon}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => { if (onChange) onChange(e.currentTarget.innerHTML) }}
        onKeyDown={(e) => { if (e.key === 'Tab') { e.preventDefault(); exec('insertHTML', '    ') } }}
        data-placeholder={placeholder || 'Write your Chronicle here...'}
        className="rich-editor min-h-[260px] px-4 py-3 text-[13.5px] text-text-secondary leading-relaxed outline-none [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-text-quaternary [&:empty:before]:pointer-events-none [&_img]:max-w-full [&_img]:rounded-lg [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-text-tertiary [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-text [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:mt-3 [&_h2]:mb-1.5 [&_a]:text-accent [&_a]:underline"
      />
    </div>
  )
}
