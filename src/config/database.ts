import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

export { prisma, connectToDatabase };