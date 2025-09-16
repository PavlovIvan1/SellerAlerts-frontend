import { Profile } from '@/pages/ProfilePage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/profile',
	component: Profile,
})
