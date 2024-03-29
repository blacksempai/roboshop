const form = document.getElementById('login_form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
        login: form.login.value.trim(),
        password: form.password.value.trim()
    };
   
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body:  JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const result = await response.json();
    
    alert(result.message);
    
    if(response.status == 200) {
        checkAuth();
        window.location = '/';
    }
})