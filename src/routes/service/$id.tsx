// import { ServicePage } from '@/pages/SevicePage'
// import { createFileRoute } from '@tanstack/react-router'

// export const serviceRoute = createFileRoute('/service/$id')({
//   component: ServicePage,
// })

// import { ServicePage } from '@/pages/SevicePage'
// import { rootRoute } from '@routes/__root'
// import { createRoute } from '@tanstack/react-router'

// export const serviceRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/service/$id',
//   component: ServicePage,
//   validateSearch: (search: { pId?: string }) => search,
// })

import { ServicePage } from '@pages/SevicePage'
import { rootRoute } from '@routes/__root'
import { createRoute } from '@tanstack/react-router'

export const serviceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/service/$id',
  component: ServicePage,
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search.pId !== 'string') {
      throw new Error('pId is required and must be a string')
    }
    return { pId: search.pId }
  }
})
