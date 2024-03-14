const orderContainerElem = document.getElementById('orders-container')

async function getOrders(){
    const response = await fetch('/api/order')
    const orders = await response.json()
    if(orders.length){
        const ordersHtml = orders.map(o => `
            <div class="order-item">
                ${getStatusHtml(o.status)}
                <p>Address: ${o.address}</p>
            </div>
        ` ).join('<hr>')
        orderContainerElem.innerHTML = ordersHtml;
    } else {
        orderContainerElem.innerHTML = 'У вас немає замовлень('
    }

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

getOrders()