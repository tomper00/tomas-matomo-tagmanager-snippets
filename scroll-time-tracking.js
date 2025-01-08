<script>
let timeOnPage = 0; // Time in seconds
    let scrollDepth50Reached = false; // Flag to track if 50% scroll depth is reached
    let conditionsLogged = false; // To ensure logging happens only once

    // Function to check scroll depth
    function checkScrollDepth() {
        const scrollPosition = window.scrollY + window.innerHeight; // Current visible bottom of the screen
        const pageHeight = document.documentElement.scrollHeight;  // Total page height

        // Check if user has scrolled more than 50% of the total page height
        if (scrollPosition >= 0.5 * pageHeight) {
            scrollDepth50Reached = true;
        }

        // Log to console if conditions are met
        checkConditionsAndLog();
    }

    // Function to track time spent on the page
    const timeTracker = setInterval(function () {
        timeOnPage += 1; // Increment time every second
        checkConditionsAndLog();

        // If conditions are logged, stop tracking time
        if (conditionsLogged) {
            clearInterval(timeTracker); // Stop the timer
            window.removeEventListener("scroll", checkScrollDepth); // Remove scroll listener
        }
    }, 1000);

    // Function to log the message if both conditions are met
    function checkConditionsAndLog() {
        if (timeOnPage >= 10 && scrollDepth50Reached && !conditionsLogged) {
            console.log("Conditions met: User spent more than 10 seconds on page and scrolled past 50%");
            _paq.push(['trackEvent', 'EngagedPageview', document.title, window.location.pathname]);
            conditionsLogged = true;
        }
    }

    // Add an event listener for scrolling
    window.addEventListener("scroll", checkScrollDepth);
</script>
