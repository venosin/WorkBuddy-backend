import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm, FormProvider } from 'react-hook-form';

const Users = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Nota: Podemos acceder a useAuth() cuando sea necesario para autenticación

  const methods = useForm();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = methods;

  const API_URL = 'http://localhost:4000/wb';

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle form submission for create/edit
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingClient 
        ? `${API_URL}/clients/${editingClient._id}` 
        : `${API_URL}/clients`;
      
      console.log('Enviando solicitud a:', url);
      console.log('Datos a enviar:', data);
      console.log('Token utilizado:', token);
      
      const method = editingClient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // Incluir cookies en la solicitud
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error respuesta:', errorData);
        
        // Mensaje específico para correo duplicado
        if (errorData.error === 'duplicate_email') {
          toast.error('Ya existe un cliente con ese correo electrónico');
          return;
        }
        
        throw new Error(errorData.message || `Error al ${editingClient ? 'actualizar' : 'crear'} cliente`);
      }

      toast.success(`Cliente ${editingClient ? 'actualizado' : 'creado'} con éxito`);
      fetchClients();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cliente');
      }

      toast.success('Cliente eliminado con éxito');
      fetchClients();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Open modal for create/edit
  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    if (client) {
      console.log('Editando cliente:', client); // Para depuración
      // Usar setValue para cada campo individualmente para asegurar que se actualice correctamente
      setValue('name', client.name || '');
      setValue('email', client.email || '');
      setValue('phoneNumber', client.phoneNumber || '');
      setValue('address', client.address || '');
      
      // Si hay una fecha de nacimiento, formatearla correctamente para el campo date
      if (client.birthday) {
        const birthdayDate = new Date(client.birthday);
        // Formato YYYY-MM-DD para el campo date
        const formattedDate = birthdayDate.toISOString().split('T')[0];
        setValue('birthday', formattedDate);
      }
    } else {
      // Si es un nuevo cliente, resetear el formulario
      reset({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthday: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    reset();
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-white shadow overflow-hidden sm:rounded-md w-full">
              <ul className="divide-y divide-gray-200 w-full">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <li key={client._id}>
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phoneNumber}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(client)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(client._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    No hay usuarios registrados
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Botón X para cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingClient ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: 'El nombre es requerido',
                      maxLength: {
                        value: 50,
                        message: 'El nombre no puede tener más de 50 caracteres'
                      } 
                    })}
                    className="input"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'El email es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="input"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    {...register('phoneNumber')}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    {...register('address', { required: 'La dirección es requerida' })}
                    className="input"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    {...register('birthday', { required: 'La fecha de nacimiento es requerida' })}
                    className="input"
                  />
                  {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday.message}</p>}
                </div>

                {!editingClient && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      {...register('password', { 
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                      className="input"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light"
                >
                  {editingClient ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
