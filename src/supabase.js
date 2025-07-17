import { createClient } from '@supabase/supabase-js'

// 🚀 CONFIGURACIÓN SUPABASE - SERVIPRO ENTERPRISE  
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gtlyxvdzvgypdfrpeafp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bHl4dmR6dmd5cGRmcnBlYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTQzNjMsImV4cCI6MjA2ODE5MDM2M30.C_vKMZy5LnA1kdMIfise9IszjAgKAGoA7D0OWNXzeMM'

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ SUPABASE: Variables de entorno no configuradas correctamente');
  console.log('Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en tu archivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// ===============================================
// FUNCIONES ENTERPRISE OPTIMIZADAS
// ===============================================

// Crear usuario enterprise con validación mejorada
export const createUser = async (userData) => {
  try {
    console.log('🔄 Creando usuario enterprise:', userData)
    
    // Validaciones antes de insertar
    if (!userData.email || !userData.phone) {
      throw new Error('Email y teléfono son requeridos');
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone.trim(),
        first_name: userData.firstName || userData.nombre?.split(' ')[0] || userData.nombre,
        last_name: userData.lastName || userData.nombre?.split(' ').slice(1).join(' ') || 'Usuario',
        user_type: userData.userType || userData.tipo || 'cliente',
        city: userData.city || userData.ciudad || 'Buenos Aires',
        address: userData.address || null,
        source: 'website'
      }])
      .select()
      .single()

    if (error) {
      // Manejar errores específicos
      if (error.code === '23505') { // Duplicate key error
        throw new Error('Ya existe un usuario con este email');
      }
      throw error;
    }

    console.log('✅ Usuario enterprise creado:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message)
    return { success: false, error: error.message }
  }
}

// Obtener servicios enterprise con cache
let servicesCache = null;
let servicesCacheTime = null;

export const getActiveServices = async (forceRefresh = false) => {
  try {
    // Cache por 5 minutos
    const now = Date.now();
    if (!forceRefresh && servicesCache && servicesCacheTime && (now - servicesCacheTime < 5 * 60 * 1000)) {
      return { success: true, data: servicesCache };
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order')
      .order('name')

    if (error) throw error;

    servicesCache = data;
    servicesCacheTime = now;
    
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error.message)
    return { success: false, error: error.message }
  }
}

// Buscar profesionales enterprise con geolocalización
export const searchProfessionals = async (params = {}) => {
  try {
    const { serviceSlug, city, latitude, longitude, radius = 50, limit = 20 } = params;

    let query = supabase
      .from('users')
      .select(`
        id, first_name, last_name, business_name, description, avatar_url,
        years_experience, verified, city, rating_average, rating_count,
        completed_bookings, is_available, last_login,
        professional_services!inner(
          price_per_hour, price_fixed, price_negotiable, is_active, 
          service_id, max_distance_km,
          services(name, slug, icon)
        )
      `)
      .eq('user_type', 'profesional')
      .eq('is_active', true)
      .eq('professional_services.is_active', true)
      .limit(limit);

    // Filtros específicos
    if (serviceSlug) {
      query = query.eq('professional_services.services.slug', serviceSlug);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Post-procesar datos si hay coordenadas para ordenar por distancia
    let processedData = data || [];
    
    if (latitude && longitude && processedData.length > 0) {
      processedData = processedData.map(prof => {
        // Calcular distancia aproximada (formula haversine simplificada)
        if (prof.latitude && prof.longitude) {
          const R = 6371; // Radio de la Tierra en km
          const dLat = (prof.latitude - latitude) * Math.PI / 180;
          const dLon = (prof.longitude - longitude) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(latitude * Math.PI / 180) * Math.cos(prof.latitude * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return { ...prof, calculated_distance: distance };
        }
        return prof;
      }).sort((a, b) => (a.calculated_distance || 999) - (b.calculated_distance || 999));
    }

    return { success: true, data: processedData }
  } catch (error) {
    console.error('❌ Error buscando profesionales:', error.message)
    return { success: false, error: error.message }
  }
}

// Crear booking enterprise con validaciones
export const createBooking = async (bookingData) => {
  try {
    console.log('🔄 Creando booking enterprise:', bookingData)
    
    if (!bookingData.clientId || !bookingData.serviceId || !bookingData.title) {
      throw new Error('ClientId, ServiceId y título son requeridos');
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        client_id: bookingData.clientId,
        professional_id: bookingData.professionalId || null,
        service_id: bookingData.serviceId,
        title: bookingData.title.trim(),
        description: bookingData.description?.trim() || null,
        address: bookingData.address?.trim(),
        city: bookingData.city?.trim() || 'Buenos Aires',
        latitude: bookingData.latitude,
        longitude: bookingData.longitude,
        requested_date: bookingData.requestedDate,
        urgency_level: bookingData.urgencyLevel || 3,
        estimated_price: bookingData.estimatedPrice || 0,
        client_notes: bookingData.clientNotes?.trim() || null,
        source: 'website'
      }])
      .select()
      .single()

    if (error) throw error;

    console.log('✅ Booking enterprise creado:', data)
    
    // Trigger auto-assignment si está habilitado
    if (import.meta.env.VITE_ENABLE_AI_MATCHING === 'true') {
      console.log('🤖 Iniciando auto-assignment con IA...');
      // Aquí se podría llamar a una función edge de Supabase para auto-assignment
    }

    return { success: true, data }
  } catch (error) {
    console.error('❌ Error creando booking:', error.message)
    return { success: false, error: error.message }
  }
}

