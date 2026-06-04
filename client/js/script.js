const API_URL =
  localStorage.getItem("apiUrl") ||
  window.CARGO_API_URL ||
  (window.location.protocol === "file:"
    ? "http://10.0.2.2:3000"
    : window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : window.location.origin);

let allCars = [];
let selectedCar = null;
let currentBookingList = [];

const demoCars = [
  {
    id: "c1",
    name: "Toyota Corolla",
    brand: "Toyota",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 75,
    image: "Images/Cars/toyota-corolla.jpg",
    description: "A reliable and comfortable sedan for city driving, daily travel, and small family trips."
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
    image: "Images/Cars/hyundai-tucson.jpg",
    description: "A spacious SUV suitable for longer journeys, weekend trips, and comfortable highway driving."
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
    image: "Images/Cars/kia-carnival.jpg",
    description: "A roomy family van ideal for group travel, luggage, and airport transfers."
  },
  {
    id: "c4",
    name: "Toyota Camry",
    brand: "Toyota",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 95,
    image: "Images/Cars/toyota-camry.jpg",
    description: "A stylish and efficient sedan offering smooth performance, comfort, and low fuel consumption."
  },
  {
    id: "c5",
    name: "Toyota Crown",
    brand: "Toyota",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 140,
    image: "Images/Cars/toyota-crown.jpg",
    description: "A premium sedan with a refined interior, elegant styling, and a comfortable driving experience."
  },
  {
    id: "c6",
    name: "Toyota Land Cruiser",
    brand: "Toyota",
    type: "4WD SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 180,
    image: "Images/Cars/toyota-land-cruiser.jpg",
    description: "A strong and capable SUV designed for family trips, long-distance travel, and rougher road conditions."
  },
  {
    id: "c7",
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 210,
    image: "Images/Cars/mercedes-e-class.jpg",
    description: "A premium executive sedan that combines luxury, performance, and advanced comfort features."
  },
  {
    id: "c8",
    name: "BMW 5 Series",
    brand: "BMW",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 205,
    image: "Images/Cars/bmw-5-series.jpg",
    description: "A sporty and elegant luxury sedan that delivers a smooth ride and strong premium appeal."
  }
];

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

function requireLogin() {
  if (!isLoggedIn()) {
    $.mobile.changePage("#loginPage");
    return false;
  }
  return true;
}

function updateWelcomeName() {
  const user = getCurrentUser();
  const name = user.fullName || user.name || "Customer";
  $("#welcomeName").text(`Welcome, ${name}`);
}

function updateAccountPage() {
  const user = getCurrentUser();
  $("#accountName").text(user.fullName || user.name || "N/A");
  $("#accountEmail").text(user.email || "N/A");
}

function setImage(imgEl, src, fallback) {
  imgEl.attr("src", src);
  imgEl.off("error").on("error", function () {
    $(this).attr("src", fallback);
  });
}

function showCarsEmptyState(show) {
  $("#carsEmptyState").toggle(show);
}

function showBookingsEmptyState(show) {
  $("#bookingsEmptyState").toggle(show);
}

function renderCars(cars) {
  const container = $("#carsList");
  container.empty();

  if (!cars || cars.length === 0) {
    showCarsEmptyState(true);
    return;
  }

  showCarsEmptyState(false);

  cars.forEach(function (car) {
    const card = $("#carCardSample").clone().removeAttr("id").show();

    card.find(".carNameEl").text(car.name || "Car");
    card.find(".carBrandEl").text(car.brand || "N/A");
    card.find(".carTypeEl").text(car.type || "N/A");
    card.find(".carSeatsEl").text(car.seats || "N/A");
    card.find(".carTransmissionEl").text(car.transmission || "N/A");
    card.find(".carPriceEl").text(car.pricePerDay || car.price || "N/A");
    card.find(".viewCarBtn").attr("data-id", car._id || car.id || "");

    setImage(
      card.find(".carImageEl"),
      car.image || "Images/Cars/toyota-corolla.jpg",
      "Images/Cars/toyota-corolla.jpg"
    );

    container.append(card);
  });
}

function renderCarDetails(car) {
  if (!car) {
    $("#detailCarName").text("Select a car");
    $("#detailCarBrand").text("-");
    $("#detailCarType").text("-");
    $("#detailCarSeats").text("-");
    $("#detailCarTransmission").text("-");
    $("#detailCarFuel").text("-");
    $("#detailCarPrice").text("-");
    $("#detailCarDescription").text("No description available.");
    setImage($("#detailCarImage"), "Images/Cars/toyota-corolla.jpg", "Images/Cars/toyota-corolla.jpg");
    return;
  }

  $("#detailCarName").text(car.name || "Car");
  $("#detailCarBrand").text(car.brand || "N/A");
  $("#detailCarType").text(car.type || "N/A");
  $("#detailCarSeats").text(car.seats || "N/A");
  $("#detailCarTransmission").text(car.transmission || "N/A");
  $("#detailCarFuel").text(car.fuel || "N/A");
  $("#detailCarPrice").text(car.pricePerDay || car.price || "N/A");
  $("#detailCarDescription").text(car.description || "No description available.");

  setImage(
    $("#detailCarImage"),
    car.image || "Images/Cars/toyota-corolla.jpg",
    "Images/Cars/toyota-corolla.jpg"
  );

  $("#bookingCarName").val(car.name || "Car");
}

