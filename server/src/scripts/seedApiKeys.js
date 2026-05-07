import 'dotenv/config';
import ApiKey from '../models/ApiKey.js';
import { generateApiKey, hashApiKey } from '../utils/apiKeyGenerator.js';

const seedApiKeys = async () => {
  try {
    console.log('Seeding API keys...\n');

    // key1 — Analytics Dashboard
    const dashboardKey = generateApiKey();
    const dashboardHash = hashApiKey(dashboardKey);

    const dashboardId = await ApiKey.create({
      keyHash:     dashboardHash,
      clientName:  'analytics_dashboard',
      permissions: ['read:alumni', 'read:analytics']
    });

    // key2 — Mobile AR App
    const arKey = generateApiKey();
    const arHash = hashApiKey(arKey);

    const arId = await ApiKey.create({
      keyHash:     arHash,
      clientName:  'mobile_ar_app',
      permissions: ['read:alumni_of_day']
    });


    console.log('✅ API keys generated successfully!\n');
    console.log('─────────────────────────────────────────────────');
    console.log('Client:      analytics_dashboard');
    console.log('ID:         ', dashboardId);
    console.log('Key:        ', dashboardKey);
    console.log('Permissions: read:alumni, read:analytics');
    console.log('─────────────────────────────────────────────────\n');
    console.log('─────────────────────────────────────────────────');
    console.log('Client:      mobile_ar_app');
    console.log('ID:         ', arId);
    console.log('Key:        ', arKey);
    console.log('Permissions: read:alumni_of_day');
    console.log('─────────────────────────────────────────────────\n');
    console.log('⚠️  Copy these keys now — they cannot be retrieved again.');
    console.log('Put the dashboard key in your .env as DASHBOARD_API_KEY');

    process.exit(0);

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedApiKeys();