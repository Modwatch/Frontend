self.addEventListener("install", event => {
  var htmlRequest = new Request("offline.html");
  var stylesRequests = new Request("dist/index.css");
  var faviconRequests = new Request("favicon.ico");
  var backgroundRequest = new Request("images/congruent_outline.svg");
  event.waitUntil(
    Promise.all([
      putInCache({
        request: htmlRequest,
        caches
      }),
      putInCache({
        request: stylesRequests,
        caches
      }),
      putInCache({
        request: faviconRequests,
        caches
      }),
      putInCache({
        request: backgroundRequest,
        caches
      })
    ])
  );
});

function putInCache({
  request,
  caches,
  cacheName = "offline"
}) {
  return fetch(request).then(response =>
    caches.open(cacheName).then(cache =>
      cache.put(request, response)
    )
  );
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method === "GET") {
    if(request.headers.get("accept").includes("text/html")) {
      event.respondWith(
        returnRequestOrOffline({
          request,
          filename: "offline.html",
          caches
        })
      );
    } else if(request.headers.get("accept").includes("text/css")) {
      event.respondWith(
        returnRequestOrOffline({
          request,
          filename: "dist/index.css",
          caches
        })
      );
    } else if(request.url.includes(".svg")) {
      event.respondWith(
        returnRequestOrOffline({
          request,
          filename: "images/congruent_outline.svg",
          caches
        })
      );
    } else if(request.url.includes(".ico")) {
      event.respondWith(
        returnRequestOrOffline({
          request,
          filename: "favicon.ico",
          caches
        })
      );
    }
  }
});

function returnRequestOrOffline({
  request,
  filename,
  caches,
  cacheName = "offline"
}) {
  return fetch(request).catch(error => {
    console.error(
      `[onfetch] Failed. Serving cached ${cacheName} fallback for ${request.url}`, error
    );
    return caches.open(cacheName).then(cache =>
      cache.match(filename)
    );
  })
}
