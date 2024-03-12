function () { 
  var regex = /mtm\.(AllElementsClick|AllLinksClick)/;
  if (MatomoTagManager.dataLayer.get("event").match(regex) &&
      MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.hasAttribute("aria-expanded")) {
    return MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.getAttribute("aria-expanded");
  } else {
    return null;
  }
}
