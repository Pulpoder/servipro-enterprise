import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Shield, Phone, MessageSquare, Calendar, Loader } from 'lucide-react';
import { searchProfessionals, getActiveServices } from '../supabase';

const SearchProfessionals = () => {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    service: '',
    city: '',
    searchText: ''
  });
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const result = await getActiveServices();
    if (result.success) {
      setServices(result.data);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await searchProfessionals(searchParams.service, searchParams.city);
      if (result.success) {
        setProfessionals(result.data);
      } else {
        console.error('Error en búsqueda:', result.error);
        setProfessionals([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (professional) => {
    setSelectedProfessional(professional);
    // Aquí iría la lógica del modal de booking
    alert(`Solicitando servicio de ${professional.first_name} ${professional.last_name}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Buscador */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Encuentra tu Profesional Ideal</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label>
            <select
              value={searchParams.service}
              onChange={(e) => setSearchParams({...searchParams, service: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los servicios</option>
              {services.map((service) => (
                <option key={service.id} value={service.slug}>
                  {service.icon} {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
            <input
              type="text"
              value={searchParams.city}
              onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
              placeholder="Buenos Aires, CABA"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {professionals.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">
            {professionals.length} profesionales encontrados
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <div key={professional.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {professional.first_name[0]}{professional.last_name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {professional.first_name} {professional.last_name}
                      </h4>
                      {professional.business_name && (
                        <p className="text-blue-600 font-medium">{professional.business_name}</p>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{professional.city}</span>
                        {professional.verified && (
                          <Shield className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{professional.rating_average}</span>
                      <span className="text-gray-500 text-sm">({professional.rating_count})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {professional.completed_bookings} servicios
                    </div>
                  </div>
                </div>

                {professional.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{professional.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{professional.years_experience} años exp.</span>
                    </div>
                    {professional.is_available && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Disponible</span>
                      </div>
                    )}
                  </div>

                  {professional.professional_services[0] && (
                    <div className="text-right">
                      <span className="font-bold text-gray-900">
                        ${professional.professional_services[0].price_per_hour}/hora
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBooking(professional)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Solicitar Servicio
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!loading && professionals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Realiza una búsqueda
          </h3>
          <p className="text-gray-600">
            Encuentra profesionales verificados cerca de ti
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchProfessionals;