document.addEventListener("DOMContentLoaded", () => {
  const timeElement = document.querySelector(".lastLoggedIn")

  if (timeElement) {
    const textContent = timeElement.textContent.trim()
    const parts = textContent.split(":-")
  
    if (parts.length < 2) {
      console.error("Date string not found in expected format:", textContent)
      return
    }
    const rawDate = parts[1].trim() + " UTC"
    let parsedDate = new Date(rawDate)
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(Date.parse(rawDate))
    }
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", rawDate)
      return
    }
    const localTime = parsedDate.toLocaleString()
    timeElement.textContent = `Last logged in at :- ${localTime}`
  }
});
