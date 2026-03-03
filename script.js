
let cart = [];
let total = 0;

function addToCart(name, price){
  cart.push({name, price});
  total += price;
  renderCart();
}

function renderCart(){
  let cartList = document.getElementById("cart");
  cartList.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item.name + " - ₦" + item.price.toLocaleString();
    cartList.appendChild(li);
  });
  document.getElementById("total").textContent = "Total: ₦" + total.toLocaleString();
}

function checkout(){
  if(cart.length === 0){
    alert("Your cart is empty");
    return;
  }

  let message = "Hello, I want to order:%0A";
  cart.forEach(item => {
    message += "- " + item.name + " (₦" + item.price.toLocaleString() + ")%0A";
  });
  message += "%0ATotal: ₦" + total.toLocaleString();

  window.open("https://wa.me/2348012345678?text=" + message, "_blank");
}
