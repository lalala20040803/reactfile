const CACHE_NAME = 'v1';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/static/js/bundle.js', // 你的构建路径，确保正确
    '/static/css/main.css', // 你的构建路径，确保正确
    // 其他需要缓存的资源
];

// 安装服务工作线程
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('缓存资源');
            return cache.addAll(CACHE_ASSETS);
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// 更新服务工作线程
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
