const API_URL = "http://localhost:3000";

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
      confirm_password : confirmPassword
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

