import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import useAuth from '../hooks/useAuth'; // Importamos el hook de autenticación

const Offers = () => {
  // Estados para manejar los datos y la UI
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Hook de autenticación (utilizado para verificar permisos si es necesario)
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth(); // Mantenemos la referencia para futuras características
  const [modalOpen, setModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [modalType, setModalType] = useState('create'); // 'create' o 'edit'
  const [currentOffer, setCurrentOffer] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    discountType: 'percentage',
    percentage: '',
    value: '',
    from: '',
    to: '',
    state: 'active'
  });
  const [products, setProducts] = useState([]); // Para el dropdown de productos

  // URLs de la API
  const API_BASE_URL = 'http://localhost:4000/wb'; // URL base del backend
  const API_URL = `${API_BASE_URL}/offers`;
  const PRODUCTS_API_URL = `${API_BASE_URL}/products`;

  // Obtener ofertas y productos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Configurar los headers con el token de autenticación
        const token = localStorage.getItem('token');
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };
        
        // Obtener todas las ofertas
        const offersResponse = await axios.get(API_URL, config);
        setOffers(offersResponse.data);
        
        // Obtener todos los productos para el dropdown
        const productsResponse = await axios.get(PRODUCTS_API_URL, config);
        setProducts(productsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, PRODUCTS_API_URL]); // Añadimos las dependencias para cumplir con ESLint

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Abrir formulario para crear una nueva oferta
  const handleNewOffer = () => {
    setModalType('create');
    setFormData({
      productId: '',
      discountType: 'percentage',
      percentage: '',
      value: '',
      from: '',
      to: '',
      state: 'active'
    });
    setFormVisible(true);
  };

  // Abrir formulario para editar una oferta existente
  const handleEdit = (offer) => {
    setModalType('edit');
    // Formatear fechas para el input date
    const formattedFrom = new Date(offer.from).toISOString().split('T')[0];
    const formattedTo = new Date(offer.to).toISOString().split('T')[0];
    
    setFormData({
      productId: offer.productId._id || offer.productId,
      discountType: offer.discountType,
      percentage: offer.percentage || '',
      value: offer.value || '',
      from: formattedFrom,
      to: formattedTo,
      state: offer.state
    });
    setCurrentOffer(offer);
    setFormVisible(true);
  };

  // Preparar eliminación de oferta
  const handleDeleteClick = (offer) => {
    setOfferToDelete(offer);
    setModalOpen(true);
  };

  // Confirmar eliminación de oferta
  const confirmDelete = async () => {
    if (!offerToDelete) return;
    
    try {
      // Configurar los headers con el token de autenticación
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      
      await axios.delete(`${API_URL}/${offerToDelete._id}`, config);
      // Actualizar la lista de ofertas después de eliminar
      setOffers(offers.filter(offer => offer._id !== offerToDelete._id));
      toast.success('Oferta eliminada correctamente');
      setModalOpen(false);
      setOfferToDelete(null);
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      toast.error('Error al eliminar la oferta');
    }
  };

  // Enviar formulario para crear o actualizar oferta
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Configurar los headers con el token de autenticación
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      
      if (modalType === 'create') {
        // Crear nueva oferta
        const response = await axios.post(API_URL, formData, config);
        setOffers([...offers, response.data.offer]);
        toast.success('Oferta creada correctamente');
      } else {
        // Actualizar oferta existente
        const response = await axios.put(`${API_URL}/${currentOffer._id}`, formData, config);
        setOffers(offers.map(item => 
          item._id === currentOffer._id ? response.data.offer : item
        ));
        toast.success('Oferta actualizada correctamente');
      }
      
      setFormVisible(false);
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al procesar la oferta');
      }
    }
  };

  // Formatear fecha para mostrar en la UI
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado con título y botón de nueva oferta */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Ofertas</h1>
        <button
          onClick={handleNewOffer}
          className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Oferta
        </button>
      </div>

      {/* Línea divisoria con espacio generoso */}
      <div className="border-b border-gray-200 my-16"></div>

      {/* Sección de lista de ofertas */}
      <div className="mt-24">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando ofertas...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay ofertas disponibles. ¡Crea una nueva!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white p-6 rounded-lg shadow-md">
                {/* Imagen del producto */}
                {offer.productId && (
                  <div className="mb-4">
                    {offer.productId.imagery && offer.productId.imagery.url ? (
                      <img 
                        src={offer.productId.imagery.url} 
                        alt={offer.productId.name} 
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                        <span className="text-gray-500 text-sm">Sin imagen</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold">
                    {offer.productId ? offer.productId.name : 'Producto no disponible'}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(offer.from).toLocaleDateString()} - {new Date(offer.to).toLocaleDateString()}
                  </p>
                  
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    offer.state === 'active' ? 'bg-green-100 text-green-800' :
                    offer.state === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {offer.state === 'active' ? 'Activa' : 
                     offer.state === 'scheduled' ? 'Programada' :
                     offer.state === 'expired' ? 'Expirada' : 'Inactiva'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">
                    <strong>Descuento:</strong> {
                      offer.discountType === 'percentage' 
                        ? `${offer.percentage}% de descuento` 
                        : `${offer.value} de descuento fijo`
                    }
                  </p>
                  <p className="text-gray-700">
                    <strong>Vigencia:</strong> {formatDate(offer.from)} - {formatDate(offer.to)}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleEdit(offer)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(offer)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para formulario de crear/editar */}
      {formVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'create' ? 'Crear Nueva Oferta' : 'Editar Oferta'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Producto</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Seleccionar Producto</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Tipo de Descuento</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed_value">Valor Fijo</option>
                </select>
              </div>
              
              {formData.discountType === 'percentage' ? (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Porcentaje (%)</label>
                  <input
                    type="number"
                    name="percentage"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Valor</label>
                  <input
                    type="number"
                    name="value"
                    min="0"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Desde</label>
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Hasta</label>
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Estado</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="active">Activa</option>
                  <option value="scheduled">Programada</option>
                  <option value="inactive">Inactiva</option>
                  <option value="expired">Expirada</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setFormVisible(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
                >
                  {modalType === 'create' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Oferta"
        message="¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default Offers;
