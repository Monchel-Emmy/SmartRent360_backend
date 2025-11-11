// Quick script to test PostgreSQL connection
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log('Testing PostgreSQL connection...');
console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL!');
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('✅ PostgreSQL version:', result.rows[0].version);
    return client.query("SELECT 1 FROM pg_database WHERE datname = 'smartrent360'");
  })
  .then((result) => {
    if (result.rows.length === 0) {
      console.log('⚠️  Database "smartrent360" does not exist yet.');
      console.log('   Creating database...');
      return client.query('CREATE DATABASE smartrent360');
    } else {
      console.log('✅ Database "smartrent360" exists!');
    }
  })
  .then(() => {
    console.log('✅ Everything looks good!');
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed!');
    console.error('Error:', err.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify your password is correct');
    console.error('3. Check if PostgreSQL is installed');
    console.error('4. Try restarting PostgreSQL service');
    client.end();
    process.exit(1);
  });


