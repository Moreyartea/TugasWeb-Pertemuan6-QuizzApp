const routes = []

let notFoundHandler = null

export function registerRoute(
    pattern,
    handler
) {
    routes.push({
        pattern,
        handler
    })
}

export function setNotFoundHandler(
    handler
) {
    notFoundHandler = handler
}

export function navigate(path) {
    window.history.pushState(
        {},
        '',
        path
    )

    renderCurrentRoute()
}

export function getCurrentPath() {
    return window.location.pathname
}

export function initializeRouter() {
    window.addEventListener(
        'popstate',
        () => {
            renderCurrentRoute()
        }
    )

    document.addEventListener(
        'click',
        handleNavigation
    )

    renderCurrentRoute()
}

function handleNavigation(event) {
    const link =
        event.target.closest(
            '[data-route]'
        )

    if (!link) {
        return
    }

    event.preventDefault()

    navigate(
        link.dataset.route
    )
}

function renderCurrentRoute() {
    const path =
        getCurrentPath()

    const matchedRoute =
        routes.find(
            ({ pattern }) =>
                matchRoute(
                    pattern,
                    path
                )
        )

    if (matchedRoute) {
        matchedRoute.handler(
            getRouteParams(
                matchedRoute.pattern,
                path
            )
        )

        return
    }

    if (notFoundHandler) {
        notFoundHandler()
    }
}

function matchRoute(
    pattern,
    path
) {
    const patternParts =
        normalizePath(pattern)
            .split('/')

    const pathParts =
        normalizePath(path)
            .split('/')

    if (
        patternParts.length !==
        pathParts.length
    ) {
        return false
    }

    return patternParts.every(
        (part, index) => {
            if (
                part.startsWith(':')
            ) {
                return true
            }

            return (
                part ===
                pathParts[index]
            )
        }
    )
}

function getRouteParams(
    pattern,
    path
) {
    const patternParts =
        normalizePath(pattern)
            .split('/')

    const pathParts =
        normalizePath(path)
            .split('/')

    const params = {}

    patternParts.forEach(
        (part, index) => {
            if (
                part.startsWith(':')
            ) {
                const key =
                    part.slice(1)

                params[key] =
                    pathParts[index]
            }
        }
    )

    return params
}

function normalizePath(path) {
    if (path === '/') {
        return ''
    }

    return path
        .replace(/^\/|\/$/g, '')
}