// --- DATA INIT ---
const defaultVariants = [
    { 
        id: 1, 
        name: "Thai Jasmine", 
        tag: "Fragrant", 
        origin: "Thailand", 
        harvestDays: 115,
        grainType: "Long Grain",
        ecosystem: "Irrigated",
        image: "https://images.unsplash.com/photo-1596791242301-447a064010ce?q=80&w=600", 
        desc: "Famous for its floral aroma and soft texture. It requires sufficient water and is best grown in wet seasons." 
    },
    { 
        id: 2, 
        name: "Royal Basmati", 
        tag: "Aromatic", 
        origin: "India", 
        harvestDays: 130,
        grainType: "Extra Long",
        ecosystem: "Rainfed",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600", 
        desc: "Long slender grains with a nutty flavor. Known for elongating almost twice its length upon cooking." 
    },
    { 
        id: 3, 
        name: "Arborio", 
        tag: "Creamy", 
        origin: "Italy", 
        harvestDays: 160,
        grainType: "Short Grain",
        ecosystem: "Upland",
        image: "https://images.unsplash.com/photo-1605626279934-2e2d09337060?q=80&w=600", 
        desc: "Short-grain rice with high starch content, making it the perfect choice for creamy Risotto dishes." 
    }
];

let variants = JSON.parse(localStorage.getItem('oryzaVariants')) || defaultVariants;

// --- DOM ELEMENTS ---
const cardsContainer = document.getElementById('cards-container');
const variantCount = document.getElementById('variant-count');
const viewModal = document.getElementById('view-modal');
const addModal = document.getElementById('add-modal');
const contactModal = document.getElementById('contact-modal');
const toast = document.getElementById('toast');
const splash = document.getElementById('splash-screen');

// --- INIT APP ---
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { 
        splash.classList.add('hidden'); 
    }, 3000);

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
                    <span style="font-size:0.8rem; color:#888;">
                        <i class="fa-regular fa-clock"></i> ${variant.harvestDays} Days
                    </span>
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
    
    document.getElementById('modal-days').innerText = `${data.harvestDays} Days`;
    document.getElementById('modal-grain').innerText = data.grainType;
    document.getElementById('modal-eco').innerText = data.ecosystem;
    
    viewModal.classList.add('active');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.classList.remove('active'));
}

// --- BUTTON LISTENERS ---
document.getElementById('add-btn').addEventListener('click', () => addModal.classList.add('active'));
document.getElementById('contact-btn').addEventListener('click', () => contactModal.classList.add('active'));

// --- ADD VARIANT WITH FILE UPLOAD ---
document.getElementById('add-variant-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('new-image-file');
    const file = fileInput.files[0];

    // Helper to save
    const saveVariantData = (imageUrl) => {
        const newVariant = {
            id: Date.now(),
            name: document.getElementById('new-name').value,
            tag: document.getElementById('new-tag').value,
            origin: document.getElementById('new-origin').value,
            harvestDays: document.getElementById('new-days').value,
            grainType: document.getElementById('new-grain').value,
            ecosystem: document.getElementById('new-eco').value,
            image: imageUrl,
            desc: document.getElementById('new-desc').value
        };
        
        variants.unshift(newVariant);
        localStorage.setItem('oryzaVariants', JSON.stringify(variants));
        renderVariants();
        e.target.reset();
        closeAllModals();
        showToast("Added Successfully");
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveVariantData(event.target.result); // Save Base64 string
        };
        reader.readAsDataURL(file);
    } else {
        // Fallback placeholder
        saveVariantData("https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600"); 
    }
});

function deleteVariant(id) {
    if(confirm("Delete this variant?")) {
        variants = variants.filter(v => v.id !== id);
        localStorage.setItem('oryzaVariants', JSON.stringify(variants));
        renderVariants();
        showToast("Deleted");
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
