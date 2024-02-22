const productElement = document.getElementById('product');


async function initProduct(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        return productElement.innerHTML = 'Помилка, id продукта вказано не коректно';
    } 

    const result = await fetch(`/api/product/${id}`);
    const product = await result.json();

    productElement.innerHTML = `
        <div class="img_container">
            <img src="${product.photo_url}" alt="${product.name}" />
        </div>
        <div class="info_container">
            <h1>${product.name}</h1>
            <div class="price_container"> 
                <p class="price">${product.price} грн</p>
                <button onclick="addToCart(${product.id})">Add to cart</button>
            </div>
            <p>${product.quantity ? 'Є в наявності. на складі ' + product.quantity + 'шт.': 'Немає в наявності'}</p>
            <p>${product.description}</p>
            <div class="supplier_info">
                <p>Поставщик: ${product.supplier_name}</p>
                <p>Адреса поставщика: ${product.address}</p>
                <p>Телефон поставщика: <a href="tel:${product.contact}">${product.contact}</a></p>
            </div>
        </div>
    `
}

async function addToCart(product_id) {

    const response = await fetch('/api/cart/item', {
        method: 'PUT',
        body:  JSON.stringify({product_id}),
        headers: {
            "Content-Type": "application/json",
        }
    });

}

initProduct()