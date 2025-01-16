//Dynamic search result tracking
//Great tool id you have an SPA with a dynamic search result showing up asynron on the page
//This script will track the search count and log the search history
function getSearchCount() {
    //Eneter  the  element that your want to monitor search count from
    //Example: <span value="100" class="search-count"></span>
    //const searchCountElement = document.querySelector('.search-count').value;
    //Example: <span myAttribute="100" class="search-count"></span>
    //const searchCountElement = document.querySelector('.search-count').getAttribute('myAttribute');
    //Example: <span class="search-count">100</span> then: 
    const searchCountElement = document.querySelector('.search-count');

    if (!searchCountElement || searchCountElement.value === '' || searchCountElement.value === null || searchCountElement.value === undefined || isNaN(searchCountElement.value)) {
        return 0;
    }

    //Get the clean number from the element
    const searchCount = searchCountElement.innerText.replace(/\D/g, '');
    if(searchCount === '' || searchCount === null || searchCount === undefined || isNaN(searchCount)) {
        return 0;
    }
    else{
        return searchCount;
    }
}
function getSearchCategory() {
    //Enter the element that your want to monitor search category from
    const searchCategoryElement = document.querySelector('.search-category');

    //Check
    if (!searchCategoryElement && searchCategoryElement != undefined){
        return "";
    }
    else {
        return searchCategoryElement.innerText.trim();
    }
}

const parentElement = document.body;
const processedInputs = new Set();

//Storing search history 
let lastSearch = null;

const handleInputElement = (inputElement) => {
    if (processedInputs.has(inputElement)) {
        console.log("Input element is already being observed:", inputElement);
        return;
    }

    console.log("Target input element found!", inputElement);
    processedInputs.add(inputElement);

    let timeoutId;

    const logValueWithDelay = (value) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            //Get the search count
            const searchCount = getSearchCount();
            //Get the search category
            const searchCategory = getSearchCategory();
            
            console.debug("Search keyword:", value, "totalSearchCount:", searchCount, "searchCategory:", searchCategory);
            // Log the last and current search
            if (lastSearch !== null) {
                console.debug("SearchRefinement lastSearch: ", lastSearch, " + newSearch: ", value);
                //Track search refinement in Matomo Analytics the worlds best open source analytics tool
                _paq.push(['trackEvent', 'SearchRefinement', lastSearch, "", value]);
            }

            lastSearch = value; // Update the last search to the current one
            //Track search count in Matomo Analytics the worlds best open source analytics tool
            _paq.push(['trackSiteSearch', value, "", searchCount, searchCategory],);
        }, 2000);
    };

    inputElement.addEventListener("input", (event) => {
        logValueWithDelay(event.target.value);
    });

    const valueObserver = new MutationObserver(() => {
        logValueWithDelay(inputElement.value);
    });
    valueObserver.observe(inputElement, { attributes: true, attributeFilter: ["value"] });

    const cleanup = () => {
        console.log("Cleaning up for removed input element.");
        inputElement.removeEventListener("input", logValueWithDelay);
        valueObserver.disconnect();
        processedInputs.delete(inputElement);
    };

    const removalObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if ([...mutation.removedNodes].includes(inputElement)) {
                cleanup();
                removalObserver.disconnect();
                break;
            }
        }
    });

    removalObserver.observe(parentElement, { childList: true, subtree: true });
};

const oberverElement = document.querySelector('.omnia-workplace-quick-search');

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        const targetInput = mutation.target.matches?.(`${oberverElement}[dialogmode="true"] input`) 
            ? mutation.target 
            : mutation.target.querySelector?.(`${oberverElement}[dialogmode="true"] input`);

        if (targetInput) {
            handleInputElement(targetInput);
            break; // Exit loop after finding the first matching element
        }
    }
});

observer.observe(parentElement, { childList: true, subtree: true });
console.log("Search MutationObserver started!");
