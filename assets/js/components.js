/**
 * Solvitas Analytics - Global Component Hydrator
 * Injects consistent, SEBI-compliant Header, TopBar, Footer, Lead Modal, and Floating WhatsApp Button.
 * Replaces hardcoded elements across all pages and binds data-config attributes.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSolvitasComponents();
});

function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/services/')) {
        return '../';
    }
    return '';
}

function getCurrentPageName() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const segments = path.split('/');
    const last = segments[segments.length - 1] || 'index.html';
    return last.toLowerCase();
}

function initSolvitasComponents() {
    const base = getBasePath();
    const currentPage = getCurrentPageName();
    const isServiceSubdir = base === '../';

    // ----------------------------------------------------
    // 1. Render Top Info Bar
    // ----------------------------------------------------
    const topBarEl = document.getElementById('solvitas-topbar');
    if (topBarEl) {
        topBarEl.innerHTML = `
            <div class="w-full bg-[#06182B] text-slate-300 border-b border-slate-800 text-xs font-medium">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between py-2.5 gap-2">
                    <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div class="flex items-center gap-1.5 text-slate-300">
                            <i class="fa-regular fa-clock text-teal-400"></i>
                            <span>${SOLVITAS_CONFIG.contact.workingHours}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-slate-300">
                            <i class="fa-solid fa-phone text-teal-400"></i>
                            <a href="tel:${SOLVITAS_CONFIG.contact.primaryPhone}" class="hover:text-teal-300 transition font-medium">${SOLVITAS_CONFIG.contact.primaryPhone}</a>
                        </div>
                        <div class="hidden md:flex items-center gap-1.5">
                            <span class="px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 text-[11px] font-semibold border border-teal-500/30 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                                SEBI Reg: ${SOLVITAS_CONFIG.company.sebiRegNumber}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1.5 text-slate-300">
                            <i class="fa-regular fa-envelope text-teal-400"></i>
                            <a href="mailto:${SOLVITAS_CONFIG.contact.supportEmail}" class="hover:text-teal-300 transition">${SOLVITAS_CONFIG.contact.supportEmail}</a>
                        </div>
                        <div class="h-3 w-px bg-slate-700 hidden sm:block"></div>
                        <div class="flex items-center gap-3 text-slate-400">
                            <a href="${SOLVITAS_CONFIG.social.facebook}" target="_blank" rel="noopener" class="hover:text-teal-400 transition" aria-label="Facebook"><i class="fa-brands fa-facebook-f text-xs"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.instagram}" target="_blank" rel="noopener" class="hover:text-teal-400 transition" aria-label="Instagram"><i class="fa-brands fa-instagram text-xs"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.twitter}" target="_blank" rel="noopener" class="hover:text-teal-400 transition" aria-label="Twitter"><i class="fa-brands fa-x-twitter text-xs"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.linkedin}" target="_blank" rel="noopener" class="hover:text-teal-400 transition" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in text-xs"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.youtube}" target="_blank" rel="noopener" class="hover:text-teal-400 transition" aria-label="YouTube"><i class="fa-brands fa-youtube text-xs"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ----------------------------------------------------
    // 2. Render Main Sticky Navigation Header
    // ----------------------------------------------------
    const headerEl = document.getElementById('solvitas-header');
    if (headerEl) {
        const navItemsHtml = SOLVITAS_CONFIG.navigation.mainMenu.map(item => {
            const fullHref = isServiceSubdir ? (base + item.href) : item.href;
            const isActive = currentPage === item.href.toLowerCase() || (item.href === 'index.html' && (currentPage === '' || currentPage === 'index.html'));
            return `<a href="${fullHref}" class="nav-link text-sm font-semibold text-slate-700 hover:text-teal-600 transition ${isActive ? 'active text-teal-600 font-bold' : ''}">${item.title}</a>`;
        }).join('');

        const mobileNavItemsHtml = SOLVITAS_CONFIG.navigation.mainMenu.map(item => {
            const fullHref = isServiceSubdir ? (base + item.href) : item.href;
            return `<a href="${fullHref}" class="py-2.5 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition font-medium">${item.title}</a>`;
        }).join('');

        headerEl.innerHTML = `
            <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-200">
                <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <!-- Logo -->
                    <a href="${base}index.html" class="flex items-center gap-3">
                        <img src="${base}assets/img/logo-solvitas.png" class="h-11 w-auto" alt="${SOLVITAS_CONFIG.company.brandName}" onerror="this.src='${base}assets/img/favicon.png'; this.classList.add('h-8');">
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden lg:flex items-center gap-7">
                        ${navItemsHtml}
                    </div>

                    <!-- Right CTA & Mobile Toggle -->
                    <div class="flex items-center gap-3.5">
                        <button onclick="openLeadModal('Header CTA')" class="btn-primary text-xs sm:text-sm py-2.5 px-5 sm:px-6">
                            <i class="fa-solid fa-chart-line text-teal-200"></i>
                            <span>Get Free Research</span>
                        </button>

                        <!-- Mobile Hamburger Button -->
                        <button id="solvitasMobileMenuBtn" class="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition" aria-label="Toggle navigation">
                            <i id="solvitasMenuIconOpen" class="fa-solid fa-bars text-lg"></i>
                            <i id="solvitasMenuIconClose" class="fa-solid fa-xmark text-lg hidden"></i>
                        </button>
                    </div>
                </nav>

                <!-- Mobile Menu Drawer -->
                <div id="solvitasMobileDrawer" class="lg:hidden max-h-0 opacity-0 overflow-hidden bg-white border-b border-slate-200 px-4 sm:px-6 transition-all duration-300 ease-in-out">
                    <div class="flex flex-col gap-1 py-4 text-sm">
                        ${mobileNavItemsHtml}
                        <div class="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                            <a href="${base}bank-details.html" class="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Bank & Payment Details</a>
                            <a href="${base}contact.html" class="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Contact & Grievance</a>
                        </div>
                    </div>
                </div>
            </header>
        `;

        // Bind Mobile Menu Toggle
        const menuBtn = document.getElementById('solvitasMobileMenuBtn');
        const drawer = document.getElementById('solvitasMobileDrawer');
        const iconOpen = document.getElementById('solvitasMenuIconOpen');
        const iconClose = document.getElementById('solvitasMenuIconClose');

        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', () => {
                const isOpen = drawer.classList.contains('max-h-96');
                if (isOpen) {
                    drawer.classList.remove('max-h-96', 'opacity-100');
                    drawer.classList.add('max-h-0', 'opacity-0');
                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                } else {
                    drawer.classList.remove('max-h-0', 'opacity-0');
                    drawer.classList.add('max-h-96', 'opacity-100');
                    iconOpen.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                }
            });
        }
    }

    // ----------------------------------------------------
    // 3. Render High-Impact Wealth Navy Footer (Matching Exact Screenshot)
    // ----------------------------------------------------
    const footerEl = document.getElementById('solvitas-footer');
    if (footerEl) {
        const offeringsHtml = SOLVITAS_CONFIG.navigation.servicesMenu.map(s => {
            const href = isServiceSubdir ? s.href.replace('services/', '') : (base + s.href);
            return `<li><a href="${href}" class="text-slate-300 hover:text-teal-400 transition text-sm flex items-center gap-1.5"><span class="text-teal-400 text-xs">›</span> ${s.title}</a></li>`;
        }).join('');

        const companyHtml = SOLVITAS_CONFIG.navigation.companyMenu.map(c => {
            const href = isServiceSubdir ? (base + c.href) : (base + c.href);
            return `<li><a href="${href}" class="text-slate-300 hover:text-teal-400 transition text-sm flex items-center gap-1.5"><span class="text-teal-400 text-xs">›</span> ${c.title}</a></li>`;
        }).join('');

        const termsHtml = SOLVITAS_CONFIG.navigation.termsMenu.map(t => {
            const href = isServiceSubdir ? (base + t.href) : (base + t.href);
            return `<li><a href="${href}" class="text-slate-300 hover:text-teal-400 transition text-sm flex items-center gap-1.5"><span class="text-teal-400 text-xs">›</span> ${t.title}</a></li>`;
        }).join('');

        footerEl.innerHTML = `
            <footer class="bg-[#072844] text-white pt-16 pb-8 border-t border-teal-900/50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    <!-- Top 4 Columns Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                        <!-- Col 1: Connect With Us -->
                        <div class="space-y-4">
                            <a href="${base}index.html" class="inline-block mb-2">
                                <img src="${base}assets/img/logo-solvitas.png" class="h-10 w-auto brightness-0 invert" alt="${SOLVITAS_CONFIG.company.brandName}" onerror="this.src='${base}assets/img/favicon.png';">
                            </a>
                            <h4 class="text-base font-bold text-white tracking-wide">Connect With Us</h4>
                            <div class="space-y-2.5 text-sm text-slate-300">
                                <div class="flex items-center gap-2.5">
                                    <i class="fa-solid fa-phone text-teal-400 text-sm"></i>
                                    <a href="tel:${SOLVITAS_CONFIG.contact.primaryPhone}" class="hover:text-teal-400 transition">${SOLVITAS_CONFIG.contact.primaryPhone}</a>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
                                    <a href="${SOLVITAS_CONFIG.contact.whatsappUrl}" target="_blank" rel="noopener" class="hover:text-emerald-400 transition">${SOLVITAS_CONFIG.contact.whatsappNumber}</a>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <i class="fa-solid fa-envelope text-teal-400 text-sm"></i>
                                    <a href="mailto:${SOLVITAS_CONFIG.contact.supportEmail}" class="hover:text-teal-400 transition">${SOLVITAS_CONFIG.contact.supportEmail}</a>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <i class="fa-regular fa-clock text-teal-400 text-sm"></i>
                                    <span>${SOLVITAS_CONFIG.contact.workingHours}</span>
                                </div>
                            </div>

                            <!-- Social Icons -->
                            <div class="pt-3 flex flex-wrap items-center gap-2.5">
                                <a href="${SOLVITAS_CONFIG.social.facebook}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="Facebook"><i class="fa-brands fa-facebook-f text-sm"></i></a>
                                <a href="${SOLVITAS_CONFIG.social.instagram}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="Instagram"><i class="fa-brands fa-instagram text-sm"></i></a>
                                <a href="${SOLVITAS_CONFIG.social.tiktok}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="TikTok"><i class="fa-brands fa-tiktok text-sm"></i></a>
                                <a href="${SOLVITAS_CONFIG.social.linkedin}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in text-sm"></i></a>
                                <a href="${SOLVITAS_CONFIG.social.snapchat}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="Snapchat"><i class="fa-brands fa-snapchat text-sm"></i></a>
                                <a href="${SOLVITAS_CONFIG.social.twitter}" target="_blank" rel="noopener" class="w-9 h-9 rounded-lg bg-[#0E3A5E] hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter text-sm"></i></a>
                            </div>
                        </div>

                        <!-- Col 2: Company -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-2">Company</h4>
                            <div class="w-12 h-1 bg-teal-400 rounded-full mb-4"></div>
                            <ul class="space-y-2.5">
                                ${companyHtml}
                            </ul>
                        </div>

                        <!-- Col 3: Offerings -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-2">Offerings</h4>
                            <div class="w-12 h-1 bg-teal-400 rounded-full mb-4"></div>
                            <ul class="space-y-2.5">
                                ${offeringsHtml}
                            </ul>
                        </div>

                        <!-- Col 4: Terms & Compliance -->
                        <div>
                            <h4 class="text-lg font-bold text-white mb-2">Terms</h4>
                            <div class="w-12 h-1 bg-teal-400 rounded-full mb-4"></div>
                            <ul class="space-y-2.5">
                                ${termsHtml}
                            </ul>
                        </div>

                    </div>

                    <!-- Glowing Crimson SEBI Mandatory Disclaimer Box -->
                    <div class="p-6 rounded-2xl bg-[#09223A] border-2 border-rose-600/70 shadow-[0_0_20px_rgba(225,29,72,0.25)] text-xs text-slate-200 space-y-2.5 leading-relaxed">
                        <p>*Disclaimer: “Registration granted by SEBI, Enlistment as RA with Exchange and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.”</p>
                        <p>*Disclaimer: “The securities quoted (if any) on our website or advertisements are for illustration only and not recommendatory.”</p>
                        <p>*Standard warning: “Investment in securities market are subject to market risks. Read all documents carefully before investing.”</p>
                        <p>*Mandatory notice: “Clients shall follow Do’s & Don’ts as per SEBI master circular (SEBI/HO/MIRSD-POD-1/P/CIR/2024/49 dated May 21, 2024).”</p>
                    </div>

                    <!-- Quick Links Row -->
                    <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-300">
                        <span class="text-white font-bold">Quick Links:</span>
                        <a href="https://www.sebi.gov.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">SEBI</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.nseindia.com" target="_blank" rel="noopener" class="hover:text-teal-400 transition">NSE</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.bseindia.com" target="_blank" rel="noopener" class="hover:text-teal-400 transition">BSE</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.mcxindia.com" target="_blank" rel="noopener" class="hover:text-teal-400 transition">MCX</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://nsdl.co.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">NSDL</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.cdslindia.com" target="_blank" rel="noopener" class="hover:text-teal-400 transition">CDSL</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.rbi.org.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">RBI</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">SEBI scores</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://smartodr.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">SMART ODR</a>
                        <span class="text-slate-600">|</span>
                        <a href="https://www.ckycindia.in" target="_blank" rel="noopener" class="hover:text-teal-400 transition">CKYC Awareness</a>
                    </div>

                    <!-- 3 Detailed Contact & SEBI Details Columns -->
                    <div class="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-300">
                        <div>
                            <h5 class="text-sm font-bold text-white mb-2">Solvitas Analytics Pvt Ltd</h5>
                            <p class="text-slate-400 mb-1">CIN: <span class="font-mono text-slate-200">${SOLVITAS_CONFIG.company.cin}</span></p>
                            <p class="text-slate-300 mb-1 leading-relaxed">${SOLVITAS_CONFIG.addresses.corporate}</p>
                            <p class="text-slate-300 mb-1">${SOLVITAS_CONFIG.contact.supportEmail}</p>
                            <p class="text-slate-300">${SOLVITAS_CONFIG.contact.primaryPhone}</p>
                        </div>
                        <div>
                            <h5 class="text-sm font-bold text-white mb-2">Nearest SEBI Office</h5>
                            <p class="text-slate-300 mb-2 leading-relaxed">${SOLVITAS_CONFIG.addresses.nearestSebiOffice}</p>
                            <p class="text-slate-400">${SOLVITAS_CONFIG.contact.sebiWorkingHours}</p>
                        </div>
                        <div>
                            <h5 class="text-sm font-bold text-white mb-2">SEBI Research Analyst Details</h5>
                            <p class="text-slate-300 mb-1">Registered Name: <strong class="text-white">${SOLVITAS_CONFIG.company.legalName}</strong></p>
                            <p class="text-slate-300 mb-1">Type: <span class="text-white">${SOLVITAS_CONFIG.company.sebiCategory}</span></p>
                            <p class="text-slate-300 mb-1">Reg No.: <strong class="text-teal-400 font-mono">${SOLVITAS_CONFIG.company.sebiRegNumber}</strong></p>
                            <p class="text-slate-300">Validity: <strong class="text-emerald-400">${SOLVITAS_CONFIG.company.sebiValidity}</strong></p>
                        </div>
                    </div>

                    <!-- Bottom Copyright Bar -->
                    <div class="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
                        <div>
                            &copy; ${new Date().getFullYear()} ${SOLVITAS_CONFIG.company.legalName}. All rights reserved.
                        </div>
                        <div>
                            Designed & developed with ❤️ by <span class="text-white font-semibold">Mind Your Auth</span>
                        </div>
                    </div>

                </div>
            </footer>
        `;
    }

    // ----------------------------------------------------
    // 4. Inject Global Lead Modal Popup
    // ----------------------------------------------------
    let modalContainer = document.getElementById('solvitas-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'solvitas-modal-container';
        document.body.appendChild(modalContainer);
    }
    
    modalContainer.innerHTML = `
        <div id="solvitasGlobalLeadModal" class="modal-overlay" onclick="closeLeadModalOnBackdrop(event)">
            <div class="modal-dialog p-6 sm:p-8 relative bg-white border border-slate-200">
                <!-- Close Button -->
                <button onclick="closeLeadModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition" aria-label="Close modal">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>

                <!-- Modal Header -->
                <div class="mb-6">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 mb-2">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>SEBI Reg No: ${SOLVITAS_CONFIG.company.sebiRegNumber}</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900" id="modalFormTitle">Request Research Advisory</h3>
                    <p class="text-slate-500 text-xs mt-1">Get high-conviction research calls and market recommendations directly from certified analysts.</p>
                </div>

                <!-- Form -->
                <form id="globalLeadModalForm" onsubmit="handleLeadFormSubmit(event, this)" class="space-y-4">
                    <input type="hidden" name="form_type" value="Lead Popup Modal">
                    <input type="hidden" name="source_page" id="modalSourcePage" value="${window.location.href}">

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name <span class="text-rose-500">*</span></label>
                        <input type="text" name="name" required placeholder="e.g. Rahul Sharma" class="sol-input">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number <span class="text-rose-500">*</span></label>
                            <input type="tel" name="phone" required placeholder="10-digit Mobile No." pattern="[0-9]{10}" class="sol-input">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                            <input type="email" name="email" placeholder="rahul@example.com" class="sol-input">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Research Segment</label>
                            <select name="service" class="sol-input bg-white">
                                <option value="Equity Intraday">Equity Intraday</option>
                                <option value="Options Trading">Options Trading (Nifty/BankNifty)</option>
                                <option value="Futures Trading">Stock & Index Futures</option>
                                <option value="Equity Positional">Positional / Swing Equity</option>
                                <option value="Commodity (MCX)">Commodity Research (MCX)</option>
                                <option value="Mutual Funds">Mutual Funds & Portfolio</option>
                                <option value="General Advisory">All-in-One Wealth Package</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Trading Capital Bracket</label>
                            <select name="capital" class="sol-input bg-white">
                                <option value="₹1 Lakh - ₹3 Lakh">₹1 Lakh - ₹3 Lakh</option>
                                <option value="₹3 Lakh - ₹5 Lakh">₹3 Lakh - ₹5 Lakh</option>
                                <option value="₹5 Lakh - ₹10 Lakh">₹5 Lakh - ₹10 Lakh</option>
                                <option value="₹10 Lakh+">₹10 Lakh+</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Trading Queries / Comments</label>
                        <textarea name="message" rows="2" placeholder="Tell us your requirements or trading style..." class="sol-input resize-none"></textarea>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full btn-primary py-3 text-sm">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                            <span>Submit Request</span>
                        </button>
                    </div>

                    <div class="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-lock text-[10px]"></i>
                        <span>100% Privacy Protected. No spam guaranteed.</span>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ----------------------------------------------------
    // 5. Inject Floating WhatsApp Button (Strictly Bottom-Right)
    // ----------------------------------------------------
    let floatContainer = document.getElementById('solvitas-floating-widgets');
    if (!floatContainer) {
        floatContainer = document.createElement('div');
        floatContainer.id = 'solvitas-floating-widgets';
        document.body.appendChild(floatContainer);
    }
    
    floatContainer.innerHTML = `
        <a href="${SOLVITAS_CONFIG.contact.whatsappUrl}" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
        </a>
    `;

    // ----------------------------------------------------
    // 6. Dynamic Auto-Hydration for [data-config="..."]
    // ----------------------------------------------------
    document.querySelectorAll('[data-config]').forEach(el => {
        const path = el.getAttribute('data-config');
        const val = resolveConfigPath(SOLVITAS_CONFIG, path);
        if (val !== undefined && val !== null) {
            if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('tel:')) {
                el.setAttribute('href', 'tel:' + val);
            } else if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('mailto:')) {
                el.setAttribute('href', 'mailto:' + val);
            }
            el.textContent = val;
        }
    });
}

function resolveConfigPath(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
}
