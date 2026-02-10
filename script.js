// Variablat globale
let allProducts = [];
let filteredProducts = [];
let cart = [];
let currentModelFilter = 'all';
let currentSort = 'random';
let displayedCount = 12; // Rivendos këtë variabël
let selectedProduct = null;
let selectedColor = null;
let selectedSize = null;
let selectedQuantity = 10;

// Variablat për optimizim
let isLoading = false;
let productsLoaded = false;

// Kur faqja ngarkohet
document.addEventListener('DOMContentLoaded', function() {
    // Ngarko të dhënat nga skedari JSON
    loadProductsFromJSON();
    
    // Ngarko të gjitha pjesët
    loadCartFromStorage();
    updateCartCount();
    renderCart();
    
    // Shto event listeners
    setupEventListeners();
});

// Funksioni për formatimin e çmimeve në Lekë
function formatPrice(priceInCents) {
    // Nëse çmimet janë tashmë në Lekë, përdorni:
    return `${priceInCents} Lekë`;
    
    // Nëse çmimet janë në $ dhe doni të konvertoni:
    // const exchangeRate = 100; // 1$ = 100 Lekë
    // const priceInLeke = (priceInCents / 100) * exchangeRate;
    // return `${Math.round(priceInLeke)} Lekë`;
}

// Funksioni për ngarkimin e produkteve nga JSON
function loadProductsFromJSON() {
    isLoading = true;
    
    const jsonUrl = 'products.json';
    
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allProducts = data.products || data;
            filteredProducts = [...allProducts];
            productsLoaded = true;
            
            // Renderizo produktet pasi të ngarkohen
            renderJustInProducts();
            renderAllProducts();
            
            // Përzier të rastësishme fillestare
            shuffleProducts();
            
            isLoading = false;
        })
        .catch(error => {
            console.error('Gabim në ngarkimin e produkteve:', error);
            useLocalFallbackData();
            isLoading = false;
        });
}

