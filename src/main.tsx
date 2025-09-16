import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// main.tsx
// import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { routeTree } from './routeTree.gen'

// const router = createRouter({ routeTree })

// declare module '@tanstack/react-router' {
//   interface Register {
//     router: typeof router
//   }
// }

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )
