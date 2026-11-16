# 🏨 StayEase – Hotel Reservation System

**A Modern, Responsive & User-Friendly Hotel Booking Platform**

StayEase is a frontend-based hotel reservation system developed using **HTML5, CSS3, and JavaScript**. It provides a seamless hotel booking experience for guests and an easy-to-use reservation management dashboard for administrators.

The application allows users to explore room categories, check room availability, make reservations, calculate booking costs, and generate printable invoices. Administrators can manage reservations, monitor hotel statistics, and track room bookings through an interactive dashboard.

All application data is stored locally in the browser using **LocalStorage**, eliminating the need for a backend or database.

---

## 📌 Project Information

| Detail | Description |
|---|---|
| Project Name | StayEase – Hotel Reservation System |
| Course | CSE 326 – Internet Programming |
| Project Type | CA1 Project |
| Frontend | HTML5, CSS3, JavaScript |
| Storage | Browser LocalStorage |
| Backend | Not Required |
| Frameworks | None |
| Deployment | Vercel & GitHub Pages |

---

## ✨ Key Features

### 👤 Guest Features

- **Room Availability Search:** Search for available rooms based on check-in date, check-out date, number of guests, and room category.
- **Multiple Room Categories:** Explore four room types – Standard, Deluxe, Premium Suite, and Family Suite.
- **Dynamic Room Pricing:** View room prices in Indian Rupees (INR), along with amenities and availability.
- **Easy Reservation:** Complete bookings through an interactive reservation form with input validation.
- **Automatic Booking ID:** Every reservation receives a unique booking ID, such as `SE1001`, `SE1002`, etc.
- **Automatic Price Calculation:** Booking costs are calculated based on the number of nights, rooms, and selected room category.
- **Multi-Room Booking:** Reserve multiple rooms within a single booking.
- **Payment Method Selection:** Choose a preferred payment method during reservation.
- **Double Booking Prevention:** Prevent overlapping reservations from exceeding the available room capacity.
- **Printable Invoice:** Generate and print a detailed booking invoice after successful reservation.
- **Contact Form:** Allow guests to submit enquiries through the contact section.
- **Responsive Navigation:** Enjoy easy navigation with a mobile-friendly menu.

### 🔐 Admin Features

- **Admin Login:** Access the administrative dashboard through a demonstration login system.
- **Interactive Dashboard:** View important hotel reservation statistics.
- **Reservation Statistics:** Monitor total, confirmed, pending, and cancelled bookings.
- **Revenue Overview:** Track the total revenue recorded from reservations.
- **Reservation Management:** View, confirm, edit, and cancel existing bookings.
- **Search Reservations:** Find bookings using guest names or booking IDs.
- **Advanced Filtering:** Filter reservations by room category and booking status.
- **Booking Calendar:** View daily room booking information through a calendar interface.

---

## 🛏️ Available Room Categories

StayEase offers four different room categories to accommodate different guest requirements.

| Room Category | Description |
|---|---|
| Standard Room | Comfortable accommodation with essential amenities. |
| Deluxe Room | Enhanced comfort with additional facilities. |
| Premium Suite | Spacious and premium accommodation. |
| Family Suite | Larger accommodation designed for families. |

*Room prices, amenities, and availability are displayed dynamically on the website.*

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic website structure and content |
| CSS3 | Styling, layouts, animations, and responsiveness |
| JavaScript | Booking logic, validation, and interactive functionality |
| LocalStorage | Persistent storage of reservation data |
| CSS Grid & Flexbox | Responsive page layouts |
| DOM Manipulation | Dynamic updates and user interactions |

**No external frontend frameworks or backend technologies are required.**

---

## ⚙️ How It Works

### 1. Room Availability Management

The system checks room availability based on the selected check-in and check-out dates, room category, and existing reservations. It prevents overlapping bookings from exceeding the available room capacity.

### 2. Booking ID Generation

Every successful reservation receives a unique automatically generated booking ID in the following format:

- `SE1001`
- `SE1002`
- `SE1003`

### 3. Automatic Price Calculation

The total booking amount is calculated dynamically based on the number of nights, number of rooms, and selected room's price per night.

**Total Price = Number of Nights × Number of Rooms × Price Per Night**

### 4. Reservation Management

Guests can make bookings and generate printable invoices, while administrators can view, search, filter, confirm, edit, and cancel reservations.

### 5. Local Data Storage

All reservation records are saved in the browser using LocalStorage. This allows the application to retain booking information even after a page refresh.

---

## 🔑 Admin Login Credentials

Use the following demonstration credentials to access the admin dashboard.

| Field | Credentials |
|---|---|
| Username | `admin` |
| Password | `admin123` |

**Note:** Admin authentication is implemented on the frontend for demonstration purposes.

---

## 🌐 Live Demo

Experience StayEase – Hotel Reservation System:

- **Vercel Deployment:** [Visit Live Website](https://YOUR-PROJECT.vercel.app/)
- **GitHub Pages:** [Visit Live Website](https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/)

*Replace the placeholder links with your actual deployment URLs.*

---

## 📂 Project Structure

```text
StayEase/
│
├── index.html      # Main website structure
├── style.css       # Styling and responsive design
├── script.js       # Booking logic and functionality
└── README.md       # Project documentation
```

---

## 🎓 Academic Purpose

StayEase is developed as part of the **CSE 326 – Internet Programming (CA1)** coursework.

The project demonstrates practical implementation of:

- HTML5 semantic elements and website structure.
- CSS3 styling, animations, and responsive layouts.
- JavaScript programming and DOM manipulation.
- Event handling and form validation.
- Browser LocalStorage for data persistence.
- Dynamic data management and booking calculations.
- Interactive frontend development.

---

## 👨‍💻 Team Members

| Team Member | Contribution |
|---|---|
| Member 1 | Add name and contribution |
| Member 2 | Add name and contribution |
| Member 3 | Add name and contribution |
