const API_URL = "http://localhost:3000";

let allCars = [];
let selectedCar = null;
let currentBookingList = [];

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function isLoggedIn() {
  return !!getToken();
}

function updateWelcomeName() {
  const user = getCurrentUser();
  const name = user.fullName || user.name || "Customer";
  $("#welcomeName").text(`Welcome, ${name}`);
}

function updateAccountPage() {
  const user = getCurrentUser();

  if (user && (user.fullName || user.email)) {
    $("#accountInfo").html(
      `<strong>Name:</strong> ${user.fullName || "N/A"}<br><strong>Email:</strong> ${user.email || "N/A"}`
    );
  } else {
    $("#accountInfo").text("No user is currently logged in.");
  }
}

function requireLogin(targetPage) {
  if (!isLoggedIn()) {
    $.mobile.changePage("#loginPage");
    return false;
  }

  if (targetPage) {
    $.mobile.changePage(targetPage);
  }
  return true;
}

function renderCars(cars) {
  let html = "";

  if (!cars || cars.length === 0) {
    html = `<div class="emptyCard"><p>No cars found.</p></div>`;
  } else {
    cars.forEach(function (car) {
      const carId = car._id || car.id || "";
      const image = car.image || "https://via.placeholder.com/500x280?text=CarGo+Car";
      const name = car.name || car.carName || "Car";
      const brand = car.brand || "Brand not provided";
      const type = car.type || "Type not provided";
      const price = car.pricePerDay || car.price || "N/A";
      const seats = car.seats || "N/A";
      const transmission = car.transmission || "N/A";

      html += `
        <div class="carCard">
          <img src="${image}" alt="${name}" class="carImage">
          <h3>${name}</h3>
          <p><strong>Brand:</strong> ${brand}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Seats:</strong> ${seats}</p>
          <p><strong>Transmission:</strong> ${transmission}</p>
          <p><strong>Price per day:</strong> $${price}</p>
          <button class="viewCarBtn primaryBtn" data-id="${carId}">View Details</button>
        </div>
      `;
    });
  }

  $("#carsList").html(html);
}

function renderCarDetails(car) {
  if (!car) {
    $("#carDetailsCard").html("<p>No car selected.</p>");
    return;
  }

  const image = car.image || "https://via.placeholder.com/500x280?text=CarGo+Car";
  const name = car.name || car.carName || "Car";
  const brand = car.brand || "Brand not provided";
  const type = car.type || "Type not provided";
  const seats = car.seats || "N/A";
  const transmission = car.transmission || "N/A";
  const fuel = car.fuel || "N/A";
  const price = car.pricePerDay || car.price || "N/A";
  const description = car.description || "No description available.";

  $("#carDetailsCard").html(`
    <img src="${image}" alt="${name}" class="carImage">
    <h2>${name}</h2>
    <p><strong>Brand:</strong> ${brand}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Seats:</strong> ${seats}</p>
    <p><strong>Transmission:</strong> ${transmission}</p>
    <p><strong>Fuel:</strong> ${fuel}</p>
    <p><strong>Price per day:</strong> $${price}</p>
    <p><strong>Description:</strong> ${description}</p>
  `);

  $("#bookingCarName").val(name);
}

function renderBookings(bookings) {
  let html = "";

  if (!bookings || bookings.length === 0) {
    html = `<div class="emptyCard"><p>No bookings found.</p></div>`;
  } else {
    bookings.forEach(function (booking) {
      const bookingId = booking._id || booking.id || "";
      const carName = booking.carName || "Booked Car";
      const pickupDate = booking.pickupDate || "";
      const returnDate = booking.returnDate || "";
      const pickupLocation = booking.pickupLocation || "";
      const status = booking.status || "Booked";

      html += `
        <div class="bookingCard">
          <h3>${carName}</h3>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Return Date:</strong> ${returnDate}</p>
          <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
          <p><strong>Status:</strong> ${status}</p>
          <button class="editBookingBtn secondaryBtn" data-id="${bookingId}">Edit Booking</button>
        </div>
      `;
    });
  }

  $("#bookingsList").html(html);
}

