require('dotenv').config();
const db = require('./config/db');

async function fixDatabase() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to database. Scanning schema...');
    
    // Check if category exists
    const [columns] = await connection.query('SHOW COLUMNS FROM services LIKE "category"');
    if (columns.length === 0) {
      console.log('⚠️ Column "category" is missing. Injecting now...');
      await connection.query('ALTER TABLE services ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT "Cleaning"');
      console.log('✅ Column "category" added successfully!');
    } else {
      console.log('✅ Column "category" already exists.');
    }
    
    // Check if image exists just in case
    const [imgCols] = await connection.query('SHOW COLUMNS FROM services LIKE "image"');
    if (imgCols.length === 0) {
      console.log('⚠️ Column "image" is missing. Injecting now...');
      await connection.query('ALTER TABLE services ADD COLUMN image VARCHAR(255) DEFAULT NULL');
      console.log('✅ Column "image" added successfully!');
    }
    
    // Check if description exists just in case
    const [descCols] = await connection.query('SHOW COLUMNS FROM services LIKE "description"');
    if (descCols.length === 0) {
      console.log('⚠️ Column "description" is missing. Injecting now...');
      await connection.query('ALTER TABLE services ADD COLUMN description TEXT DEFAULT NULL');
      console.log('✅ Column "description" added successfully!');
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update schema:', err.message);
    process.exit(1);
  }
}

fixDatabase();
