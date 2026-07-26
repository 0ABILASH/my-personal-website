export function downloadCV() {
  var link = document.createElement('a')
  link.href = '/Abilash-Data.pdf'
  link.download = 'Abilash-Data.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
