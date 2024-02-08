const form = document.getElementById('register_form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
        login: form.login.value.trim(),
        password: form.password.value.trim(),
        phone: form.phone.value.trim()
    };
   
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        body:  JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if(response.status == 201) {
        form.reset();
    }

    const result = await response.json();
    
    alert(result.message);
})