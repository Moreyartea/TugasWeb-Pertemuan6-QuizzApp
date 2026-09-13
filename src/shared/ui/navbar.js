import {
    getCurrentPath
} from '../../app/router.js'

import {
    getTheme,
    toggleTheme
} from '../../features/settings/theme.service.js'

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

    const casesLink = document.createElement('a')
    casesLink.href = '/cases'
    casesLink.dataset.route = '/cases'
    casesLink.classList.add('app-navbar-link')
    casesLink.textContent = 'Kasus'

    const historyLink = document.createElement('a')
    historyLink.href = '/history'
    historyLink.dataset.route = '/history'
    historyLink.classList.add('app-navbar-link')
    historyLink.textContent = 'History'

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
        casesLink,
        historyLink,
        themeButton
    )

    container.append(brand, navigation)
    navbar.append(container)

    return navbar
}
