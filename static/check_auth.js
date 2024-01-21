function getCookie(name) {
    const nameEquals = name + '=';
    const cookieArray = document.cookie.split(';');
  
    for (cookie of cookieArray) {
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.slice(1, cookie.length);
      }
  
      if (cookie.indexOf(nameEquals) == 0)
        return decodeURIComponent(
          cookie.slice(nameEquals.length, cookie.length),
        );
    }
  
    return null;
}

function checkAuth() {
    const token = getCookie('token');
    if(token) {
        const authContainer = document.getElementById('auth');
        authContainer.innerHTML = '<a href="/cart">Cart</a>';
    }
}

checkAuth();