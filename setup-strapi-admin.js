const axios = require('axios');

async function setupStrapiAdmin() {
  const STRAPI_URL = 'http://localhost:1337';
  
  try {
    console.log('Setting up Strapi admin user...');

    // Check if admin user already exists
    const checkAdmin = await axios.get(`${STRAPI_URL}/admin/init`).catch(() => null);
    
    if (checkAdmin && checkAdmin.data && !checkAdmin.data.hasAdmin) {
      console.log('Creating admin user...');
      
      // Register admin user
      const adminData = {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@gamevault.com',
        password: 'GameVault2025!',
        confirmPassword: 'GameVault2025!'
      };

      const registerResponse = await axios.post(`${STRAPI_URL}/admin/register-admin`, adminData);
      console.log('✅ Admin user created successfully');
      
      // Login to get JWT token
      const loginResponse = await axios.post(`${STRAPI_URL}/admin/login`, {
        email: adminData.email,
        password: adminData.password
      });
      
      const token = loginResponse.data.data.token;
      console.log('✅ Admin login successful');

      // Set API permissions for public role
      const headers = { Authorization: `Bearer ${token}` };
      
      // Get public role
      const rolesResponse = await axios.get(`${STRAPI_URL}/admin/users-permissions/roles`, { headers });
      const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
      
      if (publicRole) {
        console.log(`Found public role: ${publicRole.name}`);
        
        // Update permissions
        const permissions = {
          ...publicRole.permissions,
          'api::game': {
            controllers: {
              game: {
                find: { enabled: true, policy: '' },
                findOne: { enabled: true, policy: '' }
              }
            }
          },
          'api::article': {
            controllers: {
              article: {
                find: { enabled: true, policy: '' },
                findOne: { enabled: true, policy: '' }
              }
            }
          }
        };

        await axios.put(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
          ...publicRole,
          permissions
        }, { headers });
        
        console.log('✅ API permissions updated');
      }
      
    } else {
      console.log('Admin user already exists');
      
      // Try to login with existing admin
      try {
        const loginResponse = await axios.post(`${STRAPI_URL}/admin/login`, {
          email: 'admin@gamevault.com',
          password: 'GameVault2025!'
        });
        console.log('✅ Admin login successful with existing credentials');
      } catch (error) {
        console.log('ℹ️ Could not login with default credentials');
      }
    }

    // Test API endpoint
    console.log('\nTesting API endpoints...');
    const gamesResponse = await axios.get(`${STRAPI_URL}/api/games`);
    console.log(`✅ Games API working: Found ${gamesResponse.data.data?.length || 0} games`);

  } catch (error) {
    console.error('Setup error:', error.response?.data || error.message);
  }
}

setupStrapiAdmin();