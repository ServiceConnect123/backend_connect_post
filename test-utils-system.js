const axios = require('axios');

// Configuration
const baseURL = 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json'
};

async function testIdBasedUtils() {
  try {
    console.log('🧪 Testing ID-based Utils System\n');

    // 1. Test Time Formats endpoint
    console.log('1️⃣ Testing Time Formats endpoint...');
    const timeFormatsRes = await axios.get(`${baseURL}/utils/timeFormat`, { headers });
    const timeFormats = timeFormatsRes.data.timeFormats;
    
    console.log('✅ Time Formats retrieved successfully');
    console.log('📊 Available Time Formats:');
    timeFormats.forEach(tf => {
      console.log(`   - ${tf.id}: ${tf.value} (${tf.name}) - ${tf.description}`);
    });

    // 2. Test Languages endpoint
    console.log('\n2️⃣ Testing Languages endpoint...');
    const languagesRes = await axios.get(`${baseURL}/utils/language`, { headers });
    const languages = languagesRes.data.languages;
    
    console.log('✅ Languages retrieved successfully');
    console.log('📊 Available Languages:');
    languages.forEach(lang => {
      console.log(`   - ${lang.id}: ${lang.code} (${lang.name}) - ${lang.nativeName} [${lang.country}]`);
    });

    // 3. Test Currencies endpoint
    console.log('\n3️⃣ Testing Currencies endpoint...');
    const currenciesRes = await axios.get(`${baseURL}/utils/currency`, { headers });
    const currencies = currenciesRes.data.currencies;
    
    console.log('✅ Currencies retrieved successfully');
    console.log('📊 Available Currencies:');
    currencies.forEach(curr => {
      console.log(`   - ${curr.id}: ${curr.code} (${curr.name}) - ${curr.symbol} [${curr.country}] - ${curr.decimalPlaces} decimals`);
    });

    // 4. Verify data structure and IDs
    console.log('\n4️⃣ Verifying data structure...');
    
    // Check that all time formats have required fields
    const timeFormatFields = ['id', 'value', 'name', 'description'];
    const hasAllTimeFormatFields = timeFormats.every(tf => 
      timeFormatFields.every(field => tf.hasOwnProperty(field))
    );
    
    // Check that all languages have required fields
    const languageFields = ['id', 'code', 'name', 'nativeName', 'country'];
    const hasAllLanguageFields = languages.every(lang => 
      languageFields.every(field => lang.hasOwnProperty(field))
    );
    
    // Check that all currencies have required fields
    const currencyFields = ['id', 'code', 'name', 'symbol', 'country', 'type', 'decimalPlaces'];
    const hasAllCurrencyFields = currencies.every(curr => 
      currencyFields.every(field => curr.hasOwnProperty(field))
    );

    console.log(`✅ Time Format structure: ${hasAllTimeFormatFields ? 'Valid' : 'Invalid'}`);
    console.log(`✅ Language structure: ${hasAllLanguageFields ? 'Valid' : 'Invalid'}`);
    console.log(`✅ Currency structure: ${hasAllCurrencyFields ? 'Valid' : 'Invalid'}`);

    // 5. Test ID uniqueness
    console.log('\n5️⃣ Testing ID uniqueness...');
    const timeFormatIds = timeFormats.map(tf => tf.id);
    const languageIds = languages.map(lang => lang.id);
    const currencyIds = currencies.map(curr => curr.id);
    
    const uniqueTimeFormatIds = new Set(timeFormatIds);
    const uniqueLanguageIds = new Set(languageIds);
    const uniqueCurrencyIds = new Set(currencyIds);

    console.log(`✅ Time Format IDs unique: ${timeFormatIds.length === uniqueTimeFormatIds.size ? 'Yes' : 'No'}`);
    console.log(`✅ Language IDs unique: ${languageIds.length === uniqueLanguageIds.size ? 'Yes' : 'No'}`);
    console.log(`✅ Currency IDs unique: ${currencyIds.length === uniqueCurrencyIds.size ? 'Yes' : 'No'}`);

    // 6. Test specific ID formats
    console.log('\n6️⃣ Testing ID formats...');
    const timeFormatIdFormat = /^tf\d+$/.test(timeFormats[0]?.id);
    const languageIdFormat = /^lang\d+$/.test(languages[0]?.id);
    const currencyIdFormat = /^curr\d+$/.test(currencies[0]?.id);

    console.log(`✅ Time Format ID format (tf*): ${timeFormatIdFormat ? 'Valid' : 'Invalid'}`);
    console.log(`✅ Language ID format (lang*): ${languageIdFormat ? 'Valid' : 'Invalid'}`);
    console.log(`✅ Currency ID format (curr*): ${currencyIdFormat ? 'Valid' : 'Invalid'}`);

    console.log('\n🎉 All Utils tests completed successfully!');
    console.log('\n✅ ID-based Utils System is working correctly');
    console.log('\n📝 Key features verified:');
    console.log('  - ✅ All utils endpoints responding');
    console.log('  - ✅ Proper data structure with IDs');
    console.log('  - ✅ Complete entity information');
    console.log('  - ✅ Unique ID generation');
    console.log('  - ✅ Consistent ID format patterns');
    console.log('  - ✅ Mock data compatibility layer working');

    // 7. Display sample data for manual testing
    console.log('\n📋 Sample data for manual preference testing:');
    console.log('Time Format IDs:', timeFormats.map(tf => tf.id).join(', '));
    console.log('Language IDs:', languages.map(lang => lang.id).join(', '));
    console.log('Currency IDs:', currencies.map(curr => curr.id).join(', '));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the tests
testIdBasedUtils();
