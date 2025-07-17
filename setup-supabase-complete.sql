-- 🔥 CONFIGURACIÓN SUPABASE SERVIPRO ENTERPRISE
-- Ejecutar en: https://supabase.com/dashboard/project/gtlyxvdzvgypdfrpeafp/sql

-- 1. Eliminar tabla si existe (para re-crear limpia)
DROP TABLE IF EXISTS registros CASCADE;

-- 2. Crear tabla registros optimizada
CREATE TABLE registros (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Datos del usuario
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('usuario', 'profesional')),
  servicio TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  
  -- Campos adicionales
  notas TEXT,
  prioridad INTEGER DEFAULT 3 CHECK (prioridad BETWEEN 1 AND 5),
  
  -- Índices para performance
  CONSTRAINT unique_email_per_type UNIQUE (email, tipo)
);

-- 3. Crear índices para performance
CREATE INDEX idx_registros_created_at ON registros(created_at DESC);
CREATE INDEX idx_registros_status ON registros(status);
CREATE INDEX idx_registros_tipo ON registros(tipo);
CREATE INDEX idx_registros_email ON registros(email);

-- 4. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger para auto-actualizar updated_at
CREATE TRIGGER update_registros_updated_at 
    BEFORE UPDATE ON registros 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar Row Level Security
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- 7. Políticas de seguridad

-- Permitir INSERT público (registros)
DROP POLICY IF EXISTS "Permitir registros públicos" ON registros;
CREATE POLICY "Permitir registros públicos" 
ON registros FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

-- Permitir SELECT solo a usuarios autenticados
DROP POLICY IF EXISTS "Ver registros autenticados" ON registros;
CREATE POLICY "Ver registros autenticados" 
ON registros FOR SELECT 
TO authenticated 
USING (true);

-- Permitir UPDATE solo a usuarios autenticados
DROP POLICY IF EXISTS "Actualizar registros autenticados" ON registros;
CREATE POLICY "Actualizar registros autenticados" 
ON registros FOR UPDATE 
TO authenticated 
USING (true);

-- 8. Insertar datos de prueba
INSERT INTO registros (nombre, email, telefono, tipo, servicio, notas) VALUES
('Juan Pérez', 'juan.perez@example.com', '+54 11 1234-5678', 'usuario', 'Plomería', 'Registro de prueba - Usuario'),
('María González', 'maria.gonzalez@example.com', '+54 11 2345-6789', 'profesional', 'Limpieza', 'Registro de prueba - Profesional'),
('Carlos Rodríguez', 'carlos.rodriguez@example.com', '+54 11 3456-7890', 'usuario', 'Electricidad', 'Registro de prueba - Urgente')
ON CONFLICT (email, tipo) DO NOTHING;

-- 9. Verificar que todo funciona
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN tipo = 'usuario' THEN 1 END) as usuarios,
    COUNT(CASE WHEN tipo = 'profesional' THEN 1 END) as profesionales,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendientes
FROM registros;

-- 10. Mostrar estructura de la tabla
\d registros;

-- 11. Mostrar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'registros';

-- ✅ CONFIGURACIÓN COMPLETA
-- Si ves resultados sin errores, la configuración fue exitosa
SELECT '🎉 Supabase configurado exitosamente para ServiPro Enterprise!' as resultado;
