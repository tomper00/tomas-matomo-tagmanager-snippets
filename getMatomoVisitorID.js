function () {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf('_pk_id') === 0) {
      const cookieValue = cookie.substring('_pk_id'.length + 1, cookie.length);
      const valueParts = cookieValue.split('=');
      if (valueParts.length !== 2) {
        return '';
      }
      const idParts = valueParts[1].split('.');
      if (idParts.length < 1) {
        return '';
      }
      return idParts[0];
    }
  }
  return '';
}
