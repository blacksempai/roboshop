const cartContainer = document.getElementById('cart_container');
const cartTotal = document.getElementById('cart_total');
let cart = [];

async function getCart() {
    if(!isAuth()) {
        cartContainer.innerHTML = 'Auth first please';
        return;
    }
    const response = await fetch('/api/cart');
    cart = await response.json();
    if(!cart.length) {
        cartContainer.innerHTML = 'Cart is empty';
        return;
    }
    cartContainer.innerHTML = cart.map(p => `
        <div class="cart_item" id="product_${p.id}">
            <img src="${p.photo_url}" alt="${p.name}">
            <p><b>${p.name}</b></p>
            <div class="cart_item_details">
                <p class="cart_item_price"><b id="price_${p.id}">${p.price * p.quantity}</b>$</p>
                <p class="cart_item_quantity">
                    <button onclick="deleteItem(${p.id})">-</button> 
                    <span class="cart_item_quantity_number" id="quantity_${p.id}">${p.quantity}</span> 
                    <button onclick="addItem(${p.id})">+</button>
                </p>
            </div>
        </div>
    `).join('<hr>');

    recalcTotal();
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
    recalcPrice(product_id, +quantity.innerHTML);
}

async function deleteItem(product_id){
    const response = await fetch(`/api/cart/item/${product_id}`, {
        method: 'DELETE', 
    });
    const quantity = document.getElementById(`quantity_${product_id}`);
    const count = +quantity.innerHTML - 1;
    if(count > 0){
        quantity.innerHTML= count;
        recalcPrice(product_id, count);
    } else {
        document.getElementById(`product_${product_id}`).remove();
        cart = cart.filter(p => p.id !== product_id);
        recalcTotal();
        if(!cartContainer.innerHTML.trim()) {
            cartContainer.innerHTML = 'Cart is empty';
            cartTotal.innerHTML = '';
        }
    }
}

function recalcPrice(id, newQuantity) {
    const product = cart.find(p => p.id == id);
    product.quantity = +newQuantity;
    const priceElem = document.getElementById(`price_${id}`);
    priceElem.innerHTML = +product.price * product.quantity;
    recalcTotal();
}

function recalcTotal() {
    const totalSum = cart.reduce((a, c) => a + c.price * c.quantity, 0);
    cartTotal.innerHTML = `
        <div>
            <p>Total sum: <b>${totalSum}</b>$</p>
            <button onclick="order()">Order</button>
        </div>
    `
}

async function order() {
    alert('ORDER')
}

getCart();