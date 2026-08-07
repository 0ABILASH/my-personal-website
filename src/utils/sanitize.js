// Lightweight HTML sanitizer used when rendering admin-authored Chronicle
// content on the public site. Keeps basic formatting tags, links and images,
// and strips scripts, event handlers and dangerous URLs.

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'B', 'I', 'U', 'STRONG', 'EM', 'H1', 'H2', 'H3', 'H4',
  'A', 'IMG', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'DIV', 'SPAN', 'HR',
  'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH', 'PRE', 'CODE', 'FIGCAPTION', 'FIGURE'
])

const DROP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META',
  'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'SVG', 'NOSCRIPT', 'TEMPLATE'
])

const ALLOWED_ATTRS = {
  A: ['href', 'title'],
  IMG: ['src', 'alt', 'title'],
  '*': ['class'],
}

function sanitizeHtml(html) {
  if (typeof document === 'undefined') return String(html || '')
  let doc
  try {
    doc = new DOMParser().parseFromString(String(html || ''), 'text/html')
  } catch (e) {
    return ''
  }

  const clean = (node) => {
    if (node.nodeType !== 1) return // skip text/comments

    const tag = node.tagName.toUpperCase()

    if (DROP_TAGS.has(tag)) {
      node.remove()
      return
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Unwrap disallowed containers but keep their children.
      while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node)
      node.remove()
      return
    }

    // Filter attributes.
    const attrs = Array.from(node.attributes)
    for (let i = 0; i < attrs.length; i++) {
      const name = attrs[i].name.toLowerCase()
      const value = attrs[i].value
      if (name.indexOf('on') === 0 || name === 'style') {
        node.removeAttribute(attrs[i].name)
        continue
      }
      const allowed = ALLOWED_ATTRS[tag] || ALLOWED_ATTRS['*'] || []
      if (allowed.indexOf(name) === -1) {
        node.removeAttribute(attrs[i].name)
      }
    }

    if (tag === 'A') {
      const href = (node.getAttribute('href') || '').trim()
      if (!/^(https?:)?\/\//i.test(href) && href.charAt(0) !== '#' && href.charAt(0) !== '/') {
        node.removeAttribute('href')
      }
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noreferrer')
    }

    if (tag === 'IMG') {
      const src = (node.getAttribute('src') || '').trim()
      if (!/^(https?:)?\/\//i.test(src) && src.charAt(0) !== '/') {
        node.remove()
        return
      }
    }

    Array.from(node.childNodes).forEach(clean)
  }

  Array.from(doc.body.childNodes).forEach(clean)
  return doc.body.innerHTML
}

export default sanitizeHtml
