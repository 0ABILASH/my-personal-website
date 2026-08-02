const headerModules = import.meta.glob('../images/profile-header.*', { eager: true })
const headerImg = Object.values(headerModules)[0]?.default || null

export default headerImg
