import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 30 imaginary students...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Get an existing class to assign them to
    let defaultClass = await prisma.class.findFirst({ where: { isDeleted: false } });
    if (!defaultClass) {
        defaultClass = await prisma.class.create({
            data: { name: 'Class 10', section: 'A' }
        });
        console.log('Created default class.');
    }

    const studentsToCreate = [];
    for (let i = 1; i <= 30; i++) {
        const uniqueEmail = `student${i}_${Date.now().toString().slice(-4)}@varahischools.edu`;
        studentsToCreate.push({
            name: `Mock Student ${i}`,
            email: uniqueEmail,
            classId: defaultClass.id
        });
    }

    let count = 0;
    for (const s of studentsToCreate) {
        await prisma.user.create({
            data: {
                email: s.email,
                password: hashedPassword,
                role: Role.STUDENT,
                student: {
                    create: {
                        name: s.name,
                        classId: s.classId
                    }
                }
            }
        });
        count++;
    }

    console.log(`Successfully seeded ${count} students with the password "Password123!".`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
