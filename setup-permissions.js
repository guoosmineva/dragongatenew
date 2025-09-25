const { Client } = require('pg');

async function setupPermissions() {
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

    // Check if there's an existing public role
    const publicRole = await client.query(`
      SELECT * FROM up_roles WHERE type = 'public';
    `);

    let roleId;
    if (publicRole.rows.length > 0) {
      roleId = publicRole.rows[0].id;
      console.log(`Found public role with ID: ${roleId}`);
    } else {
      // Create public role if it doesn't exist
      const newRole = await client.query(`
        INSERT INTO up_roles (name, description, type, created_at, updated_at)
        VALUES ('Public', 'Default role given to unauthenticated user.', 'public', NOW(), NOW())
        RETURNING id;
      `);
      roleId = newRole.rows[0].id;
      console.log(`Created public role with ID: ${roleId}`);
    }

    // Set up permissions for games API
    const permissions = [
      {
        action: 'api::game.game.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::game.game.findOne',  
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::article.article.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::article.article.findOne',
        subject: null,
        properties: {},
        conditions: []
      }
    ];

    // Clear existing permissions for this role
    await client.query(`DELETE FROM up_permissions WHERE role = $1`, [roleId]);
    console.log('Cleared existing permissions');

    // Insert new permissions
    for (const perm of permissions) {
      try {
        await client.query(`
          INSERT INTO up_permissions (action, subject, properties, conditions, role, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [
          perm.action,
          perm.subject,
          JSON.stringify(perm.properties),
          JSON.stringify(perm.conditions),
          roleId
        ]);
        console.log(`✓ Added permission: ${perm.action}`);
      } catch (error) {
        console.log(`✗ Failed to add permission ${perm.action}:`, error.message);
      }
    }

    console.log('\n✅ Permissions setup complete');

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

setupPermissions();