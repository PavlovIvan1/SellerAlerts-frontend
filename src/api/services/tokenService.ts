import api from '../axios';
import type { Scope } from '../types';

// Добавить WB токен
export const addToken = (token: string) =>
  api.post<{ token_id: number }>('/tokens', { token });

// Получить список scopes
export const getTokenScopes = () =>
  api.get<{ data: Scope[] }>('/tokens/scopes');
