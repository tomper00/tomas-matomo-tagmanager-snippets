function () {
  var customURL = window.location.pathname;
  var customSearch = window.location.search;
  var customHash = window.location.hash;

  
  // List of url params to keep (we will always keep utm_* & mtm_*) 
  // For example to track Google ads you need to add gclid 
  // var keep = ["s","q","aaa"]; 
  // If you want to allow Fabebook or Google params you need to add fbclid & gclid
  var keep = ["s","q"];
  
  // Remove trailing slash and hash
  customURL = customURL.replace(/\/$/, "").replace(/#.*$/, "");

  // Force lowercase
  customURL = customURL.toLowerCase();
  customSearch = customSearch.toLowerCase();
  customHash = customHash.toLowerCase();


  // Create a new query string with only the specified parameters
  var newQueryParams = [];
  (customSearch + customHash).slice(1).split('&').forEach(function(part) {
    var item = part.split('=');
    var paramKey = decodeURIComponent(item[0]);
    var paramValue = decodeURIComponent(item[1] || '');
    if (paramKey.startsWith('mtm_') || paramKey.startsWith('utm_') || keep.includes(paramKey)) {
      newQueryParams.push(paramKey + '=' + paramValue);
    }
  });

  // Rebuild the URL with the cleaned path and query parameters
  var cleanedURL = customURL;
  if (newQueryParams.length > 0) {
    cleanedURL += '?' + newQueryParams.join('&');
  }

  return cleanedURL;
}
