import api from '../axios'

export const loginWithTelegram = (init_data: string) =>
  api.post<{ user_id: number }>('/auth/telegram/login', { init_data }, { withCredentials: true });