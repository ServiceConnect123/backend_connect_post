const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const countries = [
  {
    id: 'clxxx-country-co-xxxx',
    key: 'CO',
    value: 'Colombia',
  },
  {
    id: 'clxxx-country-ca-xxxx',
    key: 'CA',
    value: 'Canadá',
  },
  {
    id: 'clxxx-country-ve-xxxx',
    key: 'VE',
    value: 'Venezuela',
  },
  {
    id: 'clxxx-country-pe-xxxx',
    key: 'PE',
    value: 'Perú',
  },
];

const cities = [
  // COLOMBIA - Principales ciudades
  {
    id: 'clxxx-city-bog-xxxx',
    key: 'BOG',
    value: 'Bogotá',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-med-xxxx',
    key: 'MED',
    value: 'Medellín',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-cal-xxxx',
    key: 'CAL',
    value: 'Cali',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-baq-xxxx',
    key: 'BAQ',
    value: 'Barranquilla',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-ctg-xxxx',
    key: 'CTG',
    value: 'Cartagena',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-cuc-xxxx',
    key: 'CUC',
    value: 'Cúcuta',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-smr-xxxx',
    key: 'SMR',
    value: 'Santa Marta',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-ibg-xxxx',
    key: 'IBG',
    value: 'Ibagué',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-pst-xxxx',
    key: 'PST',
    value: 'Pasto',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-prm-xxxx',
    key: 'PRM',
    value: 'Pereira',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-mnz-xxxx',
    key: 'MNZ',
    value: 'Manizales',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-buc-xxxx',
    key: 'BUC',
    value: 'Bucaramanga',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-vlv-xxxx',
    key: 'VLV',
    value: 'Valledupar',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-rio-xxxx',
    key: 'RIO',
    value: 'Riohacha',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-neo-xxxx',
    key: 'NEO',
    value: 'Neiva',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-pop-xxxx',
    key: 'POP',
    value: 'Popayán',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-arm-xxxx',
    key: 'ARM',
    value: 'Armenia',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-sin-xxxx',
    key: 'SIN',
    value: 'Sincelejo',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-mnt-xxxx',
    key: 'MNT',
    value: 'Montería',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-vil-xxxx',
    key: 'VIL',
    value: 'Villavicencio',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-tun-xxxx',
    key: 'TUN',
    value: 'Tunja',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-flr-xxxx',
    key: 'FLR',
    value: 'Florencia',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-yop-xxxx',
    key: 'YOP',
    value: 'Yopal',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-auc-xxxx',
    key: 'AUC',
    value: 'Arauca',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-let-xxxx',
    key: 'LET',
    value: 'Leticia',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-mit-xxxx',
    key: 'MIT',
    value: 'Mitú',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-pvi-xxxx',
    key: 'PVI',
    value: 'Puerto Inírida',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-pcr-xxxx',
    key: 'PCR',
    value: 'Puerto Carreño',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-sjg-xxxx',
    key: 'SJG',
    value: 'San José del Guaviare',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-moc-xxxx',
    key: 'MOC',
    value: 'Mocoa',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-qui-xxxx',
    key: 'QUI',
    value: 'Quibdó',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-soa-xxxx',
    key: 'SOA',
    value: 'Soacha',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-bel-xxxx',
    key: 'BEL',
    value: 'Bello',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-mag-xxxx',
    key: 'MAG',
    value: 'Magangué',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-gir-xxxx',
    key: 'GIR',
    value: 'Girardot',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-dui-xxxx',
    key: 'DUI',
    value: 'Duitama',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-sog-xxxx',
    key: 'SOG',
    value: 'Sogamoso',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-tur-xxxx',
    key: 'TUR',
    value: 'Turbo',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-bar-xxxx',
    key: 'BAR',
    value: 'Barrancas',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-aga-xxxx',
    key: 'AGA',
    value: 'Apartadó',
    countryId: 'clxxx-country-co-xxxx',
  },
  {
    id: 'clxxx-city-ipa-xxxx',
    key: 'IPA',
    value: 'Ipiales',
    countryId: 'clxxx-country-co-xxxx',
  },

  // CANADÁ - Principales ciudades por provincia
  // Ontario
  {
    id: 'clxxx-city-tor-xxxx',
    key: 'TOR',
    value: 'Toronto',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-ott-xxxx',
    key: 'OTT',
    value: 'Ottawa',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-mis-xxxx',
    key: 'MIS',
    value: 'Mississauga',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-ham-xxxx',
    key: 'HAM',
    value: 'Hamilton',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-lon-xxxx',
    key: 'LON',
    value: 'London',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-kit-xxxx',
    key: 'KIT',
    value: 'Kitchener',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-win-xxxx',
    key: 'WIN',
    value: 'Windsor',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Quebec
  {
    id: 'clxxx-city-mtl-xxxx',
    key: 'MTL',
    value: 'Montreal',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-qbc-xxxx',
    key: 'QBC',
    value: 'Quebec City',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-lav-xxxx',
    key: 'LAV',
    value: 'Laval',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-gat-xxxx',
    key: 'GAT',
    value: 'Gatineau',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-lon-ca-xxxx',
    key: 'LONCA',
    value: 'Longueuil',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-she-xxxx',
    key: 'SHE',
    value: 'Sherbrooke',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // British Columbia
  {
    id: 'clxxx-city-van-xxxx',
    key: 'VAN',
    value: 'Vancouver',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-vic-xxxx',
    key: 'VIC',
    value: 'Victoria',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-bur-xxxx',
    key: 'BUR',
    value: 'Burnaby',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-sur-xxxx',
    key: 'SUR',
    value: 'Surrey',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-ric-xxxx',
    key: 'RIC',
    value: 'Richmond',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-kel-xxxx',
    key: 'KEL',
    value: 'Kelowna',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Alberta
  {
    id: 'clxxx-city-cal-ca-xxxx',
    key: 'CALCA',
    value: 'Calgary',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-edm-xxxx',
    key: 'EDM',
    value: 'Edmonton',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-red-xxxx',
    key: 'RED',
    value: 'Red Deer',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-let-ca-xxxx',
    key: 'LETCA',
    value: 'Lethbridge',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Manitoba
  {
    id: 'clxxx-city-win-ca-xxxx',
    key: 'WINCA',
    value: 'Winnipeg',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-bra-xxxx',
    key: 'BRA',
    value: 'Brandon',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Saskatchewan
  {
    id: 'clxxx-city-sas-xxxx',
    key: 'SAS',
    value: 'Saskatoon',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-reg-xxxx',
    key: 'REG',
    value: 'Regina',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Nova Scotia
  {
    id: 'clxxx-city-hal-xxxx',
    key: 'HAL',
    value: 'Halifax',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-syd-xxxx',
    key: 'SYD',
    value: 'Sydney',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // New Brunswick
  {
    id: 'clxxx-city-sai-xxxx',
    key: 'SAI',
    value: 'Saint John',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-mon-xxxx',
    key: 'MON',
    value: 'Moncton',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-fre-xxxx',
    key: 'FRE',
    value: 'Fredericton',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Newfoundland and Labrador
  {
    id: 'clxxx-city-stj-xxxx',
    key: 'STJ',
    value: "St. John's",
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Prince Edward Island
  {
    id: 'clxxx-city-cha-xxxx',
    key: 'CHA',
    value: 'Charlottetown',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Northwest Territories
  {
    id: 'clxxx-city-yel-xxxx',
    key: 'YEL',
    value: 'Yellowknife',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Nunavut
  {
    id: 'clxxx-city-iqa-xxxx',
    key: 'IQA',
    value: 'Iqaluit',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Yukon
  {
    id: 'clxxx-city-whi-xxxx',
    key: 'WHI',
    value: 'Whitehorse',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Additional Ontario cities
  {
    id: 'clxxx-city-bra-on-xxxx',
    key: 'BRAON',
    value: 'Brampton',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-mark-xxxx',
    key: 'MARK',
    value: 'Markham',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-vaug-xxxx',
    key: 'VAUG',
    value: 'Vaughan',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-oakv-xxxx',
    key: 'OAKV',
    value: 'Oakville',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-auro-xxxx',
    key: 'AURO',
    value: 'Aurora',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Additional Quebec cities
  {
    id: 'clxxx-city-sag-xxxx',
    key: 'SAG',
    value: 'Saguenay',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-terr-xxxx',
    key: 'TERR',
    value: 'Terrebonne',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-trois-xxxx',
    key: 'TROIS',
    value: 'Trois-Rivières',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Additional British Columbia cities
  {
    id: 'clxxx-city-abbo-xxxx',
    key: 'ABBO',
    value: 'Abbotsford',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-coqu-xxxx',
    key: 'COQU',
    value: 'Coquitlam',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-lang-xxxx',
    key: 'LANG',
    value: 'Langley',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-del-xxxx',
    key: 'DEL',
    value: 'Delta',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Additional Alberta cities
  {
    id: 'clxxx-city-stab-xxxx',
    key: 'STAB',
    value: 'St. Albert',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-fort-xxxx',
    key: 'FORT',
    value: 'Fort McMurray',
    countryId: 'clxxx-country-ca-xxxx',
  },
  {
    id: 'clxxx-city-med-ca-xxxx',
    key: 'MEDCA',
    value: 'Medicine Hat',
    countryId: 'clxxx-country-ca-xxxx',
  },

  // Venezuela (mantenemos las existentes)
  {
    id: 'clxxx-city-ccs-xxxx',
    key: 'CCS',
    value: 'Caracas',
    countryId: 'clxxx-country-ve-xxxx',
  },
  {
    id: 'clxxx-city-mcy-xxxx',
    key: 'MCY',
    value: 'Maracaibo',
    countryId: 'clxxx-country-ve-xxxx',
  },

  // Perú (mantenemos las existentes)
  {
    id: 'clxxx-city-lim-xxxx',
    key: 'LIM',
    value: 'Lima',
    countryId: 'clxxx-country-pe-xxxx',
  },
  {
    id: 'clxxx-city-are-xxxx',
    key: 'ARE',
    value: 'Arequipa',
    countryId: 'clxxx-country-pe-xxxx',
  },
];

async function seedLocations() {
  console.log('🌍 Starting locations seeding...');

  try {
    // Crear países
    console.log('📍 Creating countries...');
    for (const country of countries) {
      await prisma.country.upsert({
        where: { id: country.id },
        update: {},
        create: country,
      });
      console.log(`✅ Country created: ${country.value}`);
    }

    // Crear ciudades
    console.log('🏙️ Creating cities...');
    for (const city of cities) {
      await prisma.city.upsert({
        where: { id: city.id },
        update: {},
        create: city,
      });
      console.log(`✅ City created: ${city.value}`);
    }

    console.log('🎉 Locations seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedLocations().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedLocations };
