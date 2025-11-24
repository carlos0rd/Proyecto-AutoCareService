/**
 * Configuración centralizada de la URL de la API
 * En Docker, si VITE_API_URL no está definido, usa rutas relativas
 * (nginx hace el proxy al backend)
 */
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Si no está definido, es "undefined" (string), está vacío, o es solo espacios
  // usar ruta relativa (para Docker - nginx hace el proxy)
  if (!apiUrl || apiUrl === 'undefined' || apiUrl.trim() === '' || apiUrl === '') {
    return '';
  }
  
  return apiUrl;
};

export const API_URL = getApiUrl();

