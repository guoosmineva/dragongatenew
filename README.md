# GameVault - Interactive Game Catalog

A complete interactive game catalog web application with Next.js 14 frontend and PostgreSQL 15 database.

## 🎮 Features

- **Multi-language Support**: Indonesian (default) and English
- **Game Catalog**: 13+ games with search, filtering, and categorization
- **Admin Panel**: Secure game management with authentication
- **Responsive Design**: Mobile-friendly interface
- **Blog System**: Gaming articles and news
- **Real-time Updates**: Direct PostgreSQL database integration

---

# 🚀 Production Deployment Guide for VPS

Complete step-by-step instructions for deploying GameVault on a VPS server running as root.

**Target Configuration:**
- Domain: `https://viva-productions.com/`
- Admin User: `user_davod` / `Kimmy#1234`
- Database: PostgreSQL 15 on localhost:5432
- SSL: Let's Encrypt certificates
- **Architecture**: Next.js + PostgreSQL (Strapi skipped due to memory optimization)

---

## Step 1: Server Prerequisites

### 1.1 Update System
```bash
apt update && apt upgrade -y
```

### 1.2 Install Node.js 20.x LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

### 1.3 Install Yarn and PM2
```bash
npm install -g yarn pm2
```

### 1.4 Install PostgreSQL 15
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### 1.5 Install Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 1.6 Install Certbot for SSL
```bash
apt install -y certbot python3-certbot-nginx
```

### 1.7 Verify Installations
```bash
node --version    # Should show v20.x
yarn --version    # Should show 1.22.x or higher
psql --version    # Should show 15.x
nginx -v          # Should show nginx version
pm2 --version     # Should show PM2 version
```

---

## Step 2: Database Setup

### 2.1 Configure PostgreSQL
```bash
# Switch to postgres user and create database
sudo -u postgres psql << EOF
CREATE DATABASE game_catalog_db;
CREATE USER strapi_user WITH PASSWORD 'SecurePassword2025!';
GRANT ALL PRIVILEGES ON DATABASE game_catalog_db TO strapi_user;
GRANT ALL ON SCHEMA public TO strapi_user;
ALTER USER strapi_user CREATEDB;
\q
EOF
```

### 2.2 Test Database Connection
```bash
sudo -u postgres psql game_catalog_db -c "SELECT version();"
```

---

## Step 3: Project Setup

### 3.1 Clone Project
```bash
# Create project directory
mkdir -p /var/www/gamevault
cd /var/www/gamevault

# Clone or upload your project files here
# If using git: git clone <your-repository-url> .
# Or upload files via SCP/SFTP
```

### 3.2 Install Dependencies
```bash
cd /var/www/gamevault
yarn install
```

---

## Step 4: Environment Configuration

### 4.1 Next.js Environment Variables
```bash
cd /var/www/gamevault
cat > .env << EOF
# Production URLs
NEXT_PUBLIC_BASE_URL=https://viva-productions.com
NEXT_PUBLIC_STRAPI_URL=https://viva-productions.com

# CORS Configuration
CORS_ORIGINS=https://viva-productions.com,https://www.viva-productions.com

# JWT Security
JWT_SECRET=GameVault_Production_JWT_Secret_2025_Very_Long_And_Secure

# PostgreSQL Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=game_catalog_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=SecurePassword2025!
EOF
```

---

## Step 5: Database Tables and Initial Data

### 5.1 Create Database Tables
```bash
sudo -u postgres psql game_catalog_db << EOF
-- Games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(255),
    title VARCHAR(200),
    description TEXT,
    category VARCHAR(50),
    download_url VARCHAR(500),
    slug VARCHAR(250) UNIQUE,
    featured BOOLEAN DEFAULT FALSE,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP DEFAULT NOW(),
    created_by_id INTEGER,
    updated_by_id INTEGER,
    locale VARCHAR(10) DEFAULT 'en'
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table (for blog)
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(255),
    title VARCHAR(300),
    content TEXT,
    excerpt VARCHAR(500),
    slug VARCHAR(250) UNIQUE,
    published_date TIMESTAMP DEFAULT NOW(),
    author VARCHAR(100) DEFAULT 'Admin',
    tags JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP DEFAULT NOW(),
    locale VARCHAR(10) DEFAULT 'en'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
\q
EOF
```

