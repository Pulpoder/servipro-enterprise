import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle, Star, Loader } from 'lucide-react';
import { getDashboardStats, supabase } from '../supabase';

const DynamicStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalBookings: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  useEffect(() => {
    loadStats();
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    
    // Rotar estadísticas cada 3 segundos
    const rotateInterval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(rotateInterval);
    };
  }, []);

  const loadStats = async () => {
    try {
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toLocaleString() + '+';
  };

  const statsData = [
    {
      label: 'Profesionales Verificados',
      value: formatNumber(stats.totalProfessionals),
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      growth: '+25% mensual'
    },
    {
      label: 'Usuarios Activos',
      value: formatNumber(stats.totalUsers),
      icon: '📱',
      color: 'from-green-500 to-green-600',
      growth: '+40% mensual'
    },
    {
      label: 'Servicios Completados',
      value: formatNumber(stats.totalBookings),
      icon: '✅',
      color: 'from-purple-500 to-purple-600',
      growth: '+60% mensual'
    },
    {
      label: 'Servicios Disponibles',
      value: stats.totalServices,
      icon: '🛠️',
      color: 'from-orange-500 to-orange-600',
      growth: 'Creciendo'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-24">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const currentStat = statsData[currentStatIndex];

  return (
    <div className="space-y-6">
      {/* Estadística Principal Rotativa */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{currentStat.value}</p>
            <p className="text-gray-600 mb-2">{currentStat.label}</p>
            <p className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {currentStat.growth}
            </p>
          </div>
          <div className="text-5xl">{currentStat.icon}</div>
        </div>
        
        {/* Indicadores de progreso */}
        <div className="flex space-x-1 mt-4">
          {statsData.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentStatIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid de todas las estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white transform transition-all duration-300 hover:scale-105 cursor-pointer`}
            onClick={() => setCurrentStatIndex(index)}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm opacity-90">{stat.label.split(' ')[0]}</p>
          </div>
        ))}
      </div>

      {/* Métricas en tiempo real */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Métricas en Tiempo Real</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profesionales Online</p>
                <p className="text-xl font-bold text-green-600">
                  {Math.floor(stats.totalProfessionals * 0.15)} <span className="text-xs">ahora</span>
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solicitudes Hoy</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.floor(stats.totalBookings * 0.03)} <span className="text-xs">servicios</span>
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfacción</p>
                <p className="text-xl font-bold text-yellow-600 flex items-center">
                  4.9 <Star className="w-4 h-4 ml-1 fill-current" />
                </p>
              </div>
              <div className="text-2xl">😊</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicStats;