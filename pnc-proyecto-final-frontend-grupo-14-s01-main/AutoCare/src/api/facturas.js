/**
 * API service for invoices (facturas)
 */

import { API_URL } from '../config/api';

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all invoices for the authenticated client
 * @returns {Promise<Array>} Array of invoices
 */
export const obtenerFacturas = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/facturas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error al obtener facturas');
  }

  return response.json();
};

/**
 * Get invoice details by ID
 * @param {number} id - Invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export const obtenerFacturaPorId = async (id) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/facturas/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error al obtener factura');
  }

  return response.json();
};

/**
 * Download invoice as PDF
 * @param {number} id - Invoice ID
 * @returns {Promise<Blob>} PDF blob
 */
export const descargarFacturaPDF = async (id) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/facturas/${id}/pdf`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error al descargar factura');
  }

  const blob = await response.blob();
  return blob;
};

/**
 * Create invoice for a repair
 * @param {number} reparacion_id - Repair ID
 * @returns {Promise<Object>} Created invoice data
 */
export const crearFactura = async (reparacion_id) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/facturas`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reparacion_id })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear factura');
  }

  return response.json();
};