### 5.2 Seed Games and Admin User
```bash
cd /var/www/gamevault
cat > seed-production.js << 'EOF'
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const gamesData = [
  { title: 'Wukong', description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.', category: 'Action', download_url: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip', slug: 'wukong', featured: true, downloads: 125000 },
  { title: 'Call Me Champion', description: 'Intense competitive fighting game where you battle to become the ultimate champion. Master various fighting styles and defeat opponents in epic tournaments.', category: 'Action', download_url: 'https://goc-cdn.qqby.cn/jwgj/ChampionTK_2.2.2.zip', slug: 'call-me-champion', featured: true, downloads: 89000 },
  { title: 'Dragonball Showdown', description: 'High-energy fighting game featuring your favorite Dragon Ball characters. Unleash devastating attacks and experience the ultimate anime fighting experience.', category: 'Action', download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/lzTK/DragonBall_tk_v1.0.3.zip', slug: 'dragonball-showdown', featured: true, downloads: 156000 },
  { title: 'Jiang Hu', description: 'Immersive martial arts RPG set in ancient China. Master kung fu techniques, explore vast landscapes, and forge your legend in the world of martial arts.', category: 'RPG', download_url: 'https://goc-cdn.qqby.cn/jh/JiangHu_tk_v1.0.18.zip', slug: 'jiang-hu', featured: false, downloads: 67000 },
  { title: 'Civilization', description: 'Build and expand your empire through the ages. Develop technologies, wage wars, and lead your civilization to greatness in this epic strategy game.', category: 'Strategy', download_url: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip', slug: 'civilization', featured: true, downloads: 234000 },
  { title: 'Wulin: King of War', description: 'Strategic warfare game combining martial arts with tactical combat. Lead your army of warriors and conquer territories in ancient battlefields.', category: 'Strategy', download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/crawler_tk/KingWar_tk_v1.0.33.zip', slug: 'wulin-king-of-war', featured: false, downloads: 92000 },
  { title: 'Game Peta', description: 'Strategic puzzle game that challenges your mind. Plan your moves carefully and outsmart your opponents in this engaging strategy experience.', category: 'Strategy', download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/sglzTK/SgltTK_1.0.4.zip', slug: 'game-peta', featured: false, downloads: 43000 },
  { title: 'Color Fortress', description: 'Defend your colorful fortress in this strategic tower defense game. Build defenses, upgrade your fortress, and repel waves of invaders.', category: 'Strategy', download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/scbl/scblTT_1.0.34.zip', slug: 'color-fortress', featured: false, downloads: 78000 },
  { title: 'Crown Fight', description: 'Battle for the crown in this intense action-packed combat game. Fight through challenging opponents and claim your rightful place as ruler.', category: 'Action', download_url: 'https://goc-cdn.qqby.cn/crawler_tk/CrownFight_tk_v1.0.26.zip', slug: 'crown-fight', featured: false, downloads: 112000 },
  { title: 'Cheese Wars', description: 'Embark on a whimsical adventure in the world of cheese! Navigate through fun challenges and obstacles in this delightful family-friendly game.', category: 'Adventure', download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/QosTT/Release/QosTT_1.0.19.zip', slug: 'cheese-wars', featured: false, downloads: 95000 },
  { title: 'Clash of Clans', description: 'The classic strategy game where you build your village, train troops, and battle other players. Join clans and participate in epic clan wars.', category: 'Strategy', download_url: 'https://qqby-goc-hk.oss-cn-hongkong.aliyuncs.com/blct/blctTT_1.0.10.zip', slug: 'clash-of-clans', featured: true, downloads: 456000 },
  { title: 'Minions', description: 'Join the lovable Minions on their hilarious adventure! Experience fun-filled gameplay with your favorite yellow characters in this family game.', category: 'Adventure', download_url: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip', slug: 'minions', featured: false, downloads: 187000 },
  { title: 'The Sheep Village', description: 'Build and manage your own peaceful sheep village. Take care of your flock, expand your farm, and create the perfect pastoral paradise.', category: 'Simulation', download_url: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip', slug: 'sheep-village', featured: false, downloads: 134000 }
];

async function seedDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'game_catalog_db',
    user: 'strapi_user',
    password: 'SecurePassword2025!',
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Insert games
    for (const game of gamesData) {
      try {
        await client.query(`
          INSERT INTO games (title, description, category, download_url, slug, featured, downloads, created_at, updated_at, published_at, locale)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW(), 'en')
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            downloads = EXCLUDED.downloads,
            updated_at = NOW();
        `, [game.title, game.description, game.category, game.download_url, game.slug, game.featured, game.downloads]);
        console.log(`✅ ${game.title}`);
      } catch (error) {
        console.log(`❌ ${game.title}: ${error.message}`);
      }
    }

    // Create admin user with specified credentials
    const hashedPassword = await bcrypt.hash('Kimmy#1234', 10);
    await client.query(`
      INSERT INTO admin_users (email, password) 
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;
    `, ['user_davod@viva-productions.com', hashedPassword]);
    console.log('✅ Admin user created: user_davod@viva-productions.com');

    const count = await client.query('SELECT COUNT(*) FROM games');
    console.log(`\n🎯 Total games: ${count.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

seedDatabase();
EOF

# Install required packages for seeding
yarn add pg bcryptjs

# Run the seeding script
node seed-production.js
```

---

## Step 6: Build and Start Application

### 6.1 Build Next.js Frontend
```bash
cd /var/www/gamevault
yarn build
```

### **Note: Strapi Skipped Due to Memory Optimization**
*Strapi requires significant memory to build. Your GameVault app is designed to work perfectly with direct PostgreSQL integration through Next.js API routes, providing the same functionality with better performance on smaller VPS instances.*

---

## Step 7: PM2 Process Management

### 7.1 Create PM2 Ecosystem Configuration
```bash
cd /var/www/gamevault
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'gamevault-nextjs',
      script: 'yarn',
      args: 'start',
      cwd: '/var/www/gamevault',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/gamevault-nextjs-error.log',
      out_file: '/var/log/pm2/gamevault-nextjs-out.log',
      log_file: '/var/log/pm2/gamevault-nextjs.log'
    },
    {
      name: 'gamevault-strapi',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/gamevault/game-catalog-cms',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
        HOST: '0.0.0.0'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/gamevault-strapi-error.log',
      out_file: '/var/log/pm2/gamevault-strapi-out.log',
      log_file: '/var/log/pm2/gamevault-strapi.log'
    }
  ]
};
EOF
```

### 7.2 Create Log Directory
```bash
mkdir -p /var/log/pm2
```

### 7.3 Start Applications with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the instructions output by the startup command
```

