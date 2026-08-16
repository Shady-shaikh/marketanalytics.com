<?php
/**
 * Solvitas Analytics - Email-Only Form Submission Endpoint
 * Captures all website form submissions and dispatches detailed email alerts directly.
 * Zero database, zero CSV storage, 100% self-hosted & maintainable.
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
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Only POST requests are accepted.']);
    exit;
}

$config = require __DIR__ . '/config.php';

// Capture and parse input (handles JSON payloads and URL-encoded POST)
$rawInput = file_get_contents('php://input');
$data = [];
if (!empty($rawInput) && ($jsonData = json_decode($rawInput, true)) !== null) {
    $data = $jsonData;
} else {
    $data = $_POST;
}

// Sanitization helper
function clean_input($val) {
    if (is_array($val)) {
        return htmlspecialchars(strip_tags(implode(', ', $val)), ENT_QUOTES, 'UTF-8');
    }
    return htmlspecialchars(strip_tags(trim((string)$val)), ENT_QUOTES, 'UTF-8');
}

// Extract standard fields
$name = clean_input($data['name'] ?? $data['full_name'] ?? $data['clientName'] ?? '');
$phone = clean_input($data['phone'] ?? $data['mobile'] ?? $data['contact'] ?? '');
$email = clean_input($data['email'] ?? $data['mail'] ?? '');
$service = clean_input($data['service'] ?? $data['segment'] ?? $data['plan'] ?? 'General Advisory');
$capital = clean_input($data['capital'] ?? $data['investment'] ?? $data['investment_bracket'] ?? 'Not Specified');
$message = clean_input($data['message'] ?? $data['query'] ?? $data['comments'] ?? '');
$formType = clean_input($data['form_type'] ?? $data['type'] ?? 'Advisory Inquiry');
$sourcePage = clean_input($data['source_page'] ?? $data['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? 'Website');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$createdAt = date('d M Y, h:i A') . ' IST';

// Form-specific extra fields (e.g., PAN, Experience, Consent, Role)
$pan = clean_input($data['pan'] ?? '');
$experience = clean_input($data['experience'] ?? '');
$role = clean_input($data['role'] ?? $data['position'] ?? '');
$consentAgreed = (!empty($data['consent']) || !empty($data['agreement']) || !empty($data['agree'])) ? 'Accepted' : '';

// Validation: Name and Phone required
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter your name and phone number.']);
    exit;
}

// Phone number validation (at least 7 digits)
if (preg_match('/[0-9]{7,15}/', preg_replace('/[^0-9]/', '', $phone)) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid phone number.']);
    exit;
}

// ----------------------------------------------------
// Compose and Send Email Notification
// ----------------------------------------------------
$emailSent = false;

if (!empty($config['send_email_alerts']) && !empty($config['admin_email'])) {
    $to = $config['admin_email'];
    $subject = "⚡ [New Lead] " . $name . " - " . $service . " (" . $formType . ")";

    // Prepare table rows for HTML email
    $rowsHtml = "
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0; width: 35%;'>Submission Time</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>{$createdAt}</td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Full Name</td><td style='padding: 10px; font-weight: bold; color: #061A2F; border: 1px solid #e2e8f0;'>{$name}</td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Phone Number</td><td style='padding: 10px; font-weight: bold; color: #0D9488; border: 1px solid #e2e8f0;'><a href='tel:{$phone}' style='color: #0D9488; text-decoration: none;'>{$phone}</a></td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Email Address</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>" . ($email ? "<a href='mailto:{$email}'>{$email}</a>" : 'Not Provided') . "</td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Form Type</td><td style='padding: 10px; border: 1px solid #e2e8f0;'><span style='background: #e6fffa; color: #0f766e; padding: 3px 8px; border-radius: 4px; font-weight: bold;'>{$formType}</span></td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Research Segment</td><td style='padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;'>{$service}</td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Capital Bracket</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>{$capital}</td></tr>
    ";

    if (!empty($role)) {
        $rowsHtml .= "<tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Applied Position</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>{$role}</td></tr>";
    }
    if (!empty($pan)) {
        $rowsHtml .= "<tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>PAN Number</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>{$pan}</td></tr>";
    }
    if (!empty($experience)) {
        $rowsHtml .= "<tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Market Experience</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>{$experience}</td></tr>";
    }
    if (!empty($consentAgreed)) {
        $rowsHtml .= "<tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Terms Agreement</td><td style='padding: 10px; color: #16a34a; font-weight: bold; border: 1px solid #e2e8f0;'>Accepted & Signed</td></tr>";
    }
    if (!empty($message)) {
        $rowsHtml .= "<tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Query / Message</td><td style='padding: 10px; border: 1px solid #e2e8f0; white-space: pre-wrap;'>" . nl2br($message) . "</td></tr>";
    }

    $rowsHtml .= "
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Source Page</td><td style='padding: 10px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b;'>{$sourcePage}</td></tr>
        <tr><td style='padding: 10px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;'>Sender IP</td><td style='padding: 10px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b;'>{$ipAddress}</td></tr>
    ";

    $htmlContent = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <title>New Website Lead</title>
    </head>
    <body style='font-family: Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #334155;'>
        <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
            <div style='background: #061A2F; padding: 20px; text-align: center;'>
                <h2 style='color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;'>SOLVITAS ANALYTICS</h2>
                <p style='color: #2dd4bf; margin: 5px 0 0 0; font-size: 12px; font-weight: bold;'>SEBI REGISTERED RESEARCH ANALYST &bull; INH000023931</p>
            </div>
            <div style='padding: 24px;'>
                <h3 style='color: #0f172a; margin-top: 0; font-size: 16px; border-bottom: 2px solid #0D9488; padding-bottom: 8px;'>New Lead Form Submission</h3>
                <table style='width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.5; margin-top: 15px;'>
                    {$rowsHtml}
                </table>
            </div>
            <div style='background: #f8fafc; padding: 15px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;'>
                This is an automated notification sent from the website lead capture system at <a href='{$config['site_url']}' style='color: #0D9488;'>{$config['site_url']}</a>.
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . $config['site_name'] . " <" . $config['from_email'] . ">\r\n";
    if (!empty($email)) {
        $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
    }
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    $emailSent = @mail($to, $subject, $htmlContent, $headers);
}

// Return clean JSON response
echo json_encode([
    'success' => true,
    'message' => 'Thank you, ' . $name . '! Your request has been received. Our advisory team will contact you shortly.',
    'email_sent' => $emailSent
]);
exit;
