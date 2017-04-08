
var CacheName = 'Pickr';

self.addEventListener('install', function(e) {
	e.waitUntil( caches.open(CacheName).then(function(cache) {
		return cache.addAll([
			/*'index.html',
			'index.html?homescreen=1',
			'favicon.ico',
			'?homescreen=1',
			'styles.css',
			'animations.css',
			'assets/images/icon.png',
			'assets/images/lives_have.png',
			'assets/images/lives_heart_inverted.png',
			'assets/images/lives_inverted.png',
			'assets/images/lives_lost.png',
			'assets/images/menuBtn.png',
			'assets/images/restartBtn.png',
			'assets/sounds/game_over.mp3',
			'assets/sounds/game_over.ogg',
			'assets/sounds/nope.mp3',
			'assets/sounds/nope.ogg',
			'assets/sounds/nope.wav',
			'assets/sounds/nope3.mp3',
			'assets/sounds/nope3.ogg',
			'assets/sounds/pop.mp3',
			'assets/sounds/pop.ogg',
			'assets/sounds/pop.wav',
			'assets/sounds/pop2.mp3',
			'assets/sounds/pop2.ogg',
			'assets/sounds/pop2.wav',
			'assets/sounds/pop4.mp3',
			'assets/sounds/pop4.ogg',
			'service-worker.js',*/
		]);
	}));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});