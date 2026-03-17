import { createWebHistory, createRouter } from 'vue-router'

import IndexPage from './../components/pages/IndexPage.vue'
import ExamplePage from './../components/pages/ExamplePage.vue'
import GamePage from './../components/pages/GamePage.vue'
import GameMenu from '../components/pages/GameMenu.vue'

export const ROUTES = {
  EXAMPLE: 'EXAMPLE',
  MENU: 'MENU',
  GAME: 'GAME',
  INDEX: 'INDEX',
}

const routes = [
  {
    name: ROUTES.EXAMPLE,
    path: '/example',
    component: ExamplePage
  },
  {
    name: ROUTES.MENU,
    path: '/menu',
    component: GameMenu
  },
  {
    name: ROUTES.GAME,
    path: '/game',
    component: GamePage
  },
  {
    name: ROUTES.INDEX,
    path: '/',
    component: IndexPage
  },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})