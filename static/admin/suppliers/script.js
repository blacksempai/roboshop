const supplierTable = document.getElementById('suppliers_table');
const modalElement = document.getElementById('SupplierModal');
const SupplierModal = new bootstrap.Modal(modalElement);
const addSupplierBtn = document.getElementById('addSupplierBtn');
const SupplierModalSubmit = document.getElementById('SupplierModalSubmit');
const supplierForm = document.getElementById('SupplierForm');

addSupplierBtn.addEventListener('click', () => {
    supplierForm.name.value = '';
    supplierForm.address.value = '';
    supplierForm.contact.value = '';
    SupplierModal.show();
});

let suppliers = [];

async function getSuppliers() {
    const response = await fetch('/api/admin/supplier');
    suppliers = await response.json();
    const supplierHTML = suppliers.map(supplier =>`
        <tr>
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.address}</td>
            <td>${supplier.contact}</td>
            <td>
                <button class="icon_button" onclick="openEditModal(${supplier.id})">
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </button>
            </td>
        </tr>
    `).join('');
    supplierTable.innerHTML = supplierHTML;
}

let currentSupplierId = null;

function openEditModal(id){
    SupplierModal.show();
    const supplier = suppliers.find(s => s.id === id);

    supplierForm.name.value = supplier.name;
    supplierForm.address.value = supplier.address;
    supplierForm.contact.value = supplier.contact;
    currentSupplierId = id;
}


SupplierModalSubmit.addEventListener('click', () => {
    const supplier = {
        name: supplierForm.name.value,
        address: supplierForm.address.value,
        contact: supplierForm.contact.value,
    } 
    if(currentSupplierId) {
        editSupplier(supplier);
    } else {
        saveNewSupplier(supplier);
    }

});

async function editSupplier(supplier) {
    const result = await fetch("/api/admin/supplier/" + currentSupplierId, {
        method: "PUT",
        body: JSON.stringify(supplier),
        headers: {"Content-Type": "application/json"}
    });
    
    if(result.status !== 204) {
        return alert('Сталася помилка');
    }
    alert('Постачальник успішно змінений!');
    supplierForm.reset();
    getSuppliers();
    SupplierModal.hide();
}

async function saveNewSupplier(supplier) {
    const result = await fetch("/api/admin/supplier", {
        method: "POST",
        body: JSON.stringify(supplier),
        headers: {"Content-Type": "application/json"}
    });
    const data = await result.json();
    
    if(result.status !== 201) {
        return alert(data.message || 'Сталася помилка');
    }
    alert('Постачальник успішно додано!');
    supplierForm.reset();
    getSuppliers();
    SupplierModal.hide();
}


getSuppliers();