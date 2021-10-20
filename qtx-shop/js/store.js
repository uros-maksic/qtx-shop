import { products } from "./components/products.js";

(function () {

const productContainer = document.getElementById('js-product-container');
const wallet = document.getElementById('js-wallet');
const money = 20000;
let cartArrayItems = JSON.parse(localStorage.getItem('cartArrayItems')) ? JSON.parse(localStorage.getItem('cartArrayItems')) : [];
wallet.innerHTML = `${money},00 €`

const productContent = products.map(product => {
    return `
    <div data-id='${product.id}' class="box">
        <div class="box-img">
          <img class="shop-item-image" src="${product.productImg}" alt="product">
        </div>
        <div class="title-price">
            <h3 class="shop-item-title">${product.title}</h3>
            <div class="stars">
                <i class="bx bxs-star" ></i>
                <i class="bx bxs-star" ></i>
                <i class="bx bxs-star" ></i>
                <i class="bx bxs-star" ></i>
                <i class="bx bxs-star-half" ></i>
            </div>
        </div>
        <span class="shop-item-price">${product.price},00 €</span>
        <button class="btn shop-item-button" type="button">Add to Cart</button>
    </div>
    `;}).join('')

if (productContainer && productContent) {
    productContainer.innerHTML = productContent;
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    renderCartItemsWoho();
    const removeCartItemBtns = document.querySelectorAll('.btn-danger');
    for (let index = 0; index < removeCartItemBtns.length; index++) {
        const button = removeCartItemBtns[index];
        button.addEventListener('click', removeCartItem)
    }
    const quantityInputs = document.querySelectorAll('.cart-quantity-input')
    for (let index = 0; index < quantityInputs.length; index++) {
        const input = quantityInputs[index];
        input.addEventListener('change', quantityChanged)
    }

    const addToCartBtns = document.querySelectorAll('.shop-item-button');
    for (let index = 0; index < addToCartBtns.length; index++) {
        const button = addToCartBtns[index];
        button.addEventListener('click', addToCartClicked)
    }   

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

function purchaseClicked() {
    const total = document.querySelector('.cart-total-price');
    console.log(money);
    let price = parseFloat(total.innerHTML.replace('€', ''));
    console.log(price);
    wallet.innerHTML = `${money - price} €`
    alert('Thank you for your purchase');
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(e) {
    cartArrayItems = cartArrayItems.filter(function( obj ) {
        return obj.imageSrc !== e.target.dataset.imagesrc;
    });
    localStorage.setItem('cartArrayItems', JSON.stringify(cartArrayItems));
    const buttonClicked = e.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(e) {
    const input = e.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function renderCartItemsWoho() {
    if(cartArrayItems.length > 0) {
        cartArrayItems.map(item => {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            const cartItems = document.querySelectorAll('.cart-items')[0];
            const cartRowContents = `
                <div class="cart-item cart-column">
                        <img class="cart-item-image" src="${item.imageSrc}" width="100" height="100">
                        <span class="cart-item-title">${item.title}</span>
                    </div>
                    <span class="cart-price cart-column">${item.price}</span>
                    <div class="cart-quantity cart-column">
                        <input class="cart-quantity-input" type="number" value=${item.quantity}>
                        <button class="btn btn-danger" data-imageSrc=${item.imageSrc} type="button">REMOVE</button>
                    </div>`;
            cartRow.innerHTML = cartRowContents;
            cartItems && cartItems.append(cartRow);
            cartRow.querySelectorAll('.btn-danger')[0].addEventListener('click', removeCartItem)
            cartRow.querySelectorAll('.cart-quantity-input')[0].addEventListener('change', quantityChanged)    
        });
        const total = document.querySelector('.cart-total-price');
        const sum = cartArrayItems.reduce((n, {price, quantity}) => n + parseInt(price, 10) * quantity, 0);
        if(total) {
            total.innerHTML = `${sum} €`;
        }
    }
}

function addToCartClicked(e) {
    const button = e.target;
    const shopItem = button.parentElement;
    var title = shopItem.querySelectorAll('.shop-item-title')[0].innerText;
    var price = shopItem.querySelectorAll('.shop-item-price')[0].innerText;
    var imageSrc = shopItem.querySelectorAll('.shop-item-image')[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    const item = {
        title,
        price,
        imageSrc,
        quantity: 1
    }
    const checkItem = obj => obj.title === title;
    console.log(cartArrayItems.some(checkItem))
    let quantity = 1;
    if(cartArrayItems.some(checkItem))
    {
        console.log(checkItem)
        const objIndex = cartArrayItems.findIndex((obj => obj.title === title));
        cartArrayItems[objIndex].quantity = cartArrayItems[objIndex].quantity + 1;
        quantity = cartArrayItems[objIndex].quantity;
        console.log(cartArrayItems)
    } else {
        cartArrayItems.push(item);
    }
    localStorage.setItem('cartArrayItems', JSON.stringify(cartArrayItems));
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.querySelectorAll('.cart-items')[0];
    const cartItemNames = cartItems.querySelectorAll('.cart-item-title');
    for (let index = 0; index < cartItemNames.length; index++) {
        if (cartItemNames[index].innerText === title) {
            alert('This item is already added to the cart')
            document.querySelectorAll('.cart-quantity-input')[0].value = quantity;
            console.log(quantity)
            return;
        }
    }
    const cartRowContents = `
    <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value=${quantity}>
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    alert('You have added the item successfully');
    cartRow.querySelectorAll('.btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.querySelectorAll('.cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

const updateCartTotal = () => {
    const cartItemContainer = document.querySelectorAll('.cart-items')[0],
          cartRows = cartItemContainer.querySelectorAll('.cart-row');
    let total = 0;
    for (let index = 0; index <cartRows.length; index++) {
        const cartRow = cartRows[index],
              priceElement = cartRow.querySelectorAll('.cart-price')[0],
              quantityElement = cartRow.querySelectorAll('.cart-quantity-input')[0],
              quantity = quantityElement.value;
        let price = parseFloat(priceElement.innerHTML.replace('€', ''));
    
        total = total + (price * quantity);  
    }
    document.querySelector('.cart-total-price').innerHTML = `${total} €`
}
})();