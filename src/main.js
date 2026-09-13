import './styles/base.css'
import './styles/components.css'
import './styles/utilities.css'

import {
    bootstrap
} from './app/bootstrap.js'

import {
    initializeRouter
} from './app/router.js'

import {
    applyTheme
} from './features/settings/theme.service.js'

applyTheme()
bootstrap()
initializeRouter()