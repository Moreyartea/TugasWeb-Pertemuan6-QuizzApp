import {
    getCurrentPath
} from '../../app/router.js'

export function createNavbar() {
    const currentPath =
        getCurrentPath()

    const navbar =
        document.createElement('nav')

    navbar.classList.add(
        'app-navbar'
    )

    navbar.setAttribute(
        'aria-label',
        'Navigasi utama'
    )

    const container =
        document.createElement('div')

    container.classList.add(
        'app-navbar-container'
    )

    const brand =
        document.createElement('a')

    brand.href = '/'
    brand.dataset.route = '/'
    brand.classList.add(
        'app-navbar-brand'
    )

    brand.textContent =
        'CASEFILE'

    const navigation =
        document.createElement('div')

    navigation.classList.add(
        'app-navbar-navigation'
    )

    const casesLink =
        document.createElement('a')

    casesLink.href = '/cases'
    casesLink.dataset.route = '/cases'
    casesLink.classList.add(
        'app-navbar-link'
    )

    casesLink.textContent =
        'Kasus'

    const historyLink =
        document.createElement('a')

    historyLink.href = '/history'
    historyLink.dataset.route = '/history'
    historyLink.classList.add(
        'app-navbar-link'
    )

    historyLink.textContent =
        'History'

    const isCasesPage =
        currentPath === '/cases' ||
        currentPath.startsWith('/case/')

    const isHistoryPage =
        currentPath === '/history'

    if (isCasesPage) {
        casesLink.classList.add(
            'is-active'
        )

        casesLink.setAttribute(
            'aria-current',
            'page'
        )
    }

    if (isHistoryPage) {
        historyLink.classList.add(
            'is-active'
        )

        historyLink.setAttribute(
            'aria-current',
            'page'
        )
    }

    navigation.append(
        casesLink,
        historyLink
    )

    container.append(
        brand,
        navigation
    )

    navbar.append(container)

    return navbar
}