/**
 * STENZA BEAUTY - South African Structured Location Data
 * Complete coverage of all 9 provinces, major towns/cities, and key suburbs.
 * Includes support for free-text entry if a location is not in suggestions.
 */

export interface ProvinceLocation {
  name: string;
  majorTowns: {
    name: string;
    suburbs: string[];
  }[];
}

export const SOUTH_AFRICAN_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
] as const;

export type SouthAfricanProvince = typeof SOUTH_AFRICAN_PROVINCES[number];

export const SA_LOCATIONS_DATABASE: ProvinceLocation[] = [
  {
    name: 'Eastern Cape',
    majorTowns: [
      {
        name: 'Gqeberha (Port Elizabeth)',
        suburbs: ['Walmer', 'Summerstrand', 'Mill Park', 'Humewood', 'Newton Park', 'Charlo', 'Central', 'Mount Croix']
      },
      {
        name: 'East London',
        suburbs: ['Beacon Bay', 'Nahoon', 'Berea', 'Vincent', 'Bunkers Hill', 'Stirling', 'Gonubie', 'Southernwood']
      },
      {
        name: 'Mthatha',
        suburbs: ['Fort Gale', 'Norwood', 'Southernwood', 'Ncambedlana', 'Kwelera', 'Mthatha Central']
      },
      {
        name: 'Makhanda (Grahamstown)',
        suburbs: ['Oatlands', 'Kingswood', 'Sunnyside', 'Makhanda Central', 'West Hill']
      },
      {
        name: 'Jeffreys Bay',
        suburbs: ['Wavecrest', 'Kabeljous', 'Aston Bay', 'Paradise Beach', 'Marina Martinique']
      },
      {
        name: 'Kariega (Uitenhage)',
        suburbs: ['Fairway Heights', 'Levyvale', 'Strelitzia Park', 'Winterhoek Park', 'Mosel']
      },
      {
        name: 'Komani (Queenstown)',
        suburbs: ['Sandringham', 'Top Town', 'Bergsig', 'Komani Central']
      }
    ]
  },
  {
    name: 'Free State',
    majorTowns: [
      {
        name: 'Bloemfontein',
        suburbs: ['Westdene', 'Dan Pienaar', 'Waverley', 'Bayswater', 'Universitas', 'Brandwag', 'Langenhovenpark', 'Fichardtpark']
      },
      {
        name: 'Welkom',
        suburbs: ['Riebeeckstad', 'St Helena', 'Naudeville', 'Dagbreek', 'Jim Fouchepark', 'Bedelia']
      },
      {
        name: 'Bethlehem',
        suburbs: ['Morelig', 'Panorama', 'Eureka', 'Bethlehem Central', 'Jordania']
      },
      {
        name: 'Sasolburg',
        suburbs: ['Sasolburg Central', 'Vaapark', 'Zamdela', 'Roodia']
      },
      {
        name: 'Kroonstad',
        suburbs: ['Kroonheuwel', 'Eensgevonden', 'Wilgehof', 'Kroonstad Central']
      },
      {
        name: 'Parys',
        suburbs: ['Parys Golf & Country Estate', 'Parys Central', 'Schonkenville']
      },
      {
        name: 'Harrismith',
        suburbs: ['Kings Hill', 'Wilgepark', 'Harrismith Central']
      }
    ]
  },
  {
    name: 'Gauteng',
    majorTowns: [
      {
        name: 'Johannesburg',
        suburbs: ['Rosebank', 'Sandton Central', 'Hyde Park', 'Melrose Arch', 'Parkhurst', 'Bryanston', 'Houghton', 'Melville', 'Greenside', 'Fourways', 'Waterfall City', 'Northcliff']
      },
      {
        name: 'Pretoria (Tshwane)',
        suburbs: ['Menlyn Maine', 'Brooklyn', 'Hazelwood', 'Waterkloof', 'Lynnwood', 'Hatfield', 'Faerie Glen', 'Garsfontein', 'Pretoria East', 'Arcadia', 'Centurion']
      },
      {
        name: 'Sandton',
        suburbs: ['Sandton Central', 'Morningside', 'Bryanston', 'Hyde Park', 'River Club', 'Sandhurst', 'Inanda', 'Atholl', 'Rivonia', 'Gallo Manor']
      },
      {
        name: 'Centurion',
        suburbs: ['Centurion Central', 'Eldoraigne', 'Zwartkop', 'Lyttelton', 'Irene', 'Amberfield', 'Rooihuiskraal', 'Midstream Estate']
      },
      {
        name: 'Midrand',
        suburbs: ['Waterfall City', 'Kyalami', 'Carlswald', 'Halfway House', 'Noordwyk', 'Vorna Valley', 'Blue Hills']
      },
      {
        name: 'Soweto',
        suburbs: ['Orlando West', 'Vilakazi Precinct', 'Diepkloof', 'Pimville', 'Dobsonville', 'Protea Glen', 'Jabulani']
      },
      {
        name: 'Randburg',
        suburbs: ['Ferndale', 'Blairgowrie', 'Cresta', 'Linden', 'Robindale', 'Randpark Ridge', 'Boskruin', 'North Riding']
      },
      {
        name: 'Roodepoort',
        suburbs: ['Constantia Kloof', 'Helderkruin', 'Florida', 'Weltevredenpark', 'Ruimsig', 'Little Falls']
      },
      {
        name: 'Kempton Park',
        suburbs: ['Bonaero Park', 'Aston Manor', 'Glen Marais', 'Van Riebeeck Park', 'Spartan']
      },
      {
        name: 'Benoni',
        suburbs: ['Northmead', 'Farrarmere', 'Rynfield', 'Lakefield', 'Westdene']
      }
    ]
  },
  {
    name: 'KwaZulu-Natal',
    majorTowns: [
      {
        name: 'Durban (eThekwini)',
        suburbs: ['Umhlanga Rocks', 'Umhlanga Ridge', 'Morningside', 'Florida Road', 'Durban North', 'Glenwood', 'Berea', 'Westville', 'Musgrave', 'Point Waterfront']
      },
      {
        name: 'Ballito (Dolphin Coast)',
        suburbs: ['Ballito Central', 'Zimbali Coastal Estate', 'Simbithi Eco Estate', 'Salt Rock', 'Sheffield Beach', 'Shakas Rock']
      },
      {
        name: 'Pietermaritzburg',
        suburbs: ['Clarendon', 'Wembley', 'Hayfields', 'Scottsville', 'Athlone', 'Chase Valley', 'Montrose']
      },
      {
        name: 'Richards Bay',
        suburbs: ['Meerensee', 'Arboretum', 'Birdswood', 'Veldenvlei', 'Wildenweide']
      },
      {
        name: 'Newcastle',
        suburbs: ['Hutten Heights', 'Aviary Hill', 'Pioneer Park', 'Signal Hill', 'Ncandu Park']
      },
      {
        name: 'Margate',
        suburbs: ['Margate Central', 'Ramsgate', 'Manaba Beach', 'Uvongo', 'Shelly Beach']
      },
      {
        name: 'Hillcrest & Kloof',
        suburbs: ['Kloof Central', 'Hillcrest Central', 'Gillitts', 'Winston Park', 'Krantzkloof']
      }
    ]
  },
  {
    name: 'Limpopo',
    majorTowns: [
      {
        name: 'Polokwane',
        suburbs: ['Bendor', 'Flora Park', 'Welgelegen', 'Sterpark', 'Annadale', 'Nirvana', 'Polokwane Central', 'Penina Park', 'Thornhill']
      },
      {
        name: 'Thohoyandou',
        suburbs: ['Thohoyandou Central', 'Thohoyandou Block F', 'Thohoyandou P West', 'Sibasa', 'Shayandima', 'Maniini', 'Muledane', 'Makwarela', 'Mbilwi']
      },
      {
        name: 'Tzaneen',
        suburbs: ['Aquapark', 'Flora Park Tzaneen', 'Medipark', 'Arboretum Tzaneen', 'Golden Acres', 'Georges Valley']
      },
      {
        name: 'Mokopane (Potgietersrus)',
        suburbs: ['Chroompark', 'Akasia', 'Mokopane Central', 'Piet Potgietersrust']
      },
      {
        name: 'Louis Trichardt (Makhado)',
        suburbs: ['Makhado Central', 'New Town', 'Eltivillas', 'Vondeling']
      },
      {
        name: 'Bela-Bela (Warmbaths)',
        suburbs: ['Bela-Bela Central', 'Sondela', 'Bospoort', 'Warmbaths North']
      },
      {
        name: 'Phalaborwa',
        suburbs: ['Phalaborwa Central', 'Impala Park', 'Hans Merensky Estate', 'Namakgale']
      },
      {
        name: 'Giyani',
        suburbs: ['Giyani Section A', 'Giyani Section D', 'Giyani Section E', 'Giyani Section F', 'Kremetart']
      },
      {
        name: 'Lephalale (Ellisras)',
        suburbs: ['Onverwacht', 'Lephalale Central', 'Marapong']
      },
      {
        name: 'Musina (Messina)',
        suburbs: ['Musina Central', 'Nancefield', 'Harper']
      }
    ]
  },
  {
    name: 'Mpumalanga',
    majorTowns: [
      {
        name: 'Mbombela (Nelspruit)',
        suburbs: ['West Acres', 'Sonheuwel', 'Steiltes', 'Riverside Park', 'Nelspruit Ext 2', 'Drum Rock', 'Kaapsehoop']
      },
      {
        name: 'eMalahleni (Witbank)',
        suburbs: ['Reyno Ridge', 'Model Park', 'Die Heuwel', 'Ben Fleur', 'Tasbet Park', 'Del Judor']
      },
      {
        name: 'Secunda',
        suburbs: ['Secunda Central', 'Greenhills', 'Trichardt', 'Evander']
      },
      {
        name: 'Middelburg',
        suburbs: ['Aerorand', 'Gholfsig', 'Clubville', 'Dennesig', 'Kanonkop', 'Mineralia']
      },
      {
        name: 'White River',
        suburbs: ['Coltshill', 'Kingsview', 'White River Country Estate', 'Parkville']
      },
      {
        name: 'Hazyview',
        suburbs: ['Hazyview Central', 'Numbi Gate Area', 'Sabie River Eco Estate']
      },
      {
        name: 'Barberton',
        suburbs: ['Barberton Central', 'Kaapvallei', 'General Street']
      }
    ]
  },
  {
    name: 'Northern Cape',
    majorTowns: [
      {
        name: 'Kimberley',
        suburbs: ['Monument Heights', 'Royldene', 'Hadison Park', 'Belgravia', 'Hillcrest', 'Carters Glen', 'Labram']
      },
      {
        name: 'Upington',
        suburbs: ['Olyvenhoutsdrift', 'Keidebees', 'Rosedale', 'Upington Central', 'Middlerus']
      },
      {
        name: 'Springbok',
        suburbs: ['Springbok Central', 'Bergsig', 'Matjieskloof']
      },
      {
        name: 'Kuruman',
        suburbs: ['Kuruman Central', 'Seoding', 'Mothibistad']
      },
      {
        name: 'Kathu',
        suburbs: ['Kathu Central', 'Sisal', 'Bestwood']
      },
      {
        name: 'De Aar',
        suburbs: ['De Aar Central', 'Nonzwakazi', 'Sunrise']
      }
    ]
  },
  {
    name: 'North West',
    majorTowns: [
      {
        name: 'Rustenburg',
        suburbs: ['Cashan', 'Safari Gardens', 'Protea Park', 'Geelhoutpark', 'Waterval', 'Waterfall East', 'Bo-Dorp']
      },
      {
        name: 'Potchefstroom',
        suburbs: ['Bult', 'Baillie Park', 'Grimbeek Park', 'Van der Hoff Park', 'Miederpark', 'Dassie-rand']
      },
      {
        name: 'Klerksdorp (Matlosana)',
        suburbs: ['Wilkoppies', 'Flamwood', 'Irene Park', 'Doringkruin', 'Meiringspark', 'La Hoff']
      },
      {
        name: 'Mahikeng (Mafikeng)',
        suburbs: ['Golf View', 'Riviera', 'Rooigrond', 'Montshiwa', 'Mmabatho Unit 5', 'Imperial Reserve']
      },
      {
        name: 'Brits',
        suburbs: ['Brits Central', 'Elandsrand', 'Damonsville', 'Primindia']
      },
      {
        name: 'Hartbeespoort',
        suburbs: ['Meerhof', 'Melodie', 'Schoemansville', 'Kosmos', 'Pecanwood Estate', 'IFA Islands']
      }
    ]
  },
  {
    name: 'Western Cape',
    majorTowns: [
      {
        name: 'Cape Town',
        suburbs: ['Camps Bay', 'V&A Waterfront', 'Sea Point', 'Green Point', 'Claremont', 'Rondebosch', 'Constantia', 'Kloof Street', 'Gardens', 'Tamboerskloof', 'Century City', 'Durbanville']
      },
      {
        name: 'Stellenbosch',
        suburbs: ['Die Boord', 'Rozendal', 'Dalsig', 'Mostertsdrift', 'Paradyskloof', 'Krigeville', 'Brandwacht']
      },
      {
        name: 'Somerset West & Strand',
        suburbs: ['Helderberg', 'Spanish Farm', 'Audas Estate', 'Bakkershoogte', 'Greenways', 'Strand North']
      },
      {
        name: 'George (Garden Route)',
        suburbs: ['Heatherlands', 'Glen Barrie', 'Brummelia', 'Fernridge', 'Eden', 'Victoria Bay Area']
      },
      {
        name: 'Hermanus',
        suburbs: ['Eastcliff', 'Voelklip', 'Westcliff', 'Fernkloof', 'Kwaaiwater', 'Onrus']
      },
      {
        name: 'Knysna',
        suburbs: ['The Heads', 'Brenton on Sea', 'Belvidere', 'Hunters Home', 'Simola']
      },
      {
        name: 'Paarl',
        suburbs: ['Courtrai', 'Lemoenkloof', 'Hoog-en-Droog', 'Klein Parys', 'Boschenmeer']
      },
      {
        name: 'Franschhoek',
        suburbs: ['Franschhoek Central', 'La Cabriere', 'Mooikelder', 'Robertsvlei']
      }
    ]
  }
];

