import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageUrls = [
  'https://img.freepik.com/free-photo/house-isolated-field_1303-23773.jpg',
  'https://img.freepik.com/free-photo/3d-rendering-house-model_23-2150799725.jpg',
  'https://img.freepik.com/free-psd/3d-house-property-illustration_23-2151682352.jpg',
  'https://img.freepik.com/free-photo/3d-view-house-model_23-2150761170.jpg',
  'https://img.freepik.com/free-photo/hand-holding-house-real-estate-property-model_53876-129010.jpg',
  'https://img.freepik.com/free-psd/3d-house-property-illustration_23-2151682354.jpg',
  'https://img.freepik.com/free-photo/3d-rendering-house-model_23-2150799641.jpg',
  'https://img.freepik.com/free-photo/hand-presenting-model-house-home-loan-campaign_53876-104970.jpg',
  'https://img.freepik.com/free-photo/3d-rendering-house-model_23-2150799681.jpg',
  'https://img.freepik.com/free-photo/3d-view-house-model_23-2150761178.jpg',
  'https://img.freepik.com/free-photo/house-isolated-field_1303-23772.jpg',
  'https://img.freepik.com/free-ai-image/beautiful-suburban-house-with-green-lawn-sunny-day_23-2151974428.jpg',
  'https://img.freepik.com/free-vector/cute-house_23-2147503036.jpg',
  'https://img.freepik.com/free-vector/house-with-red-roof-isolated_1284-41870.jpg',
  'https://img.freepik.com/free-vector/flat-design-house-silhouette-set_23-2150276904.jpg',
  'https://img.freepik.com/free-ai-image/3d-house-model-with-modern-architecture_23-2151004067.jpg',
  'https://img.freepik.com/free-photo/charming-yellow-house-with-wooden-windows-green-grassy-garden_181624-8074.jpg',
  'https://img.freepik.com/free-vector/beautiful-home_24877-50818.jpg',
  'https://img.freepik.com/free-vector/beautiful-home_24877-50819.jpg',
  'https://img.freepik.com/free-photo/3d-rendering-loft-luxury-living-room-with-bookshelf-near-bookshelf_105762-2224.jpg',
  'https://img.freepik.com/free-vector/collection-modern-different-houses_23-2148651592.jpg',
  'https://img.freepik.com/free-ai-image/three-dimensional-house-model_23-2151003972.jpg',
  'https://img.freepik.com/free-vector/house-sale-with-sign_23-2148658969.jpg',
  'https://img.freepik.com/free-vector/private-houses-set_1284-12684.jpg',
  'https://img.freepik.com/free-vector/buildings_1201-788.jpg',
  'https://img.freepik.com/free-vector/realistic-house_23-2147510796.jpg',
  'https://img.freepik.com/free-vector/modern-cottage-houses-set_74855-305.jpg',
  'https://img.freepik.com/free-ai-image/3d-house-model-with-modern-architecture_23-2151004030.jpg',
  'https://img.freepik.com/free-vector/set-colorful-different-houses_23-2148651846.jpg',
  'https://img.freepik.com/free-psd/modern-twostory-house-architectural-design-render_632498-24123.jpg',
];

export async function seedMedia(propertyIds: string[]) {
  const mediaData = [];

  for (let i = 0; i < propertyIds.length; i++) {
    const imageCount = Math.floor(Math.random() * 3) + 3; // 3-5 images
    
    for (let j = 0; j < imageCount; j++) {
      const imageIndex = (i * 5 + j) % imageUrls.length;
      mediaData.push({
        propertyId: propertyIds[i],
        url: imageUrls[imageIndex],
        name: `Property Image ${j + 1}`,
        description: `View ${j + 1} of the property`,
      });
    }
  }

  const createdMedia = await prisma.media.createMany({ data: mediaData });
  console.log(`✅ Seeded ${createdMedia.count} media items`);
  
  return await prisma.media.findMany();
}
