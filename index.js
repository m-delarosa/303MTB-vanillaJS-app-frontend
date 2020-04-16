document.addEventListener("DOMContentLoaded", () => {
  console.log("%cDOM Content Loaded and Parsed!", "color: magenta")

    const $loginForm = document.querySelector(".login-form")
    const $profileLink = document.querySelector("#profile")
    const $loginLink = document.getElementById('login')

    $loginForm.addEventListener("submit", handleLogin)
    $loginLink.addEventListener('click', () => {
        event.preventDefault()
        document.querySelector('.bg-modal').style.display = 'flex'
    })

    fetch("http://localhost:3000/trails")
        .then((response) => response.json())
        .then((trails) => {
        checkToken()
        trails.forEach((trail) => addTrail(trail))
        })

    function checkToken() {
        if (localStorage.token)
            $profileLink.innerHTML = "Profile"
    }

    function addTrail(trail) {
        const $trailsTable = document.querySelector("#trails-table")
        const $tableRow = document.createElement("tr")

        addName(trail, $tableRow, $trailsTable)
        addStatus(trail, $tableRow)
        addDetails(trail, $tableRow)
        addDate(trail, $tableRow)

        const $addReport = document.createElement("td")
        $addReport.innerHTML = '<a href="#edit">Edit</a>'
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
        else
        $date.innerText = trail.condition_date
        
        $tableRow.append($date)
    }
    

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.bg-modal').style.display = 'none'
    })

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
        }).then((response) => response.json())
          .then(result => {
            console.log(result.token)
            localStorage.setItem("token", result.token)
          })
      
        event.target.reset()
      }
})
