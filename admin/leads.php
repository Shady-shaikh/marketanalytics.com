<?php
/**
 * Solvitas Analytics - Self-Hosted Leads Management Portal
 * Ultra-Modern Light Theme Admin Dashboard
 */

session_start();
$config = require __DIR__ . '/../api/config.php';

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION[$config['admin_session_key']]);
    session_destroy();
    header('Location: leads.php');
    exit;
}

// Handle Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_submit'])) {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === $config['admin_username'] && $password === $config['admin_password']) {
        $_SESSION[$config['admin_session_key']] = true;
        header('Location: leads.php');
        exit;
    } else {
        $loginError = 'Invalid admin username or password.';
    }
}

// Check Authentication
$isLoggedIn = !empty($_SESSION[$config['admin_session_key']]);

// If Not Logged In, Render Login Page
if (!$isLoggedIn): ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Portal Login | Solvitas Analytics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-4 border border-teal-100 shadow-sm">
                <i class="fa-solid fa-shield-halved text-2xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Solvitas Admin</h1>
            <p class="text-slate-500 text-sm mt-1">Sign in to manage customer inquiries & leads</p>
        </div>

        <?php if (!empty($loginError)): ?>
            <div class="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span><?= htmlspecialchars($loginError) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-5">
            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Username</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <i class="fa-regular fa-user"></i>
                    </span>
                    <input type="text" name="username" required placeholder="admin"
                           class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50/50">
                </div>
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <i class="fa-solid fa-lock"></i>
                    </span>
                    <input type="password" name="password" required placeholder="••••••••••••"
                           class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50/50">
                </div>
            </div>

            <button type="submit" name="login_submit" value="1"
                    class="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Sign In to Dashboard</span>
            </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            Self-Hosted &bull; Zero External APIs &bull; Solvitas Analytics
        </div>
    </div>
</body>
</html>
<?php exit; endif; ?>

<?php
// ----------------------------------------------------
// Authenticated Operations (SQLite Data Fetch & Export)
// ----------------------------------------------------
$db = null;
$leads = [];
$stats = [
    'total' => 0,
    'today' => 0,
    'this_week' => 0,
    'converted' => 0
];

