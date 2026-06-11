//const API_URL = "http://localhost:3000";
// after render deployed
const API_URL = "https://cargo-carrentalsapp.onrender.com";
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
// this function for fetch car details from mongo db
function renderCars(cars) {
  const container = $("#carsList");
  container.empty();

  if (!cars || cars.length === 0) {
    showCarsEmptyState(true);
    return;
  }

  showCarsEmptyState(false);

  const groupedCars = {};

  cars.forEach(function (car) {
    const brand = car.brand || "Other";

    if (!groupedCars[brand]) {
      groupedCars[brand] = [];
    }

    groupedCars[brand].push(car);
  });

  Object.keys(groupedCars).forEach(function (brand) {
    container.append(`<h2 class="brand-heading">${brand}</h2>`);

    groupedCars[brand].forEach(function (car) {
      const card = $("#carCardSample").clone().removeAttr("id").show();

      card.find(".carNameEl").text(car.name || "Car");
      card.find(".carBrandEl").text(car.brand || "N/A");
      card.find(".carTypeEl").text(car.type || "N/A");
      card.find(".carSeatsEl").text(car.seats || "N/A");
      card.find(".carTransmissionEl").text(car.transmission || "N/A");
      card.find(".carPriceEl").text(car.pricePerDay || car.price || "N/A");
      card.find(".carRegistrationEl").text(car.registrationNo || "N/A");

if (car.available) {
  card.find(".carStatusEl").html(
    '<span class="available-text">🟢 Available</span>'
  );

  card.find(".viewCarBtn")
    .text("View Details")
    .prop("disabled", false)
    .attr("data-id", car._id || car.id || "");

} else {
  const untilDate = car.unavailableUntil
    ? new Date(car.unavailableUntil).toLocaleDateString("en-AU")
    : "the return date";

  card.find(".carStatusEl").html(
    `<span class="not-available-text">
      🔴 Not Available until ${untilDate}
    </span>`
  );

  card.find(".viewCarBtn")
    .text("Not Available")
    .prop("disabled", true)
    .attr("data-id", "");
}

      setImage(
        card.find(".carImageEl"),
        car.image || "images/cars/toyota-corolla.jpg",
        "images/cars/toyota-corolla.jpg"
      );

      container.append(card);
    });
  });
}

function renderCarDetails(car) {
  if (!car) {
  $("#bookingMsg").css("color", "red").text("Car details not found.");
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
    car.image || "images/cars/toyota-corolla.jpg",
    "images/cars/toyota-corolla.jpg"
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
  $("#carsMsg").css("color", "#444").text("Loading cars...");

  $.ajax({
    url: `${API_URL}/api/getCars`,
    method: "GET",
    success: function (response) {
      const cars = response.cars || response.data || response || [];
      allCars = Array.isArray(cars) ? cars : [];
      renderCars(allCars);
      $("#carsMsg").text("");
    },
    error: function () {
      $("#carsMsg")
        .css("color", "red")
        .text("Could not load cars from database.");
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

  $("#bookingsMsg").css("color", "#ffffff").text("Loading bookings...");

  $.ajax({
    url: `${API_URL}/api/getBookings?userId=${userId}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    success: function (response) {
      const bookings = response.bookings || response.data || response || [];
      currentBookingList = Array.isArray(bookings) ? bookings : [];
      renderBookings(currentBookingList);
      $("#bookingsMsg").text("");
    },
    error: function () {
      $("#bookingsMsg")
        .css("color", "red")
        .text("Could not load bookings from database.");
    }
  });
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
    url: `${API_URL}/api/saveBooking`,
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
    error: function (err) {
      $("#bookingMsg")
        .css("color", "red")
        .text(err.responseJSON?.msg || err.responseJSON?.error || "Booking failed.");
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

  const updateData = {
    pickupDate,
    returnDate,
    pickupLocation
  };

  $.ajax({
    url: `${API_URL}/api/updateBooking/${bookingId}`,
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
    error: function (err) {
      $("#editBookingMsg")
        .css("color", "red")
        .text(err.responseJSON?.msg || err.responseJSON?.error || "Booking update failed.");
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
    url: `${API_URL}/api/deleteBooking/${bookingId}`,
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    success: function (res) {
      $("#editBookingMsg").css("color", "green").text(res.msg || "Booking cancelled successfully.");

      setTimeout(function () {
        $.mobile.changePage("#myBookingsPage");
      }, 1000);
    },
    error: function (err) {
      $("#editBookingMsg")
        .css("color", "red")
        .text(err.responseJSON?.msg || err.responseJSON?.error || "Booking delete failed.");
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