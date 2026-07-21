import { jsPDF } from 'jspdf'

export function downloadCV() {
  const doc = new jsPDF()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Abilash', 20, 25)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Full Stack Developer', 20, 33)
  doc.text('Coimbatore, India', 20, 40)
  doc.text('Email: hello@example.com', 20, 47)

  doc.setDrawColor(124, 106, 255)
  doc.setLineWidth(0.5)
  doc.line(20, 52, 190, 52)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('About Me', 20, 62)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const aboutText = 'A passionate developer who loves building clean, meaningful digital experiences. I enjoy turning complex problems into simple, elegant solutions.'
  const aboutLines = doc.splitTextToSize(aboutText, 170)
  doc.text(aboutLines, 20, 70)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Skills', 20, 90)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('React, Node.js, TypeScript, UI/UX Design, Tailwind CSS, Git', 20, 98)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Experience', 20, 115)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Full Stack Developer', 20, 123)
  doc.setFont('helvetica', 'normal')
  doc.text('2023 - Present', 150, 123)
  doc.text('Building web applications with React, Node.js, and modern tooling.', 20, 130)

  doc.setFont('helvetica', 'bold')
  doc.text('Web Developer', 20, 143)
  doc.setFont('helvetica', 'normal')
  doc.text('2022 - 2023', 150, 143)
  doc.text('Developed responsive websites and full-stack projects.', 20, 150)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Education', 20, 170)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Computer Science', 20, 178)
  doc.setFont('helvetica', 'normal')
  doc.text('Bachelor of Technology', 20, 185)

  doc.setDrawColor(124, 106, 255)
  doc.line(20, 200, 190, 200)
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Generated from my-personal-website', 20, 207)

  doc.save('Abilash_CV.pdf')
}
