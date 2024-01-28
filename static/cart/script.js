const cartContainer = document.getElementById('cart_container');

async function getCart() {
    if(!isAuth()) {
        cartContainer.innerHTML = 'Auth first please';
        return;
    }
    const response = await fetch('/api/cart');
    const cart = await response.json();
    console.log(cart);
    if(!cart.length) {
        cartContainer.innerHTML = 'Cart is empty';
        return;
    }
    cartContainer.innerHTML = cart.map(p => `
        <div class="cart_item">
            <img src="${p.photo_url}" alt="${p.name}">
            <p><b>${p.name}</b></p>
            <div class="cart_item_details">
                <p class="cart_item_price"><b>${p.price}</b>$</p>
                <p class="cart_item_quantity">
                    <button>-</button> 
                    <span class="cart_item_quantity_number">${p.quantity}</span> 
                    <button>+</button>
                </p>
            </div>
        </div>
    `).join('<hr>');
}

getCart();