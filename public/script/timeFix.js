document.addEventListener("DOMContentLoaded", () => {
  const timeElement = document.querySelector(".lastLoggedIn"); // Select the element by class

  if (timeElement) {
    // Extract the date portion after the ":-" separator.
    const textContent = timeElement.textContent.trim();
    const parts = textContent.split(":-");
    
    if (parts.length < 2) {
      console.error("Date string not found in expected format:", textContent);
      return;
    }
    
    const rawDate = parts[1].trim(); // Get the date string
    let parsedDate = new Date(rawDate);

    // If the initial parse fails, attempt to parse using Date.parse()
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(Date.parse(rawDate));
    }

    // If still invalid, log the error and exit
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", rawDate);
      return;
    }

    // Convert to local time string
    const localTime = parsedDate.toLocaleString(); // You can customize the format if needed

    // Update the element to display the localized time
    timeElement.textContent = `Last logged in at :- ${localTime}`;
  }
});
