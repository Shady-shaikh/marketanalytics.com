<?php
/**
 * Solvitas Analytics - Centralized PHP Configuration & Settings
 * Zero-cost, self-hosted Lead Capture System
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

    // Administrator Notification Email(s)
    'admin_email' => 'support@solvitasanalytics.com',
    'from_email' => 'noreply@solvitasanalytics.com',
    'send_email_alerts' => true,

    // Database & CSV Storage Paths
    'db_path' => dirname(__DIR__) . '/data/leads.db',
    'csv_path' => dirname(__DIR__) . '/data/leads.csv',

    // Admin Portal Credentials
    // Default password: Admin@Solvitas2025 (Change anytime)
    'admin_username' => 'admin',
    'admin_password' => 'Admin@Solvitas2025',
    'admin_session_key' => 'solvitas_admin_logged_in',
];
