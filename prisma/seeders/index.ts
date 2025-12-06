import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users.seeder';
import { seedProperties } from './properties.seeder';
import { seedMedia } from './media.seeder';
import { seedRequests } from './requests.seeder';
import { seedCommissions } from './commissions.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.commission.deleteMany();
    await prisma.request.deleteMany();
    await prisma.media.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data\n');

    // Seed users
    console.log('👥 Seeding users...');
    const users = await seedUsers();
    
    // Get user IDs by role
    const landlordIds = users.filter(u => u.role === 'LANDLORD').map(u => u.id);
    const tenantIds = users.filter(u => u.role === 'TENANT').map(u => u.id);
    const commissionerIds = users.filter(u => u.role === 'COMMISSIONER').map(u => u.id);
    console.log(`   - ${landlordIds.length} landlords`);
    console.log(`   - ${tenantIds.length} tenants`);
    console.log(`   - ${commissionerIds.length} commissioners\n`);

    // Seed properties
    console.log('🏘️  Seeding properties...');
    const properties = await seedProperties(landlordIds);
    const propertyIds = properties.map(p => p.id);
    console.log(`   - ${properties.length} properties created\n`);

    // Seed media
    console.log('📸 Seeding media...');
    await seedMedia(propertyIds);
    console.log('');

    // Seed requests
    console.log('📩 Seeding requests...');
    await seedRequests(tenantIds, propertyIds);
    console.log('');

    // Seed commissions
    console.log('💰 Seeding commissions...');
    await seedCommissions(commissionerIds, propertyIds);
    console.log('');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Properties: ${properties.length}`);
    console.log(`   - Media: ~${properties.length * 4} images`);
    console.log(`   - Requests: 20`);
    console.log(`   - Commissions: 10`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
