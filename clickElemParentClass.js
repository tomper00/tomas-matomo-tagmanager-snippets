function () {
  var event = MatomoTagManager.dataLayer.get("event");
  var clickElement = MatomoTagManager.dataLayer.get("mtm.clickElement");

  if (typeof clickElement === "undefined") {
    return "";
  }

  if (event && (event.indexOf("mtm.AllElementsClick") !== -1 || event.indexOf("mtm.AllLinksClick") !== -1) && typeof clickElement.parentElement !== "undefined") {
    var parentElement = clickElement.parentElement;
    var parentClass = parentElement.getAttribute("data-parent-class");
    if (parentClass) {
      return parentClass;
    }
  }

  return "";
}
