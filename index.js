document.addEventListener("DOMContentLoaded", () => {
  console.log("%cDOM Content Loaded and Parsed!", "color: magenta")

    fetch("http://localhost:3000/trails")
        .then((response) => response.json())
        .then((trails) => {
        trails.forEach((trail) => addTrail(trail))
        })

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
    
})
