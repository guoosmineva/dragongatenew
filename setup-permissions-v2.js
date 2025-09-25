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

    // Get public role
    const publicRole = await client.query(`SELECT * FROM up_roles WHERE type = 'public';`);
    
    if (publicRole.rows.length === 0) {
      console.log('No public role found, creating one...');
      const newRole = await client.query(`
        INSERT INTO up_roles (name, description, type, created_at, updated_at)
        VALUES ('Public', 'Default role given to unauthenticated user.', 'public', NOW(), NOW())
        RETURNING id;
      `);
      console.log(`Created public role with ID: ${newRole.rows[0].id}`);
    }

    const roleId = publicRole.rows[0]?.id || 2;
    console.log(`Using public role ID: ${roleId}`);

    // Clear existing permissions for this role
    await client.query(`DELETE FROM up_permissions_role_lnk WHERE role_id = $1`, [roleId]);
    await client.query(`DELETE FROM up_permissions WHERE id IN (
      SELECT permission_id FROM up_permissions_role_lnk WHERE role_id = $1
    )`, [roleId]);

    // Add API permissions
    const permissions = [
      'api::game.game.find',
      'api::game.game.findOne',
      'api::article.article.find', 
      'api::article.article.findOne'
    ];

    for (const action of permissions) {
      // Insert permission
      const permResult = await client.query(`
        INSERT INTO up_permissions (action, subject, properties, conditions, created_at, updated_at)
        VALUES ($1, NULL, '{}', '[]', NOW(), NOW())
        RETURNING id;
      `, [action]);

      const permId = permResult.rows[0].id;

      // Link permission to role
      await client.query(`
        INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
        VALUES ($1, $2, $3);
      `, [permId, roleId, 1]);

      console.log(`✓ Added permission: ${action}`);
    }

    console.log('\n✅ Permissions setup complete!');

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

setupPermissions();
