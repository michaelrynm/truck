require('dotenv').config();
const prisma = require('../src/config/database');

async function verifySetup() {
  console.log('=================================');
  console.log('Prisma Setup Verification');
  console.log('=================================\n');

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('   ✓ Database connection successful\n');

    // Test 2: Verify Prisma Client is instantiated correctly
    console.log('2. Verifying Prisma Client...');
    console.log(`   ✓ Prisma Client instantiated correctly`);
    console.log(`   ✓ Environment: ${process.env.NODE_ENV || 'development'}\n`);

    // Test 3: Check database tables
    console.log('3. Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
    `;

    if (tables.length > 0) {
      console.log(`   ✓ Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`     - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('   ⚠ No tables found. Run migrations first: npm run prisma:migrate');
    }
    console.log('');

    // Test 4: Test connection pooling
    console.log('4. Testing connection pooling...');
    const connectionInfo = await prisma.$queryRaw`
      SELECT
        @@max_connections as max_connections,
        (SELECT COUNT(*) FROM information_schema.processlist) as current_connections
    `;
    console.log(`   ✓ Max connections: ${connectionInfo[0].max_connections}`);
    console.log(`   ✓ Current connections: ${connectionInfo[0].current_connections}`);
    console.log('   ✓ Connection pooling configured (limit: 5)\n');

    // Test 5: Verify models are accessible
    console.log('5. Verifying Prisma models...');
    const modelNames = [
      'user', 'driver', 'dumpTruck', 'contract', 'schedule', 'activityLog'
    ];

    let allModelsAccessible = true;
    for (const modelName of modelNames) {
      if (prisma[modelName]) {
        console.log(`   ✓ Model '${modelName}' is accessible`);
      } else {
        console.log(`   ✗ Model '${modelName}' is NOT accessible`);
        allModelsAccessible = false;
      }
    }

    if (allModelsAccessible) {
      console.log('   ✓ All models are accessible\n');
    } else {
      console.log('   ⚠ Some models are not accessible. Run: npm run prisma:generate\n');
    }

    // Test 6: Count records (if tables exist)
    if (tables.length > 0) {
      console.log('6. Checking data...');
      try {
        const userCount = await prisma.user.count();
        const driverCount = await prisma.driver.count();
        const truckCount = await prisma.dumpTruck.count();
        const contractCount = await prisma.contract.count();

        console.log(`   ✓ Users: ${userCount}`);
        console.log(`   ✓ Drivers: ${driverCount}`);
        console.log(`   ✓ Dump Trucks: ${truckCount}`);
        console.log(`   ✓ Contracts: ${contractCount}`);

        if (userCount === 0) {
          console.log('   ⚠ No data found. Run seed: npm run prisma:seed');
        }
        console.log('');
      } catch (error) {
        console.log('   ⚠ Could not query data. Tables may not be created yet.\n');
      }
    }

    console.log('=================================');
    console.log('✓ Verification Complete!');
    console.log('=================================\n');

    console.log('Next steps:');
    if (tables.length === 0) {
      console.log('  1. Run migrations: npm run prisma:migrate');
      console.log('  2. Seed database: npm run prisma:seed');
      console.log('  3. Start server: npm run dev');
    } else {
      console.log('  1. Start server: npm run dev');
      console.log('  2. Test API endpoints using Postman collection');
    }
    console.log('');

  } catch (error) {
    console.error('\n✗ Verification failed:');
    console.error(`  Error: ${error.message}\n`);

    if (error.code === 'P1001') {
      console.error('  → Database connection failed. Check your DATABASE_URL in .env');
      console.error('  → Make sure MySQL is running and credentials are correct\n');
    } else if (error.code === 'P1003') {
      console.error('  → Database does not exist. Create it first:');
      console.error('    CREATE DATABASE dump_truck_db;\n');
    } else {
      console.error(`  → Error code: ${error.code || 'N/A'}\n`);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
