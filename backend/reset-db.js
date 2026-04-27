const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, 'agency.db');
const dbShmPath = path.join(__dirname, 'agency.db-shm');
const dbWalPath = path.join(__dirname, 'agency.db-wal');

console.log('🗑️  Removing old database files...');

try {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  if (fs.existsSync(dbShmPath)) fs.unlinkSync(dbShmPath);
  if (fs.existsSync(dbWalPath)) fs.unlinkSync(dbWalPath);
  console.log('✅ Old database removed');
} catch (err) {
  console.error('❌ Error removing database:', err.message);
}

console.log('\n🔄 Reloading database with fresh seed...');

// Now require the database module which will recreate and seed everything
delete require.cache[require.resolve('./config/database')];
const db = require('./config/database');

console.log('\n✅ Database reset complete!');
console.log(`\n📝 Login credentials:`);
console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@agency.com'}`);
console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

process.exit(0);