// Obtener estadísticas dashboard optimizado
export const getDashboardStats = async () => {
  try {
    // Ejecutar consultas en paralelo para mejor performance
    const [usersResult, professionalsResult, bookingsResult, servicesResult] = await Promise.allSettled([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('user_type', 'profesional').eq('is_active', true),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }).eq('status', 'active')
    ]);

    return {
      success: true,
      data: {
        totalUsers: usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0,
        totalProfessionals: professionalsResult.status === 'fulfilled' ? (professionalsResult.value.count || 0) : 0,
        totalBookings: bookingsResult.status === 'fulfilled' ? (bookingsResult.value.count || 0) : 0,
        totalServices: servicesResult.status === 'fulfilled' ? (servicesResult.value.count || 0) : 0
      }
    }
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message)
    return { success: false, error: error.message }
  }
}

// Función para obtener métricas en tiempo real
export const getRealTimeMetrics = async () => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [todayBookings, weeklyBookings, onlineProfessionals] = await Promise.allSettled([
      supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', thisWeek),
      supabase.from('users').select('id', { count: 'exact', head: true })
        .eq('user_type', 'profesional')
        .eq('is_available', true)
        .gte('last_login', new Date(now.getTime() - 60 * 60 * 1000).toISOString()) // Última hora
    ]);

    return {
      success: true,
      data: {
        todayBookings: todayBookings.status === 'fulfilled' ? (todayBookings.value.count || 0) : 0,
        weeklyBookings: weeklyBookings.status === 'fulfilled' ? (weeklyBookings.value.count || 0) : 0,
        onlineProfessionals: onlineProfessionals.status === 'fulfilled' ? (onlineProfessionals.value.count || 0) : 0,
        timestamp: now.toISOString()
      }
    }
  } catch (error) {
    console.error('❌ Error obteniendo métricas tiempo real:', error.message)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES LEGACY (COMPATIBILIDAD)
// ===============================================

export const insertRegistro = async (data) => {
  return await createUser({
    email: data.email,
    phone: data.telefono,
    nombre: data.nombre,
    tipo: data.tipo,
    servicio: data.servicio
  })
}

export const getRegistros = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100) // Limitar para performance

    if (error) throw error;
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error obteniendo registros:', error.message)
    return { success: false, error: error.message }
  }
}

// Función mejorada para probar conexión
export const testConnection = async () => {
  try {
    console.log('🔄 Probando conexión a Supabase...');
    
    const { data, error } = await supabase
      .from('services')
      .select('count(*)')
      .limit(1)
      .single()

    if (error) throw error;
    
    console.log('✅ Conexión Supabase Enterprise exitosa');
    return { 
      success: true, 
      message: 'Conexión exitosa',
      timestamp: new Date().toISOString(),
      url: supabaseUrl
    }
  } catch (error) {
    console.error('❌ Error de conexión Supabase:', error.message)
    return { 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      url: supabaseUrl
    }
  }
}

// Configuración de realtime (opcional)
export const subscribeToBookings = (callback) => {
  if (import.meta.env.VITE_ENABLE_REAL_TIME !== 'true') {
    console.log('⚠️ Realtime deshabilitado por configuración');
    return null;
  }

  console.log('🔄 Configurando suscripción realtime para bookings...');
  
  const subscription = supabase
    .channel('bookings_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'bookings' },
      (payload) => {
        console.log('📡 Cambio en bookings:', payload);
        if (callback) callback(payload);
      }
    )
    .subscribe();

  return subscription;
}

// Función de utilidad para formatear errores
export const formatSupabaseError = (error) => {
  const errorMessages = {
    '23505': 'Ya existe un registro con estos datos',
    '23503': 'Referencia a datos inexistentes',
    '42501': 'Permisos insuficientes',
    'PGRST116': 'No se encontraron resultados'
  };

  return errorMessages[error.code] || error.message || 'Error desconocido';
}

export default supabase