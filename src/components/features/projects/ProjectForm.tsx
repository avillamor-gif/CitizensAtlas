import React, { useState, useEffect, useRef } from 'react';
import MapGL, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Project } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/contexts/AuthContext';
import { MagnifyingGlassIcon } from '@/components/ui/icons';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectFormProps {
    onClose: () => void;
    onProjectAdded: () => void;
    projectToEdit?: Project | null;
    isModal?: boolean; // If false, renders as inline form without overlay
    onAddProject?: (projectData: Omit<Project, 'id'>) => void;
    onUpdateProject?: (project: Project) => void;
    prefilledLocation?: {
        latitude?: number;
        longitude?: number;
        country?: string;
        city?: string;
    };
    userRole?: 'contributor' | 'admin' | 'super-admin';
}

const FormField: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
    <div className="mb-2 space-y-2">
        <Label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {children}
    </div>
);

// Region to Countries mapping
const regionCountries: Record<string, string[]> = {
    'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
    'Asia': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'],
    'Europe': ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'],
    'North America': ['Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'United States'],
    'South America': ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
    'Oceania': ['Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu']
};

// Country to Cities mapping
const countryCities: Record<string, string[]> = {
    // Africa
    'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Sétif', 'Sidi Bel Abbès'],
    'Angola': ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Lubango', 'Kuito', 'Malanje'],
    'Benin': ['Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Abomey-Calavi'],
    'Botswana': ['Gaborone', 'Francistown', 'Molepolole', 'Maun', 'Serowe', 'Selibe Phikwe'],
    'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora'],
    'Burundi': ['Gitega', 'Bujumbura', 'Muyinga', 'Ngozi', 'Ruyigi', 'Bururi'],
    'Cameroon': ['Yaoundé', 'Douala', 'Garoua', 'Bamenda', 'Bafoussam', 'Maroua', 'Nkongsamba'],
    'Cape Verde': ['Praia', 'Mindelo', 'Santa Maria', 'Assomada', 'São Filipe'],
    'Central African Republic': ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar'],
    'Chad': ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kelo', 'Koumra'],
    'Comoros': ['Moroni', 'Mutsamudu', 'Fomboni', 'Domoni', 'Mitsamiouli'],
    'Congo': ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Kayes', 'Owando', 'Ouesso'],
    'Democratic Republic of the Congo': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Kananga', 'Goma', 'Bukavu', 'Likasi'],
    'Djibouti': ['Djibouti City', 'Ali Sabieh', 'Tadjoura', 'Obock', 'Dikhil', 'Arta'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Mansoura', 'Tanta'],
    'Equatorial Guinea': ['Malabo', 'Bata', 'Ebebiyin', 'Aconibe', 'Mongomo'],
    'Eritrea': ['Asmara', 'Keren', 'Massawa', 'Assab', 'Mendefera', 'Barentu'],
    'Eswatini': ['Mbabane', 'Manzini', 'Lobamba', 'Big Bend', 'Malkerns', 'Nhlangano'],
    'Ethiopia': ['Addis Ababa', 'Dire Dawa', 'Mek\'ele', 'Gondar', 'Hawassa', 'Bahir Dar', 'Dessie', 'Jimma'],
    'Gabon': ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila'],
    'Gambia': ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin'],
    'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Ashaiman', 'Tema', 'Cape Coast', 'Obuasi'],
    'Guinea': ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé', 'Kamsar'],
    'Guinea-Bissau': ['Bissau', 'Bafatá', 'Gabú', 'Bissorã', 'Bolama', 'Cacheu'],
    'Ivory Coast': ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'],
    'Lesotho': ['Maseru', 'Teyateyaneng', 'Mafeteng', 'Hlotse', 'Mohale\'s Hoek', 'Maputsoe'],
    'Liberia': ['Monrovia', 'Gbarnga', 'Buchanan', 'Ganta', 'Kakata', 'Bensonville'],
    'Libya': ['Tripoli', 'Benghazi', 'Misrata', 'Zawiya', 'Bayda', 'Ajdabiya', 'Tobruk'],
    'Madagascar': ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara', 'Antsiranana'],
    'Malawi': ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi'],
    'Mali': ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Ségou', 'Kayes', 'Gao', 'Timbuktu'],
    'Mauritania': ['Nouakchott', 'Nouadhibou', 'Néma', 'Kaédi', 'Rosso', 'Zouerate'],
    'Mauritius': ['Port Louis', 'Beau Bassin-Rose Hill', 'Vacoas-Phoenix', 'Curepipe', 'Quatre Bornes'],
    'Morocco': ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra'],
    'Mozambique': ['Maputo', 'Matola', 'Nampula', 'Beira', 'Chimoio', 'Quelimane', 'Tete'],
    'Namibia': ['Windhoek', 'Rundu', 'Walvis Bay', 'Swakopmund', 'Oshakati', 'Katima Mulilo'],
    'Niger': ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Diffa'],
    'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Enugu', 'Zaria', 'Aba'],
    'Rwanda': ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba'],
    'São Tomé and Príncipe': ['São Tomé', 'Santo António', 'Trindade', 'Neves', 'Santana'],
    'Senegal': ['Dakar', 'Touba', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour'],
    'Seychelles': ['Victoria', 'Anse Boileau', 'Beau Vallon', 'Cascade', 'Takamaka'],
    'Sierra Leone': ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Waterloo'],
    'Somalia': ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Marka', 'Berbera', 'Baidoa'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg', 'Kimberley', 'Nelspruit'],
    'South Sudan': ['Juba', 'Malakal', 'Wau', 'Yei', 'Yambio', 'Bor', 'Torit'],
    'Sudan': ['Khartoum', 'Omdurman', 'Port Sudan', 'Kassala', 'Nyala', 'El-Obeid', 'Kosti'],
    'Tanzania': ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar City'],
    'Togo': ['Lomé', 'Sokodé', 'Kara', 'Kpalimé', 'Atakpamé', 'Dapaong'],
    'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana'],
    'Uganda': ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Mbale', 'Mukono', 'Entebbe'],
    'Zambia': ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone'],
    'Zimbabwe': ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma'],
    
    // Asia
    'Afghanistan': ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Jalalabad', 'Kunduz', 'Lashkar Gah'],
    'Armenia': ['Yerevan', 'Gyumri', 'Vanadzor', 'Vagharshapat', 'Hrazdan', 'Abovyan'],
    'Azerbaijan': ['Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Lankaran', 'Shaki'],
    'Bahrain': ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town', 'Sitra'],
    'Bangladesh': ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Comilla', 'Narayanganj'],
    'Bhutan': ['Thimphu', 'Phuntsholing', 'Punakha', 'Paro', 'Wangdue Phodrang', 'Jakar'],
    'Brunei': ['Bandar Seri Begawan', 'Kuala Belait', 'Seria', 'Tutong', 'Bangar'],
    'Cambodia': ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampong Cham', 'Poipet'],
    'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xi\'an', 'Chongqing', 'Tianjin', 'Nanjing', 'Suzhou'],
    'Cyprus': ['Nicosia', 'Limassol', 'Larnaca', 'Famagusta', 'Paphos', 'Kyrenia'],
    'Georgia': ['Tbilisi', 'Kutaisi', 'Batumi', 'Rustavi', 'Zugdidi', 'Gori'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur'],
    'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'],
    'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz'],
    'Iraq': ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Kirkuk', 'Najaf', 'Karbala', 'Sulaymaniyah'],
    'Israel': ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Beersheba'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Hiroshima', 'Sendai'],
    'Jordan': ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Aqaba', 'Madaba', 'Jerash'],
    'Kazakhstan': ['Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe', 'Taraz', 'Pavlodar'],
    'Kuwait': ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'As Salimiyah', 'Sabah as Salim', 'Al Farwaniyah'],
    'Kyrgyzstan': ['Bishkek', 'Osh', 'Jalal-Abad', 'Karakol', 'Tokmok', 'Naryn'],
    'Laos': ['Vientiane', 'Luang Prabang', 'Savannakhet', 'Pakse', 'Thakhek', 'Xam Neua'],
    'Lebanon': ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Zahle', 'Baalbek'],
    'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Johor Bahru', 'Kuching', 'Kota Kinabalu', 'Malacca City', 'Petaling Jaya'],
    'Maldives': ['Malé', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi', 'Thinadhoo'],
    'Mongolia': ['Ulaanbaatar', 'Erdenet', 'Darkhan', 'Choibalsan', 'Mörön', 'Khovd'],
    'Myanmar': ['Yangon', 'Mandalay', 'Naypyidaw', 'Mawlamyine', 'Bago', 'Pathein', 'Taunggyi'],
    'Nepal': ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur', 'Birgunj', 'Dharan'],
    'North Korea': ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan', 'Sinuiju'],
    'Oman': ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Ibri', 'Buraimi'],
    'Pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'],
    'Palestine': ['Gaza City', 'Hebron', 'Nablus', 'Ramallah', 'Khan Yunis', 'Bethlehem', 'Jenin'],
    'Philippines': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig', 'Pasig', 'Antipolo'],
    'Qatar': ['Doha', 'Al Wakrah', 'Al Rayyan', 'Umm Salal', 'Al Khor', 'Dukhan'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Tabuk', 'Buraidah', 'Khobar'],
    'Singapore': ['Singapore', 'Jurong', 'Woodlands', 'Tampines', 'Bedok', 'Hougang'],
    'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Suwon'],
    'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Trincomalee', 'Batticaloa'],
    'Syria': ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Deir ez-Zor', 'Raqqa'],
    'Taiwan': ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hsinchu', 'Keelung', 'Chiayi'],
    'Tajikistan': ['Dushanbe', 'Khujand', 'Kulob', 'Qurghonteppa', 'Istaravshan', 'Konibodom'],
    'Thailand': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Khon Kaen', 'Hat Yai', 'Nakhon Ratchasima', 'Udon Thani'],
    'Timor-Leste': ['Dili', 'Baucau', 'Maliana', 'Suai', 'Lospalos', 'Aileu'],
    'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya'],
    'Turkmenistan': ['Ashgabat', 'Turkmenabat', 'Dasoguz', 'Mary', 'Balkanabat', 'Turkmenbashi'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    'Uzbekistan': ['Tashkent', 'Samarkand', 'Namangan', 'Andijan', 'Bukhara', 'Nukus', 'Fergana'],
    'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang'],
    'Yemen': ['Sana\'a', 'Aden', 'Taiz', 'Hodeidah', 'Ibb', 'Mukalla', 'Dhamar'],
    
    // Europe
    'Albania': ['Tirana', 'Durrës', 'Vlorë', 'Elbasan', 'Shkodër', 'Fier', 'Korçë'],
    'Andorra': ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana'],
    'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach'],
    'Belarus': ['Minsk', 'Gomel', 'Mogilev', 'Vitebsk', 'Grodno', 'Brest', 'Bobruisk'],
    'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven'],
    'Bosnia and Herzegovina': ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina'],
    'Bulgaria': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven'],
    'Croatia': ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Dubrovnik'],
    'Czech Republic': ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Hradec Králové'],
    'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding'],
    'Estonia': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi'],
    'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Ioannina'],
    'Hungary': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza'],
    'Iceland': ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær', 'Garðabær'],
    'Ireland': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Verona'],
    'Kosovo': ['Pristina', 'Prizren', 'Ferizaj', 'Peja', 'Gjakova', 'Gjilan'],
    'Latvia': ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils'],
    'Liechtenstein': ['Vaduz', 'Schaan', 'Balzers', 'Triesen', 'Eschen'],
    'Lithuania': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus'],
    'Luxembourg': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck'],
    'Malta': ['Valletta', 'Birkirkara', 'Mosta', 'Qormi', 'Żabbar', 'Sliema'],
    'Moldova': ['Chișinău', 'Tiraspol', 'Bălți', 'Bender', 'Rîbnița', 'Cahul'],
    'Monaco': ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille'],
    'Montenegro': ['Podgorica', 'Nikšić', 'Pljevlja', 'Bijelo Polje', 'Cetinje', 'Bar'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere'],
    'North Macedonia': ['Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles'],
    'Norway': ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Drammen', 'Fredrikstad', 'Kristiansand'],
    'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
    'Portugal': ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Funchal', 'Amadora', 'Setúbal', 'Faro'],
    'Romania': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'],
    'San Marino': ['San Marino', 'Serravalle', 'Borgo Maggiore', 'Domagnano', 'Fiorentino'],
    'Serbia': ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo'],
    'Slovakia': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava'],
    'Slovenia': ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Bilbao', 'Las Palmas', 'Alicante'],
    'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg'],
    'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen'],
    'Ukraine': ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv', 'Kryvyi Rih'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Sheffield', 'Cardiff', 'Belfast', 'Newcastle'],
    'Vatican City': ['Vatican City'],
    
    // North America
    'Antigua and Barbuda': ['Saint John\'s', 'All Saints', 'Liberta', 'Parham', 'Codrington'],
    'Bahamas': ['Nassau', 'Freeport', 'West End', 'Cooper\'s Town', 'Marsh Harbour'],
    'Barbados': ['Bridgetown', 'Speightstown', 'Oistins', 'Bathsheba', 'Holetown'],
    'Belize': ['Belize City', 'San Ignacio', 'Belmopan', 'Orange Walk', 'Dangriga', 'Corozal'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    'Costa Rica': ['San José', 'Limón', 'Alajuela', 'Heredia', 'Cartago', 'Puntarenas', 'Liberia'],
    'Cuba': ['Havana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Santa Clara', 'Guantánamo', 'Bayamo'],
    'Dominica': ['Roseau', 'Portsmouth', 'Marigot', 'Berekua', 'Saint Joseph'],
    'Dominican Republic': ['Santo Domingo', 'Santiago de los Caballeros', 'La Romana', 'San Pedro de Macorís', 'San Francisco de Macorís'],
    'El Salvador': ['San Salvador', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Soyapango', 'Santa Tecla'],
    'Grenada': ['St. George\'s', 'Gouyave', 'Grenville', 'Victoria', 'Sauteurs'],
    'Guatemala': ['Guatemala City', 'Quetzaltenango', 'Mixco', 'Villa Nueva', 'Petapa', 'Escuintla'],
    'Haiti': ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Pétionville', 'Delmas'],
    'Honduras': ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca'],
    'Jamaica': ['Kingston', 'Montego Bay', 'Spanish Town', 'Portmore', 'May Pen', 'Mandeville'],
    'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Cancún', 'Mérida', 'Querétaro', 'Acapulco'],
    'Nicaragua': ['Managua', 'León', 'Granada', 'Masaya', 'Matagalpa', 'Chinandega', 'Estelí'],
    'Panama': ['Panama City', 'Colón', 'David', 'La Chorrera', 'Santiago', 'Chitré', 'Tocumen'],
    'Saint Kitts and Nevis': ['Basseterre', 'Charlestown', 'Monkey Hill', 'Sandy Point Town', 'Fig Tree'],
    'Saint Lucia': ['Castries', 'Vieux Fort', 'Gros Islet', 'Micoud', 'Soufrière'],
    'Saint Vincent and the Grenadines': ['Kingstown', 'Georgetown', 'Barrouallie', 'Port Elizabeth', 'Layou'],
    'Trinidad and Tobago': ['Port of Spain', 'San Fernando', 'Chaguanas', 'Arima', 'Point Fortin', 'Scarborough'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Miami', 'Cleveland', 'Tulsa', 'Oakland', 'Minneapolis', 'Wichita', 'New Orleans', 'Arlington', 'Bakersfield', 'Tampa', 'Aurora', 'Honolulu', 'Anaheim', 'Santa Ana', 'Riverside', 'Corpus Christi', 'Lexington', 'Pittsburgh', 'Anchorage', 'Stockton', 'Cincinnati', 'Saint Paul', 'Toledo', 'Greensboro', 'Newark', 'Plano', 'Henderson', 'Lincoln', 'Buffalo', 'Jersey City', 'Chula Vista', 'Orlando', 'Norfolk', 'Chandler', 'Laredo', 'Madison', 'Durham', 'Lubbock', 'Winston-Salem', 'Garland', 'Glendale', 'Hialeah', 'Reno', 'Baton Rouge', 'Irvine', 'Chesapeake', 'Irving', 'Scottsdale', 'North Las Vegas', 'Fremont', 'Gilbert', 'San Bernardino', 'Boise', 'Birmingham'],
    
    // South America
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta'],
    'Bolivia': ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Oruro', 'Tarija', 'Potosí'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Iquique'],
    'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira'],
    'Ecuador': ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Manta', 'Portoviejo', 'Ambato'],
    'Guyana': ['Georgetown', 'Linden', 'New Amsterdam', 'Anna Regina', 'Bartica'],
    'Paraguay': ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Encarnación'],
    'Peru': ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Cusco', 'Piura', 'Iquitos', 'Huancayo'],
    'Suriname': ['Paramaribo', 'Lelydorp', 'Nieuw Nickerie', 'Moengo', 'Nieuw Amsterdam'],
    'Uruguay': ['Montevideo', 'Salto', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado'],
    'Venezuela': ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Barcelona', 'Maturín'],
    
    // Oceania
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Logan City', 'Geelong', 'Hobart', 'Townsville', 'Cairns', 'Darwin'],
    'Fiji': ['Suva', 'Lautoka', 'Nadi', 'Labasa', 'Ba', 'Levuka', 'Nausori'],
    'Kiribati': ['Tarawa', 'Betio', 'Bikenibeu', 'Teaoraereke'],
    'Marshall Islands': ['Majuro', 'Ebeye', 'Jabor', 'Wotje', 'Mili'],
    'Micronesia': ['Palikir', 'Weno', 'Kolonia', 'Tofol', 'Colonia'],
    'Nauru': ['Yaren', 'Denigomodu', 'Aiwo', 'Anabar', 'Meneng'],
    'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin', 'Palmerston North', 'Napier'],
    'Palau': ['Ngerulmud', 'Koror', 'Melekeok', 'Airai', 'Ngardmau'],
    'Papua New Guinea': ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Wewak', 'Goroka', 'Kimbe'],
    'Samoa': ['Apia', 'Vaitele', 'Faleula', 'Siusega', 'Malie', 'Vaiusu'],
    'Solomon Islands': ['Honiara', 'Gizo', 'Auki', 'Kirakira', 'Buala', 'Tulagi'],
    'Tonga': ['Nuku\'alofa', 'Neiafu', 'Haveluloto', 'Vaini', 'Pangai'],
    'Tuvalu': ['Funafuti', 'Vaiaku', 'Alapi', 'Asau', 'Lolua'],
    'Vanuatu': ['Port Vila', 'Luganville', 'Norsup', 'Isangel', 'Sola']
};

