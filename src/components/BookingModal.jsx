import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, MessageSquare, User, Phone, Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { createBooking, createUser, getActiveServices } from '../supabase';

const BookingModal = ({ isOpen, onClose, selectedService, selectedProfessional }) => {
  const [step, setStep] = useState(1); // 1: Cliente, 2: Servicio, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Buenos Aires'
  });

  const [bookingData, setBookingData] = useState({
    serviceId: selectedService?.id || '',
    professionalId: selectedProfessional?.id || '',
    title: '',
    description: '',
    urgencyLevel: 3,
    requestedDate: '',
    requestedTime: '',
    estimatedPrice: 0,
    clientNotes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadServices();
      if (selectedService) {
        setBookingData(prev => ({
          ...prev,
          serviceId: selectedService.id,
          title: `Servicio de ${selectedService.name}`,
          estimatedPrice: selectedService.base_price || 0
        }));
      }
      if (selectedProfessional) {
        setBookingData(prev => ({
          ...prev,
          professionalId: selectedProfessional.id
        }));
      }
    }
  }, [isOpen, selectedService, selectedProfessional]);

  const loadServices = async () => {
    const result = await getActiveServices();
    if (result.success) {
      setServices(result.data);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitStatus(null);

    try {
      // 1. Crear usuario si no existe
      const userResult = await createUser({
        email: clientData.email,
        phone: clientData.phone,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        userType: 'cliente',
        city: clientData.city,
        address: clientData.address
      });

      if (!userResult.success) {
        throw new Error(userResult.error);
      }

      // 2. Crear booking
      const bookingResult = await createBooking({
        clientId: userResult.data.id,
        serviceId: bookingData.serviceId,
        professionalId: bookingData.professionalId || null,
        title: bookingData.title,
        description: bookingData.description,
        address: clientData.address,
        city: clientData.city,
        requestedDate: bookingData.requestedDate ? new Date(`${bookingData.requestedDate}T${bookingData.requestedTime || '09:00'}`).toISOString() : null,
        urgencyLevel: bookingData.urgencyLevel,
        estimatedPrice: bookingData.estimatedPrice,
        clientNotes: bookingData.clientNotes
      });

      if (!bookingResult.success) {
        throw new Error(bookingResult.error);
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setStep(1);
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error creando booking:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Solicitar Servicio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`h-1 w-16 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Datos del Cliente</span>
            <span>Detalles del Servicio</span>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Información del Cliente
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.firstName}
                    onChange={(e) => setClientData({...clientData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.lastName}
                    onChange={(e) => setClientData({...clientData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={clientData.address}
                  onChange={(e) => setClientData({...clientData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Av. Corrientes 1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={clientData.city}
                  onChange={(e) => setClientData({...clientData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Buenos Aires"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detalles del Servicio
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio *
                </label>
                <select
                  required
                  value={bookingData.serviceId}
                  onChange={(e) => {
                    const service = services.find(s => s.id === e.target.value);
                    setBookingData({
                      ...bookingData, 
                      serviceId: e.target.value,
                      title: service ? `Servicio de ${service.name}` : '',
                      estimatedPrice: service?.base_price || 0
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.icon} {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del servicio *
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.title}
                  onChange={(e) => setBookingData({...bookingData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Reparación de grifo en cocina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del problema
                </label>
                <textarea
                  value={bookingData.description}
                  onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe detalladamente el problema o servicio que necesitas..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha preferida
                  </label>
                  <input
                    type="date"
                    value={bookingData.requestedDate}
                    onChange={(e) => setBookingData({...bookingData, requestedDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora preferida
                  </label>
                  <input
                    type="time"
                    value={bookingData.requestedTime}
                    onChange={(e) => setBookingData({...bookingData, requestedTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de urgencia
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setBookingData({...bookingData, urgencyLevel: level})}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        bookingData.urgencyLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {level}
                      {level === 1 && <div className="text-xs">Baja</div>}
                      {level === 3 && <div className="text-xs">Normal</div>}
                      {level === 5 && <div className="text-xs">Urgente</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  value={bookingData.clientNotes}
                  onChange={(e) => setBookingData({...bookingData, clientNotes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Información adicional que pueda ser útil para el profesional..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirmar Solicitud
              </h3>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">¡Solicitud enviada!</h4>
                    <p className="text-green-700 text-sm">Te contactaremos pronto con profesionales disponibles.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-900">Error al enviar</h4>
                    <p className="text-red-700 text-sm">Hubo un problema. Intenta nuevamente.</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h4 className="font-semibold text-gray-900">Resumen de la solicitud:</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span>{clientData.firstName} {clientData.lastName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span>{clientData.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{clientData.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{clientData.address}, {clientData.city}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <span>{bookingData.title}</span>
                  </div>
                  
                  {bookingData.requestedDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span>
                        {new Date(bookingData.requestedDate).toLocaleDateString('es-AR')}
                        {bookingData.requestedTime && ` a las ${bookingData.requestedTime}`}
                      </span>
                    </div>
                  )}
                  
                  {bookingData.estimatedPrice > 0 && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <span>Precio estimado: ${bookingData.estimatedPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={step === 1 ? onClose : handlePrevStep}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={
                (step === 1 && (!clientData.firstName || !clientData.lastName || !clientData.email || !clientData.phone || !clientData.address)) ||
                (step === 2 && (!bookingData.serviceId || !bookingData.title))
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || submitStatus === 'success'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : submitStatus === 'success' ? (
                'Enviado ✓'
              ) : (
                'Confirmar Solicitud'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;