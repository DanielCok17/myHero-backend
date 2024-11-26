import { PrismaClient, Role, BookingStatus, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // Upsert users
    const customer = await prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {}, // If the record exists, no updates will be applied
        create: {
            email: "customer@example.com",
            password: "hashedpassword1",
            oauthProvider: null, // Not an OAuth user
            oauthProviderId: null,
            oauthAccessToken: null,
            role: Role.CUSTOMER,
            profile: {
                create: {
                    firstName: "John",
                    lastName: "Doe",
                    bio: "This is a customer profile",
                    profileImage: "https://example.com/profile1.jpg",
                    socialMedia: { twitter: "https://twitter.com/johndoe" },
                },
            },
        },
    });

    const influencerUser = await prisma.user.upsert({
        where: { email: "influencer@example.com" },
        update: {},
        create: {
            email: "influencer@example.com",
            password: "hashedpassword2",
            oauthProvider: null, // Not an OAuth user
            oauthProviderId: null,
            oauthAccessToken: null,
            role: Role.INFLUENCER,
            influencer: {
                create: {
                    categories: ["Music", "Sports"],
                    pricing: { service1: 100, service2: 200 },
                    availability: {
                        create: [
                            {
                                startTime: new Date(),
                                endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
                            },
                            {
                                startTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
                                endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
                            },
                        ],
                    },
                },
            },
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            password: "hashedpassword3",
            role: Role.ADMIN,
            admin: {
                create: {},
            },
        },
    });

    // Retrieve the Influencer record
    const influencer = await prisma.influencer.findUnique({
        where: {
            userId: influencerUser.id,
        },
    });

    if (!influencer) {
        throw new Error("Influencer record not found!");
    }

    // Upsert bookings
    await prisma.booking.upsert({
        where: { id: "booking1" }, // Use a unique identifier or constraint for the booking
        update: {},
        create: {
            customerId: customer.id,
            influencerId: influencer.id,
            service: "Personalized message",
            message: "Hi, please create a personalized message for my friend.",
            status: BookingStatus.PENDING,
            payment: {
                create: {
                    amount: 50,
                    currency: "USD",
                    paymentMethod: "Stripe",
                    status: PaymentStatus.PENDING,
                    userId: customer.id,
                },
            },
        },
    });

    await prisma.booking.upsert({
        where: { id: "booking2" }, // Use a unique identifier or constraint for the booking
        update: {},
        create: {
            customerId: customer.id,
            influencerId: influencer.id,
            service: "Live shoutout",
            message: "Hi, can you shout out to my team?",
            status: BookingStatus.CONFIRMED,
            payment: {
                create: {
                    amount: 100,
                    currency: "USD",
                    paymentMethod: "PayPal",
                    status: PaymentStatus.COMPLETED,
                    userId: customer.id,
                },
            },
        },
    });

    console.log("Seeding finished!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });