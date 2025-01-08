document.addEventListener("DOMContentLoaded", function () {
  let timeSpentOnPage = 0; // Time in seconds
  let hasScrolledPast50 = false;
  let eventLogged = false; // Ensure event is logged only once

  // Scroll event listener
  function checkScrollDepth() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Check if the user has scrolled more than 50% of the page
    if (scrollPosition >= pageHeight / 2) {
      hasScrolledPast50 = true;
    }

    // Check conditions and log the event
    logEventIfConditionsMet();
  }

  // Time tracking (update every second)
  const timeTracker = setInterval(function () {
    timeSpentOnPage += 1;
    logEventIfConditionsMet();

    // Stop timer after 10 seconds, if conditions are already met
    if (eventLogged) {
      clearInterval(timeTracker);
    }
  }, 1000);

  // Function to log the event if both conditions are met
  function logEventIfConditionsMet() {
    if (!eventLogged && timeSpentOnPage > 10 && hasScrolledPast50) {
      console.log("User spent more than 10 seconds AND scrolled past 50% of the page.");
      eventLogged = true; // Ensure this only logs once

      // You can also trigger other actions here if desired.
    }
  }

  // Add event listener to track scrolling
  window.addEventListener("scroll", checkScrollDepth);
});
