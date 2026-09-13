import {
    getCurrentPath
} from '../../app/router.js'

import {
    getTheme,
    toggleTheme
} from '../../features/settings/theme.service.js'

import {
    showAboutModal,
    showHowToPlayModal
} from './info-modal.js'

export function createNavbar() {
    const currentPath = getCurrentPath()

    const navbar = document.createElement('nav')
    navbar.classList.add('app-navbar')
    navbar.setAttribute('aria-label', 'Navigasi utama')

    const container = document.createElement('div')
    container.classList.add('app-navbar-container')

    const brand = document.createElement('a')
    brand.href = '/'
    brand.dataset.route = '/'
    brand.classList.add('app-navbar-brand')
    brand.textContent = 'CASEFILE'

    const navigation = document.createElement('div')
    navigation.classList.add('app-navbar-navigation')
    navigation.id = 'app-navbar-navigation'

    const homeLink = createNavLink('/', 'Home')
    const casesLink = createNavLink('/cases', 'Kasus')
    const historyLink = createNavLink('/history', 'History')

    const aboutButton = document.createElement('button')
    aboutButton.type = 'button'
    aboutButton.classList.add('app-navbar-link', 'app-navbar-button')
    aboutButton.textContent = 'About'
    aboutButton.addEventListener('click', showAboutModal)

    const howToPlayButton = document.createElement('button')
    howToPlayButton.type = 'button'
    howToPlayButton.classList.add('app-navbar-link', 'app-navbar-button')
    howToPlayButton.textContent = 'How to Play'
    howToPlayButton.addEventListener('click', () => showHowToPlayModal())

    const themeButton = document.createElement('button')
    themeButton.type = 'button'
    themeButton.classList.add('app-navbar-theme')
    themeButton.setAttribute('aria-label', 'Ganti tema')

    const updateThemeButton = () => {
        const theme = getTheme()
        themeButton.textContent = theme === 'dark' ? '☼' : '☾'
        themeButton.title = theme === 'dark'
            ? 'Gunakan tema terang'
            : 'Gunakan tema gelap'
    }

    updateThemeButton()

    themeButton.addEventListener('click', () => {
        toggleTheme()
        updateThemeButton()
    })

    if (currentPath === '/') {
        homeLink.classList.add('is-active')
        homeLink.setAttribute('aria-current', 'page')
    }

    const isCasesPage =
        currentPath === '/cases' ||
        currentPath.startsWith('/case/')

    const isHistoryPage = currentPath === '/history'

    if (isCasesPage) {
        casesLink.classList.add('is-active')
        casesLink.setAttribute('aria-current', 'page')
    }

    if (isHistoryPage) {
        historyLink.classList.add('is-active')
        historyLink.setAttribute('aria-current', 'page')
    }

    navigation.append(
        homeLink,
        casesLink,
        historyLink,
        howToPlayButton,
        aboutButton
    )

    const menuToggle = document.createElement('button')
    menuToggle.type = 'button'
    menuToggle.classList.add('app-navbar-menu-toggle')
    menuToggle.setAttribute('aria-haspopup', 'true')
    menuToggle.setAttribute('aria-expanded', 'false')
    menuToggle.setAttribute('aria-controls', 'app-navbar-navigation')
    menuToggle.setAttribute('aria-label', 'Buka menu navigasi')
    menuToggle.textContent = '☰'

    let outsideClickHandler = null
    let escapeKeyHandler = null

    const closeMenu = () => {
        navigation.classList.remove('is-open')
        menuToggle.setAttribute('aria-expanded', 'false')
        menuToggle.setAttribute('aria-label', 'Buka menu navigasi')
        menuToggle.textContent = '☰'

        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler)
            outsideClickHandler = null
        }

        if (escapeKeyHandler) {
            document.removeEventListener('keydown', escapeKeyHandler)
            escapeKeyHandler = null
        }
    }

    const openMenu = () => {
        navigation.classList.add('is-open')
        menuToggle.setAttribute('aria-expanded', 'true')
        menuToggle.setAttribute('aria-label', 'Tutup menu navigasi')
        menuToggle.textContent = '✕'

        outsideClickHandler = (event) => {
            if (!navbar.contains(event.target)) {
                closeMenu()
            }
        }

        escapeKeyHandler = (event) => {
            if (event.key === 'Escape') {
                closeMenu()
                menuToggle.focus()
            }
        }

        document.addEventListener('click', outsideClickHandler)
        document.addEventListener('keydown', escapeKeyHandler)
    }

    menuToggle.addEventListener('click', () => {
        if (navigation.classList.contains('is-open')) {
            closeMenu()
        } else {
            openMenu()
        }
    })

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a, button')) {
            closeMenu()
        }
    })

    container.append(brand, navigation, themeButton, menuToggle)
    navbar.append(container)

    return navbar
}

function createNavLink(route, label) {
    const link = document.createElement('a')
    link.href = route
    link.dataset.route = route
    link.classList.add('app-navbar-link')
    link.textContent = label
    return link
}
