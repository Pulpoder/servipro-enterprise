import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp, ChevronRight, Loader, MapPin } from 'lucide-react';
import { getActiveServices } from '../supabase';

const DynamicServices = ({ onServiceSelect }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await getActiveServices();
      if (result.success) {
        setServices(result.data);
      } else {
        console.error('Error cargando servicios:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const handleServiceClick = (service) => {
    setActiveService(service.id);
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando servicios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Buscador de servicios */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Servicios agrupados por categoría */}
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            {getCategoryIcon(category)}
            <span className="ml-3">{category}</span>
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {categoryServices.length}
            </span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isActive={activeService === service.id}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>
      ))}

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, isActive, onClick }) => {
  const priceRange = service.min_price && service.max_price 
    ? `$${service.min_price} - $${service.max_price}`
    : service.base_price 
    ? `Desde $${service.base_price}`
    : 'Precio variable';

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 transform hover:scale-105 ${
        isActive ? 'border-blue-500 scale-105 shadow-xl' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{service.icon || '🛠️'}</div>
        {service.is_emergency && (
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Emergencia
          </div>
        )}
      </div>

      <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
      
      {service.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {service.total_professionals || 0} profesionales
            </span>
          </div>
          {service.average_rating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{service.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {priceRange}
            {service.price_unit && (
              <span className="text-xs">/{service.price_unit}</span>
            )}
          </div>
          
          {service.total_bookings > 0 && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{service.total_bookings} servicios</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-medium text-sm">
              Ver profesionales
            </span>
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'Hogar': '🏠',
    'Mantenimiento': '🔧',
    'Jardinería': '🌱',
    'Tecnología': '💻',
    'Belleza': '💄',
    'Emergencia': '🚨',
    'Transporte': '🚚',
    'Educación': '📚',
    'Salud': '⚕️',
    'Eventos': '🎉'
  };
  return <span className="text-2xl">{icons[category] || '🛠️'}</span>;
};

export default DynamicServices;