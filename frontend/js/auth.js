function register() {
  fetch("http://127.0.0.1:8000/api/accounts/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert("Registration Successful");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration Failed");
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Server error");
  });
}


function login() {
  fetch(API_BASE + "accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    window.location = "stations.html";
  });
}
