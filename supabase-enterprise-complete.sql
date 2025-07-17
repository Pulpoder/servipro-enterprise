-- 🚀 SERVIPRO ENTERPRISE - CONFIGURACIÓN SUPABASE COMPLETA
-- Ejecutar en: https://supabase.com/dashboard/project/gtlyxvdzvgypdfrpeafp/sql
-- Versión: Enterprise v2.0 - Julio 2025

-- ===============================================
-- 1. EXTENSIONES NECESARIAS
-- ===============================================

-- Habilitar extensiones de PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===============================================
-- 2. ENUM TYPES
-- ===============================================

-- Tipos de usuario
DROP TYPE IF EXISTS user_type CASCADE;
CREATE TYPE user_type AS ENUM ('cliente', 'profesional', 'admin');

-- Estados de servicios
DROP TYPE IF EXISTS service_status CASCADE;
CREATE TYPE service_status AS ENUM ('active', 'inactive', 'maintenance');

-- Estados de bookings
DROP TYPE IF EXISTS booking_status CASCADE;
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');

-- Estados de pagos
DROP TYPE IF EXISTS payment_status CASCADE;
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- ===============================================
-- 3. TABLA DE USUARIOS (REEMPLAZO DE REGISTROS)
-- ===============================================

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Auth (vinculado con Supabase Auth)
  auth_id UUID REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  
  -- Perfil básico
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type user_type NOT NULL DEFAULT 'cliente',
  
  -- Perfil profesional (solo para profesionales)
  business_name TEXT,
  description TEXT,
  years_experience INTEGER,
  certifications TEXT[],
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  
  -- Ubicación
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Argentina',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  location GEOGRAPHY(POINT),
  
  -- Configuración
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT true,
  
  -- Estadísticas
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  
  -- Metadata
  source TEXT DEFAULT 'website',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  last_login TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_rating CHECK (rating_average >= 0 AND rating_average <= 5),
  CONSTRAINT valid_experience CHECK (years_experience >= 0 AND years_experience <= 50)
);

-- Índices para users
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_is_available ON users(is_available);
CREATE INDEX idx_users_verified ON users(verified) WHERE verified = true;
CREATE INDEX idx_users_location ON users USING GIST(location) WHERE location IS NOT NULL;
CREATE INDEX idx_users_rating ON users(rating_average DESC) WHERE user_type = 'profesional';
CREATE INDEX idx_users_email_gin ON users USING gin(email gin_trgm_ops);

-- ===============================================
-- 4. TABLA DE SERVICIOS/CATEGORÍAS
-- ===============================================

DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Información del servicio
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- emoji o nombre de ícono
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Configuración
  status service_status DEFAULT 'active',
  is_emergency BOOLEAN DEFAULT false,
  requires_quote BOOLEAN DEFAULT false,
  
  -- Precios (sugeridos)
  base_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  price_unit TEXT DEFAULT 'hora', -- hora, servicio, m2, etc.
  
  -- Metadata
  total_professionals INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  display_order INTEGER DEFAULT 0
);

-- Servicios iniciales
INSERT INTO services (name, slug, description, icon, category, is_emergency, base_price, min_price, max_price) VALUES
('Plomería General', 'plomeria-general', 'Reparaciones de plomería, destapes, instalaciones', '🔧', 'Hogar', true, 2500.00, 1500.00, 5000.00),
('Electricidad Residencial', 'electricidad-residencial', 'Instalaciones eléctricas, reparaciones, cableado', '⚡', 'Hogar', true, 3000.00, 2000.00, 8000.00),
('Limpieza Profunda', 'limpieza-profunda', 'Limpieza profunda de hogares y oficinas', '🧹', 'Limpieza', false, 1800.00, 1200.00, 3000.00),
('Carpintería', 'carpinteria', 'Muebles a medida, reparaciones de madera', '🔨', 'Construcción', false, 2200.00, 1500.00, 6000.00),
('Pintura Interior/Exterior', 'pintura', 'Pintura de paredes, techos, fachadas', '🎨', 'Construcción', false, 2000.00, 1200.00, 4000.00),
('Jardinería y Paisajismo', 'jardineria', 'Mantenimiento de jardines, diseño paisajístico', '🌱', 'Exterior', false, 1500.00, 1000.00, 3500.00),
('Aire Acondicionado', 'aire-acondicionado', 'Instalación, reparación y mantenimiento AC', '❄️', 'Hogar', true, 3500.00, 2500.00, 8000.00),
('Cerrajería', 'cerrajeria', 'Apertura de puertas, cambio de cerraduras', '🔑', 'Seguridad', true, 2800.00, 2000.00, 5000.00);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_is_emergency ON services(is_emergency);
CREATE INDEX idx_services_slug ON services(slug);

