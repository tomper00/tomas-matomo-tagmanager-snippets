<script>
if (!window.engagementTrackingInitialized) {
    window.engagementTrackingInitialized = true; // Prevent duplicate tracking
    
    document.addEventListener("DOMContentLoaded", function() {
        let timeOnPage = 0; // Time in seconds
        let scrollDepth50Reached = false;
        let conditionsLogged = false;

        // Scroll depth check
        function checkScrollDepth() {
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            if (scrollPosition >= 0.5 * pageHeight) {
                scrollDepth50Reached = true;
            }
            checkConditionsAndLog();
        }

        // Time spent check
        const timeTracker = setInterval(() => {
            timeOnPage += 1;
            checkConditionsAndLog();
            if (conditionsLogged) {
                clearInterval(timeTracker);
                window.removeEventListener("scroll", checkScrollDepth);
            }
        }, 1000);

        // Log conditions
        function checkConditionsAndLog() {
            if (timeOnPage >= 10 && scrollDepth50Reached && !conditionsLogged) {
                console.log("Conditions met: User spent more than 10 seconds on page and scrolled past 50%");
                if (window._paq) {
                    _paq.push(['trackEvent', 'EngagedPageview', document.title, window.location.pathname]);
                } else {
                    console.error("_paq is not initialized.");
                }
                conditionsLogged = true;
            }
        }

        // Add scroll listener
        window.addEventListener("scroll", checkScrollDepth);
    });
}
</script>
