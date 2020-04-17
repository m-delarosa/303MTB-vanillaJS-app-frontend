document.addEventListener("DOMContentLoaded", () => {
  console.log("%cDOM Content Loaded and Parsed!", "color: magenta")

  const $loginForm = document.querySelector(".login-form")
  const $registerForm = document.querySelector(".register-form")

  const $profileLink = document.querySelector("#profile")
  const $loginLink = document.getElementById("login")

  const $closeLoginButton = document.querySelector(".close")
  const $closeRegisterButton = document.querySelector(".close-register")
  const $registerLink = document.getElementById("register")

  const $closeReportButton = document.querySelector(".close-report")

  //   const $editButtons = document.querySelectorAll(".edit-button")
  //   $editButtons.forEach( (button) => button.addEventListener("click", () => {
  //     console.log("edit button clicked")
  // }))

  $loginLink.addEventListener("click", () => {
    event.preventDefault()
    document.querySelector(".bg-modal").style.display = "flex"
  })
  $closeLoginButton.addEventListener("click", closeLoginModal)
  $loginForm.addEventListener("submit", handleLogin)

  $registerLink.addEventListener("click", () => {
    event.preventDefault()
    document.querySelector(".bg-modal-register").style.display = "flex"
  })
  $closeRegisterButton.addEventListener("click", closeRegisterModal)
  $registerForm.addEventListener("submit", handleRegisteration)

  fetch("http://localhost:3000/trails")
    .then((response) => response.json())
    .then((trails) => {
      checkToken()
      trails.forEach((trail) => addTrail(trail))
    })

  function checkToken() {
    if (localStorage.token) $profileLink.innerHTML = "Profile"
  }

  function closeLoginModal() {
    document.querySelector(".bg-modal").style.display = "none"
    checkToken()
  }

  function closeRegisterModal() {
    document.querySelector(".bg-modal-register").style.display = "none"
    checkToken()
  }

  function closeReportModal() {
    document.querySelector(".bg-modal-add-report").style.display = "none"
  }

  function addTrail(trail) {
    const $trailsTable = document.querySelector("#trails-table")
    const $tableRow = document.createElement("tr")

    addName(trail, $tableRow, $trailsTable)
    addStatus(trail, $tableRow)
    addDetails(trail, $tableRow)
    addDate(trail, $tableRow)

    const $addReport = document.createElement("td")
    $addReport.innerHTML = '<a href="#edit" class="edit-button">Edit</a>'
    $addReport.addEventListener("click", () => {
      event.preventDefault()
      document.querySelector(".bg-modal-add-report").style.display = "flex"
    })
    $closeReportButton.addEventListener("click", closeReportModal)
    $tableRow.append($addReport)
  }

  function addName(trail, $tableRow, $trailsTable) {
    const $name = document.createElement("td")

    $name.innerHTML = `<a href=${trail.url} target="_blank">${trail.name}</a>`

    $trailsTable.append($tableRow)
    $tableRow.append($name)
  }

  function addStatus(trail, $tableRow) {
    const $status = document.createElement("td")

    if (trail.condition_status == "Bad / Closed")
      $status.innerHTML = `<img src="images/forbidden.png" alt="Closed. Do not ride." />`
    else if (trail.condition_status == "Minor Issues") {
      $status.innerHTML = `<img src="images/warning.png" alt="Caution, variable conditions present." />`
    } else if (trail.condition_status == "Unknown") {
      $status.innerHTML = `<img src="images/help.png" alt="Condition unknown, please report trail condition." />`
    } else {
      $status.innerHTML = `<img src="images/checked.png" alt="Green, trail is good to ride." />`
    }

    $tableRow.append($status)
  }

  function addDetails(trail, $tableRow) {
    const $details = document.createElement("td")
    $details.innerText = trail.condition_details
    $tableRow.append($details)
  }

  function addDate(trail, $tableRow) {
    const $date = document.createElement("td")

    if (trail.condition_date === "1970-01-01 00:00:00")
      $date.innerText = "Report Needed"
    else $date.innerText = trail.condition_date

    $tableRow.append($date)
  }

  function handleLogin(event) {
    event.preventDefault()
    const loginFormData = new FormData(event.target)

    const username = loginFormData.get("username")
    const password = loginFormData.get("password")

    const loginBody = { username, password }

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginBody),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.token)
        // localStorage.setItem("token", result.token)
        handleLoginUserResponse(result, $loginForm)
      })
  }

  function handleRegisteration(event) {
    event.preventDefault()
    const registrationFormData = new FormData(event.target)
    const name = registrationFormData.get("name")
    const username = registrationFormData.get("username")
    const email = registrationFormData.get("email")
    const password = registrationFormData.get("password")
    const registrationBody = { user: { name, username, email, password } }

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationBody),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.token)
        // localStorage.setItem("token", result.token)
        handleRegistrationUserResponse(result, $registerForm)
      })
  }

  function handleLoginUserResponse(response, form) {
    const $errorMessage = document.getElementById("response-error-message")

    if ($errorMessage) {
      form.removeChild($errorMessage)
    }

    if (response.user) {
      console.log(response.token)
      localStorage.setItem("token", response.token)
      form.reset()
      const $responseMessage = document.createElement("li")
      $responseMessage.innerText = `Welcome back ${response.user.name}. ${response.message}`
      form.append($responseMessage)
      //   $responseList.append($responseMessage)
    } else {
      const $errorMessage = document.createElement("li")
      $errorMessage.id = "response-error-message"
      $errorMessage.innerText = "Please verify login credentials and try again."
      form.append($errorMessage)
      //   $responseList.append($responseMessage)
    }
  }

  function handleRegistrationUserResponse(response, form) {
    const $errorMessage = document.getElementById("response-error-message")

    if ($errorMessage) {
      form.removeChild($errorMessage)
    }

    if (response.user) {
      console.log("User created")
      //   localStorage.setItem("token", response.token)
      form.reset()
      const $responseMessage = document.createElement("li")
      $responseMessage.innerText = `Welcome ${response.user.name}, your user account was created sucessfully.\n Try logging in.`
      form.append($responseMessage)
      //   $responseList.append($responseMessage)
    } else {
      const responseKeys = Object.keys(response)
      const $errorMessage = document.createElement("ul")
      $errorMessage.id = "response-error-message"
      $errorMessage.innerText =
        "We were unable to create your account due to the following:"

      responseKeys.forEach((responseKey) => {
        const li = document.createElement("li")
        li.innerText = response[responseKey]
        $errorMessage.append(li)
      })

      form.append($errorMessage)
      //   $responseList.append($responseMessage)
    }
  }
})
