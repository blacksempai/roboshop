

async function initProducts() {
    const productsContainerElem = document.getElementById('products_container');

    const response = await fetch('/api/product');
    const products = await response.json();

    const productsHtml = products.map(p => `
        <div class="product_item" id="product_${p.id}">
            <img class="product_img" width="250" src="${p.photo_url}">
            <a class="product_name" href="/product?id=${p.id}">${p.name}</a>
            <div class="product_footer">
                <p class="product_price"> ${p.price}UAH </p>
                <button class="product_btn">Add to cart</button>
            </div>
        </div>
    `);

    productsContainerElem.innerHTML = productsHtml.join('');

}

initProducts();