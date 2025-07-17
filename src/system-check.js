import { supabase, testConnection, getActiveServices, getDashboardStats } from './supabase.js';

// 🔍 SCRIPT DE VERIFICACIÓN - SERVIPRO ENTERPRISE
console.log('🚀 Iniciando verificación del sistema ServiPro Enterprise...\n');

const runSystemCheck = async () => {
  const results = {
    connection: false,
    services: false,
    stats: false,
    realtime: false
  };

  try {
    // 1. Verificar conexión a Supabase
    console.log('1️⃣ Verificando conexión a Supabase...');
    const connectionTest = await testConnection();
    if (connectionTest.success) {
      console.log('   ✅ Conexión exitosa a Supabase');
      console.log(`   📊 URL: ${connectionTest.url}`);
      results.connection = true;
    } else {
      console.log('   ❌ Error de conexión:', connectionTest.error);
    }

    // 2. Verificar servicios
    console.log('\n2️⃣ Verificando servicios disponibles...');
    const servicesTest = await getActiveServices();
    if (servicesTest.success && servicesTest.data.length > 0) {
      console.log(`   ✅ ${servicesTest.data.length} servicios activos encontrados`);
      console.log('   📋 Servicios:', servicesTest.data.slice(0, 3).map(s => s.name).join(', ') + '...');
      results.services = true;
    } else {
      console.log('   ❌ Error cargando servicios:', servicesTest.error);
    }

    // 3. Verificar estadísticas
    console.log('\n3️⃣ Verificando estadísticas del dashboard...');
    const statsTest = await getDashboardStats();
    if (statsTest.success) {
      console.log('   ✅ Estadísticas cargadas correctamente');
      console.log(`   👥 Usuarios: ${statsTest.data.totalUsers}`);
      console.log(`   👨‍🔧 Profesionales: ${statsTest.data.totalProfessionals}`);
      console.log(`   📅 Bookings: ${statsTest.data.totalBookings}`);
      console.log(`   🛠️ Servicios: ${statsTest.data.totalServices}`);
      results.stats = true;
    } else {
      console.log('   ❌ Error cargando estadísticas:', statsTest.error);
    }

    // 4. Verificar configuración del entorno
    console.log('\n4️⃣ Verificando configuración del entorno...');
    const envVars = {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Faltante',
      APP_NAME: import.meta.env.VITE_APP_NAME || 'ServiPro Enterprise',
      NODE_ENV: import.meta.env.MODE
    };

    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // 5. Resumen final
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log('================================');
    console.log(`Conexión Supabase: ${results.connection ? '✅' : '❌'}`);
    console.log(`Servicios cargados: ${results.services ? '✅' : '❌'}`);
    console.log(`Estadísticas funcionando: ${results.stats ? '✅' : '❌'}`);
    
    const allPassing = Object.values(results).every(r => r);
    
    if (allPassing) {
      console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
      console.log('✅ Todo está listo para producción');
      console.log('🚀 Puedes hacer deploy con: vercel');
    } else {
      console.log('\n⚠️ Algunos componentes requieren atención');
      console.log('🔧 Revisa los errores arriba y configura las variables de entorno');
    }

  } catch (error) {
    console.error('\n❌ Error durante la verificación:', error.message);
  }
};

// Ejecutar verificación solo si se llama directamente
if (typeof window !== 'undefined') {
  // En el navegador
  window.runSystemCheck = runSystemCheck;
  console.log('💡 Ejecuta runSystemCheck() en la consola para verificar el sistema');
} else {
  // En Node.js
  runSystemCheck();
}

export default runSystemCheck;