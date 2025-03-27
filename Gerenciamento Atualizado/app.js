// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

// Instalação do PWA
let deferredPrompt;
const installButton = document.createElement('button');
installButton.className = 'btn pwa-install-btn';
installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostra o botão de instalação
    document.querySelector('header').appendChild(installButton);
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação');
            } else {
                console.log('Usuário recusou a instalação');
            }
            deferredPrompt = null;
        });
    });
});

// Verifica se está rodando como PWA
window.addEventListener('appinstalled', () => {
    console.log('PWA instalado com sucesso');
    installButton.style.display = 'none';
});

// Offline functionality
window.addEventListener('online', () => {
    console.log('Você está online');
    // Sincronizar dados se necessário
});

window.addEventListener('offline', () => {
    console.log('Você está offline');
    alert('Você está offline. Algumas funcionalidades podem estar limitadas.');
});

const CACHE_NAME = 'veiculos-pwa-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/app.js',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

