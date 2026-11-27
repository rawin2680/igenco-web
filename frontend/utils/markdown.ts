// Tiny, safe Markdown renderer for news content (shared by /admin preview and
// the public news modal). All HTML in the source is escaped first, so the only
// tags in the output are the ones produced here. Links/images only allow
// http(s), mailto and site-relative URLs.
//
// Supported: ## / ### headings, **bold**, *italic*, [text](url), ![alt](url),
// "- " bullet lists, "1. " numbered lists, "> " quotes, blank line = new paragraph.

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (u: string) => {
  const url = u.trim()
  return /^(https?:\/\/|mailto:|\/(?!\/))/i.test(url) ? url : ''
}

const inline = (s: string) =>
  esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => {
      const u = safeUrl(url.replace(/&amp;/g, '&'))
      return u ? `<img src="${esc(u)}" alt="${alt}" loading="lazy" class="rounded-xl my-2 max-w-full">` : alt
    })
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
      const u = safeUrl(url.replace(/&amp;/g, '&'))
      return u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="text-[#00875A] underline">${text}</a>` : text
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')

export const renderMarkdown = (src?: string | null): string => {
  if (!src) return ''
  const blocks = src.replace(/\r\n/g, '\n').split(/\n{2,}/)
  return blocks
    .map(block => {
      const lines = block.split('\n').filter(l => l.trim() !== '')
      if (!lines.length) return ''
      const first = lines[0]
      if (/^###\s+/.test(first)) return `<h4 class="font-semibold text-base mt-2">${inline(first.replace(/^###\s+/, ''))}</h4>` + (lines.length > 1 ? `<p>${lines.slice(1).map(inline).join('<br>')}</p>` : '')
      if (/^##?\s+/.test(first)) return `<h3 class="font-bold text-lg mt-2">${inline(first.replace(/^##?\s+/, ''))}</h3>` + (lines.length > 1 ? `<p>${lines.slice(1).map(inline).join('<br>')}</p>` : '')
      if (lines.every(l => /^\s*[-*•]\s+/.test(l)))
        return `<ul class="list-disc pl-5 space-y-1">${lines.map(l => `<li>${inline(l.replace(/^\s*[-*•]\s+/, ''))}</li>`).join('')}</ul>`
      if (lines.every(l => /^\s*\d+[.)]\s+/.test(l)))
        return `<ol class="list-decimal pl-5 space-y-1">${lines.map(l => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`
      if (lines.every(l => /^>\s?/.test(l)))
        return `<blockquote class="border-l-4 border-[#00C978] pl-4 italic text-mutedSlate">${lines.map(l => inline(l.replace(/^>\s?/, ''))).join('<br>')}</blockquote>`
      return `<p>${lines.map(inline).join('<br>')}</p>`
    })
    .join('\n')
}

// Rough reading time. Thai has no spaces between words, so count Thai
// characters separately (~6 chars per word).
export const estimateReadTime = (...texts: (string | null | undefined)[]) => {
  const t = texts.filter(Boolean).join(' ')
  const thai = (t.match(/[฀-๿]/g) || []).length
  const latinWords = t.replace(/[฀-๿]/g, ' ').split(/\s+/).filter(Boolean).length
  const words = latinWords + thai / 6
  return `${Math.max(1, Math.round(words / 200))} min`
}

// "January 25, 2017" (date_en as written by the admin) -> timestamp, or NaN
export const newsDateValue = (dateEn?: string | null) => {
  if (!dateEn) return NaN
  const v = Date.parse(dateEn)
  return Number.isNaN(v) ? NaN : v
}
