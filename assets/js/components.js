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
            <div class="w-full bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-medium">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between py-2">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-regular fa-clock text-teal-600 text-sm"></i>
                            <span>${SOLVITAS_CONFIG.contact.workingHours}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-phone text-teal-600 text-sm"></i>
                            <a href="tel:${SOLVITAS_CONFIG.contact.primaryPhone}" class="hover:text-teal-700 transition">${SOLVITAS_CONFIG.contact.primaryPhone}</a>
                        </div>
                        <div class="hidden md:flex items-center gap-1.5 text-slate-500">
                            <span class="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-200">
                                SEBI Reg: ${SOLVITAS_CONFIG.company.sebiRegNumber}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 mt-1 sm:mt-0">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-regular fa-envelope text-teal-600 text-sm"></i>
                            <a href="mailto:${SOLVITAS_CONFIG.contact.supportEmail}" class="hover:text-teal-700 transition">${SOLVITAS_CONFIG.contact.supportEmail}</a>
                        </div>
                        <div class="h-3.5 w-px bg-slate-300"></div>
                        <div class="flex items-center gap-3 text-slate-500">
                            <a href="${SOLVITAS_CONFIG.social.facebook}" target="_blank" class="hover:text-teal-600 transition" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.twitter}" target="_blank" class="hover:text-teal-600 transition" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.linkedin}" target="_blank" class="hover:text-teal-600 transition" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href="${SOLVITAS_CONFIG.social.youtube}" target="_blank" class="hover:text-teal-600 transition" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
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
            return `<a href="${fullHref}" class="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-teal-600 transition font-medium">${item.title}</a>`;
        }).join('');

        headerEl.innerHTML = `
            <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-200">
                <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <!-- Logo -->
                    <a href="${base}index.html" class="flex items-center gap-3">
                        <img src="${base}assets/img/logo-solvitas.png" class="h-10 w-auto" alt="${SOLVITAS_CONFIG.company.brandName}" onerror="this.src='${base}assets/img/favicon.png'; this.classList.add('h-8');">
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden lg:flex items-center gap-8">
                        ${navItemsHtml}
                    </div>

                    <!-- Right CTA & Mobile Toggle -->
                    <div class="flex items-center gap-4">
                        <button onclick="openLeadModal('Header CTA')" class="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6">
                            <i class="fa-solid fa-bolt text-teal-200"></i>
                            <span>Get Free Research</span>
                        </button>

                        <!-- Mobile Hamburger Button -->
                        <button id="solvitasMobileMenuBtn" class="lg:hidden p-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition" aria-label="Toggle navigation">
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
                            <a href="${base}bank-details.html" class="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Bank & Payment Details</a>
                            <a href="${base}contact.html" class="py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Contact & Grievance</a>
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
    // 3. Render SEBI Compliance Footer
    // ----------------------------------------------------
    const footerEl = document.getElementById('solvitas-footer');
    if (footerEl) {
        const servicesLinksHtml = SOLVITAS_CONFIG.navigation.servicesMenu.map(s => {
            const href = isServiceSubdir ? s.href.replace('services/', '') : s.href;
            return `<li><a href="${href}" class="text-slate-600 hover:text-teal-600 transition text-sm flex items-center gap-2"><i class="fa-solid fa-angle-right text-xs text-teal-500"></i> ${s.title}</a></li>`;
        }).join('');

        const legalLinksHtml = SOLVITAS_CONFIG.navigation.legalMenu.map(l => {
            const href = isServiceSubdir ? (base + l.href) : l.href;
            return `<li><a href="${href}" class="text-slate-600 hover:text-teal-600 transition text-sm flex items-center gap-2"><i class="fa-solid fa-angle-right text-xs text-teal-500"></i> ${l.title}</a></li>`;
        }).join('');

        footerEl.innerHTML = `
            <footer class="bg-slate-50 border-t border-slate-200 text-slate-700 pt-16 pb-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
                        <!-- Col 1: Brand & Regulatory Badge -->
                        <div>
                            <img src="${base}assets/img/logo-solvitas.png" class="h-10 w-auto mb-4" alt="${SOLVITAS_CONFIG.company.brandName}" onerror="this.src='${base}assets/img/favicon.png';">
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">
                                ${SOLVITAS_CONFIG.company.shortDesc}
                            </p>
                            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs space-y-1.5">
                                <div class="font-bold text-slate-800 flex items-center gap-1.5">
                                    <i class="fa-solid fa-certificate text-teal-600"></i>
                                    <span>SEBI Registered Research Analyst</span>
                                </div>
                                <div class="text-slate-600">Reg No: <strong class="text-slate-900 font-mono">${SOLVITAS_CONFIG.company.sebiRegNumber}</strong></div>
                                <div class="text-slate-600">Validity: <strong class="text-emerald-700">${SOLVITAS_CONFIG.company.sebiValidity}</strong></div>
                            </div>
                        </div>

                        <!-- Col 2: Research Offerings -->
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Research Offerings</h4>
                            <ul class="space-y-2.5">
                                ${servicesLinksHtml}
                            </ul>
                        </div>

                        <!-- Col 3: Legal & Regulatory Disclosures -->
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Regulatory & Compliance</h4>
                            <ul class="space-y-2.5">
                                ${legalLinksHtml.slice(0, 7)}
                            </ul>
                        </div>

                        <!-- Col 4: Official Contact & Grievance -->
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Official Contacts</h4>
                            <ul class="space-y-3 text-sm text-slate-600">
                                <li class="flex items-start gap-2.5">
                                    <i class="fa-solid fa-phone text-teal-600 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-slate-800">Support Helpline</div>
                                        <a href="tel:${SOLVITAS_CONFIG.contact.primaryPhone}" class="hover:text-teal-600">${SOLVITAS_CONFIG.contact.primaryPhone}</a>
                                    </div>
                                </li>
                                <li class="flex items-start gap-2.5">
                                    <i class="fa-regular fa-envelope text-teal-600 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-slate-800">Support Email</div>
                                        <a href="mailto:${SOLVITAS_CONFIG.contact.supportEmail}" class="hover:text-teal-600">${SOLVITAS_CONFIG.contact.supportEmail}</a>
                                    </div>
                                </li>
                                <li class="flex items-start gap-2.5">
                                    <i class="fa-solid fa-location-dot text-teal-600 mt-1"></i>
                                    <div>
                                        <div class="font-semibold text-slate-800">Corporate Office</div>
                                        <span>${SOLVITAS_CONFIG.addresses.corporate}</span>
                                    </div>
                                </li>
                            </ul>

                            <div class="mt-4 pt-3 border-t border-slate-200 flex items-center gap-3">
                                <a href="${SOLVITAS_CONFIG.compliance.scoresPortalUrl}" target="_blank" class="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-teal-700 font-semibold hover:bg-teal-50 transition">
                                    SEBI SCORES ↗
                                </a>
                                <a href="${SOLVITAS_CONFIG.compliance.smartOdrPortalUrl}" target="_blank" class="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-teal-700 font-semibold hover:bg-teal-50 transition">
                                    SMART ODR ↗
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Regulatory Mandatory Warning Strip -->
                    <div class="mt-8 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                        <strong class="font-bold text-amber-950 block mb-1">SEBI Mandatory Standard Risk Warning:</strong>
                        ${SOLVITAS_CONFIG.compliance.disclaimerSummary}
                    </div>

                    <!-- Bottom Copyright Bar -->
                    <div class="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
                        <div>
                            &copy; ${new Date().getFullYear()} ${SOLVITAS_CONFIG.company.legalName}. All rights reserved.
                        </div>
                        <div class="flex flex-wrap items-center gap-4">
                            <a href="${base}privacy-policy.html" class="hover:text-teal-600">Privacy Policy</a>
                            <span>&bull;</span>
                            <a href="${base}terms-and-conditions.html" class="hover:text-teal-600">Terms & Conditions</a>
                            <span>&bull;</span>
                            <a href="${base}refund-policy.html" class="hover:text-teal-600">Refund Policy</a>
                            <span>&bull;</span>
                            <a href="${base}disclaimer.html" class="hover:text-teal-600">Legal Disclaimer</a>
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
            <div class="modal-dialog p-6 sm:p-8 relative">
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
    // 5. Inject Floating WhatsApp Button
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
