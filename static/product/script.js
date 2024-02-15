const productElement = document.getElementById('product');


async function initProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = +urlParams.get('id');

    if(!id) {
        return productElement.innerHTML = 'Помилка, id продукта вказано не коректно';
    }

    const result = await fetch(`/api/product/${id}`);
    const product = await result.json();

    productElement.innerHTML = `
        <h1>${product.name}</h1>
        <p>${product.description}</p>
    `;
    
}


initProduct();