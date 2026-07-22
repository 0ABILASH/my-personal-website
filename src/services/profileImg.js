const profileModules = import.meta.glob('../images/profile.*', { eager: true })
const profileImg = Object.values(profileModules)[0]?.default || null

export default profileImg
