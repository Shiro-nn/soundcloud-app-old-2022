module.exports = {
    proxy: {
        default: [
            //'soundcloud-proxy.fydne.dev:666',
            'soundcloud-proxy.fydne.dev:3128'
        ],
        // use public proxies? This is not recommended for security reasons.
        usePublic: false
    },
    translations: {
        ru: { // ru, kk, ky, be
            proxy_available_not_found: 'Доступные прокси-серверы не найдены',
            proxy_work_not_found: 'Работающие прокси-серверы не найдены',
            proxy_connected: 'Подключен к прокси-серверу - [HIDDEN]',
        },
        en: {
            proxy_available_not_found: 'Available proxy servers not found',
            proxy_work_not_found: 'Working proxy servers not found',
            proxy_connected: 'Connected to proxy server - [HIDDEN]',
        },
        /*
        'iso code': {...},
        */
    }
};