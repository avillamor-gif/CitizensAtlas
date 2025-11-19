import { BankData, PieData, Article, Project } from '@/types/types';

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

export const projectBankData: BankData[] = [
  { name: 'ADB/IFC', projects: 350, totalProjects: 53, investment: 489, totalInvestment: 42 },
  { name: 'AIIB', projects: 254, totalProjects: 38, investment: 456, totalInvestment: 39 },
  { name: 'GCF', projects: 196, totalProjects: 24, investment: 245, totalInvestment: 24 },
  { name: 'GIZ', projects: 188, totalProjects: 22, investment: 204, totalInvestment: 22 },
  { name: 'JICA', projects: 135, totalProjects: 16, investment: 148, totalInvestment: 16 },
  { name: 'KOICA', projects: 45, totalProjects: 9, investment: 12, totalInvestment: 1 },
  { name: 'WB', projects: 8, totalProjects: 1, investment: 12, totalInvestment: 1 },
];

export const donutChartData: PieData[] = [
  { name: 'Waste-to-Energy', value: 45 },
  { name: 'Plastic-to-Fuel Technologies', value: 25 },
  { name: 'Chemical Recycling', value: 20 },
  { name: 'Refuse-derived fuel', value: 10 },
];

export const newsData: Article[] = [
  { id: 1, slug: 'pakistan-halts-controversial-incinerator-project-1', category: 'COUNTRY', title: 'Pakistan Halts Controversial Incinerator Project', description: 'A provincial government\'s procurement contract for a large-scale waste-to-energy incinerator was cancelled due to significant misconduct.', imageUrl: 'https://picsum.photos/400/301', tagColor: 'bg-yellow-400' },
  { id: 2, slug: 'carbon-credit-fraud-scheme-uncovered-in-taiwan-2', category: 'INVESTIGATION', title: 'Carbon Credit Fraud Scheme Uncovered in Taiwan', description: 'A fraudulent scheme involving the sale of fake carbon credits was uncovered, leading to the prosecution of two individuals.', imageUrl: 'https://picsum.photos/400/302', tagColor: 'bg-yellow-400' },
  { id: 3, slug: 'uk-implements-stricter-regulations-on-carbon-sales-3', category: 'POLICY', title: 'UK Implements Stricter Regulations on Carbon Sales', description: 'The UK government has introduced new legislation to curb fraudulent sales of carbon credits to vulnerable individuals.', imageUrl: 'https://picsum.photos/400/303', tagColor: 'bg-yellow-400' },
  { id: 4, slug: 'kenyan-communities-oppose-land-grabbing-carbon-project-4', category: 'COMMUNITY', title: 'Kenyan Communities Oppose Land-Grabbing Carbon Project', description: 'A large carbon offsetting project faces criticism for not obtaining Free, Prior, and Informed Consent from local communities.', imageUrl: 'https://picsum.photos/400/310', tagColor: 'bg-yellow-400' },
  { id: 5, slug: 'indonesian-palm-oil-magnate-jailed-for-deforestation-5', category: 'LEGAL', title: 'Indonesian Palm Oil Magnate Jailed for Deforestation', description: 'A high-profile case concludes with a major conviction for illegal deforestation and money laundering.', imageUrl: 'https://picsum.photos/400/311', tagColor: 'bg-yellow-400' },
  { id: 6, slug: 'honduran-activists-face-threats-over-hydroelectric-dams-6', category: 'HUMAN RIGHTS', title: 'Honduran Activists Face Threats Over Hydroelectric Dams', description: 'Environmental defenders report increased intimidation and violence in relation to controversial dam projects.', imageUrl: 'https://picsum.photos/400/312', tagColor: 'bg-yellow-400' },
];

export const videosData: Article[] = [
    { id: 1, slug: 'the-truth-about-chemical-recycling-1', category: 'WEBINAR', title: 'The Truth About Chemical Recycling', description: 'An in-depth webinar exploring the myths and realities of chemical recycling technologies and their environmental impact.', imageUrl: 'https://picsum.photos/400/304', tagColor: 'bg-yellow-400 text-black' },
    { id: 2, slug: 'zero-waste-a-vision-for-the-future-2', category: 'EDUC VID', title: 'Zero Waste: A Vision for the Future', description: 'This educational video outlines the core principles of a zero waste society and showcases successful community initiatives.', imageUrl: 'https://picsum.photos/400/305', tagColor: 'bg-yellow-400 text-black' },
    { id: 3, slug: 'global-south-speaks-out-against-waste-colonialism-3', category: 'CONFERENCE', title: 'Global South Speaks Out Against Waste Colonialism', description: 'Highlights from a major conference where leaders from the Global South address the injustices of international waste trade.', imageUrl: 'https://picsum.photos/400/306', tagColor: 'bg-yellow-400 text-black' },
    { id: 4, slug: 'a-conversation-with-a-waste-picker-union-leader-4', category: 'INTERVIEW', title: 'A Conversation with a Waste Picker Union Leader', description: 'An exclusive interview with a prominent waste picker union leader about the challenges and triumphs of organizing informal workers.', imageUrl: 'https://picsum.photos/400/313', tagColor: 'bg-yellow-400 text-black' },
    { id: 5, slug: 'the-plastic-pandemic-a-global-crisis-5', category: 'DOCUMENTARY', title: 'The Plastic Pandemic: A Global Crisis', description: 'A short documentary film investigating the root causes of plastic pollution and its impact on vulnerable communities.', imageUrl: 'https://picsum.photos/400/314', tagColor: 'bg-yellow-400 text-black' },
    { id: 6, slug: 'what-is-a-false-solution-6', category: 'EXPLAINER', title: 'What is a False Solution?', description: 'A concise explainer video that breaks down the concept of false solutions and helps viewers identify them.', imageUrl: 'https://picsum.photos/400/315', tagColor: 'bg-yellow-400 text-black' },
];

