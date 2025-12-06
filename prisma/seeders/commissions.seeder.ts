import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCommissions(commissionerIds: string[], propertyIds: string[]) {
  const commissions = [
    { propertyId: propertyIds[2], commissionerId: commissionerIds[0], amount: 60000, smartRentFee: 6000 },
    { propertyId: propertyIds[4], commissionerId: commissionerIds[1], amount: 90000, smartRentFee: 9000 },
    { propertyId: propertyIds[6], commissionerId: commissionerIds[2], amount: 110000, smartRentFee: 11000 },
    { propertyId: propertyIds[14], commissionerId: commissionerIds[3], amount: 180000, smartRentFee: 18000 },
    { propertyId: propertyIds[17], commissionerId: commissionerIds[4], amount: 25000, smartRentFee: 2500 },
    { propertyId: propertyIds[1], commissionerId: commissionerIds[0], amount: 150000, smartRentFee: 15000 },
    { propertyId: propertyIds[11], commissionerId: commissionerIds[1], amount: 95000, smartRentFee: 9500 },
    { propertyId: propertyIds[16], commissionerId: commissionerIds[2], amount: 80000, smartRentFee: 8000 },
    { propertyId: propertyIds[21], commissionerId: commissionerIds[3], amount: 45000, smartRentFee: 4500 },
    { propertyId: propertyIds[36], commissionerId: commissionerIds[4], amount: 12000, smartRentFee: 1200 },
  ];

  const createdCommissions = await prisma.commission.createMany({ data: commissions });
  console.log(`✅ Seeded ${createdCommissions.count} commissions`);
  
  return await prisma.commission.findMany();
}
