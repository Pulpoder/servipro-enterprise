-- EJECUTAR ESTE SQL EN SUPABASE CONSOLE
-- SQL Editor > New Query > Copiar y pegar este código > Run

-- 1. Crear tabla registros
CREATE TABLE IF NOT EXISTS registros (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('usuario', 'profesional')),
  servicio TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed'))
);

-- 2. Habilitar Row Level Security
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- 3. Política para permitir inserts públicos
DROP POLICY IF EXISTS "Allow public registrations" ON registros;
CREATE POLICY "Allow public registrations" 
ON registros FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

-- 4. Política para leer registros (solo autenticados)
DROP POLICY IF EXISTS "Allow authenticated reads" ON registros;
CREATE POLICY "Allow authenticated reads" 
ON registros FOR SELECT 
TO authenticated 
USING (true);

-- 5. Verificar que todo funciona
SELECT * FROM registros LIMIT 5;

-- 6. Insertar registro de prueba
INSERT INTO registros (nombre, email, telefono, tipo, servicio) 
VALUES ('Test Usuario', 'test@example.com', '+54 11 1234-5678', 'usuario', 'Plomería');

-- 7. Verificar inserción
SELECT * FROM registros ORDER BY created_at DESC LIMIT 1;
