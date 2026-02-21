# Deployment Guide: XChangeRate Worker

Since Vercel only supports request-based functions, the trading worker must be hosted on a 24/7 platform.

## Option 1: VPS + PM2 (Recommended)
Best for stability and using a **Static IP** for Binance IP whitelisting.

1. **Procure VPS**: Get a VPS (Ubuntu recommended) from Hostinger, DigitalOcean, or Vultr.
2. **Setup Environment**:
   ```bash
   # Update and install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm i -g pm2
   ```
3. **Deploy Code**:
   ```bash
   git clone <your-repo-url>
   cd rate-manual
   npm install
   ```
4. **Configure Env**:
   Create a `.env` file in the root directory with your production keys.
5. **Start Worker**:
   ```bash
   pm2 start "npm run worker" --name xchangerate-worker
   pm2 startup
   pm2 save
   ```

## Option 2: Render Background Worker
1. **New Service**: Select "Background Worker" in Render.
2. **Build Command**: `npm install`
3. **Start Command**: `npm run worker`
4. **Environment Variables**: Add all keys from your `.env.local` to the Render Dashboard.

## Production Safety Checklist
- [ ] **Withdrawals Disabled**: Ensure API keys have withdrawals UNCHECKED.
- [ ] **IP Whitelist**: Add your VPS static IP to the Binance API restriction list.
- [ ] **Kill Switch**: Use the Dashboard "Stop" button to halt trading instantly via the `api_credentials` status.
