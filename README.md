# Installation

### Install node 

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
close and reopen the terminal
nvm install --lts

### Install postgres

sudo apt update && sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl daemon-reload && sudo systemctl enable postgresql
sudo -u postgres psql
CREATE USER pg1 WITH PASSWORD 'pg1' CREATEDB;
CREATE DATABASE "duin-dev" WITH OWNER = pg1;
CREATE DATABASE "duin-shadow" WITH OWNER = pg1;
GRANT ALL PRIVILEGES ON DATABASE "duin-dev" TO pg1;
GRANT ALL PRIVILEGES ON DATABASE "duin-shadow" TO pg1;
\c duin-dev
GRANT ALL ON SCHEMA public TO pg1;
ALTER SCHEMA public OWNER TO pg1;
\c duin-shadow
GRANT ALL ON SCHEMA public TO pg1;
ALTER SCHEMA public OWNER TO pg1;
\q

use DATABASE_URL="postgresql://pg1:pg1@localhost:5432/duin-dev"

### Install nginx

sudo apt update
sudo apt install nginx && sudo systemctl start nginx && sudo systemctl enable nginx
sudo apt install certbot python3-certbot-nginx

sudo vim /etc/nginx/sites-available/duin.fun

server {
    listen 80;
    server_name duin.fun www.duin.fun;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo vim /etc/nginx/sites-available/api.duin.fun

server {
    listen 80;
    server_name api.duin.fun;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/duin.fun /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.duin.fun /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl reload nginx

sudo certbot --nginx -d duin.fun -d www.duin.fun
sudo certbot --nginx -d api.duin.fun

### Install pm2

npm install -g pm2

### Install pnpm

npm install -g pnpm@latest-10

### Install frontend

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

cd frontend
pnpm install
pnpm run build

PORT=3000 pm2 start npm --name "duin-frontend" -- start

### Install backend

pnpm install
npx prisma migrate dev --name init
npm run build

PORT=3002 pm2 start dist/index.js --name "duin-backend"

### Install rust