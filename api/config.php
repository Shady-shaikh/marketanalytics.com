<?php
/**
 * Solvitas Analytics - Centralized Configuration
 * Direct Email Notification Settings
 */

// Set Default Timezone for India
date_default_timezone_set('Asia/Kolkata');

// Error reporting settings (disable display on production for security)
ini_set('display_errors', 0);
error_reporting(E_ALL);

return [
    // Site Identity
    'site_name' => 'Solvitas Analytics',
    'site_url' => 'https://solvitasanalytics.com',
    'sebi_reg' => 'INH000023931',

    // Recipient & Sender Email Addresses
    'admin_email' => 'support@solvitasanalytics.com',
    'from_email' => 'noreply@solvitasanalytics.com',
    'send_email_alerts' => true,
];
