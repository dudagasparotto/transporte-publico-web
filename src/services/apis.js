
import axios from 'axios';

// export const API_URL = import.meta.env.VITE_API_URL || 'ftp.ominibus.kinghost.net';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
});

const CHAVE_SESSAO = 'transporte-publico-sessao';
const EVENTO_SESSAO = 'transporte-publico-sessao-alterada';

function obterToken() {
  try {
    const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO));
    return sessao?.token || '';
  } catch {
    localStorage.removeItem(CHAVE_SESSAO);
    return '';
  }
}

api.interceptors.request.use((config) => {
  const token = obterToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CHAVE_SESSAO);
      window.dispatchEvent(new Event(EVENTO_SESSAO));
    }

    return Promise.reject(error);
  }
);

export function getArquivoUrl(caminho) {
  if (!caminho) return '';
  if (caminho.startsWith('http')) return caminho;
  return `${API_URL}/${caminho}`;
}

export default api;
