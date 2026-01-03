export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  image: string
  status: "upcoming" | "completed" | "draft"
  totalBudget: number
}

export interface Destination {
  id: string
  name: string
  description: string
  image: string
  price: string
  rating: number
}

export interface Activity {
  id: string
  name: string
  category: string
  price: number
  rating: number
  image: string
  description: string
}

export const mockTrips: Trip[] = [
  {
    id: "1",
    name: "Summer in Santorini",
    destination: "Santorini, Greece",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
    image: "/santorini-village.png",
    status: "upcoming",
    totalBudget: 2500,
  },
  {
    id: "2",
    name: "Kyoto Cherry Blossoms",
    destination: "Kyoto, Japan",
    startDate: "2026-03-25",
    endDate: "2026-04-02",
    image: "/kyoto-street.png",
    status: "upcoming",
    totalBudget: 3200,
  },
  {
    id: "3",
    name: "Icelandic Adventure",
    destination: "Reykjavik, Iceland",
    startDate: "2025-11-10",
    endDate: "2025-11-17",
    image: "/iceland-northern-lights.png",
    status: "completed",
    totalBudget: 4500,
  },
]

export const popularDestinations: Destination[] = [
  {
    id: "d1",
    name: "Bali, Indonesia",
    description: "Tropical paradise with lush jungles and pristine beaches.",
    image: "/bali-beach.png",
    price: "$800+",
    rating: 4.8,
  },
  {
    id: "d2",
    name: "Paris, France",
    description: "The city of light, romance, and world-class cuisine.",
    image: "/paris-eiffel-tower.png",
    price: "$1200+",
    rating: 4.7,
  },
  {
    id: "d3",
    name: "Amalfi Coast, Italy",
    description: "Stunning coastal views and charming hillside villages.",
    image: "/amalfi-coast.jpg",
    price: "$1500+",
    rating: 4.9,
  },
  {
    id: "d4",
    name: "Machu Picchu, Peru",
    description: "Ancient Incan citadel high in the Andes mountains.",
    image: "/machu-picchu-ancient-city.png",
    price: "$950+",
    rating: 4.9,
  },
]

export const activities: Activity[] = [
  {
    id: "a1",
    name: "Sunrise Volcano Trek",
    category: "Adventure",
    price: 75,
    rating: 4.8,
    image: "/volcano-trek.jpg",
    description: "A challenging but rewarding hike to see the sunrise from the summit.",
  },
  {
    id: "a2",
    name: "Local Cooking Class",
    category: "Food",
    price: 50,
    rating: 4.9,
    image: "/cooking-class.png",
    description: "Learn to make authentic local dishes with a professional chef.",
  },
  {
    id: "a3",
    name: "Sunset Sailing Cruise",
    category: "Relaxation",
    price: 120,
    rating: 4.7,
    image: "/sailing-cruise.jpg",
    description: "Enjoy the golden hour on a luxury catamaran with drinks and snacks.",
  },
  {
    id: "a4",
    name: "Guided Museum Tour",
    category: "Culture",
    price: 35,
    rating: 4.6,
    image: "/museum-tour.png",
    description: "Skip the line and get expert insights into historical masterpieces.",
  },
]
