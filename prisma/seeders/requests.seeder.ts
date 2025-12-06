import { PrismaClient, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRequests(tenantIds: string[], propertyIds: string[]) {
  const requests = [
    { tenantId: tenantIds[0], propertyId: propertyIds[0], status: RequestStatus.PENDING, message: 'I am interested in viewing this property' },
    { tenantId: tenantIds[1], propertyId: propertyIds[1], status: RequestStatus.CONNECTED, message: 'Looking for a long-term rental' },
    { tenantId: tenantIds[2], propertyId: propertyIds[2], status: RequestStatus.COMPLETED, message: 'Ready to move in immediately' },
    { tenantId: tenantIds[3], propertyId: propertyIds[3], status: RequestStatus.PENDING, message: 'Can I schedule a viewing?' },
    { tenantId: tenantIds[4], propertyId: propertyIds[4], status: RequestStatus.CONNECTED, message: 'Interested in this property for my family' },
    { tenantId: tenantIds[5], propertyId: propertyIds[5], status: RequestStatus.PENDING, message: 'Is this still available?' },
    { tenantId: tenantIds[6], propertyId: propertyIds[6], status: RequestStatus.COMPLETED, message: 'Perfect location for me' },
    { tenantId: tenantIds[7], propertyId: propertyIds[7], status: RequestStatus.PENDING, message: 'Would like more information' },
    { tenantId: tenantIds[8], propertyId: propertyIds[8], status: RequestStatus.CONNECTED, message: 'Looking to rent soon' },
    { tenantId: tenantIds[9], propertyId: propertyIds[9], status: RequestStatus.PENDING, message: 'Interested in this apartment' },
    { tenantId: tenantIds[10], propertyId: propertyIds[10], status: RequestStatus.PENDING, message: 'Can we negotiate the price?' },
    { tenantId: tenantIds[11], propertyId: propertyIds[11], status: RequestStatus.CONNECTED, message: 'Need a place urgently' },
    { tenantId: tenantIds[12], propertyId: propertyIds[12], status: RequestStatus.PENDING, message: 'Is parking included?' },
    { tenantId: tenantIds[13], propertyId: propertyIds[13], status: RequestStatus.PENDING, message: 'Looking for student accommodation' },
    { tenantId: tenantIds[14], propertyId: propertyIds[14], status: RequestStatus.COMPLETED, message: 'Great property!' },
    { tenantId: tenantIds[0], propertyId: propertyIds[15], status: RequestStatus.PENDING, message: 'Second property inquiry' },
    { tenantId: tenantIds[1], propertyId: propertyIds[16], status: RequestStatus.PENDING, message: 'Interested in downtown location' },
    { tenantId: tenantIds[2], propertyId: propertyIds[17], status: RequestStatus.CONNECTED, message: 'Need 2 bedroom apartment' },
    { tenantId: tenantIds[3], propertyId: propertyIds[18], status: RequestStatus.PENDING, message: 'Budget friendly option needed' },
    { tenantId: tenantIds[4], propertyId: propertyIds[19], status: RequestStatus.PENDING, message: 'Family of 4 looking for home' },
  ];

  const createdRequests = await prisma.request.createMany({ data: requests });
  console.log(`✅ Seeded ${createdRequests.count} requests`);
  
  return await prisma.request.findMany();
}
