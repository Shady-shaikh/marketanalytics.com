/**
 * Solvitas Analytics - Centralized Master Configuration
 * Single Source of Truth for all Business, Compliance, Contact, and Payment Details.
 */

const SOLVITAS_CONFIG = {
    // Brand & Legal Entity Details
    company: {
        legalName: "Solvitas Analytics Private Limited",
        brandName: "Solvitas Analytics",
        tagline: "SEBI Registered Research Analyst",
        shortDesc: "Independent, data-driven, and SEBI-compliant equity & derivatives research for serious traders and investors.",
        sebiRegNumber: "INH000023931",
        sebiCategory: "Non-Individual (Research Analyst)",
        sebiValidity: "Perpetual",
        cin: "U67190MH2024PTC428910",
        websiteUrl: "https://solvitasanalytics.com",
    },

    // Contact Numbers & Support Channels
    contact: {
        primaryPhone: "+91 9137295340",
        primaryPhoneRaw: "919137295340",
        supportEmail: "support@solvitasanalytics.com",
        complianceEmail: "compliance@solvitasanalytics.com",
        grievanceEmail: "grievance@solvitasanalytics.com",
        careersEmail: "careers@solvitasanalytics.com",
        workingHours: "Mon-Sat, 9:00AM-6:00PM",
        sebiWorkingHours: "Mon–Fri, 9 AM – 5 PM",
        whatsappNumber: "+91 9137295340",
        whatsappRaw: "919137295340",
        whatsappUrl: "https://wa.me/919137295340?text=Hello%20Solvitas%20Analytics,%20I%20am%20interested%20in%20your%20SEBI%20Research%20Services.",
    },

    // Office Addresses
    addresses: {
        registered: "Office No B 1904, Arihant Aura, Sanpada, Navi Mumbai, Maharashtra, India – 400705",
        corporate: "Office No B 1904, Arihant Aura, Sanpada, Navi Mumbai, Maharashtra, India – 400705",
        nearestSebiOffice: "Office No B 1904, Arihant Aura, Sanpada, Navi Mumbai, Maharashtra, India – 400705"
    },

    // Verified Banking & Payment Information
    banking: {
        upiId: "solvitas.ra@validicici",
        upiQrImage: "assets/img/payment/qr-1.png",
        accounts: [
            {
                bankName: "Kotak Mahindra Bank",
                accountHolder: "Solvitas Analytics Pvt Ltd",
                accountNumber: "98765431",
                ifscCode: "KKBK0002000",
                accountType: "Current Account",
                branch: "Sanpada, Navi Mumbai",
                logo: "assets/img/payment/kotak.png"
            },
            {
                bankName: "ICICI Bank",
                accountHolder: "Solvitas Analytics Pvt Ltd",
                accountNumber: "123456789",
                ifscCode: "ICIC0001000",
                accountType: "Current Account",
                branch: "Sanpada, Navi Mumbai",
                logo: "assets/img/payment/icici.png"
            }
        ]
    },

    // Social Profiles
    social: {
        facebook: "https://facebook.com/solvitasanalytics",
        instagram: "https://instagram.com/solvitasanalytics",
        tiktok: "https://tiktok.com/@solvitasanalytics",
        linkedin: "https://linkedin.com/company/solvitasanalytics",
        snapchat: "https://snapchat.com/add/solvitasanalytics",
        twitter: "https://twitter.com/solvitasanalytics",
        youtube: "https://youtube.com/@solvitasanalytics"
    },

    // Key Compliance Officers & External Portals
    compliance: {
        scoresPortalUrl: "https://scores.sebi.gov.in",
        smartOdrPortalUrl: "https://smartodr.in",
        sebiWebsiteUrl: "https://www.sebi.gov.in",
        nseWebsiteUrl: "https://www.nseindia.com",
        bseWebsiteUrl: "https://www.bseindia.com",
        mcxWebsiteUrl: "https://www.mcxindia.com",
        nsdlWebsiteUrl: "https://nsdl.co.in",
        cdslWebsiteUrl: "https://www.cdslindia.com",
        rbiWebsiteUrl: "https://www.rbi.org.in",
        ckycPortalUrl: "https://www.ckycindia.in",
        grievanceRedressalDays: "30 Days",
        disclaimerSummary: "Registration granted by SEBI, Enlistment as RA with Exchange and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."
    },

    // Navigation Menus
    navigation: {
        mainMenu: [
            { title: "Home", href: "index.html" },
            { title: "About", href: "about.html" },
            { title: "Offerings", href: "services.html" },
            { title: "Pricing", href: "pricing.html" },
            { title: "Support", href: "contact.html" },
            { title: "User Consent", href: "user-agreement.html" }
        ],
        servicesMenu: [
            { title: "Equity", href: "services/equity-research.html", icon: "fa-chart-line" },
            { title: "Derivatives", href: "services/derivatives-research.html", icon: "fa-bolt" },
            { title: "Alternative Investments Fund (AIF)", href: "services/aif-research.html", icon: "fa-gem" },
            { title: "Fixed Income (Bonds & FDs)", href: "services/fixed-income-research.html", icon: "fa-building-columns" },
            { title: "IPOs", href: "services/ipo-research.html", icon: "fa-rocket" },
            { title: "Mutual Funds", href: "services/mutual-funds-research.html", icon: "fa-pie-chart" },
            { title: "Commodity", href: "services/commodity-research.html", icon: "fa-coins" }
        ],
        companyMenu: [
            { title: "About", href: "about.html" },
            { title: "Bank Details", href: "bank-details.html" },
            { title: "Career", href: "careers.html" },
            { title: "Contact", href: "contact.html" },
            { title: "Investor Charter", href: "investor-charter.html" }
        ],
        termsMenu: [
            { title: "Client Consent Form", href: "user-agreement.html" },
            { title: "Disclaimer", href: "disclaimer.html" },
            { title: "Disclosure", href: "disclosure.html" },
            { title: "Service Disclosure", href: "service-disclosure.html" },
            { title: "Privacy Policy", href: "privacy-policy.html" },
            { title: "Refund Policy", href: "refund-policy.html" },
            { title: "Complaints", href: "complaint-board.html" },
            { title: "Terms & Conditions", href: "terms-and-conditions.html" },
            { title: "Compliance Audit", href: "compliance-audit.html" },
            { title: "Complaints Redressal", href: "complaints-redressal.html" },
            { title: "Grievance Redressal", href: "grievance-redressal.html" }
        ]
    }
};

// Freeze object to prevent runtime mutations
if (typeof Object.freeze === 'function') {
    Object.freeze(SOLVITAS_CONFIG);
}

// Export for Node/CommonJS if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SOLVITAS_CONFIG;
}
