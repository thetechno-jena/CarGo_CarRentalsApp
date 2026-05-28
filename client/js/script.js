const API_URL = "https://localhost:3000";

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
