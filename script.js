// --- DATA INIT ---
const defaultVariants = [
    { id: 1, name: "Thai Jasmine", tag: "Fragrant", origin: "Thailand", image: "https://images.unsplash.com/photo-1596791242301-447a064010ce?q=80&w=600", desc: "Famous for its floral aroma and soft texture." },
    { id: 2, name: "Royal Basmati", tag: "Aromatic", origin: "India", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600", desc: "Long slender grains with a nutty flavor." },
    { id: 3, name: "Arborio", tag: "Creamy", origin: "Italy", image: "https://images.unsplash.com/photo-1605626279934-2e2d09337060?q=80&w=600", desc: "Short-grain rice perfect for Risotto." }
];

let variants = JSON.parse(localStorage.getItem('oryzaVariants')) || defaultVariants;
let orders = JSON.parse(localStorage.getItem('oryzaOrders')) || [];
let currentOrderTarget = null;

// --- DOM ELEMENTS ---
const cardsContainer = document.getElementById('cards-container');
const variantCount = document.getElementById('variant-count');
const viewModal = document.getElementById('view-modal');
const addModal = document.getElementById('add-modal');
const orderFormModal = document.getElementById('order-form-modal');
const orderHistoryModal = document.getElementById('order-history-modal');
const contactModal = document.getElementById('contact-modal');
const toast = document.getElementById('toast');
const splash = document.getElementById('splash-screen');

// --- INIT APP ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Activate Splash Timer
    setTimeout(() => { 
        splash.classList.add('hidden'); 
    }, 3000);

    // 2. Load Content
    renderVariants();
    loadContactInfo();
});

// --- RENDER LOGIC ---
function renderVariants() {
    cardsContainer.innerHTML = '';
    variantCount.innerText = `${variants.length} Items`;

    variants.forEach(variant => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${variant.image}');" onclick="openViewModal(${variant.id})"></div>
            <div class="card-content">
                <button class="delete-btn" onclick="deleteVariant(${variant.id})"><i class="fa-solid fa-trash"></i></button>
                <div onclick="openViewModal(${variant.id})">
                    <span class="card-tag">${variant.tag}</span>
                    <h4>${variant.name}</h4>
                    <span style="font-size:0.8rem; color:#888;">${variant.origin}</span>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// --- MODAL CONTROLLERS ---
function openViewModal(id) {
    const data = variants.find(v => v.id === id);
    if (!data) return;

    document.getElementById('modal-img').style.backgroundImage = `url('${data.image}')`;
    document.getElementById('modal-tag').innerText = data.tag;
    document.getElementById('modal-title').innerText = data.name;
    document.getElementById('modal-origin').innerText = data.origin;
    document.getElementById('modal-desc').innerText = data.desc;
    
    currentOrderTarget = data; 
    viewModal.classList.add('active');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.classList.remove('active'));
}

// --- BUTTON LISTENERS ---
document.getElementById('add-btn').addEventListener('click', () => addModal.classList.add('active'));
document.getElementById('contact-btn').addEventListener('click', () => contactModal.classList.add('active'));
document.getElementById('orders-btn').addEventListener('click', () => {
    renderOrders();
    orderHistoryModal.classList.add('active');
});
document.getElementById('open-order-form-btn').addEventListener('click', () => {
    if(!currentOrderTarget) return;
    viewModal.classList.remove('active');
    document.getElementById('order-target-name').innerText = currentOrderTarget.name;
    orderFormModal.classList.add('active');
});

// --- ADD / DELETE VARIANTS ---
document.getElementById('add-variant-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newVariant = {
        id: Date.now(),
        name: document.getElementById('new-name').value,
        tag: document.getElementById('new-tag').value,
        origin: document.getElementById('new-origin').value,
        image: document.getElementById('new-image').value,
        desc: document.getElementById('new-desc').value
    };
    variants.unshift(newVariant);
    localStorage.setItem('oryzaVariants', JSON.stringify(variants));
    renderVariants();
    e.target.reset();
    closeAllModals();
    showToast("Added Successfully");
});

function deleteVariant(id) {
    if(confirm("Delete this variant?")) {
        variants = variants.filter(v => v.id !== id);
        localStorage.setItem('oryzaVariants', JSON.stringify(variants));
        renderVariants();
        showToast("Deleted");
    }
}

// --- ORDER LOGIC ---
document.getElementById('submit-order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newOrder = {
        id: Date.now(),
        item: currentOrderTarget.name,
        qty: document.getElementById('order-qty').value,
        customer: document.getElementById('order-customer').value,
        location: document.getElementById('order-location').value,
        date: new Date().toLocaleDateString()
    };
    orders.unshift(newOrder); 
    localStorage.setItem('oryzaOrders', JSON.stringify(orders)); 
    e.target.reset();
    closeAllModals();
    showToast("Order Placed!");
});

function renderOrders() {
    const list = document.getElementById('orders-list');
    list.innerHTML = '';
    if(orders.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No orders yet.</p>';
        return;
    }
    orders.forEach(order => {
        const item = document.createElement('div');
        item.classList.add('order-item');
        item.innerHTML = `
            <div class="order-header"><span>${order.item}</span><span>${order.qty} kg</span></div>
            <div class="order-details">To: ${order.customer}<br>Loc: ${order.location}</div>
            <span class="order-date">${order.date}</span>
            <button class="delete-order" onclick="deleteOrder(${order.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

function deleteOrder(id) {
    if(confirm("Delete order?")) {
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('oryzaOrders', JSON.stringify(orders));
        renderOrders(); 
    }
}

// --- CONTACT INFO LOGIC ---
document.getElementById('edit-contact-btn').addEventListener('click', () => {
    const p = prompt("New Phone:", document.getElementById('contact-phone').innerText);
    const a = prompt("New Address:", document.getElementById('contact-address').innerText);
    if (p) { document.getElementById('contact-phone').innerText = p; localStorage.setItem('oryzaPhone', p); }
    if (a) { document.getElementById('contact-address').innerText = a; localStorage.setItem('oryzaAddress', a); }
});

function loadContactInfo() {
    if(localStorage.getItem('oryzaPhone')) document.getElementById('contact-phone').innerText = localStorage.getItem('oryzaPhone');
    if(localStorage.getItem('oryzaAddress')) document.getElementById('contact-address').innerText = localStorage.getItem('oryzaAddress');
}

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeAllModals();
    showToast("Message Sent");
    e.target.reset();
});

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}