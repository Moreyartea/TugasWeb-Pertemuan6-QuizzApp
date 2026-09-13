export function createFooter() {
  const footer = document.createElement('footer')
  footer.classList.add('app-footer')

  const container = document.createElement('div')
  container.classList.add('app-footer-container')

  const identity = document.createElement('div')
  identity.classList.add('app-footer-identity')

  const brand = document.createElement('strong')
  brand.textContent = 'CASEFILE'

  const type = document.createElement('span')
  type.textContent = 'INTERACTIVE INVESTIGATION QUIZ'

  const assignment = document.createElement('span')
  assignment.textContent = 'Tugas Rutin 6 · Pemrograman Web'

  identity.append(brand, type, assignment)

  const githubLink = document.createElement('a')
  githubLink.classList.add('app-footer-github')
  githubLink.href = 'https://github.com/Moreyartea'
  githubLink.target = '_blank'
  githubLink.rel = 'noreferrer noopener'
  githubLink.setAttribute('aria-label', 'Kunjungi profil GitHub')
  githubLink.title = 'Visit GitHub Profile'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('fill', 'currentColor')
  path.setAttribute('d', 'M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z')

  svg.append(path)
  githubLink.append(svg)
  container.append(identity, githubLink)
  footer.append(container)

  return footer
}
