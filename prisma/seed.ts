import { prisma } from '../lib/db'
import * as bcrypt from 'bcryptjs'

async function main() {
    console.log('🌱 Starting database seed...')

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10)
    const user = await prisma.user.upsert({
        where: { email: 'demo@globetrotter.com' },
        update: {},
        create: {
            email: 'demo@globetrotter.com',
            password: hashedPassword,
            name: 'John Traveler',
            avatar: '/placeholder-user.jpg',
        },
    })
    console.log('✅ Created demo user:', user.email)

    // Create cities
    const cities = await Promise.all([
        prisma.city.upsert({
            where: { id: 'paris' },
            update: {},
            create: {
                id: 'paris',
                name: 'Paris',
                country: 'France',
                region: 'Europe',
                image: '/paris-eiffel-tower.png',
                description: 'The city of light, romance, and world-class cuisine.',
                costIndex: 75,
                popularity: 95,
            },
        }),
        prisma.city.upsert({
            where: { id: 'tokyo' },
            update: {},
            create: {
                id: 'tokyo',
                name: 'Tokyo',
                country: 'Japan',
                region: 'Asia',
                image: '/kyoto-street.png',
                description: 'A fascinating blend of traditional and ultramodern.',
                costIndex: 70,
                popularity: 92,
            },
        }),
        prisma.city.upsert({
            where: { id: 'santorini' },
            update: {},
            create: {
                id: 'santorini',
                name: 'Santorini',
                country: 'Greece',
                region: 'Europe',
                image: '/santorini-village.png',
                description: 'Stunning sunsets and iconic white-washed buildings.',
                costIndex: 65,
                popularity: 88,
            },
        }),
        prisma.city.upsert({
            where: { id: 'bali' },
            update: {},
            create: {
                id: 'bali',
                name: 'Bali',
                country: 'Indonesia',
                region: 'Asia',
                image: '/bali-beach.png',
                description: 'Tropical paradise with lush jungles and pristine beaches.',
                costIndex: 35,
                popularity: 90,
            },
        }),
        prisma.city.upsert({
            where: { id: 'nyc' },
            update: {},
            create: {
                id: 'nyc',
                name: 'New York City',
                country: 'USA',
                region: 'North America',
                image: '/nyc-skyline.png',
                description: 'The city that never sleeps, iconic landmarks and culture.',
                costIndex: 85,
                popularity: 94,
            },
        }),
        prisma.city.upsert({
            where: { id: 'machu-picchu' },
            update: {},
            create: {
                id: 'machu-picchu',
                name: 'Machu Picchu',
                country: 'Peru',
                region: 'South America',
                image: '/machu-picchu-ancient-city.png',
                description: 'Ancient Incan citadel high in the Andes mountains.',
                costIndex: 45,
                popularity: 85,
            },
        }),
        prisma.city.upsert({
            where: { id: 'iceland' },
            update: {},
            create: {
                id: 'iceland',
                name: 'Reykjavik',
                country: 'Iceland',
                region: 'Europe',
                image: '/iceland-northern-lights.png',
                description: 'Northern lights, geysers, and dramatic landscapes.',
                costIndex: 80,
                popularity: 82,
            },
        }),
        prisma.city.upsert({
            where: { id: 'kyoto' },
            update: {},
            create: {
                id: 'kyoto',
                name: 'Kyoto',
                country: 'Japan',
                region: 'Asia',
                image: '/kyoto-temple-cherry-blossoms.png',
                description: 'Ancient temples, traditional gardens, and geisha culture.',
                costIndex: 60,
                popularity: 87,
            },
        }),
    ])
    console.log('✅ Created', cities.length, 'cities')

    // Create activities
    const activities = await Promise.all([
        prisma.activity.upsert({
            where: { id: 'volcano-trek' },
            update: {},
            create: {
                id: 'volcano-trek',
                cityId: 'bali',
                name: 'Sunrise Volcano Trek',
                category: 'Adventure',
                description: 'A challenging but rewarding hike to see the sunrise from the summit.',
                image: '/volcano-trek.jpg',
                cost: 75,
                duration: 240,
                rating: 4.8,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'cooking-class' },
            update: {},
            create: {
                id: 'cooking-class',
                cityId: 'paris',
                name: 'French Cooking Class',
                category: 'Food',
                description: 'Learn to make authentic French dishes with a professional chef.',
                image: '/cooking-class.png',
                cost: 120,
                duration: 180,
                rating: 4.9,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'sunset-cruise' },
            update: {},
            create: {
                id: 'sunset-cruise',
                cityId: 'santorini',
                name: 'Sunset Sailing Cruise',
                category: 'Relaxation',
                description: 'Enjoy the golden hour on a luxury catamaran with drinks and snacks.',
                image: '/sailing-cruise.jpg',
                cost: 150,
                duration: 180,
                rating: 4.7,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'museum-tour' },
            update: {},
            create: {
                id: 'museum-tour',
                cityId: 'paris',
                name: 'Louvre Museum Tour',
                category: 'Culture',
                description: 'Skip the line and get expert insights into historical masterpieces.',
                image: '/museum-tour.png',
                cost: 65,
                duration: 150,
                rating: 4.6,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'temple-visit' },
            update: {},
            create: {
                id: 'temple-visit',
                cityId: 'kyoto',
                name: 'Ancient Temple Tour',
                category: 'Culture',
                description: 'Visit the most iconic temples and shrines of Kyoto.',
                image: '/kyoto-temple-cherry-blossoms.png',
                cost: 45,
                duration: 240,
                rating: 4.8,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'northern-lights' },
            update: {},
            create: {
                id: 'northern-lights',
                cityId: 'iceland',
                name: 'Northern Lights Tour',
                category: 'Adventure',
                description: 'Chase the aurora borealis with expert guides.',
                image: '/iceland-northern-lights.png',
                cost: 180,
                duration: 300,
                rating: 4.9,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'broadway-show' },
            update: {},
            create: {
                id: 'broadway-show',
                cityId: 'nyc',
                name: 'Broadway Show',
                category: 'Entertainment',
                description: 'Experience world-class theater on Broadway.',
                image: '/nyc-skyline.png',
                cost: 200,
                duration: 180,
                rating: 4.8,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'inca-trail' },
            update: {},
            create: {
                id: 'inca-trail',
                cityId: 'machu-picchu',
                name: 'Inca Trail Hike',
                category: 'Adventure',
                description: 'Trek the famous Inca Trail to Machu Picchu.',
                image: '/machu-picchu-ancient-city.png',
                cost: 350,
                duration: 480,
                rating: 4.9,
            },
        }),
    ])
    console.log('✅ Created', activities.length, 'activities')

    // Create sample trips for demo user
    const trip1 = await prisma.trip.upsert({
        where: { id: 'trip-paris' },
        update: {},
        create: {
            id: 'trip-paris',
            userId: user.id,
            name: 'Paris Getaway',
            description: 'A romantic week exploring the City of Light',
            coverImage: '/paris-eiffel-tower.png',
            startDate: new Date('2026-03-10'),
            endDate: new Date('2026-03-17'),
            totalBudget: 3500,
            status: 'upcoming',
            isPublic: true,
            shareCode: 'PARIS2026',
        },
    })

    const trip2 = await prisma.trip.upsert({
        where: { id: 'trip-santorini' },
        update: {},
        create: {
            id: 'trip-santorini',
            userId: user.id,
            name: 'Summer in Santorini',
            description: 'Sun, sea, and stunning sunsets in Greece',
            coverImage: '/santorini-village.png',
            startDate: new Date('2026-07-15'),
            endDate: new Date('2026-07-22'),
            totalBudget: 2800,
            status: 'upcoming',
        },
    })

    const trip3 = await prisma.trip.upsert({
        where: { id: 'trip-iceland' },
        update: {},
        create: {
            id: 'trip-iceland',
            userId: user.id,
            name: 'Icelandic Adventure',
            description: 'Northern lights and dramatic landscapes',
            coverImage: '/iceland-northern-lights.png',
            startDate: new Date('2025-11-10'),
            endDate: new Date('2025-11-17'),
            totalBudget: 4500,
            status: 'completed',
        },
    })
    console.log('✅ Created 3 sample trips')

    // Create stops for Paris trip
    const parisStop = await prisma.stop.upsert({
        where: { id: 'stop-paris-1' },
        update: {},
        create: {
            id: 'stop-paris-1',
            tripId: trip1.id,
            cityId: 'paris',
            arrivalDate: new Date('2026-03-10'),
            departureDate: new Date('2026-03-17'),
            orderIndex: 0,
            notes: 'Main destination - explore all the classic sights!',
        },
    })

    // Add activities to Paris stop
    await prisma.stopActivity.upsert({
        where: { id: 'sa-paris-1' },
        update: {},
        create: {
            id: 'sa-paris-1',
            stopId: parisStop.id,
            activityId: 'museum-tour',
            startTime: new Date('2026-03-11T10:00:00'),
            orderIndex: 0,
        },
    })

    await prisma.stopActivity.upsert({
        where: { id: 'sa-paris-2' },
        update: {},
        create: {
            id: 'sa-paris-2',
            stopId: parisStop.id,
            activityId: 'cooking-class',
            startTime: new Date('2026-03-12T14:00:00'),
            orderIndex: 1,
        },
    })
    console.log('✅ Created stops and activities for Paris trip')

    // Create expenses
    await prisma.expense.upsert({
        where: { id: 'exp-paris-1' },
        update: {},
        create: {
            id: 'exp-paris-1',
            tripId: trip1.id,
            category: 'accommodation',
            amount: 1200,
            description: 'Hotel Le Marais - 7 nights',
        },
    })

    await prisma.expense.upsert({
        where: { id: 'exp-paris-2' },
        update: {},
        create: {
            id: 'exp-paris-2',
            tripId: trip1.id,
            category: 'transport',
            amount: 800,
            description: 'Round-trip flights',
        },
    })

    await prisma.expense.upsert({
        where: { id: 'exp-paris-3' },
        update: {},
        create: {
            id: 'exp-paris-3',
            tripId: trip1.id,
            category: 'food',
            amount: 500,
            description: 'Estimated dining budget',
        },
    })
    console.log('✅ Created sample expenses')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
        where: { email: 'admin@globetrotter.com' },
        update: {},
        create: {
            email: 'admin@globetrotter.com',
            password: adminPassword,
            name: 'Admin User',
        },
    })
    console.log('✅ Created admin user')

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