### 7.4 Verify Applications Are Running
```bash
pm2 status
```

You should see both applications running:
```
┌─────┬──────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name             │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼──────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ gamevault-nextjs │ default     │ N/A     │ fork    │ 12345    │ 30s    │ 0    │ online    │ 0%       │ 85.2mb   │ root     │ disabled │
│ 1   │ gamevault-strapi │ default     │ N/A     │ fork    │ 12346    │ 25s    │ 0    │ online    │ 0%       │ 120.5mb  │ root     │ disabled │
└─────┴──────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## Step 8: Nginx Reverse Proxy Configuration

### 8.1 Create Nginx Virtual Host
```bash
cat > /etc/nginx/sites-available/viva-productions << EOF
server {
    listen 80;
    server_name viva-productions.com www.viva-productions.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    # Client upload size
    client_max_body_size 10M;
    
    # Next.js frontend (main application)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
    
    # Strapi CMS API endpoints
    location /strapi/ {
        proxy_pass http://localhost:1337/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # Strapi Admin Panel
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
    }
}
EOF
```

### 8.2 Enable Site and Test Configuration
```bash
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable the new site
ln -sf /etc/nginx/sites-available/viva-productions /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## Step 9: SSL Certificate with Let's Encrypt

### 9.1 Obtain SSL Certificate
```bash
certbot --nginx -d viva-productions.com -d www.viva-productions.com --non-interactive --agree-tos --email admin@viva-productions.com
```

### 9.2 Test SSL Renewal
```bash
certbot renew --dry-run
```

### 9.3 Set Up Auto-renewal
```bash
# Add to crontab for automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## Step 10: Firewall Configuration

### 10.1 Configure UFW Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## Step 11: Testing and Verification

### 11.1 Test Local API Endpoints
```bash
curl http://localhost:3000/api/games
curl http://localhost:3000/api/strapi/games
curl http://localhost:1337/api/games
```

### 11.2 Test External Access
```bash
curl https://viva-productions.com/api/games
```

### 11.3 Verify Database Data
```bash
sudo -u postgres psql game_catalog_db -c "SELECT title, category, downloads FROM games ORDER BY downloads DESC LIMIT 5;"
```

---

## Step 12: Create Strapi Admin User

### 12.1 Access Strapi Admin Panel
Visit: `https://viva-productions.com/admin`

### 12.2 Create Admin Account
- Email: `user_davod@viva-productions.com`
- Password: `Kimmy#1234`
- First Name: `Davod`
- Last Name: `User`

### 12.3 Configure API Permissions
1. Go to Settings → Roles → Public
2. Enable permissions for:
   - Game: find, findOne
   - Article: find, findOne

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Connection Refused" on Port 3000
```bash
# Check if Next.js is running
pm2 status
pm2 logs gamevault-nextjs

# If not running, restart
pm2 restart gamevault-nextjs

# Check what's using port 3000
netstat -tlnp | grep :3000
```

#### 2. Database Connection Errors
```bash
# Check PostgreSQL status
systemctl status postgresql

# Test database connection
sudo -u postgres psql game_catalog_db -c "SELECT COUNT(*) FROM games;"

# If connection fails, check credentials in .env files
```

