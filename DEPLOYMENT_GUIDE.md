# AOLN Trading Platform - Production Deployment Guide

## Overview

Complete deployment guide for AOLN Trading Platform on Ubuntu server at `/var/www/my.aoln.net`. The platform includes TRON blockchain integration, MongoDB Atlas database, and comprehensive trading functionality with optimized performance configurations.

## Server Requirements

- Ubuntu 20.04/22.04 LTS
- Minimum 8GB RAM (application configured with 8GB memory limit)
- 100GB+ storage space (includes comprehensive logging)
- Domain name: my.aoln.net
- Root or sudo access

## Prerequisites

- Ubuntu Server 20.04/22.04 LTS
- Node.js 20.x
- Git installed
- Domain name pointed to your server (my.aoln.net)
- SSL certificate (Let's Encrypt recommended)

## Step 1: Server Preparation

### 1.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Dependencies

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install MongoDB (if you want local database)
sudo apt install mongodb -y

# Install Git (if not already installed)
sudo apt install git -y
```

### 1.3 Setup Directory Permissions

```bash
# Ensure /var/www directory exists
sudo mkdir -p /var/www

# Set proper ownership for web directory
sudo chown -R $USER:www-data /var/www
sudo chmod -R 755 /var/www
```

## Step 2: Clone and Setup Application

### 2.1 Clone Repository

```bash
cd /var/www
sudo git clone <your-repository-url> my.aoln.net
sudo chown -R $USER:$USER /var/www/my.aoln.net
cd /var/www/my.aoln.net
```

### 2.2 Install Dependencies

```bash
npm install --production
```

### 2.3 Setup Environment Variables

```bash
# Create production environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production
```

### 2.4 Environment Variables Configuration

```env
# Database
MONGODB_URI=mongodb://localhost:27017/aoln
# Or use your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aoln

# Application
NODE_ENV=production
PORT=5000
VITE_API_URL=https://my.aoln.net/api

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-here

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://my.aoln.net/api/auth/google/callback

# TRON Configuration
TRON_PRIVATE_KEY=your-tron-private-key
COMPANY_WALLET_ADDRESS=TVMDCdRLroZYoBQ2bVdhKkn7TJVmGj79DG

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key
```

## Step 3: Build Application

### 3.1 Build Frontend

```bash
npm run build
```

### 3.2 Verify Buildll \*.sh

```bash
# Check if dist folder is created
ls -la dist/
```

## Step 4: Setup PM2 Process Manager

### 4.1 Create PM2 Configuration

```bash
nano ecosystem.config.js
```

### 4.2 PM2 Configuration File (ecosystem.config.js)

```javascript
module.exports = {
  apps: [
    {
      name: "my-aoln-net-backend",
      script: "server/index.ts",
      interpreter: "node",
      interpreter_args: "--loader tsx",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "/var/logs/my.aoln.net/err.log",
      out_file: "/var/logs/my.aoln.net/out.log",
      log_file: "/var/logs/my.aoln.net/combined.log",
      time: true,
      max_memory_restart: "8G",
      watch: false,
      ignore_watch: ["node_modules", "logs", "dist"],
    },
  ],
};
```

### 4.3 Create Logs Directories

```bash
# Create local logs directory
mkdir logs

# Create production logs directory with proper structure
sudo mkdir -p /var/logs/my.aoln.net
sudo chown -R $USER:$USER /var/logs/my.aoln.net
sudo chmod -R 755 /var/logs/my.aoln.net
```

### 4.4 Start Application with PM2

```bash
# Start application
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command that PM2 outputs

# Check application status
pm2 status
pm2 logs my-aoln-net-backend

# Monitor application
pm2 monit
```

## Step 5: Setup Nginx Reverse Proxy

### 5.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/aoln-platform
```

### 5.2 Nginx Configuration

```nginx
server {
    listen 80;
    server_name my.aoln.net www.my.aoln.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name my.aoln.net www.my.aoln.net;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/my.aoln.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my.aoln.net/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Main Application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WebSocket Support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Files Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ \.(env|log)$ {
        deny all;
    }
}
```

### 5.3 Enable Site and Test Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/aoln-platform /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: Setup SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d my.aoln.net -d www.my.aoln.net
```

### 6.3 Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job for auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 7: Setup Firewall

### 7.1 Configure UFW

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

## Step 8: Database Setup (if using local MongoDB)

### 8.1 Start MongoDB

```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 8.2 Create Database and User

```bash
mongo
```

```javascript
use aoln
db.createUser({
  user: "aoln_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "aoln" }]
})
```

## Step 9: Monitoring and Logs

### 9.1 Check Application Status

```bash
# Check PM2 status
pm2 status
pm2 logs my-aoln-net-backend

# Monitor application in real-time
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check application logs
tail -f /var/logs/my.aoln.net/combined.log
tail -f /var/logs/my.aoln.net/err.log
tail -f /var/logs/my.aoln.net/out.log
```

### 9.2 Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/my-aoln-net
```

```
/var/logs/my.aoln.net/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reload my-aoln-net-backend
    endscript
}
```

## Alternative: Automated Deployment Script

For streamlined deployment, use the included automated deployment script:

### Using deploy.sh Script

```bash
# Make script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh

