const totalElem = document.getElementById('total');
let orders = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext("2d");

function drawGraph()  {
    const oneColumnWidth = 500 / orders.length;
    const maxHeight = orders.map(o => o.items.length).reduce((a,c) => a < c ? c : a ,0);
    orders.sort((a, b) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime())
    orders.forEach((o, i) => {
        const x = oneColumnWidth * i;
        const height = o.items.length * ((500 / maxHeight) - 5)
        const y = 500 - height;
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, oneColumnWidth, height);
        ctx.fillStyle = 'black';
        ctx.fillText(o.items.length, x, y); 
        const d = new Date(o.create_date);
        ctx.fillText(`${d.getDate().toString().padStart(2,0)}.${d.getMonth().toString().padStart(2,0)}`, x+5, 480);
    });
}

function drawGraphChartJs() {
      const data = {
        labels: ['power', 'speed', 'range', 'durability', 'precision', 'potencial'],
        datasets: [
          {
            label: 'Star Platinum',
            data: [5,6,3,5,5,5],
            borderColor: 'red',
            backgroundColor: '#ff000030',
          },
          {
            label: 'Gold Experience',
            data: [3,5,3,2,3,5],
            borderColor: 'gold',
            backgroundColor: '#fef03330',
          },
          {
            label: 'Killer Queen',
            data: [5,5,6,6,2,6],
            borderColor: 'purple',
            backgroundColor: '#ff00ff30',
          },
          {
            label: 'Hierophant Green',
            data: [3,5,5,4,3,2],
            borderColor: 'green',
            backgroundColor: '#00ff0030',
          }
        ]
      };
    
    const config = {
        type: 'radar',
        data: data,
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 6
                }
            },
          plugins: {
            filler: {
              propagate: false
            },
            'samples-filler-analyser': {
              target: 'chart-analyser'
            }
          },
          interaction: {
            intersect: false
          }
        }
    };

    const myChart = new Chart(ctx2, config);
}

async function loadOrders() {
    const res = await fetch('/api/admin/order');
    orders = await res.json();
    drawGraph();
    drawGraphChartJs();
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