// Funksioni për të përdorur të dhënat lokale në rast se JSON-i nuk ngarkohet
function useLocalFallbackData() {
    console.log('Përdorim të dhëna lokale si rezervë...');
    
    const fallbackData = {
        "products": [
            {
                "id": 1,
                "brand": "Nike",
                "model": "Air Max 270",
                "name": "Nike Air Max 270 React",
                "description": "Këpucë sportive me teknologjinë Air Max",
                "price": 14500,
                "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "category": "Sportive",
                "justIn": true,
                "available": true,
                "colors": [
                    {
                        "name": "E bardhë",
                        "code": "#FFFFFF",
                        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                ],
                "sizes": ["38", "39", "40"],
                "inStock": {
                    "38": ["E bardhë"],
                    "39": ["E bardhë"],
                    "40": ["E bardhë"]
                }
            },
            {
                "id": 2,
                "brand": "Adidas",
                "model": "Ultraboost",
                "name": "Adidas Ultraboost 22",
                "description": "Këpucë vrapimi me teknologjinë Boost",
                "price": 16000,
                "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "category": "Vrapim",
                "justIn": true,
                "available": true,
                "colors": [
                    {
                        "name": "E bardhë",
                        "code": "#FFFFFF",
                        "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                ],
                "sizes": ["39", "40", "41"],
                "inStock": {
                    "39": ["E bardhë"],
                    "40": ["E bardhë"],
                    "41": ["E bardhë"]
                }
            },
            {
                "id": 3,
                "brand": "Puma",
                "model": "RS-X",
                "name": "Puma RS-X Reinvention",
                "description": "Këpucë retro me stil modern",
                "price": 12000,
                "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "category": "Çdo ditë",
                "justIn": false,
                "available": true,
                "colors": [
                    {
                        "name": "E zezë",
                        "code": "#000000",
                        "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                ],
                "sizes": ["38", "40", "42"],
                "inStock": {
                    "38": ["E zezë"],
                    "40": ["E zezë"],
                    "42": ["E zezë"]
                }
            },
            {
                "id": 4,
                "brand": "New Balance",
                "model": "574",
                "name": "New Balance 574 Classic",
                "description": "Këpucë klasike me rehati",
                "price": 11000,
                "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "category": "Çdo ditë",
                "justIn": false,
                "available": true,
                "colors": [
                    {
                        "name": "Gri",
                        "code": "#808080",
                        "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                ],
                "sizes": ["39", "41", "43"],
                "inStock": {
                    "39": ["Gri"],
                    "41": ["Gri"],
                    "43": ["Gri"]
                }
            }
        ]
    };
    
    allProducts = fallbackData.products;
    filteredProducts = [...allProducts];
    productsLoaded = true;
    
    // Renderizo produktet
    renderJustInProducts();
    renderAllProducts();
    
    // Shfaq njoftim për përdoruesin
    showNotification('U ngarkuan të dhënat lokale. Kontrolloni lidhjen me internet.', 'warning');
}

// Funksioni për përzierjen e produkteve
function shuffleProducts() {
    if (!productsLoaded) return;
    
    filteredProducts = [...allProducts].sort(() => Math.random() - 0.5);
    renderAllProducts();
}

// Funksioni për renderimin e produkteve "Just In"
function renderJustInProducts() {
    if (!productsLoaded) return;
    
    const container = document.getElementById('just-in-products');
    if (!container) return;
    
    container.innerHTML = '';
    
    const justInProducts = allProducts.filter(product => product.justIn);
    
    if (justInProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <p style="color: #999;">Nuk ka produkte të reja për momentin</p>
            </div>
        `;
        return;
    }
    
    justInProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'nike-style-card';
        productCard.dataset.id = product.id;
        productCard.dataset.model = product.model;
        
        productCard.innerHTML = `
            <div class="just-in-badge">Just In</div>
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-type">${product.description}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
            <button class="quick-action-btn" 
                    data-id="${product.id}"
                    title="Zgjidhni opsionet">
                <i class="fas fa-cog"></i>
            </button>
        `;
        
        container.appendChild(productCard);
    });
}

// Funksioni për renderimin e të gjitha produkteve
function renderAllProducts() {
    if (!productsLoaded) return;
    
    const container = document.getElementById('all-products');
    if (!container) return;
    
    // Shfaq loading state
    if (isLoading) {
        container.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="loading-spinner"></div>
                <p>Duke ngarkuar produktet...</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    // Përdor displayedCount për të kontrolluar sa produkte shfaqen
    const productsToShow = filteredProducts.slice(0, displayedCount);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">Nuk u gjet asnjë produkt</h3>
                <p style="color: #999;">Provoni të ndryshoni filtrat ose kërkoni diçka tjetër</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'nike-style-card';
        productCard.dataset.id = product.id;
        productCard.dataset.model = product.model;
        
        productCard.innerHTML = `
            ${product.justIn ? '<div class="just-in-badge">Just In</div>' : ''}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-type">${product.description}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
            <button class="quick-action-btn" 
                    data-id="${product.id}"
                    title="Zgjidhni opsionet">
                <i class="fas fa-cog"></i>
            </button>
        `;
        
        container.appendChild(productCard);
    });
    
    // Kontrollo nëse duhet të shfaqet butoni "Shfaq më shumë"
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (displayedCount >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }
}

// Funksioni për hapjen e modalit të produktit
function openProductModal(productId) {
    if (!productsLoaded) {
        showNotification('Produktet nuk janë ngarkuar ende', 'error');
        return;
    }
    
    selectedProduct = allProducts.find(p => p.id === productId);
    
    if (!selectedProduct) return;
    
    // Reset zgjedhjet
    selectedColor = null;
    selectedSize = null;
    selectedQuantity = 1;
    
    // Përditëso informacionin në modal
    document.getElementById('modal-product-image').src = selectedProduct.image;
    document.getElementById('modal-product-image').alt = selectedProduct.name;
    document.getElementById('modal-product-name').textContent = selectedProduct.name;
    document.getElementById('modal-product-brand').textContent = selectedProduct.brand;
    document.getElementById('modal-product-price').textContent = formatPrice(selectedProduct.price);
    
    // Renderizo ngjyrat
    renderColors();
    
    // Renderizo madhësitë
    renderSizes();
    
    // Përditëso sasinë
    document.getElementById('product-quantity').value = selectedQuantity;
    
    // Shfaq modal
    const productModal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    
    if (productModal && overlay) {
        productModal.classList.add('active');
        overlay.classList.add('active');
    }
}

// Funksioni për renderimin e ngjyrave
function renderColors() {
    const container = document.getElementById('colors-container');
    if (!container || !selectedProduct) return;
    
    container.innerHTML = '';
    
    selectedProduct.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 0 ? 'selected' : ''}`;
        colorOption.dataset.color = color.name;
        colorOption.dataset.index = index;
        
        colorOption.innerHTML = `
            <div class="color-preview" style="--color: ${color.code};"></div>
            <div class="color-name">${color.name}</div>
        `;
        
        container.appendChild(colorOption);
    });
    
    // Zgjidh ngjyrën e parë si default
    if (selectedProduct.colors.length > 0) {
        selectedColor = selectedProduct.colors[0].name;
    }
    
    // Shto event listeners për ngjyrat
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const colorName = this.dataset.color;
            const colorIndex = parseInt(this.dataset.index);
            
            // Përditëso aktivin
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Përditëso ngjyrën e zgjedhur
            selectedColor = colorName;
            
            // Ndrysho imazhin sipas ngjyrës së zgjedhur
            if (selectedProduct.colors[colorIndex]) {
                document.getElementById('modal-product-image').src = selectedProduct.colors[colorIndex].image;
            }
        });
    });
}

// Funksioni për renderimin e madhësive
function renderSizes() {
    const container = document.getElementById('sizes-container');
    if (!container || !selectedProduct || !selectedColor) return;
    
    container.innerHTML = '';
    
    selectedProduct.sizes.forEach((size, index) => {
        // Kontrollo nëse madhësia është në dispozicion për ngjyrën e zgjedhur
        const isAvailable = selectedProduct.inStock[size] && 
                           selectedProduct.inStock[size].includes(selectedColor);
        
        const sizeOption = document.createElement('div');
        sizeOption.className = `size-option ${isAvailable ? '' : 'unavailable'} ${index === 0 && isAvailable ? 'selected' : ''}`;
        sizeOption.dataset.size = size;
        sizeOption.textContent = size;
        
        if (isAvailable) {
            container.appendChild(sizeOption);
        }
    });
    
    // Zgjidh madhësinë e parë të disponueshme si default
    const firstAvailableSize = container.querySelector('.size-option:not(.unavailable)');
    if (firstAvailableSize) {
        selectedSize = firstAvailableSize.dataset.size;
    }
    
    // Shto event listeners për madhësitë
    document.querySelectorAll('.size-option:not(.unavailable)').forEach(option => {
        option.addEventListener('click', function() {
            const size = this.dataset.size;
            
            // Përditëso aktivin
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Përditëso madhësinë e zgjedhur
            selectedSize = size;
        });
    });
}

// Funksioni për shtimin në shportë nga modal
function addToCartFromModal() {
    if (!selectedProduct || !selectedColor || !selectedSize) {
        showNotification('Ju lutemi zgjidhni të gjitha opsionet', 'error');
        return;
    }
    
    // Kontrollo nëse produkti është i disponueshëm me kombinimin e zgjedhur
    const isAvailable = selectedProduct.inStock[selectedSize] && 
                       selectedProduct.inStock[selectedSize].includes(selectedColor);
    
    if (!isAvailable) {
        showNotification('Ky kombinim nuk është i disponueshëm', 'error');
        return;
    }
    
    // Kontrollo nëse produkti ekziston tashmë në shportë me të njëjtat specifikime
    const existingItemIndex = cart.findIndex(item => 
        item.id === selectedProduct.id && 
        item.color === selectedColor && 
        item.size === selectedSize
    );
    
    if (existingItemIndex >= 0) {
        // Rrit sasinë
        cart[existingItemIndex].quantity += selectedQuantity;
    } else {
        // Shto produkt të ri
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            brand: selectedProduct.brand,
            model: selectedProduct.model,
            price: selectedProduct.price,
            image: selectedProduct.image,
            color: selectedColor,
            size: selectedSize,
            quantity: selectedQuantity
        });
    }
    
    // Përditëso pamjen
    updateCartCount();
    renderCart();
    saveCartToStorage();
    
    // Shfaq njoftim
    showNotification(`${selectedProduct.name} (${selectedColor}, ${selectedSize}) u shtua në shportë!`, 'success');
    
    // Mbylle modal
    closeProductModal();
}

