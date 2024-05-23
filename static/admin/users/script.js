const usersTable = document.getElementById('user_table');

async function getUsers() {
    const response = await fetch('/api/admin/user');
    const users = await response.json();

    //TODO: Дати можливість змінити роль
    //TODO: Додати функціонал бану*
    const usersHTML = users.map(u => `
    <tr>
        <td>${u.id}</td>
        <td>${u.login}</td>
        <td>${u.phone}</td>
        <td>${u.role}</td>
        <td>${u.cart_id}</td>
    </tr>
    
    `).join('');

usersTable.innerHTML = usersHTML;
}
getUsers();