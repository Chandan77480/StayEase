// ===== 1. DATA =====
// Room types. "units" = how many physical rooms of this type the hotel has.
const ROOMS = [
  { name: "Standard Room", price: 2500, guests: 2, units: 10, img: "photo-1631049307264-da0ec9d70304",
    desc: "Cosy room with a queen bed and city view.", amenities: ["Wi-Fi", "AC", "TV"] },
  { name: "Deluxe Room", price: 4200, guests: 3, units: 8, img: "photo-1590490360182-c33d57733427",
    desc: "Spacious room with a king bed and work desk.", amenities: ["Wi-Fi", "AC", "Breakfast", "Minibar"] },
  { name: "Premium Suite", price: 7500, guests: 3, units: 4, img: "photo-1618773928121-c32242e63f39",
    desc: "Luxury suite with a separate lounge area.", amenities: ["Wi-Fi", "AC", "Breakfast", "Bathtub"] },
  { name: "Family Suite", price: 9000, guests: 6, units: 3, img: "photo-1566665797739-1674de7a421a",
    desc: "Two bedrooms, ideal for families and groups.", amenities: ["Wi-Fi", "AC", "Breakfast", "Kitchenette"] }
];
const KEY = "stayease_v2";              // LocalStorage key
const ADMIN = { user: "admin", pass: "admin123" };   // admin login (change it here)
let isAdmin = sessionStorage.getItem("stayease_admin") === "1";

let reservations = [];                  // all bookings live here
let editingId = null;                   // booking ID being edited (null = new booking)
let searched = { in: "", out: "" };     // dates from the hero search

// ===== 2. SMALL HELPER FUNCTIONS =====
const $ = (id) => document.getElementById(id);

