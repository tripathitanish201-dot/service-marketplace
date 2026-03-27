require('dotenv').config();
const db = require('./config/db');

async function fixConstraints() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected. Fixing schema constraints...');
    
    // Drop bad constraints holding us back
    try {
      await connection.query('ALTER TABLE services DROP FOREIGN KEY services_ibfk_1');
      console.log('Removed services_ibfk_1');
    } catch (e) { console.log('services_ibfk_1 drop failed or missing', e.message); }

    try {
      await connection.query('ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_2');
      console.log('Removed bookings_ibfk_2');
    } catch (e) { console.log('bookings_ibfk_2 drop failed or missing', e.message); }
    
    // Re-add correct constraints mapping straight to user profiles
    await connection.query('ALTER TABLE services ADD CONSTRAINT fk_services_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE');
    await connection.query('ALTER TABLE bookings ADD CONSTRAINT fk_bookings_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE');

    console.log('✅ Constraints perfectly rebuilt to match React Backend!');

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

fixConstraints();