function loadCars() {
  $("#carsMsg").css("color", "#444").text("Loading cars...");

  $.ajax({
    url: `${API_URL}/api/cars`,
    method: "GET",
    success: function (response) {
      const cars = response.cars || response.data || response || [];
      allCars = Array.isArray(cars) ? cars : [];
      renderCars(allCars);
      $("#carsMsg").text("");
    },
    error: function () {
      const fallbackCars = [
        {
          id: "c1",
          name: "Toyota Corolla",
          brand: "Toyota",
          type: "Sedan",
          seats: 5,
          transmission: "Automatic",
          fuel: "Petrol",
          pricePerDay: 75,
          image: "https://via.placeholder.com/500x280?text=Toyota+Corolla",
          description: "A reliable and comfortable sedan for city and family travel."
        },
        {
          id: "c2",
          name: "Hyundai Tucson",
          brand: "Hyundai",
          type: "SUV",
          seats: 5,
          transmission: "Automatic",
          fuel: "Diesel",
          pricePerDay: 105,
          image: "https://via.placeholder.com/500x280?text=Hyundai+Tucson",
          description: "A spacious SUV suitable for longer journeys and road trips."
        },
        {
          id: "c3",
          name: "Kia Carnival",
          brand: "Kia",
          type: "Van",
          seats: 8,
          transmission: "Automatic",
          fuel: "Petrol",
          pricePerDay: 130,
          image: "https://via.placeholder.com/500x280?text=Kia+Carnival",
          description: "A roomy family van ideal for large groups and luggage."
        }
      ];

      allCars = fallbackCars;
      renderCars(allCars);
      $("#carsMsg").css("color", "#c17d00").text("Loaded demo cars because the API cars route is not ready yet.");
    }
  });
}

function searchCars() {
  const keyword = $("#carSearch").val().trim().toLowerCase();

  if (!keyword) {
    renderCars(allCars);
    return;
  }

  const filtered = allCars.filter(function (car) {
    const name = (car.name || car.carName || "").toLowerCase();
    const brand = (car.brand || "").toLowerCase();
    const type = (car.type || "").toLowerCase();

    return name.includes(keyword) || brand.includes(keyword) || type.includes(keyword);
  });

  renderCars(filtered);
}

