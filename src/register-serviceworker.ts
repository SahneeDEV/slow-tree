// Check that service workers are registered
if ('serviceWorker' in navigator) {
    if (process.env.SERVICE_WORKER === "true") {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('serviceworker.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    } else {
        console.log("Development mode active, ignoring service worker ...");
    }
}
