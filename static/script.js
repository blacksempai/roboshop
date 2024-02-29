async function initProducts() {
    const productsContainerElem = document.getElementById('products_container');

    const response = await fetch('/api/product');
    const products = await response.json();

    const productsHtml = products.map(p => `
        <div class="card shadow-sm" id="product_${p.id}">
            <img src="${p.photo_url}" class="card-img-top product_img" alt="${p.name}">
            <div class="card-body">
                <h5 class="card-title"><a class="product_name" href="/product?id=${p.id}">${p.name}</a></h5>
            </div>
            <div class="product_footer card-footer d-flex justify-content-between">
                <p class="product_price fs-4 m-0 text-info"> ${p.price}UAH </p>
                <button class="btn btn-primary" class="product_btn" onclick="addToCart(${p.id})">Add to cart</button>
            </div>
        </div>
    `);

    productsContainerElem.innerHTML = productsHtml.join('');

}

initProducts();

async function addToCart(product_id) {

    const response = await fetch('/api/cart/item', {
        method: 'PUT',
        body:  JSON.stringify({product_id}),
        headers: {
            "Content-Type": "application/json",
        }
    });

    incrementCartCount();
}

const addModalElement = document.getElementById('add-modal');

function closeAddModal() {
    addModalElement.classList.add('hidden');
}

const _scrollListener = () => {
    addModalElement.classList.remove('hidden');
    document.removeEventListener('scroll', _scrollListener);
}

document.addEventListener('scroll', _scrollListener);