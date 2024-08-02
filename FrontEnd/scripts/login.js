const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  const main = document.querySelector("main");
  let response_error_message = document.querySelector("main alert");

  // Delete the alert if it is present
  if (response_error_message != null) main.removeChild(response_error_message);

  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const login = {
    email: email.value,
    password: password.value,
  };
  const body = JSON.stringify(login);
  // Appel de la fonction fetch avec toutes les informations nécessaires
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  }).then((response) => {
    // Returns true if the response returned successfully
    if (response.ok) {
      // Get the authentication token in the resulting json before going back
      response.json().then((result) => {
        const token = result["token"];
        window.location = "index.html";
        // Add th token to the local storage for later
        window.localStorage.setItem("token", token);
      });
    } else {
      response_error_message = document.createElement("alert");
      response_error_message.innerText = "Echec de l'authentification";
      main.appendChild(response_error_message);
    }
  });
});
