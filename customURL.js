function () {
  var customURL = window.location.pathname;
  var customSearch = window.location.search;
  var customHash = window.location.hash;

  // Remove trailing slash and hash
  customURL = customURL.replace(/\/$/, "").replace(/#.*$/, "");

  // Force lowercase
  customURL = customURL.toLowerCase();
  customSearch = customSearch.toLowerCase();
  customHash = customHash.toLowerCase();

  // List of url params to keep (we will always keep utm_* & mtm_*)
  var keep = ["s"];

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
