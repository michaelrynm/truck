const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create 94 Drivers with Users
  const firstNames = [
    "Budi", "Ahmad", "Slamet", "Eko", "Joko", "Agus", "Hendra", "Bambang",
    "Dedi", "Yudi", "Andi", "Rudi", "Toni", "Doni", "Iwan", "Made",
    "Ketut", "Wayan", "Komang", "Putu", "Nengah", "Nyoman", "Gede", "Kadek",
    "Ilham", "Fahmi", "Rizky", "Arif", "Fajar", "Irfan", "Indra", "Lukman",
    "Mahendra", "Nugroho", "Oscar", "Pandu", "Qomar", "Rahmat", "Sugeng", "Teguh",
    "Usman", "Vino", "Wahyu", "Xaverius", "Yanto", "Zainal", "Asep", "Bayu",
    "Cahyo", "Dimas", "Edi", "Firman", "Gilang", "Haris", "Imam", "Jaya",
    "Kurnia", "Lutfi", "Maman", "Nanda", "Oka", "Prabowo", "Qadri", "Rendy",
    "Susanto", "Taufik", "Udin", "Veri", "Wawan", "Yoga", "Zulfikri", "Amir",
    "Beni", "Catur", "Dodi", "Endra", "Faisal", "Galih", "Habibi", "Ikhsan",
    "Jamal", "Kamal", "Lukas", "Marwan", "Naufal", "Omen", "Priya", "Qais",
    "Rama", "Satrio", "Tama", "Umar", "Viko", "Wira"
  ];

  const lastNames = [
    "Santoso", "Wijaya", "Riyadi", "Prasetyo", "Susilo", "Setiawan", "Gunawan", "Wibowo",
    "Firmansyah", "Kurniawan", "Saputra", "Hartono", "Suryanto", "Permana", "Setyawan", "Suardana",
    "Mahendra", "Sujana", "Ariana", "Sukerti", "Wardana", "Suteja", "Suryadi", "Pramana",
    "Ramadhan", "Abdullah", "Pratama", "Rahman", "Nugroho", "Hidayat", "Putra", "Wicaksono",
    "Kusuma", "Utama", "Saputro", "Hakim", "Atmaja", "Wirawan", "Hermawan", "Cahyono",
    "Sudarsono", "Priyanto", "Purnomo", "Santosa", "Widodo", "Susanto", "Winarno", "Mulyono",
    "Suharto", "Budiman", "Raharjo", "Suprapto", "Handoko", "Sugiarto", "Siswanto", "Maulana",
    "Syahputra", "Irawan", "Iswanto", "Nugraha", "Anwar", "Haryanto", "Subagyo", "Pribadi",
    "Laksono", "Darmawan", "Trianto", "Suryadi", "Nuryanto", "Murdiyanto", "Wahyudi", "Jatmiko",
    "Pranoto", "Hadiwijaya", "Sukamto", "Winarto", "Sanjaya", "Suryana", "Sasmita", "Mulia",
    "Perwira", "Kusumah", "Wijaksana", "Mahardika", "Nugraha", "Satria", "Wicaksana", "Permadi",
    "Kurniadi", "Adrianto", "Wibisono", "Setiadi", "Firmanto", "Hartawan"
  ];

  // Hash password (default: "password123")
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 0; i < 94; i++) {
    console.log(`Creating driver with user: ${i + 1}/94`);
    
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 93 ? i : ''}@driver.com`;

    // Create User first
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: fullName,
        role: "DRIVER", // Pastikan enum Role ada "DRIVER"
      },
    });

    // Create Driver linked to User
    const driver = await prisma.driver.create({
      data: {
        name: fullName,
        licenseNumber: `SIM-${String(10001 + i).padStart(5, '0')}`,
        phone: `08${String(1000000000 + i).slice(1)}`,
        address: `Jl. Raya No. ${i + 1}, Jakarta`,
        status: "ACTIVE",
        userId: user.id, // Link to user
      },
    });
  }

  console.log("Drivers and users created successfully");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });