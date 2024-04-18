const productsTableElement = document.getElementById("products_table");
const modalElement = document.getElementById('ProductModal');
const ProductModal = new bootstrap.Modal(modalElement);
const addProductBtn = document.getElementById("addProductBtn");
const productModalSubmit = document.getElementById("ProductModalSubmit");
const productForm = document.getElementById("ProductForm");
let allProducts = [];

async function getProducts(){
    const response = await fetch('/api/product');
    const products = await response.json();
    allProducts = products;

    const productsHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price}₴</td>
            <td>${p.description}</td>
            <td><img src="${p.photo_url}" width="80" height="80"></td>
            <td>${p.supplier_id}</td>
            <td>${p.quantity}</td>
            <td>
                <button class="icon_button" onclick="openEditModal(${p.id})">
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </button>
            </td>
        </tr>
    `).join(" ");
    productsTableElement.innerHTML = productsHTML;
}

let currentProductId = null;

addProductBtn.addEventListener("click", openCreateProductModal);
productModalSubmit.addEventListener("click", ()=>{
    const product = {
        name: productForm.name.value,
        price: productForm.price.value,
        description: productForm.description.value,
        photo_url: productForm.photo_url.value,
        supplier_id: productForm.supplier_id.value,
        quantity: productForm.quantity.value
    }
    if(currentProductId) {
        editProduct(product);
    } else {
        saveNewProduct(product);
    }
});

async function saveNewProduct(product){
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
}

async function editProduct(product){
    console.log(product);
}

function openCreateProductModal() {
    ProductModal.show();
}

modalElement.addEventListener('hide.bs.modal', () => {
    productForm.reset();
    currentProductId = null;
});

function openEditModal(id){
    currentProductId=id;
    const product = allProducts.find(p => p.id === id);
    productForm.name.value = product.name;
    productForm.price.value = product.price;
    productForm.description.value = product.description;
    productForm.photo_url.value = product.photo_url;
    productForm.supplier_id.value = product.supplier_id;
    productForm.quantity.value = product.quantity;
    ProductModal.show();
}

getProducts();