try {
    if (file_exists($config['db_path'])) {
        $db = new PDO('sqlite:' . $config['db_path']);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Handle Status Update AJAX
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
            header('Content-Type: application/json');
            $leadId = (int)($_POST['id'] ?? 0);
            $newStatus = trim($_POST['status'] ?? 'New');
            $stmt = $db->prepare("UPDATE leads SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $newStatus, ':id' => $leadId]);
            echo json_encode(['success' => true]);
            exit;
        }

        // Handle Lead Deletion
        if (isset($_GET['action']) && $_GET['action'] === 'delete' && !empty($_GET['id'])) {
            $deleteId = (int)$_GET['id'];
            $stmt = $db->prepare("DELETE FROM leads WHERE id = :id");
            $stmt->execute([':id' => $deleteId]);
            header('Location: leads.php?msg=deleted');
            exit;
        }

        // Handle CSV Export
        if (isset($_GET['action']) && $_GET['action'] === 'export_csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=solvitas_leads_' . date('Y-m-d_His') . '.csv');
            $output = fopen('php://output', 'w');
            fputcsv($output, ['ID', 'Date & Time', 'Full Name', 'Phone Number', 'Email', 'Service Segment', 'Capital Bracket', 'Form Type', 'Message / Details', 'Source Page', 'IP Address', 'Status']);

            $exportStmt = $db->query("SELECT * FROM leads ORDER BY id DESC");
            while ($row = $exportStmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, [
                    $row['id'],
                    $row['created_at'],
                    $row['name'],
                    $row['phone'],
                    $row['email'],
                    $row['service'],
                    $row['capital'],
                    $row['form_type'],
                    $row['message'],
                    $row['source_page'],
                    $row['ip_address'],
                    $row['status']
                ]);
            }
            fclose($output);
            exit;
        }

        // Search and Filter logic
        $search = trim($_GET['search'] ?? '');
        $serviceFilter = trim($_GET['service'] ?? '');
        $statusFilter = trim($_GET['status'] ?? '');

        $sql = "SELECT * FROM leads WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $sql .= " AND (name LIKE :search OR phone LIKE :search OR email LIKE :search OR message LIKE :search)";
            $params[':search'] = "%$search%";
        }
        if (!empty($serviceFilter)) {
            $sql .= " AND service = :service";
            $params[':service'] = $serviceFilter;
        }
        if (!empty($statusFilter)) {
            $sql .= " AND status = :status";
            $params[':status'] = $statusFilter;
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate Stats
        $stats['converted'] = (int)$db->query("SELECT COUNT(*) FROM leads WHERE status = 'Converted'")->fetchColumn();
    } else {
        throw new Exception("SQLite DB not initialized yet");
    }
} catch (Exception $e) {
    // Fallback to CSV storage if SQLite is not available
    if (file_exists($config['csv_path'])) {
        $handle = fopen($config['csv_path'], 'r');
        if ($handle !== false) {
            $header = fgetcsv($handle);
            $csvRows = [];
            $idCounter = 1;
            while (($row = fgetcsv($handle)) !== false) {
                if (count($row) >= 4) {
                    $csvRows[] = [
                        'id' => $idCounter++,
                        'created_at' => $row[0] ?? '',
                        'name' => $row[1] ?? '',
                        'phone' => $row[2] ?? '',
                        'email' => $row[3] ?? '',
                        'service' => $row[4] ?? '',
                        'capital' => $row[5] ?? '',
                        'message' => $row[6] ?? '',
                        'form_type' => $row[7] ?? '',
                        'source_page' => $row[8] ?? '',
                        'ip_address' => $row[9] ?? '',
                        'status' => $row[10] ?? 'New'
                    ];
                }
            }
            fclose($handle);

            // Reverse to show newest first
            $csvRows = array_reverse($csvRows);
            $stats['total'] = count($csvRows);
            $todayDate = date('Y-m-d');
            $weekAgoDate = date('Y-m-d', strtotime('-7 days'));

            $search = trim($_GET['search'] ?? '');
            $serviceFilter = trim($_GET['service'] ?? '');
            $statusFilter = trim($_GET['status'] ?? '');

            foreach ($csvRows as $r) {
                $leadDate = substr($r['created_at'], 0, 10);
                if ($leadDate === $todayDate) $stats['today']++;
                if ($leadDate >= $weekAgoDate) $stats['this_week']++;
                if ($r['status'] === 'Converted') $stats['converted']++;

                // Apply filters
                if (!empty($search)) {
                    $searchMatch = stripos($r['name'], $search) !== false ||
                                   stripos($r['phone'], $search) !== false ||
                                   stripos($r['email'], $search) !== false ||
                                   stripos($r['message'], $search) !== false;
                    if (!$searchMatch) continue;
                }
                if (!empty($serviceFilter) && $r['service'] !== $serviceFilter) continue;
                if (!empty($statusFilter) && $r['status'] !== $statusFilter) continue;

                $leads[] = $r;
            }

            // CSV Export from CSV data
            if (isset($_GET['action']) && $_GET['action'] === 'export_csv') {
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename=solvitas_leads_' . date('Y-m-d_His') . '.csv');
                readfile($config['csv_path']);
                exit;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leads Management Portal | Solvitas Analytics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">

    <!-- Top Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="../index.html" class="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-teal-600 transition">
                    <div class="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">S</div>
                    <span>Solvitas Analytics</span>
                </a>
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">Admin Portal</span>
            </div>

            <div class="flex items-center gap-4">
                <a href="?action=export_csv" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition">
                    <i class="fa-solid fa-file-csv text-sm"></i>
                    <span>Export to CSV / Excel</span>
                </a>
                <a href="../index.html" target="_blank" class="text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span class="hidden sm:inline">View Website</span>
                </a>
                <a href="?action=logout" class="text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-rose-50 transition border border-rose-100">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Stat Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</div>
                    <div class="text-2xl font-bold text-slate-900 mt-1"><?= number_format($stats['total']) ?></div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-users"></i>
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads Today</div>
                    <div class="text-2xl font-bold text-teal-600 mt-1"><?= number_format($stats['today']) ?></div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-calendar-day"></i>
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past 7 Days</div>
                    <div class="text-2xl font-bold text-indigo-600 mt-1"><?= number_format($stats['this_week']) ?></div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Converted</div>
                    <div class="text-2xl font-bold text-emerald-600 mt-1"><?= number_format($stats['converted']) ?></div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
            </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
            <form method="GET" class="flex flex-wrap items-center gap-3 flex-1">
                <div class="relative min-w-[240px] flex-1 max-w-md">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <i class="fa-solid fa-magnifying-glass text-xs"></i>
                    </span>
                    <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>" placeholder="Search name, phone, email, message..."
                           class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50">
                </div>

                <select name="status" class="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700">
                    <option value="">All Statuses</option>
                    <option value="New" <?= (($_GET['status'] ?? '') === 'New') ? 'selected' : '' ?>>New</option>
                    <option value="Contacted" <?= (($_GET['status'] ?? '') === 'Contacted') ? 'selected' : '' ?>>Contacted</option>
                    <option value="In Progress" <?= (($_GET['status'] ?? '') === 'In Progress') ? 'selected' : '' ?>>In Progress</option>
                    <option value="Converted" <?= (($_GET['status'] ?? '') === 'Converted') ? 'selected' : '' ?>>Converted</option>
                    <option value="Closed" <?= (($_GET['status'] ?? '') === 'Closed') ? 'selected' : '' ?>>Closed</option>
                </select>

                <button type="submit" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition">
                    Filter Leads
                </button>

                <?php if (!empty($_GET['search']) || !empty($_GET['status']) || !empty($_GET['service'])): ?>
                    <a href="leads.php" class="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium">Clear</a>
                <?php endif; ?>
            </form>

            <div class="text-xs text-slate-500 font-medium">
                Showing <span class="font-bold text-slate-800"><?= count($leads) ?></span> lead(s)
            </div>
        </div>

        <!-- Leads Table Card -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                            <th class="py-3.5 px-4">#ID</th>
                            <th class="py-3.5 px-4">Date / Time</th>
                            <th class="py-3.5 px-4">Lead Name</th>
                            <th class="py-3.5 px-4">Contact Info</th>
                            <th class="py-3.5 px-4">Service & Capital</th>
                            <th class="py-3.5 px-4">Form & Source</th>
                            <th class="py-3.5 px-4">Message / Notes</th>
                            <th class="py-3.5 px-4">Status</th>
                            <th class="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($leads)): ?>
                            <tr>
                                <td colspan="9" class="py-12 text-center text-slate-400">
                                    <i class="fa-regular fa-folder-open text-4xl mb-3 text-slate-300 block"></i>
                                    <span class="text-sm font-medium">No customer leads found in the database.</span>
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($leads as $lead): ?>
                                <tr class="hover:bg-slate-50/70 transition">
                                    <td class="py-3 px-4 font-mono font-medium text-slate-500">
                                        #<?= $lead['id'] ?>
                                    </td>
                                    <td class="py-3 px-4 text-slate-600 whitespace-nowrap">
                                        <div class="font-medium"><?= date('d M Y', strtotime($lead['created_at'])) ?></div>
                                        <div class="text-[11px] text-slate-400"><?= date('h:i A', strtotime($lead['created_at'])) ?></div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="font-semibold text-slate-900"><?= htmlspecialchars($lead['name']) ?></div>
                                    </td>
                                    <td class="py-3 px-4 whitespace-nowrap">
                                        <div class="flex items-center gap-1.5 text-teal-700 font-medium">
                                            <i class="fa-solid fa-phone text-[10px]"></i>
                                            <a href="tel:<?= htmlspecialchars($lead['phone']) ?>" class="hover:underline"><?= htmlspecialchars($lead['phone']) ?></a>
                                        </div>
                                        <?php if (!empty($lead['email'])): ?>
                                            <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                                                <i class="fa-regular fa-envelope text-[10px]"></i>
                                                <a href="mailto:<?= htmlspecialchars($lead['email']) ?>" class="hover:underline"><?= htmlspecialchars($lead['email']) ?></a>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-block px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium border border-teal-100">
                                            <?= htmlspecialchars($lead['service']) ?>
                                        </span>
                                        <?php if (!empty($lead['capital']) && $lead['capital'] !== 'Not Specified'): ?>
                                            <div class="text-[11px] text-slate-500 mt-1">Capital: <span class="font-medium text-slate-700"><?= htmlspecialchars($lead['capital']) ?></span></div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3 px-4 whitespace-nowrap">
                                        <div class="font-medium text-slate-700"><?= htmlspecialchars($lead['form_type']) ?></div>
                                        <div class="text-[10px] text-slate-400 truncate max-w-[140px]" title="<?= htmlspecialchars($lead['source_page']) ?>">
                                            <?= htmlspecialchars($lead['source_page']) ?>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 max-w-xs">
                                        <div class="text-slate-600 line-clamp-2" title="<?= htmlspecialchars($lead['message']) ?>">
                                            <?= htmlspecialchars($lead['message']) ?: '<span class="text-slate-400 italic">No notes</span>' ?>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 whitespace-nowrap">
                                        <select onchange="updateLeadStatus(<?= $lead['id'] ?>, this.value)"
                                                class="px-2 py-1 text-xs rounded border border-slate-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500">
                                            <option value="New" <?= ($lead['status'] === 'New') ? 'selected' : '' ?>>🟢 New</option>
                                            <option value="Contacted" <?= ($lead['status'] === 'Contacted') ? 'selected' : '' ?>>🔵 Contacted</option>
                                            <option value="In Progress" <?= ($lead['status'] === 'In Progress') ? 'selected' : '' ?>>🟡 In Progress</option>
                                            <option value="Converted" <?= ($lead['status'] === 'Converted') ? 'selected' : '' ?>>🏆 Converted</option>
                                            <option value="Closed" <?= ($lead['status'] === 'Closed') ? 'selected' : '' ?>>⚪ Closed</option>
                                        </select>
                                    </td>
                                    <td class="py-3 px-4 text-right whitespace-nowrap">
                                        <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $lead['phone']) ?>" target="_blank"
                                           class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition" title="Message on WhatsApp">
                                            <i class="fa-brands fa-whatsapp"></i>
                                        </a>
                                        <a href="?action=delete&id=<?= $lead['id'] ?>" onclick="return confirm('Are you sure you want to delete this lead?');"
                                           class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition ml-1" title="Delete Lead">
                                            <i class="fa-regular fa-trash-can"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script>
    function updateLeadStatus(id, newStatus) {
        const formData = new FormData();
        formData.append('action', 'update_status');
        formData.append('id', id);
        formData.append('status', newStatus);

        fetch('leads.php', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
          .then(data => {
              if (!data.success) {
                  alert('Could not update status');
              }
          }).catch(err => console.error(err));
    }
    </script>
</body>
</html>
