/**
 * Solvitas Analytics - Main Interactive Controller
 * Handles Lead Modal, AJAX Form Submissions, Toasts, Pricing Filters, and Signatures.
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
            <div class="font-bold text-slate-800">${type === 'error' ? 'Submission Error' : 'Success!'}</div>
            <div class="text-slate-600 mt-0.5">${message}</div>
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
    }, 5000);
}

// ----------------------------------------------------
// 3. AJAX Lead Capture Handler
// ----------------------------------------------------
async function handleLeadFormSubmit(event, form) {
    if (event) event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Processing...</span>`;
    }

    // Determine correct relative path to api/lead-capture.php
    const path = window.location.pathname.replace(/\\/g, '/');
    const endpoint = path.includes('/services/') ? '../api/lead-capture.php' : 'api/lead-capture.php';

    const formData = new FormData(form);
    const dataObj = {};
    formData.forEach((value, key) => {
        dataObj[key] = value;
    });

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataObj)
        });

        const result = await response.json();

        if (result.success) {
            showSolvitasToast(result.message || 'Thank you! Your request has been received.', 'success');
            form.reset();
            closeLeadModal();
        } else {
            showSolvitasToast(result.message || 'There was a problem submitting your request. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Lead Submission Error:', err);
        showSolvitasToast('Network error. Please try calling our support helpline directly.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// Attach automatic submit listeners to all forms with data-lead-form
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[data-lead-form]').forEach(form => {
        form.addEventListener('submit', function(e) {
            handleLeadFormSubmit(e, this);
        });
    });

    // ----------------------------------------------------
    // 4. Pricing / Category Filters
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 5. Signature Canvas (User Agreement)
    // ----------------------------------------------------
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
});
