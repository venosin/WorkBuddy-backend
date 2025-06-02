import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';
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
    <div className="py-4 md:py-6 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 w-full sm:w-auto text-center sm:text-left mb-3 sm:mb-0">Inventario</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-light text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center justify-center w-full sm:w-auto transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 my-8 sm:my-12 md:my-16">
        <div className="border-t border-gray-200"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-8 sm:mt-16 md:mt-32">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                  <div className="h-36 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imagery && product.imagery.url ? (
                      <img 
                        src={product.imagery.url} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm sm:text-base flex items-center justify-center h-full w-full">
                        <DocumentIcon className="h-8 w-8 mr-2 text-gray-300" />
                        <span>Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-base sm:text-lg font-semibold">${product.price}</span>
                      <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="sm:mt-4 flex justify-end space-x-3 mt-auto">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                        aria-label="Editar producto"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-200 md:p-2 md:rounded-md"
                        aria-label="Eliminar producto"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[95vh] overflow-y-auto relative transition-all duration-300 ">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 relative transition-all duration-300 ">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
              <button 
                onClick={() => setConfirmDelete(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm sm:text-base">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
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
