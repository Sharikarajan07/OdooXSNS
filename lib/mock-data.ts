// Mock User
export interface MockUser {
  id: string
  email: string
  password: string
  name: string
  avatar: string | null
  language: string
}

// Mock Trip
export interface MockTrip {
  id: string
  userId: string
  name: string
  description: string
  coverImage: string
  startDate: string
  endDate: string
  totalBudget: number
  status: string
  isPublic: boolean
  shareCode: string
  stops: MockStop[]
  expenses: MockExpense[]
}

// Mock City
export interface MockCity {
  id: string
  name: string
  country: string
  region: string
  image: string
  description: string
  costIndex: number
  popularity: number
}

// Mock Activity
export interface MockActivity {
  id: string
  cityId: string | null
  name: string
  category: string
  description: string
  image: string
  cost: number
  duration: number
  rating: number
  city?: MockCity
}

// Mock Stop
export interface MockStop {
  id: string
  tripId: string
  cityId: string
  arrivalDate: string
  departureDate: string
  orderIndex: number
  notes: string
  city: MockCity
  activities: MockStopActivity[]
}

// Mock StopActivity
export interface MockStopActivity {
  id: string
  stopId: string
  activityId: string
  startTime: string | null
  orderIndex: number
  activity: MockActivity
}

// Mock Expense
export interface MockExpense {
  id: string
  tripId: string
  category: string
  amount: number
  description: string
}

// ==================== MOCK DATA ====================

// Demo User
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "demo@globetrotter.com",
    password: "$2a$10$K7L/zzpBpVEFsIYfCGu/7uRpqQ8VnW.QmjVZCVN.v4FmTqU3wYqHO", // demo123
    name: "John Traveler",
    avatar: null,
    language: "en"
  }
]

// Cities
export const mockCities: MockCity[] = [
  {
    id: "city-1",
    name: "Paris",
    country: "France",
    region: "Europe",
    image: "/paris-eiffel-tower.png",
    description: "The city of light, romance, and world-class cuisine.",
    costIndex: 75,
    popularity: 95
  },
  {
    id: "city-2",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    image: "/santorini-village.png",
    description: "Stunning white-washed buildings with blue domes overlooking the Aegean Sea.",
    costIndex: 65,
    popularity: 88
  },
  {
    id: "city-3",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    image: "/kyoto-street.png",
    description: "Ancient temples, traditional gardens, and geisha culture.",
    costIndex: 60,
    popularity: 85
  },
  {
    id: "city-4",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    image: "/bali-beach.png",
    description: "Tropical paradise with lush jungles and pristine beaches.",
    costIndex: 35,
    popularity: 90
  },
  {
    id: "city-5",
    name: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    image: "/iceland-northern-lights.png",
    description: "Gateway to natural wonders and the northern lights.",
    costIndex: 85,
    popularity: 75
  },
  {
    id: "city-6",
    name: "Machu Picchu",
    country: "Peru",
    region: "South America",
    image: "/machu-picchu-ancient-city.png",
    description: "Ancient Incan citadel high in the Andes mountains.",
    costIndex: 45,
    popularity: 82
  },
  {
    id: "city-7",
    name: "Amalfi",
    country: "Italy",
    region: "Europe",
    image: "/amalfi-coast.jpg",
    description: "Stunning coastal views and charming hillside villages.",
    costIndex: 80,
    popularity: 78
  },
  {
    id: "city-8",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    image: "/kyoto-street.png",
    description: "Ultra-modern city blending tradition with cutting-edge technology.",
    costIndex: 70,
    popularity: 92
  }
]

