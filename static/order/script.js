const orderContainer = document.getElementById('order-info-container')
const orderForm = document.getElementById('order-form')

orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const address = orderForm.address.value;
    const result = await fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address})
    })
    if (result.status === 201) {
        window.location = '/order-result'
    } else {
        const data = await result.json();
        console.log(data);
        alert(data?.message || 'Сталася помилка при створенні замовлення!')
    }
}) 

async function getCart() {
    if(!isAuth()) {
        cartContainer.innerHTML = 'Auth first please';
        return;
    }
    const response = await fetch('/api/cart');
    let cart = await response.json();
    if(!cart.length) {
        orderContainer.innerHTML = 'Для того щоб оформити замовлення додайте хоча б один продукт в корзину';
        //orderForm.style = 'display: none'
        return;
    }
    orderContainer.innerHTML = cart.map(p => `
        <div class="cart_item" id="product_${p.id}">
            <img src="${p.photo_url}" alt="${p.name}">
            <p><b>${p.name}</b></p>
            <div class="cart_item_details">
                <p class="cart_item_price"><b id="price_${p.id}">${p.price * p.quantity}</b>₴</p>
                <p class="cart_item_quantity">
                    <span class="cart_item_quantity_number" id="quantity_${p.id}">${p.quantity}</span> 
                </p>
            </div>
        </div>
    `).join('<hr>');
    const totalSum = cart.reduce((a, c) => a + c.price * c.quantity, 0);
    orderContainer.innerHTML +=  `<p>Total sum: <b>${totalSum}</b>₴</p>`
}

getCart();