// Funksioni për mbylljen e modalit të produktit
function closeProductModal() {
    const productModal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    
    if (productModal && overlay) {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    selectedProduct = null;
    selectedColor = null;
    selectedSize = null;
    selectedQuantity = 1;
}

// Funksioni për filtrimin sipas modelit
function filterByModel(model) {
    if (!productsLoaded) return;
    
    currentModelFilter = model;
    
    // Përditëso aktivin në butonat e shpejtë
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.model === model) {
            btn.classList.add('active');
        }
    });
    
    // Filtro produktet
    if (model === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.model === model);
    }
    
    // Apliko sortimin aktual
    sortProducts();
    
    // Reset count dhe renderizo
    displayedCount = 12; // Kthehu te numri fillestar
    renderAllProducts();
    
    // Shfaq njoftim për filtër
    if (model !== 'all') {
        showNotification(`Filtruar sipas: ${model}`);
    }
}

// Funksioni për sortimin e produkteve 
function sortProducts() {
    if (!productsLoaded) return;
    
    switch(currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'random':
        default:
            filteredProducts = [...filteredProducts].sort(() => Math.random() - 0.5);
            break;
    }
}

// Funksioni për përditësimin e numrit në ikonën e shportës
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Funksioni për renderimin e shportës
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const subtotalPrice = document.getElementById('subtotal-price');
    const totalPrice = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!container || !subtotalPrice || !totalPrice || !checkoutBtn) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-bag"></i>
                <p>Shporta juaj është e zbrazët</p>
                <small>Shtoni produkte për të filluar</small>
            </div>
        `;
        
        subtotalPrice.textContent = '0 Lekë';
        totalPrice.textContent = '0 Lekë';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Llogarit totalet
    let subtotal = 0;
    
    // Krijo listën e produkteve
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-info">
                    ${item.brand} - ${item.model}<br>
                    Ngjyra: ${item.color}<br>
                    Madhësia: ${item.size}
                </div>
                <div class="cart-item-price">${formatPrice(itemTotal)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}" title="Hiq nga shporta">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(cartItem);
    });
    
    // Përditëso çmimet
    const total = subtotal;
    subtotalPrice.textContent = formatPrice(subtotal);
    totalPrice.textContent = formatPrice(total);
    
    // Aktivizo butonin e checkout
    checkoutBtn.disabled = false;
    
    // Shto event listeners për shportën
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateCartQuantity(index, 'decrease');
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateCartQuantity(index, 'increase');
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
        });
    });
}

// Funksioni për përditësimin e sasisë në shportë
function updateCartQuantity(index, action) {
    if (index < 0 || index >= cart.length) return;
    
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease') {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    
    updateCartCount();
    renderCart();
    saveCartToStorage();
}

// Funksioni për heqjen nga shporta
function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    
    const item = cart[index];
    cart.splice(index, 1);
    
    updateCartCount();
    renderCart();
    saveCartToStorage();
    
    showNotification(`${item.name} u hoq nga shporta`, 'info');
}

// Funksioni për përgatitjen e porosisë për WhatsApp
function prepareWhatsAppOrder() {
    if (cart.length === 0) return;
    
    const summary = document.getElementById('whatsapp-order-summary');
    if (!summary) return;
    
    let subtotal = 0;
    let orderItems = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        orderItems += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-info">
                        ${item.brand} - ${item.model}<br>
                        Ngjyra: ${item.color} | Madhësia: ${item.size}<br>
                        Sasia: ${item.quantity}
                    </div>
                    <div class="order-item-total">${formatPrice(itemTotal)}</div>
                </div>
            </div>
        `;
    });
    
    const total = subtotal;
    
    summary.innerHTML = `
        <h4 style="margin-bottom: 15px; color: #111;">Përmbledhja e porosisë</h4>
        ${orderItems}
        <div class="order-total">
            <span>Totali:</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;
    
    // Shfaq modal
    const whatsappModal = document.getElementById('whatsapp-modal');
    if (whatsappModal) {
        whatsappModal.classList.add('active');
        document.getElementById('customer-name').focus();
    }
}

// Funksioni për dërgimin e porosisë në WhatsApp
function sendToWhatsApp() {
    // Merr të dhënat e klientit
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    // Validimi
    if (!name || !phone || !address) {
        showNotification('Ju lutemi plotësoni të gjitha fushat', 'error');
        return;
    }
    
    // Krijo mesazhin
    let message = `🛒 POROSI E RE - Dyqani i Këpucëve\n\n`;
    message += `👤 Klienti: ${name}\n`;
    message += `📞 Telefoni: ${phone}\n`;
    message += `📍 Adresa: ${address}\n\n`;
    message += `📋 Produktet e porositura:\n\n`;
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        message += `${index + 1}. ${item.name}\n`;
        message += `   Marka: ${item.brand}\n`;
        message += `   Modeli: ${item.model}\n`;
        message += `   Ngjyra: ${item.color}\n`;
        message += `   Madhësia: ${item.size}\n`;
        message += `   Sasia: ${item.quantity}\n`;
        message += `   Çmimi: ${formatPrice(item.price)}\n`;
        message += `   Nëntotali: ${formatPrice(itemTotal)}\n\n`;
    });
    
    const total = subtotal;
    
    message += `💰 TOTALI: ${formatPrice(total)}\n\n`;
    message += `📅 Data: ${new Date().toLocaleDateString('sq-AL')}\n`;
    message += `⏰ Ora: ${new Date().toLocaleTimeString('sq-AL', {hour: '2-digit', minute:'2-digit'})}\n\n`;
    message += `📍 Adresa e dërgesës:\n${address}\n\n`;
    message += `⚠️ Ju do te njoftoheni sa më shpejt për konfirmimin e kësaj porosie.`;
    
    // Kodifiko mesazhin
    const encodedMessage = encodeURIComponent(message);
    
    // Numri i WhatsApp të dyqanit
    const whatsappNumber = '+355694707750'; // Zëvendëso me numrin real
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Hap WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mbylle modal
    const whatsappModal = document.getElementById('whatsapp-modal');
    if (whatsappModal) {
        whatsappModal.classList.remove('active');
    }
    
    // Pastro formën
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    
    // Shfaq konfirmim
    showNotification('Porosia u dërgua me sukses! Kontrolloni WhatsApp.', 'success');
}

// Funksioni për shfaqjen e njoftimeve
function showNotification(message, type = 'info') {
    // Hiq njoftimet ekzistuese
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Krijo njoftimin e ri
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Shto stil sipas tipit
    if (type === 'success') {
        notification.style.background = '#25D366';
    } else if (type === 'error') {
        notification.style.background = '#ff4757';
    } else if (type === 'warning') {
        notification.style.background = '#ffa502';
    }
    
    document.body.appendChild(notification);
    
    // Hiq njoftimin pas 3 sekondash
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funksioni për ruajtjen e shportës në localStorage
function saveCartToStorage() {
    localStorage.setItem('shoeStoreCart', JSON.stringify(cart));
}

// Funksioni për ngarkimin e shportës nga localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoeStoreCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.log('Gabim në leximin e shportës së ruajtur');
            cart = [];
        }
    }
}

// Funksioni për vendosjen e të gjitha event listeners
function setupEventListeners() {
    // Butonat e filtrave të shpejtë
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.dataset.model;
            filterByModel(model);
        });
    });
    
    // Sortimi
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
            renderAllProducts();
        });
    }
    
    // Butoni "Shfaq më shumë" - SHTO KËTË PËRSËRI
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedCount += 4;
            renderAllProducts();
        });
    }
    
    // Kërkimi
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (!productsLoaded) return;
            
            const query = this.value.toLowerCase().trim();
            
            if (query === '') {
                filteredProducts = [...allProducts];
            } else {
                filteredProducts = allProducts.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query) ||
                    product.model.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
                );
            }
            
            // Apliko filtrin aktual
            if (currentModelFilter !== 'all') {
                filteredProducts = filteredProducts.filter(
                    product => product.model === currentModelFilter
                );
            }
            
            // Apliko sortimin
            sortProducts();
            
            // Reset count dhe renderizo
            displayedCount = 12;
            renderAllProducts();
        });
    }
    
    // Butonat e produkteve - hap modal për zgjedhje
    document.addEventListener('click', function(e) {
        const quickActionBtn = e.target.closest('.quick-action-btn');
        if (quickActionBtn) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(quickActionBtn.dataset.id);
            openProductModal(productId);
        }
    });
    
    // Klikimi në produkt (jo në butonin e settings)
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.nike-style-card');
        if (productCard && !e.target.closest('.quick-action-btn')) {
            const productId = parseInt(productCard.dataset.id);
            openProductModal(productId);
        }
    });
    
    // Sasia në modal
    const decreaseQuantity = document.getElementById('decrease-quantity');
    const increaseQuantity = document.getElementById('increase-quantity');
    const productQuantity = document.getElementById('product-quantity');
    
    if (decreaseQuantity && increaseQuantity && productQuantity) {
        decreaseQuantity.addEventListener('click', () => {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                productQuantity.value = selectedQuantity;
            }
        });
        
        increaseQuantity.addEventListener('click', () => {
            if (selectedQuantity < 10) {
                selectedQuantity++;
                productQuantity.value = selectedQuantity;
            }
        });
        
        productQuantity.addEventListener('change', () => {
            const value = parseInt(productQuantity.value);
            if (value >= 1 && value <= 10) {
                selectedQuantity = value;
            } else {
                productQuantity.value = selectedQuantity;
            }
        });
    }
    
    // Butoni për shtim në shportë nga modal
    const addToCartModalBtn = document.getElementById('add-to-cart-modal');
    if (addToCartModalBtn) {
        addToCartModalBtn.addEventListener('click', addToCartFromModal);
    }
    
    // Butoni për anulim në modal
    const cancelProductBtn = document.getElementById('cancel-product');
    const closeProductModalBtn = document.getElementById('close-product-modal');
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', closeProductModal);
    }
    
    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', closeProductModal);
    }
    
    // Shporta
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartBtn && cartSidebar && overlay) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeCartBtn && cartSidebar && overlay) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (continueShoppingBtn && cartSidebar && overlay) {
        continueShoppingBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            
            const whatsappModal = document.getElementById('whatsapp-modal');
            if (whatsappModal) {
                whatsappModal.classList.remove('active');
            }
            
            const productModal = document.getElementById('product-modal');
            if (productModal) {
                productModal.classList.remove('active');
            }
        });
    }
    
    // WhatsApp
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeWhatsappModal = document.getElementById('close-whatsapp-modal');
    const cancelOrderBtn = document.getElementById('cancel-order');
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const whatsappModal = document.getElementById('whatsapp-modal');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', prepareWhatsAppOrder);
    }
    
    if (closeWhatsappModal && whatsappModal) {
        closeWhatsappModal.addEventListener('click', () => {
            whatsappModal.classList.remove('active');
        });
    }
    
    if (cancelOrderBtn && whatsappModal) {
        cancelOrderBtn.addEventListener('click', () => {
            whatsappModal.classList.remove('active');
        });
    }
    
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', sendToWhatsApp);
    }
    
    // Mbylle modal me Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (whatsappModal && whatsappModal.classList.contains('active')) {
                whatsappModal.classList.remove('active');
            }
            if (productModal && productModal.classList.contains('active')) {
                productModal.classList.remove('active');
            }
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });
    
    // "Shiko të gjitha" links
    document.querySelectorAll('.see-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterByModel('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}


const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        displayedCount += 10;
        renderAllProducts();
    });
}