export const publicationsData: Article[] = [
    { id: 1, slug: 'waste-to-energy-burning-our-future-1', category: 'REPORT', title: 'Waste-to-Energy: Burning Our Future', description: 'A comprehensive report detailing the environmental, social, and economic costs of waste incineration.', imageUrl: 'https://picsum.photos/400/307', tagColor: 'bg-yellow-400', documentNames: ['WTE_Report_2023.pdf'], downloadCount: 1243 },
    { id: 2, slug: 'the-loopholes-in-carbon-offsetting-2', category: 'BRIEFING', title: 'The Loopholes in Carbon Offsetting', description: 'A policy briefing that exposes the critical flaws in the current carbon offsetting market and its regulations.', imageUrl: 'https://picsum.photos/400/308', tagColor: 'bg-yellow-400', documentNames: ['Carbon_Offset_Briefing.pdf'], downloadCount: 876 },
    { id: 3, slug: 'the-success-of-community-composting-in-manila-3', category: 'CASE STUDY', title: 'The Success of Community Composting in Manila', description: 'This case study examines a successful community-led composting program in Manila, Philippines.', imageUrl: 'https://picsum.photos/400/309', tagColor: 'bg-yellow-400', documentNames: ['Manila_Composting_Case_Study.pdf'], downloadCount: 951 },
    { id: 4, slug: 'advocating-for-extended-producer-responsibility-4', category: 'POLICY PAPER', title: 'Advocating for Extended Producer Responsibility', description: 'A detailed policy paper outlining effective strategies for implementing Extended Producer Responsibility (EPR) laws.', imageUrl: 'https://picsum.photos/400/316', tagColor: 'bg-yellow-400', documentNames: ['EPR_Policy_Paper.pdf'], downloadCount: 1532 },
    { id: 5, slug: 'following-the-money-the-financiers-of-plastic-pollution-5', category: 'INVESTIGATION', title: 'Following the Money: The Financiers of Plastic Pollution', description: 'An investigative piece tracing the financial investments that fuel the global plastic pollution crisis.', imageUrl: 'https://picsum.photos/400/317', tagColor: 'bg-yellow-400', downloadCount: 789 },
    { id: 6, slug: 'a-community-guide-to-fighting-polluting-projects-6', category: 'GUIDE', title: 'A Community Guide to Fighting Polluting Projects', description: 'A practical guide for community organizers on how to effectively challenge and stop polluting projects in their neighborhoods.', imageUrl: 'https://picsum.photos/400/318', tagColor: 'bg-yellow-400', documentNames: ['Community_Action_Guide.pdf', 'Legal_Templates.docx'], downloadCount: 2345 },
];

export const solutionTypeColors: { readonly [key: string]: { readonly hex: string; readonly tailwind: string } } = {
    'Waste-to-Energy': { hex: '#ef4444', tailwind: 'bg-red-500' },
    'Plastic-to-Fuel Technologies': { hex: '#f97316', tailwind: 'bg-orange-500' },
    'Chemical Recycling': { hex: '#eab308', tailwind: 'bg-yellow-500' },
    'Refuse-derived fuel': { hex: '#a855f7', tailwind: 'bg-purple-500' },
    'default': { hex: '#3b82f6', tailwind: 'bg-blue-500' }
};

export const getSolutionTypeColor = (type: string, format: 'hex' | 'tailwind') => {
    if (!type) return solutionTypeColors['default'][format];
    
    // The donut chart uses exact names from the split, but map markers might have combined types.
    // We prioritize the first type listed for map markers for consistency.
    const firstType = type.split(',')[0].trim();
    if (solutionTypeColors[firstType]) {
        return solutionTypeColors[firstType][format];
    }

    // Fallback for combined types if the first one isn't a primary key.
    for (const key in solutionTypeColors) {
        if (key !== 'default' && type.toLowerCase().includes(key.toLowerCase())) {
            return solutionTypeColors[key][format];
        }
    }
    return solutionTypeColors['default'][format];
};

export const getIfiAbbreviation = (ifi: string): string => {
    const mapping: { [key: string]: string } = {
        'Asian Development Bank': 'ADB',
        'World Bank': 'WB',
        'Central American Bank for Economic Integration (CABEI)': 'CABEI',
        'European Investment Bank (EIB)': 'EIB',
        'African Development Bank (AfDB)': 'AfDB',
    };
    return mapping[ifi] || ifi;
};

export const countryNameToCode: { [key: string]: string } = {
    'ARGENTINA': 'ar',
    'AUSTRALIA': 'au',
    'BANGLADESH': 'bd',
    'BRAZIL': 'br',
    'CAMBODIA': 'kh',
    'CHILE': 'cl',
    'COLOMBIA': 'co',
    'ECUADOR': 'ec',
    'EGYPT': 'eg',
    'GERMANY': 'de',
    'GHANA': 'gh',
    'HONDURAS': 'hn',
    'INDIA': 'in',
    'INDONESIA': 'id',
    'KENYA': 'ke',
    'MALAYSIA': 'my',
    'MEXICO': 'mx',
    'NIGERIA': 'ng',
    'PAKISTAN': 'pk',
    'PERU': 'pe',
    'PHILIPPINES': 'ph',
    'POLAND': 'pl',
    'ROMANIA': 'ro',
    'SOUTH AFRICA': 'za',
    'SOUTH KOREA': 'kr',
    'SRI LANKA': 'lk',
    'TAIWAN': 'tw',
    'THAILAND': 'th',
    'TURKEY': 'tr',
    'UNITED KINGDOM': 'gb',
    'USA': 'us',
    'VIETNAM': 'vn',
};