// Helper function to convert string to title case
const toTitleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper function to get region from country (case-insensitive)
const getRegionFromCountry = (country: string): string => {
    if (!country) return '';
    const countryLower = country.toLowerCase();
    console.log('🔍 getRegionFromCountry - Looking for:', country, '(lowercase:', countryLower, ')');
    for (const [region, countries] of Object.entries(regionCountries)) {
        const found = countries.some(c => c.toLowerCase() === countryLower);
        if (found) {
            console.log('✅ Found region:', region, 'for country:', country);
            return region;
        }
    }
    console.log('❌ No region found for country:', country);
    return '';
};

const parseDetails = (details: string) => {
    const detailsMap = new Map<string, string>();
    if (!details) return detailsMap;
    const lines = details.replace(/\n---\n/g, '\n').split('\n');
    let currentKey: string | null = null;
    for (const line of lines) {
        const match = line.match(/^\*\*(.*?):\*\*(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            detailsMap.set(key, value);
            currentKey = key;
        } else if (currentKey) {
            const existingValue = detailsMap.get(currentKey) || '';
            detailsMap.set(currentKey, `${existingValue}\n${line.trim()}`);
        }
    }
    return detailsMap;
};

const emptyFormState = {
    region: '',
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    projectName: '',
    projectNumber: '',
    falseSolutions: [''],
    ifi: '',
    fundingSource: '',
    financialInstruments: [{ amount: '' }],
    totalProjectAmount: 0,
    owner: '',
    privateSectorBorrowers: [''],
    projectDescription: '',
    projectStatus: '',
    approvalDate: '',
    startDate: '',
    endDate: '',
    publishDate: '',
    environmental: [''],
    socialSafeguard: [''],
    keyDocuments: null as FileList | null,
    groupsInOpposition: [''],
    typesOfActions: '',
    linksToActions: '',
    activeGaiAASupport: '',
    notes: '',
    references: '',
    genderConcerns: '',
    wasteWorkers: '',
    displacement: '',
};

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onProjectAdded, projectToEdit, isModal = true, onAddProject, onUpdateProject, prefilledLocation, userRole = 'contributor' }) => {
    const { user } = useAuth();
    const isEditMode = Boolean(projectToEdit);
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const [formData, setFormData] = useState({ ...emptyFormState, publishDate: today });
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);
    const [environmentalCategories, setEnvironmentalCategories] = useState(['Category A', 'Category B', 'Category C', 'N/A']);
    const [socialSafeguardCategories, setSocialSafeguardCategories] = useState(['Category A', 'Category B', 'Category C', 'N/A']);
    const [showAddEnvironmentalCategory, setShowAddEnvironmentalCategory] = useState(false);
    const [showAddSocialSafeguardCategory, setShowAddSocialSafeguardCategory] = useState(false);
    const [newEnvironmentalCategory, setNewEnvironmentalCategory] = useState('');
    const [newSocialSafeguardCategory, setNewSocialSafeguardCategory] = useState('');
    const [showManageEnvironmentalCategories, setShowManageEnvironmentalCategories] = useState(false);
    const [showManageSocialSafeguardCategories, setShowManageSocialSafeguardCategories] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<any>(null);

    const SectionTitle: React.FC<{ children: React.ReactNode; isFirst?: boolean }> = ({ children, isFirst = false }) => (
        <div className={isFirst && !isModal ? "pt-0 mt-0 mb-4" : "pt-6 mt-6 mb-4 border-t"}>
            <h3 className="text-lg font-semibold text-brand-dark-blue">{children}</h3>
        </div>
    );

    useEffect(() => {
        if (isEditMode && projectToEdit) {
            const detailsMap = parseDetails(projectToEdit.details);
            const totalAmountStr = (detailsMap.get('Total Project Amount') || '0').replace(/[^0-9.]/g, '');
            const totalAmountNum = parseFloat(totalAmountStr) || 0;
            
            // Get country and derive region from it if region not in details
            const country = projectToEdit.country || '';
            const regionFromDetails = detailsMap.get('Region') || '';
            const region = regionFromDetails || (country ? getRegionFromCountry(country) : '');
            
            // Normalize country to title case to match Select options
            const normalizedCountry = country ? toTitleCase(country) : '';
            
            console.log('🔍 ProjectForm Edit Mode - Country:', country);
            console.log('🔍 ProjectForm Edit Mode - Normalized country:', normalizedCountry);
            console.log('🔍 ProjectForm Edit Mode - Region from details:', regionFromDetails);
            console.log('🔍 ProjectForm Edit Mode - Computed region:', region);
            console.log('🔍 ProjectForm Edit Mode - All details:', Object.fromEntries(detailsMap));
            
            setFormData({
                region,
                country: normalizedCountry,
                city: detailsMap.get('City') || '',
                latitude: projectToEdit.latitude?.toString() || '',
                longitude: projectToEdit.longitude?.toString() || '',
                projectName: projectToEdit.title || '',
                projectNumber: detailsMap.get('Project Number') || '',
                falseSolutions: projectToEdit.corruptionType?.split(', ').map(s => s.trim()) || [''],
                ifi: detailsMap.get('IFI') || '',
                fundingSource: detailsMap.get('Funding Source') || '',
                financialInstruments: [{ amount: totalAmountStr }],
                totalProjectAmount: totalAmountNum,
                owner: detailsMap.get('Owner') || '',
                privateSectorBorrowers: detailsMap.get('Private Sector Borrowers')?.split(', ').map(s => s.trim()) || [''],
                projectDescription: detailsMap.get('Project Description') || '',
                projectStatus: detailsMap.get('Project Status') || '',
                approvalDate: projectToEdit.date || '',
                startDate: detailsMap.get('Start Date') || '',
                endDate: detailsMap.get('End Date') || '',
                publishDate: projectToEdit.publishDate || '',
                environmental: detailsMap.get('Environmental Category')?.split(', ').map(s => s.trim()) || [''],
                socialSafeguard: detailsMap.get('Social Safeguard')?.split(', ').map(s => s.trim()) || [''],
                keyDocuments: null,
                groupsInOpposition: detailsMap.get('Groups in Opposition')?.split(', ').map(s => s.trim()) || [''],
                typesOfActions: detailsMap.get('Types of Actions') || '',
                linksToActions: detailsMap.get('Links to Actions') || '',
                activeGaiAASupport: detailsMap.get('Active GAIA Support') || '',
                notes: detailsMap.get('Notes') || '',
                references: detailsMap.get('References') || '',
                genderConcerns: detailsMap.get('Gender Concerns') || '',
                wasteWorkers: detailsMap.get('Waste Workers') || '',
                displacement: detailsMap.get('Displacement') || '',
            });
            
            console.log('✅ ProjectForm - State set with region:', region, 'country:', country);
            setIsLoadingData(false);
        } else if (prefilledLocation && !isEditMode) {
            // If we have prefilled location data from map click, use it
            const country = prefilledLocation.country || '';
            const region = country ? getRegionFromCountry(country) : '';
            const city = prefilledLocation.city || '';
            
            setFormData({
                ...emptyFormState,
                region,
                country,
                city,
                latitude: prefilledLocation.latitude?.toString() || '',
                longitude: prefilledLocation.longitude?.toString() || '',
                publishDate: today,
            });
        } else {
            setFormData({ ...emptyFormState, publishDate: today });
            setIsLoadingData(false);
        }
    }, [projectToEdit, isEditMode, prefilledLocation]);


    useEffect(() => {
        const total = formData.financialInstruments.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        setFormData(prev => ({ ...prev, totalProjectAmount: total }));
    }, [formData.financialInstruments]);

    // Cleanup search timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.location-search-container')) {
                setShowSearchResults(false);
            }
        };

        if (showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showSearchResults]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // If region changes, reset country and city selection
        if (name === 'region') {
            setFormData(prev => ({ ...prev, [name]: value, country: '', city: '' }));
        }
        // If country changes, reset city selection
        else if (name === 'country') {
            setFormData(prev => ({ ...prev, [name]: value, city: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Helper for Select components (value-only callback)
    const handleSelectChange = (name: string, value: string) => {
        // If region changes, reset country and city selection
        if (name === 'region') {
            setFormData(prev => ({ ...prev, [name]: value, country: '', city: '' }));
        }
        // If country changes, reset city selection
        else if (name === 'country') {
            setFormData(prev => ({ ...prev, [name]: value, city: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // Get available countries based on selected region
    const availableCountries = formData.region ? (regionCountries[formData.region] || []) : [];
    
    // Get available cities based on selected country
    const availableCities = formData.country ? (countryCities[formData.country] || []) : [];
    
    // Reverse geocoding to get country and city from coordinates
    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'GAIA-Atlas-App'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                const address = data.address || {};
                
                return {
                    country: address.country || '',
                    city: address.city || address.town || address.village || address.municipality || ''
                };
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        }
        
        return { country: '', city: '' };
    };

    // Geocoding search handler
    const handleLocationSearch = async (query: string) => {
        setLocationSearch(query);
        
        if (query.trim().length < 3) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search
        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'CitizensAtlas/1.0'
                        }
                    }
                );
                const data = await response.json();
                setSearchResults(data);
                setShowSearchResults(true);
            } catch (error) {
                console.error('Geocoding error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleSelectSearchResult = async (result: { display_name: string; lat: string; lon: string }) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Use existing reverse geocode function
        const { country, city } = await reverseGeocode(lat, lng);
        const region = country ? getRegionFromCountry(country) : '';

        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            region,
            country,
            city
        }));

        // Fly to location on map if map ref exists
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 10,
                duration: 2000
            });
        }

        setLocationSearch(result.display_name);
        setShowSearchResults(false);
    };
    
    // Handle map click to set location
    const handleMapClick = async (e: any) => {
        const { lng, lat } = e.lngLat;
        
        // Get country and city from coordinates
        const { country, city } = await reverseGeocode(lat, lng);
        const region = country ? getRegionFromCountry(country) : '';
        
        // Update form data with new location
        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            region,
            country,
            city
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, keyDocuments: e.target.files }));
        }
    };

    const handleRepeatableChange = (field: keyof typeof formData, index: number, value: any) => {
        const list = [...(formData[field] as any[])];
        list[index] = value;
        setFormData(prev => ({ ...prev, [field]: list }));
    };

    const addRepeatableRow = (field: keyof typeof formData) => {
        const list = [...(formData[field] as any[])];
        if (list.length > 0 && typeof list[0] === 'object') {
            list.push(Object.fromEntries(Object.keys(list[0]).map(key => [key, ''])));
        } else {
            list.push('');
        }
        setFormData(prev => ({ ...prev, [field]: list }));
    };

    const removeRepeatableRow = (field: keyof typeof formData, index: number) => {
        const list = [...(formData[field] as any[])];
        if (list.length > 1) {
            list.splice(index, 1);
            setFormData(prev => ({ ...prev, [field]: list }));
        }
    };

    const handleAddEnvironmentalCategory = () => {
        if (newEnvironmentalCategory.trim()) {
            setEnvironmentalCategories(prev => [...prev, newEnvironmentalCategory.trim()]);
            setNewEnvironmentalCategory('');
            setShowAddEnvironmentalCategory(false);
        }
    };

    const handleAddSocialSafeguardCategory = () => {
        if (newSocialSafeguardCategory.trim()) {
            setSocialSafeguardCategories(prev => [...prev, newSocialSafeguardCategory.trim()]);
            setNewSocialSafeguardCategory('');
            setShowAddSocialSafeguardCategory(false);
        }
    };

    const handleDeleteEnvironmentalCategory = (categoryToDelete: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)) {
            setEnvironmentalCategories(prev => prev.filter(cat => cat !== categoryToDelete));
            // Also remove from form data if selected
            setFormData(prev => ({
                ...prev,
                environmental: prev.environmental.map(env => env === categoryToDelete ? '' : env)
            }));
        }
    };

    const handleDeleteSocialSafeguardCategory = (categoryToDelete: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)) {
            setSocialSafeguardCategories(prev => prev.filter(cat => cat !== categoryToDelete));
            // Also remove from form data if selected
            setFormData(prev => ({
                ...prev,
                socialSafeguard: prev.socialSafeguard.map(safeguard => safeguard === categoryToDelete ? '' : safeguard)
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted!', { isEditMode, projectToEdit, onAddProject, onUpdateProject, formData });
        const {
            projectName, country, approvalDate, publishDate, falseSolutions,
            region, city, projectNumber, ifi, fundingSource,
            totalProjectAmount, owner, privateSectorBorrowers, projectDescription,
            projectStatus, startDate, endDate, environmental, socialSafeguard,
            groupsInOpposition, typesOfActions, linksToActions,
            activeGaiAASupport, notes, references, genderConcerns,
            wasteWorkers, displacement, latitude, longitude
        } = formData;

        const details = `
**Region:** ${region}
**City:** ${city}
**Project Number:** ${projectNumber || 'N/A'}
**IFI:** ${ifi}
**Funding Source:** ${fundingSource}
**Total Project Amount:** $${totalProjectAmount.toLocaleString()}
**Owner:** ${owner}
**Private Sector Borrowers:** ${privateSectorBorrowers.join(', ')}
**Project Description:**
${projectDescription}
---
**Project Status:** ${projectStatus}
**Start Date:** ${startDate || 'N/A'}
**End Date:** ${endDate || 'N/A'}
**Environmental Category:** ${environmental.filter(e => e).join(', ')}
**Social Safeguard:** ${socialSafeguard.filter(s => s).join(', ')}
**Groups in Opposition:** ${groupsInOpposition.join(', ')}
**Types of Actions:** ${typesOfActions}
**Links to Actions:** ${linksToActions}
**Active GAIA Support:** ${activeGaiAASupport}
**Notes:**
${notes}
**References:**
${references}
---
**Gender Concerns:** ${genderConcerns}
**Waste Workers:** ${wasteWorkers}
**Displacement:** ${displacement}
        `.trim();

        const projectData = {
            title: projectName,
            country: country,
            date: approvalDate,
            publishDate: publishDate,
            corruptionType: falseSolutions.filter(s => s).join(', '),
            details: details,
            latitude: parseFloat(latitude) || 0,
            longitude: parseFloat(longitude) || 0,
            status: (userRole === 'admin' || userRole === 'super-admin') ? 'published' as const : 'draft' as const,
            submittedBy: user?.email || 'unknown',
            submittedAt: new Date().toISOString(),
        };

        console.log('🔍 ProjectForm Debug:', {
            user: user,
            userRole: userRole,
            userEmail: user?.email,
            status: projectData.status,
            submittedBy: projectData.submittedBy,
            submittedAt: projectData.submittedAt
        });
        console.log('Project data to save:', projectData);

        if (isEditMode && projectToEdit && onUpdateProject) {
            // Update existing project
            console.log('Calling onUpdateProject');
            onUpdateProject({ id: projectToEdit.id, ...projectData });
        } else if (onAddProject) {
            // Add new project
            console.log('Calling onAddProject');
            onAddProject(projectData);
        } else {
            console.error('No handler available! onAddProject:', onAddProject, 'onUpdateProject:', onUpdateProject);
        }
        
        onProjectAdded();
        onClose();
    };
    
    const inputClass = "w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue";
    const repeatableInputClass = "w-full p-3 border border-gray-300 rounded-md";
    const selectClass = `${inputClass} appearance-none bg-white`;
    const dateInputClass = "w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue box-border";

    const formContent = (
        <>
            {isModal && (
                <div className="p-4 sm:p-6 border-b flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-dark-blue">{isEditMode ? 'Edit Project' : 'Add New Project'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className={isModal ? "p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1" : "p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"}>
                    <SectionTitle isFirst={true}>Project Information</SectionTitle>
                    <FormField label="Project Name" required>
                        <Input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} required />
                    </FormField>
                    <FormField label="Project Number">
                        <Input type="number" name="projectNumber" value={formData.projectNumber} onChange={handleInputChange} />
                    </FormField>
                    
                    {/* Map Picker - Only show in Admin page form (not in modal) */}
                    {!isModal && (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Click on the map to set project location
                                </p>
                                {/* Search field */}
                                <div className="relative location-search-container">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={locationSearch}
                                            onChange={(e) => handleLocationSearch(e.target.value)}
                                            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    // If there are search results, select the first one
                                                    if (searchResults.length > 0 && showSearchResults) {
                                                        handleSelectSearchResult(searchResults[0]);
                                                    }
                                                }
                                            }}
                                            placeholder="Search for a location..."
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-brand-medium-blue"></div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Search results dropdown */}
                                    {showSearchResults && searchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {searchResults.map((result, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectSearchResult(result)}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                                                >
                                                    {result.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="relative h-[300px] bg-gray-200">
                                <MapGL
                                    ref={mapRef}
                                    initialViewState={{
                                        longitude: parseFloat(formData.longitude) || 0,
                                        latitude: parseFloat(formData.latitude) || 0,
                                        zoom: formData.latitude && formData.longitude ? 8 : 1.5
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                    onClick={handleMapClick}
                                >
                                    {formData.latitude && formData.longitude && (
                                        <Marker
                                            longitude={parseFloat(formData.longitude)}
                                            latitude={parseFloat(formData.latitude)}
                                            anchor="center"
                                        >
                                            <div className="relative">
                                                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </Marker>
                                    )}
                                </MapGL>
                            </div>
                        </div>
                    )}
                    
                    {(() => {
                      console.log('🎨 Rendering Selects - formData.region:', formData.region, 'formData.country:', formData.country)
                      console.log('🎨 Available countries for region:', formData.region, ':', availableCountries)
                      console.log('🎨 isLoadingData:', isLoadingData)
                      return null
                    })()}
                    
                    {isLoadingData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Region">
                                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 animate-pulse h-[42px]"></div>
                            </FormField>
                            <FormField label="Country">
                                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 animate-pulse h-[42px]"></div>
                            </FormField>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Region">
                                <Select value={formData.region || ''} onValueChange={(value) => handleSelectChange('region', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Africa">Africa</SelectItem>
                                        <SelectItem value="Asia">Asia</SelectItem>
                                        <SelectItem value="Europe">Europe</SelectItem>
                                        <SelectItem value="North America">North America</SelectItem>
                                        <SelectItem value="South America">South America</SelectItem>
                                        <SelectItem value="Oceania">Oceania</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Country">
                                <Select value={formData.country || ''} onValueChange={(value) => handleSelectChange('country', value)} disabled={!formData.region}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={formData.region ? 'Select Country' : 'Select Region First'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCountries.map(country => (
                                            <SelectItem key={country} value={country}>{country}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Latitude">
                            <Input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g., 34.0522" />
                        </FormField>
                        <FormField label="Longitude">
                            <Input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g., -118.2437" />
                        </FormField>
                    </div>
                        
                        <SectionTitle>Financials</SectionTitle>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="International financial institution (IFI)">
                                <Input type="text" name="ifi" value={formData.ifi} onChange={handleInputChange} />
                            </FormField>
                            <FormField label="Funding source">
                                <Input type="text" name="fundingSource" value={formData.fundingSource} onChange={handleInputChange} />
                            </FormField>
                        </div>
                        <FormField label="Financial Instruments">
                            {formData.financialInstruments.map((instrument, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <Input 
                                        type="text" 
                                        placeholder="Amount" 
                                        value={instrument.amount} 
                                        onChange={(e) => handleRepeatableChange('financialInstruments', index, { amount: e.target.value })} 
                                    />
                                    {formData.financialInstruments.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeRepeatableRow('financialInstruments', index)} 
                                            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => addRepeatableRow('financialInstruments')} 
                                className="text-sm text-brand-medium-blue hover:underline"
                            >
                                + Add instrument
                            </button>
                        </FormField>
                        <FormField label="Total Project Amount">
                            <Input type="text" value={`$${formData.totalProjectAmount.toLocaleString()}`} readOnly className="bg-gray-100" />
                        </FormField>
                        
                        <SectionTitle>Details</SectionTitle>
                        <FormField label="False solution type">
                            {formData.falseSolutions.map((solution, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <Select 
                                        value={solution || undefined} 
                                        onValueChange={(value) => handleRepeatableChange('falseSolutions', index, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select False Solution Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Waste-to-Energy">Waste-to-Energy</SelectItem>
                                            <SelectItem value="Plastic-to-Fuel Technologies">Plastic-to-Fuel Technologies</SelectItem>
                                            <SelectItem value="Chemical Recycling">Chemical Recycling</SelectItem>
                                            <SelectItem value="Refuse-derived fuel">Refuse-derived fuel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.falseSolutions.length > 1 && <button type="button" onClick={() => removeRepeatableRow('falseSolutions', index)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm">Remove</button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addRepeatableRow('falseSolutions')} className="text-sm text-brand-medium-blue hover:underline">+ Add solution</button>
                        </FormField>
                        <FormField label="Owner (Public/ Private / PPP)">
                            <Select value={formData.owner || undefined} onValueChange={(value) => handleSelectChange('owner', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="PPP">PPP</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Private Sector Borrower">
                            {formData.privateSectorBorrowers.map((borrower, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <Input type="text" value={borrower} onChange={(e) => handleRepeatableChange('privateSectorBorrowers', index, e.target.value)} />
                                    {formData.privateSectorBorrowers.length > 1 && <button type="button" onClick={() => removeRepeatableRow('privateSectorBorrowers', index)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm">Remove</button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addRepeatableRow('privateSectorBorrowers')} className="text-sm text-brand-medium-blue hover:underline">+ Add borrower</button>
                        </FormField>
                        <FormField label="Project description">
                            <div className="mb-24 relative z-20">
                                <TiptapEditor
                                    value={formData.projectDescription}
                                    onChange={(value) => setFormData(prev => ({ ...prev, projectDescription: value }))}
                                    height="300px"
                                />
                            </div>
                        </FormField>
                        <FormField label="Project Status">
                            <Select value={formData.projectStatus || undefined} onValueChange={(value) => handleSelectChange('projectStatus', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Proposed">Proposed</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                             <div className="w-full">
                                <FormField label="Approval date" required>
                                    <DatePicker
                                        value={formData.approvalDate}
                                        onChange={(date) => handleSelectChange('approvalDate', date)}
                                        placeholder="Pick approval date"
                                    />
                                </FormField>
                             </div>
                            <div className="w-full">
                                <FormField label="Start date">
                                    <DatePicker
                                        value={formData.startDate}
                                        onChange={(date) => handleSelectChange('startDate', date)}
                                        placeholder="Pick start date"
                                    />
                                </FormField>
                            </div>
                            <div className="w-full">
                                <FormField label="End date">
                                    <DatePicker
                                        value={formData.endDate}
                                        onChange={(date) => handleSelectChange('endDate', date)}
                                        placeholder="Pick end date"
                                    />
                                </FormField>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <FormField label="Environmental">
                                    {formData.environmental.map((env, index) => (
                                        <div key={index} className="flex items-center space-x-2 mb-2">
                                            <Select 
                                                value={env || undefined} 
                                                onValueChange={(value) => handleRepeatableChange('environmental', index, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {environmentalCategories.map(cat => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {formData.environmental.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRepeatableRow('environmental', index)} 
                                                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {showAddEnvironmentalCategory ? (
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Input 
                                                type="text"
                                                value={newEnvironmentalCategory}
                                                onChange={(e) => setNewEnvironmentalCategory(e.target.value)}
                                                placeholder="Enter new category"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEnvironmentalCategory())}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddEnvironmentalCategory}
                                                className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
                                            >
                                                Add
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setShowAddEnvironmentalCategory(false);
                                                    setNewEnvironmentalCategory('');
                                                }}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowAddEnvironmentalCategory(true)} 
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                + Add more category
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowManageEnvironmentalCategories(!showManageEnvironmentalCategories)}
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                - Manage Categories
                                            </button>
                                        </div>
                                    )}
                                </FormField>
                                <div className="mt-2">
                                    {showManageEnvironmentalCategories && (
                                        <div className="flex flex-wrap gap-2">
                                            {environmentalCategories.map(cat => (
                                                <div key={cat} className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                                                    <span className="text-gray-700">{cat}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteEnvironmentalCategory(cat)}
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                        title="Delete category"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <FormField label="Social Safeguard">
                                    {formData.socialSafeguard.map((safeguard, index) => (
                                        <div key={index} className="flex items-center space-x-2 mb-2">
                                            <Select 
                                                value={safeguard || undefined} 
                                                onValueChange={(value) => handleRepeatableChange('socialSafeguard', index, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {socialSafeguardCategories.map(cat => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {formData.socialSafeguard.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRepeatableRow('socialSafeguard', index)} 
                                                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {showAddSocialSafeguardCategory ? (
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Input 
                                                type="text"
                                                value={newSocialSafeguardCategory}
                                                onChange={(e) => setNewSocialSafeguardCategory(e.target.value)}
                                                placeholder="Enter new category"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSocialSafeguardCategory())}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddSocialSafeguardCategory}
                                                className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
                                            >
                                                Add
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setShowAddSocialSafeguardCategory(false);
                                                    setNewSocialSafeguardCategory('');
                                                }}
                                                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowAddSocialSafeguardCategory(true)} 
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                + Add more category
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowManageSocialSafeguardCategories(!showManageSocialSafeguardCategories)}
                                                className="text-sm text-brand-medium-blue hover:underline"
                                            >
                                                - Manage Categories
                                            </button>
                                        </div>
                                    )}
                                </FormField>
                                <div className="mt-2">
                                    {showManageSocialSafeguardCategories && (
                                        <div className="flex flex-wrap gap-2">
                                            {socialSafeguardCategories.map(cat => (
                                                <div key={cat} className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                                                    <span className="text-gray-700">{cat}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSocialSafeguardCategory(cat)}
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                        title="Delete category"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <FormField label="Key documents"><input type="file" name="keyDocuments" onChange={handleFileChange} multiple className={inputClass} /></FormField>
                        
                        <SectionTitle>Community & Actions</SectionTitle>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-3">Community Actions</Label>
                            {formData.groupsInOpposition.map((group, index) => (
                                <div key={index} className="mb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="block text-xs text-gray-600 mb-1">Groups in Opposition</Label>
                                            <Input 
                                                type="text" 
                                                value={group} 
                                                onChange={(e) => handleRepeatableChange('groupsInOpposition', index, e.target.value)} 
                                                placeholder="Enter group name"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-xs text-gray-600 mb-1">Types of Actions</Label>
                                            <Input 
                                                type="text" 
                                                name="typesOfActions" 
                                                value={formData.typesOfActions} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g., Protests, Legal action"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-xs text-gray-600 mb-1">Links to Actions</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input 
                                                    type="url" 
                                                    name="linksToActions" 
                                                    value={formData.linksToActions} 
                                                    onChange={handleInputChange} 
                                                    placeholder="https://example.com"
                                                />
                                                {formData.groupsInOpposition.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeRepeatableRow('groupsInOpposition', index)} 
                                                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm whitespace-nowrap"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => addRepeatableRow('groupsInOpposition')} 
                                className="text-sm text-brand-medium-blue hover:underline mt-2"
                            >
                                + Add more
                            </button>
                        </div>
                        <FormField label="Active GAIA support?">
                            <Select value={formData.activeGaiAASupport || undefined} onValueChange={(value) => handleSelectChange('activeGaiAASupport', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        
                        <SectionTitle>Additional Information</SectionTitle>
                        <FormField label="Notes">
                            <Textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
                        </FormField>
                        <FormField label="References">
                            <Textarea name="references" value={formData.references} onChange={handleInputChange} rows={3} />
                        </FormField>
                        <FormField label="Gender concerns">
                            <Input type="text" name="genderConcerns" value={formData.genderConcerns} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Waste workers">
                            <Input type="text" name="wasteWorkers" value={formData.wasteWorkers} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Displacement">
                            <Input type="text" name="displacement" value={formData.displacement} onChange={handleInputChange} />
                        </FormField>
                    </div>
                    <div className="p-6 bg-gray-50 border-t rounded-b-lg space-y-4">
                        <div className="flex items-center space-x-3">
                            <Label className="text-sm font-medium text-gray-700">Publish Date (optional):</Label>
                            <DatePicker
                                value={formData.publishDate}
                                onChange={(date) => handleSelectChange('publishDate', date)}
                                placeholder="Leave empty to use today's date"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 justify-end">
                            {!isModal && (
                                <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    Back
                                </button>
                            )}
                            {isModal && (
                                <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="w-full sm:w-auto text-white font-bold py-2 px-4 sm:px-6 rounded-md transition-colors"
                                style={{ backgroundColor: '#0d234f' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                            >
                                {isEditMode ? 'Update Project' : 'Submit Project'}
                            </button>
                        </div>
                    </div>
                </form>
        </>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    {formContent}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-xl w-full">
            {formContent}
        </div>
    );
};

export default ProjectForm;