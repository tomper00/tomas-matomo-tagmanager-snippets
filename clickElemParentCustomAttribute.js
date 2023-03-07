function () { 
    if(MatomoTagManager.dataLayer.get("event").match("mtm.AllElementsClick|mtm.AllLinksClick") != null &&
    MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.hasAttribute("aria-expanded")) {
        return MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.getAttribute("aria-expanded");
    }
    else return "";
}
