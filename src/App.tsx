import { rootRoute } from '@routes/__root'
import { homeRoute } from '@routes/index'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { loginWithTelegram } from './api/services'
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
  
  useEffect(() => {
    console.log('test app.tsx')
    const fetchAuth = async () => {
      const isAuthChecked = localStorage.getItem('isAuthChecked');

      if (!isAuthChecked) {
        try {
          const response = await loginWithTelegram(window.Telegram.WebApp.initData);
          if (response.data.user_id) {
            localStorage.setItem('isAuthChecked', 'true');
          } else {
            console.error("Backend hasn't responded with user_id");
          }
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            console.error("Invalid init_data");
          } else {
            console.error("Ошибка авторизации:", error);
          }
        }
      }
    };

    fetchAuth();
  }, []);


  return <RouterProvider router={router} />
}