// Activities
export const mockActivities: MockActivity[] = [
  {
    id: "act-1",
    cityId: "city-1",
    name: "Eiffel Tower Visit",
    category: "Culture",
    description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.",
    image: "/paris-eiffel-tower.png",
    cost: 30,
    duration: 180,
    rating: 4.8,
    city: mockCities[0]
  },
  {
    id: "act-2",
    cityId: "city-1",
    name: "Louvre Museum Tour",
    category: "Culture",
    description: "Explore the world's largest art museum and see the Mona Lisa.",
    image: "/museum-tour.png",
    cost: 25,
    duration: 240,
    rating: 4.9,
    city: mockCities[0]
  },
  {
    id: "act-3",
    cityId: "city-2",
    name: "Sunset Sailing Cruise",
    category: "Relaxation",
    description: "Enjoy the golden hour on a luxury catamaran with drinks and snacks.",
    image: "/sailing-cruise.jpg",
    cost: 120,
    duration: 180,
    rating: 4.7,
    city: mockCities[1]
  },
  {
    id: "act-4",
    cityId: "city-3",
    name: "Temple Walk",
    category: "Culture",
    description: "Visit ancient temples and learn about Japanese history.",
    image: "/kyoto-street.png",
    cost: 15,
    duration: 120,
    rating: 4.6,
    city: mockCities[2]
  },
  {
    id: "act-5",
    cityId: "city-4",
    name: "Sunrise Volcano Trek",
    category: "Adventure",
    description: "A challenging but rewarding hike to see the sunrise from the summit.",
    image: "/volcano-trek.jpg",
    cost: 75,
    duration: 360,
    rating: 4.8,
    city: mockCities[3]
  },
  {
    id: "act-6",
    cityId: "city-4",
    name: "Local Cooking Class",
    category: "Food",
    description: "Learn to make authentic Balinese dishes with a professional chef.",
    image: "/cooking-class.png",
    cost: 50,
    duration: 180,
    rating: 4.9,
    city: mockCities[3]
  },
  {
    id: "act-7",
    cityId: "city-5",
    name: "Northern Lights Tour",
    category: "Adventure",
    description: "Chase the magical Aurora Borealis across the Icelandic landscape.",
    image: "/iceland-northern-lights.png",
    cost: 150,
    duration: 300,
    rating: 4.9,
    city: mockCities[4]
  },
  {
    id: "act-8",
    cityId: "city-6",
    name: "Inca Trail Hike",
    category: "Adventure",
    description: "Trek through ancient paths to reach the mystical Machu Picchu.",
    image: "/machu-picchu-ancient-city.png",
    cost: 200,
    duration: 480,
    rating: 4.9,
    city: mockCities[5]
  },
  {
    id: "act-9",
    cityId: "city-7",
    name: "Coastal Drive Tour",
    category: "Relaxation",
    description: "Drive along the stunning Amalfi Coast with breathtaking views.",
    image: "/amalfi-coast.jpg",
    cost: 80,
    duration: 240,
    rating: 4.7,
    city: mockCities[6]
  },
  {
    id: "act-10",
    cityId: "city-8",
    name: "Sushi Making Class",
    category: "Food",
    description: "Learn the art of sushi making from a master chef.",
    image: "/cooking-class.png",
    cost: 90,
    duration: 150,
    rating: 4.8,
    city: mockCities[7]
  }
]

