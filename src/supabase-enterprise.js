import { createClient } from '@supabase/supabase-js'

// Configuración Supabase - ServiPro Enterprise
const supabaseUrl = 'https://gtlyxvdzvgypdfrpeafp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bHl4dmR6dmd5cGRmcnBlYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTQzNjMsImV4cCI6MjA2ODE5MDM2M30.C_vKMZy5LnA1kdMIfise9IszjAgKAGoA7D0OWNXzeMM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===============================================
// FUNCIONES PARA USUARIOS
// ===============================================

// Crear nuevo usuario
export const createUser = async (userData) => {
  try {
    console.log('Creando usuario:', userData)
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_type: userData.userType || 'cliente',
        city: userData.city,
        source: 'website'
      }])
      .select()
      .single()

    if (error) throw error
    console.log('Usuario creado:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error creando usuario:', error)
    return { success: false, error: error.message }
  }
}

// Obtener perfil de usuario
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return { success: false, error: error.message }
  }
}

// Buscar profesionales por servicio y ubicación
export const searchProfessionals = async (serviceId, city, latitude = null, longitude = null) => {
  try {
    let query = supabase
      .from('professional_profiles')
      .select('*')
      .eq('is_available', true)

    if (serviceId) {
      query = query.contains('services', [serviceId])
    }

    if (city) {
      query = query.eq('city', city)
    }

    // Ordenar por rating y completados
    query = query.order('rating_average', { ascending: false })
    query = query.order('completed_bookings', { ascending: false })

    const { data, error } = await query.limit(20)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error buscando profesionales:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA SERVICIOS
// ===============================================

// Obtener todos los servicios activos
export const getActiveServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order')
      .order('name')

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo servicios:', error)
    return { success: false, error: error.message }
  }
}

// Obtener servicios por categoría
export const getServicesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .eq('category', category)
      .order('name')

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo servicios por categoría:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA BOOKINGS
// ===============================================

// Crear nuevo booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Creando booking:', bookingData)
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        client_id: bookingData.clientId,
        service_id: bookingData.serviceId,
        title: bookingData.title,
        description: bookingData.description,
        address: bookingData.address,
        city: bookingData.city,
        latitude: bookingData.latitude,
        longitude: bookingData.longitude,
        requested_date: bookingData.requestedDate,
        urgency_level: bookingData.urgencyLevel || 3,
        estimated_price: bookingData.estimatedPrice,
        client_notes: bookingData.clientNotes,
        source: 'website'
      }])
      .select()
      .single()

    if (error) throw error
    console.log('Booking creado:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error creando booking:', error)
    return { success: false, error: error.message }
  }
}

// Obtener bookings de un usuario
export const getUserBookings = async (userId, userType = 'client') => {
  try {
    const column = userType === 'client' ? 'client_id' : 'professional_id'
    
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .eq(column, userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo bookings:', error)
    return { success: false, error: error.message }
  }
}

// Asignar profesional a booking
export const assignProfessionalToBooking = async (bookingId, professionalId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        professional_id: professionalId,
        status: 'confirmed',
        scheduled_date: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error asignando profesional:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA MENSAJES
// ===============================================

// Enviar mensaje
export const sendMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        booking_id: messageData.bookingId,
        sender_id: messageData.senderId,
        recipient_id: messageData.recipientId,
        message_type: messageData.messageType || 'text',
        content: messageData.content,
        media_url: messageData.mediaUrl
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    return { success: false, error: error.message }
  }
}

