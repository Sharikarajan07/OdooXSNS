// ==================== TRAVEL DATA ====================
// Structured as: Countries → Stops (Famous Places) → Activities

export interface Country {
  id: string
  name: string
  code: string
  image: string
  description: string
  region: string
}

export interface TravelStop {
  id: string
  countryId: string
  name: string
  image: string
  description: string
  costPerDay: number
  bestTimeToVisit: string
  popularityRank: number
}

export interface StopActivity {
  id: string
  stopId: string
  name: string
  category: 'Adventure' | 'Culture' | 'Food' | 'Relaxation' | 'Nature' | 'Shopping' | 'Nightlife'
  description: string
  image: string
  cost: number
  duration: number // in minutes
  rating: number
  isSuggested: boolean
}

// ==================== 10 FAMOUS TRAVEL COUNTRIES ====================
export const countries: Country[] = [
  {
    id: "country-1",
    name: "Japan",
    code: "JP",
    image: "/kyoto-street.png",
    description: "A fascinating blend of ancient traditions and cutting-edge technology.",
    region: "Asia"
  },
  {
    id: "country-2",
    name: "Italy",
    code: "IT",
    image: "/amalfi-coast.jpg",
    description: "Home to Renaissance art, ancient ruins, and world-renowned cuisine.",
    region: "Europe"
  },
  {
    id: "country-3",
    name: "France",
    code: "FR",
    image: "/paris-eiffel-tower.png",
    description: "The country of romance, art, fashion, and exquisite gastronomy.",
    region: "Europe"
  },
  {
    id: "country-4",
    name: "Greece",
    code: "GR",
    image: "/santorini-village.png",
    description: "Cradle of Western civilization with stunning islands and ancient wonders.",
    region: "Europe"
  },
  {
    id: "country-5",
    name: "Thailand",
    code: "TH",
    image: "/bali-beach.png",
    description: "Land of golden temples, tropical beaches, and incredible street food.",
    region: "Asia"
  },
  {
    id: "country-6",
    name: "Indonesia",
    code: "ID",
    image: "/bali-beach.png",
    description: "Tropical paradise with diverse cultures, volcanoes, and pristine beaches.",
    region: "Asia"
  },
  {
    id: "country-7",
    name: "Spain",
    code: "ES",
    image: "/beautiful-travel-destination-landscape.jpg",
    description: "Vibrant culture, stunning architecture, and passionate flamenco.",
    region: "Europe"
  },
  {
    id: "country-8",
    name: "USA",
    code: "US",
    image: "/nyc-skyline.png",
    description: "From bustling cities to breathtaking national parks.",
    region: "North America"
  },
  {
    id: "country-9",
    name: "Australia",
    code: "AU",
    image: "/beautiful-travel-destination-landscape.jpg",
    description: "Unique wildlife, stunning coastlines, and the iconic Outback.",
    region: "Oceania"
  },
  {
    id: "country-10",
    name: "Peru",
    code: "PE",
    image: "/machu-picchu-ancient-city.png",
    description: "Ancient Incan heritage, Amazon rainforest, and Andean peaks.",
    region: "South America"
  }
]