// Trips
export const mockTrips: MockTrip[] = [
  {
    id: "trip-1",
    userId: "user-1",
    name: "Summer in Santorini",
    description: "A romantic getaway to the beautiful Greek islands",
    coverImage: "/santorini-village.png",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
    totalBudget: 2500,
    status: "upcoming",
    isPublic: true,
    shareCode: "SANTO2026",
    stops: [
      {
        id: "stop-1",
        tripId: "trip-1",
        cityId: "city-2",
        arrivalDate: "2026-07-15",
        departureDate: "2026-07-22",
        orderIndex: 0,
        notes: "Main destination - stay at Oia",
        city: mockCities[1],
        activities: [
          {
            id: "sa-1",
            stopId: "stop-1",
            activityId: "act-3",
            startTime: "17:00",
            orderIndex: 0,
            activity: mockActivities[2]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-1", tripId: "trip-1", category: "Accommodation", amount: 1200, description: "Hotel in Oia" },
      { id: "exp-2", tripId: "trip-1", category: "Transport", amount: 400, description: "Flights" }
    ]
  },
  {
    id: "trip-2",
    userId: "user-1",
    name: "Kyoto Cherry Blossoms",
    description: "Experience the magical sakura season in Japan",
    coverImage: "/kyoto-street.png",
    startDate: "2026-03-25",
    endDate: "2026-04-02",
    totalBudget: 3200,
    status: "upcoming",
    isPublic: false,
    shareCode: "KYOTO2026",
    stops: [
      {
        id: "stop-2",
        tripId: "trip-2",
        cityId: "city-3",
        arrivalDate: "2026-03-25",
        departureDate: "2026-04-02",
        orderIndex: 0,
        notes: "Cherry blossom season!",
        city: mockCities[2],
        activities: [
          {
            id: "sa-2",
            stopId: "stop-2",
            activityId: "act-4",
            startTime: "09:00",
            orderIndex: 0,
            activity: mockActivities[3]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-3", tripId: "trip-2", category: "Accommodation", amount: 1500, description: "Ryokan stay" },
      { id: "exp-4", tripId: "trip-2", category: "Transport", amount: 800, description: "Flights + JR Pass" }
    ]
  },
  {
    id: "trip-3",
    userId: "user-1",
    name: "Icelandic Adventure",
    description: "Northern lights and glacier hiking",
    coverImage: "/iceland-northern-lights.png",
    startDate: "2025-11-10",
    endDate: "2025-11-17",
    totalBudget: 4500,
    status: "completed",
    isPublic: true,
    shareCode: "ICELAND25",
    stops: [
      {
        id: "stop-3",
        tripId: "trip-3",
        cityId: "city-5",
        arrivalDate: "2025-11-10",
        departureDate: "2025-11-17",
        orderIndex: 0,
        notes: "Northern lights hunting!",
        city: mockCities[4],
        activities: [
          {
            id: "sa-3",
            stopId: "stop-3",
            activityId: "act-7",
            startTime: "21:00",
            orderIndex: 0,
            activity: mockActivities[6]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-5", tripId: "trip-3", category: "Accommodation", amount: 2000, description: "Lodge" },
      { id: "exp-6", tripId: "trip-3", category: "Transport", amount: 1200, description: "Flights + 4x4 rental" }
    ]
  },
  {
    id: "trip-4",
    userId: "user-1",
    name: "Parisian Getaway",
    description: "Art, culture, and cuisine in the City of Light",
    coverImage: "/paris-eiffel-tower.png",
    startDate: "2026-05-10",
    endDate: "2026-05-17",
    totalBudget: 3800,
    status: "upcoming",
    isPublic: true,
    shareCode: "PARIS2026",
    stops: [
      {
        id: "stop-4",
        tripId: "trip-4",
        cityId: "city-1",
        arrivalDate: "2026-05-10",
        departureDate: "2026-05-17",
        orderIndex: 0,
        notes: "Stay near the Marais district",
        city: mockCities[0],
        activities: [
          {
            id: "sa-4",
            stopId: "stop-4",
            activityId: "act-1",
            startTime: "10:00",
            orderIndex: 0,
            activity: mockActivities[0]
          },
          {
            id: "sa-5",
            stopId: "stop-4",
            activityId: "act-2",
            startTime: "14:00",
            orderIndex: 1,
            activity: mockActivities[1]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-7", tripId: "trip-4", category: "Accommodation", amount: 1800, description: "Boutique hotel" },
      { id: "exp-8", tripId: "trip-4", category: "Food", amount: 800, description: "Fine dining experiences" }
    ]
  },
  {
    id: "trip-5",
    userId: "user-1",
    name: "Bali Bliss Retreat",
    description: "Wellness and adventure in tropical paradise",
    coverImage: "/bali-beach.png",
    startDate: "2026-08-20",
    endDate: "2026-08-30",
    totalBudget: 2800,
    status: "upcoming",
    isPublic: false,
    shareCode: "BALI2026",
    stops: [
      {
        id: "stop-5",
        tripId: "trip-5",
        cityId: "city-4",
        arrivalDate: "2026-08-20",
        departureDate: "2026-08-30",
        orderIndex: 0,
        notes: "Ubud for wellness, then beach time in Seminyak",
        city: mockCities[3],
        activities: [
          {
            id: "sa-6",
            stopId: "stop-5",
            activityId: "act-5",
            startTime: "04:00",
            orderIndex: 0,
            activity: mockActivities[4]
          },
          {
            id: "sa-7",
            stopId: "stop-5",
            activityId: "act-6",
            startTime: "11:00",
            orderIndex: 1,
            activity: mockActivities[5]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-9", tripId: "trip-5", category: "Accommodation", amount: 1200, description: "Villa with pool" },
      { id: "exp-10", tripId: "trip-5", category: "Activities", amount: 600, description: "Spa & wellness" }
    ]
  },
  {
    id: "trip-6",
    userId: "user-1",
    name: "Machu Picchu Expedition",
    description: "Trekking the Inca Trail to the lost city",
    coverImage: "/machu-picchu-ancient-city.png",
    startDate: "2026-09-05",
    endDate: "2026-09-15",
    totalBudget: 4200,
    status: "upcoming",
    isPublic: true,
    shareCode: "PERU2026",
    stops: [
      {
        id: "stop-6",
        tripId: "trip-6",
        cityId: "city-6",
        arrivalDate: "2026-09-05",
        departureDate: "2026-09-15",
        orderIndex: 0,
        notes: "Acclimatize in Cusco first",
        city: mockCities[5],
        activities: [
          {
            id: "sa-8",
            stopId: "stop-6",
            activityId: "act-8",
            startTime: "05:00",
            orderIndex: 0,
            activity: mockActivities[7]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-11", tripId: "trip-6", category: "Transport", amount: 1500, description: "International flights" },
      { id: "exp-12", tripId: "trip-6", category: "Activities", amount: 800, description: "Guided trek" }
    ]
  },
  {
    id: "trip-7",
    userId: "user-1",
    name: "Amalfi Coast Road Trip",
    description: "Driving the scenic Italian coastline",
    coverImage: "/amalfi-coast.jpg",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    totalBudget: 3500,
    status: "upcoming",
    isPublic: true,
    shareCode: "AMALFI26",
    stops: [
      {
        id: "stop-7",
        tripId: "trip-7",
        cityId: "city-7",
        arrivalDate: "2026-06-15",
        departureDate: "2026-06-22",
        orderIndex: 0,
        notes: "Rent a convertible for the coastal drive",
        city: mockCities[6],
        activities: [
          {
            id: "sa-9",
            stopId: "stop-7",
            activityId: "act-9",
            startTime: "09:00",
            orderIndex: 0,
            activity: mockActivities[8]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-13", tripId: "trip-7", category: "Transport", amount: 600, description: "Car rental" },
      { id: "exp-14", tripId: "trip-7", category: "Accommodation", amount: 1800, description: "Cliffside hotel" }
    ]
  },
  {
    id: "trip-8",
    userId: "user-1",
    name: "Tokyo Tech & Tradition",
    description: "From ancient temples to neon-lit streets",
    coverImage: "/kyoto-street.png",
    startDate: "2025-10-01",
    endDate: "2025-10-10",
    totalBudget: 4000,
    status: "completed",
    isPublic: false,
    shareCode: "TOKYO25",
    stops: [
      {
        id: "stop-8",
        tripId: "trip-8",
        cityId: "city-8",
        arrivalDate: "2025-10-01",
        departureDate: "2025-10-10",
        orderIndex: 0,
        notes: "Stay in Shibuya area",
        city: mockCities[7],
        activities: [
          {
            id: "sa-10",
            stopId: "stop-8",
            activityId: "act-10",
            startTime: "12:00",
            orderIndex: 0,
            activity: mockActivities[9]
          }
        ]
      }
    ],
    expenses: [
      { id: "exp-15", tripId: "trip-8", category: "Accommodation", amount: 2000, description: "Hotel in Shibuya" },
      { id: "exp-16", tripId: "trip-8", category: "Food", amount: 1000, description: "Culinary experiences" }
    ]
  }
]

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// In-memory store for runtime modifications
let runtimeTrips = [...mockTrips]
let runtimeStops: MockStop[] = []
let runtimeStopActivities: MockStopActivity[] = []

export function getTrips() {
  return runtimeTrips
}

export function addTrip(trip: MockTrip) {
  runtimeTrips.push(trip)
  return trip
}

export function updateTrip(id: string, updates: Partial<MockTrip>) {
  const index = runtimeTrips.findIndex(t => t.id === id)
  if (index !== -1) {
    runtimeTrips[index] = { ...runtimeTrips[index], ...updates }
    return runtimeTrips[index]
  }
  return null
}

export function deleteTrip(id: string) {
  const index = runtimeTrips.findIndex(t => t.id === id)
  if (index !== -1) {
    runtimeTrips.splice(index, 1)
    return true
  }
  return false
}

export function getTripById(id: string) {
  return runtimeTrips.find(t => t.id === id)
}

export function getTripByShareCode(code: string) {
  return runtimeTrips.find(t => t.shareCode === code && t.isPublic)
}

export function addStopToTrip(tripId: string, stop: MockStop) {
  const trip = getTripById(tripId)
  if (trip) {
    trip.stops.push(stop)
    return stop
  }
  return null
}

export function addActivityToStop(stopId: string, activity: MockStopActivity) {
  for (const trip of runtimeTrips) {
    const stop = trip.stops.find(s => s.id === stopId)
    if (stop) {
      stop.activities.push(activity)
      return activity
    }
  }
  return null
}

export function getCities() {
  return mockCities
}

export function getCityById(id: string) {
  return mockCities.find(c => c.id === id)
}

export function getActivities() {
  return mockActivities
}

export function getActivityById(id: string) {
  return mockActivities.find(a => a.id === id)
}

export function getUserByEmail(email: string) {
  return mockUsers.find(u => u.email === email)
}

// Add expense to a trip
export function addExpenseToTrip(tripId: string, expense: Omit<MockExpense, 'id' | 'tripId'>) {
  const trip = getTripById(tripId)
  if (trip) {
    const newExpense: MockExpense = {
      id: `exp-${generateId()}`,
      tripId,
      ...expense
    }
    trip.expenses.push(newExpense)
    return newExpense
  }
  return null
}

// Remove expense from a trip
export function removeExpenseFromTrip(tripId: string, expenseId: string) {
  const trip = getTripById(tripId)
  if (trip) {
    const index = trip.expenses.findIndex(e => e.id === expenseId)
    if (index !== -1) {
      trip.expenses.splice(index, 1)
      return true
    }
  }
  return false
}

// Update activity time in a stop
export function updateActivityTime(tripId: string, stopId: string, activityId: string, startTime: string) {
  const trip = getTripById(tripId)
  if (trip) {
    const stop = trip.stops.find(s => s.id === stopId)
    if (stop) {
      const activity = stop.activities.find(a => a.id === activityId)
      if (activity) {
        activity.startTime = startTime
        return activity
      }
    }
  }
  return null
}

// Remove activity from stop
export function removeActivityFromStop(tripId: string, stopId: string, activityId: string) {
  const trip = getTripById(tripId)
  if (trip) {
    const stop = trip.stops.find(s => s.id === stopId)
    if (stop) {
      const index = stop.activities.findIndex(a => a.id === activityId)
      if (index !== -1) {
        stop.activities.splice(index, 1)
        return true
      }
    }
  }
  return false
}

// Get unique countries from cities
export function getCountries() {
  const countries = new Set(mockCities.map(c => c.country))
  return Array.from(countries).sort()
}

// Get cities by country
export function getCitiesByCountry(country: string) {
  return mockCities.filter(c => c.country === country)
}
