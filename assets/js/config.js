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
        sebiCategory: "Research Analyst (RA)",
        sebiValidity: "Perpetual / Active",
        cin: "U72900MH2023PTC409812",
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
        workingHours: "Mon - Sat 09:00–18:00",
        workingDays: "Monday to Saturday",
        whatsappNumber: "919137295340",
        whatsappUrl: "https://wa.me/919137295340?text=Hello%20Solvitas%20Analytics,%20I%20am%20interested%20in%20your%20SEBI%20Research%20Services.",
    },

    // Office Addresses
    addresses: {
        registered: "Flat No. 204, Building A-2, Shanti Nagar, Sector 4, Mira Road East, Thane, Maharashtra – 401107",
        corporate: "Unit 402, Quantum Towers, Off SV Road, Malad West, Mumbai, Maharashtra – 400064",
        nearestSebiOffice: "SEBI Bhavan, Plot No. C4-A, 'G' Block, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051, Maharashtra"
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
        twitter: "https://twitter.com/solvitasanalytics",
        linkedin: "https://linkedin.com/company/solvitasanalytics",
        youtube: "https://youtube.com/@solvitasanalytics"
    },

    // Key Compliance Officers & External Portals
    compliance: {
        scoresPortalUrl: "https://scores.sebi.gov.in",
        smartOdrPortalUrl: "https://smartodr.in",
        sebiWebsiteUrl: "https://www.sebi.gov.in",
        ckycPortalUrl: "https://www.ckycindia.in",
        grievanceRedressalDays: "30 Days",
        disclaimerSummary: "Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."
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
            { title: "Equity Research", href: "services/equity-research.html", icon: "fa-chart-line" },
            { title: "Derivatives Research", href: "services/derivatives-research.html", icon: "fa-bolt" },
            { title: "Commodity Research", href: "services/commodity-research.html", icon: "fa-coins" },
            { title: "Mutual Funds", href: "services/mutual-funds-research.html", icon: "fa-pie-chart" },
            { title: "IPO Research", href: "services/ipo-research.html", icon: "fa-rocket" },
            { title: "Fixed Income", href: "services/fixed-income-research.html", icon: "fa-building-columns" },
            { title: "AIF Research", href: "services/aif-research.html", icon: "fa-gem" }
        ],
        legalMenu: [
            { title: "Investor Charter", href: "investor-charter.html" },
            { title: "Complaint Board", href: "complaint-board.html" },
            { title: "Complaints Redressal", href: "complaints-redressal.html" },
            { title: "Compliance Audit", href: "compliance-audit.html" },
            { title: "Grievance Redressal", href: "grievance-redressal.html" },
            { title: "SEBI Disclosure", href: "disclosure.html" },
            { title: "Disclaimer", href: "disclaimer.html" },
            { title: "Service Disclosure", href: "service-disclosure.html" },
            { title: "Bank Details", href: "bank-details.html" },
            { title: "Privacy Policy", href: "privacy-policy.html" },
            { title: "Refund Policy", href: "refund-policy.html" },
            { title: "Terms & Conditions", href: "terms-and-conditions.html" },
            { title: "Careers", href: "careers.html" }
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
