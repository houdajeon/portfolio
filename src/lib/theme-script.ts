// Runs in <head> before the first paint:
// - applies the saved theme (dark by default), so a visitor who chose light never sees a dark flash
// - adds `js` to <html>, which enables the scroll-reveal styles only when JavaScript is running
export const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');r.classList.toggle('dark',t!=='light');}catch(e){}})();`;
