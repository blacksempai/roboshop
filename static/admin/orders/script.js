const ordersTableElement = document.getElementById('orders_table');
const orderDetailsModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
const editOrderModalContent = document.getElementById('editOrderModalContent');
const editOrderModalSubmit = document.getElementById('editOrderModalSubmit');
let orders = [];
let currentOrder;

async function loadOrders() {
    const res = await fetch('/api/admin/order');
    orders = await res.json(); 

    const ordersHtml = orders.map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${getStatusHtml(o.status)}</td>
            <td>${o.address}</td>
            <td>${getCartHtml(o.items)}</td>
            <td>${o.phone}</td>
            <td>${o.login}</td>
            <td>
                <button class="icon_button" onclick="edit(${o.id})">
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </button>
            </td>
        </tr>
    `).join('');

    ordersTableElement.innerHTML = ordersHtml;
}

function edit(id) {
    currentOrder = orders.find(o => o.id === id);
    orderDetailsModal.show();
    editOrderModalContent.innerHTML = `
        <select id="statusSelect" class="form-select" value=${currentOrder.status}>
            <option>Оберіть статус</option>
            <option ${currentOrder.status === 'NEW' ? 'selected' : ''} value="NEW">Новий</option>
            <option ${currentOrder.status === 'PROCESS' ? 'selected' : ''} value="PROCESS">В процесі</option>
            <option ${currentOrder.status === 'DONE' ? 'selected' : ''} value="DONE">Виконаний</option>
            <option ${currentOrder.status === 'CANCELED' ? 'selected' : ''} value="CANCELED">Скасований</option>
        </select>
    `;
}

editOrderModalSubmit.addEventListener('click', async () => {
    const status = document.getElementById('statusSelect').value;
    await fetch(`/api/admin/order/${currentOrder.id}`, {
        method: 'PATCH',
        body: JSON.stringify({status}),
        headers: {
            "Content-Type": "application/json",
        }
    });
    loadOrders();
    orderDetailsModal.hide();
});

function getStatusHtml(status){
    switch(status){
        case 'NEW': return '<span class="badge text-bg-success">Новий</span>'
        case 'CANCELED': return '<span class="badge text-bg-danger">Скасований</span>'
        case 'DONE': return '<span class="badge text-bg-secondary">Виконаний</span>'
        case 'PROCESS': return '<span class="badge text-bg-warning">В процесі</span>'
        default: return '<span>Статус невідомий</span>'
    }
}

function getCartHtml(items) {
    return `
        <ul>
            ${items.map(p => `<li>${p.name} | ${p.price}$ | x${p.quantity}</li>`).join('')}
            <p>Total price: ${items.reduce((a,c) => c.price * c.quantity + a, 0)}$</p>
        </ul>
    `;
}

loadOrders();