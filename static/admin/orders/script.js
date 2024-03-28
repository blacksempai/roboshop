const ordersTableElement = document.getElementById('orders_table');

async function loadOrders() {
    const res = await fetch('/api/admin/order');
    const orders = await res.json(); 

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
    alert(`You are editing order id:${id}`)
}

function getStatusHtml(status){
    switch(status){
        case 'NEW': return '<span class="badge text-bg-success">Новий</span>'
        case 'CANCELED': return '<span class="badge text-bg-danger">Скасований</span>'
        case 'PENDING': return '<span class="badge text-bg-secondary">Виконаний</span>'
        case 'PROCESS': return '<span class="badge text-bg-warning">В процесі</span>'
        default: return '<span>Статус невідомий</span>'
    }
}

function getCartHtml(items) {
    return `
        <ul>
            ${items.map(p => `<li>${p.name} | ${p.price}$ | x${p.quantity}</li>`).join('')}
            <p>Total price: ${items.reduce((a,c) => c.price + a, 0)}$</p>
        </ul>
    `;
}

loadOrders();