const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function setupAdminUser() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'game_catalog_db',
    user: 'strapi_user',
    password: 'secure_password_123',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Create admin_users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Hash password
    const hashedPassword = await bcrypt.hash('GameVault2025!', 10);

    // Insert admin user
    await client.query(`
      INSERT INTO admin_users (email, password, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET 
        password = EXCLUDED.password,
        updated_at = NOW();
    `, ['admin@gamevault.com', hashedPassword]);

    console.log('✅ Admin user created/updated successfully');
    console.log('Email: admin@gamevault.com');
    console.log('Password: GameVault2025!');

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

setupAdminUser();
