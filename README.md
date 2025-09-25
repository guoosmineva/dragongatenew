# GameVault - Interactive Game Catalog

A complete interactive game catalog web application with frontend + backend, featuring admin panel, multi-language support, and comprehensive game management.

## 🚀 Features

### Frontend Features
- **Home Page**: Featured games, articles, hero section
- **Catalog Page**: Complete game library with search and category filtering
- **Trending Games Page**: Hottest games with direct download buttons
- **Blog/Articles**: Gaming news and guides
- **Game Detail Pages**: Individual game pages with screenshots, info, and downloads
- **Multi-language Support**: Indonesian (default) and English with flag switching
- **Responsive Design**: Mobile-friendly across all devices
- **SEO Optimized**: Meta tags, clean URLs, structured data ready

### Backend Features
- **PostgreSQL 15 Database**: Production-grade database with 13+ games
- **Strapi 5 CMS**: Headless content management system
- **Admin Authentication**: JWT-based secure admin panel
- **CRUD Operations**: Full game management capabilities
- **API Endpoints**: RESTful APIs for games, search, filtering
- **Real-time Updates**: Live content updates

### Admin Panel
- **Secure Login**: JWT authentication with bcrypt password hashing
- **Dashboard**: Statistics and overview of games
- **Game Management**: Create, edit, delete games
- **Content Control**: Full control over featured games and categories

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Strapi 5
- **Database**: PostgreSQL 15
- **Authentication**: JWT + bcrypt
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Language**: English & Indonesian translations

---

# 🖥 VPS Deployment Guide

This guide provides complete step-by-step instructions for deploying GameVault on a VPS server.

## Prerequisites

- Ubuntu 20.04 LTS or newer VPS
- At least 2GB RAM, 2 CPU cores, 20GB storage
- Root or sudo access
- Domain name (optional but recommended)

## Step 1: Server Setup and Dependencies

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.3 Install PostgreSQL 15
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.4 Install PM2 Process Manager
```bash
sudo npm install -g pm2 yarn
```

### 1.5 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Database Setup

### 2.1 Create Database and User
```bash
sudo -u postgres psql << EOF
CREATE DATABASE game_catalog_db;
CREATE USER strapi_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE game_catalog_db TO strapi_user;
GRANT ALL ON SCHEMA public TO strapi_user;
\q
EOF
```

### 2.2 Test Database Connection
```bash
sudo -u postgres psql -d game_catalog_db -c "SELECT version();"
```

## Step 3: Application Deployment

### 3.1 Clone/Upload Project
```bash
# Create application directory
sudo mkdir -p /var/www/gamevault
sudo chown -R $USER:$USER /var/www/gamevault
cd /var/www/gamevault

# Copy your project files here
# If using git:
# git clone your-repository-url .
```

### 3.2 Install Dependencies
```bash
cd /var/www/gamevault
yarn install
```

### 3.3 Configure Environment Variables
```bash
# Create production environment file
cat > .env << EOF
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=game_catalog_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password_here

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
CORS_ORIGINS=*

# JWT Secret (generate a strong secret)
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_random

# Strapi Configuration (for CMS directory)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
EOF
```

### 3.4 Set Up Strapi CMS
```bash
cd /var/www/gamevault/game-catalog-cms

# Create Strapi environment
cat > .env << EOF
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=game_catalog_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password_here

HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret
EOF

# Install Strapi dependencies
npm install
```

## Step 4: Database Seeding

### 4.1 Run Database Seeding Scripts
```bash
cd /var/www/gamevault

# Create admin user
node setup-admin-user.js

# Seed games data
node seed-strapi-db.js
```

### 4.2 Verify Data
```bash
sudo -u postgres psql game_catalog_db -c "SELECT title, category, downloads FROM games LIMIT 5;"
```

## Step 5: Build and Start Applications

### 5.1 Build Next.js Application
```bash
cd /var/www/gamevault
yarn build
```

### 5.2 Create PM2 Configuration
```bash
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
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'gamevault-strapi',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/gamevault/game-catalog-cms',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF
```

### 5.3 Start Applications with PM2
```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions output by the command above
```

## Step 6: Nginx Configuration

### 6.1 Create Nginx Virtual Host
```bash
sudo cat > /etc/nginx/sites-available/gamevault << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Replace with your domain
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Next.js frontend
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
    }
    
    # Strapi CMS admin panel
    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Strapi API endpoints
    location /strapi/ {
        proxy_pass http://localhost:1337/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### 6.2 Enable Site and Test Configuration
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/gamevault /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: SSL Configuration with Let's Encrypt (Optional but Recommended)

### 7.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7.3 Auto-renewal Setup
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Step 8: Firewall Configuration

### 8.1 Configure UFW Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 9: Monitoring and Maintenance

### 9.1 Monitor Applications
```bash
# Check application status
pm2 status

# View logs
pm2 logs gamevault-nextjs
pm2 logs gamevault-strapi

# Monitor resources
pm2 monit
```

### 9.2 Database Backups
```bash
# Create backup script
sudo cat > /usr/local/bin/backup-gamevault << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/gamevault"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Database backup
sudo -u postgres pg_dump game_catalog_db > \$BACKUP_DIR/gamevault_\$DATE.sql

# Keep only last 7 backups
find \$BACKUP_DIR -name "gamevault_*.sql" -mtime +7 -delete

echo "Backup completed: gamevault_\$DATE.sql"
EOF

sudo chmod +x /usr/local/bin/backup-gamevault

