import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  Users, 
  Zap, 
  ChevronRight, 
  Play,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Globe,
  Smartphone
} from 'lucide-react';

const App = () => {
  const [activeService, setActiveService] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [formData, setFormData] = useState({
    type: 'usuario',
    nombre: '',
    email: '',
    telefono: '',
    servicio: ''
  });

  // Datos dinámicos
  const stats = [
    { label: 'Profesionales Activos', value: '45,000+', growth: '+25% mensual' },
    { label: 'Usuarios Registrados', value: '2.5M+', growth: '+40% mensual' },
    { label: 'Servicios Completados', value: '850K+', growth: '+60% mensual' },
    { label: 'Precisión IA', value: '98.7%', growth: 'Líder mercado' }
  ];

  const services = [
    { name: 'Plomería', icon: '🔧', professionals: 8500, rating: 4.9 },
    { name: 'Electricidad', icon: '⚡', professionals: 6200, rating: 4.8 },
    { name: 'Limpieza', icon: '🧹', professionals: 12000, rating: 4.9 },
    { name: 'Carpintería', icon: '🔨', professionals: 4800, rating: 4.7 },
    { name: 'Pintura', icon: '🎨', professionals: 7200, rating: 4.8 },
    { name: 'Jardinería', icon: '🌱', professionals: 3500, rating: 4.9 }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Propietaria de hogar',
      image: '👩‍💼',
      text: 'Encontré un plomero en 3 minutos. La IA de ServiPro es increíble, me conectó con el profesional perfecto.',
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      role: 'Electricista Certificado',
      image: '👨‍🔧',
      text: 'Desde que uso ServiPro, mis ingresos aumentaron 300%. Los leads son de altísima calidad.',
      rating: 5
    },
    {
      name: 'Ana Rodríguez',
      role: 'Gerente de Propiedades',
      image: '👩‍💻',
      text: 'Gestiono 50+ propiedades. ServiPro Enterprise me ahorra 20 horas semanales.',
      rating: 5
    }
  ];

  // Animación de estadísticas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    alert(`¡Gracias ${formData.nombre}! Te contactaremos pronto para comenzar tu experiencia ServiPro.`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ServiPro</h1>
                <p className="text-xs text-gray-500">Enterprise</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</a>
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 font-medium">Servicios</a>
              <a href="#profesionales" className="text-gray-700 hover:text-blue-600 font-medium">Profesionales</a>
              <a href="#empresa" className="text-gray-700 hover:text-blue-600 font-medium">Empresa</a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 font-medium">Contacto</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Iniciar Sesión</button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium">
                Registrarse
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a href="#inicio" className="block text-gray-700 font-medium">Inicio</a>
              <a href="#servicios" className="block text-gray-700 font-medium">Servicios</a>
              <a href="#profesionales" className="block text-gray-700 font-medium">Profesionales</a>
              <a href="#empresa" className="block text-gray-700 font-medium">Empresa</a>
              <a href="#contacto" className="block text-gray-700 font-medium">Contacto</a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="block w-full text-left text-gray-700 font-medium">Iniciar Sesión</button>
                <button className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl font-medium">
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                #1 Plataforma de Servicios con IA
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                El Futuro de los
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500"> Servicios Profesionales</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La única plataforma que combina <strong>Inteligencia Artificial</strong>, 
                <strong> GPS submétrico</strong> y <strong>Video HD</strong> para conectar 
                a 45,000+ profesionales verificados con clientes que necesitan servicios de calidad.
              </p>

              {/* Statistics Carousel */}
              <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats[currentStat].value}</p>
                    <p className="text-gray-600">{stats[currentStat].label}</p>
                    <p className="text-green-600 text-sm font-medium">{stats[currentStat].growth}</p>
                  </div>
                  <div className="text-4xl">
                    {currentStat === 0 && '👥'}
                    {currentStat === 1 && '📱'}
                    {currentStat === 2 && '✅'}
                    {currentStat === 3 && '🤖'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center group">
                  Solicitar Servicio
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo (2 min)
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Matching Inteligente en Vivo</h3>
                
                {/* Simulador de Matching */}
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">IA analizando solicitud...</span>
                    </div>
                    <div className="text-sm opacity-90">
                      "Necesito un plomero urgente para fuga de agua"
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Match encontrado: 98.7%</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Carlos M. - Plomero Certificado</p>
                      <p className="opacity-90">📍 A 2.1km - Disponible ahora</p>
                      <p className="opacity-90">850+ servicios completados</p>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Profesional en camino - ETA: 23 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-xl shadow-lg animate-float">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-xl shadow-lg animate-float">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              48 Oficios Especializados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde servicios de emergencia hasta proyectos planificados, 
              tenemos al profesional perfecto para cada necesidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                  activeService === index ? 'border-blue-500 scale-105' : 'border-transparent'
                }`}
                onClick={() => setActiveService(index)}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{service.professionals.toLocaleString()} profesionales</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-600 font-medium">
                  Ver disponibilidad
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all">
              Ver Todos los Servicios
            </button>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-gray-600">
              La primera plataforma que combina IA, GPS submétrico y video HD
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">IA Avanzada</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritmos de matching con 98.7% de precisión. 
                Nuestro sistema analiza 50+ variables para encontrar 
                el profesional perfecto en segundos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GPS Submétrico</h3>
              <p className="text-gray-600 leading-relaxed">
                Tracking en tiempo real con precisión de ±2.1 metros. 
                Sigue la ubicación exacta de tu profesional y 
                recibe notificaciones de llegada.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Video + Diagnóstico</h3>
              <p className="text-gray-600 leading-relaxed">
                Video llamadas HD con diagnóstico automático. 
                La IA analiza el problema visualmente y 
                sugiere soluciones antes de la visita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo Que Dicen Nuestros Usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Más de 850,000 servicios completados con 96% de satisfacción
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.image}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comienza Tu Experiencia ServiPro
            </h2>
            <p className="text-xl text-gray-600">
              Regístrate ahora y descubre por qué somos la plataforma #1
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8">
            <div className="space-y-6">
              {/* Tipo de usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Cómo quieres usar ServiPro?
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.type === 'usuario' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="usuario"
                      checked={formData.type === 'usuario'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Necesito Servicios</h3>
                      <p className="text-sm text-gray-600">Encuentra profesionales verificados</p>
                    </div>
                  </label>

                  <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.type === 'profesional' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="profesional"
                      checked={formData.type === 'profesional'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Award className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <h3 className="font-semibold">Soy Profesional</h3>
                      <p className="text-sm text-gray-600">Aumenta tus ingresos con IA</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Información personal */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'usuario' ? 'Servicio Necesario' : 'Tu Especialidad'}
                  </label>
                  <select
                    value={formData.servicio}
                    onChange={(e) => setFormData({...formData, servicio: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una opción</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-orange-600 transition-all"
              >
                {formData.type === 'usuario' ? 'Encontrar Profesionales' : 'Unirme como Profesional'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ServiPro</h3>
                  <p className="text-sm text-gray-400">Enterprise</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                La plataforma de servicios profesionales más avanzada del mundo, 
                potenciada por Inteligencia Artificial.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  📱
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  💼
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  🐦
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Para Usuarios</a></li>
                <li><a href="#" className="hover:text-white">Para Profesionales</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
                <li><a href="#" className="hover:text-white">APIs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white">Carreras</a></li>
                <li><a href="#" className="hover:text-white">Prensa</a></li>
                <li><a href="#" className="hover:text-white">Inversionistas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" />
                  <span>hola@servipro.ai</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ServiPro Enterprise. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 lg:mt-0">
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
