const supplierTable = document.getElementById('suppliers_table');
const modalElement = document.getElementById('SupplierModal');
const SupplierModal = new bootstrap.Modal(modalElement);
const addSupplierBtn = document.getElementById('addSupplierBtn');

addSupplierBtn.addEventListener('click', () => {
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

function openEditModal(id){
    SupplierModal.show();
}



getSuppliers();