// Turn a Date into "YYYY-MM-DD" (the format date inputs use)
function dateString(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
// Today plus n days
function daysFromToday(n) { const d = new Date(); d.setDate(d.getDate() + n); return dateString(d); }
// Number of nights between two date strings
function nightsBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
// Find a room by name
function getRoom(name) { return ROOMS.find((r) => r.name === name); }
// Format money in Indian Rupees
function money(n) { return "₹" + n.toLocaleString("en-IN"); }
// Stop users from injecting HTML through text fields
function esc(t) { const p = document.createElement("p"); p.textContent = t; return p.innerHTML; }

// Show a success (green) or error (red) message for 3 seconds
function toast(msg, isError) {
  const t = $("toast");
  t.textContent = msg;
  t.className = "show" + (isError ? " bad" : "");
  setTimeout(() => (t.className = ""), 3000);
}

// ===== 3. LOCALSTORAGE =====
function saveData() { localStorage.setItem(KEY, JSON.stringify(reservations)); }

function loadData() {
  const saved = localStorage.getItem(KEY);
  if (saved) { reservations = JSON.parse(saved); return; }
  // First visit: create sample reservations so the site looks populated
  const sample = [
    ["Aarav Sharma", "Deluxe Room", 1, 3, 2, "Confirmed"],
    ["Priya Verma", "Standard Room", 2, 4, 2, "Pending"],
    ["Rohan Mehta", "Premium Suite", 5, 8, 2, "Confirmed"],
    ["Simran Kaur", "Family Suite", 3, 6, 4, "Confirmed"],
    ["Neha Gupta", "Standard Room", 7, 9, 1, "Cancelled"],
    ["Karan Singh", "Deluxe Room", 10, 12, 3, "Pending"]
  ];
  sample.forEach((s, i) => {
    const nights = s[3] - s[2];
    reservations.push({
      id: "SE" + (1001 + i), name: s[0], email: s[0].split(" ")[0].toLowerCase() + "@example.com",
      phone: "9876500" + (100 + i), room: s[1], checkIn: daysFromToday(s[2]), checkOut: daysFromToday(s[3]),
      guests: s[4], notes: "", status: s[5], total: nights * getRoom(s[1]).price, rooms: 1, payment: "Pay at hotel"
    });
  });
  saveData();
}

// ===== 4. AVAILABILITY (prevents double booking) =====
// Two stays overlap when each one starts before the other ends.
function overlaps(r, checkIn, checkOut) { return checkIn < r.checkOut && checkOut > r.checkIn; }

// How many rooms of this type are still free for the dates?
function roomsLeft(roomName, checkIn, checkOut, ignoreId) {
  const busy = reservations.filter((r) =>
    r.room === roomName && r.status !== "Cancelled" && r.id !== ignoreId && overlaps(r, checkIn, checkOut)
  ).reduce((sum, r) => sum + (r.rooms || 1), 0);   // multi-room bookings count every room
  return getRoom(roomName).units - busy;
}

// ===== 5. SHOWING ROOMS =====
function renderRooms() {
  // Use searched dates, or tonight if the user has not searched yet
  const inDate = searched.in || daysFromToday(0);
  const outDate = searched.out || daysFromToday(1);
  const guests = Number($("sGuests").value) || 1;
  const cat = $("sCat").value;

  const list = ROOMS.filter((r) => (!cat || r.name === cat) && r.guests >= guests);
  $("roomGrid").innerHTML = list.length ? "" : "<p class='empty'>No room fits those guests. Try fewer guests.</p>";

  list.forEach((room) => {
    const left = roomsLeft(room.name, inDate, outDate);
    const status = left > 0 ? `<span class="badge Confirmed">Available (${left} left)</span>` : `<span class="badge Cancelled">Sold out</span>`;
    const card = document.createElement("article");
    card.className = "card room";
    card.innerHTML = `
      <img src="https://images.unsplash.com/${room.img}?w=600&q=70" alt="${room.name} interior" loading="lazy" width="600" height="190">
      <div class="room-body">
        <h3>${room.name}</h3>
        <p>${room.desc}</p>
        <div class="tags">${room.amenities.map((a) => `<span>${a}</span>`).join("")}</div>
        <p>Max guests: ${room.guests}</p>
        <p class="price">${money(room.price)} <small>/ night</small></p>
        ${status}
        <button class="btn navy" ${left > 0 ? "" : "disabled"} data-room="${room.name}">Book Now</button>
      </div>`;
    $("roomGrid").appendChild(card);
  });
}

// ===== 6. DASHBOARD =====
function renderDashboard() {
  const count = (s) => reservations.filter((r) => r.status === s).length;
  // Revenue only counts confirmed bookings
  const revenue = reservations.filter((r) => r.status === "Confirmed").reduce((sum, r) => sum + r.total, 0);
  const cards = [
    ["Total Reservations", reservations.length], ["Confirmed", count("Confirmed")],
    ["Pending", count("Pending")], ["Cancelled", count("Cancelled")], ["Total Revenue", money(revenue)]
  ];
  $("stats").innerHTML = cards.map((c) => `<div class="card stat"><b>${c[1]}</b>${c[0]}</div>`).join("");

  // Last 4 bookings (newest first)
  const recent = reservations.slice(-4).reverse();
  $("recentList").innerHTML = recent.map((r) =>
    `<li><span><strong>${esc(r.name)}</strong> – ${r.room} (${r.id})</span>
     <span>${r.checkIn} → ${r.checkOut} <span class="badge ${r.status}">${r.status}</span></span></li>`).join("");
}

// ===== 7. RESERVATION TABLE (search + filters) =====
function renderTable() {
  const q = $("qSearch").value.trim().toLowerCase();
  const cat = $("qCat").value, status = $("qStatus").value;

  const shown = reservations.filter((r) =>
    (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
    (!cat || r.room === cat) && (!status || r.status === status));

  $("tableBody").innerHTML = shown.map((r) => `
    <tr>
      <td>${r.id}</td><td>${esc(r.name)}</td><td>${r.room} × ${r.rooms || 1}</td>
      <td>${r.checkIn} to ${r.checkOut}</td><td>${money(r.total)}</td>
      <td><span class="badge ${r.status}">${r.status}</span></td>
      <td>
        <button class="act" data-act="view" data-id="${r.id}">View</button>
        <button class="act" data-act="invoice" data-id="${r.id}">Invoice</button>
        ${r.status === "Pending" ? `<button class="act" data-act="confirm" data-id="${r.id}">Confirm</button>` : ""}
        ${r.status !== "Cancelled" ? `<button class="act" data-act="edit" data-id="${r.id}">Edit</button>
        <button class="act" data-act="cancel" data-id="${r.id}">Cancel</button>` : ""}
      </td>
    </tr>`).join("");
  $("emptyMsg").hidden = shown.length > 0;
}

// Refresh everything on the page after any change
function refreshAll() { saveData(); renderRooms(); renderDashboard(); renderTable(); renderCalendar(); }

// ===== 8. BOOKING FORM =====
// Show the live price while the user fills in the form
function updateTotal() {
  const room = getRoom($("fCat").value);
  const nights = nightsBetween($("fIn").value, $("fOut").value);
  const rooms = Math.max(1, Number($("fRooms").value) || 1);
  $("totalText").textContent = nights > 0 ? `${money(nights * room.price * rooms)} (${nights} night${nights > 1 ? "s" : ""} × ${rooms} room${rooms > 1 ? "s" : ""} × ${money(room.price)})` : "Select valid dates to see price";
}

// Check the form. Returns an error message, or "" if everything is fine.
function validateForm(d) {
  if (d.name.length < 3) return "Please enter your full name (at least 3 letters).";
  if (!/^\S+@\S+\.\S+$/.test(d.email)) return "Please enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(d.phone)) return "Phone must be a 10-digit Indian mobile number.";
  if (!d.checkIn || !d.checkOut) return "Please choose check-in and check-out dates.";
  if (d.checkIn < daysFromToday(0) && !editingId) return "Check-in date cannot be in the past.";
  if (d.checkOut <= d.checkIn) return "Check-out must be after check-in.";
  if (d.guests < 1) return "At least 1 guest is required.";
  if (d.guests > getRoom(d.room).guests * d.rooms) return `${d.rooms} ${d.room}(s) allow a maximum of ${getRoom(d.room).guests * d.rooms} guests.`;
  const free = roomsLeft(d.room, d.checkIn, d.checkOut, editingId);
  if (free < d.rooms) return free < 1 ? "Sorry, this room type is fully booked for those dates." : `Only ${free} room(s) of this type are free for those dates.`;
  return "";
}

function submitBooking(e) {
  e.preventDefault();
  const d = {
    name: $("fName").value.trim(), email: $("fEmail").value.trim(), phone: $("fPhone").value.trim(),
    room: $("fCat").value, checkIn: $("fIn").value, checkOut: $("fOut").value,
    guests: Number($("fGuests").value), notes: $("fNotes").value.trim(),
    rooms: Math.max(1, Number($("fRooms").value) || 1), payment: $("fPay").value
  };
  const error = validateForm(d);
  $("formError").textContent = error;
  if (error) { toast(error, true); return; }

  d.total = nightsBetween(d.checkIn, d.checkOut) * getRoom(d.room).price * d.rooms;

  if (editingId) {
    // UPDATE: replace the old values of the booking, keep its ID and status
    const old = reservations.find((r) => r.id === editingId);
    Object.assign(old, d);
    toast("Reservation " + editingId + " updated.");
  } else {
    // CREATE: automatic booking ID = "SE" + next number
    d.id = "SE" + (1001 + reservations.length);
    d.status = "Pending";
    reservations.push(d);
    toast("Booking " + d.id + " created! Total " + money(d.total));
    showInvoice(d.id);
  }
  stopEditing();
  refreshAll();
}

function stopEditing() {
  editingId = null;
  $("bookForm").reset();
  $("fGuests").value = 2;
  $("formTitle").textContent = "Reserve Your Room";
  $("saveBtn").textContent = "Confirm Booking";
  $("cancelEdit").hidden = true;
  updateTotal();
}

// ===== 9. TABLE BUTTONS (view / confirm / edit / cancel) =====
function handleTableClick(e) {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const r = reservations.find((x) => x.id === btn.dataset.id);

  if (btn.dataset.act === "view") {
    $("viewDialog").innerHTML = `<h3>Booking ${r.id}</h3>
      <p><strong>Guest:</strong> ${esc(r.name)}</p><p><strong>Email:</strong> ${esc(r.email)}</p>
      <p><strong>Phone:</strong> ${esc(r.phone)}</p><p><strong>Room:</strong> ${r.room}</p>
      <p><strong>Stay:</strong> ${r.checkIn} to ${r.checkOut} (${nightsBetween(r.checkIn, r.checkOut)} nights)</p>
      <p><strong>Guests:</strong> ${r.guests}</p><p><strong>Total:</strong> ${money(r.total)}</p>
      <p><strong>Status:</strong> <span class="badge ${r.status}">${r.status}</span></p>
      <p><strong>Requests:</strong> ${esc(r.notes) || "None"}</p>
      <br><button class="btn navy" onclick="document.getElementById('viewDialog').close()">Close</button>`;
    $("viewDialog").showModal();
  }
  if (btn.dataset.act === "invoice") showInvoice(r.id);
  if (btn.dataset.act === "confirm") { r.status = "Confirmed"; toast(r.id + " confirmed."); refreshAll(); }
  if (btn.dataset.act === "cancel" && confirm("Cancel reservation " + r.id + "?")) {
    r.status = "Cancelled"; toast(r.id + " cancelled."); refreshAll();
  }
  if (btn.dataset.act === "edit") {
    // Load the booking into the form, then submitBooking() will update it
    editingId = r.id;
    $("fName").value = r.name; $("fEmail").value = r.email; $("fPhone").value = r.phone;
    $("fCat").value = r.room; $("fIn").value = r.checkIn; $("fOut").value = r.checkOut;
    $("fGuests").value = r.guests; $("fNotes").value = r.notes;
    $("fRooms").value = r.rooms || 1; $("fPay").value = r.payment || "Pay at hotel";
    $("formTitle").textContent = "Update Reservation " + r.id;
    $("saveBtn").textContent = "Save Changes";
    $("cancelEdit").hidden = false;
    updateTotal();
    $("booking").scrollIntoView();
  }
}

// ===== 10. INVOICE, CALENDAR, ADMIN LOGIN =====
// Show a printable invoice for one booking
function showInvoice(id) {
  const r = reservations.find((x) => x.id === id);
  const nights = nightsBetween(r.checkIn, r.checkOut);
  $("invoiceDialog").innerHTML = `
    <div class="invoice">
      <h2>StayEase</h2>
      <p class="small">12 Lakeview Road, Near Golden Temple, Amritsar, Punjab 143001. Phone +91 98765 43210</p>
      <h3>Invoice ${r.id}</h3>
      <p>Billed to <strong>${esc(r.name)}</strong> (${esc(r.email)})</p>
      <table>
        <tr><th>Room</th><th>Nights</th><th>Rooms</th><th>Rate</th><th>Amount</th></tr>
        <tr><td>${r.room}</td><td>${nights}</td><td>${r.rooms || 1}</td><td>${money(getRoom(r.room).price)}</td><td>${money(r.total)}</td></tr>
      </table>
      <p>Stay: ${r.checkIn} to ${r.checkOut}. Guests: ${r.guests}</p>
      <p>Payment method: ${r.payment || "Pay at hotel"}. Status: ${r.status}</p>
      <p><strong>Total: ${money(r.total)}</strong></p>
    </div>
    <div class="no-print"><button class="btn navy" onclick="window.print()">Print invoice</button>
    <button class="btn ghost-dark" onclick="document.getElementById('invoiceDialog').close()">Close</button></div>`;
  $("invoiceDialog").showModal();
}

// Calendar: for each day, count how many rooms are booked
let calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
function renderCalendar() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const totalRooms = ROOMS.reduce((sum, r) => sum + r.units, 0);
  $("calTitle").textContent = calMonth.toLocaleString("en-IN", { month: "long", year: "numeric" });
  let html = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<b class="dow">${d}</b>`).join("");
  html += "<span></span>".repeat(new Date(y, m, 1).getDay());   // empty cells before day 1
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const day = dateString(new Date(y, m, d));
    const used = reservations.filter((r) => r.status !== "Cancelled" && r.checkIn <= day && day < r.checkOut)
      .reduce((sum, r) => sum + (r.rooms || 1), 0);
    const level = used / totalRooms > 0.66 ? "high" : used > 0 ? "mid" : "";
    html += `<div class="day ${level}"><span>${d}</span><small>${used}/${totalRooms} booked</small></div>`;
  }
  $("calGrid").innerHTML = html;
}

// Show or hide admin-only parts of the page
function applyAuth() {
  document.querySelectorAll(".admin-only").forEach((el) => (el.hidden = !isAdmin));
  $("loginLink").textContent = isAdmin ? "Logout" : "Admin Login";
}

// ===== 11. START-UP: connect everything =====
function init() {
  loadData();

  // Fill all room dropdowns from the ROOMS array
  ROOMS.forEach((r) => {
    ["sCat", "fCat", "qCat"].forEach((id) => $(id).add(new Option(r.name, r.name)));
  });

  // Date inputs cannot go before today
  ["sIn", "sOut", "fIn", "fOut"].forEach((id) => ($(id).min = daysFromToday(0)));
  $("sIn").value = daysFromToday(1); $("sOut").value = daysFromToday(2);

  // Hero search button
  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("sOut").value <= $("sIn").value) { toast("Check-out must be after check-in.", true); return; }
    searched = { in: $("sIn").value, out: $("sOut").value };
    $("roomsNote").textContent = `Availability from ${searched.in} to ${searched.out}.`;
    renderRooms();
    $("rooms").scrollIntoView();
    toast("Availability updated.");
  });

  // "Book Now" on a room card fills the booking form
  $("roomGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-room]");
    if (!btn) return;
    $("fCat").value = btn.dataset.room;
    if (searched.in) { $("fIn").value = searched.in; $("fOut").value = searched.out; }
    updateTotal();
    $("booking").scrollIntoView();
  });

  $("bookForm").addEventListener("submit", submitBooking);
  $("cancelEdit").addEventListener("click", stopEditing);
  ["fCat", "fIn", "fOut", "fRooms"].forEach((id) => $(id).addEventListener("change", updateTotal));
  $("tableBody").addEventListener("click", handleTableClick);
  ["qSearch", "qCat", "qStatus"].forEach((id) => $(id).addEventListener("input", renderTable));

  // Contact form
  $("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("cName").value.trim().length < 2 || !/^\S+@\S+\.\S+$/.test($("cEmail").value) || $("cMsg").value.trim().length < 5) {
      toast("Please fill name, a valid email and a message.", true); return;
    }
    toast("Thank you! Your message has been received.");
    e.target.reset();
  });

  // Mobile menu
  $("menuBtn").addEventListener("click", () => {
    const open = $("navLinks").classList.toggle("open");
    $("menuBtn").setAttribute("aria-expanded", open);
  });
  $("navLinks").addEventListener("click", () => $("navLinks").classList.remove("open"));

  $("calPrev").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() - 1); renderCalendar(); });
  $("calNext").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() + 1); renderCalendar(); });

  // Admin login / logout
  $("loginLink").addEventListener("click", (e) => {
    e.preventDefault();
    if (isAdmin) {
      isAdmin = false; sessionStorage.removeItem("stayease_admin");
      applyAuth(); toast("Logged out."); location.hash = "#home";
    } else $("loginDialog").showModal();
  });
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("lUser").value.trim() === ADMIN.user && $("lPass").value === ADMIN.pass) {
      isAdmin = true; sessionStorage.setItem("stayease_admin", "1");
      $("loginDialog").close(); e.target.reset(); $("loginError").textContent = "";
      applyAuth(); toast("Welcome back, admin."); $("dashboard").scrollIntoView();
    } else $("loginError").textContent = "Wrong username or password.";
  });

  applyAuth();
  updateTotal();
  refreshAll();
}

init();