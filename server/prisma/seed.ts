/// <reference types="node" />
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@varahi.com' },
        update: {},
        create: {
            email: 'admin@varahi.com',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log({ admin });

    // Create a sample class
    const classA = await prisma.class.create({
        data: {
            name: 'Class 10',
            section: 'A',
        },
    });

    console.log({ classA });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
