import { useState, useCallback } from 'react';
import useAuth from './useAuth';

const API_URL = 'http://localhost:4000/wb';

const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getDiscountCodes = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener códigos de descuento');
      }

      const data = await response.json();
      setDiscountCodes(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getDiscountCodeById = useCallback(async (codeId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes/${codeId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener código de descuento');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getDiscountCodeByCode = useCallback(async (code) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes/code/${code}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al buscar código de descuento');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createDiscountCode = useCallback(async (codeData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(codeData),
      });

      if (!response.ok) {
        throw new Error('Error al crear código de descuento');
      }

      const data = await response.json();
      await getDiscountCodes(); // Refrescar la lista después de crear
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, getDiscountCodes]);

  const updateDiscountCode = useCallback(async (codeId, codeData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes/${codeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(codeData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar código de descuento');
      }

      const data = await response.json();
      await getDiscountCodes(); // Refrescar la lista después de actualizar
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, getDiscountCodes]);

  const deleteDiscountCode = useCallback(async (codeId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/discountCodes/${codeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar código de descuento');
      }

      setDiscountCodes(prev => prev.filter(code => code._id !== codeId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    discountCodes,
    loading,
    error,
    getDiscountCodes,
    getDiscountCodeById,
    getDiscountCodeByCode,
    createDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
  };
};

export default useDiscountCodes;
