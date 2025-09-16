import { rootRoute } from '@routes/__root'
import { homeRoute } from '@routes/index'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { profileRoute } from './routes/profile'
import { serviceRoute } from './routes/service/$id'

const routeTree = rootRoute.addChildren([homeRoute, serviceRoute, profileRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return <RouterProvider router={router} />
}