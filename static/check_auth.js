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

let cartCount = 0;

function checkAuth() {
    const token = getCookie('token');
    if(token) {
        const authContainer = document.getElementById('auth');
        if (authContainer) {
          authContainer.innerHTML = `
          <a class="btn btn-info position-relative" href="/my-orders">
            <span>My Orders</span>
          </a>
          | 
          <a class="btn btn-info position-relative" href="/cart">
            <span>Cart</span>
            <span id="cart_badge"></span>
          </a>
           | 
          <a class="btn btn-danger" href="/api/auth/logout">Logout</a>`;
        }
        fetch('/api/cart/count')
        .then(res => res.json())
        .then(res => {
          cartCount = res.count;
          document.getElementById('cart_badge').innerHTML = `
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            <span id="cart_badge_count">${cartCount}</span>
          </span>
          `
        });
    }
}

const toastLiveExample = document.getElementById('liveToast')
let toastBootstrap

if (toastLiveExample) {
  toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
}

function incrementCartCount() {
  cartCount += 1;
  document.getElementById('cart_badge_count').innerHTML = cartCount;
  if(toastBootstrap) {
    toastBootstrap.show()
  }
}

function isAuth() {
  const token = getCookie('token');
  return !!token;
}

checkAuth();