// ==================== STOPS PER COUNTRY (10 each) ====================
export const travelStops: TravelStop[] = [
  // JAPAN - 10 Stops
  { id: "stop-jp-1", countryId: "country-1", name: "Tokyo", image: "/kyoto-street.png", description: "Ultra-modern metropolis with ancient temples and incredible food scene.", costPerDay: 150, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 1 },
  { id: "stop-jp-2", countryId: "country-1", name: "Kyoto", image: "/kyoto-street.png", description: "Ancient capital with over 2000 temples and traditional geisha districts.", costPerDay: 120, bestTimeToVisit: "March-May, Oct-Nov", popularityRank: 2 },
  { id: "stop-jp-3", countryId: "country-1", name: "Osaka", image: "/kyoto-street.png", description: "Japan's kitchen, known for street food and vibrant nightlife.", costPerDay: 100, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 3 },
  { id: "stop-jp-4", countryId: "country-1", name: "Hiroshima", image: "/kyoto-street.png", description: "City of peace with powerful memorials and nearby Miyajima Island.", costPerDay: 90, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 4 },
  { id: "stop-jp-5", countryId: "country-1", name: "Nara", image: "/kyoto-street.png", description: "Ancient city famous for friendly deer and giant Buddha statue.", costPerDay: 80, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 5 },
  { id: "stop-jp-6", countryId: "country-1", name: "Hakone", image: "/kyoto-street.png", description: "Mountain resort with hot springs and views of Mt. Fuji.", costPerDay: 130, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 6 },
  { id: "stop-jp-7", countryId: "country-1", name: "Nikko", image: "/kyoto-street.png", description: "UNESCO World Heritage shrines surrounded by mountains.", costPerDay: 100, bestTimeToVisit: "May-Nov", popularityRank: 7 },
  { id: "stop-jp-8", countryId: "country-1", name: "Kanazawa", image: "/kyoto-street.png", description: "Well-preserved Edo-era districts and stunning gardens.", costPerDay: 95, bestTimeToVisit: "April-Nov", popularityRank: 8 },
  { id: "stop-jp-9", countryId: "country-1", name: "Takayama", image: "/kyoto-street.png", description: "Traditional mountain town with old merchant houses.", costPerDay: 85, bestTimeToVisit: "April-Oct", popularityRank: 9 },
  { id: "stop-jp-10", countryId: "country-1", name: "Okinawa", image: "/bali-beach.png", description: "Tropical islands with unique culture and beautiful beaches.", costPerDay: 110, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 10 },

  // ITALY - 10 Stops
  { id: "stop-it-1", countryId: "country-2", name: "Rome", image: "/amalfi-coast.jpg", description: "The Eternal City with ancient ruins, Vatican, and vibrant piazzas.", costPerDay: 140, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 1 },
  { id: "stop-it-2", countryId: "country-2", name: "Florence", image: "/amalfi-coast.jpg", description: "Renaissance art capital with stunning architecture and Tuscan cuisine.", costPerDay: 130, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 2 },
  { id: "stop-it-3", countryId: "country-2", name: "Venice", image: "/amalfi-coast.jpg", description: "Romantic canal city with gondolas and magnificent palaces.", costPerDay: 160, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 3 },
  { id: "stop-it-4", countryId: "country-2", name: "Amalfi Coast", image: "/amalfi-coast.jpg", description: "Dramatic cliffside villages with stunning Mediterranean views.", costPerDay: 180, bestTimeToVisit: "May-Sep", popularityRank: 4 },
  { id: "stop-it-5", countryId: "country-2", name: "Cinque Terre", image: "/amalfi-coast.jpg", description: "Five colorful coastal villages connected by scenic hiking trails.", costPerDay: 120, bestTimeToVisit: "April-Oct", popularityRank: 5 },
  { id: "stop-it-6", countryId: "country-2", name: "Milan", image: "/amalfi-coast.jpg", description: "Fashion and design capital with Gothic Duomo and world-class shopping.", costPerDay: 150, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 6 },
  { id: "stop-it-7", countryId: "country-2", name: "Naples", image: "/amalfi-coast.jpg", description: "Vibrant city famous for pizza, with Pompeii nearby.", costPerDay: 90, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 7 },
  { id: "stop-it-8", countryId: "country-2", name: "Sicily", image: "/amalfi-coast.jpg", description: "Largest Mediterranean island with Greek temples and Mt. Etna.", costPerDay: 100, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 8 },
  { id: "stop-it-9", countryId: "country-2", name: "Lake Como", image: "/amalfi-coast.jpg", description: "Stunning Alpine lake surrounded by elegant villas.", costPerDay: 170, bestTimeToVisit: "May-Sep", popularityRank: 9 },
  { id: "stop-it-10", countryId: "country-2", name: "Tuscany", image: "/amalfi-coast.jpg", description: "Rolling hills, vineyards, and medieval hilltop towns.", costPerDay: 130, bestTimeToVisit: "April-Oct", popularityRank: 10 },

  // FRANCE - 10 Stops
  { id: "stop-fr-1", countryId: "country-3", name: "Paris", image: "/paris-eiffel-tower.png", description: "City of Light with iconic landmarks, museums, and cafe culture.", costPerDay: 180, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 1 },
  { id: "stop-fr-2", countryId: "country-3", name: "Nice", image: "/paris-eiffel-tower.png", description: "French Riviera gem with stunning beaches and old town charm.", costPerDay: 150, bestTimeToVisit: "May-Sep", popularityRank: 2 },
  { id: "stop-fr-3", countryId: "country-3", name: "Lyon", image: "/paris-eiffel-tower.png", description: "Gastronomic capital of France with Roman ruins.", costPerDay: 120, bestTimeToVisit: "April-Oct", popularityRank: 3 },
  { id: "stop-fr-4", countryId: "country-3", name: "Provence", image: "/paris-eiffel-tower.png", description: "Lavender fields, Roman ruins, and charming villages.", costPerDay: 130, bestTimeToVisit: "June-Aug", popularityRank: 4 },
  { id: "stop-fr-5", countryId: "country-3", name: "Bordeaux", image: "/paris-eiffel-tower.png", description: "World-famous wine region with elegant 18th-century architecture.", costPerDay: 140, bestTimeToVisit: "May-Oct", popularityRank: 5 },
  { id: "stop-fr-6", countryId: "country-3", name: "Mont Saint-Michel", image: "/paris-eiffel-tower.png", description: "Magical island abbey rising from tidal flats.", costPerDay: 110, bestTimeToVisit: "May-Sep", popularityRank: 6 },
  { id: "stop-fr-7", countryId: "country-3", name: "Strasbourg", image: "/paris-eiffel-tower.png", description: "Franco-German city with half-timbered houses and Gothic cathedral.", costPerDay: 100, bestTimeToVisit: "April-Oct, December", popularityRank: 7 },
  { id: "stop-fr-8", countryId: "country-3", name: "Loire Valley", image: "/paris-eiffel-tower.png", description: "Fairy-tale châteaux and renowned vineyards.", costPerDay: 120, bestTimeToVisit: "April-Oct", popularityRank: 8 },
  { id: "stop-fr-9", countryId: "country-3", name: "Marseille", image: "/paris-eiffel-tower.png", description: "Historic port city with diverse culture and stunning calanques.", costPerDay: 110, bestTimeToVisit: "May-Sep", popularityRank: 9 },
  { id: "stop-fr-10", countryId: "country-3", name: "Chamonix", image: "/paris-eiffel-tower.png", description: "Alpine resort town at the base of Mont Blanc.", costPerDay: 160, bestTimeToVisit: "Dec-April, June-Sep", popularityRank: 10 },

  // GREECE - 10 Stops
  { id: "stop-gr-1", countryId: "country-4", name: "Santorini", image: "/santorini-village.png", description: "Iconic white-washed villages with stunning caldera views.", costPerDay: 180, bestTimeToVisit: "April-Oct", popularityRank: 1 },
  { id: "stop-gr-2", countryId: "country-4", name: "Athens", image: "/santorini-village.png", description: "Ancient capital with the Acropolis and vibrant neighborhoods.", costPerDay: 100, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 2 },
  { id: "stop-gr-3", countryId: "country-4", name: "Mykonos", image: "/santorini-village.png", description: "Famous party island with beautiful beaches and windmills.", costPerDay: 200, bestTimeToVisit: "May-Sep", popularityRank: 3 },
  { id: "stop-gr-4", countryId: "country-4", name: "Crete", image: "/santorini-village.png", description: "Largest Greek island with ancient palaces and diverse landscapes.", costPerDay: 90, bestTimeToVisit: "April-Oct", popularityRank: 4 },
  { id: "stop-gr-5", countryId: "country-4", name: "Rhodes", image: "/santorini-village.png", description: "Medieval old town and beautiful beaches.", costPerDay: 100, bestTimeToVisit: "May-Oct", popularityRank: 5 },
  { id: "stop-gr-6", countryId: "country-4", name: "Corfu", image: "/santorini-village.png", description: "Green island with Venetian old town and stunning beaches.", costPerDay: 110, bestTimeToVisit: "May-Sep", popularityRank: 6 },
  { id: "stop-gr-7", countryId: "country-4", name: "Meteora", image: "/santorini-village.png", description: "Monasteries perched atop dramatic rock pillars.", costPerDay: 80, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 7 },
  { id: "stop-gr-8", countryId: "country-4", name: "Delphi", image: "/santorini-village.png", description: "Ancient sanctuary and oracle site in mountain setting.", costPerDay: 70, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 8 },
  { id: "stop-gr-9", countryId: "country-4", name: "Zakynthos", image: "/santorini-village.png", description: "Island famous for Shipwreck Beach and blue caves.", costPerDay: 120, bestTimeToVisit: "May-Sep", popularityRank: 9 },
  { id: "stop-gr-10", countryId: "country-4", name: "Thessaloniki", image: "/santorini-village.png", description: "Cultural hub with Byzantine churches and vibrant nightlife.", costPerDay: 85, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 10 },

  // THAILAND - 10 Stops
  { id: "stop-th-1", countryId: "country-5", name: "Bangkok", image: "/bali-beach.png", description: "Bustling capital with ornate temples and legendary street food.", costPerDay: 50, bestTimeToVisit: "Nov-Feb", popularityRank: 1 },
  { id: "stop-th-2", countryId: "country-5", name: "Phuket", image: "/bali-beach.png", description: "Tropical island with beautiful beaches and vibrant nightlife.", costPerDay: 80, bestTimeToVisit: "Nov-April", popularityRank: 2 },
  { id: "stop-th-3", countryId: "country-5", name: "Chiang Mai", image: "/bali-beach.png", description: "Cultural city with ancient temples and mountain trekking.", costPerDay: 40, bestTimeToVisit: "Nov-Feb", popularityRank: 3 },
  { id: "stop-th-4", countryId: "country-5", name: "Krabi", image: "/bali-beach.png", description: "Dramatic limestone cliffs and island-hopping adventures.", costPerDay: 60, bestTimeToVisit: "Nov-April", popularityRank: 4 },
  { id: "stop-th-5", countryId: "country-5", name: "Koh Samui", image: "/bali-beach.png", description: "Palm-fringed island with luxury resorts and waterfalls.", costPerDay: 90, bestTimeToVisit: "Dec-April", popularityRank: 5 },
  { id: "stop-th-6", countryId: "country-5", name: "Ayutthaya", image: "/bali-beach.png", description: "Ancient capital with impressive temple ruins.", costPerDay: 35, bestTimeToVisit: "Nov-Feb", popularityRank: 6 },
  { id: "stop-th-7", countryId: "country-5", name: "Pai", image: "/bali-beach.png", description: "Bohemian mountain town with hot springs and canyons.", costPerDay: 30, bestTimeToVisit: "Nov-Feb", popularityRank: 7 },
  { id: "stop-th-8", countryId: "country-5", name: "Koh Phi Phi", image: "/bali-beach.png", description: "Stunning islands made famous by 'The Beach' movie.", costPerDay: 70, bestTimeToVisit: "Nov-April", popularityRank: 8 },
  { id: "stop-th-9", countryId: "country-5", name: "Chiang Rai", image: "/bali-beach.png", description: "Home to the stunning White Temple and Golden Triangle.", costPerDay: 35, bestTimeToVisit: "Nov-Feb", popularityRank: 9 },
  { id: "stop-th-10", countryId: "country-5", name: "Kanchanaburi", image: "/bali-beach.png", description: "River Kwai bridge and jungle adventures.", costPerDay: 40, bestTimeToVisit: "Nov-Feb", popularityRank: 10 },

  // INDONESIA - 10 Stops
  { id: "stop-id-1", countryId: "country-6", name: "Bali", image: "/bali-beach.png", description: "Island of Gods with temples, rice terraces, and beaches.", costPerDay: 60, bestTimeToVisit: "April-Oct", popularityRank: 1 },
  { id: "stop-id-2", countryId: "country-6", name: "Ubud", image: "/bali-beach.png", description: "Cultural heart of Bali with art galleries and monkey forest.", costPerDay: 50, bestTimeToVisit: "April-Oct", popularityRank: 2 },
  { id: "stop-id-3", countryId: "country-6", name: "Gili Islands", image: "/bali-beach.png", description: "Car-free paradise islands with crystal-clear waters.", costPerDay: 55, bestTimeToVisit: "April-Oct", popularityRank: 3 },
  { id: "stop-id-4", countryId: "country-6", name: "Komodo", image: "/bali-beach.png", description: "Home of the famous Komodo dragons and pink beaches.", costPerDay: 80, bestTimeToVisit: "April-Dec", popularityRank: 4 },
  { id: "stop-id-5", countryId: "country-6", name: "Yogyakarta", image: "/bali-beach.png", description: "Cultural capital with Borobudur and Prambanan temples.", costPerDay: 35, bestTimeToVisit: "April-Oct", popularityRank: 5 },
  { id: "stop-id-6", countryId: "country-6", name: "Raja Ampat", image: "/bali-beach.png", description: "World-class diving with incredible marine biodiversity.", costPerDay: 150, bestTimeToVisit: "Oct-April", popularityRank: 6 },
  { id: "stop-id-7", countryId: "country-6", name: "Lombok", image: "/bali-beach.png", description: "Quieter alternative to Bali with stunning beaches.", costPerDay: 45, bestTimeToVisit: "April-Oct", popularityRank: 7 },
  { id: "stop-id-8", countryId: "country-6", name: "Nusa Penida", image: "/bali-beach.png", description: "Dramatic cliffs and Instagram-famous viewpoints.", costPerDay: 50, bestTimeToVisit: "April-Oct", popularityRank: 8 },
  { id: "stop-id-9", countryId: "country-6", name: "Jakarta", image: "/bali-beach.png", description: "Bustling capital with museums and diverse food scene.", costPerDay: 60, bestTimeToVisit: "May-Sep", popularityRank: 9 },
  { id: "stop-id-10", countryId: "country-6", name: "Flores", image: "/bali-beach.png", description: "Volcanic island with traditional villages and Kelimutu lakes.", costPerDay: 40, bestTimeToVisit: "April-Nov", popularityRank: 10 },

  // SPAIN - 10 Stops
  { id: "stop-es-1", countryId: "country-7", name: "Barcelona", image: "/beautiful-travel-destination-landscape.jpg", description: "Gaudí's masterpieces, beaches, and vibrant culture.", costPerDay: 130, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 1 },
  { id: "stop-es-2", countryId: "country-7", name: "Madrid", image: "/beautiful-travel-destination-landscape.jpg", description: "World-class museums, tapas bars, and lively nightlife.", costPerDay: 110, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 2 },
  { id: "stop-es-3", countryId: "country-7", name: "Seville", image: "/beautiful-travel-destination-landscape.jpg", description: "Flamenco heartland with stunning Moorish architecture.", costPerDay: 90, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 3 },
  { id: "stop-es-4", countryId: "country-7", name: "Granada", image: "/beautiful-travel-destination-landscape.jpg", description: "Home of the magnificent Alhambra palace.", costPerDay: 80, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 4 },
  { id: "stop-es-5", countryId: "country-7", name: "San Sebastián", image: "/beautiful-travel-destination-landscape.jpg", description: "Culinary capital with beautiful beaches.", costPerDay: 140, bestTimeToVisit: "June-Sep", popularityRank: 5 },
  { id: "stop-es-6", countryId: "country-7", name: "Ibiza", image: "/beautiful-travel-destination-landscape.jpg", description: "Famous party island with beautiful coves.", costPerDay: 150, bestTimeToVisit: "May-Oct", popularityRank: 6 },
  { id: "stop-es-7", countryId: "country-7", name: "Valencia", image: "/beautiful-travel-destination-landscape.jpg", description: "Birthplace of paella with futuristic architecture.", costPerDay: 90, bestTimeToVisit: "March-June, Sep-Nov", popularityRank: 7 },
  { id: "stop-es-8", countryId: "country-7", name: "Mallorca", image: "/beautiful-travel-destination-landscape.jpg", description: "Mediterranean island with beaches and mountain villages.", costPerDay: 120, bestTimeToVisit: "May-Sep", popularityRank: 8 },
  { id: "stop-es-9", countryId: "country-7", name: "Toledo", image: "/beautiful-travel-destination-landscape.jpg", description: "Medieval walled city with rich history.", costPerDay: 70, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 9 },
  { id: "stop-es-10", countryId: "country-7", name: "Bilbao", image: "/beautiful-travel-destination-landscape.jpg", description: "Guggenheim Museum and Basque cuisine.", costPerDay: 100, bestTimeToVisit: "May-Sep", popularityRank: 10 },

  // USA - 10 Stops
  { id: "stop-us-1", countryId: "country-8", name: "New York City", image: "/nyc-skyline.png", description: "The city that never sleeps with iconic landmarks.", costPerDay: 250, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 1 },
  { id: "stop-us-2", countryId: "country-8", name: "Los Angeles", image: "/nyc-skyline.png", description: "Hollywood, beaches, and endless entertainment.", costPerDay: 200, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 2 },
  { id: "stop-us-3", countryId: "country-8", name: "San Francisco", image: "/nyc-skyline.png", description: "Golden Gate Bridge, cable cars, and diverse neighborhoods.", costPerDay: 220, bestTimeToVisit: "Sep-Nov", popularityRank: 3 },
  { id: "stop-us-4", countryId: "country-8", name: "Las Vegas", image: "/nyc-skyline.png", description: "Entertainment capital with casinos and shows.", costPerDay: 180, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 4 },
  { id: "stop-us-5", countryId: "country-8", name: "Grand Canyon", image: "/nyc-skyline.png", description: "Awe-inspiring natural wonder of the world.", costPerDay: 100, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 5 },
  { id: "stop-us-6", countryId: "country-8", name: "Miami", image: "/nyc-skyline.png", description: "Art Deco architecture, beaches, and Cuban culture.", costPerDay: 180, bestTimeToVisit: "Dec-May", popularityRank: 6 },
  { id: "stop-us-7", countryId: "country-8", name: "Hawaii", image: "/bali-beach.png", description: "Tropical paradise with volcanoes and pristine beaches.", costPerDay: 220, bestTimeToVisit: "April-June, Sep-Nov", popularityRank: 7 },
  { id: "stop-us-8", countryId: "country-8", name: "New Orleans", image: "/nyc-skyline.png", description: "Jazz, Cajun cuisine, and French Quarter charm.", costPerDay: 140, bestTimeToVisit: "Feb-May", popularityRank: 8 },
  { id: "stop-us-9", countryId: "country-8", name: "Yellowstone", image: "/nyc-skyline.png", description: "First national park with geysers and wildlife.", costPerDay: 120, bestTimeToVisit: "May-Sep", popularityRank: 9 },
  { id: "stop-us-10", countryId: "country-8", name: "Chicago", image: "/nyc-skyline.png", description: "Stunning architecture, deep-dish pizza, and lakefront.", costPerDay: 170, bestTimeToVisit: "April-June, Sep-Oct", popularityRank: 10 },

  // AUSTRALIA - 10 Stops
  { id: "stop-au-1", countryId: "country-9", name: "Sydney", image: "/beautiful-travel-destination-landscape.jpg", description: "Iconic Opera House and stunning harbor.", costPerDay: 180, bestTimeToVisit: "Sep-Nov, March-May", popularityRank: 1 },
  { id: "stop-au-2", countryId: "country-9", name: "Melbourne", image: "/beautiful-travel-destination-landscape.jpg", description: "Cultural capital with laneways and coffee culture.", costPerDay: 160, bestTimeToVisit: "March-May, Sep-Nov", popularityRank: 2 },
  { id: "stop-au-3", countryId: "country-9", name: "Great Barrier Reef", image: "/bali-beach.png", description: "World's largest coral reef system.", costPerDay: 200, bestTimeToVisit: "June-Oct", popularityRank: 3 },
  { id: "stop-au-4", countryId: "country-9", name: "Uluru", image: "/beautiful-travel-destination-landscape.jpg", description: "Sacred red rock in the heart of the Outback.", costPerDay: 150, bestTimeToVisit: "May-Sep", popularityRank: 4 },
  { id: "stop-au-5", countryId: "country-9", name: "Gold Coast", image: "/bali-beach.png", description: "Famous surf beaches and theme parks.", costPerDay: 140, bestTimeToVisit: "April-Oct", popularityRank: 5 },
  { id: "stop-au-6", countryId: "country-9", name: "Cairns", image: "/bali-beach.png", description: "Gateway to the Great Barrier Reef and rainforest.", costPerDay: 130, bestTimeToVisit: "May-Oct", popularityRank: 6 },
  { id: "stop-au-7", countryId: "country-9", name: "Tasmania", image: "/beautiful-travel-destination-landscape.jpg", description: "Wilderness island with unique wildlife.", costPerDay: 140, bestTimeToVisit: "Dec-Feb", popularityRank: 7 },
  { id: "stop-au-8", countryId: "country-9", name: "Great Ocean Road", image: "/beautiful-travel-destination-landscape.jpg", description: "Scenic coastal drive with the Twelve Apostles.", costPerDay: 120, bestTimeToVisit: "Dec-Feb", popularityRank: 8 },
  { id: "stop-au-9", countryId: "country-9", name: "Perth", image: "/beautiful-travel-destination-landscape.jpg", description: "Sunny city with beautiful beaches and nearby wineries.", costPerDay: 140, bestTimeToVisit: "Sep-Nov", popularityRank: 9 },
  { id: "stop-au-10", countryId: "country-9", name: "Blue Mountains", image: "/beautiful-travel-destination-landscape.jpg", description: "Dramatic cliffs and eucalyptus forests near Sydney.", costPerDay: 100, bestTimeToVisit: "Sep-Nov, March-May", popularityRank: 10 },

  // PERU - 10 Stops
  { id: "stop-pe-1", countryId: "country-10", name: "Machu Picchu", image: "/machu-picchu-ancient-city.png", description: "Ancient Incan citadel in the clouds.", costPerDay: 120, bestTimeToVisit: "April-Oct", popularityRank: 1 },
  { id: "stop-pe-2", countryId: "country-10", name: "Cusco", image: "/machu-picchu-ancient-city.png", description: "Ancient Incan capital with colonial architecture.", costPerDay: 60, bestTimeToVisit: "April-Oct", popularityRank: 2 },
  { id: "stop-pe-3", countryId: "country-10", name: "Lima", image: "/machu-picchu-ancient-city.png", description: "Capital city renowned for world-class gastronomy.", costPerDay: 80, bestTimeToVisit: "Dec-April", popularityRank: 3 },
  { id: "stop-pe-4", countryId: "country-10", name: "Sacred Valley", image: "/machu-picchu-ancient-city.png", description: "Incan ruins and traditional markets.", costPerDay: 70, bestTimeToVisit: "April-Oct", popularityRank: 4 },
  { id: "stop-pe-5", countryId: "country-10", name: "Lake Titicaca", image: "/machu-picchu-ancient-city.png", description: "Highest navigable lake with floating islands.", costPerDay: 50, bestTimeToVisit: "May-Oct", popularityRank: 5 },
  { id: "stop-pe-6", countryId: "country-10", name: "Arequipa", image: "/machu-picchu-ancient-city.png", description: "White stone colonial city near Colca Canyon.", costPerDay: 55, bestTimeToVisit: "April-Dec", popularityRank: 6 },
  { id: "stop-pe-7", countryId: "country-10", name: "Nazca Lines", image: "/machu-picchu-ancient-city.png", description: "Mysterious ancient geoglyphs in the desert.", costPerDay: 80, bestTimeToVisit: "Year-round", popularityRank: 7 },
  { id: "stop-pe-8", countryId: "country-10", name: "Amazon Rainforest", image: "/machu-picchu-ancient-city.png", description: "Incredible biodiversity in the jungle.", costPerDay: 150, bestTimeToVisit: "April-Oct", popularityRank: 8 },
  { id: "stop-pe-9", countryId: "country-10", name: "Colca Canyon", image: "/machu-picchu-ancient-city.png", description: "One of the world's deepest canyons with condors.", costPerDay: 60, bestTimeToVisit: "April-Dec", popularityRank: 9 },
  { id: "stop-pe-10", countryId: "country-10", name: "Rainbow Mountain", image: "/machu-picchu-ancient-city.png", description: "Stunning multicolored mountain at high altitude.", costPerDay: 40, bestTimeToVisit: "April-Nov", popularityRank: 10 }
]