/**
 * Helper: Retrieve all South African provinces
 */
export function getProvinces(): string[] {
  return [...SOUTH_AFRICAN_PROVINCES];
}

/**
 * Helper: Retrieve towns for a given province
 */
export function getTownsForProvince(provinceName: string): string[] {
  if (!provinceName) return [];
  const prov = SA_LOCATIONS_DATABASE.find(
    (p) => p.name.toLowerCase().trim() === provinceName.toLowerCase().trim()
  );
  return prov ? prov.majorTowns.map((t) => t.name) : [];
}

/**
 * Helper: Retrieve suburbs for a town in a given province
 */
export function getSuburbsForTown(provinceOrTown: string, optionalTown?: string): string[] {
  const provinceName = optionalTown ? provinceOrTown : '';
  const townName = optionalTown ? optionalTown : provinceOrTown;

  if (!townName) return [];
  const cleanTown = townName.toLowerCase().trim();

  if (provinceName) {
    const prov = SA_LOCATIONS_DATABASE.find(
      (p) => p.name.toLowerCase().trim() === provinceName.toLowerCase().trim()
    );
    if (prov) {
      const town = prov.majorTowns.find((t) => 
        t.name.toLowerCase().includes(cleanTown) || cleanTown.includes(t.name.toLowerCase())
      );
      if (town) return [...town.suburbs];
    }
  }

  // If province not provided or not matched, search across all provinces
  for (const prov of SA_LOCATIONS_DATABASE) {
    const town = prov.majorTowns.find((t) => 
      t.name.toLowerCase().includes(cleanTown) || cleanTown.includes(t.name.toLowerCase())
    );
    if (town) return [...town.suburbs];
  }

  return [];
}

/**
 * Helper: Formats studio location for clean public display
 * Example: "Thohoyandou, Limpopo" or "Rosebank, Johannesburg, Gauteng"
 */
export function formatStudioDisplayLocation(
  province?: string, 
  cityOrTown?: string, 
  suburb?: string
): string {
  const parts: string[] = [];
  if (suburb && suburb.trim() && suburb.trim() !== cityOrTown?.trim()) {
    parts.push(suburb.trim());
  }
  if (cityOrTown && cityOrTown.trim()) {
    // Strip parenthetical notes like "(Tshwane)" for cleaner display if desired
    parts.push(cityOrTown.trim().replace(/\s*\(.*?\)/g, ''));
  }
  if (province && province.trim()) {
    parts.push(province.trim());
  }
  return parts.length > 0 ? parts.join(', ') : 'South Africa';
}