function loadBookings() {
  const user = getCurrentUser();
  const userId = user._id || user.id || "";
  const token = getToken();

  $("#bookingsMsg").css("color", "#444").text("Loading bookings...");

  $.ajax({
    url: `${API_URL}/api/bookings?userId=${userId}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    success: function (response) {
      const bookings = response.bookings || response.data || response || [];
      currentBookingList = Array.isArray(bookings) ? bookings : [];
      renderBookings(currentBookingList);
      $("#bookingsMsg").text("");
    },
    error: function () {
      currentBookingList = JSON.parse(localStorage.getItem("demoBookings") || "[]");
      renderBookings(currentBookingList);
      $("#bookingsMsg").css("color", "#c17d00").text("Loaded local demo bookings because the bookings API is not ready yet.");
    }
  });
}

function saveDemoBookings(bookings) {
  localStorage.setItem("demoBookings", JSON.stringify(bookings));
}

function createDemoBooking(bookingData) {
  const demoBookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  const newBooking = {
    id: "b" + Date.now(),
    ...bookingData,
    status: "Booked"
  };
  demoBookings.push(newBooking);
  saveDemoBookings(demoBookings);
}

function updateDemoBooking(bookingId, bookingData) {
  const demoBookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  const updated = demoBookings.map(function (item) {
    if ((item.id || item._id) === bookingId) {
      return { ...item, ...bookingData };
    }
    return item;
  });
  saveDemoBookings(updated);
}

function deleteDemoBooking(bookingId) {
  const demoBookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  const filtered = demoBookings.filter(function (item) {
    return (item.id || item._id) !== bookingId;
  });
  saveDemoBookings(filtered);
}

var rentalCars = [
  {
    id: 1,
    name: "Toyota Corolla Hybrid",
    type: "Compact",
    location: "Brisbane Airport",
    price: 58,
    rating: 4.8,
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    fuel: "Hybrid",
    features: ["Low fuel cost", "Bluetooth", "Reverse camera"],
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Mazda CX-5 Touring",
    type: "SUV",
    location: "Sydney CBD",
    price: 82,
    rating: 4.7,
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Apple CarPlay", "Large boot", "Cruise control"],
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Kia Carnival",
    type: "Van",
    location: "Melbourne Tullamarine",
    price: 104,
    rating: 4.6,
    seats: 8,
    bags: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Family size", "Sliding doors", "Rear air conditioning"],
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Tesla Model 3",
    type: "Luxury",
    location: "Gold Coast",
    price: 129,
    rating: 4.9,
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Electric",
    features: ["Premium interior", "Long range", "Autopilot"],
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Hyundai i30",
    type: "Sedan",
    location: "Rockhampton",
    price: 62,
    rating: 4.5,
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Unlimited km", "USB charging", "Great city car"],
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80"
  }
];

function renderCarList() {
  var searchTerm = ($("#carSearch").val() || "").toLowerCase();
  var selectedType = $("#carTypeFilter").val();
  var sortBy = $("#carSort").val();
  var cars = [];
  var html = "";

  for (var i = 0; i < rentalCars.length; i++) {
    var car = rentalCars[i];
    var searchableText = (
      car.name + " " +
      car.type + " " +
      car.location + " " +
      car.transmission + " " +
      car.fuel + " " +
      car.features.join(" ")
    ).toLowerCase();

    var matchesSearch = searchableText.indexOf(searchTerm) !== -1;
    var matchesType = selectedType === "all" || car.type === selectedType;

    if (matchesSearch && matchesType) {
      cars.push(car);
    }
  }

  if (sortBy === "priceLow") {
    cars.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortBy === "priceHigh") {
    cars.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortBy === "ratingHigh") {
    cars.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }

  if (cars.length === 1) {
    $("#carResultCount").text("1 car available");
  } else {
    $("#carResultCount").text(cars.length + " cars available");
  }

  if (cars.length === 0) {
    $("#carList").html("<p class='empty-state'>No cars match your search.</p>");
    return;
  }

  for (var j = 0; j < cars.length; j++) {
    var currentCar = cars[j];

    html += "<div class='car-card'>";
    html += "<img src='" + currentCar.image + "' alt='" + currentCar.name + "' class='car-img'>";
    html += "<div class='car-card-body'>";
    html += "<div class='car-card-heading'>";
    html += "<div>";
    html += "<h3>" + currentCar.name + "</h3>";
    html += "<p>" + currentCar.location + "</p>";
    html += "</div>";
    html += "<span class='car-price'>$" + currentCar.price + "<small>/day</small></span>";
    html += "</div>";

    html += "<div class='car-meta'>";
    html += "<span>" + currentCar.type + "</span>";
    html += "<span>" + currentCar.seats + " seats</span>";
    html += "<span>" + currentCar.bags + " bags</span>";
    html += "<span>" + currentCar.fuel + "</span>";
    html += "</div>";

    html += "<p class='car-features'>" + currentCar.features.join(" - ") + "</p>";
    html += "<div class='car-card-actions'>";
    html += "<span class='car-rating'>Rating " + currentCar.rating + "</span>";
    html += "<a href='#dealsPage' class='ui-btn ui-mini ui-btn-inline'>View Deal</a>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
  }

  $("#carList").html(html);
}

$(document).on("click", "#loginBtn", function () {
  const email = $("#loginEmail").val().trim();
  const password = $("#loginPassword").val().trim();

  $("#loginMsg").css("color", "red").text("");

  if (!email || !password) {
    $("#loginMsg").text("Email and password are required.");
    return;
  }

  $.ajax({
    url: `${API_URL}/api/signin`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email, password }),
    success: function (res) {
      localStorage.setItem("token", res.token || "");
      localStorage.setItem("user", JSON.stringify(res));
      updateWelcomeName();
      updateAccountPage();
      $("#loginMsg").text("");
      $.mobile.changePage("#homePage");
    },
    error: function (err) {
      $("#loginMsg").text(err.responseJSON?.msg || err.responseJSON?.error || "Login failed.");
    }
  });
});

$(document).on("click", "#signupBtn", function () {
  const fullName = $("#fullName").val().trim();
  const email = $("#signupEmail").val().trim();
  const password = $("#signupPassword").val().trim();
  const confirmPassword = $("#confirmPassword").val().trim();

  $("#signupMsg").css("color", "red").text("");

  if (!fullName || !email || !password || !confirmPassword) {
    $("#signupMsg").text("All fields are required.");
    return;
  }

  if (password.length < 8) {
    $("#signupMsg").text("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    $("#signupMsg").text("Passwords do not match.");
    return;
  }

  $.ajax({
    url: `${API_URL}/api/signup`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      fullName,
      email,
      password,
      confirm_password: confirmPassword
    }),
    success: function (res) {
      $("#signupMsg").css("color", "green").text(res.msg || "Signup successful.");

      $("#fullName").val("");
      $("#signupEmail").val("");
      $("#signupPassword").val("");
      $("#confirmPassword").val("");

      setTimeout(function () {
        $.mobile.changePage("#loginPage");
      }, 1200);
    },
    error: function (err) {
      $("#signupMsg").text(err.responseJSON?.msg || err.responseJSON?.error || "Signup failed.");
    }
  });
});

$(document).on("click", "#resetPasswordBtn", function () {
  const email = $("#forgotEmail").val().trim();

  if (!email) {
    $("#forgotMsg").css("color", "red").text("Email is required.");
    return;
  }

  $("#forgotMsg").css("color", "green").text("Reset request submitted.");
});

$(document).on("pageshow", "#homePage", function () {
  if (!requireLogin()) return;
  updateWelcomeName();
});

$(document).on("pageshow", "#carsPage", function () {
  if (!requireLogin()) return;
  if (allCars.length === 0) {
    loadCars();
  }
});

$(document).on("pageshow", "#myBookingsPage", function () {
  if (!requireLogin()) return;
  loadBookings();
});

$(document).on("pageshow", "#accountPage", function () {
  if (!requireLogin()) return;
  updateAccountPage();
});

$(document).on("click", "#loadCarsBtn", function () {
  loadCars();
});

$(document).on("click", "#searchCarsBtn", function () {
  searchCars();
});

$(document).on("click", ".viewCarBtn", function () {
  const carId = $(this).data("id");
  selectedCar = allCars.find(function (car) {
    return (car._id || car.id) == carId;
  });

  renderCarDetails(selectedCar);
  $.mobile.changePage("#carDetailsPage");
});

$(document).on("click", "#createBookingBtn", function () {
  if (!selectedCar) {
    $("#bookingMsg").css("color", "red").text("Please select a car first.");
    return;
  }

  const pickupDate = $("#pickupDate").val();
  const returnDate = $("#returnDate").val();
  const pickupLocation = $("#pickupLocation").val().trim();
  const token = getToken();
  const user = getCurrentUser();

  $("#bookingMsg").css("color", "red").text("");

  if (!pickupDate || !returnDate || !pickupLocation) {
    $("#bookingMsg").text("Please complete all booking fields.");
    return;
  }

  if (returnDate < pickupDate) {
    $("#bookingMsg").text("Return date must be after pickup date.");
    return;
  }

  const bookingData = {
    userId: user._id || user.id || "",
    carId: selectedCar._id || selectedCar.id || "",
    carName: selectedCar.name || selectedCar.carName || "Car",
    pickupDate,
    returnDate,
    pickupLocation
  };

  $.ajax({
    url: `${API_URL}/api/bookings`,
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    contentType: "application/json",
    data: JSON.stringify(bookingData),
    success: function (res) {
      $("#bookingMsg").css("color", "green").text(res.msg || "Booking created successfully.");

      $("#pickupDate").val("");
      $("#returnDate").val("");
      $("#pickupLocation").val("");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1200);
    },
    error: function () {
      createDemoBooking(bookingData);
      $("#bookingMsg").css("color", "green").text("Booking saved locally because the bookings API is not ready yet.");

      $("#pickupDate").val("");
      $("#returnDate").val("");
      $("#pickupLocation").val("");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1200);
    }
  });
});

$(document).on("pageshow", "#carListPage", function () {
  renderCarList();
});

$(document).on("input change", "#carSearch, #carTypeFilter, #carSort", function () {
  renderCarList();
});


  if (!booking) return;

  $("#editBookingId").val(booking._id || booking.id || "");
  $("#editBookingCarName").val(booking.carName || "");
  $("#editPickupDate").val(booking.pickupDate || "");
  $("#editReturnDate").val(booking.returnDate || "");
  $("#editPickupLocation").val(booking.pickupLocation || "");

  $.mobile.changePage("#editBookingPage");
});

$(document).on("click", "#updateBookingBtn", function () {
  const bookingId = $("#editBookingId").val();
  const pickupDate = $("#editPickupDate").val();
  const returnDate = $("#editReturnDate").val();
  const pickupLocation = $("#editPickupLocation").val().trim();
  const token = getToken();

  $("#editBookingMsg").css("color", "red").text("");

  if (!pickupDate || !returnDate || !pickupLocation) {
    $("#editBookingMsg").text("Please complete all fields.");
    return;
  }

  if (returnDate < pickupDate) {
    $("#editBookingMsg").text("Return date must be after pickup date.");
    return;
  }

  const updateData = {
    pickupDate,
    returnDate,
    pickupLocation
  };

  $.ajax({
    url: `${API_URL}/api/bookings/${bookingId}`,
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    contentType: "application/json",
    data: JSON.stringify(updateData),
    success: function (res) {
      $("#editBookingMsg").css("color", "green").text(res.msg || "Booking updated successfully.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    },
    error: function () {
      updateDemoBooking(bookingId, updateData);
      $("#editBookingMsg").css("color", "green").text("Booking updated locally because the bookings API is not ready yet.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    }
  });
});

$(document).on("click", "#deleteBookingBtn", function () {
  const bookingId = $("#editBookingId").val();
  const token = getToken();

  if (!bookingId) {
    $("#editBookingMsg").css("color", "red").text("Booking not found.");
    return;
  }

  $.ajax({
    url: `${API_URL}/api/bookings/${bookingId}`,
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    success: function (res) {
      $("#editBookingMsg").css("color", "green").text(res.msg || "Booking cancelled successfully.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    },
    error: function () {
      deleteDemoBooking(bookingId);
      $("#editBookingMsg").css("color", "green").text("Booking cancelled locally because the bookings API is not ready yet.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    }
  });
});

$(document).on("click", "#logoutBtn", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  selectedCar = null;
  currentBookingList = [];
  $.mobile.changePage("#loginPage");
});