// ==================== ACTIVITIES PER STOP ====================
export const stopActivities: StopActivity[] = [
  // Tokyo Activities
  { id: "act-jp-1-1", stopId: "stop-jp-1", name: "Visit Senso-ji Temple", category: "Culture", description: "Tokyo's oldest and most famous Buddhist temple in Asakusa.", image: "/kyoto-street.png", cost: 0, duration: 120, rating: 4.8, isSuggested: true },
  { id: "act-jp-1-2", stopId: "stop-jp-1", name: "Shibuya Crossing Experience", category: "Culture", description: "Walk across the world's busiest pedestrian crossing.", image: "/kyoto-street.png", cost: 0, duration: 60, rating: 4.6, isSuggested: true },
  { id: "act-jp-1-3", stopId: "stop-jp-1", name: "Tsukiji Fish Market Tour", category: "Food", description: "Experience fresh sushi and seafood at the outer market.", image: "/cooking-class.png", cost: 50, duration: 180, rating: 4.9, isSuggested: true },
  { id: "act-jp-1-4", stopId: "stop-jp-1", name: "Tokyo Skytree Visit", category: "Culture", description: "See panoramic views from Japan's tallest structure.", image: "/kyoto-street.png", cost: 25, duration: 120, rating: 4.5, isSuggested: false },
  { id: "act-jp-1-5", stopId: "stop-jp-1", name: "Ramen Tasting Tour", category: "Food", description: "Sample various styles of ramen across the city.", image: "/cooking-class.png", cost: 40, duration: 180, rating: 4.8, isSuggested: false },
  { id: "act-jp-1-6", stopId: "stop-jp-1", name: "Harajuku Fashion Walk", category: "Shopping", description: "Explore Tokyo's quirky fashion district.", image: "/kyoto-street.png", cost: 0, duration: 150, rating: 4.4, isSuggested: false },

  // Kyoto Activities
  { id: "act-jp-2-1", stopId: "stop-jp-2", name: "Fushimi Inari Shrine", category: "Culture", description: "Walk through thousands of vermillion torii gates.", image: "/kyoto-street.png", cost: 0, duration: 180, rating: 4.9, isSuggested: true },
  { id: "act-jp-2-2", stopId: "stop-jp-2", name: "Arashiyama Bamboo Grove", category: "Nature", description: "Stroll through the iconic bamboo forest.", image: "/kyoto-street.png", cost: 0, duration: 120, rating: 4.7, isSuggested: true },
  { id: "act-jp-2-3", stopId: "stop-jp-2", name: "Geisha District Evening Walk", category: "Culture", description: "Explore Gion and spot geishas in traditional attire.", image: "/kyoto-street.png", cost: 0, duration: 120, rating: 4.6, isSuggested: true },
  { id: "act-jp-2-4", stopId: "stop-jp-2", name: "Traditional Tea Ceremony", category: "Culture", description: "Experience authentic Japanese tea culture.", image: "/cooking-class.png", cost: 35, duration: 90, rating: 4.8, isSuggested: false },
  { id: "act-jp-2-5", stopId: "stop-jp-2", name: "Kinkaku-ji Golden Pavilion", category: "Culture", description: "Visit the stunning gold-leaf covered temple.", image: "/kyoto-street.png", cost: 5, duration: 90, rating: 4.7, isSuggested: false },

  // Paris Activities
  { id: "act-fr-1-1", stopId: "stop-fr-1", name: "Eiffel Tower Visit", category: "Culture", description: "Ascend the iconic iron tower for panoramic views.", image: "/paris-eiffel-tower.png", cost: 30, duration: 180, rating: 4.8, isSuggested: true },
  { id: "act-fr-1-2", stopId: "stop-fr-1", name: "Louvre Museum Tour", category: "Culture", description: "See the Mona Lisa and ancient Egyptian artifacts.", image: "/museum-tour.png", cost: 20, duration: 240, rating: 4.9, isSuggested: true },
  { id: "act-fr-1-3", stopId: "stop-fr-1", name: "Seine River Cruise", category: "Relaxation", description: "Cruise past illuminated monuments at sunset.", image: "/sailing-cruise.jpg", cost: 25, duration: 90, rating: 4.7, isSuggested: true },
  { id: "act-fr-1-4", stopId: "stop-fr-1", name: "Montmartre Walking Tour", category: "Culture", description: "Explore the artistic bohemian neighborhood.", image: "/paris-eiffel-tower.png", cost: 0, duration: 150, rating: 4.6, isSuggested: false },
  { id: "act-fr-1-5", stopId: "stop-fr-1", name: "French Cooking Class", category: "Food", description: "Learn to make croissants and classic French dishes.", image: "/cooking-class.png", cost: 80, duration: 180, rating: 4.9, isSuggested: false },
  { id: "act-fr-1-6", stopId: "stop-fr-1", name: "Versailles Day Trip", category: "Culture", description: "Visit the opulent palace and gardens.", image: "/paris-eiffel-tower.png", cost: 25, duration: 360, rating: 4.8, isSuggested: false },

  // Santorini Activities
  { id: "act-gr-1-1", stopId: "stop-gr-1", name: "Oia Sunset Viewing", category: "Nature", description: "Watch the world-famous sunset from Oia village.", image: "/santorini-village.png", cost: 0, duration: 120, rating: 4.9, isSuggested: true },
  { id: "act-gr-1-2", stopId: "stop-gr-1", name: "Caldera Boat Tour", category: "Adventure", description: "Sail around the volcanic caldera with swimming stops.", image: "/sailing-cruise.jpg", cost: 80, duration: 300, rating: 4.8, isSuggested: true },
  { id: "act-gr-1-3", stopId: "stop-gr-1", name: "Wine Tasting Tour", category: "Food", description: "Sample unique volcanic wines with caldera views.", image: "/cooking-class.png", cost: 60, duration: 180, rating: 4.7, isSuggested: true },
  { id: "act-gr-1-4", stopId: "stop-gr-1", name: "Red Beach Visit", category: "Nature", description: "Relax on the unique red sand beach.", image: "/bali-beach.png", cost: 0, duration: 180, rating: 4.5, isSuggested: false },
  { id: "act-gr-1-5", stopId: "stop-gr-1", name: "Fira to Oia Hike", category: "Adventure", description: "Scenic 10km clifftop walk between villages.", image: "/volcano-trek.jpg", cost: 0, duration: 240, rating: 4.6, isSuggested: false },

  // Bali Activities
  { id: "act-id-1-1", stopId: "stop-id-1", name: "Tegallalang Rice Terraces", category: "Nature", description: "Walk through iconic emerald green rice paddies.", image: "/bali-beach.png", cost: 5, duration: 120, rating: 4.7, isSuggested: true },
  { id: "act-id-1-2", stopId: "stop-id-1", name: "Uluwatu Temple Sunset", category: "Culture", description: "Visit clifftop temple with Kecak fire dance.", image: "/bali-beach.png", cost: 15, duration: 180, rating: 4.8, isSuggested: true },
  { id: "act-id-1-3", stopId: "stop-id-1", name: "Balinese Cooking Class", category: "Food", description: "Learn authentic Balinese recipes with market tour.", image: "/cooking-class.png", cost: 35, duration: 240, rating: 4.9, isSuggested: true },
  { id: "act-id-1-4", stopId: "stop-id-1", name: "Mount Batur Sunrise Trek", category: "Adventure", description: "Hike active volcano for spectacular sunrise.", image: "/volcano-trek.jpg", cost: 50, duration: 360, rating: 4.8, isSuggested: false },
  { id: "act-id-1-5", stopId: "stop-id-1", name: "Spa & Massage Day", category: "Relaxation", description: "Indulge in traditional Balinese spa treatments.", image: "/bali-beach.png", cost: 40, duration: 180, rating: 4.7, isSuggested: false },
  { id: "act-id-1-6", stopId: "stop-id-1", name: "Surfing Lesson", category: "Adventure", description: "Learn to surf on Bali's famous waves.", image: "/bali-beach.png", cost: 45, duration: 180, rating: 4.6, isSuggested: false },

  // Barcelona Activities
  { id: "act-es-1-1", stopId: "stop-es-1", name: "Sagrada Familia Tour", category: "Culture", description: "Explore Gaudí's unfinished masterpiece basilica.", image: "/beautiful-travel-destination-landscape.jpg", cost: 30, duration: 150, rating: 4.9, isSuggested: true },
  { id: "act-es-1-2", stopId: "stop-es-1", name: "Park Güell Visit", category: "Culture", description: "Wander through Gaudí's colorful mosaic park.", image: "/beautiful-travel-destination-landscape.jpg", cost: 15, duration: 120, rating: 4.7, isSuggested: true },
  { id: "act-es-1-3", stopId: "stop-es-1", name: "La Boqueria Market Tour", category: "Food", description: "Sample fresh produce and tapas at the famous market.", image: "/cooking-class.png", cost: 0, duration: 120, rating: 4.6, isSuggested: true },
  { id: "act-es-1-4", stopId: "stop-es-1", name: "Gothic Quarter Walk", category: "Culture", description: "Explore medieval streets and hidden plazas.", image: "/beautiful-travel-destination-landscape.jpg", cost: 0, duration: 150, rating: 4.5, isSuggested: false },
  { id: "act-es-1-5", stopId: "stop-es-1", name: "Flamenco Show", category: "Culture", description: "Experience passionate flamenco performance.", image: "/beautiful-travel-destination-landscape.jpg", cost: 45, duration: 90, rating: 4.8, isSuggested: false },

  // New York City Activities
  { id: "act-us-1-1", stopId: "stop-us-1", name: "Statue of Liberty & Ellis Island", category: "Culture", description: "Visit iconic American symbols of freedom.", image: "/nyc-skyline.png", cost: 25, duration: 300, rating: 4.7, isSuggested: true },
  { id: "act-us-1-2", stopId: "stop-us-1", name: "Central Park Bike Tour", category: "Nature", description: "Cycle through the famous urban park.", image: "/nyc-skyline.png", cost: 35, duration: 180, rating: 4.6, isSuggested: true },
  { id: "act-us-1-3", stopId: "stop-us-1", name: "Broadway Show", category: "Culture", description: "Experience world-class theater on Broadway.", image: "/nyc-skyline.png", cost: 150, duration: 180, rating: 4.9, isSuggested: true },
  { id: "act-us-1-4", stopId: "stop-us-1", name: "Empire State Building", category: "Culture", description: "See NYC from the iconic observation deck.", image: "/nyc-skyline.png", cost: 45, duration: 120, rating: 4.5, isSuggested: false },
  { id: "act-us-1-5", stopId: "stop-us-1", name: "Food Tour of Little Italy & Chinatown", category: "Food", description: "Taste diverse cuisines in historic neighborhoods.", image: "/cooking-class.png", cost: 60, duration: 180, rating: 4.7, isSuggested: false },

  // Machu Picchu Activities
  { id: "act-pe-1-1", stopId: "stop-pe-1", name: "Machu Picchu Guided Tour", category: "Culture", description: "Expert-led exploration of the ancient citadel.", image: "/machu-picchu-ancient-city.png", cost: 80, duration: 300, rating: 4.9, isSuggested: true },
  { id: "act-pe-1-2", stopId: "stop-pe-1", name: "Huayna Picchu Hike", category: "Adventure", description: "Climb the steep peak for incredible views.", image: "/volcano-trek.jpg", cost: 20, duration: 180, rating: 4.8, isSuggested: true },
  { id: "act-pe-1-3", stopId: "stop-pe-1", name: "Sun Gate Trek", category: "Adventure", description: "Hike to the Inca Trail entrance point.", image: "/machu-picchu-ancient-city.png", cost: 0, duration: 180, rating: 4.6, isSuggested: false },
  { id: "act-pe-1-4", stopId: "stop-pe-1", name: "Sunrise at Machu Picchu", category: "Nature", description: "Watch the sun rise over the ancient ruins.", image: "/machu-picchu-ancient-city.png", cost: 0, duration: 120, rating: 4.9, isSuggested: true }
]

// ==================== HELPER FUNCTIONS ====================

export function getCountries(): Country[] {
  return countries
}

export function getCountryById(id: string): Country | undefined {
  return countries.find(c => c.id === id)
}

export function getStopsByCountry(countryId: string): TravelStop[] {
  return travelStops.filter(s => s.countryId === countryId).sort((a, b) => a.popularityRank - b.popularityRank)
}

export function getStopById(stopId: string): TravelStop | undefined {
  return travelStops.find(s => s.id === stopId)
}

export function getActivitiesByStop(stopId: string): StopActivity[] {
  return stopActivities.filter(a => a.stopId === stopId)
}

export function getSuggestedActivities(stopId: string): StopActivity[] {
  return stopActivities.filter(a => a.stopId === stopId && a.isSuggested)
}

export function getActivityById(activityId: string): StopActivity | undefined {
  return stopActivities.find(a => a.id === activityId)
}

// Get country for a stop
export function getCountryForStop(stopId: string): Country | undefined {
  const stop = getStopById(stopId)
  if (!stop) return undefined
  return getCountryById(stop.countryId)
}
