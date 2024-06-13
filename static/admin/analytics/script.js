const totalElem = document.getElementById('total');
let orders = [];


async function loadOrders() {
    const res = await fetch('/api/admin/order');
    orders = await res.json();
    return orders;
}

async function caclulateTotals() {
    await loadOrders();
    const canceledOrders = orders.filter(o => o.status === 'CANCELED');
    const activeOrders = orders.filter(o => o.status !== 'CANCELED');
    const doneOrders = activeOrders.filter(o => o.status === 'DONE');
    const newOrders = activeOrders.filter(o => o.status !== 'DONE');
    const totalEarned = doneOrders.reduce((a, o) => a + o.items.reduce((a, i) => a + i.quantity * i.price, 0), 0);
    const expectedEarned = newOrders.reduce((a, o) => a + o.items.reduce((a, i) => a + i.quantity * i.price, 0), 0);
    
    const allOrderedItems = activeOrders.map(o => o.items).flat();

    const allOrderedItemsCollapsed = allOrderedItems.reduce((a, o) => {
        const candidate = a.find(i => i.name === o.name);
        if(candidate) {
            const newQuantity = candidate.quantity + o.quantity;
            return [...a.filter(i => i.name !== o.name), {...o, quantity: newQuantity}];
        }
        return [...a, o];
    }, []);

    const mostPopularItem = allOrderedItemsCollapsed.reduce((a, o) => a.quantity < o.quantity ? o : a, {quantity: 0});
    
    //TODO підключити апі НБУ для переводу в інші валюти
    totalElem.innerHTML = `
        <p><b>Most popular product:</b> <span>${mostPopularItem.name}</span><p>
        <p><b>Total buy:</b> <span>${mostPopularItem.quantity}</span><p>
        <hr>
        <p><b>Total earned:</b> <span>${totalEarned}UAH</span><p>
        <p><b>Done orders</b> <span>${doneOrders.length}</span><p>
        <hr>
        <p><b>Expected to earn:</b> <span>${expectedEarned}UAH</span><p>
        <p><b>New orders:</b> <span>${newOrders.length}</span><p>
        <hr>
        <p><b>Canceled orders:</b> <span>${canceledOrders.length}</span><p>
    `
}

caclulateTotals();