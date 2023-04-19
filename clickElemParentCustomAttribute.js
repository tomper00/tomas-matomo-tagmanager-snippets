function () { 
  if (MatomoTagManager.dataLayer.get("event") === "mtm.AllElementsClick|mtm.AllLinksClick" &&
      MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.hasAttribute("aria-expanded")) {
    return MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.getAttribute("aria-expanded");
  } else {
    return null;
  }
}
