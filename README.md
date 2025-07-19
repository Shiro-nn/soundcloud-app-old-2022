# soundcloud‑app‑old‑2022 🎧📦

[![GitHub stars](https://img.shields.io/github/stars/Shiro-nn/soundcloud-app-old-2022?style=social)](https://github.com/Shiro-nn/soundcloud-app-old-2022/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Shiro-nn/soundcloud-app-old-2022?style=social)](https://github.com/Shiro-nn/soundcloud-app-old-2022/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Shiro-nn/soundcloud-app-old-2022)](https://github.com/Shiro-nn/soundcloud-app-old-2022/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Shiro-nn/soundcloud-app-old-2022)](https://github.com/Shiro-nn/soundcloud-app-old-2022/commits)
[![License](https://img.shields.io/badge/license-mixed-red)](LICENSE)
[![Status: Archived](https://img.shields.io/badge/status-archived-lightgrey.svg)](https://github.com/Shiro-nn/soundcloud-app-old-2022)

![Repo Stats](https://github-readme-stats.vercel.app/api/pin/?username=Shiro-nn\&repo=soundcloud-app-old-2022)

> **soundcloud‑app‑old‑2022** — архивная, неофициальная десктоп‑версия SoundCloud, написанная на Electron в 2022 году. Код *не поддерживается*, может быть нестабилен и содержать уязвимости. Используйте **только для ознакомления**.

---

## 📂 Состав репозитория

| Директория                       | Стек / язык                        | Назначение                                                                          |
| -------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| **`soundcloud-old`**             | Electron 23 + Node.js (MIT)        | Версия 0.9.5: тёмная тема, прокси, протокол `sc://`, базовые функции плеера.        |
| **`soundcloud-app`**             | Electron 21 + Node.js (Apache‑2.0) | Версия 0.8.11: Discord Rich Presence, авто‑обновление, расширенные горячие клавиши. |
| **`soundcloud-discord`**         | BetterDiscord плагин               | Панель управления плеером и Rich Presence прямо в Discord.                          |
| **`soundcloud-discord-app-fix`** | Electron wrapper                   | Исправление запуска Discord + SoundCloud‑плагина на Windows 11.                     |
| **`sc-server-proxy`**            | Express reverse‑proxy              | Мини‑HTTP(S) прокси для обхода блокировок треков.                                   |
| **`.builder`**                   | electron‑builder                   | Скрипты и конфиги сборки (NSIS, DMG, AppImage).                                     |

---

## ⚠️ Почему архив

* Проект был экспериментом 2022 года и больше не развивается.
* Зависимости устарели, безопасность не проверяется.
* SoundCloud может изменить API в любой момент → приложение перестанет работать.

**Не** используйте в продакшене и не отправляйте жалобы/PR, кроме критических баг‑фиксов.

---

## 🚀 Быстрый старт (локально)

```bash
# клон репозитория
$ git clone https://github.com/Shiro-nn/soundcloud-app-old-2022.git
$ cd soundcloud-app-old-2022

# выберите ветку/директорию
$ cd soundcloud-old   # или cd soundcloud-app

# установка зависимостей
$ npm install

# сборка дистрибутива
$ npm run build       # результат в dist/ или release-builds/

# тестовый запуск без сборки
$ npm start           # (только для soundcloud-app)
```

> Требуется **Node.js 18+** и **npm**. Сборочные скрипты используют *electron‑builder*.

---

## 🔧 Настройка прокси (опционально)

В `soundcloud-old/config.js` можно задать список SOCKS/HTTP‑прокси и отключить поиск публичных прокси. Рекомендуется выбирать серверы с геолокацией **Швейцария** для минимального риска блокировок.

---

## 🎮 Discord Rich Presence

* **soundcloud-app** автоматически публикует треки в Discord status.
* Для Discord клиента существует плагин: см. директорию **soundcloud-discord**. Скопируйте файлы в *BetterDiscord/plugins* и перезапустите Discord.

---

## 🛠️ Системные требования

* Windows 10/11, macOS 12+ или Linux (x64).
* Node.js ≥ 18
* (опционально) Git, Yarn.

---

## 🤝 Вклад

Репозиторий **заморожен**. Форкайте и экспериментируйте, но pull‑requests принимаются **только** для критических ошибок.

---

## ⚖️ Лицензии

* `soundcloud-old` — MIT
* остальные директории — Apache‑2.0

Код и иконки предоставляются «как есть», без каких‑либо гарантий.