-- ===============================================
-- 5. TABLA PROFESIONALES-SERVICIOS (MANY-TO-MANY)
-- ===============================================

DROP TABLE IF EXISTS professional_services CASCADE;
CREATE TABLE professional_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relaciones
  professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Configuración específica
  price_per_hour DECIMAL(10,2),
  price_fixed DECIMAL(10,2),
  price_negotiable BOOLEAN DEFAULT true,
  description TEXT,
  
  -- Disponibilidad
  is_active BOOLEAN DEFAULT true,
  max_distance_km INTEGER DEFAULT 50,
  
  -- Estadísticas
  total_bookings INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  
  UNIQUE(professional_id, service_id)
);

CREATE INDEX idx_prof_services_professional ON professional_services(professional_id);
CREATE INDEX idx_prof_services_service ON professional_services(service_id);
CREATE INDEX idx_prof_services_active ON professional_services(is_active);

-- ===============================================
-- 6. TABLA DE BOOKINGS/CITAS
-- ===============================================

DROP TABLE IF EXISTS bookings CASCADE;
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Número de booking único
  booking_number TEXT UNIQUE NOT NULL DEFAULT 'SP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(floor(random() * 9999 + 1)::TEXT, 4, '0'),
  
  -- Relaciones
  client_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES services(id),
  
  -- Información del servicio
  title TEXT NOT NULL,
  description TEXT,
  urgency_level INTEGER DEFAULT 3 CHECK (urgency_level BETWEEN 1 AND 5),
  
  -- Ubicación
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  location GEOGRAPHY(POINT),
  
  -- Fechas y tiempos
  requested_date TIMESTAMPTZ,
  scheduled_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Estado y tracking
  status booking_status DEFAULT 'pending',
  status_notes TEXT,
  
  -- Precios
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  currency TEXT DEFAULT 'ARS',
  
  -- Distancia y tiempo estimado
  distance_km DECIMAL(8,2),
  estimated_duration_minutes INTEGER,
  
  -- Media
  photos TEXT[], -- URLs de fotos
  videos TEXT[], -- URLs de videos
  
  -- Notas
  client_notes TEXT,
  professional_notes TEXT,
  admin_notes TEXT,
  
  -- AI Matching score
  ai_match_score DECIMAL(5,2), -- Puntuación del algoritmo IA
  ai_suggestions JSONB, -- Sugerencias del algoritmo
  
  -- Metadata
  source TEXT DEFAULT 'website',
  referred_by UUID REFERENCES users(id)
);

-- Índices para bookings
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_professional ON bookings(professional_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_requested_date ON bookings(requested_date);
CREATE INDEX idx_bookings_city ON bookings(city);
CREATE INDEX idx_bookings_urgency ON bookings(urgency_level DESC);
CREATE INDEX idx_bookings_location ON bookings USING GIST(location) WHERE location IS NOT NULL;

-- ===============================================
-- 7. TABLA DE MENSAJES/CHAT
-- ===============================================

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relaciones
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  
  -- Contenido
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'location', 'system')),
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  media_size INTEGER,
  
  -- Estado
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Sistema
  is_system_message BOOLEAN DEFAULT false,
  system_event TEXT, -- booking_created, professional_assigned, etc.
  
  -- Metadata
  reply_to UUID REFERENCES messages(id),
  edited_at TIMESTAMPTZ,
  client_ip TEXT
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- ===============================================
-- 8. TABLA DE RATINGS/REVIEWS
-- ===============================================

DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relaciones
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id), -- quien hace la review
  reviewed_id UUID NOT NULL REFERENCES users(id), -- quien recibe la review
  service_id UUID NOT NULL REFERENCES services(id),
  
  -- Ratings (1-5 estrellas)
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  price_rating INTEGER CHECK (price_rating BETWEEN 1 AND 5),
  
  -- Review
  review_title TEXT,
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  
  -- Respuesta del profesional
  professional_response TEXT,
  professional_response_date TIMESTAMPTZ,
  
  -- Estado
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  -- Metadata
  helpful_votes INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  
  UNIQUE(booking_id, reviewer_id)
);

