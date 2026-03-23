const ADMIN_SESSION_KEY = "graciaAdminSession";

let cart = [];
let total = 0;

function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart");

  if (!cartList) {
    return;
  }

  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name + " - ₦" + item.price.toLocaleString();
    cartList.appendChild(li);
  });

  const totalElement = document.getElementById("total");
  if (totalElement) {
    totalElement.textContent = "Total: ₦" + total.toLocaleString();
  }
}

function createAdminOrderId(name) {
  const normalizedName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "ADMIN";
  const timestamp = Date.now().toString().slice(-6);
  return `${normalizedName}-${timestamp}`;
}

function getAdminSession() {
  const savedSession = localStorage.getItem(ADMIN_SESSION_KEY);

  if (!savedSession) {
    return null;
  }

  try {
    return JSON.parse(savedSession);
  } catch (error) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

function saveAdminSession(session) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const adminSession = getAdminSession();
  const orderId = adminSession ? adminSession.orderId : "PENDING-ADMIN-ID";

  let message = "Hello, I want to order:%0A";
  cart.forEach((item) => {
    message += "- " + item.name + " (₦" + item.price.toLocaleString() + ")%0A";
  });
  message += `%0AOrder ID: ${orderId}`;
  message += "%0ATotal: ₦" + total.toLocaleString();

  window.open("https://wa.me/2348012345678?text=" + message, "_blank");
}

function populateAdminDashboard() {
  const form = document.getElementById("adminSignInForm");
  const status = document.getElementById("adminStatus");
  const nameInput = document.getElementById("adminName");
  const emailInput = document.getElementById("adminEmail");
  const badge = document.getElementById("adminOrderIdBadge");
  const welcome = document.getElementById("adminWelcome");
  const hint = document.getElementById("orderIdHint");
  const signOutButton = document.getElementById("adminSignOut");

  if (!form || !status || !nameInput || !emailInput || !badge || !welcome || !hint || !signOutButton) {
    return;
  }

  function renderSession() {
    const session = getAdminSession();

    if (session) {
      status.textContent = "Signed in";
      status.className = "status-badge active";
      welcome.textContent = `Welcome, ${session.name}`;
      badge.textContent = session.orderId;
      hint.textContent = "Share this ID when confirming or tracking every WhatsApp order.";
      nameInput.value = session.name;
      emailInput.value = session.email;
      signOutButton.hidden = false;
    } else {
      status.textContent = "Not signed in";
      status.className = "status-badge";
      welcome.textContent = "Admin authentication required";
      badge.textContent = "Sign in to generate an order ID";
      hint.textContent = "Each admin sign-in creates one unique identifier that can be reused on new orders.";
      signOutButton.hidden = true;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      alert("Please enter both name and email to continue.");
      return;
    }

    const existingSession = getAdminSession();
    const nextSession = existingSession && existingSession.email === email
      ? { ...existingSession, name, email }
      : { name, email, orderId: createAdminOrderId(name) };

    saveAdminSession(nextSession);
    renderSession();
  });

  signOutButton.addEventListener("click", () => {
    clearAdminSession();
    form.reset();
    renderSession();
  });

  renderSession();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", populateAdminDashboard);
} else {
  populateAdminDashboard();
}
