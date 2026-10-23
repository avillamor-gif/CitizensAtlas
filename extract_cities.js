const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractCities() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('country, details')
      .eq('status', 'published');

    if (error) throw error;

    const cities = new Set();
    data.forEach(project => {
      const details = project.details;
      if (details && typeof details === 'string') {
        const lines = details.split('\n');
        lines.forEach(line => {
          const match = line.match(/Cities?\s*(?:\/|,)?\s*(?:Province)?[:\s]+(.+)/i);
          if (match) {
            const cityStr = match[1].trim();
            const cityList = cityStr.split(/[,;]/).map(c => c.trim()).filter(c => c);
            cityList.forEach(city => {
              if (city && !city.toLowerCase().includes('na') && !city.toLowerCase().includes('unknown')) {
                cities.add(`${city}::${project.country}`);
              }
            });
          }
        });
      }
    });

    console.log('Extracted cities/provinces:');
    Array.from(cities).sort().forEach(city => console.log(city));
  } catch (error) {
    console.error('Error:', error);
  }
}

extractCities();
