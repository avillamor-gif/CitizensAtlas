/**
 * City Coordinates Database
 * Maps city names to their latitude and longitude coordinates
 * Format: city_country: { lat, lng, name }
 */

export const cityCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
  // Philippines cities
  'Manila::Philippines': { lat: 14.5995, lng: 120.9842, name: 'Manila' },
  'Quezon City::Philippines': { lat: 14.6349, lng: 121.0388, name: 'Quezon City' },
  'Davao City::Philippines': { lat: 7.0731, lng: 125.6121, name: 'Davao City' },
  'Caloocan::Philippines': { lat: 14.6428, lng: 120.9547, name: 'Caloocan' },
  'Cebu City::Philippines': { lat: 10.3157, lng: 123.8854, name: 'Cebu City' },
  'Zamboanga City::Philippines': { lat: 6.9271, lng: 122.0724, name: 'Zamboanga City' },
  'Taguig::Philippines': { lat: 14.5794, lng: 121.0353, name: 'Taguig' },
  'Pasig::Philippines': { lat: 14.5794, lng: 121.0819, name: 'Pasig' },
  'Antipolo::Philippines': { lat: 14.5878, lng: 121.1789, name: 'Antipolo' },
  'Makati::Philippines': { lat: 14.5550, lng: 121.0129, name: 'Makati' },
  'Bacolod::Philippines': { lat: 10.3906, lng: 123.0046, name: 'Bacolod' },
  'Cagayan de Oro::Philippines': { lat: 8.4866, lng: 124.6648, name: 'Cagayan de Oro' },
  'General Santos::Philippines': { lat: 6.1126, lng: 125.1721, name: 'General Santos' },
  'Iloilo City::Philippines': { lat: 10.6918, lng: 122.5673, name: 'Iloilo City' },
  'Mandaue::Philippines': { lat: 10.3069, lng: 123.9850, name: 'Mandaue' },
  'Las Piñas::Philippines': { lat: 14.3535, lng: 120.9779, name: 'Las Piñas' },
  'Marikina::Philippines': { lat: 14.6484, lng: 121.1945, name: 'Marikina' },
  'Pasay::Philippines': { lat: 14.5428, lng: 120.9927, name: 'Pasay' },
  'Parañaque::Philippines': { lat: 14.3534, lng: 121.0233, name: 'Parañaque' },
  'Valenzuela::Philippines': { lat: 14.7607, lng: 120.9858, name: 'Valenzuela' },
  'Mandaluyong::Philippines': { lat: 14.5784, lng: 121.0202, name: 'Mandaluyong' },
  'Baguio::Philippines': { lat: 16.4023, lng: 120.5960, name: 'Baguio' },
  'Legazpi::Philippines': { lat: 13.1524, lng: 123.7407, name: 'Legazpi' },
  'Naga::Philippines': { lat: 13.6187, lng: 123.1853, name: 'Naga' },
  'Tacloban::Philippines': { lat: 11.2872, lng: 124.9987, name: 'Tacloban' },
  'Puerto Princesa::Philippines': { lat: 9.7424, lng: 118.7319, name: 'Puerto Princesa' },
  'Butuan::Philippines': { lat: 8.9453, lng: 125.5300, name: 'Butuan' },
  'Lucena::Philippines': { lat: 13.9297, lng: 121.6198, name: 'Lucena' },
  'Ormoc::Philippines': { lat: 11.0084, lng: 124.6115, name: 'Ormoc' },
  'Olongapo::Philippines': { lat: 14.8371, lng: 120.2854, name: 'Olongapo' },
  'Agusan del Sur::Philippines': { lat: 8.2014, lng: 126.2817, name: 'Butuan (Agusan del Sur)' },
  'Palayan::Philippines': { lat: 15.5, lng: 121.6, name: 'Palayan' },
  'San Fernando::Philippines': { lat: 16.0127, lng: 120.6797, name: 'San Fernando' },

  // Bhutan cities
  'Thimphu::Bhutan': { lat: 27.5142, lng: 89.6398, name: 'Thimphu' },
  'Phuntsholing::Bhutan': { lat: 27.3971, lng: 89.1657, name: 'Phuntsholing' },
  'Punakha::Bhutan': { lat: 27.6041, lng: 89.8640, name: 'Punakha' },
  'Paro::Bhutan': { lat: 27.4309, lng: 89.4205, name: 'Paro' },
  'Wangdue Phodrang::Bhutan': { lat: 27.5287, lng: 89.6733, name: 'Wangdue Phodrang' },
  'Jakar::Bhutan': { lat: 27.2105, lng: 90.4678, name: 'Jakar' },
  'Mongar::Bhutan': { lat: 27.2849, lng: 91.1915, name: 'Mongar' },

  // India cities
  'Mumbai::India': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  'Delhi::India': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
  'Bangalore::India': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
  'Hyderabad::India': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
  'Chennai::India': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  'Kolkata::India': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  'Pune::India': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
  'Ahmedabad::India': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' },
  'Jaipur::India': { lat: 26.9124, lng: 75.7873, name: 'Jaipur' },
  'Surat::India': { lat: 21.1703, lng: 72.8311, name: 'Surat' },
  'Lucknow::India': { lat: 26.8467, lng: 80.9462, name: 'Lucknow' },
  'Chandigarh::India': { lat: 30.7333, lng: 76.7794, name: 'Chandigarh' },
  'Indore::India': { lat: 22.7196, lng: 75.8577, name: 'Indore' },
  'Bhopal::India': { lat: 23.1815, lng: 79.9864, name: 'Bhopal' },
  'Kochi::India': { lat: 9.9312, lng: 76.2673, name: 'Kochi' },
  'Bikaner::India': { lat: 28.0229, lng: 71.8547, name: 'Bikaner' },
  'Jodhpur::India': { lat: 26.2389, lng: 73.0243, name: 'Jodhpur' },
  'Udaipur::India': { lat: 24.5854, lng: 73.7125, name: 'Udaipur' },
  'Vadodara::India': { lat: 22.3072, lng: 73.1812, name: 'Vadodara' },
  'Nagpur::India': { lat: 21.1458, lng: 79.0882, name: 'Nagpur' },
  'Visakhapatnam::India': { lat: 17.6869, lng: 83.2185, name: 'Visakhapatnam' },
  'Ludhiana::India': { lat: 30.9010, lng: 75.8573, name: 'Ludhiana' },
  'Kanpur::India': { lat: 26.4499, lng: 80.3319, name: 'Kanpur' },
  'Varanasi::India': { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
  'Guwahati::India': { lat: 26.1445, lng: 91.7362, name: 'Guwahati' },
  'Patna::India': { lat: 25.5941, lng: 85.1376, name: 'Patna' },
  'Jamshedpur::India': { lat: 22.8046, lng: 86.1835, name: 'Jamshedpur' },
  'Srinagar::India': { lat: 34.0837, lng: 74.7973, name: 'Srinagar' },
  'Ranchi::India': { lat: 23.3441, lng: 85.3096, name: 'Ranchi' },
  'Raipur::India': { lat: 21.2514, lng: 81.6296, name: 'Raipur' },
  'Coimbatore::India': { lat: 11.0066, lng: 76.9485, name: 'Coimbatore' },
  'Mysore::India': { lat: 12.2958, lng: 76.6394, name: 'Mysore' },

  // Indonesia cities
  'Jakarta::Indonesia': { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
  'Surabaya::Indonesia': { lat: -7.2575, lng: 112.7521, name: 'Surabaya' },
  'Bandung::Indonesia': { lat: -6.9175, lng: 107.6062, name: 'Bandung' },
  'Medan::Indonesia': { lat: 3.5952, lng: 98.6722, name: 'Medan' },
  'Semarang::Indonesia': { lat: -6.9667, lng: 110.4167, name: 'Semarang' },
  'Makassar::Indonesia': { lat: -8.6500, lng: 119.4167, name: 'Makassar' },
  'Palembang::Indonesia': { lat: -2.9333, lng: 104.7667, name: 'Palembang' },
  'Tangerang::Indonesia': { lat: -6.1778, lng: 106.6333, name: 'Tangerang' },
  'Depok::Indonesia': { lat: -6.4000, lng: 106.7942, name: 'Depok' },
  'Bekasi::Indonesia': { lat: -6.2349, lng: 107.0063, name: 'Bekasi' },

  // Indonesia provinces
  'West Java Province::Indonesia': { lat: -6.9175, lng: 107.6062, name: 'West Java Province' },
  'East Java Province::Indonesia': { lat: -7.2575, lng: 112.7521, name: 'East Java Province' },
  'Central Java Province::Indonesia': { lat: -7.1500, lng: 110.1428, name: 'Central Java Province' },
  'South Sulawesi Province::Indonesia': { lat: -8.6500, lng: 119.4167, name: 'South Sulawesi Province' },
  'North Sulawesi Province::Indonesia': { lat: 1.4518, lng: 124.8754, name: 'North Sulawesi Province' },
  'South Kalimantan Province::Indonesia': { lat: -3.3000, lng: 114.5917, name: 'South Kalimantan Province' },
  'West Kalimantan Province::Indonesia': { lat: 0.0000, lng: 111.0000, name: 'West Kalimantan Province' },
  'Banten Province::Indonesia': { lat: -6.4000, lng: 106.6333, name: 'Banten Province' },
  'Riau Province::Indonesia': { lat: 0.5471, lng: 101.4472, name: 'Riau Province' },
  'Jambi Province::Indonesia': { lat: -1.6300, lng: 103.6167, name: 'Jambi Province' },
  'South Sumatra Province::Indonesia': { lat: -2.9333, lng: 104.7667, name: 'South Sumatra Province' },
  'North Sumatra Province::Indonesia': { lat: 3.5952, lng: 98.6722, name: 'North Sumatra Province' },
  'Aceh Province::Indonesia': { lat: 5.5317, lng: 95.3197, name: 'Aceh Province' },
  'Lampung Province::Indonesia': { lat: -5.2000, lng: 105.2667, name: 'Lampung Province' },
  'Yogyakarta::Indonesia': { lat: -7.8000, lng: 110.3833, name: 'Yogyakarta' },
  'Bali Province::Indonesia': { lat: -8.6705, lng: 115.2126, name: 'Bali Province' },
  'Nusa Tenggara Timur Province::Indonesia': { lat: -8.6500, lng: 123.5957, name: 'Nusa Tenggara Timur Province' },
  'Papua Province::Indonesia': { lat: -4.5, lng: 137.0, name: 'Papua Province' },
  'West Papua Province::Indonesia': { lat: -1.3667, lng: 130.7500, name: 'West Papua Province' },

  // Southeast Asia cities (expanded) - additional cities not in main sections
  'Bangkok::Thailand': { lat: 13.7563, lng: 100.5018, name: 'Bangkok' },
  'Chiang Mai::Thailand': { lat: 18.7883, lng: 98.9853, name: 'Chiang Mai' },
  'Phuket::Thailand': { lat: 7.8804, lng: 98.3923, name: 'Phuket' },
  'Ho Chi Minh City::Vietnam': { lat: 10.7769, lng: 106.6966, name: 'Ho Chi Minh City' },
  'Hanoi::Vietnam': { lat: 21.0285, lng: 105.8542, name: 'Hanoi' },
  'Da Nang::Vietnam': { lat: 16.0544, lng: 108.2022, name: 'Da Nang' },
  'Kuala Lumpur::Malaysia': { lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur' },
  'Georgetown::Malaysia': { lat: 5.3544, lng: 100.3309, name: 'Georgetown' },
  'Ipoh::Malaysia': { lat: 4.5921, lng: 101.0901, name: 'Ipoh' },
  'Johor Bahru::Malaysia': { lat: 1.4854, lng: 103.7618, name: 'Johor Bahru' },
  'Kuching::Malaysia': { lat: 1.5533, lng: 110.3592, name: 'Kuching' },
  'Kota Kinabalu::Malaysia': { lat: 5.9788, lng: 116.0753, name: 'Kota Kinabalu' },
  'Phnom Penh::Cambodia': { lat: 11.5564, lng: 104.9282, name: 'Phnom Penh' },
  'Siem Reap::Cambodia': { lat: 13.3671, lng: 103.8448, name: 'Siem Reap' },
  'Singapore::Singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'Yangon::Myanmar': { lat: 16.8661, lng: 96.1951, name: 'Yangon' },
  'Mandalay::Myanmar': { lat: 21.9162, lng: 96.0956, name: 'Mandalay' },
  'Naypyidaw::Myanmar': { lat: 19.7674, lng: 96.0857, name: 'Naypyidaw' },
  'Pattaya::Thailand': { lat: 12.9271, lng: 100.8765, name: 'Pattaya' },
  'Khon Kaen::Thailand': { lat: 16.4469, lng: 102.8360, name: 'Khon Kaen' },
  'Hat Yai::Thailand': { lat: 7.0064, lng: 100.4661, name: 'Hat Yai' },
  'Haiphong::Vietnam': { lat: 20.8449, lng: 106.6881, name: 'Haiphong' },
  'Can Tho::Vietnam': { lat: 10.0379, lng: 105.7869, name: 'Can Tho' },
  'Mekong Delta::Vietnam': { lat: 9.5, lng: 105.5, name: 'Mekong Delta' },

  // Laos cities
  'Vientiane::Laos': { lat: 17.9757, lng: 102.6331, name: 'Vientiane' },
  'Luang Prabang::Laos': { lat: 19.8845, lng: 102.1348, name: 'Luang Prabang' },

  // Bangladesh cities
  'Dhaka::Bangladesh': { lat: 23.8103, lng: 90.4125, name: 'Dhaka' },
  'Chittagong::Bangladesh': { lat: 22.3384, lng: 91.8144, name: 'Chittagong' },

  // Pakistan cities
  'Karachi::Pakistan': { lat: 24.8607, lng: 67.0011, name: 'Karachi' },
  'Lahore::Pakistan': { lat: 31.5497, lng: 74.3436, name: 'Lahore' },
  'Islamabad::Pakistan': { lat: 33.6844, lng: 73.0479, name: 'Islamabad' },

  // Japan cities
  'Tokyo::Japan': { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  'Osaka::Japan': { lat: 34.6937, lng: 135.5023, name: 'Osaka' },
  'Kyoto::Japan': { lat: 35.0116, lng: 135.7681, name: 'Kyoto' },

  // South Korea cities
  'Seoul::South Korea': { lat: 37.5665, lng: 126.9780, name: 'Seoul' },
  'Busan::South Korea': { lat: 35.1796, lng: 129.0756, name: 'Busan' },

  // China cities
  'Beijing::Mainland China': { lat: 39.9042, lng: 116.4074, name: 'Beijing' },
  'Shanghai::Mainland China': { lat: 31.2304, lng: 121.4737, name: 'Shanghai' },
  'Guangzhou::Mainland China': { lat: 23.1291, lng: 113.2644, name: 'Guangzhou' },
  'Changsha::Mainland China': { lat: 28.2282, lng: 112.9388, name: 'Changsha' },
  'Chongqing::Mainland China': { lat: 29.4316, lng: 106.9123, name: 'Chongqing' },
  'Xi\'an::Mainland China': { lat: 34.3416, lng: 108.9398, name: 'Xi\'an' },
  'Hangzhou::Mainland China': { lat: 30.2741, lng: 120.1551, name: 'Hangzhou' },
  'Shenzhen::Mainland China': { lat: 22.5431, lng: 114.0579, name: 'Shenzhen' },
  'Wuhan::Mainland China': { lat: 30.5928, lng: 114.3055, name: 'Wuhan' },
  'Nanjing::Mainland China': { lat: 32.0603, lng: 118.7969, name: 'Nanjing' },
  'Chengdu::Mainland China': { lat: 30.5728, lng: 104.0668, name: 'Chengdu' },
  'Harbin::Mainland China': { lat: 45.8038, lng: 126.5349, name: 'Harbin' },
  'Qingdao::Mainland China': { lat: 36.0671, lng: 120.3826, name: 'Qingdao' },
  'Tianjin::Mainland China': { lat: 39.0842, lng: 117.2010, name: 'Tianjin' },

  // Sri Lanka cities
  'Colombo::Sri Lanka': { lat: 6.9271, lng: 80.6368, name: 'Colombo' },
  'Kandy::Sri Lanka': { lat: 7.2906, lng: 80.6337, name: 'Kandy' },

  // Nepal cities
  'Kathmandu::Nepal': { lat: 27.7172, lng: 85.3240, name: 'Kathmandu' },
  'Pokhara::Nepal': { lat: 28.2096, lng: 83.9856, name: 'Pokhara' },

  // African cities - Top 20
  'Cairo::Egypt': { lat: 30.0444, lng: 31.2357, name: 'Cairo' },
  'Alexandria::Egypt': { lat: 31.2001, lng: 29.9187, name: 'Alexandria' },
  'Lagos::Nigeria': { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
  'Kano::Nigeria': { lat: 12.0022, lng: 8.6753, name: 'Kano' },
  'Nairobi::Kenya': { lat: -1.2921, lng: 36.8219, name: 'Nairobi' },
  'Mombasa::Kenya': { lat: -4.0435, lng: 39.6682, name: 'Mombasa' },
  'Johannesburg::South Africa': { lat: -26.2044, lng: 28.0456, name: 'Johannesburg' },
  'Cape Town::South Africa': { lat: -33.9249, lng: 18.4241, name: 'Cape Town' },
  'Durban::South Africa': { lat: -29.8587, lng: 31.0218, name: 'Durban' },
  'Kinshasa::Democratic Republic of the Congo': { lat: -4.3369, lng: 15.3136, name: 'Kinshasa' },
  'Abuja::Nigeria': { lat: 9.0765, lng: 7.3986, name: 'Abuja' },
  'Accra::Ghana': { lat: 5.6037, lng: -0.1870, name: 'Accra' },
  'Algiers::Algeria': { lat: 36.7538, lng: 3.0588, name: 'Algiers' },
  'Addis Ababa::Ethiopia': { lat: 9.0320, lng: 38.7469, name: 'Addis Ababa' },
  'Dar es Salaam::Tanzania': { lat: -6.8000, lng: 39.2833, name: 'Dar es Salaam' },
  'Kampala::Uganda': { lat: 0.3476, lng: 32.5825, name: 'Kampala' },
  'Khartoum::Sudan': { lat: 15.5007, lng: 32.5599, name: 'Khartoum' },
  'Douala::Cameroon': { lat: 4.0511, lng: 9.7679, name: 'Douala' },
  'Yaounde::Cameroon': { lat: 3.8667, lng: 11.5167, name: 'Yaounde' },
  'Casablanca::Morocco': { lat: 33.5731, lng: -7.5898, name: 'Casablanca' },

  // European cities - Top 20
  'London::United Kingdom': { lat: 51.5074, lng: -0.1278, name: 'London' },
  'Paris::France': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  'Berlin::Germany': { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
  'Madrid::Spain': { lat: 40.4168, lng: -3.7038, name: 'Madrid' },
  'Rome::Italy': { lat: 41.9028, lng: 12.4964, name: 'Rome' },
  'Moscow::Russia': { lat: 55.7558, lng: 37.6173, name: 'Moscow' },
  'Amsterdam::Netherlands': { lat: 52.3676, lng: 4.9041, name: 'Amsterdam' },
  'Vienna::Austria': { lat: 48.2082, lng: 16.3738, name: 'Vienna' },
  'Prague::Czech Republic': { lat: 50.0755, lng: 14.4378, name: 'Prague' },
  'Warsaw::Poland': { lat: 52.2297, lng: 21.0122, name: 'Warsaw' },

  // Americas cities (expanded)
  'New York::United States': { lat: 40.7128, lng: -74.0060, name: 'New York' },
  'Los Angeles::United States': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
  'Chicago::United States': { lat: 41.8781, lng: -87.6298, name: 'Chicago' },
  'Houston::United States': { lat: 29.7604, lng: -95.3698, name: 'Houston' },
  'Phoenix::United States': { lat: 33.4484, lng: -112.0742, name: 'Phoenix' },
  'Toronto::Canada': { lat: 43.6532, lng: -79.3832, name: 'Toronto' },
  'Vancouver::Canada': { lat: 49.2827, lng: -123.1207, name: 'Vancouver' },
  'Mexico City::Mexico': { lat: 19.4326, lng: -99.1332, name: 'Mexico City' },
  'Guadalajara::Mexico': { lat: 20.6595, lng: -103.2494, name: 'Guadalajara' },
  'São Paulo::Brazil': { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
  'Rio de Janeiro::Brazil': { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
  'Brasília::Brazil': { lat: -15.7942, lng: -47.8822, name: 'Brasília' },
  'Salvador::Brazil': { lat: -12.9714, lng: -38.5014, name: 'Salvador' },
  'Buenos Aires::Argentina': { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires' },
  'Lima::Peru': { lat: -12.0464, lng: -77.0428, name: 'Lima' },
  'Santiago::Chile': { lat: -33.8688, lng: -70.6693, name: 'Santiago' },
  'Bogotá::Colombia': { lat: 4.7110, lng: -74.0721, name: 'Bogotá' },
  'Medellín::Colombia': { lat: 6.2442, lng: -75.5812, name: 'Medellín' },
  'Quito::Ecuador': { lat: -0.2299, lng: -78.5047, name: 'Quito' },
  'Caracas::Venezuela': { lat: 10.4806, lng: -66.9036, name: 'Caracas' },

  // Middle East cities (expanded)
  'Dubai::United Arab Emirates': { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  'Abu Dhabi::United Arab Emirates': { lat: 24.4539, lng: 54.3773, name: 'Abu Dhabi' },
  'Tehran::Iran': { lat: 35.6892, lng: 51.3890, name: 'Tehran' },
  'Baghdad::Iraq': { lat: 33.3128, lng: 44.3615, name: 'Baghdad' },
  'Jerusalem::Israel': { lat: 31.7683, lng: 35.2137, name: 'Jerusalem' },
  'Tel Aviv::Israel': { lat: 32.0853, lng: 34.7818, name: 'Tel Aviv' },
  'Beirut::Lebanon': { lat: 33.8886, lng: 35.4955, name: 'Beirut' },
  'Amman::Jordan': { lat: 31.9454, lng: 35.9284, name: 'Amman' },
  'Istanbul::Turkey': { lat: 41.0082, lng: 28.9784, name: 'Istanbul' },
  'Ankara::Turkey': { lat: 39.9334, lng: 32.8597, name: 'Ankara' },
  'Riyadh::Saudi Arabia': { lat: 24.7136, lng: 46.6753, name: 'Riyadh' },
  'Jeddah::Saudi Arabia': { lat: 21.5433, lng: 39.1728, name: 'Jeddah' },
  'Doha::Qatar': { lat: 25.2854, lng: 51.5310, name: 'Doha' },
  'Kuwait City::Kuwait': { lat: 29.3759, lng: 47.9774, name: 'Kuwait City' },

  // Oceania cities
  'Sydney::Australia': { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
  'Melbourne::Australia': { lat: -37.8136, lng: 144.9631, name: 'Melbourne' },
  'Brisbane::Australia': { lat: -27.4698, lng: 153.0251, name: 'Brisbane' },
  'Auckland::New Zealand': { lat: -37.0882, lng: 174.8860, name: 'Auckland' },
  'Wellington::New Zealand': { lat: -41.2865, lng: 174.7762, name: 'Wellington' },
};

/**
 * Get city coordinates by city and country
 * @param city City name
 * @param country Country name
 * @returns Coordinates object or null if not found
 */
export function getCityCoordinates(city: string, country: string) {
  const key = `${city}::${country}`;
  return cityCoordinates[key] || null;
}

/**
 * Get all cities for a country
 * @param country Country name
 * @returns Array of cities in that country
 */
export function getCitiesForCountry(country: string) {
  return Object.keys(cityCoordinates)
    .filter(key => key.endsWith(`::${country}`))
    .map(key => {
      const city = key.split('::')[0];
      return {
        city,
        coords: cityCoordinates[key]
      };
    });
}
