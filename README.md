# tomas-matomo-tagmanager-snippets
A repo that contains some Javascripts that will help you with custom TagManagement tasks

If you want more tools and better help with Matomo, get Digitalists Matomo SaaS we have even more tracking tools in place within our Matomo installations!

# customURL.js 
Will clean you urls for consisten Matomo Data.
- Make URLS lowercase
- Remove trailing slashes

**Remove all unknows url parameters we will keep:**
mtm_ & utm_
You can also specify a list of allowed URL parameters like s or category in the script 

# clickElemParentClass.js 
This script will return the class of the parent of the element from the clickElemet
For example
<div id="parent" class="return this">
  <button>ClickElement</button>
</div>  

# clickElemParentCustomAttribute.js 

This script will return the class of the parent of the element from the clickElemet
For example
<div id="parent" aria-expanded="return this">
  <button>ClickElement</button>
</div>  

