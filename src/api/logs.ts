import { api } from './client';

export const getLogs = () => api.get('/logs');