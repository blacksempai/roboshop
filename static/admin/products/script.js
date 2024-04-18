const productsTableElement = document.getElementById("products_table");
const modalElement = document.getElementById('ProductModal');
const ProductModal = new bootstrap.Modal(modalElement);
const addProductBtn = document.getElementById("addProductBtn");
const productModalSubmit = document.getElementById("ProductModalSubmit");
const productForm = document.getElementById("ProductForm");

async function getProducts(){
    const response = await fetch('/api/product');
    const products = await response.json();

    const productsHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price}₴</td>
            <td>${p.description}</td>
            <td><img src="${p.photo_url}" width="80" height="80"></td>
            <td>${p.supplier_id}</td>
            <td>${p.quantity}</td>
        </tr>
    `).join(" ");
    productsTableElement.innerHTML = productsHTML;
}

let currentProductId = null;

addProductBtn.addEventListener("click", openCreateProductModal);
productModalSubmit.addEventListener("click", async()=>{
    const product = {
        name: productForm.name.value,
        price: productForm.price.value,
        description: productForm.description.value,
        photo_url: productForm.photo_url.value,
        supplier_id: productForm.supplier_id.value,
        quantity: productForm.quantity.value
    }
    const result = await fetch("/api/admin/product", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {"Content-Type": "application/json"}
    });
    const data = await result.json();
    
    if(result.status !== 201) {
        return alert(data.message || 'Сталася помилка');
    }
    alert('Продукт успішно додано!');
    productForm.reset();
    getProducts();
    ProductModal.hide();
});


function openCreateProductModal() {
    ProductModal.show();
}

modalElement.addEventListener('hide.bs.modal', () => {
    productForm.reset();
    currentProductId = null;
});

getProducts();