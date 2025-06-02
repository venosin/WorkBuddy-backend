import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { EyeIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const API_URL = 'http://localhost:4000/wb';

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token utilizado:', token); // Para depuración
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Incluir cookies en la solicitud
      });

      if (!response.ok) {
        throw new Error('Error al obtener órdenes');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for order creation
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token usado para productos:', token);
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los productos');
    }
  };

  // Fetch clients for order creation
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token usado para clientes:', token);
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los clientes');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchClients();
  }, []);

  // Add order item
  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  // Remove order item
  const removeOrderItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  // Update order item
  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  // Handle form submission for create order - Usando el nuevo endpoint administrativo
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      // Preparar datos para la creación de orden administrativa
      const adminOrderData = {
        userId: data.clientId,
        userType: 'clients',
        // Incluir los productos directamente
        products: orderItems.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity)
        })),
        payMethod: data.payMethod,
        shippingAddress: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postalCode || ''
        }
      };
      
      // Validar productos
      if (!adminOrderData.products || adminOrderData.products.length === 0) {
        toast.error('Debe agregar al menos un producto a la orden');
        return;
      }
      
      // Validar que todos los productos tengan un ID y cantidad válidos
      const invalidProduct = adminOrderData.products.find(p => !p.productId || !p.quantity);
      if (invalidProduct) {
        toast.error('Todos los productos deben tener un ID y cantidad válidos');
        return;
      }
      
      // Verificar que la estructura de shippingAddress está completa
      if (!adminOrderData.shippingAddress || 
          !adminOrderData.shippingAddress.street || 
          !adminOrderData.shippingAddress.city || 
          !adminOrderData.shippingAddress.state || 
          !adminOrderData.shippingAddress.postalCode) {
        console.error('Faltan datos en la dirección de envío:', adminOrderData.shippingAddress);
        toast.error('Por favor complete todos los campos de la dirección de envío');
        return;
      }
      
      console.log('Enviando datos de orden administrativa:', adminOrderData);
      
      // Llamar al nuevo endpoint de órdenes administrativas
      const response = await fetch(`${API_URL}/orders/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(adminOrderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Error desconocido al crear la orden'
        }));
        console.error('Error al crear orden administrativa:', errorData);
        throw new Error(errorData.message || 'Error al crear la orden');
      }
      
      const result = await response.json();
      console.log('Orden administrativa creada:', result);
      
      toast.success('Orden creada con éxito');
      fetchOrders();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden');
      }

      toast.success('Estado de la orden actualizado con éxito');
      fetchOrders();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la orden');
      }

      toast.success('Orden eliminada con éxito');
      fetchOrders();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  // Open modal for create order
  const handleOpenModal = () => {
    setOrderItems([{ productId: '', quantity: 1 }]);
    reset({
      clientId: '',
      payMethod: 'credit_card',
      street: '',
      city: '',
      state: '',
      postalCode: ''
    });
    setShowModal(true);
  };

  // Open detail modal
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Translate status
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Calculate total - used for display in UI
  // eslint-disable-next-line no-unused-vars
  const calculateTotal = (items) => {
    if (!items || !items.length) return 0;
    return items.reduce((total, item) => {
      const product = products.find(p => p._id === item.idProduct);
      return total + (product ? product.price * item.quantity : 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="py-6 w-full h-full">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Órdenes</h1>
          <button
            onClick={handleOpenModal}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Orden
          </button>
        </div>
      </div>

      <div className="w-full mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="w-full max-w-full">
            <div className="bg-white shadow overflow-hidden sm:rounded-md w-full max-w-full">
              <ul className="divide-y divide-gray-200 w-full max-w-full">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <li key={order._id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">Orden #{order._id.substring(0, 8)}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {translateStatus(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Fecha: {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: ${order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenDetailModal(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => setConfirmDelete(order._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No hay órdenes registradas
                </li>
              )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
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
            <h2 className="text-xl font-semibold mb-4">Nueva Orden</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Información de Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cliente</label>
                      <select
                        {...register('clientId', { required: 'El cliente es requerido' })}
                        className="input"
                      >
                        <option value="">Seleccionar cliente</option>
                        {clients.map(client => (
                          <option key={client._id} value={client._id}>
                            {client.name} ({client.email})
                          </option>
                        ))}
                      </select>
                      {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                      <select
                        {...register('payMethod', { required: 'El método de pago es requerido' })}
                        className="input"
                      >
                        <option value="credit_card">Tarjeta de Crédito</option>
                        <option value="debit_card">Tarjeta de Débito</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="transfer">Transferencia</option>
                        <option value="paypal">PayPal</option>
                      </select>
                      {errors.payMethod && <p className="text-red-500 text-xs mt-1">{errors.payMethod.message}</p>}
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6 mb-3">Dirección de Envío</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Calle</label>
                      <input
                        type="text"
                        {...register('street', { required: 'La calle es requerida' })}
                        className="input"
                      />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input
                          type="text"
                          {...register('city', { required: 'La ciudad es requerida' })}
                          className="input"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <input
                          type="text"
                          {...register('state', { required: 'El estado es requerido' })}
                          className="input"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                      <input
                        type="text"
                        {...register('postalCode', { required: 'El código postal es requerido' })}
                        className="input"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Productos</h3>
                    <button
                      type="button"
                      onClick={addOrderItem}
                      className="text-primary hover:text-primary-light"
                    >
                      + Agregar producto
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Producto {index + 1}</h4>
                          {orderItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOrderItem(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Producto</label>
                            <select
                              value={item.productId}
                              onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                              className="input"
                              required
                            >
                              <option value="">Seleccionar producto</option>
                              {products.map(product => (
                                <option key={product._id} value={product._id}>
                                  {product.name} - ${product.price}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                              className="input"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  Crear Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative text-gray-800">
            {/* Botón X para cerrar */}
            <button
              onClick={handleCloseDetailModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold">Detalles de la Orden</h2>
            
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">ID de Orden</p>
                  <p className="font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {translateStatus(selectedOrder.status)}
                  </span>
                  
                  {/* Status update dropdown */}
                  {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                    <div className="ml-4">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Dirección de Envío</p>
                <p className="font-medium">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Método de Pago</p>
                <p className="font-medium">
                  {selectedOrder.paymentInfo?.method === 'credit_card' ? 'Tarjeta de Crédito' :
                   selectedOrder.paymentInfo?.method === 'debit_card' ? 'Tarjeta de Débito' :
                   selectedOrder.paymentInfo?.method === 'cash' ? 'Efectivo' :
                   selectedOrder.paymentInfo?.method === 'transfer' ? 'Transferencia' :
                   selectedOrder.paymentInfo?.method}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Productos</p>
                {selectedOrder.CartId?.products?.length > 0 ? (
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {selectedOrder.CartId.products.map((item, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.idProduct?.name || 'Producto no disponible'}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.idProduct?.price?.toFixed(2) || '0.00'}</p>
                          <p className="text-sm text-gray-500">
                            Total: ${((item.idProduct?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay productos en esta orden</p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <p className="font-medium">Total</p>
                <p className="font-bold text-lg">${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Botón X para cerrar */}
            <button
              onClick={() => setConfirmDelete(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}
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

export default Orders;
