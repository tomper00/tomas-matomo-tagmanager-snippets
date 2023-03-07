function () { 
    if(MatomoTagManager.dataLayer.get("event").match("mtm.AllElementsClick|mtm.AllLinksClick") != null &&
    MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement != undefined) {
        return MatomoTagManager.dataLayer.get('mtm.clickElement').parentElement.className;
    }
    else return "";
}