function renderBookings(bookings) {
  const container = $("#bookingsList");
  container.empty();

  if (!bookings || bookings.length === 0) {
    showBookingsEmptyState(true);
    return;
  }

  showBookingsEmptyState(false);

  bookings.forEach(function (booking) {
    const card = $("#bookingCardSample").clone().removeAttr("id").show();

    card.find(".bookingCarNameEl").text(booking.carName || "Booked Car");
    card.find(".bookingPickupDateEl").text(booking.pickupDate || "");
    card.find(".bookingReturnDateEl").text(booking.returnDate || "");
    card.find(".bookingPickupLocationEl").text(booking.pickupLocation || "");
    card.find(".bookingStatusEl").text(booking.status || "Booked");
    card.find(".editBookingBtn").attr("data-id", booking._id || booking.id || "");

    container.append(card);
  });
}

function loadCars() {
  const token = getToken();
  $("#carsMsg").css("color", "#444").text("Loading cars...");

  $.ajax({
    url: `${API_URL}/api/cars`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    success: function (response) {
      const cars = response.cars || response.data || response || [];
      allCars = Array.isArray(cars) ? cars : [];
      renderCars(allCars);
      $("#carsMsg").text("");
    },
    error: function () {
      allCars = demoCars;
      renderCars(allCars);
      $("#carsMsg").css("color", "#c17d00").text("Loaded demo cars because the API is unavailable.");
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
    const name = (car.name || "").toLowerCase();
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
      $("#bookingsMsg").css("color", "#c17d00").text("Loaded local demo bookings because the API is unavailable.");
    }
  });
}

function createDemoBooking(bookingData) {
  const bookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  bookings.push({
    id: "b" + Date.now(),
    ...bookingData,
    status: "Booked"
  });
  localStorage.setItem("demoBookings", JSON.stringify(bookings));
}

function updateDemoBooking(bookingId, updateData) {
  const bookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  const updated = bookings.map(function (item) {
    if ((item.id || item._id) === bookingId) {
      return { ...item, ...updateData };
    }
    return item;
  });
  localStorage.setItem("demoBookings", JSON.stringify(updated));
}

function deleteDemoBooking(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
  const filtered = bookings.filter(function (item) {
    return (item.id || item._id) !== bookingId;
  });
  localStorage.setItem("demoBookings", JSON.stringify(filtered));
}

// AUTH
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
      const token = res.token || "";
      const user = res.user || {
        id: res.id || res._id || "",
        fullName: res.fullName || res.name || "",
        email: res.email || email
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      updateWelcomeName();
      updateAccountPage();
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
      $("#fullName, #signupEmail, #signupPassword, #confirmPassword").val("");

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

// PAGE EVENTS
$(document).on("pageshow", "#homePage", function () {
  if (!requireLogin()) return;
  updateWelcomeName();
});

$(document).on("pageshow", "#carsPage", function () {
  if (!requireLogin()) return;
  loadCars();
});

$(document).on("pageshow", "#myBookingsPage", function () {
  if (!requireLogin()) return;
  loadBookings();
});

$(document).on("pageshow", "#accountPage", function () {
  if (!requireLogin()) return;
  updateAccountPage();
});

// CAR EVENTS
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

// BOOKING EVENTS
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
    carName: selectedCar.name || "Car",
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
      $("#pickupDate, #returnDate, #pickupLocation").val("");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1200);
    },
    error: function () {
      createDemoBooking(bookingData);
      $("#bookingMsg").css("color", "green").text("Booking saved locally because the API is unavailable.");
      $("#pickupDate, #returnDate, #pickupLocation").val("");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1200);
    }
  });
});

$(document).on("click", ".editBookingBtn", function () {
  const bookingId = $(this).data("id");
  const booking = currentBookingList.find(function (item) {
    return (item.id || item._id) == bookingId;
  });

  if (!booking) return;

  $("#editBookingId").val(booking.id || booking._id || "");
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

  const updateData = { pickupDate, returnDate, pickupLocation };

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
      $("#editBookingMsg").css("color", "green").text("Booking updated locally because the API is unavailable.");

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
      $("#editBookingMsg").css("color", "green").text("Booking cancelled locally because the API is unavailable.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    }
  });
});

// LOGOUT
$(document).on("click", "#logoutBtn", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  selectedCar = null;
  currentBookingList = [];
  $.mobile.changePage("#loginPage");
});
