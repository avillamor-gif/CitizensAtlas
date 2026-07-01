import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Search, X, Trash2 } from 'lucide-react';
import { Project } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/contexts/AuthContext';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import * as DataService from '@/lib/services/data-service';
import { allCountries } from '@/lib/countries';
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
    onAddProject?: (projectData: Omit<Project, 'id'>) => void | Promise<void>;
    onUpdateProject?: (project: Project) => void | Promise<void>;
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

type MultiSelectOption = {
    value: string;
    label: string;
    description?: string;
};

type FundingRow = {
    ifi: string;
    financialInstrument: string;
    amount: string;
};

// Region to Countries mapping
const regionCountries: Record<string, string[]> = {
    'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cabo Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', "Cote d'Ivoire", 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
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
    'Cabo Verde': ['Praia', 'Mindelo', 'Santa Maria', 'Assomada', 'São Filipe'],
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
    "Cote d'Ivoire": ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man'],
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
    'Sao Tome and Principe': ['São Tomé', 'Santo António', 'Trindade', 'Neves', 'Santana'],
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
    'Philippines': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig', 'Pasig', 'Antipolo', 'Makati', 'Bacolod', 'Cagayan de Oro', 'General Santos', 'Iloilo City', 'Mandaue', 'Las Piñas', 'Marikina', 'Pasay', 'Parañaque', 'Valenzuela', 'Mandaluyong', 'Baguio', 'Legazpi', 'Naga', 'Tacloban', 'Puerto Princesa', 'Butuan', 'Lucena', 'Ormoc', 'Olongapo', 'San Jose del Monte', 'Cabanatuan', 'Tarlac City', 'Dagupan', 'Lapu-Lapu City'],
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

// Use narrower Asian subregions for map-driven auto-fill.
const asiaSubregionCountries: Record<string, string[]> = {
    'South Asia': ['Afghanistan', 'Bangladesh', 'Bhutan', 'India', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka'],
    'South East Asia': ['Brunei', 'Cambodia', 'Indonesia', 'Laos', 'Malaysia', 'Myanmar', 'Philippines', 'Singapore', 'Thailand', 'Timor-Leste', 'Vietnam'],
    'East Asia': ['China', 'Japan', 'Mongolia', 'North Korea', 'South Korea', 'Taiwan'],
    'West Asia': ['Armenia', 'Azerbaijan', 'Bahrain', 'Cyprus', 'Georgia', 'Iran', 'Iraq', 'Israel', 'Jordan', 'Kuwait', 'Lebanon', 'Oman', 'Palestine', 'Qatar', 'Saudi Arabia', 'Syria', 'Turkey', 'United Arab Emirates', 'Yemen'],
    'Central Asia': ['Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan'],
};

// Helper function to get region from country (case-insensitive)
const getRegionFromCountry = (country: string): string => {
    if (!country) return '';
    const countryLower = country.toLowerCase();
    console.log('🔍 getRegionFromCountry - Looking for:', country, '(lowercase:', countryLower, ')');

    for (const [subregion, countries] of Object.entries(asiaSubregionCountries)) {
        const found = countries.some(c => c.toLowerCase() === countryLower);
        if (found) {
            console.log('✅ Found Asian subregion:', subregion, 'for country:', country);
            return subregion;
        }
    }

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

const parseCommaSeparatedList = (value?: string | null) => {
    return (value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const uniqueByValue = (options: MultiSelectOption[]) => {
    const seen = new Set<string>();
    return options.filter((option) => {
        if (seen.has(option.value)) return false;
        seen.add(option.value);
        return true;
    });
};

const uniqueStrings = (values: string[]) => {
    return Array.from(new Set(values));
};

const MultiSelectPopover: React.FC<{
    label: string;
    placeholder: string;
    searchPlaceholder: string;
    options: MultiSelectOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
}> = ({ label, placeholder, searchPlaceholder, options, selectedValues, onChange, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter((option) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return (
            option.label.toLowerCase().includes(query) ||
            option.description?.toLowerCase().includes(query)
        );
    });

    const selectedCount = selectedValues.length;
    const triggerLabel = selectedCount > 0
        ? `${selectedCount} selected`
        : placeholder;

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((item) => item !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-left text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70',
                            selectedCount > 0 && 'text-gray-900'
                        )}
                    >
                        <span className="truncate">{triggerLabel}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="border-b p-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="h-9 pl-9"
                            />
                        </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-gray-500">No options found</div>
                        ) : (
                            filteredOptions.map((option) => {
                                const checked = selectedValues.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleOption(option.value)}
                                        className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        <span
                                            className={cn(
                                                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                                                checked
                                                    ? 'border-brand-medium-blue bg-brand-medium-blue text-white'
                                                    : 'border-gray-300 bg-white'
                                            )}
                                        >
                                            {checked && <Check className="h-3 w-3" />}
                                        </span>
                                        <span className="flex-1">
                                            <span className="block font-medium text-gray-900">{option.label}</span>
                                            {option.description && (
                                                <span className="block text-xs text-gray-500">{option.description}</span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                    {selectedCount > 0 && (
                        <div className="border-t p-2">
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                <X className="h-4 w-4" />
                                Clear selections
                            </button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};

const REGION_OPTIONS: MultiSelectOption[] = Object.keys(regionCountries).map((region) => ({
    value: region,
    label: region,
}));

// Get all countries in sorted order
const getAllCountries = (): string[] => {
    // Use the comprehensive allCountries list from lib/countries
    return [...allCountries].sort();
};

// Country code to country name mapping (ISO 3166-1 alpha-2)
const countryCodeToName: Record<string, string> = {
    'PH': 'Philippines', 'IN': 'India', 'BD': 'Bangladesh', 'BT': 'Bhutan', 'NP': 'Nepal', 'LK': 'Sri Lanka', 'MM': 'Myanmar',
    'TH': 'Thailand', 'LA': 'Laos', 'KH': 'Cambodia', 'VN': 'Vietnam', 'MY': 'Malaysia', 'SG': 'Singapore', 'BN': 'Brunei',
    'ID': 'Indonesia', 'TL': 'Timor-Leste', 'KR': 'South Korea', 'JP': 'Japan', 'CN': 'China', 'MN': 'Mongolia',
    'AF': 'Afghanistan', 'PK': 'Pakistan', 'IR': 'Iran', 'IQ': 'Iraq', 'SY': 'Syria', 'LB': 'Lebanon', 'JO': 'Jordan',
    'IL': 'Israel', 'PS': 'Palestine', 'SA': 'Saudi Arabia', 'AE': 'United Arab Emirates', 'QA': 'Qatar', 'BH': 'Bahrain',
    'KW': 'Kuwait', 'OM': 'Oman', 'YE': 'Yemen', 'TR': 'Turkey', 'AM': 'Armenia', 'AZ': 'Azerbaijan', 'GE': 'Georgia',
    'GB': 'United Kingdom', 'FR': 'France', 'DE': 'Germany', 'IT': 'Italy', 'ES': 'Spain', 'PT': 'Portugal',
    'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico', 'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile',
    'ZA': 'South Africa', 'NG': 'Nigeria', 'EG': 'Egypt', 'KE': 'Kenya', 'ET': 'Ethiopia',
    'AU': 'Australia', 'NZ': 'New Zealand',
};

const canonicalCountryByLower = (() => {
    const map = new Map<string, string>();
    Object.values(regionCountries).flat().forEach((country) => {
        map.set(country.toLowerCase(), country);
    });
    return map;
})();

const normalizeCountryName = (country: string) => {
    const trimmed = country.trim();
    if (!trimmed) {
        console.log('🌍 normalizeCountryName - Input is empty, returning empty string');
        return '';
    }
    const lowered = trimmed.toLowerCase();
    // First try to find in canonical list
    const canonical = canonicalCountryByLower.get(lowered);
    if (canonical) {
        console.log('🌍 normalizeCountryName - FOUND in canonical list:', { input: country, result: canonical });
        return canonical;
    }
    // Otherwise just title-case it (Nominatim returns proper English names with accept-language=en)
    const result = toTitleCase(trimmed);
    console.log('🌍 normalizeCountryName - NOT in canonical list, using title-case:', { input: country, result, lowered });
    return result;
};

const getCountriesForRegions = (regions: string[]) => {
    const selectedRegions = regions.length > 0 ? regions : Object.keys(regionCountries);
    return uniqueByValue(
        selectedRegions.flatMap((region) =>
            (regionCountries[region] || []).map((country) => ({
                value: country,
                label: country,
                description: region,
            }))
        )
    );
};

const getCountryToRegionMap = () => {
    const map = new Map<string, string>();
    Object.entries(regionCountries).forEach(([region, countries]) => {
        countries.forEach((country) => map.set(country, region));
    });
    return map;
};

const countryToRegionMap = getCountryToRegionMap();

const getCityOptionsForCountries = (countries: string[]) => {
    const selectedCountries = countries.length > 0 ? countries : Object.keys(countryCities);
    return uniqueByValue(
        selectedCountries.flatMap((country) =>
            (countryCities[country] || []).map((city) => ({
                value: `${country}::${city}`,
                label: city,
                description: country,
            }))
        )
    );
};

const getProvinceFromAddress = (address: Record<string, any>) => {
    return (
        address.state ||
        address.state_district ||
        address.province ||
        address.region ||
        address.county ||
        address.district ||
        ''
    );
};

const matchCitySelections = (cityValues: string[], countryValues: string[]) => {
    const selectedCountries = countryValues.length > 0 ? countryValues : Object.keys(countryCities);
    const validOptions = getCityOptionsForCountries(selectedCountries);
    const validByValue = new Map(validOptions.map((option) => [option.value, option]));
    const labelToOptions = new Map<string, MultiSelectOption[]>();

    validOptions.forEach((option) => {
        const list = labelToOptions.get(option.label) || [];
        list.push(option);
        labelToOptions.set(option.label, list);
    });

    return uniqueStrings(
        cityValues.flatMap((value) => {
            if (validByValue.has(value)) {
                return [value];
            }

            const [prefix, cityLabel] = value.includes('::') ? value.split('::') : ['', value];
            if (prefix && cityLabel && validByValue.has(`${prefix}::${cityLabel}`)) {
                return [`${prefix}::${cityLabel}`];
            }

            const exactMatch = labelToOptions.get(cityLabel) || [];
            if (exactMatch.length > 0) {
                return [exactMatch[0].value];
            }

            return [];
        })
    );
};

const citySelectionsToDisplayValues = (citySelections: string[]) => {
    return citySelections.map((value) => {
        if (value.includes('::')) {
            const [country, city] = value.split('::');
            return `${country} - ${city}`;
        }
        return value;
    });
};

const parseCitySelectionValues = (value?: string | null) => {
    return parseCommaSeparatedList(value).map((entry) => {
        if (entry.includes('::')) return entry;
        const provinceAwareMatch = entry.match(/^(.+?)\s*,\s*(.+?)\s*\((.+?)\)$/);
        if (provinceAwareMatch) {
            const city = provinceAwareMatch[1].trim();
            const country = provinceAwareMatch[3].trim();
            if (country && city) {
                return `${country}::${city}`;
            }
        }
        const separator = entry.includes(' - ') ? ' - ' : entry.includes(': ') ? ': ' : '';
        if (separator) {
            const [country, city] = entry.split(separator).map((part) => part.trim());
            if (country && city) {
                return `${country}::${city}`;
            }
        }
        return entry;
    });
};

const parseDetails = (details: string) => {
    const detailsMap = new Map<string, string>();
    if (!details) return detailsMap;
    const lines = details.replace(/\n---\n/g, '\n').split('\n');
    let currentKey: string | null = null;
    for (const line of lines) {
        const match = line.match(/^\s*\*\*(.*?):\*\*(.*)$/);
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

const getDetailValue = (detailsMap: Map<string, string>, keys: string[]) => {
    for (const key of keys) {
        const direct = detailsMap.get(key);
        if (direct) return direct;
    }

    const lowerKeyToValue = new Map<string, string>();
    detailsMap.forEach((value, key) => {
        lowerKeyToValue.set(key.toLowerCase(), value);
    });

    for (const key of keys) {
        const fallback = lowerKeyToValue.get(key.toLowerCase());
        if (fallback) return fallback;
    }

    return '';
};

const parseFundingRows = (detailsMap: Map<string, string>, totalAmountNum: number): FundingRow[] => {
    const fundingSourceRaw = detailsMap.get('Funding Source') || '';
    const parsedFromFundingSource = fundingSourceRaw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^[-*]\s*/, ''))
        .map((line) => line.split('|').map((part) => part.trim()))
        .filter((parts) => parts.length >= 3)
        .map((parts) => ({
            ifi: parts[0],
            financialInstrument: parts[1],
            amount: parts[2].replace(/\s*M\s*USD$/i, '').trim(),
        }))
        .filter((row) => row.ifi || row.financialInstrument || row.amount);

    if (parsedFromFundingSource.length > 0) {
        return parsedFromFundingSource;
    }

    const ifiValues = parseCommaSeparatedList(detailsMap.get('IFI'));
    const instrumentValues = parseCommaSeparatedList(detailsMap.get('Financial Instruments') || detailsMap.get('Financial Instrument'));
    const maxRows = Math.max(ifiValues.length, instrumentValues.length, 1);

    const fallbackRows = Array.from({ length: maxRows }, (_, index) => ({
        ifi: ifiValues[index] || '',
        financialInstrument: instrumentValues[index] || '',
        amount: maxRows === 1 && totalAmountNum > 0 ? String(totalAmountNum) : '',
    })).filter((row) => row.ifi || row.financialInstrument || row.amount);

    return fallbackRows.length > 0 ? fallbackRows : [{ ifi: '', financialInstrument: '', amount: '' }];
};

const calculateFundingTotal = (rows: FundingRow[]) => {
    return rows.reduce((sum, row) => {
        const amount = Number.parseFloat(row.amount);
        return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);
};

const emptyFormState = {
    regionSelections: [] as string[],
    countrySelections: [] as string[],
    citySelections: [] as string[],
    cityInput: '',
    latitude: '',
    longitude: '',
    projectName: '',
    projectNumber: '',
    falseSolutions: [''],
    fundingRows: [{ ifi: '', financialInstrument: '', amount: '' }] as FundingRow[],
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
    keyDocuments: '',
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

const IFI_OPTIONS = ['ADB', 'AIIB', 'GCF', 'GIZ', 'JICA', 'KOICA', 'IFC/ WB', 'Others'] as const;
const FINANCIAL_INSTRUMENT_OPTIONS: MultiSelectOption[] = [
    { value: 'Loans', label: 'Loans' },
    { value: 'Grants', label: 'Grants' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Debt', label: 'Debt' },
    { value: 'Technical Assistance', label: 'Technical Assistance' },
    { value: 'Financial Intermediary', label: 'Financial Intermediary' },
];

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
    const [cityProvinceMap, setCityProvinceMap] = useState<Record<string, string>>({});
    const [addressQuery, setAddressQuery] = useState('');
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const SectionTitle: React.FC<{ children: React.ReactNode; isFirst?: boolean }> = ({ children, isFirst = false }) => (
        <div className={isFirst && !isModal ? "pt-0 mt-0 mb-4" : "pt-6 mt-6 mb-4 border-t"}>
            <h3 className="text-lg font-semibold text-brand-dark-blue">{children}</h3>
        </div>
    );

    useEffect(() => {
        const initializeEditForm = async () => {
            if (!(isEditMode && projectToEdit)) {
                return false;
            }

            setIsLoadingData(true);

            let sourceProject = projectToEdit;

            // Always re-fetch the full project row in edit mode so the form hydrates from
            // the canonical database record instead of whichever partial object opened it.
            try {
                const fullProject = await DataService.getProjectById(projectToEdit.id);
                if (fullProject) {
                    sourceProject = fullProject;
                }
            } catch (error) {
                console.error('Failed to fetch full project details for edit form:', error);
            }

            const detailsMap = parseDetails(sourceProject.details || '');
            
            console.log('🔍 RAW DETAILS STRING:', sourceProject.details);
            console.log('🔍 PARSED DETAILS MAP:', Object.fromEntries(detailsMap));
            console.log('🔍 Country from map:', detailsMap.get('Country'));
            
            const totalAmountStr = (detailsMap.get('Total Project Amount') || '0').replace(/[^0-9.]/g, '');
            const totalAmountNum = parseFloat(totalAmountStr) || 0;
            const savedFalseSolutions =
                sourceProject.corruptionType ||
                getDetailValue(detailsMap, ['False Solution Type', 'False solution type', 'False Solutions', 'False Solution']) ||
                '';
            
            console.log('📋 Loading falseSolutions:', { 
                corruptionType: sourceProject.corruptionType, 
                fromDetails: getDetailValue(detailsMap, ['False Solution Type', 'False solution type', 'False Solutions', 'False Solution']),
                savedFalseSolutions
            });
            const fundingRows = parseFundingRows(detailsMap, totalAmountNum);
            
            const regionSelections = parseCommaSeparatedList(detailsMap.get('Region'));
            const countrySelections = uniqueStrings(
                parseCommaSeparatedList(detailsMap.get('Country') || projectToEdit.country || '')
                    .map(normalizeCountryName)
                    .filter(Boolean)
            );
            
            console.log('🔍 Country parsing:', {
                fromMap: detailsMap.get('Country'),
                fromProject: projectToEdit.country,
                parsed: parseCommaSeparatedList(detailsMap.get('Country') || projectToEdit.country || ''),
                normalized: countrySelections
            });
            const citySelections = matchCitySelections(
                parseCitySelectionValues(detailsMap.get('City')),
                countrySelections
            );
            const derivedRegions = countrySelections.map((country) => countryToRegionMap.get(country) || getRegionFromCountry(country)).filter(Boolean);
            const mergedRegions = uniqueByValue(
                [...regionSelections, ...derivedRegions].map((region) => ({ value: region, label: region }))
            ).map((item) => item.value);
            
            console.log('🔍 ProjectForm Edit Mode - Regions:', mergedRegions);
            console.log('🔍 ProjectForm Edit Mode - Countries:', countrySelections);
            console.log('🔍 ProjectForm Edit Mode - Cities:', citySelections);
            console.log('🔍 ProjectForm Edit Mode - All details:', Object.fromEntries(detailsMap));
            
            setFormData({
                regionSelections: mergedRegions,
                countrySelections,
                citySelections,
                cityInput: parseCommaSeparatedList(detailsMap.get('City')).join(', '),
                latitude: sourceProject.latitude?.toString() || '',
                longitude: sourceProject.longitude?.toString() || '',
                projectName: sourceProject.title || '',
                projectNumber: detailsMap.get('Project Number') || '',
                falseSolutions: savedFalseSolutions
                    ? savedFalseSolutions.split(',').map(s => s.trim()).filter(Boolean)
                    : [''],
                fundingRows,
                owner: detailsMap.get('Owner') || '',
                privateSectorBorrowers: detailsMap.get('Private Sector Borrowers')?.split(', ').map(s => s.trim()) || [''],
                projectDescription: detailsMap.get('Project Description') || '',
                projectStatus: getDetailValue(detailsMap, ['Project Status', 'Status']) || '',
                approvalDate: sourceProject.date || '',
                startDate: detailsMap.get('Start Date') || '',
                endDate: detailsMap.get('End Date') || '',
                publishDate: sourceProject.publishDate || '',
                environmental: detailsMap.get('Environmental Category')?.split(', ').map(s => s.trim()) || [''],
                socialSafeguard: detailsMap.get('Social Safeguard')?.split(', ').map(s => s.trim()) || [''],
                keyDocuments: detailsMap.get('Key Documents') || '',
                groupsInOpposition: detailsMap.get('Groups in Opposition')?.split(', ').map(s => s.trim()) || [''],
                typesOfActions: detailsMap.get('Types of Actions') || '',
                linksToActions: detailsMap.get('Links to Actions') || '',
                activeGaiAASupport: detailsMap.get('Active GAIA Support') || '',
                notes: detailsMap.get('Notes') || '',
                references: detailsMap.get('References') || '',
                genderConcerns: detailsMap.get('Gender Concerns') || '',
                wasteWorkers: detailsMap.get('Waste Workers') || '',
                displacement: detailsMap.get('Resettlement') || detailsMap.get('Displacement') || '',
            });
            
            console.log('✅ ProjectForm - State set with regions/countries/cities');
            setIsLoadingData(false);
            return true;
        };

        const initialize = async () => {
            const initializedEdit = await initializeEditForm();
            if (initializedEdit) return;

            if (prefilledLocation && !isEditMode) {
            // If we have prefilled location data from map click, use it
            const country = normalizeCountryName(prefilledLocation.country || '');
            const region = country ? getRegionFromCountry(country) : '';
            const city = prefilledLocation.city || '';
            
            setFormData({
                ...emptyFormState,
                regionSelections: region ? [region] : [],
                countrySelections: country ? [country] : [],
                citySelections: city ? [`${country || 'Unknown'}::${city}`] : [],
                cityInput: city,
                latitude: prefilledLocation.latitude?.toString() || '',
                longitude: prefilledLocation.longitude?.toString() || '',
                publishDate: today,
            });
            } else {
                setFormData({ ...emptyFormState, publishDate: today });
                setIsLoadingData(false);
            }
        };

        initialize();
    }, [projectToEdit, isEditMode, prefilledLocation]);


    useEffect(() => {
        const missingCitySelections = formData.citySelections.filter((selection) => !cityProvinceMap[selection]);
        if (missingCitySelections.length === 0) {
            return;
        }

        let cancelled = false;

        const loadProvinceData = async () => {
            const updates: Record<string, string> = {};

            for (const selection of missingCitySelections) {
                const [country, city] = selection.split('::');
                if (!country || !city) continue;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en&q=${encodeURIComponent(`${city}, ${country}`)}`,
                        {
                            headers: {
                                'User-Agent': 'CitizensAtlas/1.0',
                            },
                        }
                    );

                    if (!response.ok) continue;

                    const results = await response.json();
                    const address = results?.[0]?.address || {};
                    const province = getProvinceFromAddress(address);
                    if (province) {
                        updates[selection] = province;
                    }
                } catch (error) {
                    console.error('Province lookup error:', error);
                }
            }

            if (!cancelled && Object.keys(updates).length > 0) {
                setCityProvinceMap((prev) => ({ ...prev, ...updates }));
            }
        };

        loadProvinceData();

        return () => {
            cancelled = true;
        };
    }, [formData.citySelections, formData.countrySelections, cityProvinceMap]);

    useEffect(() => {
        setFormData((prev) => {
            const allowedCountries = getCountriesForRegions(prev.regionSelections).map((option) => option.value);
            const normalizedCountries = uniqueByValue(
                prev.countrySelections
                    .filter((country) => allowedCountries.includes(country) || prev.regionSelections.length === 0)
                    .map((country) => ({ value: country, label: country }))
            ).map((item) => item.value);

            const allowedCities = getCityOptionsForCountries(normalizedCountries).map((option) => option.value);
            const normalizedCities = prev.citySelections.filter((city) => {
                if (allowedCities.includes(city)) return true;
                if (!city.includes('::')) {
                    return allowedCities.some((allowedCity) => allowedCity.endsWith(`::${city}`));
                }
                return false;
            });

            const shouldUpdate =
                normalizedCountries.length !== prev.countrySelections.length ||
                normalizedCities.length !== prev.citySelections.length;

            if (!shouldUpdate) {
                return prev;
            }

            return {
                ...prev,
                countrySelections: normalizedCountries,
                citySelections: normalizedCities,
            };
        });
    }, [formData.regionSelections]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper for Select components (value-only callback)
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegionSelectionsChange = (nextRegions: string[]) => {
        const normalizedRegions = Array.from(new Set(nextRegions));
        const allowedCountries = getCountriesForRegions(normalizedRegions).map((option) => option.value);
        const allowedCityValues = getCityOptionsForCountries(allowedCountries).map((option) => option.value);

        setFormData((prev) => ({
            ...prev,
            regionSelections: normalizedRegions,
            countrySelections: prev.countrySelections.filter((country) => allowedCountries.includes(country)),
            citySelections: prev.citySelections.filter((city) => allowedCityValues.includes(city) || allowedCityValues.some((allowedCity) => allowedCity.endsWith(`::${city}`))),
        }));
    };

    const handleCountrySelectionsChange = (nextCountries: string[]) => {
        const normalizedCountries = Array.from(new Set(nextCountries));
        const nextRegions = Array.from(
            new Set(
                normalizedCountries
                    .map((country) => countryToRegionMap.get(country) || getRegionFromCountry(country))
                    .filter(Boolean)
            )
        );
        const allowedCityValues = getCityOptionsForCountries(normalizedCountries).map((option) => option.value);

        setFormData((prev) => ({
            ...prev,
            regionSelections: Array.from(new Set([...prev.regionSelections, ...nextRegions])),
            countrySelections: normalizedCountries,
            citySelections: prev.citySelections.filter((city) => allowedCityValues.includes(city)),
        }));
    };

    const handleCitySelectionsChange = (nextCities: string[]) => {
        const normalizedCities = Array.from(new Set(nextCities));
        const inferredCountries = new Set<string>();
        normalizedCities.forEach((cityValue) => {
            const [country] = cityValue.split('::');
            if (country) inferredCountries.add(country);
        });
        const inferredRegions = Array.from(
            new Set(
                Array.from(inferredCountries)
                    .map((country) => countryToRegionMap.get(country) || getRegionFromCountry(country))
                    .filter(Boolean)
            )
        );

        setFormData((prev) => ({
            ...prev,
            regionSelections: Array.from(new Set([...prev.regionSelections, ...inferredRegions])),
            countrySelections: Array.from(new Set([...prev.countrySelections, ...inferredCountries])),
            citySelections: normalizedCities,
        }));
    };

    const applyResolvedLocation = (params: {
        latitude: string;
        longitude: string;
        country?: string;
        countryCode?: string;
        city?: string;
    }) => {
        console.log('🌍 applyResolvedLocation called with:', params);
        
        let country = params.country ? normalizeCountryName(params.country) : '';
        
        // If country is still empty and we have country_code, try to convert it
        if (!country && params.countryCode) {
            const countryCode = params.countryCode.toUpperCase();
            country = countryCodeToName[countryCode] || '';
            console.log('🌍 Converted country_code', countryCode, 'to:', country);
        }
        
        const region = country ? getRegionFromCountry(country) : '';

        console.log('🌍 After normalization - country:"' + country + '" region:"' + region + '"');
        console.log('🌍 Will update state:', { 
            countrySelections: country ? [country] : 'keep previous', 
            regionSelections: region ? [region] : 'keep previous'
        });

        setFormData((prev) => {
            const updated = {
                ...prev,
                latitude: params.latitude,
                longitude: params.longitude,
                regionSelections: region ? [region] : prev.regionSelections,
                countrySelections: country ? [country] : prev.countrySelections,
                cityInput: params.city || prev.cityInput,
            };
            console.log('🌍 FormData updated:', { 
                countrySelections: updated.countrySelections,
                regionSelections: updated.regionSelections,
                latitude: updated.latitude,
                longitude: updated.longitude
            });
            return updated;
        });
    };

    const handleMapLocationPick = async (location: { latitude: number; longitude: number }) => {
        const latitude = location.latitude.toFixed(6);
        const longitude = location.longitude.toFixed(6);

        try {
            // Use search API which gives better country data than reverse
            const searchResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`,
                {
                    headers: { 'User-Agent': 'CitizensAtlas/1.0' },
                }
            );

            if (!searchResponse.ok) {
                console.warn('❌ Nominatim API error:', searchResponse.status);
                applyResolvedLocation({ latitude, longitude });
                return;
            }

            const payload = await searchResponse.json();
            const address = payload?.address || {};
            
            // Extract location data
            const city = address.city || address.town || address.village || '';
            let country = address.country || '';
            const countryCode = address.country_code || '';
            const state = address.state || address.province || '';

            console.log('📍 Reverse geocoding response:', { address, country, countryCode, city, state });

            // If no country found, try to extract from display_name
            if (!country && payload.display_name) {
                const parts = payload.display_name.split(',');
                if (parts.length > 0) {
                    country = parts[parts.length - 1].trim(); // Last part is usually country
                    console.log('📍 Extracted country from display_name:', country);
                }
            }

            console.log('📍 Final extracted values:', { country, countryCode, city, latitude, longitude });
            applyResolvedLocation({ latitude, longitude, country, countryCode, city } as any);
            
        } catch (error) {
            console.error('❌ Reverse geocoding error:', error);
            applyResolvedLocation({ latitude, longitude });
        }
    };

    const handleAddressSearch = async () => {
        const query = addressQuery.trim();
        if (!query) return;

        setIsSearchingAddress(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'User-Agent': 'CitizensAtlas/1.0',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Address search failed');
            }

            const results = await response.json();
            const first = results?.[0];

            if (!first) {
                alert('No location found for that address.');
                return;
            }

            const latitude = Number.parseFloat(first.lat);
            const longitude = Number.parseFloat(first.lon);
            if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                alert('Invalid location result. Try another address.');
                return;
            }

            const address = first.address || {};
            const country = address.country || '';
            const countryCode = address.country_code || '';
            const city = address.city || address.town || address.village || '';

            console.log('📍 handleAddressSearch result:', { address, country, countryCode, city, latitude, longitude });

            applyResolvedLocation({
                latitude: latitude.toFixed(6),
                longitude: longitude.toFixed(6),
                country,
                countryCode,
                city,
            });
        } catch (error) {
            console.error('Address search error:', error);
            alert('Failed to search address. Please try again.');
        } finally {
            setIsSearchingAddress(false);
        }
    };

    const selectedMapLocation = null; // Map removed

    const handleFundingRowChange = (index: number, key: keyof FundingRow, value: string) => {
        setFormData((prev) => {
            const nextRows = [...prev.fundingRows];
            nextRows[index] = { ...nextRows[index], [key]: value };
            return { ...prev, fundingRows: nextRows };
        });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted!', { isEditMode, projectToEdit, onAddProject, onUpdateProject, formData });
        const {
            projectName, approvalDate, publishDate, falseSolutions,
            regionSelections, countrySelections, cityInput, projectNumber, fundingRows,
            owner, privateSectorBorrowers, projectDescription,
            projectStatus, startDate, endDate, environmental, socialSafeguard,
            keyDocuments, groupsInOpposition, typesOfActions, linksToActions,
            activeGaiAASupport, notes, references, genderConcerns,
            wasteWorkers, displacement, latitude, longitude
        } = formData;

        const regionValue = regionSelections.join(', ');
        const countryValue = countrySelections.join(', ');

        if (!countryValue.trim()) {
            alert('Country is required. Please click on the map to select a location.');
            return;
        }

        const cityValue = cityInput
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
            .join(', ');

        const normalizedFundingRows = fundingRows
            .map((row) => ({
                ifi: row.ifi.trim(),
                financialInstrument: row.financialInstrument.trim(),
                amount: row.amount.trim(),
            }))
            .filter((row) => row.ifi || row.financialInstrument || row.amount);

        const hasIncompleteFundingRow = normalizedFundingRows.some(
            (row) => !row.ifi || !row.financialInstrument || !row.amount || Number.isNaN(Number.parseFloat(row.amount))
        );

        if (hasIncompleteFundingRow) {
            alert('Please complete IFI, Financial Instrument, and Amount for every funding source row.');
            return;
        }

        const ifiValue = normalizedFundingRows.map((row) => row.ifi).join(', ');
        const falseSolutionsValue = falseSolutions.filter(s => s).join(', ');
        
        console.log('💾 Saving falseSolutions:', { falseSolutions, falseSolutionsValue });
        const financialInstrumentsValue = normalizedFundingRows.map((row) => row.financialInstrument).join(', ');
        const totalProjectAmount = calculateFundingTotal(normalizedFundingRows);
        const fundingSourceValue = normalizedFundingRows.length > 0
            ? normalizedFundingRows
                .map((row) => `${row.ifi} | ${row.financialInstrument} | ${row.amount} M USD`)
                .join('\n')
            : 'N/A';

        if (!falseSolutionsValue.trim()) {
            alert('False solution type is required. Please select at least one option.');
            return;
        }

        if (!projectStatus.trim()) {
            alert('Project Status is required. Please select a status.');
            return;
        }

        const latNum = parseFloat(latitude);
        const lngNum = parseFloat(longitude);
        // Location is now optional since map is removed
        // if (isNaN(latNum) || isNaN(lngNum) || (latNum === 0 && lngNum === 0)) {
        //     alert('Project location is required. Please click on the map or search for an address to set the project location.');
        //     return;
        // }

        const details = `
    **Region:** ${regionValue}
    **Country:** ${countryValue}
    **City:** ${cityValue}
**Project Number:** ${projectNumber || 'N/A'}
    **False Solution Type:** ${falseSolutionsValue || 'N/A'}
**IFI:** ${ifiValue}
**Funding Source:** ${fundingSourceValue}
**Financial Instruments:** ${financialInstrumentsValue}
**Total Project Amount:** ${totalProjectAmount.toLocaleString()} M USD
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
**Key Documents:** ${keyDocuments || 'N/A'}
**Groups in Opposition:** ${groupsInOpposition.join(', ')}
**Types of Actions:** ${typesOfActions}
**Links to Actions:** ${linksToActions || 'N/A'}
**Active GAIA Support:** ${activeGaiAASupport}
**Notes:**
${notes}
**References:**
${references}
---
**Gender Concerns:** ${genderConcerns}
**Waste Workers:** ${wasteWorkers}
**Resettlement:** ${displacement}
        `.trim();

        const projectData = {
            title: projectName,
            country: countryValue,
            date: approvalDate,
            publishDate: publishDate,
            corruptionType: falseSolutionsValue,
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
        console.log('💾 projectData.corruptionType:', projectData.corruptionType);

        try {
            if (isEditMode && projectToEdit && onUpdateProject) {
                // Update existing project
                console.log('Calling onUpdateProject');
                await onUpdateProject({ id: projectToEdit.id, ...projectData });
            } else if (onAddProject) {
                // Add new project
                console.log('Calling onAddProject');
                await onAddProject(projectData);
            } else {
                console.error('No handler available! onAddProject:', onAddProject, 'onUpdateProject:', onUpdateProject);
                return;
            }

            onProjectAdded();
            onClose();
        } catch (error) {
            console.error('❌ Failed to save project:', error);
            alert('❌ Failed to save project. Please try again.');
        }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <FormField label="Project Number">
                            <Input type="text" name="projectNumber" value={formData.projectNumber} onChange={handleInputChange} />
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
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>
                    <FormField label="False solution type">
                        <div className="grid grid-cols-3 gap-3">
                            {['Waste-to-Energy (WtE)', 'Plastic-to-Fuel Technologies', 'Chemical Recycling', 'Refuse-Derived Fuel (RDF)', 'Plastic & Carbon Credit Schemes', 'Bioplastics', 'Carbon Capture on Landfills'].map((solution) => (
                                <div key={solution} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`solution-${solution}`}
                                        checked={formData.falseSolutions.includes(solution)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData(prev => ({ ...prev, falseSolutions: [...prev.falseSolutions, solution] }));
                                            } else {
                                                setFormData(prev => ({ ...prev, falseSolutions: prev.falseSolutions.filter(s => s !== solution) }));
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor={`solution-${solution}`} className="text-sm text-gray-700 cursor-pointer">{solution}</label>
                                </div>
                            ))}
                        </div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Region">
                            <Input
                                type="text"
                                value={formData.regionSelections.join(', ')}
                                placeholder="Auto-filled from map pin"
                                readOnly
                                className="bg-gray-50"
                            />
                        </FormField>
                        <FormField label="Country" required>
                            <Popover open={isCountryDropdownOpen} onOpenChange={setIsCountryDropdownOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                                    >
                                        <span className={formData.countrySelections[0] ? 'text-gray-900' : 'text-gray-500'}>
                                            {formData.countrySelections[0] || 'Select a country...'}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <div className="p-2 space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                            <input
                                                placeholder="Search countries..."
                                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={countrySearch}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {getAllCountries()
                                                .filter(country =>
                                                    country.toLowerCase().includes(countrySearch.toLowerCase())
                                                )
                                                .map(country => (
                                                    <button
                                                        key={country}
                                                        type="button"
                                                        onClick={() => {
                                                            // Auto-fill Region based on Country
                                                            const region = getRegionFromCountry(country);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                countrySelections: [country],
                                                                regionSelections: region ? [region] : prev.regionSelections
                                                            }));
                                                            setCountrySearch('');
                                                            setIsCountryDropdownOpen(false);
                                                        }}
                                                        className={cn(
                                                            'w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 flex items-center gap-2',
                                                            formData.countrySelections[0] === country && 'bg-blue-50 text-blue-700'
                                                        )}
                                                    >
                                                        {formData.countrySelections[0] === country && <Check className="h-4 w-4" />}
                                                        {country}
                                                    </button>
                                                ))}
                                            {getAllCountries().filter(country =>
                                                country.toLowerCase().includes(countrySearch.toLowerCase())
                                            ).length === 0 && (
                                                <div className="px-3 py-2 text-sm text-gray-500">No countries found</div>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </FormField>
                        <FormField label="City/ies (comma-separated)">
                            <Input
                                type="text"
                                name="cityInput"
                                value={formData.cityInput}
                                onChange={handleInputChange}
                                placeholder="e.g. Manila, Quezon City, Cebu City"
                            />
                        </FormField>
                    </div>

                        <SectionTitle>Financial Information</SectionTitle>
                        {formData.fundingRows.map((row, index) => {
                            const selectedElsewhere = formData.fundingRows
                                .map((item, itemIndex) => (itemIndex === index ? '' : item.ifi))
                                .filter(Boolean);
                            const availableIfiOptions = IFI_OPTIONS.filter(
                                (option) => option === row.ifi || !selectedElsewhere.includes(option)
                            );
                            const isFirstRow = index === 0;

                            return (
                                <div
                                    key={index}
                                    className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] items-end ${isFirstRow ? 'gap-3 mb-2' : 'gap-2 mb-0'}`}
                                >
                                    <div className={isFirstRow ? 'space-y-1' : ''}>
                                        {isFirstRow && (
                                            <Label className="text-sm font-medium text-gray-700">International Financial Institution (IFI)</Label>
                                        )}
                                        <Select
                                            value={row.ifi || undefined}
                                            onValueChange={(value) => handleFundingRowChange(index, 'ifi', value)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select IFI" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableIfiOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className={isFirstRow ? 'space-y-1' : ''}>
                                        {isFirstRow && (
                                            <Label className="text-sm font-medium text-gray-700">Financial Instruments</Label>
                                        )}
                                        <Select
                                            value={row.financialInstrument || undefined}
                                            onValueChange={(value) => handleFundingRowChange(index, 'financialInstrument', value)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select instrument" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FINANCIAL_INSTRUMENT_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className={isFirstRow ? 'space-y-1' : ''}>
                                        {isFirstRow && (
                                            <Label className="text-sm font-medium text-gray-700">Amount (M USD)</Label>
                                        )}
                                        <Input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={row.amount}
                                            onChange={(e) => handleFundingRowChange(index, 'amount', e.target.value)}
                                            placeholder="0"
                                            className="h-10"
                                        />
                                    </div>

                                    <div className={isFirstRow ? 'pb-2' : 'pb-0'}>
                                        {formData.fundingRows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRepeatableRow('fundingRows', index)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                                                title="Remove row"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 mb-2">
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => addRepeatableRow('fundingRows')}
                                    disabled={formData.fundingRows.filter((row) => row.ifi).length >= IFI_OPTIONS.length}
                                    className="text-sm text-brand-medium-blue hover:underline disabled:text-gray-400 disabled:no-underline"
                                >
                                    + Add Funding Source
                                </button>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2">
                                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Total Project Amount (M USD)</Label>
                                <Input
                                    type="text"
                                    readOnly
                                    className="bg-gray-50 w-full h-10"
                                    value={calculateFundingTotal(formData.fundingRows).toLocaleString()}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Owner (Public/ Private / PPP) <span className="text-gray-500 text-xs">separate-by-commas</span></Label>
                                <Input 
                                    type="text" 
                                    value={formData.owner || ''} 
                                    onChange={(e) => handleSelectChange('owner', e.target.value)}
                                    placeholder="e.g., Public, Private, PPP"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Private Sector Borrower <span className="text-gray-500 text-xs">separate-by-commas</span></Label>
                                <Input 
                                    type="text" 
                                    value={formData.privateSectorBorrowers.join(', ')} 
                                    onChange={(e) => {
                                        const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                                        setFormData({ ...formData, privateSectorBorrowers: values });
                                    }}
                                    placeholder="e.g., Company A, Company B"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <SectionTitle>Environmental and Social Safeguards</SectionTitle>
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
                        <FormField label="Key documents URL">
                            <Input
                                type="url"
                                name="keyDocuments"
                                value={formData.keyDocuments}
                                onChange={handleInputChange}
                                placeholder="https://example.com/document"
                            />
                        </FormField>

                        <SectionTitle>Just Transition Indicators</SectionTitle>
                        <FormField label="Gender concerns">
                            <Textarea name="genderConcerns" value={formData.genderConcerns} onChange={handleInputChange} rows={3} />
                        </FormField>
                        <FormField label="Waste workers">
                            <Textarea name="wasteWorkers" value={formData.wasteWorkers} onChange={handleInputChange} rows={3} />
                        </FormField>
                        <FormField label="Resettlement">
                            <Textarea name="displacement" value={formData.displacement} onChange={handleInputChange} rows={3} />
                        </FormField>
                        
                        <SectionTitle>Community Opposition & Actions</SectionTitle>
                        <div>
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