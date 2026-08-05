const imageModules = import.meta.glob('../images/*.{jpg,jpeg,png,webp}', { eager: true })

const excluded = new Set([
  'profile.jpeg',
  'pimage.jpeg',
  'profile-header.png',
  'logos.png',
])

const allImages = Object.entries(imageModules)
  .filter(([path]) => !excluded.has(path.split('/').pop()))
  .map(([, mod]) => mod.default)
  .filter(Boolean)

export default allImages
