import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const API_URL = 'http://localhost:4000/wb';

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission for create/edit
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add form fields to FormData
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('stock', data.stock);
      
      // Add image if provided
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }
      
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}` 
        : `${API_URL}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error al ${editingProduct ? 'actualizar' : 'crear'} producto`);
      }

      toast.success(`Producto ${editingProduct ? 'actualizado' : 'creado'} con éxito`);
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      toast.success('Producto eliminado con éxito');
      fetchProducts();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Open modal for create/edit
  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setImagePreview(product?.imagery?.url || null);
    
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock
      });
    } else {
      reset({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: ''
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview(null);
    reset();
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.imagery && product.imagery.url ? (
                      <img 
                        src={product.imagery.url} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-lg font-semibold">${product.price}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No hay productos registrados
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    {...register('name', { required: 'El nombre es requerido' })}
                    className="input"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    {...register('description')}
                    rows="3"
                    className="input"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <input
                    type="text"
                    {...register('category')}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: 'El precio es requerido',
                      min: {
                        value: 0.01,
                        message: 'El precio debe ser mayor a 0'
                      }
                    })}
                    className="input"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    {...register('stock', { 
                      required: 'El stock es requerido',
                      min: {
                        value: 0,
                        message: 'El stock no puede ser negativo'
                      }
                    })}
                    className="input"
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image')}
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Vista previa" 
                        className="h-32 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
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
                  {editingProduct ? 'Actualizar' : 'Crear'}
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
            <p className="mb-4">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
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

export default Inventory;
