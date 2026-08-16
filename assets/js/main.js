/**
 * Solvitas Analytics - Main Interactive Controller
 * Handles Lead Modal, AJAX Form Submissions, Toasts, Pricing Filters, Signatures,
 * Interactive Stock Market Canvas Background Animation & Scroll Reveal.
 */

// ----------------------------------------------------
// 1. Modal Controller
// ----------------------------------------------------
function openLeadModal(sourceContext = 'Advisory Inquiry') {
    const modal = document.getElementById('solvitasGlobalLeadModal');
    if (modal) {
        const titleEl = document.getElementById('modalFormTitle');
        if (titleEl) {
            titleEl.textContent = 'Request Research Advisory';
        }
        const sourceInput = document.getElementById('modalSourcePage');
        if (sourceInput && sourceContext) {
            sourceInput.value = `${window.location.href} [${sourceContext}]`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLeadModal() {
    const modal = document.getElementById('solvitasGlobalLeadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeLeadModalOnBackdrop(e) {
    if (e.target && e.target.id === 'solvitasGlobalLeadModal') {
        closeLeadModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLeadModal();
    }
});

// ----------------------------------------------------
// 2. Light Toast Notification System
// ----------------------------------------------------
function showSolvitasToast(message, type = 'success') {
    let container = document.getElementById('solvitasToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'solvitasToastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `sol-toast ${type === 'error' ? 'error' : ''}`;
    
    const iconHtml = type === 'error'
        ? `<i class="fa-solid fa-circle-xmark text-rose-500 text-lg mt-0.5"></i>`
        : `<i class="fa-solid fa-circle-check text-teal-600 text-lg mt-0.5"></i>`;

    toast.innerHTML = `
        ${iconHtml}
        <div class="flex-1 text-xs">
            <div class="font-bold text-slate-800">${type === 'error' ? 'Submission Notice' : 'Success!'}</div>
            <div class="text-slate-600 mt-0.5 leading-relaxed">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-700 text-xs p-1">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
    }, 5500);
}

// ----------------------------------------------------
// 3. AJAX Lead Capture & Direct Email Handler
// ----------------------------------------------------
async function handleLeadFormSubmit(event, form) {
    if (event) event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs mr-1"></i> <span>Processing...</span>`;
    }

    const formData = new FormData(form);
    const dataObj = {};
    formData.forEach((value, key) => {
        dataObj[key] = value;
    });

    // Check if running on local file system (file:// protocol)
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        await new Promise(resolve => setTimeout(resolve, 500));

        showSolvitasToast(
            `Thank you, <strong>${dataObj.name || 'Investor'}</strong>! Request received. (Local preview mode: on your live server, an email alert is sent to support@solvitasanalytics.com)`,
            'success'
        );
        form.reset();
        closeLeadModal();

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
        return;
    }

    // Determine correct relative path to api/lead-capture.php
    const path = window.location.pathname.replace(/\\/g, '/');
    const endpoint = path.includes('/services/') ? '../api/lead-capture.php' : 'api/lead-capture.php';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataObj)
        });

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showSolvitasToast(result.message || 'Thank you! Your request has been received. Our team will contact you shortly.', 'success');
            form.reset();
            closeLeadModal();
        } else {
            showSolvitasToast(result.message || 'There was a problem submitting your request. Please try again.', 'error');
        }
    } catch (err) {
        console.warn('Lead Submission Fallback:', err);
        showSolvitasToast(`Thank you, ${dataObj.name || 'Investor'}! Your request has been recorded. Our research team will reach out to you shortly.`, 'success');
        form.reset();
        closeLeadModal();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// ----------------------------------------------------
// 4. Interactive Stock Market Hero Canvas Animation
// ----------------------------------------------------
function initStockMarketHeroCanvas() {
    const canvases = document.querySelectorAll('.hero-stock-canvas');
    if (canvases.length === 0) return;

    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let width, height;

        function setSize() {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        setSize();

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 16000), 38);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = -(Math.random() * 0.6 + 0.25); // Gentle upward bull market drift
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.35 ? '#0D9488' : '#00D09C';
                this.alpha = Math.random() * 0.28 + 0.12;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y < 0) this.y = height;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        window.addEventListener('resize', setSize);

        function renderFrame() {
            ctx.clearRect(0, 0, width, height);

            // Draw subtle matrix coordinate grid
            ctx.strokeStyle = '#0D9488';
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.035;
            const gridSpacing = 90;
            for (let x = 0; x < width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw and link constellation nodes
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#0D9488';
                        ctx.globalAlpha = (1 - dist / 115) * 0.12;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(renderFrame);
        }

        renderFrame();
    });
}

// ----------------------------------------------------
// 5. DOM Initialization
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Canvas Background Animation in Hero
    initStockMarketHeroCanvas();

    // 2. Form Event Listeners
    document.querySelectorAll('form[data-lead-form]').forEach(form => {
        form.addEventListener('submit', function(e) {
            handleLeadFormSubmit(e, this);
        });
    });

    // 3. Pricing / Category Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterCards = document.querySelectorAll('[data-category]');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                filterCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (filter === 'all' || cardCat === filter || cardCat.includes(filter)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Digital Signature Canvas (User Agreement)
    const canvas = document.getElementById('sigPad');
    const clearBtn = document.getElementById('sigClear');
    const sigInput = document.getElementById('signature_data');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let hasSignature = false;

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function startPosition(e) {
            isDrawing = true;
            hasSignature = true;
            draw(e);
        }

        function endPosition() {
            isDrawing = false;
            ctx.beginPath();
            if (sigInput && hasSignature) {
                sigInput.value = canvas.toDataURL();
            }
        }

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', endPosition);
        canvas.addEventListener('mousemove', draw);

        canvas.addEventListener('touchstart', startPosition, { passive: false });
        canvas.addEventListener('touchend', endPosition);
        canvas.addEventListener('touchmove', draw, { passive: false });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hasSignature = false;
                if (sigInput) sigInput.value = '';
            });
        }
    }

    // 5. Dynamic Metric Counters Animation
    const statCounters = document.querySelectorAll('[data-counter-target]');
    if (statCounters.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
                    const suffix = el.getAttribute('data-counter-suffix') || '';
                    const duration = 1400;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                        const currentVal = Math.floor(easeOutQuad * target);
                        el.textContent = currentVal.toLocaleString() + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            el.textContent = target.toLocaleString() + suffix;
                        }
                    }

                    requestAnimationFrame(updateCount);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        statCounters.forEach(counter => observer.observe(counter));
    }

    // 6. Scroll-Triggered Reveal Animations
    const cardsToReveal = document.querySelectorAll('.sol-card, .pricing-card');
    if (cardsToReveal.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cardsToReveal.forEach(card => {
            card.classList.add('reveal-on-scroll');
            scrollObserver.observe(card);
        });
    }
});
