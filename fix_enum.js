require('dotenv').config();
const db = require('./config/db');

async function fixEnum() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected. Patching bookings ENUM constraint...');
    
    await connection.query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending'");

    console.log('✅ Bookings table ENUM updated to perfectly match Node backend!');

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

fixEnum();
