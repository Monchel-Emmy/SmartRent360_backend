import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    // Admin
    {
      name: "Admin User",
      phone: "+250788000001",
      role: Role.ADMIN,
      verified: true,
      nationalId: "1199980012345678",
      password: hashedPassword,
    },

    // Commissioners (5)
    {
      name: "John Commissioner",
      phone: "+250788000002",
      role: Role.COMMISSIONER,
      verified: true,
      nationalId: "1199880012345679",
      password: hashedPassword,
    },
    {
      name: "Sarah Agent",
      phone: "+250788000003",
      role: Role.COMMISSIONER,
      verified: true,
      nationalId: "1199880012345680",
      password: hashedPassword,
    },
    {
      name: "David Broker",
      phone: "+250788000004",
      role: Role.COMMISSIONER,
      verified: true,
      nationalId: "1199880012345681",
      password: hashedPassword,
    },
    {
      name: "Emma Realtor",
      phone: "+250788000005",
      role: Role.COMMISSIONER,
      verified: true,
      nationalId: "1199880012345682",
      password: hashedPassword,
    },
    {
      name: "Michael Agent",
      phone: "+250788000006",
      role: Role.COMMISSIONER,
      verified: true,
      nationalId: "1199880012345683",
      password: hashedPassword,
    },

    // Landlords (10)
    {
      name: "Robert Landlord",
      phone: "+250788000007",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345684",
      password: hashedPassword,
    },
    {
      name: "Patricia Owner",
      phone: "+250788000008",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345685",
      password: hashedPassword,
    },
    {
      name: "James Property",
      phone: "+250788000009",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345686",
      password: hashedPassword,
    },
    {
      name: "Linda Estate",
      phone: "+250788000010",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345687",
      password: hashedPassword,
    },
    {
      name: "William House",
      phone: "+250788000011",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345688",
      password: hashedPassword,
    },
    {
      name: "Elizabeth Home",
      phone: "+250788000012",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345689",
      password: hashedPassword,
    },
    {
      name: "Charles Building",
      phone: "+250788000013",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345690",
      password: hashedPassword,
    },
    {
      name: "Mary Apartment",
      phone: "+250788000014",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345691",
      password: hashedPassword,
    },
    {
      name: "Thomas Villa",
      phone: "+250788000015",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345692",
      password: hashedPassword,
    },
    {
      name: "Jennifer Residence",
      phone: "+250788000016",
      role: Role.LANDLORD,
      verified: true,
      nationalId: "1199780012345693",
      password: hashedPassword,
    },

    // Tenants (15)
    {
      name: "Daniel Tenant",
      phone: "+250788000017",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345694",
      password: hashedPassword,
    },
    {
      name: "Nancy Renter",
      phone: "+250788000018",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345695",
      password: hashedPassword,
    },
    {
      name: "Paul Seeker",
      phone: "+250788000019",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345696",
      password: hashedPassword,
    },
    {
      name: "Karen Looking",
      phone: "+250788000020",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345697",
      password: hashedPassword,
    },
    {
      name: "Mark Student",
      phone: "+250788000021",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345698",
      password: hashedPassword,
    },
    {
      name: "Lisa Young",
      phone: "+250788000022",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345699",
      password: hashedPassword,
    },
    {
      name: "Steven Worker",
      phone: "+250788000023",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345700",
      password: hashedPassword,
    },
    {
      name: "Betty Professional",
      phone: "+250788000024",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345701",
      password: hashedPassword,
    },
    {
      name: "Edward Family",
      phone: "+250788000025",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345702",
      password: hashedPassword,
    },
    {
      name: "Sandra Single",
      phone: "+250788000026",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345703",
      password: hashedPassword,
    },
    {
      name: "Brian Graduate",
      phone: "+250788000027",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345704",
      password: hashedPassword,
    },
    {
      name: "Dorothy Couple",
      phone: "+250788000028",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345705",
      password: hashedPassword,
    },
    {
      name: "Ronald Expat",
      phone: "+250788000029",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345706",
      password: hashedPassword,
    },
    {
      name: "Michelle Intern",
      phone: "+250788000030",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345707",
      password: hashedPassword,
    },
    {
      name: "Kevin Newcomer",
      phone: "+250788000031",
      role: Role.TENANT,
      verified: true,
      nationalId: "1199680012345708",
      password: hashedPassword,
    },
  ];

  const createdUsers = await prisma.user.createMany({ data: users });
  console.log(`✅ Seeded ${createdUsers.count} users`);

  return await prisma.user.findMany();
}
