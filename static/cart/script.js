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
        <div class="cart_item" id="product_${p.id}">
            <img src="${p.photo_url}" alt="${p.name}">
            <p><b>${p.name}</b></p>
            <div class="cart_item_details">
                <p class="cart_item_price"><b>${p.price}</b>$</p>
                <p class="cart_item_quantity">
                    <button onclick="deleteItem(${p.id})">-</button> 
                    <span class="cart_item_quantity_number" id="quantity_${p.id}">${p.quantity}</span> 
                    <button onclick="addItem(${p.id})">+</button>
                </p>
            </div>
        </div>
    `).join('<hr>');
}

async function addItem(product_id){
    const response = await fetch('/api/cart/item', {
        method: 'PUT',
        body:  JSON.stringify({product_id}),
        headers: {
            "Content-Type": "application/json",
        }
    });
    const quantity = document.getElementById(`quantity_${product_id}`);
    quantity.innerHTML = +quantity.innerHTML + 1;
}

async function deleteItem(product_id){
    const response = await fetch(`/api/cart/item/${product_id}`, {
        method: 'DELETE', 
    });
    const quantity = document.getElementById(`quantity_${product_id}`);
    const count = +quantity.innerHTML - 1;
    if(count > 0){
        quantity.innerHTML= count;
    } else {
        document.getElementById(`product_${product_id}`).remove();
        if(!cartContainer.innerHTML.trim()) {
            cartContainer.innerHTML = 'Cart is empty';
        }
    }
}

getCart();