# Setup daily backup cron job
echo "0 2 * * * /usr/local/bin/backup-gamevault" | sudo crontab -
```

## Step 10: Production Environment Variables

Update your production `.env` with secure values:

```bash
# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 64)
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Application Not Starting
```bash
# Check PM2 logs
pm2 logs

# Restart applications
pm2 restart all

# Check disk space
df -h
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql game_catalog_db -c "SELECT COUNT(*) FROM games;"
```

#### 3. Nginx Configuration Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. Performance Optimization
```bash
# Restart applications with increased memory
pm2 delete all
pm2 start ecosystem.config.js
```

## 📱 Admin Panel Access

### Default Admin Credentials
- **URL**: `https://yourdomain.com/admin`
- **Email**: `admin@gamevault.com`
- **Password**: `GameVault2025!`

**⚠️ Important**: Change the default admin password immediately after first login!

### Admin Features
- View game statistics and analytics
- Add, edit, and delete games
- Manage featured games
- Control content visibility
- Monitor download counts

## 🌐 API Endpoints

### Public APIs
- `GET /api/games` - Get all games
- `GET /api/games?featured=true` - Get featured games
- `GET /api/games?search=query` - Search games
- `GET /api/games?category=Action` - Filter by category
- `GET /api/games/[slug]` - Get single game

### Admin APIs (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/games` - Get all games (admin view)
- `POST /api/admin/games` - Create new game
- `PUT /api/admin/games/[id]` - Update game
- `DELETE /api/admin/games/[id]` - Delete game

## 🎮 Game Categories

The system supports the following game categories:
- **Action**: Fighting games, shooters, combat games
- **RPG**: Role-playing games, character progression
- **Strategy**: Tactical games, civilization builders
- **Adventure**: Story-driven games, exploration
- **Simulation**: Life simulation, management games
- **Puzzle**: Brain teasers, logic games

## 🌍 Multi-language Support

### Supported Languages
- **Indonesian (ID)**: Default language
- **English (EN)**: Secondary language

### Adding New Languages
1. Update `/lib/LanguageContext.js` with new translations
2. Add flag icon to `/components/LanguageSwitcher.js`
3. Update the language provider to include new locale

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Change all default passwords
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Monitor application logs

### Environment Variables Security
Never commit these sensitive values to version control:
- Database passwords
- JWT secrets
- API tokens
- Admin credentials

## 📊 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
```

### Nginx Caching
Add to your Nginx configuration:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Update all environment variables
- [ ] Test locally with production database
- [ ] Run database migrations
- [ ] Build application successfully
- [ ] Backup existing data (if applicable)

### Deployment
- [ ] Upload code to VPS
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up database
- [ ] Configure web server
- [ ] Start applications with PM2
- [ ] Test all endpoints

### Post-deployment
- [ ] Verify admin panel access
- [ ] Test language switching
- [ ] Check all pages load correctly
- [ ] Verify SSL certificate
- [ ] Set up monitoring
- [ ] Create database backup schedule

## 📞 Support and Maintenance

### Log Locations
- **Application Logs**: `pm2 logs`
- **Nginx Logs**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **PostgreSQL Logs**: `/var/log/postgresql/`

### Maintenance Commands
```bash
# Update application
cd /var/www/gamevault
git pull origin main  # if using git
yarn install
yarn build
pm2 restart all

# Database backup
sudo -u postgres pg_dump game_catalog_db > backup_$(date +%Y%m%d).sql

# Check application health
pm2 status
sudo systemctl status nginx postgresql
```

### Updating Games
1. Access admin panel at `https://yourdomain.com/admin`
2. Login with admin credentials
3. Use the dashboard to add, edit, or remove games
4. Changes are immediately reflected on the website

## 🎯 Features Overview

### For Users
- Browse extensive game catalog
- Search and filter games by category
- View trending games with direct downloads
- Read gaming articles and news
- Switch between Indonesian and English
- Contact support via Telegram/WhatsApp

### For Administrators
- Secure admin authentication
- Complete game management interface
- Real-time statistics dashboard
- Content control and moderation
- Database management capabilities

---

## 🛡 Production Security Hardening

### 1. Server Security
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Change default SSH port (optional)
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config

# Restart SSH
sudo systemctl restart ssh
```

### 2. Database Security
```bash
# Secure PostgreSQL installation
sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD 'very_secure_postgres_password';
\q
EOF

# Configure PostgreSQL for security
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Change 'trust' to 'md5' for local connections
```

### 3. Application Security
```bash
# Set proper file permissions
sudo chown -R www-data:www-data /var/www/gamevault
sudo chmod -R 755 /var/www/gamevault
sudo chmod 600 /var/www/gamevault/.env
sudo chmod 600 /var/www/gamevault/game-catalog-cms/.env
```

---

## 📋 Quick Commands Reference

```bash
# Start services
pm2 start ecosystem.config.js

# Stop services
pm2 stop all

# Restart services
pm2 restart all

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Check database
sudo -u postgres psql game_catalog_db

# Test API endpoints
curl http://localhost:3000/api/games
curl http://localhost:1337/api/games

# Backup database
sudo -u postgres pg_dump game_catalog_db > backup.sql

# Restore database
sudo -u postgres psql game_catalog_db < backup.sql
```

---

## 🎊 Congratulations!

Your GameVault application is now deployed and ready for production use. The system includes:

- **Professional game catalog** with 13+ games
- **Multi-language support** (Indonesian default, English option)
- **Admin panel** for content management
- **Search and filtering** capabilities
- **Responsive design** for all devices
- **Production-grade database** with PostgreSQL
- **Secure authentication** system

For ongoing support and updates, monitor the application logs and keep dependencies updated regularly.

---

**Happy Gaming! 🎮**