export const projectCardsData: Project[] = [
    { 
        id: 1, 
        country: 'PAKISTAN', 
        title: 'REGULATORY BODY IN PAKISTAN CANCELS PROVINCIAL GOVERNMENT\'S PROCUREMENT CONTRACT OVER MISCONDUCT IN CLIMATE-RELATED PROJECTS', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Waste-to-Energy', 
        latitude: 30.3753, 
        longitude: 69.3451,
        details: `
**Region:** Asia
**City:** Karachi
**Project Number:** 789123
**IFI:** Asian Development Bank
**Funding Source:** Public Funds
**Total Project Amount:** $50,000,000
**Owner:** PPP
**Private Sector Borrowers:** Climate Solutions Inc.
**Project Description:**
A provincial government's procurement contract for a large-scale waste-to-energy incinerator was cancelled due to significant misconduct and lack of transparency in the bidding process. The project was initially promoted as a climate solution but faced heavy criticism for its potential environmental and health impacts.
---
**Project Status:** Cancelled
**Start Date:** 2022-01-15
**End Date:** 2023-10-30
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Pakistan Waste Workers Alliance, Local Community Action Group
**Types of Actions:** Public protests, legal challenges, advocacy campaigns
**Links to Actions:** https://example.com/pakistan-protest
**Active GAIA Support:** Yes
**Notes:**
The cancellation was a major victory for local environmental groups who argued for decentralized, zero-waste solutions.
**References:**
Official cancellation notice, news articles from local media.
---
**Gender Concerns:** The project disproportionately affected women waste pickers who rely on informal waste collection for their livelihoods.
**Waste Workers:** The project threatened the livelihoods of thousands of informal waste workers without providing alternative employment.
**Displacement:** The proposed site would have displaced several local communities.
        `.trim()
    },
    { 
        id: 2, 
        country: 'TAIWAN', 
        title: 'TAIWAN SUCCESSFULLY PROSECUTES A COUPLE FOR FRAUD IN A CARBON CREDIT TRADING SCHEME', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Chemical Recycling', 
        latitude: 23.6978, 
        longitude: 120.9605,
        details: `
**Region:** Asia
**City:** Taipei
**Project Number:** N/A
**IFI:** N/A
**Funding Source:** Private Investment
**Total Project Amount:** $5,000,000
**Owner:** Private
**Private Sector Borrowers:** N/A
**Project Description:**
A fraudulent scheme involving the sale of fake carbon credits was uncovered. A couple was successfully prosecuted for selling certificates that did not correspond to any real carbon offsetting projects, defrauding investors and companies seeking to meet their climate targets.
---
**Project Status:** Active
**Start Date:** 2021-06-01
**End Date:** N/A
**Environmental Category:** N/A
**Social Safeguard Categories:** N/A
**Groups in Opposition:** None
**Types of Actions:** Legal prosecution
**Links to Actions:** https://example.com/taiwan-fraud-case
**Active GAIA Support:** No
**Notes:**
This case highlights the need for better regulation and verification in the voluntary carbon market.
**References:**
Court documents, financial news reports.
---
**Gender Concerns:** No specific gender concerns were reported.
**Waste Workers:** This project did not directly involve waste workers.
**Displacement:** No displacement occurred as a result of this project.
        `.trim()
    },
    { 
        id: 3, 
        country: 'UNITED KINGDOM', 
        title: 'UK JAILS TWO INDIVIDUALS FOR FRAUDULENT CARBON SALES SCHEME', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Chemical Recycling', 
        latitude: 55.3781, 
        longitude: -3.4360,
        details: `
**Region:** Europe
**City:** London
**Project Number:** N/A
**IFI:** N/A
**Funding Source:** Private Investment
**Total Project Amount:** $10,000,000
**Owner:** Private
**Private Sector Borrowers:** N/A
**Project Description:**
Two individuals were jailed for operating a high-pressure sales scheme that targeted elderly and vulnerable people, convincing them to invest in non-existent or worthless carbon credits.
---
**Project Status:** Inactive
**Start Date:** 2019-01-01
**End Date:** 2022-12-31
**Environmental Category:** N/A
**Social Safeguard Categories:** N/A
**Groups in Opposition:** None
**Types of Actions:** Criminal investigation, prosecution
**Links to Actions:** https://example.com/uk-carbon-scam
**Active GAIA Support:** No
---
**Gender Concerns:** Not applicable.
**Waste Workers:** Not applicable.
**Displacement:** Not applicable.
        `.trim()
    },
    { 
        id: 4, 
        country: 'KENYA', 
        title: 'MARGINALISED COMMUNITIES IN NORTHERN KENYA KEPT IN DARK ABOUT A KEY CARBON OFFSETTING PROJECT', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Chemical Recycling', 
        latitude: -0.0236, 
        longitude: 37.9062,
        details: `
**Region:** Africa
**City:** Isiolo County
**Project Number:** 456789
**IFI:** World Bank
**Funding Source:** Carbon Market
**Total Project Amount:** $15,000,000
**Owner:** Private
**Private Sector Borrowers:** Green Horizons Ltd.
**Project Description:**
A large-scale carbon offsetting project has been criticized for failing to obtain the Free, Prior, and Informed Consent (FPIC) of indigenous and marginalized communities. The project restricts access to traditional lands and resources without adequate consultation or compensation.
---
**Project Status:** Active
**Start Date:** 2020-03-01
**End Date:** N/A
**Environmental Category:** Category B
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Indigenous Peoples Network, Local pastoralist communities
**Types of Actions:** Community organizing, international advocacy, filing complaints with IFI accountability mechanisms
**Links to Actions:** https://example.com/kenya-carbon-project
**Active GAIA Support:** Yes
---
**Gender Concerns:** Women are particularly affected as they are often responsible for gathering resources from the land.
**Waste Workers:** Not applicable.
**Displacement:** Economic displacement due to loss of access to grazing lands and water sources.
        `.trim()
    },
    { 
        id: 5, 
        country: 'INDONESIA', 
        title: 'THE BILLIONAIRE TYCOON WHO BURNED THE FOREST: PALM OIL MOGUL SENTENCED TO 15 YEARS IN INDONESIA\'S \'BIGGEST\' CORRUPTION CASE INVOLVING DEFORESTATION AND MONEY LAUNDERING', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Refuse-derived fuel', 
        latitude: -0.7893, 
        longitude: 113.9213,
        details: `
**Region:** Asia
**City:** Jakarta
**Project Number:** N/A
**IFI:** Multiple private banks
**Funding Source:** Private/Public
**Total Project Amount:** $1,200,000,000
**Owner:** Private
**Private Sector Borrowers:** Palm Oil Corp
**Project Description:**
A high-profile corruption case led to the conviction of a palm oil tycoon for massive deforestation, illegal land acquisition, and money laundering. The case exposed deep-rooted corruption linking business and political elites.
---
**Project Status:** Inactive
**Start Date:** 2010-01-01
**End Date:** 2023-01-01
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Greenpeace Indonesia, WALHI
**Types of Actions:** Investigations, public campaigns, legal action
**Links to Actions:** https://example.com/indonesia-deforestation-case
**Active GAIA Support:** Yes
---
**Gender Concerns:** Loss of forest resources impacts women who depend on them for food and medicine.
**Waste Workers:** Not applicable.
**Displacement:** Thousands of indigenous people were displaced from their ancestral lands.
        `.trim()
    },
    { 
        id: 6, 
        country: 'HONDURAS', 
        title: 'ENVIRONMENTALISTS INTIMIDATED AND MURDERED IN HIGHLY CONTROVERSIAL HYDROELECTRIC POWER PROJECTS', 
        date: 'November 2023',
        publishDate: '2023-11-15',
        corruptionType: 'Waste-to-Energy', 
        latitude: 15.199999, 
        longitude: -86.241905,
        details: `
**Region:** North America
**City:** Río Blanco
**Project Number:** 123987
**IFI:** Central American Bank for Economic Integration (CABEI)
**Funding Source:** IFI, Public Funds
**Total Project Amount:** $250,000,000
**Owner:** PPP
**Private Sector Borrowers:** Hydro Power S.A.
**Project Description:**
The development of several hydroelectric power projects has been plagued by corruption, embezzlement of funds, and severe human rights violations, including the intimidation and murder of environmental defenders and indigenous leaders opposing the projects.
---
**Project Status:** Active
**Start Date:** 2018-05-20
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** COPINH, local Lenca communities
**Types of Actions:** Protests, international pressure campaigns, legal defense for activists
**Links to Actions:** https://example.com/honduras-hydro-dam
**Active GAIA Support:** Yes
---
**Gender Concerns:** Female activists have been specifically targeted with violence and intimidation.
**Waste Workers:** Not applicable.
**Displacement:** The projects have led to the forced displacement of indigenous communities from their lands.
        `.trim()
    },
    { 
        id: 7, 
        country: 'USA', 
        title: 'PROPOSED CHEMICAL RECYCLING PLANT IN OHIO FACES STRONG LOCAL OPPOSITION OVER HEALTH CONCERNS', 
        date: 'October 2023',
        publishDate: '2023-10-15',
        corruptionType: 'Chemical Recycling', 
        latitude: 40.4173, 
        longitude: -82.9071,
        details: `
**Region:** North America
**City:** Columbus
**Project Number:** 987654
**IFI:** USAID
**Funding Source:** Private Equity
**Total Project Amount:** $150,000,000
**Owner:** Private
**Private Sector Borrowers:** PetroChem Solutions
**Project Description:**
A new 'advanced' chemical recycling facility is being promoted as a solution to plastic waste. However, community groups and scientists have raised alarms about toxic air emissions and the high energy consumption of the process, labeling it as greenwashing.
---
**Project Status:** Proposed
**Start Date:** N/A
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category B
**Groups in Opposition:** Ohio Valley Environmental Coalition, Concerned Citizens of Columbus
**Types of Actions:** Town hall meetings, petitions, media outreach
**Links to Actions:** https://example.com/ohio-plant
**Active GAIA Support:** Yes
**Notes:**
The project's environmental impact assessment is being challenged for using outdated data.
**References:**
Company press releases, independent scientific reports.
---
**Gender Concerns:** Not specified.
**Waste Workers:** No direct impact on informal waste workers.
**Displacement:** Potential for decreased property values in nearby residential areas.
        `.trim()
    },
    { 
        id: 8, 
        country: 'GERMANY', 
        title: 'INVESTIGATION REVEALS UNDUE INFLUENCE IN THE APPROVAL OF A WASTE-TO-ENERGY INCINERATOR NEAR HAMBURG', 
        date: 'September 2023',
        publishDate: '2023-09-15',
        corruptionType: 'Waste-to-Energy', 
        latitude: 53.5511, 
        longitude: 9.9937,
        details: `
**Region:** Europe
**City:** Hamburg
**Project Number:** 555444
**IFI:** European Investment Bank (EIB)
**Funding Source:** Public-Private Partnership
**Total Project Amount:** €200,000,000
**Owner:** PPP
**Private Sector Borrowers:** Energie AG
**Project Description:**
Journalistic investigations uncovered that lobbyists for the incinerator company had undisclosed meetings with city officials, leading to the fast-tracking of permits despite environmental concerns from the public.
---
**Project Status:** Active
**Start Date:** 2022-08-01
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category B
**Groups in Opposition:** BUND Hamburg, local citizen initiatives
**Types of Actions:** Freedom of Information requests, legal challenges
**Links to Actions:** https://example.com/hamburg-incinerator
**Active GAIA Support:** No
**Notes:**
The case has prompted calls for stricter lobbying transparency laws in Germany.
**References:**
Investigative journalism articles, city council meeting minutes.
---
**Gender Concerns:** Not applicable.
**Waste Workers:** Not applicable.
**Displacement:** No direct displacement.
        `.trim()
    },
    { 
        id: 9, 
        country: 'SOUTH AFRICA', 
        title: 'MINING COMPANY ACCUSED OF EMBEZZLEMENT AND GREENWASHING IN CARBON OFFSET PROJECT', 
        date: 'August 2023', 
        corruptionType: 'Chemical Recycling', 
        latitude: -30.5595, 
        longitude: 22.9375,
        details: `
**Region:** Africa
**City:** Kimberley
**Project Number:** 333222
**IFI:** African Development Bank (AfDB)
**Funding Source:** Carbon Market, IFI loan
**Total Project Amount:** $40,000,000
**Owner:** Private
**Private Sector Borrowers:** Carbon Neutral Mining Co.
**Project Description:**
A whistleblower alleged that a mining company falsified data for a reforestation carbon offset project, embezzling funds meant for tree planting while continuing its polluting operations. The project was heavily marketed as part of the company's 'green' transition.
---
**Project Status:** Active
**Start Date:** 2021-01-10
**End Date:** N/A
**Environmental Category:** Category B
**Social Safeguard Categories:** Category B
**Groups in Opposition:** Centre for Environmental Rights, groundWork
**Types of Actions:** Whistleblower reports, legal action
**Links to Actions:** https://example.com/safrica-mining
**Active GAIA Support:** Yes
**Notes:**
The case is currently under investigation by national anti-corruption authorities.
**References:**
Leaked internal documents, media reports.
---
**Gender Concerns:** Not specified.
**Waste Workers:** Not applicable.
**Displacement:** Not applicable.
        `.trim()
    },
    { 
        id: 10, 
        country: 'BRAZIL', 
        title: 'CONSTRUCTION FIRM FINED FOR BRIBERY IN AMAZON DAM PROJECT, LINKED TO MASSIVE DEFORESTATION', 
        date: 'July 2023', 
        corruptionType: 'Waste-to-Energy', 
        latitude: -14.2350, 
        longitude: -51.9253,
        details: `
**Region:** South America
**City:** Belo Monte
**Project Number:** 111000
**IFI:** World Bank
**Funding Source:** IFI, National Development Bank
**Total Project Amount:** $18,000,000,000
**Owner:** PPP
**Private Sector Borrowers:** Construtora Gigante
**Project Description:**
As part of a larger national corruption scandal, a major construction firm admitted to paying bribes to politicians and officials to secure contracts for the controversial Belo Monte Dam, which has caused widespread deforestation and displacement of Indigenous communities.
---
**Project Status:** Active
**Start Date:** 2011-03-01
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Movimento Xingu Vivo Para Sempre, Amazon Watch
**Types of Actions:** Mass protests, international advocacy, legal battles
**Links to Actions:** https://example.com/belo-monte-dam
**Active GAIA Support:** Yes
**Notes:**
The dam's social and environmental impacts have been catastrophic, far exceeding initial assessments.
**References:**
Judicial rulings, international human rights reports.
---
**Gender Concerns:** Indigenous women have lost access to traditional livelihoods and faced increased violence in displaced communities.
**Waste Workers:** Not applicable.
**Displacement:** An estimated 20,000-40,000 people were directly displaced by the dam's reservoir.
        `.trim()
    },
    { 
        id: 11, 
        country: 'INDIA', 
        title: 'MUNICIPAL WASTE-TO-ENERGY CONTRACT IN PUNE AWARDED AMIDST ALLEGATIONS OF PROCUREMENT IRREGULARITIES', 
        date: 'June 2023', 
        corruptionType: 'Waste-to-Energy', 
        latitude: 18.5204, 
        longitude: 73.8567,
        details: `
**Region:** Asia
**City:** Pune
**Project Number:** 246810
**IFI:** Asian Development Bank
**Funding Source:** Public Funds
**Total Project Amount:** $80,000,000
**Owner:** Public
**Private Sector Borrowers:** N/A
**Project Description:**
A contract for a large incinerator was awarded to a company with alleged ties to local politicians, despite its bid being higher than competitors and its technology being unproven. Citizen groups have filed a lawsuit challenging the procurement process.
---
**Project Status:** Active
**Start Date:** 2023-01-01
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Alliance of Indian Wastepickers, Pune Clean Air Collective
**Types of Actions:** Right to Information (RTI) applications, public interest litigation
**Links to Actions:** https://example.com/pune-incinerator
**Active GAIA Support:** Yes
**Notes:**
The project threatens the livelihoods of thousands of waste pickers in Pune.
**References:**
Court filings, local news investigations.
---
**Gender Concerns:** The majority of waste pickers affected are women, whose livelihoods are at risk.
**Waste Workers:** The project aims to divert all municipal waste to the incinerator, directly undermining the informal recycling sector.
**Displacement:** No direct displacement.
        `.trim()
    },
    { 
        id: 12, 
        country: 'AUSTRALIA', 
        title: 'PLASTIC-TO-FUEL PROJECT COLLAPSES AFTER FOUNDERS CHARGED WITH FRAUD', 
        date: 'May 2023', 
        corruptionType: 'Plastic-to-Fuel Technologies', 
        latitude: -25.2744, 
        longitude: 133.7751,
        details: `
**Region:** Oceania
**City:** Canberra
**Project Number:** N/A
**IFI:** N/A
**Funding Source:** Private Venture Capital
**Total Project Amount:** $25,000,000
**Owner:** Private
**Private Sector Borrowers:** N/A
**Project Description:**
A high-profile startup that claimed to have a revolutionary technology to turn mixed plastic waste into fuel has gone into administration. Its founders have been charged with defrauding investors by misrepresenting the technology's capabilities and financial viability.
---
**Project Status:** Inactive
**Start Date:** 2020-07-01
**End Date:** 2023-04-15
**Environmental Category:** N/A
**Social Safeguard Categories:** N/A
**Groups in Opposition:** National Toxics Network
**Types of Actions:** Scientific critiques, investor warnings
**Links to Actions:** https://example.com/australia-plastic-fuel
**Active GAIA Support:** No
**Notes:**
The case serves as a cautionary tale for 'silver bullet' tech solutions to the plastic crisis.
**References:**
Financial regulator press releases, technology news sites.
---
**Gender Concerns:** Not applicable.
**Waste Workers:** Not applicable.
**Displacement:** Not applicable.
        `.trim()
    },
    {
        id: 13,
        country: 'PHILIPPINES',
        title: 'MANILA BAY RECLAMATION PROJECT LINKED TO PROCUREMENT IRREGULARITIES AND GREENWASHING',
        date: 'April 2023',
        corruptionType: 'Refuse-derived fuel',
        latitude: 14.5995,
        longitude: 120.9842,
        details: `
**Region:** Asia
**City:** Manila
**Project Number:** PH-12345
**IFI:** World Bank
**Funding Source:** Public-Private Partnership
**Total Project Amount:** $500,000,000
**Owner:** PPP
**Private Sector Borrowers:** Manila Bay Corp.
**Project Description:**
A massive reclamation project in Manila Bay, promoted for climate resilience, faces allegations of procurement fraud. Environmental groups label it as greenwashing, pointing to the destruction of vital marine ecosystems.
---
**Project Status:** Active
**Start Date:** 2022-03-10
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Fisherfolk Unions, Environmental Advocates PH
**Types of Actions:** Protests, legal challenges
**Links to Actions:** https://example.com/manila-bay-reclamation
**Active GAIA Support:** Yes
**Notes:**
The project threatens the livelihood of thousands of small-scale fishers.
**References:**
News reports, environmental impact studies.
---
**Gender Concerns:** Women in fishing communities are disproportionately affected by the loss of access to marine resources.
**Waste Workers:** Not applicable.
**Displacement:** Over 20,000 families are at risk of displacement.
        `.trim()
    },
    {
        id: 14,
        country: 'VIETNAM',
        title: 'WASTE-TO-ENERGY PLANT IN HO CHI MINH CITY HALTED DUE TO CONFLICT OF INTEREST VIOLATIONS',
        date: 'March 2023',
        corruptionType: 'Waste-to-Energy',
        latitude: 10.8231,
        longitude: 106.6297,
        details: `
**Region:** Asia
**City:** Ho Chi Minh City
**Project Number:** VN-67890
**IFI:** Asian Development Bank
**Funding Source:** Public Funds
**Total Project Amount:** $120,000,000
**Owner:** Public
**Private Sector Borrowers:** N/A
**Project Description:**
The construction of a new WTE incinerator was suspended after an investigation revealed that the primary contractor was secretly owned by a relative of the city's urban planning director.
---
**Project Status:** Cancelled
**Start Date:** 2022-05-01
**End Date:** 2023-03-15
**Environmental Category:** Category A
**Social Safeguard Categories:** Category B
**Groups in Opposition:** Vietnam Zero Waste Alliance, local residents
**Types of Actions:** Whistleblower report, investigative journalism
**Links to Actions:** https://example.com/vietnam-wte
**Active GAIA Support:** Yes
**Notes:**
The case has led to calls for stronger conflict of interest regulations for public officials.
**References:**
Government audit reports, media exposes.
---
**Gender Concerns:** Not specified.
**Waste Workers:** The livelihoods of informal waste pickers were threatened by the project.
**Displacement:** No direct displacement.
        `.trim()
    },
    {
        id: 15,
        country: 'THAILAND',
        title: 'BANGKOK PLASTIC-TO-FUEL FACILITY EXPOSED AS FRAUDULENT, PRODUCING TOXIC BYPRODUCTS',
        date: 'February 2023',
        corruptionType: 'Plastic-to-Fuel Technologies',
        latitude: 13.7563,
        longitude: 100.5018,
        details: `
**Region:** Asia
**City:** Bangkok
**Project Number:** TH-54321
**IFI:** JICA
**Funding Source:** Private Equity
**Total Project Amount:** $30,000,000
**Owner:** Private
**Private Sector Borrowers:** Thai Eco Fuels
**Project Description:**
A much-hyped chemical recycling plant claiming to convert plastic waste into clean fuel was found to be a fraudulent enterprise. The technology was inefficient, and the facility was secretly dumping toxic sludge into local waterways.
---
**Project Status:** Inactive
**Start Date:** 2021-08-20
**End Date:** 2023-02-01
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Greenpeace Thailand, local communities
**Types of Actions:** Scientific testing, public awareness campaigns, legal action
**Links to Actions:** https://example.com/thailand-plastic-fuel
**Active GAIA Support:** No
**Notes:**
The company's founders fled the country and are facing international arrest warrants.
**References:**
Environmental lab results, investor lawsuits.
---
**Gender Concerns:** Reports of skin rashes and respiratory problems were higher among women and children living near the facility.
**Waste Workers:** Not applicable.
**Displacement:** Not applicable.
        `.trim()
    },
    {
        id: 16,
        country: 'NIGERIA',
        title: 'LAGOS LANDFILL GAS CAPTURE PROJECT FUNDS EMBEZZLED BY PUBLIC OFFICIALS',
        date: 'January 2024',
        corruptionType: 'Waste-to-Energy',
        latitude: 6.5244,
        longitude: 3.3792,
        details: `
**Region:** Africa
**City:** Lagos
**Project Number:** NG-98701
**IFI:** African Development Bank (AfDB)
**Funding Source:** IFI Loan
**Total Project Amount:** $25,000,000
**Owner:** Public
**Private Sector Borrowers:** N/A
**Project Description:**
A project designed to capture methane from a massive landfill and generate electricity has failed to materialize. Investigations revealed that a significant portion of the loan from the AfDB was embezzled through a network of shell companies.
---
**Project Status:** Inactive
**Start Date:** 2020-01-01
**End Date:** N/A
**Environmental Category:** Category B
**Social Safeguard Categories:** Category C
**Groups in Opposition:** Nigerian Environmental Rights Action
**Types of Actions:** Financial audits, anti-corruption investigation
**Links to Actions:** https://example.com/lagos-landfill
**Active GAIA Support:** Yes
**Notes:**
The scandal has put a spotlight on the need for greater IFI oversight on loan disbursements.
**References:**
Forensic accounting reports, court filings.
---
**Gender Concerns:** Not applicable.
**Waste Workers:** The project failed to improve conditions for the thousands of waste pickers working at the landfill.
**Displacement:** Not applicable.
        `.trim()
    },
    {
        id: 17,
        country: 'MEXICO',
        title: 'ECO-TOURISM DEVELOPMENT IN CANCÚN ACCUSED OF GREENWASHING AND VIOLATING INDIGENOUS LAND RIGHTS',
        date: 'December 2023',
        corruptionType: 'Refuse-derived fuel',
        latitude: 21.1619,
        longitude: -86.8515,
        details: `
**Region:** North America
**City:** Cancún
**Project Number:** MX-22233
**IFI:** N/A
**Funding Source:** Private Investment
**Total Project Amount:** $200,000,000
**Owner:** Private
**Private Sector Borrowers:** Paradise Resorts Inc.
**Project Description:**
A luxury 'eco-resort' development is being built on ancestral Mayan land without proper consultation or consent. The project is marketed as sustainable but involves clearing mangrove forests, which are critical for coastal protection.
---
**Project Status:** Active
**Start Date:** 2022-11-01
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Mayan Community Council, local environmental NGOs
**Types of Actions:** Land defense, legal challenges, international solidarity campaigns
**Links to Actions:** https://example.com/cancun-resort
**Active GAIA Support:** No
**Notes:**
The developers used fraudulent land titles to acquire the property.
**References:**
Community testimonies, legal documents, satellite imagery analysis.
---
**Gender Concerns:** Mayan women, as keepers of traditional knowledge and agriculture, are particularly impacted by the loss of land.
**Waste Workers:** Not applicable.
**Displacement:** Forced eviction of several Mayan families from their homes.
        `.trim()
    },
    {
        id: 18,
        country: 'COLOMBIA',
        title: 'BRIBERY SCANDAL UNCOVERED IN CONTRACTING FOR CONTROVERSIAL HYDROELECTRIC DAM IN BOGOTÁ',
        date: 'November 2023',
        corruptionType: 'Waste-to-Energy',
        latitude: 4.7110,
        longitude: -74.0721,
        details: `
**Region:** South America
**City:** Bogotá
**Project Number:** CO-44556
**IFI:** World Bank
**Funding Source:** PPP
**Total Project Amount:** $1,500,000,000
**Owner:** PPP
**Private Sector Borrowers:** Energía Andina
**Project Description:**
A major construction company was found to have paid millions in bribes to government officials to secure the lead contract for a new hydroelectric dam. The project's environmental impact assessment was also found to be fraudulent.
---
**Project Status:** Active
**Start Date:** 2019-06-15
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** Rios Vivos Colombia, affected peasant communities
**Types of Actions:** Protests, legal action against the company and officials
**Links to Actions:** https://example.com/colombia-dam
**Active GAIA Support:** Yes
**Notes:**
This is part of a wider investigation into corruption in public infrastructure projects.
**References:**
Prosecutor's office announcements, leaked bank records.
---
**Gender Concerns:** Increased militarization around the project site has led to reports of violence against women.
**Waste Workers:** Not applicable.
**Displacement:** The dam reservoir will displace over 500 families.
        `.trim()
    },
    {
        id: 19,
        country: 'POLAND',
        title: 'BIOMASS INCINERATOR IN WARSAW CRITICIZED FOR GREENWASHING AND RELIANCE ON IMPORTED WOOD',
        date: 'October 2023',
        corruptionType: 'Waste-to-Energy',
        latitude: 52.2297,
        longitude: 21.0122,
        details: `
**Region:** Europe
**City:** Warsaw
**Project Number:** PL-77889
**IFI:** European Investment Bank (EIB)
**Funding Source:** EU Funds, Private Investment
**Total Project Amount:** €300,000,000
**Owner:** Private
**Private Sector Borrowers:** GreenEnergy Polska
**Project Description:**
A power plant touted as a renewable energy project is burning large quantities of imported wood pellets, some from illegally logged old-growth forests. Critics argue it's a form of greenwashing that undermines real climate solutions and promotes deforestation abroad.
---
**Project Status:** Active
**Start Date:** 2021-01-01
**End Date:** N/A
**Environmental Category:** Category B
**Social Safeguard Categories:** Category C
**Groups in Opposition:** Polish Green Network, Workshop for All Beings
**Types of Actions:** Advocacy at EU level, supply chain investigations
**Links to Actions:** https://example.com/poland-biomass
**Active GAIA Support:** No
**Notes:**
The project benefits from generous renewable energy subsidies.
**References:**
NGO reports, satellite data on forest loss.
---
**Gender Concerns:** Not applicable.
**Waste Workers:** Not applicable.
**Displacement:** Not applicable.
        `.trim()
    },
    {
        id: 20,
        country: 'TURKEY',
        title: 'ISTANBUL CANAL PROJECT RIDDLED WITH PROCUREMENT CORRUPTION AND EMBEZZLEMENT',
        date: 'September 2023',
        corruptionType: 'Refuse-derived fuel',
        latitude: 41.0082,
        longitude: 28.9784,
        details: `
**Region:** Europe
**City:** Istanbul
**Project Number:** TR-10111
**IFI:** N/A
**Funding Source:** Public Funds
**Total Project Amount:** $15,000,000,000
**Owner:** Public
**Private Sector Borrowers:** N/A
**Project Description:**
The mega-project to build a new canal in Istanbul has been marred by allegations that construction contracts were awarded to politically connected companies at inflated prices. Critics also warn of catastrophic environmental consequences.
---
**Project Status:** Proposed
**Start Date:** N/A
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** TMMOB (Union of Chambers of Turkish Engineers and Architects), Istanbul City Council
**Types of Actions:** Public demonstrations, scientific reports, legal challenges
**Links to Actions:** https://example.com/istanbul-canal
**Active GAIA Support:** No
**Notes:**
The project is seen by many as a vehicle for real estate speculation and enrichment of government allies.
**References:**
Opposition party reports, independent geological surveys.
---
**Gender Concerns:** Not specified.
**Waste Workers:** Not applicable.
**Displacement:** The project would displace hundreds of thousands of residents.
        `.trim()
    },
    {
        id: 21,
        country: 'EGYPT',
        title: 'NEW ADMINISTRATIVE CAPITAL INFRASTRUCTURE PROJECTS BENEFIT COMPANIES WITH UNDUE INFLUENCE',
        date: 'August 2023',
        corruptionType: 'Refuse-derived fuel',
        latitude: 30.0444,
        longitude: 31.2357,
        details: `
**Region:** Africa
**City:** Cairo
**Project Number:** EG-12131
**IFI:** N/A
**Funding Source:** Public Funds, Foreign Loans
**Total Project Amount:** $58,000,000,000
**Owner:** Public
**Private Sector Borrowers:** N/A
**Project Description:**
Major construction contracts for Egypt's New Administrative Capital have been consistently awarded to companies owned by or with close ties to the military and government elite, bypassing competitive bidding processes.
---
**Project Status:** Active
**Start Date:** 2015-01-01
**End Date:** N/A
**Environmental Category:** Category B
**Social Safeguard Categories:** Category C
**Groups in Opposition:** Limited public opposition due to political climate
**Types of Actions:** Investigative journalism from abroad
**Links to Actions:** https://example.com/egypt-new-capital
**Active GAIA Support:** No
**Notes:**
The project is being financed by massive foreign debt, raising concerns about its economic viability.
**References:**
International media reports, financial analyses.
---
**Gender Concerns:** Not specified.
**Waste Workers:** The project diverts resources from basic services in existing cities.
**Displacement:** Not applicable.
        `.trim()
    },
    {
        id: 22,
        country: 'PERU',
        title: 'AMAZON CARBON OFFSET PROJECT FAILS TO PROTECT FOREST, VIOLATES INDIGENOUS CONSENT',
        date: 'July 2023',
        corruptionType: 'Chemical Recycling',
        latitude: -9.1900,
        longitude: -75.0152,
        details: `
**Region:** South America
**City:** Amazon Basin
**Project Number:** PE-14151
**IFI:** GCF
**Funding Source:** Carbon Market
**Total Project Amount:** $20,000,000
**Owner:** Private
**Private Sector Borrowers:** Amazon Carbon S.A.
**Project Description:**
A large REDD+ (Reducing Emissions from Deforestation and Forest Degradation) project is selling carbon credits based on exaggerated claims of forest protection. Indigenous communities in the project area were not properly consulted and have seen no benefits, while illegal logging continues.
---
**Project Status:** Active
**Start Date:** 2018-01-01
**End Date:** N/A
**Environmental Category:** Category A
**Social Safeguard Categories:** Category A
**Groups in Opposition:** AIDESEP (Interethnic Association for the Development of the Peruvian Rainforest)
**Types of Actions:** Community monitoring, filing complaints, media outreach
**Links to Actions:** https://example.com/peru-carbon-offset
**Active GAIA Support:** Yes
**Notes:**
This is one of several carbon offset projects in the Amazon facing similar criticisms.
**References:**
Satellite imagery analysis, community testimonies, academic studies.
---
**Gender Concerns:** Indigenous women's roles as forest guardians and knowledge holders are undermined by the project's top-down approach.
**Waste Workers:** Not applicable.
**Displacement:** Economic displacement through restrictions on traditional forest use.
        `.trim()
    },
    ...Array.from({ length: 90 }, (_, i) => {
        const id = i + 23;
        const countries = ['ARGENTINA', 'BANGLADESH', 'CAMBODIA', 'CHILE', 'ECUADOR', 'GHANA', 'MALAYSIA', 'ROMANIA', 'SRI LANKA', 'SOUTH KOREA'];
        const cities = ['Buenos Aires', 'Dhaka', 'Phnom Penh', 'Santiago', 'Quito', 'Accra', 'Kuala Lumpur', 'Bucharest', 'Colombo', 'Seoul'];
        const latitudes = [-34.60, 23.81, 11.55, -33.44, -0.18, 5.60, 3.13, 44.42, 6.92, 37.56];
        const longitudes = [-58.38, 90.41, 104.92, -70.66, -78.46, -0.18, 101.68, 26.10, 79.86, 126.97];
        const corruptionTypes = ['Waste-to-Energy', 'Plastic-to-Fuel Technologies', 'Chemical Recycling', 'Refuse-derived fuel'];
        const projectTypes = ['Waste-to-energy plant', 'Chemical recycling facility', 'Landfill expansion', 'Biomass power plant', 'Hydroelectric dam', 'Carbon offset scheme', 'Industrial park', 'Port expansion', 'Monoculture plantation'];
        const ifis = ['World Bank', 'ADB', 'AIIB', 'JICA', 'EIB', 'AfDB', 'USAID', 'N/A'];
        const statuses = ['Proposed', 'Active', 'Cancelled', 'Inactive'];

        const index = id % countries.length;
        const corruptionIndex1 = id % corruptionTypes.length;
        const corruptionIndex2 = (id + 3) % corruptionTypes.length;
        const corruption = corruptionIndex1 === corruptionIndex2 ? corruptionTypes[corruptionIndex1] : `${corruptionTypes[corruptionIndex1]}, ${corruptionTypes[corruptionIndex2]}`;
        const amount = (10 + (id % 50)) * 1000000 * (id % 10 + 1);
        const year = 2022 + (id % 3);
        const month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ][id % 12];
        const projectType = projectTypes[id % projectTypes.length];
        
        return {
            id: id,
            country: countries[index],
            title: `CONTROVERSY SURROUNDS ${projectType.toUpperCase()} IN ${cities[index].toUpperCase()}`,
            date: `${month} ${year}`,
            corruptionType: corruption,
            latitude: latitudes[index] + (Math.random() - 0.5),
            longitude: longitudes[index] + (Math.random() - 0.5),
            details: `
**Region:** ${['Asia', 'South America', 'Africa', 'Europe'][index % 4]}
**City:** ${cities[index]}
**Project Number:** XX-${id * 123}
**IFI:** ${ifis[id % ifis.length]}
**Funding Source:** Public-Private Partnership
**Total Project Amount:** $${amount.toLocaleString()}
**Owner:** PPP
**Private Sector Borrowers:** Local Corp ${id}
**Project Description:**
A new ${projectType} in ${cities[index]} is facing strong opposition from local communities due to concerns over ${corruption.toLowerCase()} and potential environmental damage.
---
**Project Status:** ${statuses[id % statuses.length]}
**Start Date:** ${year - 1}-01-01
**End Date:** N/A
**Environmental Category:** Category ${['A', 'B', 'C'][id % 3]}
**Social Safeguard Categories:** Category ${['A', 'B', 'C'][(id + 1) % 3]}
**Groups in Opposition:** Concerned Citizens of ${cities[index]}, National Environmental Group
**Types of Actions:** Public protests, petitions
**Links to Actions:** https://example.com/project-${id}
**Active GAIA Support:** ${id % 2 === 0 ? 'Yes' : 'No'}
**Notes:**
The project's EIA is being disputed by independent experts.
**References:**
Local news articles, community statements.
---
**Gender Concerns:** Potential health impacts on women and children in nearby areas.
**Waste Workers:** Livelihoods of informal sector workers are threatened.
**Displacement:** Risk of economic or physical displacement for nearby residents.
`.trim()
        }
    })
];