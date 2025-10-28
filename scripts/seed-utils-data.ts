import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUtilsData() {
  console.log('🌱 Seeding utils configurations data...');

  try {
    // Seed Time Formats
    console.log('📅 Seeding time formats...');
    await prisma.timeFormat.upsert({
      where: { value: '12h' },
      update: {},
      create: {
        id: 'tf1',
        value: '12h',
        name: '12 Hours',
        description: '12-hour format with AM/PM',
        isActive: true,
      },
    });

    await prisma.timeFormat.upsert({
      where: { value: '24h' },
      update: {},
      create: {
        id: 'tf2',
        value: '24h',
        name: '24 Hours',
        description: '24-hour format',
        isActive: true,
      },
    });

    // Seed Languages
    console.log('🌐 Seeding languages...');
    const languages = [
      {
        id: 'lang1',
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        country: 'Colombia',
      },
      {
        id: 'lang2',
        code: 'en',
        name: 'English',
        nativeName: 'English',
        country: 'United States',
      },
      {
        id: 'lang3',
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        country: 'Brazil',
      },
      {
        id: 'lang4',
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        country: 'France',
      },
    ];

    for (const lang of languages) {
      await prisma.language.upsert({
        where: { code: lang.code },
        update: {},
        create: lang,
      });
    }

    // Seed Currencies
    console.log('💰 Seeding currencies...');
    const currencies = [
      {
        id: 'curr1',
        code: 'COP',
        name: 'Colombian Peso',
        symbol: '$',
        country: 'Colombia',
        type: 'Pesos',
        decimalPlaces: 0,
      },
      {
        id: 'curr2',
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        country: 'United States',
        type: 'Dollars',
        decimalPlaces: 2,
      },
      {
        id: 'curr3',
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        country: 'European Union',
        type: 'Euros',
        decimalPlaces: 2,
      },
      {
        id: 'curr4',
        code: 'BRL',
        name: 'Brazilian Real',
        symbol: 'R$',
        country: 'Brazil',
        type: 'Reales',
        decimalPlaces: 2,
      },
      {
        id: 'curr5',
        code: 'MXN',
        name: 'Mexican Peso',
        symbol: '$',
        country: 'Mexico',
        type: 'Pesos',
        decimalPlaces: 2,
      },
    ];

    for (const curr of currencies) {
      await prisma.currency.upsert({
        where: { code: curr.code },
        update: {},
        create: curr,
      });
    }

    console.log('✅ Utils configurations seeded successfully!');
    
    // Verify data
    const timeFormatsCount = await prisma.timeFormat.count();
    const languagesCount = await prisma.language.count();
    const currenciesCount = await prisma.currency.count();

    console.log(`📊 Summary:`);
    console.log(`   Time Formats: ${timeFormatsCount}`);
    console.log(`   Languages: ${languagesCount}`);
    console.log(`   Currencies: ${currenciesCount}`);

  } catch (error) {
    console.error('❌ Error seeding utils data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedUtilsData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
