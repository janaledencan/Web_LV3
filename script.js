// Get elements
const cartButton = document.querySelector('.cart-button');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const sortBtn = document.querySelector('.sort-button');
const content = document.querySelector('.content');

const label = document.getElementById('label')

let items = [
    {
        id: 1,
        name: 'Apple',
        price: 0.99,
    },
    {
        id: 3,
        name: 'Lime',
        price: 12,
    },
    {
        id: 2,
        name: 'Banana',
        price: 10,
    },
];

let cart = JSON.parse(localStorage.getItem("data")) || []; //to restore data from local storage


function sortItemsByName(items) {
    let sortedData;
    sortedData = items.sort(function (first, second) {
        let x = first.name.toLowerCase();
        let y = second.name.toLowerCase();
        if (x > y) { return 1; }
        if (x < y) { return -1; }
        return 0;
    });

    return sortedData;
}


let sortItemsOnClick = () => {
    let sortedItems = sortItemsByName(items)
    console.log(sortedItems);
    itemsGrid.innerHTML = '';
    fillItemsGrid(sortedItems);
}

sortBtn.addEventListener('click', sortItemsOnClick);


// An example function that creates HTML elements using the DOM.
function fillItemsGrid(items) {
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="images/${item.id}.png" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" onclick="increment(${item.id})" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }
}


// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
    generateCartItems();
    TotalAmount();
    modal.classList.toggle('show-modal');
}

// Call fillItemsGrid function when page loads
fillItemsGrid(items);

// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);


let increment = (id) => {

    let selectedItem = items.find((item) => item.id === id); //selectedItem is the item object
    let search = cart.find((item) => item.id === id);

    if (search === undefined) {
        cart.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    console.log(cart);
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(cart));  //date is the name that is saved in local storage; key
};


let update = (id) => {
    calculation();
};


// To calculate total amount of selected Items

let calculation = () => {
    const cartBadge = document.querySelector('.cart-badge');
    cartBadge.innerHTML = cart.map((x) => x.item).reduce((x, y) => x + y, 0);  //previus and next number are x and y
};

calculation();


let generateCartItems = () => {
    if (cart.length !== 0) {
        return (cartItemsList.innerHTML = cart
            .map((x) => {  //x -target items one by one
                let { id, item } = x;  //comes from cart
                let search = items.find((y) => y.id === id) || []; //comes from items

                return ` 
                <div class="cart-item">
                    <div><strong>${search.name}</strong></div> 
                    <span class="me-3">$ ${search.price}</span>  
                    <span class="me-3">Quantity: ${item}</span>
                    <span class="me-3">Sum: $ ${item * search.price}</span>
                    <span onclick="decrement(${id})"><img src="images/icon_minus.png"></span>
                </div>`
            }).join("")); //join- to remove comma between elements
    } else {  //when local storage is empty
        cartItemsList.innerHTML = "";
        label.innerHTML = ``;
    }
};



// decrease the selected product item quantity by 1

let decrement = (id) => {
    let selectedItem = items.find((item) => item.id === id);
    let search = cart.find((x) => x.id === selectedItem.id);

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }

    update(selectedItem.id);
    cart = cart.filter((x) => x.item !== 0);  //objects which doesn't have a zero on the item
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(cart));  //saving the updated data from cart inside the local storage
};


// calculate total amount of the selected Products with specific quantity

let TotalAmount = () => {
    if (cart.length !== 0) {
        let amount = cart
            .map((x) => {
                let { id, item } = x;
                let filterData = items.find((x) => x.id === id);
                return filterData.price * item;
            })
            .reduce((x, y) => x + y, 0);

        return (cartTotal.innerHTML = `$ ${amount}`
            + `<div><button onclick="clearCart()" class="buy-btn">Buy</button></div>
      `);
    } else return cartTotal.innerHTML = `$ 0`;
};


// clear cart, and remove everything from local storage

let clearCart = () => {
    cart = [];
    generateCartItems();
    calculation();
    cartTotal.innerHTML = 0;
    label.innerHTML = "Successfully Purchased !"
    localStorage.setItem("data", JSON.stringify(cart));
};






