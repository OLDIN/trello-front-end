export const isMobileDevice = {
  Android() {
    return /Android/i.exec(navigator.userAgent);
  },
  BlackBerry() {
    return /BlackBerry/i.exec(navigator.userAgent);
  },
  iOS() {
    return /iPhone|iPad|iPod/i.exec(navigator.userAgent);
  },
  Opera() {
    return /Opera Mini/i.exec(navigator.userAgent);
  },
  Windows() {
    return /IEMobile/i.exec(navigator.userAgent);
  },
  any() {
    return (
      isMobileDevice.Android() ||
      isMobileDevice.BlackBerry() ||
      isMobileDevice.iOS() ||
      isMobileDevice.Opera() ||
      isMobileDevice.Windows()
    );
  },
};
