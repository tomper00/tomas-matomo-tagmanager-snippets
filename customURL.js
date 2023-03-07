function () { 

  var customURL = window.location.pathname;

   //List of url params to keep (we will always keep utm_* & mtm_*)
   var keep = ["s"];

  //Remove trailing slash
  customURL = customURL.replace(/\/$/, "");
  customSearch = window.location.search;

  //Force lowercase
  customURL = customURL.toLowerCase();
  var newQuery = "";
 
  //Add search again after removing other url params
  if(window.location.search != null) {
     customSearch = customSearch.toLowerCase();
     //Remove search
     customSearch = customSearch.replace("?","");
    
    customSearch.split("&").forEach(function(part) {  
      var separator = "&"; 
      var item = part.split("=");
      var par = decodeURIComponent(item[0]);
      console.log(par);
      var val = decodeURIComponent(item[1]);
      console.log(val);

      if(val == undefined || val == "undefined")
          val = "";
      //Check against campaign params
      if(par.startsWith("mtm_") || par.startsWith("utm_")) {
        if(val == undefined || val == "undefined")
         newQuery += separator + par;
        else
          newQuery += separator + par + "=" + val;
      }
    //Check against keep param list
    for(i=0;i<keep.length;i++) {
          if(par == keep[i] ) {
            if(val == undefined || val == "undefined")
               newQuery += separator + par;
             else
               newQuery += separator + par + "=" + val;            
          }
     }
    //End foreach
    });

    if(newQuery != "")
     customSearch = "?" + newQuery;

    customURL = customURL+newQuery;

  }

  return customURL; 

}