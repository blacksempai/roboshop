

async function initProducts() {
    const productsContainerElem = document.getElementById('products_container');

    const products = await fetch('/api/product');

}