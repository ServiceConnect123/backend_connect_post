import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Datos de países y ciudades colombianas
const countriesData = [
  {
    key: 'CO',
    value: 'Colombia',
    cities: [
      // Principales ciudades de Colombia
      { key: 'BOG', value: 'Bogotá D.C.' },
      { key: 'MED', value: 'Medellín' },
      { key: 'CAL', value: 'Cali' },
      { key: 'BAQ', value: 'Barranquilla' },
      { key: 'CTG', value: 'Cartagena' },
      { key: 'CUC', value: 'Cúcuta' },
      { key: 'SMR', value: 'Santa Marta' },
      { key: 'IBE', value: 'Ibagué' },
      { key: 'BGA', value: 'Bucaramanga' },
      { key: 'PEI', value: 'Pereira' },
      { key: 'MAN', value: 'Manizales' },
      { key: 'ARM', value: 'Armenia' },
      { key: 'VVC', value: 'Villavicencio' },
      { key: 'NEI', value: 'Neiva' },
      { key: 'VUP', value: 'Valledupar' },
      { key: 'POP', value: 'Popayán' },
      { key: 'SIN', value: 'Sincelejo' },
      { key: 'MON', value: 'Montería' },
      { key: 'FLA', value: 'Florencia' },
      { key: 'TUN', value: 'Tunja' },
      { key: 'QUI', value: 'Quibdó' },
      { key: 'RHA', value: 'Riohacha' },
      { key: 'YOP', value: 'Yopal' },
      { key: 'MIT', value: 'Mitú' },
      { key: 'ARA', value: 'Arauca' },
      { key: 'LET', value: 'Leticia' },
      { key: 'PZO', value: 'Puerto Carreño' },
      { key: 'SJG', value: 'San José del Guaviare' },
      { key: 'IND', value: 'Inírida' },
      { key: 'MOC', value: 'Mocoa' },
    ]
  },
  {
    key: 'US',
    value: 'United States',
    cities: [
      { key: 'NYC', value: 'New York' },
      { key: 'LAX', value: 'Los Angeles' },
      { key: 'CHI', value: 'Chicago' },
      { key: 'MIA', value: 'Miami' },
    ]
  },
  {
    key: 'MX',
    value: 'Mexico',
    cities: [
      { key: 'MEX', value: 'Ciudad de México' },
      { key: 'GDL', value: 'Guadalajara' },
      { key: 'MTY', value: 'Monterrey' },
      { key: 'CUN', value: 'Cancún' },
    ]
  },
  {
    key: 'BR',
    value: 'Brazil',
    cities: [
      { key: 'SAO', value: 'São Paulo' },
      { key: 'RIO', value: 'Río de Janeiro' },
      { key: 'BSB', value: 'Brasilia' },
      { key: 'BHZ', value: 'Belo Horizonte' },
    ]
  }
];

async function loadCitiesData() {
  try {
    console.log('🌍 Iniciando carga de países y ciudades...\n');

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    let totalCountries = 0;
    let totalCities = 0;

    for (const countryData of countriesData) {
      console.log(`\n📍 Procesando país: ${countryData.value}`);

      // Crear o encontrar el país
      let country = await prisma.country.findUnique({
        where: { key: countryData.key }
      });

      if (country) {
        console.log(`   ⚠️  País ${countryData.value} ya existe, actualizando...`);
        country = await prisma.country.update({
          where: { key: countryData.key },
          data: { value: countryData.value }
        });
      } else {
        console.log(`   ✨ Creando nuevo país: ${countryData.value}`);
        country = await prisma.country.create({
          data: {
            key: countryData.key,
            value: countryData.value
          }
        });
        totalCountries++;
      }

      // Cargar ciudades para este país
      console.log(`   🏙️  Cargando ${countryData.cities.length} ciudades...`);
      
      for (const cityData of countryData.cities) {
        // Verificar si la ciudad ya existe
        const existingCity = await prisma.city.findUnique({
          where: { key: cityData.key }
        });

        if (existingCity) {
          console.log(`      ⚠️  Ciudad ${cityData.value} ya existe, actualizando...`);
          await prisma.city.update({
            where: { key: cityData.key },
            data: { 
              value: cityData.value,
              countryId: country.id
            }
          });
        } else {
          console.log(`      ✨ Creando nueva ciudad: ${cityData.value}`);
          await prisma.city.create({
            data: {
              key: cityData.key,
              value: cityData.value,
              countryId: country.id
            }
          });
          totalCities++;
        }
      }

      console.log(`   ✅ Completado procesamiento de ${countryData.value}`);
    }

    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CARGA:');
    console.log(`   • Países nuevos creados: ${totalCountries}`);
    console.log(`   • Ciudades nuevas creadas: ${totalCities}`);

    // Verificar datos cargados
    const countryCount = await prisma.country.count();
    const cityCount = await prisma.city.count();
    
    console.log('\n📈 ESTADO ACTUAL DE LA BASE DE DATOS:');
    console.log(`   • Total países: ${countryCount}`);
    console.log(`   • Total ciudades: ${cityCount}`);

    // Mostrar algunos ejemplos
    const colombianCities = await prisma.city.findMany({
      where: {
        country: {
          key: 'CO'
        }
      },
      include: {
        country: true
      },
      take: 5
    });

    console.log('\n🇨🇴 CIUDADES COLOMBIANAS (primeras 5):');
    colombianCities.forEach(city => {
      console.log(`   • ${city.value} (${city.key}) - ${city.country.value}`);
    });

    console.log('\n🎉 ¡Carga de ciudades completada exitosamente!');

  } catch (error) {
    console.error('\n❌ Error durante la carga de ciudades:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para verificar los datos cargados
async function verifyCitiesData() {
  try {
    await prisma.$connect();
    
    console.log('\n🔍 VERIFICACIÓN DE DATOS CARGADOS:');
    
    const countries = await prisma.country.findMany({
      include: {
        cities: true,
        _count: {
          select: { cities: true }
        }
      }
    });

    countries.forEach(country => {
      console.log(`\n🌍 ${country.value} (${country.key}):`);
      console.log(`   • ID: ${country.id}`);
      console.log(`   • Ciudades: ${country._count.cities}`);
      
      if (country.cities.length > 0) {
        console.log('   • Ejemplos de ciudades:');
        country.cities.slice(0, 3).forEach(city => {
          console.log(`     - ${city.value} (${city.key})`);
        });
        if (country.cities.length > 3) {
          console.log(`     ... y ${country.cities.length - 3} más`);
        }
      }
    });

  } catch (error) {
    console.error('❌ Error en la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--verify')) {
    verifyCitiesData();
  } else if (args.includes('--help')) {
    console.log('📚 USO DEL SCRIPT:');
    console.log('  npm run ts-node scripts/load-cities-data.ts          # Cargar ciudades');
    console.log('  npm run ts-node scripts/load-cities-data.ts --verify # Verificar datos');
    console.log('  npm run ts-node scripts/load-cities-data.ts --help   # Mostrar ayuda');
  } else {
    loadCitiesData();
  }
}

export { loadCitiesData, verifyCitiesData };
