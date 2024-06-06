const usersTable = document.getElementById('user_table');

let users = [];

async function getUsers() {
    const response = await fetch('/api/admin/user');
    users = await response.json();

    //TODO: Додати функціонал бану*
    const usersHTML = users.map(u => `
    <tr>
        <td>${u.id}</td>
        <td>${u.login}</td>
        <td>${u.phone}</td>
        <td>
            ${u.role} 
            <button class="icon_button" onclick="editRole(${u.id})">
                <span class="material-symbols-outlined">
                    ${u.role === 'USER' ? 'thumb_up' : 'thumb_down'}
                </span>
            </button>
        </td>
        <td>${u.cart_id}</td>
    </tr>
    
    `).join('');

usersTable.innerHTML = usersHTML;
}
getUsers();

async function editRole(userId) {
    const user = users.find(u => u.id == userId);
    if(!user || !confirm(user.role === 'USER' ? 'Ви точно хочете підвищити користувача до АДМІНІСТРАТОРА?' : 'Ви точно хочете звільнити адміністратора?')) {
        return;
    }
    const response = await fetch(`/api/admin/user/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({role: user.role === 'USER' ? 'ADMIN' : 'USER'}),
        headers: {"Content-Type": "application/json"}
    });
    if(response.status == 200) {
        getUsers();
    }   else {
        const data = await response.json();
        alert(data.message || 'Unknown error')
    }
}