# The script will:
# - Create /var/www/my.aoln.net directory
# - Copy all project files
# - Install dependencies
# - Create /var/logs/my.aoln.net/ structure
# - Set proper permissions
# - Build the application
# - Start with PM2 using production configuration
```

### Script Features

- **Automated Directory Setup**: Creates `/var/www/my.aoln.net` and `/var/logs/my.aoln.net/`
- **Process Management**: Stops existing processes, installs fresh
- **Permission Management**: Sets proper ownership and file permissions
- **Build Integration**: Runs production build automatically
- **Log Configuration**: Creates nested log directory structure
- **Error Handling**: Comprehensive status reporting and validation

## Step 10: Final Verification

### 10.1 Test Application

```bash
# Check if application is running
curl -I https://my.aoln.net

# Check API endpoint
curl https://my.aoln.net/api/health
```

### 10.2 Performance Optimization

```bash
# Setup swap if needed (for low memory servers)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Step 11: Backup Strategy

### 11.1 Database Backup Script

```bash
nano backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/aoln/backups"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db aoln --out $BACKUP_DIR/mongodb_$DATE

# Compress backup
tar -czf $BACKUP_DIR/mongodb_$DATE.tar.gz $BACKUP_DIR/mongodb_$DATE
rm -rf $BACKUP_DIR/mongodb_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x backup-db.sh

# Setup daily backup cron job
crontab -e
# Add: 0 2 * * * /home/aoln/aoln-platform/backup-db.sh
```

## Step 12: Security Hardening

### 12.1 Fail2Ban Setup

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 12.2 SSH Security

```bash
sudo nano /etc/ssh/sshd_config
```

```
# Disable root login
PermitRootLogin no

# Change default port (optional)
Port 2222

# Disable password authentication (use keys only)
PasswordAuthentication no
```

```bash
sudo systemctl restart sshd
```

## Step 13: Health Monitoring

### 13.1 Create Health Check Script

```bash
nano health-check.sh
```

```bash
#!/bin/bash
HEALTH_URL="https://my.aoln.net/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE != "200" ]; then
    echo "Application is down. Restarting..."
    pm2 restart aoln-platform
    # Send notification (optional)
    # mail -s "AOLN Platform Restarted" admin@my.aoln.net < /dev/null
fi
```

```bash
chmod +x health-check.sh

# Setup health check every 5 minutes
crontab -e
# Add: */5 * * * * /home/aoln/aoln-platform/health-check.sh
```

## Deployment Checklist

- [ ] Server updated and dependencies installed
- [ ] Application cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Application built successfully
- [ ] PM2 configured and running
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database setup (if local)
- [ ] Logs and monitoring setup
- [ ] Backup strategy implemented
- [ ] Security hardening applied
- [ ] Health monitoring active
- [ ] Domain DNS pointing to server
- [ ] All functionality tested

## Troubleshooting

### Common Issues:

1. **Application won't start**: Check logs with `pm2 logs`
2. **502 Bad Gateway**: Check if application is running on port 5000
3. **SSL issues**: Verify certificate with `sudo certbot certificates`
4. **Database connection**: Check MongoDB status and connection string
5. **Permission issues**: Ensure correct file ownership with `chown -R aoln:aoln /home/aoln/aoln-platform`

### Useful Commands:

```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongodb

# Check system resources
htop
df -h
free -h

# Check application ports
sudo netstat -tlnp | grep :5000
```

Your AOLN trading platform should now be successfully deployed on your self-managed Ubuntu server!