#### 3. Nginx 502 Bad Gateway
```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Force renewal if needed
certbot renew --force-renewal
```

#### 5. Permission Issues
```bash
# Set correct ownership
chown -R root:root /var/www/gamevault
chmod -R 755 /var/www/gamevault

# Secure environment files
chmod 600 /var/www/gamevault/.env
chmod 600 /var/www/gamevault/game-catalog-cms/.env
```

#### 6. Memory Issues
```bash
# Check system resources
free -h
df -h

# Restart applications if memory usage is high
pm2 restart all
```

### Debugging Commands

```bash
# Application status
pm2 status
pm2 monit

# View logs
pm2 logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Test API endpoints
curl http://localhost:3000/api/games
curl http://localhost:1337/api/games
curl https://viva-productions.com/api/games

# Database queries
sudo -u postgres psql game_catalog_db -c "SELECT * FROM games LIMIT 3;"

# Check running processes
netstat -tlnp | grep -E ':3000|:1337|:80|:443'
```

---

## 📱 Application Access

### Frontend Website
- **URL**: https://viva-productions.com/
- **Features**: Game catalog, search, trending games, blog
- **Languages**: Indonesian (default), English

### Admin Panel
- **URL**: https://viva-productions.com/admin (Next.js admin)
- **Strapi CMS**: https://viva-productions.com/admin (Strapi admin)
- **Credentials**: user_davod@viva-productions.com / Kimmy#1234

### API Endpoints
- **Games**: https://viva-productions.com/api/games
- **Search**: https://viva-productions.com/api/games?search=wukong
- **Categories**: https://viva-productions.com/api/games?category=Action
- **Featured**: https://viva-productions.com/api/games?featured=true

---

## 🔒 Security Checklist

- [ ] Change default database passwords
- [ ] Update JWT secrets with strong random values
- [ ] Enable firewall (UFW) with proper rules
- [ ] SSL certificates installed and auto-renewing
- [ ] Regular database backups configured
- [ ] File permissions properly set
- [ ] Environment variables secured

---

## 🚀 Maintenance

### Daily Monitoring
```bash
# Check application health
pm2 status
systemctl status nginx postgresql

# View recent logs
pm2 logs --lines 50
```

### Weekly Maintenance
```bash
# Update system packages
apt update && apt upgrade -y

# Restart applications
pm2 restart all

# Check disk space
df -h

# Backup database
sudo -u postgres pg_dump game_catalog_db > /var/backups/gamevault-$(date +%Y%m%d).sql
```

### Database Backup Script
```bash
cat > /usr/local/bin/backup-gamevault << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/gamevault"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
sudo -u postgres pg_dump game_catalog_db > \$BACKUP_DIR/gamevault_\$DATE.sql
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
echo "Backup completed: gamevault_\$DATE.sql"
EOF

chmod +x /usr/local/bin/backup-gamevault

# Schedule daily backups
echo "0 2 * * * /usr/local/bin/backup-gamevault" | crontab -
```

---

## 🎯 Production Verification

After completing all steps, verify your deployment:

1. **Frontend**: Visit https://viva-productions.com/ - should show Indonesian game catalog
2. **Language Switch**: Click EN/ID flags to test language switching
3. **Game Catalog**: Visit https://viva-productions.com/catalog - should show all games with search
4. **Trending Games**: Visit https://viva-productions.com/trending - should show trending games
5. **Blog**: Visit https://viva-productions.com/blog - should show articles
6. **Admin Panel**: Visit https://viva-productions.com/admin - login with user_davod credentials
7. **Strapi CMS**: Visit https://viva-productions.com/admin - access Strapi admin panel

### Expected Game Count
Your database should contain **13 games** across 6 categories:
- **Action**: Wukong, Call Me Champion, Dragonball Showdown, Crown Fight
- **Strategy**: Civilization, Clash of Clans, Wulin: King of War, Game Peta, Color Fortress  
- **RPG**: Jiang Hu
- **Adventure**: Cheese Wars, Minions
- **Simulation**: The Sheep Village

---

## 🆘 Emergency Recovery

If something goes wrong:

```bash
# Stop all services
pm2 stop all

# Check what's running on required ports
netstat -tlnp | grep -E ':3000|:1337'

# Kill any processes if needed
pkill -f next
pkill -f strapi

# Restart from scratch
pm2 delete all
pm2 start ecosystem.config.js
```

---

**🎊 Congratulations!** Your GameVault application should now be running successfully at https://viva-productions.com/ with full admin functionality, multi-language support, and all 13 games available for users to discover and download.