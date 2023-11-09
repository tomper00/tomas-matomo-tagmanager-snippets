# Tomas matomo tagmanager snippets
A repo that contains some Javascripts that will help you with custom TagManagement tasks for Matomo.

If you want more tools and better help with Matomo, get Digitalists Matomo SaaS we have even more tracking tools in place within our Matomo installations!

# customURL.js 
Will clean you urls for consisten Matomo Data.
- Make URLS lowercase
- Remove trailing slashes

**Eamples**  
|  Before |  -> | After  |
|----------|-------------|-----------|
|/my-url/ | -> |/my-url  |
|/My-url | -> |/my-url  |
|/my-url?random=123 | -> |/my-url  |
|/my-url?utm_campaign=my_campaign&random=123 | -> |/my-url?utm_campaign=my_campaign |



**Remove all unknows url parameters we will keep:**  
mtm_ & utm_  

In the beginning of the script there is an array where you can define the variables you want to allow
```
var keep = ["s","category"];
```
Normally you add search variables here and potentially other variables that you want Matomo to recieve.


# clickElemParentClass.js 
This script will return the class of the parent of the element from the clickElemet  
For example:  
```

<div id="parent" class="return this">
  <button>ClickElement</button>
</div>
```


# clickElemParentCustomAttribute.js 

This script will return the class of the parent of the element from the clickElemet
For example
```

<div id="parent" aria-expanded="return this">
  <button>ClickElement</button>
</div>  
```

# Add / remove cookie consent with Matomo Tag Manager
This is the 2 Custom HTML Tags to use:  
**cookieConsentGiven.html**  
**cookieConsentForget.html**  

Implement them using a trigger that checks for the consent cookie written from your CMP solution.  
For example if you have a cookie named cookieConsent that contains a text Analytics=true. 

## Create 2 variables cookieConsent & mtm_cookie_consent
You first crate a variable named **cookieConsent** of type cookie that reads the cookieConsent cookie.  
The trick here is to set a default value of this variable to notSet.  

Also create anothe variable named **mtm_cookie_consent** (reading the cookie mtm_cookie_consent)   
also with a default value of notSet. 

## Create a trigger setCookieConstent
In your trigger **setCookieConstent** you then check: 
**cookieConsent** contains Analytics=true  
&&  
**matomo_cookie_consent** == notSet  

## Create a tag cookieConsentGiven

Finally create a CustomHTMl tag named cookieConsentGiven (use the code inte file cookieConsentGiven.html)
and use the trigger above **setCookieConstent** 

## Create a trigger removeCookieConstent

You can also create a reverse trigger **removeCookieConstent**  
In your trigger **removeCookieConstent** you then check: 
**cookieConsent** does contains Analytics=true  
&&  
**matomo_cookie_consent** != notSet  

## Create a tag cookieConsentForget
Finally create a CustomHTMl tag named cookieConsentForget (use the code inte file cookieConsentForget.html)
and use the trigger above **removeCookieConstent** 

# customSearchTag.html

1. First make sure you are not getting search variables from URL with pageviews.  
2. Set up a trigger that detects Search
3. Set up variables that contains searchKeywork, searchCategory & searchCount (use Javascript if they are loaded dynamically)
4. Set up a Custom HTML Tag with my example code in customSearchTag.html 

**Optionally**: Disable std pageviews for serach page and just initiate the TagManager on the search page

