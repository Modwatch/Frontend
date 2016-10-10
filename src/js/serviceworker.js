// if ("serviceWorker" in navigator) {
// 	navigator.serviceWorker.register("/sw.js");
// }
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations().then(registrations => {
	 for(let registration of registrations) {
	  registration.unregister()
	} })
}