// Obtener mensajes de un booking
export const getBookingMessages = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(first_name, last_name, avatar_url),
        recipient:users!recipient_id(first_name, last_name, avatar_url)
      `)
      .eq('booking_id', bookingId)
      .order('created_at')

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo mensajes:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA RATINGS
// ===============================================

// Crear rating/review
export const createRating = async (ratingData) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([{
        booking_id: ratingData.bookingId,
        reviewer_id: ratingData.reviewerId,
        reviewed_id: ratingData.reviewedId,
        service_id: ratingData.serviceId,
        overall_rating: ratingData.overallRating,
        quality_rating: ratingData.qualityRating,
        punctuality_rating: ratingData.punctualityRating,
        communication_rating: ratingData.communicationRating,
        price_rating: ratingData.priceRating,
        review_title: ratingData.reviewTitle,
        review_text: ratingData.reviewText,
        pros: ratingData.pros,
        cons: ratingData.cons
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creando rating:', error)
    return { success: false, error: error.message }
  }
}

// Obtener ratings de un profesional
export const getProfessionalRatings = async (professionalId) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        reviewer:users!reviewer_id(first_name, last_name, avatar_url),
        service:services(name)
      `)
      .eq('reviewed_id', professionalId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo ratings:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA PAGOS
// ===============================================

// Crear registro de pago
export const createPayment = async (paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        booking_id: paymentData.bookingId,
        client_id: paymentData.clientId,
        professional_id: paymentData.professionalId,
        subtotal: paymentData.subtotal,
        platform_fee: paymentData.platformFee || 0,
        taxes: paymentData.taxes || 0,
        total_amount: paymentData.totalAmount,
        payment_method: paymentData.paymentMethod,
        payment_provider: paymentData.paymentProvider,
        payment_intent_id: paymentData.paymentIntentId,
        external_id: paymentData.externalId
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creando pago:', error)
    return { success: false, error: error.message }
  }
}

// Actualizar estado de pago
export const updatePaymentStatus = async (paymentId, status, statusDetail = null) => {
  try {
    const updateData = { status }
    if (statusDetail) updateData.status_detail = statusDetail
    if (status === 'completed') updateData.captured_at = new Date().toISOString()
    if (status === 'failed') updateData.failed_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error actualizando pago:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES PARA NOTIFICACIONES
// ===============================================

// Crear notificación
export const createNotification = async (notificationData) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: notificationData.userId,
        booking_id: notificationData.bookingId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        action_url: notificationData.actionUrl,
        icon: notificationData.icon,
        priority: notificationData.priority || 3,
        data: notificationData.data
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creando notificación:', error)
    return { success: false, error: error.message }
  }
}

// Obtener notificaciones de usuario
export const getUserNotifications = async (userId, onlyUnread = false) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)

    if (onlyUnread) {
      query = query.eq('is_read', false)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query.limit(50)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES DE ADMINISTRACIÓN
// ===============================================

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    // Ejecutar múltiples consultas en paralelo
    const [
      totalUsers,
      totalProfessionals,
      totalBookings,
      totalPayments,
      todayBookings
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('user_type', 'profesional'),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('payments').select('total_amount').eq('status', 'completed'),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0])
    ])

    // Calcular total de ingresos
    const totalRevenue = totalPayments.data?.reduce((sum, payment) => sum + parseFloat(payment.total_amount || 0), 0) || 0

    return {
      success: true,
      data: {
        totalUsers: totalUsers.count || 0,
        totalProfessionals: totalProfessionals.count || 0,
        totalBookings: totalBookings.count || 0,
        totalRevenue: totalRevenue,
        todayBookings: todayBookings.count || 0
      }
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// FUNCIONES LEGACY (COMPATIBILIDAD)
// ===============================================

// Mantener función legacy para compatibilidad
export const insertRegistro = async (data) => {
  return await createUser({
    email: data.email,
    phone: data.telefono,
    firstName: data.nombre.split(' ')[0] || data.nombre,
    lastName: data.nombre.split(' ').slice(1).join(' ') || 'Usuario',
    userType: data.tipo,
    city: data.ciudad
  })
}

// Obtener registros (legacy)
export const getRegistros = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo registros:', error)
    return { success: false, error: error.message }
  }
}

// ===============================================
// UTILIDADES
// ===============================================

// Función para probar conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1)

    if (error) throw error
    console.log('✅ Conexión Supabase Enterprise exitosa')
    return true
  } catch (error) {
    console.error('❌ Error de conexión Supabase:', error)
    return false
  }
}

// Función para limpiar caché (si usas algún sistema de caché)
export const clearCache = () => {
  console.log('🧹 Cache limpiado')
  // Implementar lógica de limpieza si es necesario
}

export default supabase
