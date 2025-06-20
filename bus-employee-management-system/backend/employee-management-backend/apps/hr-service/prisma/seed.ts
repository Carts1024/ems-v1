/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const departments = [
    { departmentName: 'Human Resources' },
    { departmentName: 'Finance' },
    { departmentName: 'Inventory' },
    { departmentName: 'Operations' },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { departmentName: department.departmentName },
      update: {},
      create: department,
    });
  }
  console.log('Departments seeded successfully.');
}

main()
  .catch((e) => console.error('Error seeding data:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
