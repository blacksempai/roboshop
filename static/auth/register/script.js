const form = document.getElementById('register_form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
        login: form.login.value,
        password: form.password.value,
        phone: form.phone.value
    };
   
    const result = await fetch('/api/auth/register', {
        method: 'POST',
        body:  JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        }
    });
    
})