document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const leadFormPlaceholder = document.getElementById('lead-form-placeholder');
    const path = window.pagePath || ''; 

    // Global fallback
    window.openLeadForm = () => alert("Loading form...");

    // --- LOAD FORM ---
    const loadLeadForm = async () => {
        if (!leadFormPlaceholder) return;
        try {
            const response = await fetch(`${path}components/lead-form-component.html`);
            if (!response.ok) throw new Error(`Form load failed: ${response.status}`);
            leadFormPlaceholder.innerHTML = await response.text();
            
            if (typeof initializeLeadForm === 'function') initializeLeadForm();
            initializeModalLogic();
        } catch (error) { console.error(error); }
    };

    // --- MODAL LOGIC (UPDATED) ---
    const initializeModalLogic = () => {
        const modal = document.getElementById('lead-form-lightbox');
        const backdrop = document.getElementById('lead-form-backdrop');
        const closeBtns = [document.getElementById('close-lead-form'), document.getElementById('close-lead-form-img')];

        // ELEMENTS TO POPULATE
        const els = {
            summary: document.getElementById('lead-product-summary'),
            defHeader: document.getElementById('lead-default-header'),
            img: document.getElementById('lead-product-img'),
            title: document.getElementById('lead-product-title'),
            price: document.getElementById('lead-product-price'),
            
            // Inputs
            dest: document.getElementById('destination'),
            dur: document.getElementById('duration'),
            
            // Hidden
            hName: document.getElementById('lead_product_name'),
            hPUrl: document.getElementById('lead_product_url'),
            hLUrl: document.getElementById('lead_landing_url'),
            hSrc: document.getElementById('lead_source')
        };

        if (!modal) return;

        // --- NEW OPEN FUNCTION ---
        window.openLeadForm = function(data = null) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Auto-fill Hidden Fields
            if(els.hLUrl) els.hLUrl.value = window.location.href;
            if(els.hSrc) els.hSrc.value = "Website";

            if (data && data.title) {
                // SHOW PRODUCT HEADER
                els.summary.classList.remove('hidden');
                els.defHeader.classList.add('hidden');

                // Visuals
                if(els.img) els.img.src = data.image || `${path}images/tourishq-icon.svg`;
                if(els.title) els.title.textContent = data.title;
                if(els.price) els.price.textContent = data.price ? `Starts from ${data.price}` : '';

                // Auto-fill Inputs
                if(els.dest) els.dest.value = data.title; // Using title as destination roughly
                if(els.dur) els.dur.value = data.duration || '';

                // Hidden Data
                if(els.hName) els.hName.value = data.title;
                if(els.hPUrl) els.hPUrl.value = data.url ? (window.location.origin + '/' + data.url.replace(/^\.\.\//, '')) : window.location.href;

            } else {
                // SHOW DEFAULT HEADER
                els.summary.classList.add('hidden');
                els.defHeader.classList.remove('hidden');
                
                // Reset visuals
                if(els.dest) els.dest.value = '';
                if(els.dur) els.dur.value = '';
                if(els.hName) els.hName.value = '';
                if(els.hPUrl) els.hPUrl.value = '';
            }
        };

        const closeLeadForm = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        closeBtns.forEach(btn => { if(btn) btn.addEventListener('click', closeLeadForm); });
        if(backdrop) backdrop.addEventListener('click', closeLeadForm);
    };

    // ... (Keep existing Header/Footer code below exactly as is) ...
    const destinationsData = {
        "domestic": [
            { "name": "Ladakh", "url": `${path}destinations/region.html?id=ladakh`, "icon": `${path}images/ladakh.png` },
            { "name": "Rajasthan", "url": `${path}destinations/region.html?id=rajasthan`, "icon": `${path}images/rajasthan.png` },
            { "name": "Kashmir", "url": `${path}destinations/region.html?id=kashmir`, "icon": `${path}images/kashmir.png` },
            { "name": "Himachal", "url": `${path}destinations/region.html?id=himachal`, "icon": `${path}images/himachal.png` },
            { "name": "North-east", "url": `${path}destinations/region.html?id=northeast`, "icon": `${path}images/northeast.png` },
            { "name": "Kerala", "url": `${path}destinations/region.html?id=kerala`, "icon": `${path}images/kerala.png` },
            { "name": "Spiti", "url": `${path}destinations/region.html?id=spiti`, "icon": `${path}images/spiti.png` },
            { "name": "Uttarakhand", "url": `${path}destinations/region.html?id=uttarakhand`, "icon": `${path}images/uttarakhand.png` }
        ],
        "international": [
            { "name": "Thailand", "url": `${path}destinations/region.html?id=thailand`, "icon": `${path}images/thailand.png` },
            { "name": "Dubai", "url": `${path}destinations/region.html?id=dubai`, "icon": `${path}images/dubai.png` },
            { "name": "Bali", "url": `${path}destinations/region.html?id=bali`, "icon": `${path}images/bali.png` },
            { "name": "Singapore", "url": `${path}destinations/region.html?id=singapore`, "icon": `${path}images/singapore.png` },
            { "name": "Europe", "url": `${path}destinations/region.html?id=europe`, "icon": `${path}images/europe.png` },
            { "name": "Vietnam", "url": `${path}destinations/region.html?id=vietnam`, "icon": `${path}images/vietnam.png` },
            { "name": "Japan", "url": `${path}destinations/region.html?id=japan`, "icon": `${path}images/japan.png` },
            { "name": "Australia", "url": `${path}destinations/region.html?id=australia`, "icon": `${path}images/australia.png` },
            { "name": "Maldives", "url": `${path}destinations/region.html?id=maldives`, "icon": `${path}images/maldives.png` }
        ]
    };

    const generateDestinationsHTML = (data) => {
        const createList = (arr) => arr.map(dest => `
            <a href="${dest.url}" class="flex items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <img src="${dest.icon}" alt="${dest.name}" class="w-6 h-6 mr-3 rounded object-cover">
                <span class="text-sm text-white">${dest.name}</span>
            </a>`).join('');
        return `
            <div>
                <h5 class="font-bold text-white mb-2 pl-3">Domestic</h5>
                <div class="space-y-1">${createList(data.domestic)}</div>
            </div>
            <div>
                <h5 class="font-bold text-white mb-2 mt-4 pl-3">International</h5>
                <div class="space-y-1">${createList(data.international)}</div>
            </div>
        `;
    };

    const headerHTML = `
    <style>
    #glass-dock {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        display: flex; align-items: center; gap: 4px; padding: 8px 16px;
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        background: rgba(26,26,26,0.75); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 32px; z-index: 50;
    }
    @media (max-width: 767px) {
        #glass-dock {
            bottom: 0; left: 0; right: 0; transform: none;
            border-radius: 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);
            padding: 10px 24px; justify-content: space-around;
        }
        body { padding-bottom: 72px; }
    }
    .dock-item {
        position: relative; display: flex; align-items: center; justify-content: center;
        width: 44px; height: 44px; border-radius: 50%; background: none; border: none;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease;
        cursor: pointer; color: rgba(255,255,255,0.8); text-decoration: none;
    }
    .dock-item:hover { transform: scale(1.35) translateY(-5px); background: rgba(255,255,255,0.1); color: #fff; }
    .dock-item svg { width: 22px; height: 22px; flex-shrink: 0; }
    .dock-tooltip {
        position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
        background: rgba(255,255,255,0.92); color: #1a1a1a; font-size: 11px; font-weight: 600;
        padding: 4px 10px; border-radius: 8px; white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity 0.15s ease; font-family: 'Montserrat', sans-serif;
    }
    .dock-item:hover .dock-tooltip { opacity: 1; }
    .dock-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.12); margin: 0 6px; flex-shrink: 0; }
    </style>

    <nav id="glass-dock">
        <a href="${path}index.html" class="flex items-center pr-3 mr-1 flex-shrink-0" style="border-right:1px solid rgba(255,255,255,0.1)">
            <img src="${path}images/tourishq8.png" alt="Tourishq" style="width:36px;height:36px;object-fit:contain">
        </a>

        <a href="${path}index.html" class="dock-item" id="dock-home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="dock-tooltip">Home</span>
        </a>

        <button id="dock-destinations" class="dock-item" aria-label="Destinations">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="dock-tooltip">Destinations</span>
        </button>

        <a href="${path}destinations/index.html" class="dock-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            <span class="dock-tooltip">All Packages</span>
        </a>

        <a href="${path}contact.html" class="dock-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="dock-tooltip">Contact</span>
        </a>

        <div class="dock-divider"></div>

        <a href="tel:+919116794500" class="dock-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span class="dock-tooltip">Call Us</span>
        </a>
    </nav>

    <div id="menu-overlay" class="fixed inset-0 bg-black/60 z-40 hidden transition-opacity duration-300"></div>

    <nav id="slide-out-menu" class="fixed top-0 right-0 h-full w-80 md:w-96 bg-[#1a1a1a] shadow-xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-gray-700">
            <a href="${path}index.html"><img src="${path}images/tourishq8.png" alt="Tourishq" class="h-10 w-auto object-contain"></a>
            <button id="close-menu-button" class="p-2 rounded-md text-white hover:bg-gray-800"><i class="fas fa-times text-2xl"></i></button>
        </div>
        <div class="p-4 space-y-2">
            <a href="${path}destinations/index.html" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#009E83]/10 border border-[#009E83]/30 hover:bg-[#009E83]/20 transition-colors text-[#009E83] font-bold mb-2">
                <i class="fas fa-th-large"></i> Browse All Destinations
            </a>
            ${generateDestinationsHTML(destinationsData)}
        </div>
        <div class="sticky bottom-0 left-0 w-full p-4 border-t border-gray-700 bg-[#1a1a1a]">
            <div class="flex justify-center space-x-6">
                <a href="#" class="text-white hover:text-gray-400 transition text-xl"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="text-white hover:text-gray-400 transition text-xl"><i class="fab fa-instagram"></i></a>
                <a href="#" class="text-white hover:text-gray-400 transition text-xl"><i class="fab fa-twitter"></i></a>
                <a href="#" class="text-white hover:text-gray-400 transition text-xl"><i class="fab fa-linkedin-in"></i></a>
            </div>
        </div>
    </nav>`;

    const footerHTML = `
        <footer class="bg-[#1a1a1a] text-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div class="md:col-span-2 lg:col-span-1">
                        <div class="flex items-center space-x-2 mb-4">
                            <a href="${path}index.html"><img src="${path}images/tourishq.svg" alt="Tourishq Logo" class="h-10 w-auto"></a>
                        </div>
                        <p class="text-gray-400">Empowering travel businesses and enriching traveler experiences.</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Quick Links</h4>
                        <ul class="space-y-3">
                            <li><a href="${path}destinations/index.html" class="text-gray-400 hover:text-white transition">All Destinations</a></li>
                            <li><a href="${path}about.html" class="text-gray-400 hover:text-white transition">About Us</a></li>
                            <li><a href="${path}contact.html" class="text-gray-400 hover:text-white transition">Contact Us</a></li>
                            <li><a href="${path}policy.html" class="text-gray-400 hover:text-white transition">Policies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Contact</h4>
                        <address class="not-italic text-gray-400 space-y-3">
                            <p><i class="fas fa-map-marker-alt mr-2 text-[#FFBC00]"></i>Vaishali Nagar, Jaipur 302034</p>
                            <p><i class="fas fa-phone mr-2 text-[#FFBC00]"></i><a href="tel:+919116794500" class="hover:text-white transition">+91 91167 94500</a></p>
                            <p><i class="fas fa-envelope mr-2 text-[#FFBC00]"></i><a href="mailto:info@tourishq.com" class="hover:text-white transition">info@tourishq.com</a></p>
                        </address>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white transition text-xl"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition text-xl"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition text-xl"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition text-xl"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div class="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; ${new Date().getFullYear()} Tourishq Travel Solutions. All Rights Reserved.</p>
                </div>
            </div>
        </footer>`;
    
    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    // --- Dock / Menu Listeners ---
    const dockDestBtn = document.getElementById('dock-destinations');
    const closeMenuButton = document.getElementById('close-menu-button');
    const slideOutMenu = document.getElementById('slide-out-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const openMenu = () => { if (slideOutMenu) slideOutMenu.classList.remove('translate-x-full'); if (menuOverlay) menuOverlay.classList.remove('hidden'); };
    const closeMenu = () => { if (slideOutMenu) slideOutMenu.classList.add('translate-x-full'); if (menuOverlay) menuOverlay.classList.add('hidden'); };

    if (dockDestBtn) dockDestBtn.addEventListener('click', openMenu);
    if (closeMenuButton) closeMenuButton.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    loadLeadForm();
});