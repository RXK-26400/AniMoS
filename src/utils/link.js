export function normalizeLink(value) {
  let v = (value || '').trim()
  if (!v) return ''
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}