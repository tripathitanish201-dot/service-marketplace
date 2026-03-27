require('dotenv').config();
const db = require('./config/db');

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('\n==================================\n');
    console.log('✅ DATABASE CONNECTION SUCCESSFUL!');
    console.log(`Connected to host: ${process.env.DB_HOST}, database: ${process.env.DB_NAME}`);
    
    // Check if tables exist
    const [rows] = await connection.query('SHOW TABLES');
    const tableNames = rows.map(row => Object.values(row)[0]);
    console.log(`✅ Found ${rows.length} tables in the database: ${tableNames.join(', ')}`);
    console.log('\n==================================\n');
    
    connection.release();
    process.exit(0);
  } catch (err) {
    console.log('\n==================================\n');
    console.error('❌ DATABASE CONNECTION FAILED');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('-> FIX: MySQL is not running! Please open XAMPP and click "Start" next to MySQL.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('-> FIX: Your MySQL password is wrong. Check DB_PASSWORD in your .env file.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('-> FIX: The database does not exist. Did you run the database.sql file in phpMyAdmin?');
    }
    console.log('\n==================================\n');
    process.exit(1);
  }
}

testConnection();