CREATE INDEX idx_ratings_reviewed ON ratings(reviewed_id);
CREATE INDEX idx_ratings_reviewer ON ratings(reviewer_id);
CREATE INDEX idx_ratings_booking ON ratings(booking_id);
CREATE INDEX idx_ratings_service ON ratings(service_id);
CREATE INDEX idx_ratings_overall ON ratings(overall_rating DESC);
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);
CREATE INDEX idx_ratings_featured ON ratings(is_featured) WHERE is_featured = true;

-- ===============================================
-- 9. TABLA DE PAGOS
-- ===============================================

DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relaciones
  booking_id UUID NOT NULL REFERENCES bookings(id),
  client_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID NOT NULL REFERENCES users(id),
  
  -- Identificadores externos
  payment_intent_id TEXT, -- Stripe/MercadoPago ID
  transaction_id TEXT,
  external_id TEXT,
  
  -- Montos
  subtotal DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0.00,
  professional_fee DECIMAL(10,2) DEFAULT 0.00,
  taxes DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ARS',
  
  -- Método de pago
  payment_method TEXT NOT NULL, -- credit_card, debit_card, bank_transfer, cash, mercadopago
  payment_provider TEXT, -- stripe, mercadopago, custom
  
  -- Estado
  status payment_status DEFAULT 'pending',
  status_detail TEXT,
  
  -- Fechas
  authorized_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  -- Información de pago
  payment_info JSONB, -- Datos adicionales del proveedor
  receipt_url TEXT,
  
  -- Refunds
  refund_amount DECIMAL(10,2) DEFAULT 0.00,
  refund_reason TEXT,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  risk_score INTEGER DEFAULT 0
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_professional ON payments(professional_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_external_id ON payments(external_id) WHERE external_id IS NOT NULL;

-- ===============================================
-- 10. TABLA DE NOTIFICACIONES
-- ===============================================

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relaciones
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  
  -- Contenido
  type TEXT NOT NULL, -- booking_created, professional_assigned, payment_completed, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  icon TEXT,
  
  -- Estado
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Canales
  sent_email BOOLEAN DEFAULT false,
  sent_sms BOOLEAN DEFAULT false,
  sent_push BOOLEAN DEFAULT false,
  
  -- Prioridad
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  
  -- Metadata
  data JSONB,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON notifications(type);

-- ===============================================
-- 11. MIGRAR DATOS EXISTENTES
-- ===============================================

-- Migrar datos de la tabla 'registros' existente a 'users'
INSERT INTO users (
  email, 
  phone, 
  first_name, 
  last_name, 
  user_type,
  source,
  created_at
)
SELECT 
  email,
  telefono,
  SPLIT_PART(nombre, ' ', 1) as first_name,
  COALESCE(NULLIF(SPLIT_PART(nombre, ' ', 2), ''), 'Usuario') as last_name,
  CASE 
    WHEN tipo = 'profesional' THEN 'profesional'::user_type
    ELSE 'cliente'::user_type
  END as user_type,
  COALESCE(source, 'website'),
  created_at
FROM registros
WHERE email NOT IN (SELECT email FROM users)
ON CONFLICT (email) DO NOTHING;

-- ===============================================
-- 12. FUNCIONES HELPERS
-- ===============================================

-- Función para calcular distancia entre dos puntos
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lng1 DECIMAL, 
  lat2 DECIMAL, lng2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * 
      cos(radians(lat2)) * 
      cos(radians(lng2) - radians(lng1)) + 
      sin(radians(lat1)) * 
      sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar rating promedio de usuario
CREATE OR REPLACE FUNCTION update_user_rating(user_uuid UUID) RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    rating_average = (
      SELECT COALESCE(AVG(overall_rating::DECIMAL), 0.0) 
      FROM ratings 
      WHERE reviewed_id = user_uuid
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM ratings 
      WHERE reviewed_id = user_uuid
    )
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de booking único
CREATE OR REPLACE FUNCTION generate_booking_number() RETURNS TEXT AS $$
BEGIN
  RETURN 'SP-' || 
         EXTRACT(YEAR FROM NOW()) || '-' ||
         LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' ||
         LPAD(floor(random() * 9999 + 1)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 13. TRIGGERS AUTOMÁTICOS
-- ===============================================

-- Trigger para actualizar updated_at en todas las tablas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas necesarias
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar rating después de nueva review
CREATE OR REPLACE FUNCTION trigger_update_rating() RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_user_rating(NEW.reviewed_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
  AFTER INSERT OR UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION trigger_update_rating();

-- ===============================================
-- 14. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ===============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para USERS
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Public can view professional profiles" ON users;
CREATE POLICY "Public can view professional profiles" ON users FOR SELECT USING (user_type = 'profesional' AND is_active = true);

-- Políticas para SERVICES
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (status = 'active');

-- Políticas para BOOKINGS
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
  client_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
  professional_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

DROP POLICY IF EXISTS "Clients can create bookings" ON bookings;
CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT WITH CHECK (
  client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Políticas para MESSAGES
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
  recipient_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- ===============================================
-- 15. VISTAS ÚTILES
-- ===============================================

-- Vista de profesionales con sus servicios
CREATE OR REPLACE VIEW professional_profiles AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.business_name,
  u.description,
  u.avatar_url,
  u.years_experience,
  u.verified,
  u.city,
  u.rating_average,
  u.rating_count,
  u.completed_bookings,
  u.is_available,
  ARRAY_AGG(s.name) as services,
  ARRAY_AGG(ps.price_per_hour) as prices
FROM users u
LEFT JOIN professional_services ps ON u.id = ps.professional_id AND ps.is_active = true
LEFT JOIN services s ON ps.service_id = s.id
WHERE u.user_type = 'profesional' AND u.is_active = true
GROUP BY u.id;

-- Vista de bookings con información completa
CREATE OR REPLACE VIEW booking_details AS
SELECT 
  b.*,
  c.first_name as client_name,
  c.email as client_email,
  c.phone as client_phone,
  p.first_name as professional_name,
  p.business_name,
  p.phone as professional_phone,
  s.name as service_name,
  s.category as service_category
FROM bookings b
LEFT JOIN users c ON b.client_id = c.id
LEFT JOIN users p ON b.professional_id = p.id
LEFT JOIN services s ON b.service_id = s.id;

-- ===============================================
-- 16. DATOS DE PRUEBA
-- ===============================================

-- Crear algunos usuarios de prueba
INSERT INTO users (email, phone, first_name, last_name, user_type, city, verified, years_experience, description, is_available) VALUES
('carlos.electricista@example.com', '+54 11 1111-1111', 'Carlos', 'González', 'profesional', 'Buenos Aires', true, 8, 'Electricista certificado con 8 años de experiencia', true),
('maria.plomera@example.com', '+54 11 2222-2222', 'María', 'Rodríguez', 'profesional', 'Buenos Aires', true, 5, 'Plomera especializada en emergencias', true),
('juan.cliente@example.com', '+54 11 3333-3333', 'Juan', 'Pérez', 'cliente', 'Buenos Aires', false, null, null, true)
ON CONFLICT (email) DO NOTHING;

-- Asociar servicios a profesionales
INSERT INTO professional_services (professional_id, service_id, price_per_hour, is_active)
SELECT 
  u.id,
  s.id,
  s.base_price,
  true
FROM users u
CROSS JOIN services s
WHERE u.user_type = 'profesional' 
  AND ((u.first_name = 'Carlos' AND s.slug = 'electricidad-residencial') OR
       (u.first_name = 'María' AND s.slug = 'plomeria-general'))
ON CONFLICT (professional_id, service_id) DO NOTHING;

-- ===============================================
-- 17. VERIFICACIÓN FINAL
-- ===============================================

-- Mostrar estadísticas de la base de datos
SELECT 
  'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'services' as tabla, COUNT(*) as registros FROM services
UNION ALL
SELECT 'professional_services' as tabla, COUNT(*) as registros FROM professional_services
UNION ALL
SELECT 'bookings' as tabla, COUNT(*) as registros FROM bookings
UNION ALL
SELECT 'messages' as tabla, COUNT(*) as registros FROM messages
UNION ALL
SELECT 'ratings' as tabla, COUNT(*) as registros FROM ratings
UNION ALL
SELECT 'payments' as tabla, COUNT(*) as registros FROM payments
UNION ALL
SELECT 'notifications' as tabla, COUNT(*) as registros FROM notifications;

-- ===============================================
-- ✅ CONFIGURACIÓN ENTERPRISE COMPLETA
-- ===============================================

SELECT '🚀 ServiPro Enterprise Database configurada exitosamente!' as resultado,
       '✅ 8 tablas principales creadas' as tablas,
       '✅ Políticas RLS configuradas' as seguridad,
       '✅ Triggers automáticos activados' as automatización,
       '✅ Índices optimizados' as performance,
       '✅ Datos de prueba insertados' as testing;
