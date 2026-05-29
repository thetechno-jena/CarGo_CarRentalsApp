const API_URL = "https://localhost:3000";

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

  if (!email || !password) {
    $("#loginMsg").css("color", "red").text("Email and password are required");
    return;
  }

  $.ajax({
    url: `${API_URL}/api/signin`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email, password }),

    success: function (res) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));
      $.mobile.changePage("#homePage");
      $("#loginMsg").text("");
     
    },

    error: function (err) {
      $("#loginMsg")
        .css("color", "red")
        .text(err.responseJSON?.msg || err.responseJSON?.error || "Login failed");
    }
  });
});

// function for sign_up button

$(document).on("click", "#signupBtn", function () {

  const fullName = $("#fullName").val().trim();
  const email = $("#signupEmail").val().trim();
  const password = $("#signupPassword").val().trim();
  const confirmPassword = $("#confirmPassword").val().trim();

  if (!fullName || !email || !password || !confirmPassword) {
    $("#signupMsg")
      .css("color", "red")
      .text("All fields are required");
    return;
  }

  if (password.length < 8) {
    $("#signupMsg")
      .css("color", "red")
      .text("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    $("#signupMsg")
      .css("color", "red")
      .text("Passwords do not match");
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
      confirmPassword
    }),

    success: function (res) {

      $("#signupMsg")
        .css("color", "green")
        .text(res.msg || "User registered successfully");

      // clear fields
      $("#fullName").val("");
      $("#signupEmail").val("");
      $("#signupPassword").val("");
      $("#confirmPassword").val("");

      // switch back to login page
      setTimeout(() => {
        $.mobile.changePage("#loginPage");
      }, 2000);
    },

    error: function (err) {

      $("#signupMsg")
        .css("color", "red")
        .text(
          err.responseJSON?.msg ||
          err.responseJSON?.error ||
          "Signup failed"
        );
    }
  });

});

// function for logout

$(document).on("click", "#logoutBtn", function () {
  localStorage.clear();
  $.mobile.changePage("#loginPage");
});

// forgot password rest//
$(document).on("click", "#resetPasswordBtn", function () {
  const email = $("#forgotEmail").val().trim();

  if (!email) {
    $("#forgotMsg").css("color", "red").text("Email is required");
    return;
  }

  $("#forgotMsg")
    .css("color", "green")
    .text("Reset request submitted.");
});

// function for trips

function loadTrips() {
  $.ajax({
    url: `${API_URL}/api/trips`,
    method: "GET",

    success: function (trips) {
      $("#tripFeed").html("");

      if (trips.length === 0) {
        $("#tripFeed").html("<p>No travel stories yet.</p>");
        return;
      }

      trips.forEach(function (trip) {
        $("#tripFeed").append(`
          <div class="trip-card">
            <h3>${trip.tripName}</h3>

            ${
              trip.photoUrl
                ? `<img src="${trip.photoUrl}" class="trip-img">`
                : ""
            }

            <p><b>Location:</b> ${trip.location}</p>
            <p><b>Dates:</b> ${trip.startDate} to ${trip.endDate}</p>
            <p><b>Description:</b> ${trip.description}</p>
            <p><b>Accommodation:</b> ${trip.accommodation}</p>
            <p><b>Activities:</b> ${trip.activities}</p>
          </div>
        `);
      });
    },

    error: function () {
      $("#tripFeed").html("<p style='color:red;'>Failed to load travel stories.</p>");
    }
  });
}

$(document).on("pageshow", "#homePage", function () {
  loadTrips();
});

$(document).on("pageshow", "#carListPage", function () {
  renderCarList();
});

$(document).on("input change", "#carSearch, #carTypeFilter, #carSort", function () {
  renderCarList();
});


// function for add journey
$(document).on("pageshow", "#homePage", function () {
  loadTrips();
});

$(document).on("click", "#addJourneyBtn", function () {
  const user = JSON.parse(localStorage.getItem("user"));
const tripData = {
  userId: user._id || user.user?._id,
  tripName: $("#tripName").val(),
  location: $("#tripLocation").val(),
  photoUrl: $("#photoUrl").val(),
  description: $("#tripDescription").val(),
  accommodation: $("#accommodation").val(),
  activities: $("#activities").val(),
  startDate: $("#startDate").val(),
  endDate: $("#endDate").val()
};

  if (!tripData.tripName || !tripData.location || !tripData.description) {
    $("#journeyMsg").css("color", "red").text("Trip name, location and description are required");
    return;
  }

  $.ajax({
    url: `${API_URL}/api/trips`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(tripData),

    success: function (res) {
  $("#journeyMsg")
    .css("color", "green")
    .text(res.msg || "Journey added successfully");

  setTimeout(() => {
    $.mobile.changePage("#homePage");
    loadTrips();
  }, 1500);
},
    error: function (err) {
  console.log(err.responseJSON);

  $("#journeyMsg")
    .css("color", "red")
    .text(err.responseJSON?.error || err.responseJSON?.msg || "Failed to add journey");
}
  });
});
