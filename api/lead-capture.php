<?php
/**
 * Solvitas Analytics - Self-Hosted Lead Capture Endpoint
 * Zero-cost, zero external dependencies.
 * Saves to SQLite Database (data/leads.db) + CSV Backup (data/leads.csv) + Sends Email Notification.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Only POST requests accepted.']);
    exit;
}

$config = require __DIR__ . '/config.php';

// Capture and parse input (handles both JSON and form data)
$rawInput = file_get_contents('php://input');
$data = [];
if (!empty($rawInput) && ($jsonData = json_decode($rawInput, true)) !== null) {
    $data = $jsonData;
} else {
    $data = $_POST;
}

// Helper sanitization function
function clean_input($val) {
    if (is_array($val)) {
        return htmlspecialchars(strip_tags(implode(', ', $val)), ENT_QUOTES, 'UTF-8');
    }
    return htmlspecialchars(strip_tags(trim((string)$val)), ENT_QUOTES, 'UTF-8');
}

// Extract fields with fallback names
$name = clean_input($data['name'] ?? $data['full_name'] ?? $data['clientName'] ?? '');
$phone = clean_input($data['phone'] ?? $data['mobile'] ?? $data['contact'] ?? '');
$email = clean_input($data['email'] ?? $data['mail'] ?? '');
$service = clean_input($data['service'] ?? $data['segment'] ?? $data['plan'] ?? 'General Inquiry');
$capital = clean_input($data['capital'] ?? $data['investment'] ?? $data['investment_bracket'] ?? 'Not Specified');
$message = clean_input($data['message'] ?? $data['query'] ?? $data['comments'] ?? '');
$formType = clean_input($data['form_type'] ?? $data['type'] ?? 'Lead Form');
$sourcePage = clean_input($data['source_page'] ?? $data['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? 'Website');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$createdAt = date('Y-m-d H:i:s');

// Extra fields if consent or career form
$pan = clean_input($data['pan'] ?? '');
$experience = clean_input($data['experience'] ?? '');
$consentAgreed = !empty($data['consent']) || !empty($data['agreement']) ? 'Yes' : 'N/A';

if (!empty($pan)) {
    $message .= " | PAN: " . $pan;
}
if (!empty($experience)) {
    $message .= " | Experience: " . $experience;
}
if ($consentAgreed === 'Yes') {
    $message .= " | Consent Terms Accepted: Yes";
}

// Validation: Name and Phone are required at minimum
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide your name and phone number.']);
    exit;
}

// Basic phone validation (at least 7 digits)
if (preg_match('/[0-9]{7,15}/', preg_replace('/[^0-9]/', '', $phone)) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid contact phone number.']);
    exit;
}

$dbSuccess = false;
$csvSuccess = false;

// ----------------------------------------------------
// 1. Save to SQLite Database (data/leads.db)
// ----------------------------------------------------
try {
    $dbDir = dirname($config['db_path']);
    if (!is_dir($dbDir)) {
        @mkdir($dbDir, 0755, true);
    }

    $db = new PDO('sqlite:' . $config['db_path']);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create table if it doesn't exist
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            service TEXT,
            capital TEXT,
            message TEXT,
            form_type TEXT,
            source_page TEXT,
            ip_address TEXT,
            status TEXT DEFAULT 'New',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ";
    $db->exec($createTableQuery);

    $insertStmt = $db->prepare("
        INSERT INTO leads (name, phone, email, service, capital, message, form_type, source_page, ip_address, status, created_at)
        VALUES (:name, :phone, :email, :service, :capital, :message, :form_type, :source_page, :ip_address, 'New', :created_at)
    ");

    $insertStmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email,
        ':service' => $service,
        ':capital' => $capital,
        ':message' => $message,
        ':form_type' => $formType,
        ':source_page' => $sourcePage,
        ':ip_address' => $ipAddress,
        ':created_at' => $createdAt,
    ]);

    $dbSuccess = true;
} catch (Exception $e) {
    error_log("Solvitas Lead DB Error: " . $e->getMessage());
}

// ----------------------------------------------------
// 2. Append to CSV Backup (data/leads.csv)
// ----------------------------------------------------
try {
    $csvFile = $config['csv_path'];
    $isNewFile = !file_exists($csvFile) || filesize($csvFile) === 0;
    
    $fp = fopen($csvFile, 'a');
    if ($fp) {
        if ($isNewFile) {
            // Write CSV Header
            fputcsv($fp, ['Date & Time', 'Full Name', 'Phone Number', 'Email Address', 'Service/Segment', 'Investment Capital', 'Message/Details', 'Form Type', 'Source Page', 'IP Address', 'Status']);
        }
        fputcsv($fp, [
            $createdAt,
            $name,
            $phone,
            $email,
            $service,
            $capital,
            $message,
            $formType,
            $sourcePage,
            $ipAddress,
            'New'
        ]);
        fclose($fp);
        $csvSuccess = true;
    }
} catch (Exception $e) {
    error_log("Solvitas Lead CSV Error: " . $e->getMessage());
}

// ----------------------------------------------------
// 3. Dispatch Email Notification
// ----------------------------------------------------
if (!empty($config['send_email_alerts']) && !empty($config['admin_email'])) {
    $to = $config['admin_email'];
    $subject = "⚡ New Lead Received: " . $name . " [" . $service . "]";
    
    $emailBody = "
======================================================
  NEW LEAD NOTIFICATION - " . strtoupper($config['site_name']) . "
======================================================

Date & Time:       " . $createdAt . "
Full Name:         " . $name . "
Phone Number:      " . $phone . "
Email Address:     " . ($email ?: 'Not Provided') . "
Service Segment:   " . $service . "
Capital Bracket:   " . $capital . "
Form Type:         " . $formType . "
Source Page:       " . $sourcePage . "

Message / Details:
" . ($message ?: 'No additional message.') . "

------------------------------------------------------
Admin Portal: " . $config['site_url'] . "/admin/leads.php
======================================================
";

    $headers = "From: " . $config['from_email'] . "\r\n" .
               "Reply-To: " . ($email ?: $config['from_email']) . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    @mail($to, $subject, $emailBody, $headers);
}

// ----------------------------------------------------
// 4. Return Success Response
// ----------------------------------------------------
echo json_encode([
    'success' => true,
    'message' => 'Thank you, ' . $name . '! Your request has been received. Our advisory team will reach out to you shortly.',
    'lead_id' => $dbSuccess ? ($db->lastInsertId() ?? null) : null
]);
exit;
