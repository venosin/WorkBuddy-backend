import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente modal para confirmar acciones de eliminación
 * Muestra un diálogo de confirmación con mensaje personalizable y botones de acción
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            // Aplicamos estilos en línea directos para asegurar visibilidad del texto
            style={{ backgroundColor: '#ef4444', color: 'white' }}
            className="px-4 py-2 rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default DeleteConfirmationModal;
