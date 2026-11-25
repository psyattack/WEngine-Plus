/**
 * WEngine-Plus runtime overlay.
 *
 * Loaded synchronously by the loader line appended to scripts.js
 * (document.write('<script src="scripts/wengine-plus.js"><\/script>')),
 * i.e. while the document is still parsing and before AngularJS
 * auto-bootstraps on DOMContentLoaded. Everything here is therefore
 * registered before the module config/run phase.
 *
 * The blocks below are moved verbatim from scripts.js; keep them verbatim.
 * Source line ranges were recorded during the migration and are no longer tracked; the overlay
 * contract is documented in docs/ARCHITECTURE.md.
 */

  (window._helperResolutionTagsList = [
    "Standard Definition", "1280 x 720", "1366 x 768", "1600 x 900", "1920 x 1080",
    "2560 x 1440", "3840 x 2160", "Ultrawide Standard Definition", "Ultrawide 2560 x 1080",
    "Ultrawide 3440 x 1440", "Dual Standard Definition", "Dual 3840 x 1080", "Dual 5120 x 1440",
    "Dual 7680 x 2160", "Triple Standard Definition", "Triple 4096 x 768", "Triple 5760 x 1080",
    "Triple 7680 x 1440", "Triple 11520 x 2160", "Portrait Standard Definition",
    "Portrait 720 x 1280", "Portrait 1080 x 1920", "Portrait 1440 x 2560", "Portrait 2160 x 3840",
    "Dynamic resolution", "Other resolution", "2560 x 1080", "3440 x 1440", "5120 x 2160",
    "3840 x 1080", "5120 x 1440", "6880 x 1440", "7680 x 2160", "5760 x 1080", "7680 x 1440",
    "10320 x 1440", "720 x 1280", "768 x 1366", "900 x 1600", "1080 x 1920", "1440 x 2560",
    "2160 x 3840", "1080 x 2560", "1440 x 3440", "2160 x 5120"
  ]),
  // Shared secret for the local helper API. The installer replaces the
  // placeholder with a random per-install value before writing this file.
  (window.WEP_API_TOKEN = "__WEP_TOKEN__"),
  // Every helper request carries the token; the daemon rejects requests that a
  // cross-site page could forge (forms, <img>, navigations).
  (function () {
    var nativeFetch = window.fetch;
    if (!nativeFetch) return;
    window.fetch = function (input, init) {
      if (typeof input === "string" && input.indexOf("http://127.0.0.1:43196") === 0) {
        init = init || {};
        var headers = new Headers(init.headers || {});
        headers.set("X-Wengine-Client", window.WEP_API_TOKEN || "__WEP_TOKEN__");
        init.headers = headers;
      }
      return nativeFetch.call(this, input, init);
    };
  })(),
  // WEngine-Plus UI translations. These are merged on top of the Wallpaper
  // Engine locale dictionaries by the localeLoader factory above, so the
  // ui_wep_* namespace never replaces a built-in Wallpaper Engine key. The
  // en-us dictionary doubles as fallback for languages without a WEP entry.
  (window.WEP_LOCALES = {
    "en-us": {
      "ui_wep_update_check_tooltip": "Click to check (Shift+Click to test update)",
      "ui_wep_update_checking": "Checking updates...",
      "ui_wep_update_latest": "Latest version",
      "ui_wep_update_available": "New version {{version}} available",
      "ui_wep_update_btn": "Update",
      "ui_wep_update_downloading": "Downloading... {{progress}}%",
      "ui_wep_update_installing": "Updating...",
      "ui_wep_update_failed": "Update failed",
      "ui_wep_update_err_daemon": "Failed to connect to helper daemon",
      "ui_wep_update_err_check": "Check failed",
      "ui_wep_update_err_download": "Failed to start update download",
      "ui_wep_update_err_apply": "Failed to apply update",
      "ui_wep_update_err_apply_prefix": "Apply error",
      "ui_wep_filter_category": "Category",
      "ui_wep_filter_assets_scripts": "Assets & Scripts",
      "ui_wep_filter_active": "Active",
      "ui_wep_filter_asset_type": "Asset Type",
      "ui_wep_filter_asset_genre": "Asset Genre",
      "ui_wep_filter_script_type": "Script Type",
      "ui_wep_filter_special": "Special",
      "ui_wep_filter_incompatible": "Incompatible Items",
      "ui_wep_filter_incompatible_tooltip": "Some items are not possible to include in the game. You can still find them if you select this box.",
      "ui_wep_filter_misc": "Miscellaneous",
      "ui_wep_filter_genres": "Genres",
      "ui_wep_filter_category_asset": "Asset",
      "ui_wep_filter_any": "Any",
      "ui_wep_age_everyone": "Everyone",
      "ui_wep_age_questionable": "Questionable",
      "ui_wep_age_mature": "Mature",
      "ui_wep_res_sd": "SD",
      "ui_wep_res_uw_sd": "UW SD",
      "ui_wep_res_uw_1080p": "UW 1080p",
      "ui_wep_res_uw_1440p": "UW 1440p",
      "ui_wep_res_dual_sd": "Dual SD",
      "ui_wep_res_dual_1080p": "Dual 1080p",
      "ui_wep_res_dual_1440p": "Dual 1440p",
      "ui_wep_res_dual_4k": "Dual 4K",
      "ui_wep_res_triple_sd": "Triple SD",
      "ui_wep_res_triple_768p": "Triple 768p",
      "ui_wep_res_triple_1080p": "Triple 1080p",
      "ui_wep_res_triple_1440p": "Triple 1440p",
      "ui_wep_res_triple_4k": "Triple 4K",
      "ui_wep_res_portrait_sd": "Portrait SD",
      "ui_wep_res_portrait_720p": "Portrait 720p",
      "ui_wep_res_portrait_1080p": "Portrait 1080p",
      "ui_wep_res_portrait_1440p": "Portrait 1440p",
      "ui_wep_res_portrait_4k": "Portrait 4K",
      "ui_wep_res_dynamic": "Dynamic",
      "ui_wep_res_other": "Other",
      "ui_wep_asset_type_model": "Model",
      "ui_wep_asset_type_sprite": "Sprite",
      "ui_wep_asset_type_effect": "Effect",
      "ui_wep_asset_type_scripted_layer": "Scripted Layer",
      "ui_wep_script_boolean": "Boolean",
      "ui_wep_script_number": "Number",
      "ui_wep_script_vec2": "Vec2",
      "ui_wep_script_vec3": "Vec3",
      "ui_wep_script_vec4": "Vec4",
      "ui_wep_script_string": "String",
      "ui_wep_script_no_animation": "No Animation",
      "ui_wep_script_oversized": "Oversized",
      "ui_wep_sort_install_date": "Install Date",
      "ui_wep_sort_posted_date": "Posted Date",
      "ui_wep_sort_updated_date": "Updated Date",
      "ui_wep_sort_popular_3months": "Most Popular (3 Months)",
      "ui_wep_sort_popular_6months": "Most Popular (6 Months)",
      "ui_wep_sort_recently_updated": "Recently Updated",
      "ui_wep_sort_subscribers": "Total Unique Subscribers",
      "ui_wep_plugin_settings": "Plugin Settings",
      "ui_wep_plugins_loading_notice": "Plugins are loading, please wait... Download and Extract will be available when ready.",
      "ui_wep_steam_web_session": "Steam Web Session",
      "ui_wep_btn_login": "Login",
      "ui_wep_status_authorized": "Authorized",
      "ui_wep_status_not_logged_in": "Not Logged In",
      "ui_wep_login_for_adult": "Log in to access 18+ content",
      "ui_wep_steam_user": "Steam User",
      "ui_wep_unknown": "Unknown",
      "ui_wep_download_accounts": "Workshop Download Accounts",
      "ui_wep_btn_add_account": "Add Account",
      "ui_wep_accounts_hint": "Select which Steam account uses to download files.",
      "ui_wep_account_default": "Default",
      "ui_wep_account_protected": "Protected",
      "ui_wep_plugins_init_failed": "Failed to initialize plugin components: {{error}}",
      "ui_wep_downloading_runtime": "Downloading runtime:",
      "ui_wep_downloading_plugins": "Downloading plugin components:",
      "ui_wep_initializing_plugins": "Initializing plugin components...",
      "ui_wep_service_launching": "Launching the WEngine Helper service...",
      "ui_wep_service_failed": "The WEngine Helper service could not be started",
      "ui_wep_service_logged_in": "The service has been launched. You have successfully logged into Steam.{{name}}",
      "ui_wep_service_login_wait": "The service has been launched. Log in to Steam...",
      "ui_wep_service_started": "The WEngine Helper service has been started",
      "ui_wep_btn_download": "Download",
      "ui_wep_btn_downloaded": "Downloaded",
      "ui_wep_btn_extract": "Extract",
      "ui_wep_btn_extracted": "Extracted",
      "ui_wep_btn_delete": "Delete",
      "ui_wep_loading_plugins": "Loading plugins...",
      "ui_wep_extracting": "Extracting...",
      "ui_wep_selected_count": "Selected: {{count}}",
      "ui_wep_extract_selected": "Extract Selected Wallpapers",
      "ui_wep_delete_selected_disk": "Delete Selected from Disk",
      "ui_wep_details_metadata": "Workshop Metadata",
      "ui_wep_details_size": "Size:",
      "ui_wep_details_posted": "Posted:",
      "ui_wep_details_updated": "Updated:",
      "ui_wep_delete_wallpaper": "Delete Wallpaper",
      "ui_wep_delete_wallpapers": "Delete Wallpapers",
      "ui_wep_delete_confirm_one": "Are you sure you want to delete this wallpaper from your system?",
      "ui_wep_delete_confirm_many": "Are you sure you want to delete {{count}} selected wallpapers from your system?",
      "ui_wep_delete_failed": "Delete failed",
      "ui_wep_delete_request_failed": "Delete request failed",
      "ui_wep_delete_partial": "Could not delete {{count}} wallpaper(s). See the helper log for details.",
      "ui_wep_active_wallpaper": "Active Wallpaper",
      "ui_wep_active_wallpapers": "Active Wallpapers",
      "ui_wep_active_delete_one": "To delete active wallpaper, please apply another wallpaper first.",
      "ui_wep_active_delete_many": "To delete active wallpapers, please apply other wallpapers first.",
      "ui_wep_unpacking_many": "Unpacking {{count}} wallpapers...",
      "ui_wep_unpacking_one": "Unpacking \"{{title}}\"...",
      "ui_wep_unpacking_one_fallback": "Unpacking wallpaper...",
      "ui_wep_starting_extraction": "Starting extraction...",
      "ui_wep_unpack_errors": "Unpacking finished with some errors",
      "ui_wep_unpack_progress": "Unpacked {{completed}} of {{total}}...",
      "ui_wep_unpack_all_success": "All {{count}} wallpapers unpacked successfully!",
      "ui_wep_unpack_failed": "Unpacking failed: {{error}}",
      "ui_wep_unpack_success": "Unpacked successfully: \"{{title}}\"",
      "ui_wep_unpack_success_plain": "Unpacked successfully!",
      "ui_wep_unknown_error": "Unknown error",
      "ui_wep_wallpaper_number": "wallpaper #{{number}}",
      "ui_wep_steam_login_title": "Steam Workshop Login",
      "ui_wep_steam_connecting": "Connecting to Steam...",
      "ui_wep_steam_init_session": "Initializing session via local background worker",
      "ui_wep_logged_in_as": "Logged in as",
      "ui_wep_steam_adult_unlocked": "Adult content is unlocked.",
      "ui_wep_btn_switch_logout": "Switch / Log Out",
      "ui_wep_mode_qr": "QR Code",
      "ui_wep_mode_password": "Username & Password",
      "ui_wep_mode_cookie": "Cookie",
      "ui_wep_mode_system": "System Account",
      "ui_wep_system_login_hint": "Log in using system Steam account without entering credentials.",
      "ui_wep_btn_login_system": "Log In with System Account",
      "ui_wep_qr_scan_prefix": "Scan with your",
      "ui_wep_qr_scan_suffix": "to authorize:",
      "ui_wep_qr_waiting": "Waiting for Steam App confirmation...",
      "ui_wep_cookie_hint_prefix": "Paste your",
      "ui_wep_cookie_hint_suffix": "cookie value from browser. SteamID is auto-detected.",
      "ui_wep_cookie_value_label": "steamLoginSecure Cookie Value",
      "ui_wep_cookie_placeholder": "76561198...%7C%7C... or cookie value",
      "ui_wep_steamid_label": "SteamID64 (Optional if inside cookie)",
      "ui_wep_btn_login_cookie": "Log In with Cookie",
      "ui_wep_btn_validating_cookie": "Validating Cookie...",
      "ui_wep_username": "Username:",
      "ui_wep_password": "Password:",
      "ui_wep_username_placeholder": "Username",
      "ui_wep_password_placeholder": "Password",
      "ui_wep_btn_sign_in": "Sign In",
      "ui_wep_f2p_hint": "F2P accounts are supported.",
      "ui_wep_steam_success": "Successfully logged in!",
      "ui_wep_welcome": "Welcome,",
      "ui_wep_auth_error": "Authentication Error",
      "ui_wep_btn_try_again": "Try Again",
      "ui_wep_session_saved": "Session saved locally",
      "ui_wep_err_cookie_required": "Please enter steamLoginSecure cookie",
      "ui_wep_err_steamid_detect": "Could not detect 17-digit SteamID from cookie. Please enter SteamID64 manually.",
      "ui_wep_err_cookie_login": "Cookie login failed",
      "ui_wep_err_credentials_required": "Please enter username and password.",
      "ui_wep_err_login_failed": "Login failed. Check your credentials.",
      "ui_wep_err_connection": "Connection error",
      "ui_wep_err_worker_daemon": "Failed to connect to worker daemon",
      "ui_wep_err_auth_failed": "Authentication failed",
      "ui_wep_err_system_login": "Failed to login with system account.",
      "ui_wep_err_logout": "Failed to log out",
      "ui_wep_system_account_name": "System Steam Account",
      "ui_wep_add_account_title": "Add Steam Download Account",
      "ui_wep_generating_qr": "Generating authorization QR code...",
      "ui_wep_scan_mobile": "Scan with Steam Mobile App:",
      "ui_wep_waiting_confirmation": "Waiting for confirmation...",
      "ui_wep_account_added_prefix": "Account",
      "ui_wep_account_added_suffix": "added!",
      "ui_wep_manual_hint": "Enter Steam account credentials for downloading.",
      "ui_wep_err_steam_username": "Please enter Steam username",
      "ui_wep_err_worker_not_running": "Worker is not running",
      "ui_wep_tag_3d": "3D",
      "ui_wep_tag_puppet_warp": "Puppet Warp",
      "ui_wep_tag_hdr": "HDR",
      "ui_wep_tag_media_integration": "Media Integration",
      "ui_wep_tag_user_shortcut": "User Shortcut",
      "ui_wep_tag_video_texture": "Video Texture",
    },
    "ru-ru": {
      "ui_wep_update_check_tooltip": "Нажмите для проверки (Shift+клик — тест обновления)",
      "ui_wep_update_checking": "Проверка обновлений...",
      "ui_wep_update_latest": "Последняя версия",
      "ui_wep_update_available": "Доступна новая версия {{version}}",
      "ui_wep_update_btn": "Обновить",
      "ui_wep_update_downloading": "Загрузка... {{progress}}%",
      "ui_wep_update_installing": "Обновление...",
      "ui_wep_update_failed": "Ошибка обновления",
      "ui_wep_update_err_daemon": "Не удалось подключиться к службе WEngine Helper",
      "ui_wep_update_err_check": "Ошибка проверки",
      "ui_wep_update_err_download": "Не удалось начать загрузку обновления",
      "ui_wep_update_err_apply": "Не удалось применить обновление",
      "ui_wep_update_err_apply_prefix": "Ошибка применения",
      "ui_wep_filter_category": "Категория",
      "ui_wep_filter_assets_scripts": "Ресурсы и скрипты",
      "ui_wep_filter_active": "Активно",
      "ui_wep_filter_asset_type": "Тип ресурса",
      "ui_wep_filter_asset_genre": "Жанр ресурса",
      "ui_wep_filter_script_type": "Тип скрипта",
      "ui_wep_filter_special": "Особые",
      "ui_wep_filter_incompatible": "Несовместимые элементы",
      "ui_wep_filter_incompatible_tooltip": "Некоторые элементы невозможно добавить в игру. Их можно найти, если включить этот флажок.",
      "ui_wep_filter_misc": "Прочее",
      "ui_wep_filter_genres": "Жанры",
      "ui_wep_filter_category_asset": "Ресурс",
      "ui_wep_filter_any": "Любой",
      "ui_wep_age_everyone": "Для всех",
      "ui_wep_age_questionable": "Сомнительное",
      "ui_wep_age_mature": "Для взрослых",
      "ui_wep_res_sd": "SD",
      "ui_wep_res_uw_sd": "Ультраширокий SD",
      "ui_wep_res_uw_1080p": "Ультраширокий 1080p",
      "ui_wep_res_uw_1440p": "Ультраширокий 1440p",
      "ui_wep_res_dual_sd": "Двойной SD",
      "ui_wep_res_dual_1080p": "Двойной 1080p",
      "ui_wep_res_dual_1440p": "Двойной 1440p",
      "ui_wep_res_dual_4k": "Двойной 4K",
      "ui_wep_res_triple_sd": "Тройной SD",
      "ui_wep_res_triple_768p": "Тройной 768p",
      "ui_wep_res_triple_1080p": "Тройной 1080p",
      "ui_wep_res_triple_1440p": "Тройной 1440p",
      "ui_wep_res_triple_4k": "Тройной 4K",
      "ui_wep_res_portrait_sd": "Портретный SD",
      "ui_wep_res_portrait_720p": "Портретный 720p",
      "ui_wep_res_portrait_1080p": "Портретный 1080p",
      "ui_wep_res_portrait_1440p": "Портретный 1440p",
      "ui_wep_res_portrait_4k": "Портретный 4K",
      "ui_wep_res_dynamic": "Динамическое",
      "ui_wep_res_other": "Другое",
      "ui_wep_asset_type_model": "Модель",
      "ui_wep_asset_type_sprite": "Спрайт",
      "ui_wep_asset_type_effect": "Эффект",
      "ui_wep_asset_type_scripted_layer": "Скриптовый слой",
      "ui_wep_script_boolean": "Логический",
      "ui_wep_script_number": "Число",
      "ui_wep_script_vec2": "Vec2",
      "ui_wep_script_vec3": "Vec3",
      "ui_wep_script_vec4": "Vec4",
      "ui_wep_script_string": "Строка",
      "ui_wep_script_no_animation": "Без анимации",
      "ui_wep_script_oversized": "Увеличенный",
      "ui_wep_sort_install_date": "Дата установки",
      "ui_wep_sort_posted_date": "Дата публикации",
      "ui_wep_sort_updated_date": "Дата обновления",
      "ui_wep_sort_popular_3months": "Популярные (3 месяца)",
      "ui_wep_sort_popular_6months": "Популярные (6 месяцев)",
      "ui_wep_sort_recently_updated": "Недавно обновлённые",
      "ui_wep_sort_subscribers": "Всего уникальных подписчиков",
      "ui_wep_plugin_settings": "Настройки плагинов",
      "ui_wep_plugins_loading_notice": "Плагины загружаются, подождите... Скачивание и распаковка станут доступны после загрузки.",
      "ui_wep_steam_web_session": "Веб-сессия Steam",
      "ui_wep_btn_login": "Войти",
      "ui_wep_status_authorized": "Авторизован",
      "ui_wep_status_not_logged_in": "Вход не выполнен",
      "ui_wep_login_for_adult": "Войдите, чтобы получить доступ к контенту 18+",
      "ui_wep_steam_user": "Пользователь Steam",
      "ui_wep_unknown": "Неизвестно",
      "ui_wep_download_accounts": "Аккаунты для скачивания из Мастерской",
      "ui_wep_btn_add_account": "Добавить аккаунт",
      "ui_wep_accounts_hint": "Выберите аккаунт Steam, который будет использоваться для скачивания файлов.",
      "ui_wep_account_default": "По умолчанию",
      "ui_wep_account_protected": "Защищён",
      "ui_wep_plugins_init_failed": "Не удалось инициализировать компоненты плагинов: {{error}}",
      "ui_wep_downloading_runtime": "Загрузка среды выполнения:",
      "ui_wep_downloading_plugins": "Загрузка компонентов плагинов:",
      "ui_wep_initializing_plugins": "Инициализация компонентов плагинов...",
      "ui_wep_service_launching": "Запуск службы WEngine Helper...",
      "ui_wep_service_failed": "Не удалось запустить службу WEngine Helper",
      "ui_wep_service_logged_in": "Служба запущена. Вы успешно вошли в Steam.{{name}}",
      "ui_wep_service_login_wait": "Служба запущена. Выполните вход в Steam...",
      "ui_wep_service_started": "Служба WEngine Helper запущена",
      "ui_wep_btn_download": "Скачать",
      "ui_wep_btn_downloaded": "Скачано",
      "ui_wep_btn_extract": "Распаковать",
      "ui_wep_btn_extracted": "Распаковано",
      "ui_wep_btn_delete": "Удалить",
      "ui_wep_loading_plugins": "Загрузка плагинов...",
      "ui_wep_extracting": "Распаковка...",
      "ui_wep_selected_count": "Выбрано: {{count}}",
      "ui_wep_extract_selected": "Распаковать выбранные обои",
      "ui_wep_delete_selected_disk": "Удалить выбранные с диска",
      "ui_wep_details_metadata": "Метаданные Мастерской",
      "ui_wep_details_size": "Размер:",
      "ui_wep_details_posted": "Опубликовано:",
      "ui_wep_details_updated": "Обновлено:",
      "ui_wep_delete_wallpaper": "Удалить обои",
      "ui_wep_delete_wallpapers": "Удалить обои",
      "ui_wep_delete_confirm_one": "Удалить эти обои с компьютера?",
      "ui_wep_delete_confirm_many": "Удалить с компьютера выбранные обои ({{count}} шт.)?",
      "ui_wep_delete_failed": "Ошибка удаления",
      "ui_wep_delete_request_failed": "Запрос на удаление не выполнен",
      "ui_wep_delete_partial": "Не удалось удалить обои ({{count}} шт.). Подробности в журнале службы.",
      "ui_wep_active_wallpaper": "Активные обои",
      "ui_wep_active_wallpapers": "Активные обои",
      "ui_wep_active_delete_one": "Чтобы удалить активные обои, сначала примените другие обои.",
      "ui_wep_active_delete_many": "Чтобы удалить активные обои, сначала примените другие обои.",
      "ui_wep_unpacking_many": "Распаковка обоев ({{count}} шт.)...",
      "ui_wep_unpacking_one": "Распаковка «{{title}}»...",
      "ui_wep_unpacking_one_fallback": "Распаковка обоев...",
      "ui_wep_starting_extraction": "Начало распаковки...",
      "ui_wep_unpack_errors": "Распаковка завершена с ошибками",
      "ui_wep_unpack_progress": "Распаковано {{completed}} из {{total}}...",
      "ui_wep_unpack_all_success": "Все обои ({{count}} шт.) успешно распакованы!",
      "ui_wep_unpack_failed": "Ошибка распаковки: {{error}}",
      "ui_wep_unpack_success": "Успешно распаковано: «{{title}}»",
      "ui_wep_unpack_success_plain": "Успешно распаковано!",
      "ui_wep_unknown_error": "Неизвестная ошибка",
      "ui_wep_wallpaper_number": "обои №{{number}}",
      "ui_wep_steam_login_title": "Вход в Мастерскую Steam",
      "ui_wep_steam_connecting": "Подключение к Steam...",
      "ui_wep_steam_init_session": "Инициализация сеанса через локальную службу",
      "ui_wep_logged_in_as": "Вы вошли как",
      "ui_wep_steam_adult_unlocked": "Контент 18+ разблокирован.",
      "ui_wep_btn_switch_logout": "Сменить / Выйти",
      "ui_wep_mode_qr": "QR-код",
      "ui_wep_mode_password": "Логин и пароль",
      "ui_wep_mode_cookie": "Cookie",
      "ui_wep_mode_system": "Системный аккаунт",
      "ui_wep_system_login_hint": "Вход через системный аккаунт Steam без ввода данных.",
      "ui_wep_btn_login_system": "Войти через системный аккаунт",
      "ui_wep_qr_scan_prefix": "Отсканируйте код в приложении",
      "ui_wep_qr_scan_suffix": "для авторизации:",
      "ui_wep_qr_waiting": "Ожидание подтверждения в приложении Steam...",
      "ui_wep_cookie_hint_prefix": "Вставьте значение cookie",
      "ui_wep_cookie_hint_suffix": "из браузера. SteamID определяется автоматически.",
      "ui_wep_cookie_value_label": "Значение cookie steamLoginSecure",
      "ui_wep_cookie_placeholder": "76561198...%7C%7C... или значение cookie",
      "ui_wep_steamid_label": "SteamID64 (необязательно, если есть в cookie)",
      "ui_wep_btn_login_cookie": "Войти с cookie",
      "ui_wep_btn_validating_cookie": "Проверка cookie...",
      "ui_wep_username": "Имя пользователя:",
      "ui_wep_password": "Пароль:",
      "ui_wep_username_placeholder": "Имя пользователя",
      "ui_wep_password_placeholder": "Пароль",
      "ui_wep_btn_sign_in": "Войти",
      "ui_wep_f2p_hint": "Поддерживаются F2P-аккаунты.",
      "ui_wep_steam_success": "Вход выполнен!",
      "ui_wep_welcome": "Добро пожаловать,",
      "ui_wep_auth_error": "Ошибка авторизации",
      "ui_wep_btn_try_again": "Попробовать снова",
      "ui_wep_session_saved": "Сеанс сохранён локально",
      "ui_wep_err_cookie_required": "Введите cookie steamLoginSecure",
      "ui_wep_err_steamid_detect": "Не удалось определить 17-значный SteamID из cookie. Введите SteamID64 вручную.",
      "ui_wep_err_cookie_login": "Не удалось войти с cookie",
      "ui_wep_err_credentials_required": "Введите имя пользователя и пароль.",
      "ui_wep_err_login_failed": "Не удалось войти. Проверьте имя пользователя и пароль.",
      "ui_wep_err_connection": "Ошибка подключения",
      "ui_wep_err_worker_daemon": "Не удалось подключиться к службе",
      "ui_wep_err_auth_failed": "Ошибка авторизации",
      "ui_wep_err_system_login": "Не удалось войти через системный аккаунт.",
      "ui_wep_err_logout": "Не удалось выйти",
      "ui_wep_system_account_name": "Системный аккаунт Steam",
      "ui_wep_add_account_title": "Добавить аккаунт Steam для скачивания",
      "ui_wep_generating_qr": "Создание QR-кода для авторизации...",
      "ui_wep_scan_mobile": "Отсканируйте в приложении Steam Mobile:",
      "ui_wep_waiting_confirmation": "Ожидание подтверждения...",
      "ui_wep_account_added_prefix": "Аккаунт",
      "ui_wep_account_added_suffix": "добавлен!",
      "ui_wep_manual_hint": "Введите данные аккаунта Steam для скачивания.",
      "ui_wep_err_steam_username": "Введите имя пользователя Steam",
      "ui_wep_err_worker_not_running": "Служба не запущена",
      "ui_wep_tag_3d": "3D",
      "ui_wep_tag_puppet_warp": "Деформация марионетки",
      "ui_wep_tag_hdr": "HDR",
      "ui_wep_tag_media_integration": "Интеграция с медиа",
      "ui_wep_tag_user_shortcut": "Пользовательский ярлык",
      "ui_wep_tag_video_texture": "Видеотекстура",
    },
    "zh-chs": {
      "ui_wep_update_check_tooltip": "单击检查更新（Shift+单击测试更新）",
      "ui_wep_update_checking": "正在检查更新……",
      "ui_wep_update_latest": "已是最新版本",
      "ui_wep_update_available": "发现新版本 {{version}}",
      "ui_wep_update_btn": "更新",
      "ui_wep_update_downloading": "正在下载…… {{progress}}%",
      "ui_wep_update_installing": "正在更新……",
      "ui_wep_update_failed": "更新失败",
      "ui_wep_update_err_daemon": "无法连接到辅助服务",
      "ui_wep_update_err_check": "检查失败",
      "ui_wep_update_err_download": "无法开始下载更新",
      "ui_wep_update_err_apply": "无法应用更新",
      "ui_wep_update_err_apply_prefix": "应用更新出错",
      "ui_wep_filter_category": "分类",
      "ui_wep_filter_assets_scripts": "资源与脚本",
      "ui_wep_filter_active": "已启用",
      "ui_wep_filter_asset_type": "资源类型",
      "ui_wep_filter_asset_genre": "资源风格",
      "ui_wep_filter_script_type": "脚本类型",
      "ui_wep_filter_special": "特殊",
      "ui_wep_filter_incompatible": "不兼容项目",
      "ui_wep_filter_incompatible_tooltip": "部分内容无法应用到游戏中。勾选此项后仍可找到它们。",
      "ui_wep_filter_misc": "杂项",
      "ui_wep_filter_genres": "风格",
      "ui_wep_filter_category_asset": "资源",
      "ui_wep_filter_any": "任意",
      "ui_wep_age_everyone": "所有人",
      "ui_wep_age_questionable": "可能不宜",
      "ui_wep_age_mature": "成人内容",
      "ui_wep_res_sd": "SD",
      "ui_wep_res_uw_sd": "超宽 SD",
      "ui_wep_res_uw_1080p": "超宽 1080p",
      "ui_wep_res_uw_1440p": "超宽 1440p",
      "ui_wep_res_dual_sd": "双屏 SD",
      "ui_wep_res_dual_1080p": "双屏 1080p",
      "ui_wep_res_dual_1440p": "双屏 1440p",
      "ui_wep_res_dual_4k": "双屏 4K",
      "ui_wep_res_triple_sd": "三屏 SD",
      "ui_wep_res_triple_768p": "三屏 768p",
      "ui_wep_res_triple_1080p": "三屏 1080p",
      "ui_wep_res_triple_1440p": "三屏 1440p",
      "ui_wep_res_triple_4k": "三屏 4K",
      "ui_wep_res_portrait_sd": "竖屏 SD",
      "ui_wep_res_portrait_720p": "竖屏 720p",
      "ui_wep_res_portrait_1080p": "竖屏 1080p",
      "ui_wep_res_portrait_1440p": "竖屏 1440p",
      "ui_wep_res_portrait_4k": "竖屏 4K",
      "ui_wep_res_dynamic": "动态",
      "ui_wep_res_other": "其他",
      "ui_wep_asset_type_model": "模型",
      "ui_wep_asset_type_sprite": "精灵",
      "ui_wep_asset_type_effect": "特效",
      "ui_wep_asset_type_scripted_layer": "脚本图层",
      "ui_wep_script_boolean": "布尔",
      "ui_wep_script_number": "数值",
      "ui_wep_script_vec2": "二维向量",
      "ui_wep_script_vec3": "三维向量",
      "ui_wep_script_vec4": "四维向量",
      "ui_wep_script_string": "字符串",
      "ui_wep_script_no_animation": "无动画",
      "ui_wep_script_oversized": "超大",
      "ui_wep_sort_install_date": "安装日期",
      "ui_wep_sort_posted_date": "发布日期",
      "ui_wep_sort_updated_date": "更新日期",
      "ui_wep_sort_popular_3months": "最受欢迎（3 个月）",
      "ui_wep_sort_popular_6months": "最受欢迎（6 个月）",
      "ui_wep_sort_recently_updated": "最近更新",
      "ui_wep_sort_subscribers": "独立订阅总数",
      "ui_wep_plugin_settings": "插件设置",
      "ui_wep_plugins_loading_notice": "插件正在加载，请稍候……就绪后即可下载和解包。",
      "ui_wep_steam_web_session": "Steam 网页会话",
      "ui_wep_btn_login": "登录",
      "ui_wep_status_authorized": "已授权",
      "ui_wep_status_not_logged_in": "未登录",
      "ui_wep_login_for_adult": "登录以访问 18+ 内容",
      "ui_wep_steam_user": "Steam 用户",
      "ui_wep_unknown": "未知",
      "ui_wep_download_accounts": "创意工坊下载账号",
      "ui_wep_btn_add_account": "添加账号",
      "ui_wep_accounts_hint": "选择用于下载文件的 Steam 账号。",
      "ui_wep_account_default": "默认",
      "ui_wep_account_protected": "已保护",
      "ui_wep_plugins_init_failed": "初始化插件组件失败：{{error}}",
      "ui_wep_downloading_runtime": "正在下载运行时：",
      "ui_wep_downloading_plugins": "正在下载插件组件：",
      "ui_wep_initializing_plugins": "正在初始化插件组件……",
      "ui_wep_service_launching": "正在启动 WEngine Helper 服务……",
      "ui_wep_service_failed": "无法启动 WEngine Helper 服务",
      "ui_wep_service_logged_in": "服务已启动，已成功登录 Steam{{name}}。",
      "ui_wep_service_login_wait": "服务已启动。正在登录 Steam……",
      "ui_wep_service_started": "WEngine Helper 服务已启动",
      "ui_wep_btn_download": "下载",
      "ui_wep_btn_downloaded": "已下载",
      "ui_wep_btn_extract": "解包",
      "ui_wep_btn_extracted": "已解包",
      "ui_wep_btn_delete": "删除",
      "ui_wep_loading_plugins": "正在加载插件……",
      "ui_wep_extracting": "正在解包……",
      "ui_wep_selected_count": "已选择：{{count}}",
      "ui_wep_extract_selected": "解包所选壁纸",
      "ui_wep_delete_selected_disk": "从磁盘删除所选",
      "ui_wep_details_metadata": "创意工坊元数据",
      "ui_wep_details_size": "大小：",
      "ui_wep_details_posted": "发布于：",
      "ui_wep_details_updated": "更新于：",
      "ui_wep_delete_wallpaper": "删除壁纸",
      "ui_wep_delete_wallpapers": "删除壁纸",
      "ui_wep_delete_confirm_one": "确定要从系统中删除此壁纸吗？",
      "ui_wep_delete_confirm_many": "确定要从系统中删除所选的 {{count}} 张壁纸吗？",
      "ui_wep_delete_failed": "删除失败",
      "ui_wep_delete_request_failed": "删除请求失败",
      "ui_wep_delete_partial": "有 {{count}} 张壁纸无法删除。详情请查看辅助服务日志。",
      "ui_wep_active_wallpaper": "正在使用的壁纸",
      "ui_wep_active_wallpapers": "正在使用的壁纸",
      "ui_wep_active_delete_one": "要删除正在使用的壁纸，请先应用其他壁纸。",
      "ui_wep_active_delete_many": "要删除正在使用的壁纸，请先应用其他壁纸。",
      "ui_wep_unpacking_many": "正在解包 {{count}} 张壁纸……",
      "ui_wep_unpacking_one": "正在解包“{{title}}”……",
      "ui_wep_unpacking_one_fallback": "正在解包壁纸……",
      "ui_wep_starting_extraction": "正在开始解包……",
      "ui_wep_unpack_errors": "解包完成，但出现了一些错误",
      "ui_wep_unpack_progress": "已解包 {{completed}}/{{total}}……",
      "ui_wep_unpack_all_success": "全部 {{count}} 张壁纸解包成功！",
      "ui_wep_unpack_failed": "解包失败：{{error}}",
      "ui_wep_unpack_success": "解包成功：“{{title}}”",
      "ui_wep_unpack_success_plain": "解包成功！",
      "ui_wep_unknown_error": "未知错误",
      "ui_wep_wallpaper_number": "第 {{number}} 张壁纸",
      "ui_wep_steam_login_title": "Steam 创意工坊登录",
      "ui_wep_steam_connecting": "正在连接 Steam……",
      "ui_wep_steam_init_session": "正在通过本地后台辅助服务初始化会话",
      "ui_wep_logged_in_as": "已登录为",
      "ui_wep_steam_adult_unlocked": "成人内容已解锁。",
      "ui_wep_btn_switch_logout": "切换 / 退出登录",
      "ui_wep_mode_qr": "二维码",
      "ui_wep_mode_password": "用户名和密码",
      "ui_wep_mode_cookie": "Cookie",
      "ui_wep_mode_system": "系统账号",
      "ui_wep_system_login_hint": "使用系统 Steam 账号登录，无需输入凭据。",
      "ui_wep_btn_login_system": "使用系统账号登录",
      "ui_wep_qr_scan_prefix": "请使用",
      "ui_wep_qr_scan_suffix": "扫描以授权：",
      "ui_wep_qr_waiting": "正在等待 Steam App 确认……",
      "ui_wep_cookie_hint_prefix": "请粘贴浏览器中的",
      "ui_wep_cookie_hint_suffix": "Cookie 值。SteamID 将自动识别。",
      "ui_wep_cookie_value_label": "steamLoginSecure Cookie 值",
      "ui_wep_cookie_placeholder": "76561198...%7C%7C... 或 Cookie 值",
      "ui_wep_steamid_label": "SteamID64（若 Cookie 中已包含则可选）",
      "ui_wep_btn_login_cookie": "使用 Cookie 登录",
      "ui_wep_btn_validating_cookie": "正在验证 Cookie……",
      "ui_wep_username": "用户名：",
      "ui_wep_password": "密码：",
      "ui_wep_username_placeholder": "用户名",
      "ui_wep_password_placeholder": "密码",
      "ui_wep_btn_sign_in": "登录",
      "ui_wep_f2p_hint": "支持免费游玩（F2P）账号。",
      "ui_wep_steam_success": "登录成功！",
      "ui_wep_welcome": "欢迎，",
      "ui_wep_auth_error": "身份验证错误",
      "ui_wep_btn_try_again": "重试",
      "ui_wep_session_saved": "会话已保存到本地",
      "ui_wep_err_cookie_required": "请输入 steamLoginSecure Cookie",
      "ui_wep_err_steamid_detect": "无法从 Cookie 中识别 17 位 SteamID。请手动输入 SteamID64。",
      "ui_wep_err_cookie_login": "Cookie 登录失败",
      "ui_wep_err_credentials_required": "请输入用户名和密码。",
      "ui_wep_err_login_failed": "登录失败。请检查凭据。",
      "ui_wep_err_connection": "连接错误",
      "ui_wep_err_worker_daemon": "无法连接到后台辅助服务",
      "ui_wep_err_auth_failed": "身份验证失败",
      "ui_wep_err_system_login": "使用系统账号登录失败。",
      "ui_wep_err_logout": "退出登录失败",
      "ui_wep_system_account_name": "系统 Steam 账号",
      "ui_wep_add_account_title": "添加 Steam 下载账号",
      "ui_wep_generating_qr": "正在生成授权二维码……",
      "ui_wep_scan_mobile": "请使用 Steam 手机应用扫描：",
      "ui_wep_waiting_confirmation": "正在等待确认……",
      "ui_wep_account_added_prefix": "账号",
      "ui_wep_account_added_suffix": "已添加！",
      "ui_wep_manual_hint": "输入用于下载的 Steam 账号凭据。",
      "ui_wep_err_steam_username": "请输入 Steam 用户名",
      "ui_wep_err_worker_not_running": "辅助服务未运行",
      "ui_wep_tag_3d": "3D",
      "ui_wep_tag_puppet_warp": "木偶变形",
      "ui_wep_tag_hdr": "HDR",
      "ui_wep_tag_media_integration": "媒体集成",
      "ui_wep_tag_user_shortcut": "用户快捷方式",
      "ui_wep_tag_video_texture": "视频纹理",
    },
  }),
  (window.WengineHelper = {
    url: "http://127.0.0.1:43196",
    isAlive: false,
    _launching: false,
    _lastLaunchTime: 0,
    _hbInterval: null,
    _installedIds: {},
    addInstalledWorkshopId: function (id) {
      if (id) this._installedIds[String(id)] = true;
    },
    removeInstalledWorkshopId: function (id) {
      if (id && this._installedIds) delete this._installedIds[String(id)];
    },
    setInstalledWallpapers: function (list) {
      var map = {};
      if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
          var w = list[i];
          if (w) {
            if (w.workshopid) map[String(w.workshopid)] = true;
            if (w.id) map[String(w.id)] = true;
          }
        }
      }
      this._installedIds = map;
    },
    isWallpaperInstalled: function (wid) {
      if (!wid) return false;
      return Boolean(this._installedIds[String(wid)]);
    },
    _scriptDir: (function () {
      try {
        var src = "";
        if (document.currentScript && document.currentScript.src) {
          src = document.currentScript.src;
        }
        if (!src) {
          var scripts = document.getElementsByTagName("script");
          for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf("scripts.js") !== -1) {
              src = scripts[i].src;
              break;
            }
          }
        }
        if (!src && window.location && window.location.href) {
          src = window.location.href;
        }
        // ONLY accept file:// paths. If loaded via http:// (e.g. wpx.internal), discard it!
        if (src && /^file:\/\//i.test(src)) {
          var path = decodeURIComponent(src)
            .replace(/^file:\/\//i, "")
            .replace(/^\/+/, "")
            .replace(/\//g, "\\")
            .split("?")[0]
            .split("#")[0];
          var lastSlash = path.lastIndexOf("\\");
          if (lastSlash !== -1) {
            var dir = path.substring(0, lastSlash);
            if (dir.toLowerCase().endsWith("\\dist")) {
              dir += "\\scripts";
            }
            if (dir.indexOf("http") === -1 && dir.indexOf("wpx") === -1) {
              return dir;
            }
          }
        }
      } catch (e) {}
      return "C:\\Program Files\\Wallpaper Engine\\ui\\dist\\scripts";
    })(),
    getScriptDir: function () {
      var dir = this._scriptDir;
      if (!dir || dir.indexOf("http") !== -1 || dir.indexOf("wpx") !== -1) {
        dir = "C:\\Program Files\\Wallpaper Engine\\ui\\dist\\scripts";
      }
      return dir;
    },
    ping: function () {
      return fetch(this.url + "/api/ping", { method: "GET" })
        .then(function (r) {
          return r.text();
        })
        .then(function (t) {
          return t === "pong";
        })
        .catch(function () {
          return false;
        });
    },
    waitForPing: function (attempts, delay) {
      var self = this;
      attempts = attempts || 15;
      delay = delay || 250;
      return new Promise(function (resolve) {
        var count = 0;
        function check() {
          self.ping().then(function (ok) {
            if (ok) {
              self.isAlive = true;
              self.startHeartbeat();
              resolve(true);
            } else if (++count < attempts) {
              setTimeout(check, delay);
            } else {
              self.isAlive = false;
              resolve(false);
            }
          });
        }
        check();
      });
    },
    ensureRunning: function () {
      var self = this;
      return this.ping().then(function (alive) {
        if (alive) {
          self.isAlive = true;
          self.startHeartbeat();
          return Promise.resolve(true);
        }
        var now = Date.now();
        if (
          !self._launching &&
          now - self._lastLaunchTime > 15000 &&
          window.ui &&
          window.ui.shellexecute
        ) {
          self._launching = true;
          self._lastLaunchTime = now;
          var dir = self.getScriptDir();
          var workerExe = dir + "\\wengine-helper.exe";
          window.ui.shellexecute(workerExe, "--daemon");
        }
        return self.waitForPing(15, 250).then(function (ok) {
          self._launching = false;
          return ok;
        });
      });
    },
    getAccounts: function () {
      return fetch(this.url + "/api/accounts/list")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return {
            accounts: [
              { username: "Auto", is_auto: true, is_custom: false, has_password: false },
            ],
            selected_index: 0,
          };
        });
    },
    selectAccount: function (index) {
      return fetch(this.url + "/api/accounts/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: index }),
      }).then(function (r) {
        return r.json();
      });
    },
    addAccount: function (username, password) {
      return fetch(this.url + "/api/accounts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password || "" }),
      }).then(function (r) {
        return r.json();
      });
    },
    removeAccount: function (username) {
      return fetch(this.url + "/api/accounts/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username }),
      }).then(function (r) {
        return r.json();
      });
    },
    loginWithCookie: function (req) {
      return fetch(this.url + "/api/auth/cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      }).then(function (r) {
        return r.json();
      });
    },
    restart: function () {
      var self = this;
      this.shutdown();
      this.isAlive = false;
      this._lastLaunchTime = 0;
      this._launching = false;
      return new Promise(function (resolve) {
        setTimeout(function () {
          self.ensureRunning().then(resolve);
        }, 1200);
      });
    },
    startHeartbeat: function () {
      if (this._hbInterval) return;
      var self = this;
      this._hbInterval = setInterval(function () {
        fetch(self.url + "/api/heartbeat", { method: "POST" }).catch(
          function () {}
        );
      }, 5000);
    },
    shutdown: function () {
      if (this._hbInterval) {
        clearInterval(this._hbInterval);
        this._hbInterval = null;
      }
      fetch(this.url + "/api/shutdown", { method: "POST" }).catch(
        function () {}
      );
    },
    checkUpdate: function (opts) {
      var self = this;
      return this.ensureRunning().then(function (alive) {
        if (!alive) return null;
        var params = [];
        if (opts && opts.force) params.push("force=true");
        if (opts && opts.mock) params.push("mock=true");
        var url = self.url + "/api/update/check" + (params.length ? "?" + params.join("&") : "");
        return fetch(url)
          .then(function (r) {
            return r.json();
          })
          .catch(function (e) {
            console.warn("[WEngineHelper] checkUpdate error:", e);
            return null;
          });
      });
    },
    getUpdateStatus: function () {
      return fetch(this.url + "/api/update/status")
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return null;
        });
    },
    startUpdateDownload: function () {
      return fetch(this.url + "/api/update/download", { method: "POST" })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    applyUpdate: function () {
      return fetch(this.url + "/api/update/apply", { method: "POST" })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    getAuthStatus: function () {
      var self = this;
      return fetch(this.url + "/api/auth/status")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return { logged_in: false, persona_name: null, steamid: null };
        });
    },
    getItemDetails: function (workshopId) {
      return fetch(this.url + "/api/workshop/item?id=" + encodeURIComponent(workshopId))
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .catch(function (err) {
          console.warn("[WEngineHelper] getItemDetails error:", err);
          return null;
        });
    },
    getPluginStatus: function () {
      return fetch(this.url + "/api/plugins/status")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return null;
        });
    },
    getDotnetStatus: function () {
      return fetch(this.url + "/api/dotnet/status")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return null;
        });
    },
    ensureDotnet: function () {
      return fetch(this.url + "/api/dotnet/ensure", {
        method: "POST",
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    startAccountQr: function () {
      return fetch(this.url + "/api/accounts/qr/start", { method: "POST" })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    pollAccountQr: function () {
      return fetch(this.url + "/api/accounts/qr/status")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return { status: "error", error: "Offline" };
        });
    },
    cancelAccountQr: function () {
      return fetch(this.url + "/api/accounts/qr/cancel", { method: "POST" }).catch(
        function () {}
      );
    },
    deleteWallpaper: function (data) {
      var self = this;
      return fetch(this.url + "/api/workshop/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (res) {
          if (res && res.ok && data && data.pubfileid) {
            self.removeInstalledWorkshopId(data.pubfileid);
            if (self._installedIds) delete self._installedIds[String(data.pubfileid)];
          }
          return res;
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    
    downloadItem: function (pubfileid) {
      return fetch(this.url + "/api/workshop/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubfileid: String(pubfileid) }),
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    cancelDownload: function (pubfileid) {
      return fetch(this.url + "/api/workshop/download/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubfileid: String(pubfileid) }),
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    getDownloadsAll: function () {
      return fetch(this.url + "/api/workshop/download/all")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return {};
        });
    },
    pickFolder: function () {
      return fetch(this.url + "/api/dialog/folder")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return { ok: false, cancelled: true };
        });
    },
    extractItem: function (pubfileid, file, output_dir) {
      return fetch(this.url + "/api/workshop/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pubfileid: pubfileid ? String(pubfileid) : undefined,
          file: file ? String(file) : undefined,
          output_dir: output_dir ? String(output_dir) : undefined,
        }),
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    loginSystemAccount: function () {
      return fetch(this.url + "/api/steam/login/system", {
        method: "POST",
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    ensurePlugins: function () {
      return fetch(this.url + "/api/plugins/ensure", {
        method: "POST",
      })
        .then(function (r) {
          return r.json();
        })
        .catch(function (e) {
          return { ok: false, error: String(e) };
        });
    },
    getAllMetadata: function () {
      return fetch(this.url + "/api/metadata/all")
        .then(function (r) { return r.json(); })
        .catch(function () { return {}; });
    },
    saveMetadata: function (id, meta) {
      return fetch(this.url + "/api/metadata/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubfileid: id, metadata: meta }),
      })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false }; });
    },
    deleteMetadata: function (pubfileid) {
      return fetch(this.url + "/api/metadata/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubfileid: String(pubfileid) }),
      })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false }; });
    },
    getExtractStatus: function (pubfileid) {
      return fetch(
        this.url +
          "/api/workshop/extract/status?pubfileid=" +
          encodeURIComponent(pubfileid)
      )
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return null;
        });
    },
    browse: function (i) {
      var self = this;
      return this.ensureRunning().then(function () {
        var params = new URLSearchParams();
        params.set("page", String(i.page || 1));
        if (i.itemid) {
          params.set("numperpage", "30");
        } else {
          params.set("num_per_page", "50");
        }
        if (i.sort) params.set("sort", String(i.sort));
        if (i.text) params.set("text", String(i.text).replace(/^"(.*)"$/, "$1"));
        var reqTags = (i.requiredTags || []).slice();
        if (reqTags.length) {
          params.set("required_tags", reqTags.join(","));
        }
        var excTags = (i.excludedTags || []).filter(function (t) {
          return !window._helperResolutionTagsList.includes(t);
        });
        if (excTags.length) {
          params.set("excluded_tags", excTags.join(","));
        }
        if (i.itemid) params.set("itemid", String(i.itemid));
        if (i.preset) params.set("preset", String(i.preset));
        if (i.token) params.set("token", String(i.token));
        if (i.incompatible) params.set("incompatible", "true");
        if (i.required_flags) params.set("required_flags", String(i.required_flags));

        return fetch(self.url + "/api/workshop/browse?" + params.toString())
          .then(function (resp) {
            if (!resp.ok) throw new Error("Worker browse HTTP " + resp.status);
            return resp.json();
          })
          .then(function (data) {
            return {
              action: data.action || "queryWorkshop",
              wallpapers: data.wallpapers || [],
              pagecount: data.pagecount || 1,
              token: i.token,
              isbackup: false,
            };
          });
      });
    },
    
  }),
  // Launch worker immediately upon script startup (Request 2)
  setTimeout(function () {
    if (window.WengineHelper) window.WengineHelper.ensureRunning();
  }, 100);
  angular.module("wallpaperbrowserApp").controller("SteamLoginModalCtrl", [
    "$scope",
    "$uibModalInstance",
    "$timeout",
    "$sce",
    "$rootScope",
    "$translate",
    function ($scope, $uibModalInstance, $timeout, $sce, $rootScope, $translate) {
      $scope.loading = true;
      $scope.status = "loading";
      $scope.qrSvg = null;
      $scope.accountName = "";
      $scope.errorMessage = "";
      $scope.mode = "qr"; // "qr", "password", or "cookie"
      $scope.credentials = { username: "", password: "" };
      $scope.cookieForm = { cookie: "", steamid: "", persona_name: "" };
      $scope.credBusy = false;
      var pollTimer = null;
      var clientId = "";
      var requestId = "";

      $scope.setMode = function(m) {
        $scope.mode = m;
        $scope.errorMessage = "";
        if (m === "qr") {
          if (pollTimer) $timeout.cancel(pollTimer);
          startQR();
        } else {
          if (pollTimer) $timeout.cancel(pollTimer);
        }
      };

      $scope.submitCookie = function () {
        if (!$scope.cookieForm.cookie || !$scope.cookieForm.cookie.trim()) {
          $scope.errorMessage = $translate.instant("ui_wep_err_cookie_required");
          return;
        }
        var rawCookie = $scope.cookieForm.cookie.trim();
        var cookieVal = rawCookie;
        if (cookieVal.indexOf("steamLoginSecure=") !== -1) {
          cookieVal = cookieVal.split("steamLoginSecure=")[1].split(";")[0].trim();
        }
        var steamid = $scope.cookieForm.steamid ? $scope.cookieForm.steamid.trim() : "";
        if (!steamid) {
          var parts = decodeURIComponent(cookieVal).split("||");
          if (parts.length > 1 && /^\d{17}$/.test(parts[0])) {
            steamid = parts[0];
          }
        }
        if (!steamid) {
          $scope.errorMessage = $translate.instant("ui_wep_err_steamid_detect");
          return;
        }
        $scope.credBusy = true;
        $scope.errorMessage = "";
        if (window.WengineHelper) {
          window.WengineHelper.loginWithCookie({
            steamid: steamid,
            steam_login_secure: cookieVal,
            persona_name: $scope.cookieForm.persona_name
              ? $scope.cookieForm.persona_name.trim()
              : null,
          })
            .then(function (res) {
              $timeout(function () {
                $scope.credBusy = false;
                if (res && (res.ok === false || res.error)) {
                  $scope.errorMessage =
                    res.error || $translate.instant("ui_wep_err_cookie_login");
                } else {
                  $scope.status = "success";
                  $scope.accountName =
                    (res && res.session && (res.session.persona_name || res.session.steamid)) ||
                    steamid;
                  if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
                  $timeout(function () {
                    $uibModalInstance.close({ loggedIn: true, accountName: $scope.accountName });
                  }, 800);
                }
              });
            })
            .catch(function (err) {
              $timeout(function () {
                $scope.credBusy = false;
                $scope.errorMessage = String(err);
              });
            });
        }
      };

      $scope.submitLogin = function() {
        if (!$scope.credentials.username || !$scope.credentials.password) {
          $scope.errorMessage = $translate.instant("ui_wep_err_credentials_required");
          return;
        }
        $scope.credBusy = true;
        $scope.errorMessage = "";
        fetch("http://127.0.0.1:43196/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: $scope.credentials.username.trim(), password: $scope.credentials.password }),
        })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            $timeout(function() {
              $scope.credBusy = false;
              if (data.ok && data.status && data.status.logged_in) {
                $scope.status = "success";
                $scope.accountName = data.status.persona_name || data.status.steamid || $translate.instant("ui_wep_steam_user");
                if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
                $timeout(function () {
                  $uibModalInstance.close({ loggedIn: true, accountName: $scope.accountName });
                }, 1200);
              } else {
                $scope.errorMessage =
                  data.error || $translate.instant("ui_wep_err_login_failed");
              }
            });
          })
          .catch(function(err) {
            $timeout(function() {
              $scope.credBusy = false;
              $scope.errorMessage =
                $translate.instant("ui_wep_err_connection") + ": " + err;
            });
          });
      };

      function checkStatus() {
        return fetch("http://127.0.0.1:43196/api/auth/status")
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            if (data.logged_in) {
              $timeout(function () {
                $scope.status = "logged_in";
                $scope.accountName =
                  data.persona_name || data.steamid || $translate.instant("ui_wep_steam_user");
                $scope.loading = false;
              });
              return true;
            }
            return false;
          })
          .catch(function () {
            return false;
          });
      }

      function startQR() {
        $scope.loading = true;
        $scope.status = "loading";
        $scope.errorMessage = "";
        fetch("http://127.0.0.1:43196/api/auth/qr/begin", { method: "POST" })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            $timeout(function () {
              $scope.loading = false;
              if (data.error) {
                $scope.status = "error";
                $scope.errorMessage = data.error;
                return;
              }
              $scope.status = "waiting_qr";
              clientId = data.client_id;
              requestId = data.request_id;
              $scope.qrSvg = $sce.trustAsHtml(data.qr_svg);
              schedulePoll();
            });
          })
          .catch(function (err) {
            $timeout(function () {
              $scope.loading = false;
              $scope.status = "error";
              $scope.errorMessage =
                $translate.instant("ui_wep_err_worker_daemon") + ": " + err;
            });
          });
      }

      function schedulePoll() {
        if ($scope.status !== "waiting_qr") return;
        pollTimer = $timeout(function () {
          fetch("http://127.0.0.1:43196/api/auth/qr/poll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: String(clientId),
              request_id: String(requestId),
            }),
          })
            .then(function (r) {
              return r.json();
            })
            .then(function (data) {
              if (data.status === "success") {
                var qrSession = data.session || {};
                $scope.status = "success";
                $scope.accountName =
                  qrSession.persona_name || qrSession.steamid || $translate.instant("ui_wep_steam_user");
                if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
                $timeout(function () {
                  $uibModalInstance.close({
                    loggedIn: true,
                    accountName: $scope.accountName,
                  });
                }, 1200);
              } else if (data.status === "error") {
                $scope.status = "error";
                $scope.errorMessage =
                  data.error || $translate.instant("ui_wep_err_auth_failed");
              } else {
                schedulePoll();
              }
            })
            .catch(function () {
              schedulePoll();
            });
        }, 2000);
      }

      $scope.retry = function () {
        if (pollTimer) $timeout.cancel(pollTimer);
        startQR();
      };

      $scope.loginSystemAccount = function () {
        $scope.credBusy = true;
        $scope.errorMessage = "";
        if (window.WengineHelper) {
          window.WengineHelper.loginSystemAccount()
            .then(function (res) {
              $timeout(function () {
                $scope.credBusy = false;
                if (res && res.ok) {
                  $scope.status = "success";
                  $scope.accountName =
                    (res.status && (res.status.persona_name || res.status.steamid)) ||
                    $translate.instant("ui_wep_system_account_name");
                  if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
                  $timeout(function () {
                    $uibModalInstance.close({ loggedIn: true, accountName: $scope.accountName });
                  }, 800);
                } else {
                  $scope.errorMessage =
                    (res && res.error) || $translate.instant("ui_wep_err_system_login");
                }
              });
            })
            .catch(function (err) {
              $timeout(function () {
                $scope.credBusy = false;
                $scope.errorMessage = String(err);
              });
            });
        }
      };

      $scope.logout = function () {
        $scope.loading = true;
        fetch("http://127.0.0.1:43196/api/auth/logout", { method: "POST" })
          .then(function () {
            $timeout(function () {
              $scope.loading = false;
              $scope.status = "waiting_qr";
              $scope.accountName = "";
              $scope.mode = "qr";
              if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
              startQR();
            });
          })
          .catch(function () {
            $timeout(function () {
              $scope.loading = false;
              $scope.status = "error";
              $scope.errorMessage = $translate.instant("ui_wep_err_logout");
            });
          });
      };

      $scope.close = function () {
        if (pollTimer) $timeout.cancel(pollTimer);
        if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
        $uibModalInstance.dismiss("cancel");
      };

      $scope.$on("$destroy", function () {
        if (pollTimer) $timeout.cancel(pollTimer);
        if ($rootScope) $rootScope.$broadcast("steamAuthChanged");
      });

      checkStatus().then(function (isLoggedIn) {
        if (!isLoggedIn) {
          startQR();
        }
      });
    },
  ]),
  angular.module("wallpaperbrowserApp").controller("AddAccountModalCtrl", [
    "$scope",
    "$uibModalInstance",
    "$timeout",
    "$translate",
    function ($scope, $uibModalInstance, $timeout, $translate) {
      $scope.mode = "qr";
      $scope.qrStatus = "generating";
      $scope.qrText = "";
      $scope.successUsername = "";
      $scope.account = { username: "", password: "" };
      $scope.error = "";
      $scope.saving = false;
      var pollTimer = null;

      $scope.setMode = function (m) {
        $scope.mode = m;
        $scope.error = "";
        if (m === "qr") {
          $scope.startQr();
        } else {
          $scope.stopQr();
        }
      };

      $scope.stopQr = function () {
        if (pollTimer) {
          $timeout.cancel(pollTimer);
          pollTimer = null;
        }
        if (window.WengineHelper) {
          window.WengineHelper.cancelAccountQr();
        }
      };

      function scheduleQrPoll() {
        if ($scope.mode !== "qr") return;
        pollTimer = $timeout(function () {
          if (!window.WengineHelper) return;
          window.WengineHelper.pollAccountQr().then(function (res) {
            if ($scope.mode !== "qr") return;
            if (res.status === "waiting_qr" || res.status === "ready" || res.qr_data || res.qr_text) {
              if (res.qr_data || res.qr_text) {
                $scope.qrStatus = "waiting_qr";
                $scope.qrText = res.qr_text || res.qr_data || "";
              }
              scheduleQrPoll();
            } else if (res.status === "success") {
              $scope.qrStatus = "success";
              $scope.successUsername = res.username || "";
              $timeout(function () {
                $uibModalInstance.close({ ok: true, username: res.username });
              }, 1200);
            } else if (res.status === "error" || res.status === "failed") {
              $scope.qrStatus = "error";
              $scope.error =
                res.error || $translate.instant("ui_wep_err_auth_failed");
            } else {
              $scope.qrStatus = "generating";
              scheduleQrPoll();
            }
          }).catch(function () {
            if ($scope.mode === "qr") scheduleQrPoll();
          });
        }, 1000);
      }

      $scope.startQr = function () {
        $scope.qrStatus = "generating";
        $scope.qrText = "";
        $scope.error = "";
        if (pollTimer) $timeout.cancel(pollTimer);
        if (window.WengineHelper) {
          window.WengineHelper.startAccountQr().then(function (res) {
            if (res && res.error) {
              $scope.qrStatus = "error";
              $scope.error = res.error;
            } else {
              scheduleQrPoll();
            }
          }).catch(function (err) {
            $scope.qrStatus = "error";
            $scope.error = String(err);
          });
        } else {
          $scope.qrStatus = "error";
          $scope.error = $translate.instant("ui_wep_err_worker_not_running");
        }
      };

      $scope.save = function () {
        if (!$scope.account.username || !$scope.account.username.trim()) {
          $scope.error = $translate.instant("ui_wep_err_steam_username");
          return;
        }
        $scope.saving = true;
        if (window.WengineHelper) {
          window.WengineHelper.addAccount(
            $scope.account.username.trim(),
            $scope.account.password ? $scope.account.password.trim() : "",
          )
            .then(function (res) {
              $scope.saving = false;
              if (res && res.error) {
                $scope.error = res.error;
              } else {
                $uibModalInstance.close(res);
              }
            })
            .catch(function (err) {
              $scope.saving = false;
              $scope.error = String(err);
            });
        } else {
          $uibModalInstance.dismiss("no_worker");
        }
      };

      $scope.cancel = function () {
        $scope.stopQr();
        $uibModalInstance.dismiss("cancel");
      };

      $scope.$on("$destroy", function () {
        $scope.stopQr();
      });

      $scope.startQr();
    },
  ]);

  // ==========================================================================
  // Stage 2: WEP-patched AngularJS registrations moved out of scripts.js.
  //
  // scripts.js stays the (pristine) upstream file, so the WEP variants of these
  // registrations cannot be registered a second time: AngularJS keeps duplicates
  // (two directives with the same name are both applied). Instead the overlay
  // rewrites the already queued entries of the module before bootstrap.
  // In AngularJS 1.6.10 the module loader queues [provider, method, arguments]
  // and bootstrap does provider[method].apply(provider, arguments), so swapping
  // entry[2] replaces the registration in place (same order, no duplicates).
  //
  // Blocks below are verbatim copies from scripts.js; docs/ARCHITECTURE.md has
  // the source line ranges.
  // ==========================================================================
  (function () {
    var app = angular.module("wallpaperbrowserApp");

    var titlebar = [
    "$rootScope",
    "$route",
    "skin",
    function (e, t, n) {
      return {
        templateUrl: "views/templates/titlebar.html",
        restrict: "E",
        link: function (a) {
          function i(e) {
            angular.isObject(e) &&
              angular.isObject(e.options) &&
              ((a.caption = e.options.caption),
              (a.isDialog = e.options.isDialog),
              (a.hideTitle = e.options.hideTitle),
              (a.showMiniMode = e.options.showMiniMode));
          }
          function stripSteamEdition() {
            try {
              var el = document.querySelector(".titlebar .title");
              if (el) {
                var spans = el.querySelectorAll("span");
                for (var s = 0; s < spans.length; s++) {
                  if (spans[s].textContent && spans[s].textContent.indexOf("Steam Edition") !== -1) {
                    spans[s].textContent = spans[s].textContent.replace(/\s*-\s*Steam\s+Edition/gi, "");
                  }
                }
                for (var n = 0; n < el.childNodes.length; n++) {
                  var c = el.childNodes[n];
                  if (c.nodeType === 3 && c.nodeValue && c.nodeValue.indexOf("Steam Edition") !== -1) {
                    c.nodeValue = c.nodeValue.replace(/\s*-\s*Steam\s+Edition/gi, "");
                  }
                }
              }
            } catch (err) {}
          }
          ((a.isMaximized = n.isMaximized()),
            (a.appUpdate = e.appUpdate || {
              current_version: "2.0.0",
              latest_version: null,
              has_update: !1,
              status: "idle",
              progress: 0,
              error: null,
              checking: !1,
              upToDateNotice: !1,
            }),
            e.$watch("appUpdate", function (val) {
              val && (a.appUpdate = val);
            }),
            (a.initUpdateCheck = function (manual, ev) {
              if (e.initUpdateCheck) return e.initUpdateCheck(manual, ev);
              if (window.WengineHelper && window.WengineHelper.checkUpdate) {
                var isMock = !!(ev && (ev.shiftKey || ev.altKey));
                return window.WengineHelper.checkUpdate({ force: !!manual, mock: isMock });
              }
            }),
            (a.startAppUpdate = function () {
              if (e.startAppUpdate) return e.startAppUpdate();
              if (window.WengineHelper && window.WengineHelper.startUpdateDownload) {
                return window.WengineHelper.startUpdateDownload();
              }
            }),
            (a.isDialog = !1),
            (a.maximizeEnabled = !0),
            (a.caption = "404"),
            (a.captionValues = {}),
            (a.closeWindow = function () {
              n.runCloseCallbacks().then(function () {
                window.ui.close();
              });
            }),
            (a.sendToggleMiniMode = function () {
              e.$broadcast("sendToggleMiniMode");
            }),
            a.$on("onMiniModeChanged", function (e, t) {
              a.isMiniMode = t;
            }),
            a.$on("onMaximizedChanged", function (e, t) {
              ((a.isMaximized = t), window.safeApply(a));
            }),
            a.$on("onMaximizeEnabledChanged", function (e, t) {
              ((a.maximizeEnabled = t), window.safeApply(a));
            }),
            a.$on("$routeChangeSuccess", function (e, t) {
              i(t);
            }),
            e.$on("onVersionSubmitted", function (e, t) {
              ((a.captionValues.version = t), stripSteamEdition());
            }),
            setTimeout(function () {
              stripSteamEdition();
              if (typeof MutationObserver !== "undefined") {
                var target = document.querySelector(".titlebar .title");
                if (target) {
                  var obs = new MutationObserver(function () {
                    stripSteamEdition();
                  });
                  obs.observe(target, { childList: true, subtree: true, characterData: true });
                }
              }
            }, 100),
            i(t.current));
        },
      };
    },
  ];

    var localeLoader = [
      "$q",
      "$http",
      "localeLoaderSupport",
      function (n, e, o) {
        var r = {};
        return function (a) {
          function t(e) {
            var t = o.getTranslations(a.key);
            (angular.isObject(t) && (angular.extend(t, e), (e = t)),
              (e = angular.extend(
                {},
                (window.WEP_LOCALES || {})["en-us"] || {},
                (window.WEP_LOCALES || {})[a.key] || {},
                e || {},
              )),
              e && e.ui_caption_browse && (e.ui_caption_browse = e.ui_caption_browse.replace(/\s*-\s*Steam\s+Edition/gi, "")),
              i.resolve(e));
          }
          var e,
            i = n.defer();
          return (
            angular.isObject(r[a.key])
              ? t(r[a.key])
              : ((e = n.defer()),
                window.global._wpxLocale &&
                  e.resolve(window.global._wpxLocale(a.key)),
                e.promise.then(function (e) {
                  e.success
                    ? ((e = angular.fromJson(e.translations)),
                      "en-us" === a.key &&
                        angular.extend(e, {
                          "system_language_ar-sa": "اللغة العربية الفصحى",
                          "system_language_be-by": "Беларуская",
                          "system_language_bg-bg": "български",
                          "system_language_cs-cz": "čeština",
                          "system_language_da-dk": "Dansk",
                          "system_language_de-de": "Deutsch",
                          "system_language_el-gr": "Eλληνικά",
                          "system_language_en-us": "English",
                          "system_language_es-es": "Español",
                          "system_language_eu-es": "Euskara",
                          "system_language_fa-ir": "فارسی",
                          "system_language_fi-fi": "Suomi",
                          "system_language_fr-fr": "Français",
                          "system_language_he-il": "עברית",
                          "system_language_hu-hu": "Magyar",
                          "system_language_id-id": "Bahasa Indonesia",
                          "system_language_it-it": "Italiano",
                          "system_language_ja-jp": "日本語",
                          "system_language_ko-kr": "한국어",
                          "system_language_lt-lt": "Lietuvių kalba",
                          "system_language_nl-nl": "Nederlands",
                          "system_language_nb-no": "Norsk",
                          "system_language_pl-pl": "Polski",
                          "system_language_pt-br": "Português-Brasil",
                          "system_language_pt-pt": "Português",
                          "system_language_ro-ro": "Română",
                          "system_language_ru-ru": "Русский язык",
                          "system_language_sk-sk": "Slovenčina",
                          "system_language_sl-si": "Slovenščina",
                          "system_language_sv-se": "Svenska",
                          "system_language_th-th": "ภาษาไทย",
                          "system_language_tr-tr": "Türkçe",
                          "system_language_uk-ua": "Українська",
                          "system_language_vi-vn": "tiếng việt",
                          "system_language_zh-chs": "简体中文",
                          "system_language_zh-cht": "繁體中文",
                        }),
                      e && e.ui_caption_browse && (e.ui_caption_browse = e.ui_caption_browse.replace(/\s*-\s*Steam\s+Edition/gi, "")),
                      (r[a.key] = e),
                      t(e))
                    : t({});
                })),
            i.promise
          );
        };
      },
    ];

    var wallpaperThumbnail = [
      "$translate",
      "$document",
      "$timeout",
      "$compile",
      "utils",
      "dragdrop",
      function (V, F, j, L, z, H) {
        return {
          restrict: "E",
          scope: {
            wtWallpapers: "=",
            wtWallpaperFlags: "=",
            wtFolders: "=",
            wtSelection: "=",
            wtMultiselection: "=",
            wtEnabledragdrop: "=",
            wtTag: "=",
            wtSteamUserInfos: "=",
            wtMousecallback: "&",
            wtSelectioncallback: "&",
            wtFlagcallback: "&",
            wtBlacklist: "=",
            wtConfig: "=",
          },
          link: function (m, c, v) {
            c = angular.element(c);
            var o,
              d,
              p = [],
              u = [],
              n = [],
              t = !1,
              r = {},
              s = [],
              g = [],
              f = !1;
            let h =
                "data:image/bmp;base64,Qk08AAAAAAAAADYAAAAoAAAAAQAAAAEAAAABABAAAAAAAAYAAAASCwAAEgsAAAAAAAAAAAAA/39vVAAA",
              b = document.createElement("template");
            b.innerHTML = `<div class="icons">
<span class="fas fa-trophy statusIconAppoved wallpaperStatusIcon galleryTooltipApproved"></span>
<span class="fas fa-mobile-android statusIconPortrait wallpaperStatusIcon galleryTooltipPortrait"></span>
<span class="fas fa-heart statusIconHeart wallpaperStatusIcon galleryTooltipFavorite"></span>
<span class="fas fa-check-circle statusIconInstalled wallpaperStatusIcon galleryTooltipInstalled" style="color:#5cb85c !important;"></span>
<div class="browseWallpaperImageIconTooltipParent">
<div class="browseWallpaperImageIconTooltip">
<div class="galleryTooltipApproved">
<span class="fas fa-fw fa-trophy statusIconAppoved galleryTooltipIcon"></span><span class="iconLabelApproved"></span>
</div>
<div class="galleryTooltipPortrait">
<span class="fas fa-fw fa-mobile-android statusIconPortrait galleryTooltipIcon"></span><span class="iconLabelPortrait"></span>
</div>
<div class="galleryTooltipFavorite">
<span class="fas fa-fw fa-heart statusIconHeart galleryTooltipIcon"></span><span class="iconLabelFavorite"></span>
</div>
<div class="galleryTooltipInstalled">
<span class="fas fa-fw fa-check-circle statusIconInstalled galleryTooltipIcon" style="color:#5cb85c !important;"></span><span class="iconLabelInstalled"></span>
</div>
</div>
</div>
</div>`;
            let a = document.createElement("template");
            function i(e) {
              e.stopPropagation();
            }
            function l(e) {
              (o && (o.removeClass("selected"), (o = void 0)),
                e && (o = e).addClass("selected"));
            }
            function _(e) {
              m.wtMultiselection && m.wtMultiselection.includes(e.ctx.wallpaper)
                ? e.addClass("multiselect")
                : e.removeClass("multiselect");
            }
            function y(e) {
              e.ctx.info &&
                e.ctx.info.checkbox &&
                (m.wtWallpaperFlags && m.wtWallpaperFlags[e.ctx.wallpaper.file]
                  ? (e.ctx.info.checkboxChecked.show(),
                    e.ctx.info.checkboxNotChecked.hide(),
                    e.ctx.info.checkbox.addClass("visible"))
                  : (e.ctx.info.checkboxChecked.hide(),
                    e.ctx.info.checkboxNotChecked.show(),
                    e.ctx.info.checkbox.removeClass("visible")));
            }
            function w(t) {
              switch (m.wtTag) {
                case "exploreHighlights":
                case "homeHighlights":
                  var e = V.instant(
                    t.ctx.wallpaper.titleoverride || t.ctx.wallpaper.title,
                    {
                      collectiontitle: t.ctx.wallpaper.queryTitle,
                      user: t.ctx.wallpaper.queryTitle,
                      year: t.ctx.wallpaper.year,
                      emoji: t.ctx.wallpaper.emoji,
                    },
                  )
                    .toString()
                    .replace(/(<b>|<\/b>)/g, "");
                  t.ctx.title[0].innerHTML !== e && t.ctx.title.text(e);
                  break;
                default:
                  t.ctx.title[0].innerHTML !== t.ctx.wallpaper.title &&
                    t.ctx.title.text(t.ctx.wallpaper.title);
              }
              if (t.ctx.info) {
                if (t.ctx.lastStatus !== t.ctx.wallpaper.status) {
                  switch (
                    (t.removeClass("installed downloadable"),
                    t.ctx.progress && "downloading" !== t.ctx.wallpaper.status
                      ? (j.cancel(t.ctx.progressShowTimeout),
                        j.cancel(t.ctx.progressHideTimeout),
                        t.ctx.downloadElement.addClass("hideProgress"),
                        "installed" === t.ctx.wallpaper.status &&
                          t.ctx.downloadElement.addClass("finishProgress"),
                        (t.ctx.progressHideTimeout = j(function () {
                          (s.findAndRemove(t.progressContext),
                            t.progressContext.$destroy(),
                            t.ctx.progress.remove(),
                            delete t.progressContext,
                            delete t.ctx.progress,
                            t.ctx.downloadElement.hide());
                        }, 700)))
                      : t.ctx.progress ||
                        "downloading" !== t.ctx.wallpaper.status ||
                        (t.ctx.downloadElement.removeClass("finishProgress"),
                        t.ctx.downloadElement.addClass("hideProgress"),
                        t.ctx.downloadElement.show(),
                        (t.progressContext = t.ctx.$new()),
                        s.push(t.progressContext),
                        (t.ctx.progress = L(
                          '<radial-progress class="inner radialProgressContainer" rp-percent="wallpaper.downloadpercent" rp-label="wallpaper.downloadlabel"></radial-progress>',
                        )(t.progressContext, function (e) {
                          (t.ctx.downloadElement.append(e),
                            (t.ctx.progressShowTimeout = j(function () {
                              t.ctx.downloadElement.removeClass("hideProgress");
                            })));
                        }))),
                    "error" === t.ctx.lastStatus
                      ? ((n = t).removeClass("error"),
                        n.ctx.steamDownloadError &&
                          n.ctx.steamDownloadError.hide())
                      : "error" === t.ctx.wallpaper.status &&
                        ((n = t).addClass("error"),
                        n.ctx.steamDownloadError
                          ? n.ctx.steamDownloadError.show()
                          : ((n.ctx.steamDownloadError = angular.element(
                              document.createElement("div"),
                            )),
                            n.ctx.steamDownloadError.addClass(
                              "steamDownloadError",
                            ),
                            n.ctx.steamDownloadError.html(
                              V.instant(
                                "ui_browse_download_error_restart_steam",
                              ).toString(),
                            ),
                            n.append(n.ctx.steamDownloadError))),
                    t.ctx.wallpaper.status)
                  ) {
                    case "installed":
                      t.addClass("installed");
                      break;
                    case "downloadable":
                      t.addClass("downloadable");
                      break;
                    case "downloading":
                      j.cancel(t.ctx.progressHideTimeout);
                  }
                  t.ctx.lastStatus = t.ctx.wallpaper.status;
                }
                if (
                  (t.css({
                    "background-image": (i = t.ctx.wallpaper.previewsmall)
                      ? 'url("' + i + '")'
                      : "",
                  }),
                  t.ctx.video &&
                    t.ctx.video.attr("src", t.ctx.wallpaper.videopreviewurl),
                  t.ctx.wallpaper === m.wtSelection ? l(t) : t === o && l(),
                  t.ctx.wallpaper.approved
                    ? t.ctx.info.icons.addClass("showGalleryTooltipApproved")
                    : t.ctx.info.icons.removeClass(
                        "showGalleryTooltipApproved",
                      ),
                  t.ctx.wallpaper.portrait
                    ? t.ctx.info.icons.addClass("showGalleryTooltipPortrait")
                    : t.ctx.info.icons.removeClass(
                        "showGalleryTooltipPortrait",
                      ),
                  t.ctx.wallpaper.favorite
                    ? t.ctx.info.icons.addClass("showGalleryTooltipFavorite")
                    : t.ctx.info.icons.removeClass(
                        "showGalleryTooltipFavorite",
                      ),
                  ("installed" !== m.wtTag &&
                   (t.ctx.wallpaper.status === "installed" ||
                    (window.WengineHelper && window.WengineHelper.isWallpaperInstalled && window.WengineHelper.isWallpaperInstalled(t.ctx.wallpaper.workshopid || t.ctx.wallpaper.id))))
                    ? t.ctx.info.icons.addClass("showGalleryTooltipInstalled")
                    : t.ctx.info.icons.removeClass("showGalleryTooltipInstalled"),
                  m.wtBlacklist &&
                  t.ctx.wallpaper.authorsteamid &&
                  m.wtBlacklist.includes(t.ctx.wallpaper.authorsteamid)
                    ? t.addClass("blacklisted")
                    : t.removeClass("blacklisted"),
                  t.ctx.assetCategory &&
                    (t.ctx.assetCategory.removeClass("layers effects scripts"),
                    t.ctx.wallpaper.assettypes) &&
                    0 < t.ctx.wallpaper.assettypes.length)
                ) {
                  var a = "ui_query_workshop_modal_asset_category_layers";
                  switch (z.assetGroupType[t.ctx.wallpaper.assettypes[0]]) {
                    case "layers":
                      t.ctx.assetCategory.addClass("layers");
                      break;
                    case "effects":
                      (t.ctx.assetCategory.addClass("effects"),
                        (a = "ui_query_workshop_modal_asset_category_effects"));
                      break;
                    case "scripts":
                      (t.ctx.assetCategory.addClass("scripts"),
                        (a = "ui_query_workshop_modal_asset_category_scripts"));
                  }
                  i = r[a];
                  (i || ((r[a] = V.instant(a)), (i = r[a])),
                    t.ctx.assetCategory.text(i));
                }
                (t.ctx.avatar &&
                  (t.ctx.wallpaper.avatar
                    ? (t.ctx.avatar.show(),
                      t.ctx.avatar.attr("src", t.ctx.wallpaper.avatar))
                    : t.ctx.avatar.hide()),
                  _(t),
                  y(t));
              }
              var i, n;
            }
            function k(e, t) {
              ((e.ctx.wallpaper = t), w(e));
            }
            function x(e) {
              t = a.content.firstChild.cloneNode(!0);
              var t = angular.element(t);
              return (
                t.click(i),
                t.dblclick(i),
                (e.checkboxChecked = angular.element(
                  t[0].querySelector(".chkYes"),
                )),
                (e.checkboxNotChecked = angular.element(
                  t[0].querySelector(".chkNo"),
                )),
                t
              );
            }
            a.innerHTML = `<div class="checkBoxBase">
<div class="checkBoxOuter">
    <span class="fas fa-square checkBoxBackground"></span>
    <span>
        <span class="fas fa-check-square checkBox chkYes" style="display:none"></span>
        <span class="far fa-square checkBox chkNo"></span>
    </span>
</div>
</div>`;
            var S = {
                click: function (e) {
                  t ||
                    (m.wtMousecallback({
                      btn: "left",
                      context: e.currentTarget.ctx.wallpaper,
                      $event: e,
                    }),
                    window.safeApply(m));
                },
                dblclick: function (e) {
                  (m.wtMousecallback({
                    btn: "dbl",
                    context: e.currentTarget.ctx.wallpaper,
                    $event: e,
                  }),
                    window.safeApply(m));
                },
                contextmenu: function (e) {
                  (m.wtMousecallback({
                    btn: "right",
                    context:
                      e.currentTarget.ctx && e.currentTarget.ctx.wallpaper,
                    $event: e,
                  }),
                    window.safeApply(m));
                },
                folderclick: function (e) {
                  (e.currentTarget.ctx.editTitle.val(
                    e.currentTarget.ctx.wallpaper.title,
                  ),
                    e.currentTarget.ctx.title.hide(),
                    e.currentTarget.ctx.editTitle.show(),
                    e.stopPropagation(),
                    e.currentTarget.ctx.editTitle.focus());
                },
                folderkeyup: function (e) {
                  (13 !== e.which && 27 !== e.which) ||
                    (27 === e.which &&
                      e.currentTarget.ctx.editTitle.val(
                        e.currentTarget.ctx.wallpaper.title,
                      ),
                    e.currentTarget.ctx.editTitle.blur(),
                    window.safeApply(m));
                },
                folderblur: function (e) {
                  ((e.currentTarget.ctx.wallpaper.title =
                    e.currentTarget.ctx.editTitle.val()),
                    e.currentTarget.ctx.title.text(
                      e.currentTarget.ctx.wallpaper.title,
                    ),
                    e.currentTarget.ctx.editTitle.hide(),
                    e.currentTarget.ctx.title.show(),
                    window.safeApply(m));
                },
                toggleplaylist: function (e) {
                  e = angular
                    .element(e.currentTarget)
                    .closest(".browseWallpaperImage")[0].ctx.wallpaper;
                  (m.wtFlagcallback({ wallpaper: e }), window.safeApply(m));
                },
              },
              C = {
                click: function () {
                  ((f = !0), m.rebuildGallery(m.wtWallpapers));
                },
              };
            function E(e) {
              var t,
                a,
                i,
                n,
                o,
                r,
                s,
                l = m.$new(!0),
                c =
                  ((l.wallpaper = e),
                  angular.element(document.createElement("div"))),
                d =
                  ((c[0].ctx = l),
                  (c.ctx = l),
                  c.addClass("browseWallpaperImage"),
                  m.wtConfig &&
                    m.wtConfig.videosupport &&
                    ((d = angular.element(
                      document.createElement("video"),
                    )).addClass("videoBg"),
                    d.attr("autoplay", "autoplay"),
                    d.attr("muted", "muted"),
                    d.attr("loop", "loop"),
                    c.append(d),
                    (l.video = d)),
                  angular.element(document.createElement("img"))),
                d =
                  (d.attr("src", h),
                  d.addClass("translucentBox"),
                  c.append(d),
                  c.click(S.click),
                  c.dblclick(S.dblclick),
                  c.contextmenu(S.contextmenu),
                  angular.element(document.createElement("div"))),
                p = angular.element(document.createElement("div")),
                u = angular.element(document.createElement("div")),
                g = angular.element(document.createElement("div"));
              switch (
                ("folder" !== e.type
                  ? ((a = angular.element(
                      document.createElement("div"),
                    )).addClass("progressParent"),
                    (l.downloadElement = a).hide(),
                    c.append(a),
                    (a = {}),
                    ((s = b.content.firstChild.cloneNode(!0)).querySelector(
                      ".iconLabelPortrait",
                    ).textContent = V.instant(
                      "ui_browse_wallpaper_info_portrait",
                    )),
                    (s.querySelector(".iconLabelApproved").textContent =
                      V.instant("ui_browse_wallpaper_info_approved")),
                    (s.querySelector(".iconLabelFavorite").textContent =
                      V.instant("ui_browse_wallpaper_info_favorite")),
                    (s.querySelector(".iconLabelInstalled").textContent =
                      V.instant("ui_browse_wallpaper_info_installed")),
                    (s = angular.element(s)),
                    c.append((a.icons = s)),
                    "wtFlagcallback" in v &&
                      ((s = angular.element(document.createElement("div"))),
                      (t = x(a)),
                      s.addClass("checker"),
                      s.append(t),
                      d.append((a.checkbox = s)),
                      t.click(S.toggleplaylist)),
                    (l.info = a))
                  : (c.addClass("folder"),
                    (s = angular.element(document.createElement("div"))),
                    (t = angular.element(document.createElement("span"))),
                    (a = angular.element(document.createElement("span"))),
                    (i = angular.element(document.createElement("span"))),
                    (n = angular
                      .element(document.createElement("input"))
                      .attr("type", "text")),
                    e.folderIcon
                      ? ((o = e.folderIcon.replace("fa ", "fas ")),
                        (r = (e.folderIconOpen || e.folderIcon).replace(
                          "fa ",
                          "fas ",
                        )),
                        e.folderIconOpen &&
                          ((o += " folderClosed"), (r += " folderOpened")))
                      : ((o = "fas fa-folder folderClosed"),
                        (r = "fas fa-folder-open folderOpened")),
                    e.folderColor &&
                      ((o += " " + e.folderColor), (r += " " + e.folderColor)),
                    a.addClass(o + " fa-stack-1x"),
                    i.addClass(r + " fa-stack-1x"),
                    s.addClass("folderContainer"),
                    t.addClass("browseFolderStack fa-stack"),
                    n.addClass("folderTitleEdit"),
                    n.hide(),
                    p.addClass("editable"),
                    t.append(a),
                    t.append(i),
                    s.append(t),
                    c.append(s),
                    u.append(n),
                    (l.editTitle = n),
                    (u[0].ctx = l),
                    (n[0].ctx = l),
                    u.click(S.folderclick),
                    n.keyup(S.folderkeyup),
                    n.blur(S.folderblur)),
                d.addClass("wallpaperInfo"),
                p.addClass("caption"),
                m.wtTag)
              ) {
                case "assetworkshop":
                  var f = angular.element(document.createElement("span"));
                  (f.addClass("assetCategory"),
                    c.append(f),
                    (l.assetCategory = f));
                  break;
                case "exploreHighlights":
                case "homeHighlights":
                  f = angular.element(document.createElement("img"));
                  (f.addClass("avatarImg"),
                    u.append(f),
                    (l.avatar = f),
                    p.addClass("captionHighlights"));
              }
              ((l.title = g),
                u.append(g),
                p.append(u),
                d.append(p),
                c.append(d));
              e = angular.element(document.createElement("div"));
              return (e.addClass("selectBorder"), c.append(e), w(c), c);
            }
            c.contextmenu(S.contextmenu);
            var P,
              e,
              M = {
                findElement: function (e) {
                  if (1 === e.which && m.wtEnabledragdrop) {
                    var e = angular.element(
                        angular
                          .element(e.target)
                          .closest(".browseWallpaperImage")[0],
                      ),
                      t = e && e[0] && e[0].ctx;
                    if (
                      angular.isObject(t) &&
                      angular.isObject(t.wallpaper) &&
                      "downloadable" !== t.wallpaper.status
                    )
                      return { element: e, data: t.wallpaper };
                  }
                },
              };
            function A() {
              (P && P.element && P.element.remove(), (P = void 0));
            }
            function T(e) {
              ((e = angular.offsetToAncestor(e, c)),
                (e = {
                  left: Math.min(P.origin.left, e.left),
                  top: Math.min(P.origin.top, e.top),
                  width: Math.abs(P.origin.left - e.left),
                  height: Math.abs(P.origin.top - e.top),
                }));
              (e.top + e.height > c[0].scrollHeight &&
                (e.height = c[0].scrollHeight - e.top),
                P.element.css(e));
            }
            function R() {
              e && (e.cancel(), (e = void 0));
            }
            function B() {
              function e(e) {
                var t = z.getElementBounds(e);
                z.checkBoundsOverlap(i, t) && a.push(e);
              }
              var a = [],
                i = z.getElementBounds(P.element);
              return (angular.forEach(n, e), angular.forEach(p, e), a);
            }
            if (
              (H.registerInitiator(M),
              c.mousedown(function (a) {
                (R(),
                  (e = H.beginAutoScroll("browseScroll", c)),
                  1 === a.which &&
                    m.wtEnabledragdrop &&
                    a.target === c[0] &&
                    H.beginDragTest(a, {
                      start: function (e) {
                        var t;
                        ((t = a),
                          (e = e),
                          A(),
                          (t = angular.offsetToAncestor(t, c)),
                          (P = {
                            origin: t,
                            element: angular.element(
                              document.createElement("div"),
                            ),
                          }).element.addClass(
                            "browseWallpaperSelectionRectangle",
                          ),
                          c.append(P.element),
                          T(e));
                      },
                      finish: function () {
                        var e = B().map(function (e) {
                          return e.ctx.wallpaper;
                        });
                        (m.wtSelectioncallback({ items: e, $event: a }),
                          window.safeApply(m),
                          A());
                      },
                      cancel: function () {
                        A();
                      },
                      move: function (e) {
                        T(e);
                      },
                    }));
              }),
              c.contextmenu(function (e) {
                (m.wtMousecallback({ btn: "right", $event: e }),
                  window.safeApply(m));
              }),
              F.mouseup(R),
              !(
                "explore" === m.wtTag ||
                "exploreHighlights" === m.wtTag ||
                (m.wtConfig && m.wtConfig.removePseudoElements)
              ))
            )
              for (var I = 0; I < 20; ++I) {
                var O = angular.element(document.createElement("div"));
                (O.addClass("browseWallpaperImage pseudo"), g.push(O));
              }
            function D(e) {
              if (angular.isArray(e)) {
                for (var t = 0; t < Math.min(e.length, p.length); ++t)
                  k(p[t], e[t]);
                var a,
                  i,
                  n,
                  o = f
                    ? 0
                    : ((e) => {
                        if (!m.wtBlacklist) return 0;
                        for (var t = 0, a = 0; a < e.length; ++a)
                          e[a].authorsteamid &&
                            m.wtBlacklist.includes(e[a].authorsteamid) &&
                            ++t;
                        return t;
                      })(e),
                  r = p.length !== e.length || (0 < o && void 0 === d);
                if (
                  (0 === o && d && (d.detach(), (d = void 0)),
                  r &&
                    angular.forEach(g, function (e) {
                      e.detach();
                    }),
                  0 < u.length && p.length < e.length)
                ) {
                  for (
                    var s = Math.min(e.length - p.length, u.length), t = 0;
                    t < s;
                    ++t
                  )
                    (k(u[t], e[p.length]), p.push(u[t]), c.append(u[t]));
                  u.splice(0, s);
                }
                for (t = p.length; t < e.length; ++t) {
                  var l = E(e[t]);
                  (l.attr("id", "wpimg" + t), c.append(l), p.push(l));
                }
                if (e.length < p.length) {
                  for (t = e.length; t < p.length; ++t)
                    (u.push(p[t]), p[t].detach());
                  p.splice(e.length, p.length - e.length);
                }
                (void 0 === d &&
                  0 < o &&
                  ((n = m.$new(!0)),
                  ((a = angular.element(document.createElement("div")))[0].ctx =
                    n),
                  (a.ctx = n),
                  a.addClass("browseWallpaperImage"),
                  (i = angular.element(document.createElement("img"))).attr(
                    "src",
                    h,
                  ),
                  i.addClass("translucentBox"),
                  a.append(i),
                  (i = angular.element(document.createElement("div"))).addClass(
                    "browseWallpaperBlacklistInfo",
                  ),
                  a.append(i),
                  i.click(C.click),
                  (n.hint = i),
                  (d = a),
                  c.append(d)),
                  r &&
                    angular.forEach(g, function (e) {
                      c.append(e);
                    }),
                  (n = o),
                  d &&
                    d.ctx.hint.text(
                      V.instant("ui_browse_gallery_block_info", {
                        count: n,
                      }).toString(),
                    ),
                  0 < n
                    ? c.addClass("blacklistTruncated")
                    : c.removeClass("blacklistTruncated"));
              } else
                (angular.forEach(p, function (e) {
                  e.detach();
                }),
                  (u = p.concat(u)),
                  (p = []));
            }
            function W() {
              ("exploreHighlights" !== m.wtTag &&
                "homeHighlights" !== m.wtTag) ||
                p.forEach((e) => {
                  switch (e.ctx.wallpaper.category) {
                    case "creator":
                      var t =
                        m.wtSteamUserInfos &&
                        m.wtSteamUserInfos[e.ctx.wallpaper.itemid];
                      ((e.ctx.wallpaper.queryTitle = t && t.name),
                        (e.ctx.wallpaper.avatar =
                          (t && t.avatar) || "images/noavatar.jpg"));
                      break;
                    case "collection":
                      delete e.ctx.wallpaper.avatar;
                  }
                  w(e);
                });
            }
            ((m.rebuildGallery = D),
              m.$watch("wtWallpapers", function (e, t) {
                ((angular.isArray(e) &&
                  angular.isArray(t) &&
                  e.length === t.length &&
                  0 !== e.length &&
                  0 !== t.length &&
                  e[0].workshopid === t[0].workshopid) ||
                  (f = !1),
                  D(e),
                  W());
              }),
              m.$watch("wtFolders", function (e) {
                if (
                  (angular.forEach(n, function (e) {
                    e.remove();
                  }),
                  (n = []),
                  angular.isArray(e))
                )
                  for (var t = e.length - 1; 0 <= t; --t) {
                    var a = E(e[t]);
                    (a.attr("id", "wpfolder" + t), c.prepend(a), n.push(a));
                  }
              }),
              m.$watch(
                "wtWallpaperFlags",
                function () {
                  angular.forEach(p, y);
                },
                !0,
              ),
              m.$watch("wtSelection", function (t) {
                var a;
                (o && o.ctx.wallpaper === t) ||
                  ((a = !1),
                  angular.forEach(p, function (e) {
                    e.ctx.wallpaper === t && (l(e), (a = !0));
                  }),
                  a) ||
                  l();
              }),
              m.$watch(
                "wtMultiselection",
                function () {
                  (angular.forEach(p, function (e) {
                    _(e);
                  }),
                    angular.forEach(n, function (e) {
                      _(e);
                    }));
                },
                !0,
              ),
              m.$watch("wtTag", function (e, t) {
                e && t && e !== t && (D(), (u = []), D(m.wtWallpapers), W());
              }),
              m.$watch(
                "wtSteamUserInfos",
                function () {
                  W();
                },
                !0,
              ),
              m.$on("$destroy", function () {
                (H.unregisterInitiator(M),
                  angular.forEach(s, function (e) {
                    e.$destroy();
                  }),
                  (s = []));
              }),
              m.$on("onInternalDropStart", function () {
                j(function () {
                  t = !0;
                });
              }),
              m.$on("onInternalDropStop", function () {
                j(function () {
                  t = !1;
                });
              }));
          },
        };
      },
    ];

    // Dependency closure: BrowseWallpapersCtrl opens the modal types
    // "steamLogin" / "addDownloadAccount"; their templates and controllers are
    // already in this overlay (stage 1 + stage 2 templates), so the service that
    // routes to them has to be patched too, otherwise those dialogs are dead
    // when the overlay runs on top of a pristine scripts.js.
    var modals = [
    "$q",
    "$rootScope",
    "$timeout",
    "$uibModal",
    function (i, o, r, s) {
      var l = 0,
        n = this;
      ((this.open = function (e, t, a) {
        var i = {
          animation: !0,
          backdrop: "static",
          backdropClass: a && a.backdropClass,
          resolve: t,
        };
        switch (e) {
          case "steamLogin":
            ((i.templateUrl = "views/modals/steamloginmodal.html"),
              (i.controller = "SteamLoginModalCtrl"),
              (i.size = "md"));
            break;
          case "addDownloadAccount":
            ((i.templateUrl = "views/modals/addaccountmodal.html"),
              (i.controller = "AddAccountModalCtrl"),
              (i.size = "md"));
            break;
          
          case "editorWelcome":
            ((i.templateUrl = "views/modals/editorwelcomemodal.html"),
              (i.controller = "EditorWelcomeModalCtrl"));
            break;
          case "editorOpenWallpaper":
            ((i.templateUrl = "views/modals/editoropenwallpapermodal.html"),
              (i.controller = "EditorOpenWallpaperModalCtrl"),
              (i.windowClass = "modal-dialog-full"));
            break;
          case "editorSteamPublish":
            ((i.templateUrl = "views/modals/editorsteampublishmodal.html"),
              (i.controller = "EditorSteamPublishModalCtrl"),
              (i.size = "lg"));
            break;
          case "editorImportModel":
            ((i.templateUrl = "views/modals/editorimportmodelmodal.html"),
              (i.controller = "EditorImportModelModalCtrl"),
              (i.windowClass = "modal-dialog-allow-overflow"),
              (i.size = "mlg"));
            break;
          case "editorProjectSettings":
            ((i.templateUrl = "views/modals/editorprojectsettingsmodal.html"),
              (i.controller = "EditorProjectSettingsModalCtrl"),
              (i.size = "slg"));
            break;
          case "editorTemplateWizard":
            ((i.templateUrl = "views/modals/editortemplatewizardmodal.html"),
              (i.controller = "EditorTemplateWizardModalCtrl"));
            break;
          case "editorWorkshopRules":
            ((i.resolve = { data: {} }),
              (i.templateUrl = "views/modals/editorworkshoprules.html"),
              (i.controller = "EditorWorkshopRulesModalCtrl"));
            break;
          case "editorEffectList":
            ((i.templateUrl = "views/modals/editoreffectlistmodal.html"),
              (i.controller = "EditorEffectListModalCtrl"),
              (i.size = "xlg"));
            break;
          case "editorParticleEditor":
            ((i.templateUrl = "views/modals/editorparticleeditormodal.html"),
              (i.controller = "EditorParticleEditorModalCtrl"),
              (i.size = "xlg"));
            break;
          case "editorModelEditor":
            ((i.templateUrl = "views/modals/editormodeleditormodal.html"),
              (i.controller = "EditorModelEditorModalCtrl"),
              (i.size = "xlg"));
            break;
          case "editorMaterials":
            ((i.templateUrl = "views/modals/editormaterialsmodal.html"),
              (i.controller = "EditorMaterialsModalCtrl"),
              (i.windowClass = "modal-dialog-full"));
            break;
          case "editorRating":
            ((i.templateUrl = "views/modals/editorratingmodal.html"),
              (i.controller = "EditorRatingModalCtrl"),
              (i.size = "mlg"));
            break;
          case "editorUserProperties":
            ((i.templateUrl = "views/modals/editoruserpropertiesmodal.html"),
              (i.controller = "EditorUserPropertiesModalCtrl"));
            break;
          case "editorUserPropertyDetails":
            ((i.templateUrl =
              "views/modals/editoruserpropertydetailsmodal.html"),
              (i.controller = "EditorUserPropertyDetailsModalCtrl"));
            break;
          case "editorSelectAssets":
            ((i.templateUrl = "views/modals/editorselectassetsmodal.html"),
              (i.controller = "EditorSelectAssetsModalCtrl"));
            break;
          case "editorAnimationOptions":
            ((i.templateUrl = "views/modals/editoranimationoptionsmodal.html"),
              (i.controller = "EditorAnimationOptionsModalCtrl"));
            break;
          case "editorAnimationEvents":
            ((i.templateUrl = "views/modals/editoranimationeventsmodal.html"),
              (i.controller = "EditorAnimationEventsModalCtrl"));
            break;
          case "editorAnimationHelp":
            ((i.templateUrl = "views/modals/editoranimationhelpmodal.html"),
              (i.controller = "GenericConfirmModalCtrl"));
            break;
          case "editorBoneConstraints":
            ((i.templateUrl = "views/modals/editorboneconstraintsmodal.html"),
              (i.controller = "EditorBoneConstraintsModalCtrl"));
            break;
          case "editorBoneBlendRules":
            ((i.templateUrl = "views/modals/editorboneblendrulesmodal.html"),
              (i.controller = "EditorBoneBlendRulesModalCtrl"));
            break;
          case "editorSettings":
            ((i.templateUrl = "views/modals/editorsettingsmodal.html"),
              (i.controller = "EditorSettingsModalCtrl"));
            break;
          case "editorDeleteUploads":
            ((i.templateUrl = "views/modals/editordeleteuploadsmodal.html"),
              (i.controller = "EditorDeleteUploadsModalCtrl"),
              (i.windowClass = "modal-dialog-full"));
            break;
          case "editorCharacterSeparation":
            ((i.templateUrl =
              "views/modals/editorcharacterseparationmodal.html"),
              (i.controller = "EditorCharacterSeparationModalCtrl"),
              (i.windowClass = "modal-dialog-full"));
            break;
          case "editorExpressionMatrix":
            ((i.templateUrl = "views/modals/editorexpressionmatrixmodal.html"),
              (i.controller = "EditorExpressionMatrixModalCtrl"));
            break;
          case "editorBlendShapeSettings":
            ((i.templateUrl =
              "views/modals/editorblendshapesettingsmodal.html"),
              (i.controller = "EditorBlendShapeSettingsModalCtrl"));
            break;
          case "editorExport":
            ((i.templateUrl = "views/modals/editorexportmodal.html"),
              (i.controller = "EditorExportModalCtrl"));
            break;
          case "editorEula":
            ((i.templateUrl = "views/modals/editoreulamodal.html"),
              (i.controller = "EditorEULAModalCtrl"));
            break;
          case "editorCleanProject":
            ((i.templateUrl = "views/modals/editorcleanproject.html"),
              (i.controller = "EditorCleanProjectModalCtrl"));
            break;
          case "editorSystemResources":
            ((i.templateUrl = "views/modals/editorsystemresourcesmodal.html"),
              (i.controller = "EditorSystemResourcesModalCtrl"));
            break;
          case "openFromUrl":
            ((i.templateUrl = "views/modals/openfromurlmodal.html"),
              (i.controller = "OpenFromUrlModalCtrl"));
            break;
          case "changelog":
            ((i.templateUrl = "views/modals/settingschangelogmodal.html"),
              (i.controller = "SettingsChangelogModalCtrl"),
              (i.size = "lg"));
            break;
          case "settingsPerApplication":
            ((i.templateUrl = "views/modals/settingsperapplicationmodal.html"),
              (i.controller = "SettingsPerApplicationModalCtrl"));
            break;
          case "settingsHotkeys":
            ((i.templateUrl = "views/modals/settingshotkeysmodal.html"),
              (i.controller = "SettingsHotkeysModalCtrl"));
            break;
          case "settingsPlugin":
            ((i.templateUrl = "views/modals/settingspluginmodal.html"),
              (i.controller = "SettingsPluginModalCtrl"));
            break;
          case "settingsMediaBlocklist":
            ((i.templateUrl = "views/modals/settingsmediablocklistmodal.html"),
              (i.controller = "SettingsMediaBlocklistCtrl"));
            break;
          case "settingsManageMonitors":
            ((i.templateUrl = "views/modals/settingsmanagemonitorsmodal.html"),
              (i.controller = "SettingsManageMonitorsCtrl"));
            break;
          case "browseCollections":
            ((i.templateUrl = "views/modals/browsecollectionsmodal.html"),
              (i.controller = "BrowseCollectionsModalCtrl"));
            break;
          case "browsePlaylistSettings":
            ((i.templateUrl = "views/modals/browseplaylistsettingsmodal.html"),
              (i.controller = "BrowsePlaylistSettingsModalCtrl"));
            break;
          case "browseSplitMonitor":
            ((i.templateUrl = "views/modals/browsesplitmonitormodal.html"),
              (i.controller = "BrowseSplitMonitorModalCtrl"));
            break;
          case "browseWallpaperSharePreset":
            ((i.templateUrl =
              "views/modals/browsewallpapersharepresetmodal.html"),
              (i.controller = "BrowseWallpaperSharePresetModalCtrl"));
            break;
          case "browseWallpaperWorkshopInfo":
            ((i.templateUrl =
              "views/modals/browsewallpaperworkshopinfomodal.html"),
              (i.controller = "BrowseWallpaperWorkshopInfoModalCtrl"));
            break;
          case "browseReport":
            ((i.templateUrl = "views/modals/browsereportmodal.html"),
              (i.controller = "BrowseReportModalCtrl"));
            break;
          case "browseExploreCreateQuery":
            ((i.templateUrl =
              "views/modals/browseexplorecreatequerymodal.html"),
              (i.controller = "BrowseExploreCreateQueryModalCtrl"));
            break;
          case "browseAssignHotkey":
            ((i.templateUrl = "views/modals/browseassignhotkey.html"),
              (i.controller = "BrowseAssignHotkeyModalCtrl"));
            break;
          case "browseSetDefaults":
            ((i.templateUrl = "views/modals/browsesetdefaultsmodal.html"),
              (i.controller = "BrowseSetDefaultsModalCtrl"));
            break;
          case "browseResolutionSettings":
            ((i.templateUrl =
              "views/modals/browseresolutionsettingsmodal.html"),
              (i.controller = "BrowseResolutionSettingsModalCtrl"));
            break;
          case "browseMobileUpload":
            ((i.templateUrl = "views/modals/browsemobileuploadmodal.html"),
              (i.controller = "BrowseMobileUploadModalCtrl"),
              (i.size = "mlg"));
            break;
          case "browseMobilePermissionsMissing":
            ((i.templateUrl =
              "views/modals/browsemobilepermissionsmissing.html"),
              (i.controller = "GenericConfirmModalCtrl"));
            break;
          case "browseAssignUserShortcut":
            ((i.templateUrl = "views/modals/browseassignusershortcut.html"),
              (i.controller = "BrowseAssignUserShortcutModalCtrl"));
            break;
          case "genericConfirm":
            ((i.templateUrl = "views/modals/genericconfirmmodal.html"),
              (i.controller = "GenericConfirmModalCtrl"));
            break;
          case "ageGate":
            ((i.templateUrl = "views/modals/agegatemodal.html"),
              (i.controller = "AgeGateModalCtrl"));
            break;
          case "dlcPrompt":
            ((i.templateUrl = "views/modals/dlcpromptmodal.html"),
              (i.controller = "DLCPromptModalCtrl"));
            break;
          case "queryWorkshop":
            ((i.templateUrl = "views/modals/queryworkshopmodal.html"),
              (i.controller = "QueryWorkshopModalCtrl"),
              (i.windowClass = "modal-dialog-flex"));
        }
        function n() {
          ((_preventModalClose = !1),
            r(function () {
              o.$broadcast("previewtoggle", -1);
            }, 350),
            o.$broadcast("modalVisible", --l));
        }
        a && a.size && (i.size = a.size);
        t = s.open(i);
        return (
          t.opened.then(function () {
            (o.$broadcast("previewtoggle", 1),
              o.$broadcast("modalVisible", ++l));
          }),
          t.result.then(n).catch(n),
          t.result
        );
      }),
        (this.setPreventModalClose = function (e) {
          _preventModalClose = e;
        }),
        (this.showHighPriorityWarning = function (e, t) {
          var a = i.when();
          return (a =
            e && !t.hasshownhighprioritywarning
              ? n
                  .open("genericConfirm", {
                    data: {
                      title: "ui_settings_highpriority_warning_header",
                      message: "ui_settings_highpriority_warning",
                      okVisible: !0,
                      cancelVisible: !0,
                    },
                  })
                  .then(function () {
                    t.hasshownhighprioritywarning = !0;
                  })
              : a);
        }),
        (this.isAnyModalVisible = function () {
          return 0 < l;
        }));
    },
  ];

    var browseWallpapers = [
      "$templateRequest",
      "$document",
      "$compile",
      "$sanitize",
      "$filter",
      "$translate",
      "$parse",
      "$timeout",
      "$q",
      "$rootScope",
      "$scope",
      "$location",
      "contextMenu",
      "utils",
      "modals",
      "host",
      "skin",
      "dragdrop",
      "localeLoaderSupport",
      function (e, c, M, n, o, O, A, m, D, T, W, R, B, V, F, j, I, U, G) {
        var v,
          q,
          N = ["76561197975619619", "76561198008830389", "76561198447701318"],
          Q = ["76561197975619619", "76561197980238112", "76561199522126595"],
          K = angular.element("#PlaylistContainer"),
          Y = angular.element("#PlaylistContainerRow"),
          X = angular.element("#WallpaperBrowseInner1"),
          J = {},
          Z = !1,
          ee = {},
          te = !1,
          d = [],
          ae = 1,
          ie = !0,
          ne = !1,
          oe = 0,
          re = [],
          se = { normal: 650, backup: 1e3 },
          h = {},
          b = {},
          le = {},
          ce = {},
          de = [],
          pe = [],
          ue = [],
          u = { current: 1, count: 1, pages: [], visible: !0 },
          r = { current: 1, count: 1, pages: [], visible: !1 },
          ge = angular.copy(u),
          fe = !1;
        let me = "trend_week";
        W.sourceIsPluginSettings = false;
        W.categoryOptions = [
          { value: "", label: "ui_browse_filter_all" },
          { value: "Wallpaper", label: "ui_browse_filter_category_wallpaper" },
          { value: "Preset", label: "ui_browse_filter_category_preset" },
          { value: "Asset", label: "ui_wep_filter_category_asset" }
        ];
        W.typeOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Scene", label: "ui_browse_filter_type_scene" },
          { value: "Video", label: "ui_browse_filter_type_video" },
          { value: "Application", label: "ui_browse_filter_type_application" },
          { value: "Web", label: "ui_browse_filter_type_web" }
        ];
        W.ageRatingOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Everyone", label: "ui_wep_age_everyone" },
          { value: "Questionable", label: "ui_wep_age_questionable" },
          { value: "Mature", label: "ui_wep_age_mature" }
        ];
        W.resolutionOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Standard Definition", label: "ui_wep_res_sd" },
          { value: "1280 x 720", label: "720p" },
          { value: "1366 x 768", label: "768p" },
          { value: "1920 x 1080", label: "1080p" },
          { value: "2560 x 1440", label: "1440p" },
          { value: "3840 x 2160", label: "4K" },
          { value: "Ultrawide Standard Definition", label: "ui_wep_res_uw_sd" },
          { value: "Ultrawide 2560 x 1080", label: "ui_wep_res_uw_1080p" },
          { value: "Ultrawide 3440 x 1440", label: "ui_wep_res_uw_1440p" },
          { value: "Dual Standard Definition", label: "ui_wep_res_dual_sd" },
          { value: "Dual 3840 x 1080", label: "ui_wep_res_dual_1080p" },
          { value: "Dual 5120 x 1440", label: "ui_wep_res_dual_1440p" },
          { value: "Dual 7680 x 2160", label: "ui_wep_res_dual_4k" },
          { value: "Triple Standard Definition", label: "ui_wep_res_triple_sd" },
          { value: "Triple 4096 x 768", label: "ui_wep_res_triple_768p" },
          { value: "Triple 5760 x 1080", label: "ui_wep_res_triple_1080p" },
          { value: "Triple 7680 x 1440", label: "ui_wep_res_triple_1440p" },
          { value: "Triple 11520 x 2160", label: "ui_wep_res_triple_4k" },
          { value: "Portrait Standard Definition", label: "ui_wep_res_portrait_sd" },
          { value: "Portrait 720 x 1280", label: "ui_wep_res_portrait_720p" },
          { value: "Portrait 1080 x 1920", label: "ui_wep_res_portrait_1080p" },
          { value: "Portrait 1440 x 2560", label: "ui_wep_res_portrait_1440p" },
          { value: "Portrait 2160 x 3840", label: "ui_wep_res_portrait_4k" },
          { value: "Dynamic resolution", label: "ui_wep_res_dynamic" },
          { value: "Other resolution", label: "ui_wep_res_other" }
        ];
        W.assetTypeOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Particle", label: "ui_workshop_tags_asset_type_particle" },
          { value: "Image", label: "ui_workshop_tags_asset_type_image" },
          { value: "Sound", label: "ui_workshop_tags_asset_type_sound" },
          { value: "Model", label: "ui_wep_asset_type_model" },
          { value: "Text", label: "ui_workshop_tags_asset_type_text" },
          { value: "Sprite", label: "ui_wep_asset_type_sprite" },
          { value: "Fullscreen", label: "ui_workshop_tags_asset_type_fullscreen" },
          { value: "Composite", label: "ui_workshop_tags_asset_type_composite" },
          { value: "Script", label: "ui_workshop_tags_asset_type_script" },
          { value: "Effect", label: "ui_wep_asset_type_effect" },
          { value: "Scripted Layer", label: "ui_wep_asset_type_scripted_layer" }
        ];
        W.assetGenreOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Audio Visualizer", label: "ui_workshop_tags_audio_visualizer" },
          { value: "Background", label: "ui_workshop_tags_background" },
          { value: "Character", label: "ui_workshop_tags_character" },
          { value: "Clock", label: "ui_workshop_tags_clock" },
          { value: "Fire", label: "ui_workshop_tags_fire" },
          { value: "Interactive", label: "ui_workshop_tags_interactive" },
          { value: "Magic", label: "ui_workshop_tags_magic" },
          { value: "Post Processing", label: "ui_workshop_tags_post_processing" },
          { value: "Smoke", label: "ui_workshop_tags_smoke" },
          { value: "Space", label: "ui_workshop_tags_space" }
        ];
        W.scriptTypeOptions = [
          { value: "", label: "ui_wep_filter_any" },
          { value: "Boolean", label: "ui_wep_script_boolean" },
          { value: "Number", label: "ui_wep_script_number" },
          { value: "Vec2", label: "ui_wep_script_vec2" },
          { value: "Vec3", label: "ui_wep_script_vec3" },
          { value: "Vec4", label: "ui_wep_script_vec4" },
          { value: "String", label: "ui_wep_script_string" },
          { value: "No Animation", label: "ui_wep_script_no_animation" },
          { value: "Oversized", label: "ui_wep_script_oversized" }
        ];
        W.miscTagsList = [
          "Approved",
          "Audio responsive",
          "3D",
          "Customizable",
          "Puppet Warp",
          "HDR",
          "Media Integration",
          "User Shortcut",
          "Video Texture",
          "Asset Pack"
        ];
        W.genreTagsList = [
          "Abstract", "Animal", "Anime", "Cartoon", "CGI", "Cyberpunk",
          "Fantasy", "Game", "Girls", "Guys", "Landscape", "Medieval",
          "Memes", "MMD", "Music", "Nature", "Pixel art", "Relaxing",
          "Retro", "Sci-Fi", "Sports", "Technology", "Television",
          "Vehicle", "Unspecified"
        ];
        function createFilterHelper() {
          return {
            category: "",
            type_tag: "",
            resolution: "",
            age_rating: "",
            asset_type: "",
            asset_genre: "",
            script_type: "",
            incompatible: false,
            misc_tags: [],
            excluded_misc_tags: [],
            genre_tags: [],
            excluded_genre_tags: []
          };
        }
        W.filterHelperBySource = {
          installed: createFilterHelper(),
          workshop: createFilterHelper()
        };
        W.filterHelper = W.filterHelperBySource.installed;
        W.filterHideAssets = true;
        W.onFilterChange = function () {
          if (W.sourceIsWorkshop) {
            ge.current = 1;
            if (W.pagination) W.pagination.current = 1;
            P();
          } else if (W.sourceIsInstalled) {
            u.current = 1;
            if (W.pagination) W.pagination.current = 1;
            z();
          }
        };
        W.$watchGroup(["source", "filterHelper.incompatible"], function (newVal, oldVal) {
          if (newVal[0] === oldVal[0] && newVal[1] !== oldVal[1]) {
            W.onFilterChange();
          }
        });
        W.toggleIncompatible = function () {
          W.filterHelper.incompatible = !W.filterHelper.incompatible;
          W.onFilterChange();
        };
        W.toggleMiscTag = function (tag) {
          var inc = W.filterHelper.misc_tags;
          var exc = W.filterHelper.excluded_misc_tags;
          var isInc = inc.includes(tag);
          var isExc = exc.includes(tag);
          if (isExc) {
            exc.splice(exc.indexOf(tag), 1);
          } else if (isInc) {
            inc.splice(inc.indexOf(tag), 1);
            exc.push(tag);
          } else {
            inc.push(tag);
          }
          W.onFilterChange();
        };
        W.toggleGenreTag = function (tag) {
          var inc = W.filterHelper.genre_tags;
          var exc = W.filterHelper.excluded_genre_tags;
          var isInc = inc.includes(tag);
          var isExc = exc.includes(tag);
          if (isExc) {
            exc.splice(exc.indexOf(tag), 1);
          } else if (isInc) {
            inc.splice(inc.indexOf(tag), 1);
            exc.push(tag);
          } else {
            inc.push(tag);
          }
          W.onFilterChange();
        };
        W.getTagState = function (type, tag) {
          var inc = type === "misc" ? W.filterHelper.misc_tags : W.filterHelper.genre_tags;
          var exc = type === "misc" ? W.filterHelper.excluded_misc_tags : W.filterHelper.excluded_genre_tags;
          if (inc.includes(tag)) return "included";
          if (exc.includes(tag)) return "excluded";
          return "off";
        };
        // Display-only translation for tag chips. The filter value itself stays
        // the original English Workshop tag. Wallpaper Engine ships no locale
        // strings for a few special tags, so they fall back to the ui_wep_*
        // table instead of rendering the raw ui_workshop_tags_* key.
        W.tagLabelKeys = {
          "3D": "ui_wep_tag_3d",
          "Puppet Warp": "ui_wep_tag_puppet_warp",
          "HDR": "ui_wep_tag_hdr",
          "Media Integration": "ui_wep_tag_media_integration",
          "User Shortcut": "ui_wep_tag_user_shortcut",
          "Video Texture": "ui_wep_tag_video_texture"
        };
        W.getTagLabel = function (tag) {
          var key = W.tagLabelKeys[tag];
          if (key) {
            var translated = O.instant(key);
            if (translated && translated !== key) return translated;
          }
          return V.translateTagInstant(tag);
        };
        W.getWallpaperWorkshopId = function (w) {
          if (!w) return "";
          if (w.workshopid) return String(w.workshopid);
          if (w.pubfileid) return String(w.pubfileid);
          if (w.id && /^\d{6,}$/.test(String(w.id))) return String(w.id);
          var str = (w.file || "") + " " + (w.project || "") + " " + (w.pkgfile || "");
          var m = str.match(/\b(\d{6,})\b/);
          if (m) return m[1];
          return "";
        };
        W.getMetaForWallpaper = function (w) {
          if (!w) return null;
          var id = W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(w) : (w.workshopid || w.pubfileid || w.id);
          if (W.installedMetadata) {
            if (id && W.installedMetadata[String(id)]) return W.installedMetadata[String(id)];
            if (w.title && W.installedMetadata[w.title]) return W.installedMetadata[w.title];
            if (w.title || id) {
              for (var k in W.installedMetadata) {
                var itm = W.installedMetadata[k];
                if (itm && ((id && (itm.pubfileid === String(id) || itm.workshopid === String(id) || k === String(id))) || (w.title && itm.title === w.title))) {
                  return itm;
                }
              }
            }
          }

          if (W.sourceIsWorkshop && (w.author || w.file_size || (w.tags && w.tags !== "Everyone,Local"))) {
            return w;
          }
          return null;
        };
        W.isWallpaperInstalled = function (itemOrId) {
          if (!itemOrId) return false;
          var widStr = "";
          if (typeof itemOrId === "object") {
            widStr = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(itemOrId) : (itemOrId.workshopid || itemOrId.id || ""));
            if (!widStr && itemOrId.file) {
              var mWid = itemOrId.file.match(/(?:myprojects|workshop)[\\/](\d+)/i);
              if (mWid) widStr = mWid[1];
            }
            if (!widStr) {
              if (itemOrId.local === true && (!itemOrId.file || !itemOrId.file.startsWith("workshop/"))) return true;
              if (itemOrId.file && (itemOrId.file.indexOf("myprojects") !== -1 || itemOrId.file.indexOf("projects") !== -1 || itemOrId.file.indexOf("custom") !== -1) && !itemOrId.file.startsWith("workshop/")) return true;
            }
          } else {
            widStr = String(itemOrId);
          }
          if (widStr) {
            if (W.wallpapers && angular.isArray(W.wallpapers)) {
              for (var i = 0; i < W.wallpapers.length; i++) {
                var w = W.wallpapers[i];
                if (w && ((W.getWallpaperWorkshopId && W.getWallpaperWorkshopId(w) === widStr) || String(w.workshopid) === widStr)) return true;
              }
            }
            if (W.activeDownloads && W.activeDownloads[widStr]) {
              var task = W.activeDownloads[widStr];
              if (task && (task.phase === "completed" || task.phase === "done")) return true;
            }
            if (window.WengineHelper && window.WengineHelper.isWallpaperInstalled && window.WengineHelper.isWallpaperInstalled(widStr)) {
              return true;
            }
          }
          return false;
        };
        W.workerRunning = false;
        W.downloadAccounts = {
          accounts: [
            { username: "Auto", is_auto: true, is_custom: false, has_password: false },
          ],
          selected_index: 0,
        };
        W.steamAuthUser = {
          logged_in: false,
          persona_name: null,
          steamid: null,
          avatar_url: null,
        };
        W.refreshPluginData = function () {
          if (!window.WengineHelper) return;
          if (W.fetchWorkerMetadata) W.fetchWorkerMetadata();
          window.WengineHelper.ping().then(function (alive) {
            m(function () {
              W.workerRunning = alive;
            });
          });
          window.WengineHelper.getAuthStatus().then(function (res) {
            m(function () {
              W.steamAuthUser = res;
            });
          });
          window.WengineHelper.getAccounts().then(function (res) {
            m(function () {
              W.downloadAccounts = res;
            });
          });
          window.WengineHelper.getPluginStatus().then(function (st) {
            if (st) {
              m(function () {
                W.pluginStatus = st;
                W.pluginsReady = (st.ready === true);
              });
            }
          });
        };
        W.refreshSteamAuthStatus = W.refreshPluginData;
        W.selectDownloadAccount = function (index) {
          if (!window.WengineHelper) return;
          window.WengineHelper.selectAccount(index).then(function () {
            W.refreshPluginData();
          });
        };
        W.removeDownloadAccount = function (acc, evt) {
          if (evt) {
            evt.stopPropagation();
            evt.preventDefault();
          }
          if (!window.WengineHelper || acc.is_auto || acc.username === "Auto" || !acc.is_custom) return;
          window.WengineHelper.removeAccount(acc.username).then(function () {
            W.refreshPluginData();
          });
        };
        W.openAddAccountModal = function () {
          F.open("addDownloadAccount").then(function (res) {
            if (res) {
              W.refreshPluginData();
              if (W.sourceIsWorkshop) P();
              if (W.sourceIsInstalled) z();
            }
          });
        };
        
        W.openSteamLoginModal = function () {
          var onDone = function () {
            W.refreshPluginData();
            if (W.fetchWorkerMetadata) W.fetchWorkerMetadata();
          };
          F.open("steamLogin").then(onDone, onDone).catch(onDone);
        };
        W.$on("steamAuthChanged", function () {
          W.refreshPluginData();
        });
        W.logoutSteamAuth = function () {
          if (!window.WengineHelper) return;
          fetch(window.WengineHelper.url + "/api/auth/logout", { method: "POST" })
            .then(function () {
              m(function () {
                W.steamAuthUser = { logged_in: false, persona_name: null, steamid: null, avatar_url: null };
              });
              W.refreshPluginData();
            });
        };


















        W._trulyAppliedWallpapers = W._trulyAppliedWallpapers || {};
        W._trulyAppliedScreensavers = W._trulyAppliedScreensavers || {};

        // "Applied" means committed to Wallpaper Engine, not merely selected or
        // previewed: selecting a wallpaper writes W.wallpaperConfig.selectedwallpapers
        // immediately, so only this snapshot may be trusted by the delete guard.
        function snapshotAppliedConfig() {
          if (W.wallpaperConfig && W.wallpaperConfig.selectedwallpapers) {
            W._trulyAppliedWallpapers = angular.copy(W.wallpaperConfig.selectedwallpapers);
          }
          if (W.wallpaperConfigScreensaver && W.wallpaperConfigScreensaver.selectedwallpapers) {
            W._trulyAppliedScreensavers = angular.copy(W.wallpaperConfigScreensaver.selectedwallpapers);
          }
        }

        function extractWorkshopId(item, file) {
          if (item) {
            var wid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(item) : (item.workshopid || item.pubfileid || item.id || ""));
            if (wid) return String(wid);
          }
          var f = file || (item && (item.file || item.pkgfile)) || "";
          if (f) {
            var m = String(f).match(/(?:myprojects|workshop|content[\\/]431960)[\\/](\d+)/i);
            if (m) return m[1];
          }
          return "";
        }

        function normalizePath(p) {
          if (!p) return "";
          var s = String(p).replace(/\\/g, "/").toLowerCase().trim();
          s = s.replace(/\/(?:project\.json|scene\.pkg)$/i, "");
          s = s.replace(/\/+$/, "");
          return s;
        }

        function wallpaperMatchesItem(w, targetItem, targetWid, targetF) {
          if (!w) return false;
          if (targetItem && w === targetItem) return true;
          var tWid = targetWid || extractWorkshopId(targetItem, targetF);
          var wWid = extractWorkshopId(w, w.file);
          if (tWid && wWid && String(wWid) === String(tWid)) return true;
          var wNorm = normalizePath(w.file || w.pkgfile);
          var targetNorm = normalizePath(targetF || (targetItem && (targetItem.file || targetItem.pkgfile)));
          if (wNorm && targetNorm) {
            if (wNorm === targetNorm) return true;
            if (wNorm.endsWith("/" + targetNorm) || targetNorm.endsWith("/" + wNorm)) return true;
          }
          return false;
        }

        function isWallpaperTrulyApplied(targetItem) {
          if (!targetItem) return false;
          var targetWid = extractWorkshopId(targetItem, targetItem.file);
          var targetF = targetItem.file || targetItem.pkgfile || "";

          var checkAppliedConfig = function (appliedMap) {
            if (!appliedMap) return false;
            for (var loc in appliedMap) {
              if (Object.prototype.hasOwnProperty.call(appliedMap, loc)) {
                var sel = appliedMap[loc];
                if (!sel) continue;
                if (wallpaperMatchesItem(sel, targetItem, targetWid, targetF)) {
                  return true;
                }
                if (sel.playlist && angular.isArray(sel.playlist.items)) {
                  for (var pi = 0; pi < sel.playlist.items.length; pi++) {
                    var pItem = sel.playlist.items[pi];
                    var pW = (pItem && pItem.wallpaper) ? pItem.wallpaper : pItem;
                    if (pW && wallpaperMatchesItem(pW, targetItem, targetWid, targetF)) {
                      return true;
                    }
                  }
                }
              }
            }
            return false;
          };

          if (checkAppliedConfig(W._trulyAppliedWallpapers)) return true;
          if (checkAppliedConfig(W._trulyAppliedScreensavers)) return true;

          return false;
        }

        function isWallpaperActive(targetItem) {
          return isWallpaperTrulyApplied(targetItem);
        }

        function revertPreviewIfActive(targetItem) {
          if (!targetItem) return false;
          var targetWid = extractWorkshopId(targetItem, targetItem.file);
          var targetF = targetItem.file || targetItem.pkgfile || "";

          var isMatch = function (obj) {
            return wallpaperMatchesItem(obj, targetItem, targetWid, targetF);
          };

          var revertedAny = false;
          var allMons = (typeof ze === "function" ? ze() : (W.monitors || []));
          for (var i = 0; i < allMons.length; i++) {
            var mon = allMons[i];
            if (!mon) continue;
            var monMatches = isMatch(mon.wallpaper);
            var cfgMatches = W.wallpaperConfig && W.wallpaperConfig.selectedwallpapers && isMatch(W.wallpaperConfig.selectedwallpapers[mon.location]);

            if (monMatches || cfgMatches) {
              revertedAny = true;
              var orig = W._trulyAppliedWallpapers && W._trulyAppliedWallpapers[mon.location];
              if (orig && orig.file) {
                var origItem = (typeof p === "function" ? p(orig.file) : null) ||
                               (typeof He === "function" ? He(extractWorkshopId(null, orig.file)) : null);
                mon.wallpaper = origItem || null;
                if (W.wallpaperConfig && W.wallpaperConfig.selectedwallpapers) {
                  W.wallpaperConfig.selectedwallpapers[mon.location] = angular.copy(orig);
                }
                if (j && j.callDeferred) {
                  j.callDeferred("browseWallpaperObject", "selectWallpaper", orig.file, mon.location);
                }
              } else {
                mon.wallpaper = void 0;
                if (W.wallpaperConfig && W.wallpaperConfig.selectedwallpapers) {
                  delete W.wallpaperConfig.selectedwallpapers[mon.location];
                }
                if (j && j.callDeferred) {
                  j.callDeferred("browseWallpaperObject", "removeWallpaper", {
                    location: mon.location,
                    playlist: false
                  });
                  j.callDeferred("browseWallpaperObject", "clearWorkerWindow");
                }
              }
            }
          }

          if (isMatch(W.currentSelection)) {
            revertedAny = true;
            if (W.selectedMonitor && W.selectedMonitor.wallpaper && !isMatch(W.selectedMonitor.wallpaper)) {
              W.currentSelection = W.selectedMonitor.wallpaper;
            } else {
              W.currentSelection = void 0;
            }
            if (W.preview) {
              W.preview.play = false;
            }
            if (j && j.callDeferred) {
              j.callDeferred("browseWallpaperObject", "clearWorkerWindow");
            }
          }

          if (typeof Ke === "function") {
            Ke(targetItem, W.sourceIsInstalled);
          }

          return revertedAny;
        }

        function showActiveWallpaperNotice(isMultiple) {
          var msg = isMultiple
            ? "ui_wep_active_delete_many"
            : "ui_wep_active_delete_one";
          var title = isMultiple ? "ui_wep_active_wallpapers" : "ui_wep_active_wallpaper";
          if (F && F.open) {
            F.open("genericConfirm", {
              data: {
                title: title,
                message: msg,
                okVisible: true,
                cancelVisible: false,
              },
            });
          } else {
            alert(O.instant(msg));
          }
        }

        function showDeleteError(message) {
          if (F && F.open) {
            F.open("genericConfirm", {
              data: {
                title: "ui_wep_delete_failed",
                message: message,
                okVisible: true,
                cancelVisible: false,
              },
            });
          } else {
            alert(O.instant(message));
          }
        }

        function removeWallpaperFromUIState(item, wid, f) {
          if (wid && W.activeDownloads) {
            delete W.activeDownloads[wid];
          }
          if (wid && W.activeExtracts) {
            delete W.activeExtracts[wid];
          }
          if (wid && window.WengineHelper) {
            if (window.WengineHelper.removeInstalledWorkshopId) {
              window.WengineHelper.removeInstalledWorkshopId(wid);
            }
            if (window.WengineHelper._installedIds) {
              delete window.WengineHelper._installedIds[String(wid)];
            }
          }
          if (wid && W.installedMetadata) {
            delete W.installedMetadata[String(wid)];
          }
          if (f && W.installedMetadata && W.installedMetadata[f]) {
            delete W.installedMetadata[f];
          }
          if (wid && window.WengineHelper && window.WengineHelper.deleteMetadata) {
            window.WengineHelper.deleteMetadata(wid);
          }
          if (f) {
            Le(f);
          }
          if (W.wallpapers) {
            for (var i = W.wallpapers.length - 1; i >= 0; i--) {
              var curW = W.wallpapers[i];
              if (curW && (
                (wid && W.getWallpaperWorkshopId && W.getWallpaperWorkshopId(curW) === String(wid)) ||
                (wid && String(curW.workshopid) === String(wid)) ||
                (f && (curW.file === f || curW.pkgfile === f)) ||
                curW === item
              )) {
                W.wallpapers.splice(i, 1);
              }
            }
          }
          if (wid && W.queryWallpapers) {
            for (var q = 0; q < W.queryWallpapers.length; q++) {
              var qw = W.queryWallpapers[q];
              if (qw && (String(qw.workshopid) === String(wid) || qw.file === f)) {
                qw.status = "downloadable";
                qw.local = false;
                qw.file = "workshop/" + wid;
              }
            }
          }
          if (wid && W.sortedWallpapers) {
            for (var s = 0; s < W.sortedWallpapers.length; s++) {
              var sw = W.sortedWallpapers[s];
              if (sw && (String(sw.workshopid) === String(wid) || sw.file === f)) {
                sw.status = "downloadable";
                sw.local = false;
                sw.file = "workshop/" + wid;
              }
            }
          }
          if (W.currentSelection && (
            (wid && (String(W.currentSelection.workshopid) === String(wid) || (W.getWallpaperWorkshopId && W.getWallpaperWorkshopId(W.currentSelection) === String(wid)))) ||
            (f && (W.currentSelection.file === f || W.currentSelection.pkgfile === f)) ||
            W.currentSelection === item
          )) {
            if (W.sourceIsWorkshop) {
              W.currentSelection.status = "downloadable";
              W.currentSelection.local = false;
              W.currentSelection.file = "workshop/" + wid;
            } else {
              W.currentSelection = void 0;
            }
          }
          Ke(item, W.sourceIsInstalled);
        }

        W.deleteInstalledWallpaper = function (item) {
          if (!item) return;

          if (isWallpaperActive(item)) {
            showActiveWallpaperNotice(false);
            return;
          }

          var performDelete = function () {
            var wasInPreview = revertPreviewIfActive(item);
            var wid = extractWorkshopId(item, item.file);
            var f = item.file || item.pkgfile || "";

            var executeSingle = function () {
              if (window.WengineHelper) {
                window.WengineHelper.deleteWallpaper({
                  pubfileid: String(wid || ""),
                  file: String(f || ""),
                }).then(function (res) {
                  if (!res || res.ok === false) {
                    showDeleteError((res && res.error) || "ui_wep_delete_request_failed");
                    return;
                  }
                  m(function () {
                    removeWallpaperFromUIState(item, wid, f);
                    if (window.WengineHelper && window.WengineHelper.setInstalledWallpapers) {
                      window.WengineHelper.setInstalledWallpapers(W.wallpapers);
                    }
                    st();
                    z();
                    if (window.WengineHelper) {
                      W.refreshDownloadsAndPlugins();
                    }
                    if (W.sourceIsWorkshop) {
                      P();
                    }
                  });
                }).catch(function (err) {
                  console.error("Delete failed:", err);
                  showDeleteError(String((err && err.message) || err));
                });
              } else {
                m(function () {
                  removeWallpaperFromUIState(item, wid, f);
                  st();
                  z();
                });
              }
            };

            if (wasInPreview) {
              setTimeout(executeSingle, 250);
            } else {
              executeSingle();
            }
          };

          if (F && F.open) {
            F.open("genericConfirm", {
              data: {
                title: "ui_wep_delete_wallpaper",
                message: "ui_wep_delete_confirm_one",
                okVisible: true,
                cancelVisible: true,
              },
            }).then(function () {
              performDelete();
            }).catch(function () {});
          } else {
            performDelete();
          }
        };
        
        W.refreshPluginData();
        W.activeDownloads = {};
        W.activeExtracts = {};
        W.installedMetadata = {};
        try {
          localStorage.removeItem("helper_installed_metadata");
        } catch (e) {}

        W.applyDiskMetadata = function (meta) {
          if (meta && typeof meta === "object") {
            W.installedMetadata = angular.copy(meta);
            if (W.currentSelection && (W.sourceIsInstalled || !W.sourceIsWorkshop)) {
              var mMeta = W.getMetaForWallpaper ? W.getMetaForWallpaper(W.currentSelection) : null;
              if (mMeta) {
                var safeKeys = [
                  "author", "authorsteamid", "author_url", "author_avatar",
                  "file_size", "filesizelabel", "rating", "ratingrounded",
                  "hasrating", "rating_star_file", "num_ratings",
                  "posted_date", "updated_date", "installed_ts", "tags"
                ];
                for (var sk = 0; sk < safeKeys.length; sk++) {
                  var k = safeKeys[sk];
                  if (mMeta[k] !== undefined && mMeta[k] !== null && mMeta[k] !== "") {
                    W.currentSelection[k] = mMeta[k];
                  }
                }
              }
            }
            if (W.sourceIsInstalled) z();
          }
        };

        fetch("scripts/metadata.json")
          .then(function (r) { return r.json(); })
          .then(function (meta) {
            W.applyDiskMetadata(meta);
          }).catch(function () {});

        W.fetchWorkerMetadata = function () {
          if (!window.WengineHelper) return;
          window.WengineHelper.getAllMetadata().then(function (meta) {
            W.applyDiskMetadata(meta);
          });
        };
        W.fetchWorkerMetadata();
        function parseSteamDate(str) {
          if (!str) return 0;
          if (typeof str === "number") return str;
          if (/^\d{9,12}$/.test(String(str))) return Number(str) * 1000;
          var clean = String(str).replace("@", "").replace(",", "").trim();
          clean = clean.replace(/(\d+):(\d+)([ap]m)/i, "$1:$2 $3");
          var t = Date.parse(clean);
          if (!isNaN(t)) return t;
          var months = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
          var m = String(str).match(/(\d{1,2})\s+([a-zA-Z]{3}),?\s*(\d{4})?\s*@?\s*(\d{1,2}):(\d{2})\s*([ap]m)?/i);
          if (m) {
            var day = parseInt(m[1], 10);
            var mon = months[m[2].toLowerCase().slice(0, 3)];
            var yr = m[3] ? parseInt(m[3], 10) : new Date().getFullYear();
            var hr = parseInt(m[4], 10);
            var min = parseInt(m[5], 10);
            var ampm = m[6] ? m[6].toLowerCase() : "";
            if (ampm === "pm" && hr < 12) hr += 12;
            if (ampm === "am" && hr === 12) hr = 0;
            if (mon !== undefined) {
              return new Date(yr, mon, day, hr, min).getTime();
            }
          }
          return 0;
        }

        function parseSizeToBytes(val) {
          if (!val) return 0;
          if (typeof val === "number") return val;
          var str = String(val).trim();
          var m = str.match(/([0-9.]+)\s*([a-zA-Z]+)?/);
          if (!m) return 0;
          var num = parseFloat(m[1]);
          if (isNaN(num)) return 0;
          var unit = (m[2] || "").toUpperCase();
          if (unit.indexOf("G") !== -1) return num * 1024 * 1024 * 1024;
          if (unit.indexOf("M") !== -1) return num * 1024 * 1024;
          if (unit.indexOf("K") !== -1) return num * 1024;
          return num;
        }

        function getWallpaperSize(w) {
          if (!w) return 0;
          if (w.size_bytes && w.size_bytes > 0) return w.size_bytes;
          if (w.filesize && w.filesize > 0) return w.filesize;
          var meta = W.getMetaForWallpaper ? W.getMetaForWallpaper(w) : null;
          if (meta) {
            if (meta.size_bytes) return Number(meta.size_bytes);
            if (meta.filesize) return Number(meta.filesize);
            if (meta.file_size) return parseSizeToBytes(meta.file_size);
            if (meta.filesizelabel) return parseSizeToBytes(meta.filesizelabel);
          }
          return 0;
        }

        function getWallpaperRatingScore(w) {
          if (!w) return 0;
          var meta = W.getMetaForWallpaper ? W.getMetaForWallpaper(w) : null;
          if (meta) {
            if (meta.rating !== undefined && meta.rating !== null && Number(meta.rating) > 0) return Number(meta.rating);
            if (meta.ratingrounded) return Number(meta.ratingrounded) * 20;
            if (meta.rating_star_file) {
              var m = String(meta.rating_star_file).match(/(\d+)/);
              if (m) return parseInt(m[1], 10) * 20;
            }
          }
          return Number(w.rating) || 0;
        }

        function getWallpaperDate(w, field) {
          if (!w) return 0;
          var meta = W.getMetaForWallpaper ? W.getMetaForWallpaper(w) : null;
          if (meta && meta[field]) {
            var ts = parseSteamDate(meta[field]);
            if (ts > 0) return ts;
          }
          if (w[field]) {
            var ts2 = parseSteamDate(w[field]);
            if (ts2 > 0) return ts2;
          }
          return 0;
        }

        function getWallpaperInstallDate(w) {
          if (!w) return 0;
          if (w.installed_ts && w.installed_ts > 0) return w.installed_ts;
          var meta = W.getMetaForWallpaper ? W.getMetaForWallpaper(w) : null;
          if (meta) {
            if (meta.installed_ts && meta.installed_ts > 0) return meta.installed_ts;
            if (meta.subscriptiondate && meta.subscriptiondate > 0) return meta.subscriptiondate;
          }
          if (w.subscriptiondate && w.subscriptiondate > 0) return w.subscriptiondate;
          var d = getWallpaperDate(w, "updated_date") || getWallpaperDate(w, "posted_date");
          return d > 0 ? d : 0;
        }

        W.getMetaDate = function (item, field) {
          return getWallpaperDate(item, field);
        };

        W.getInstalledMetadata = function (item) {
          if (!item) return null;
          return W.getMetaForWallpaper ? W.getMetaForWallpaper(item) : null;
        };

        W.getInstalledRating = function (item) {
          var meta = W.getInstalledMetadata(item);
          var stars = 0;
          if (meta) {
            if (meta.ratingrounded && meta.ratingrounded > 0) {
              stars = Math.min(5, Math.max(0, parseInt(meta.ratingrounded, 10)));
            } else if (meta.rating_star_file) {
              var m = String(meta.rating_star_file).match(/(\d+)/);
              if (m) stars = Math.min(5, Math.max(0, parseInt(m[1], 10)));
            } else if (meta.rating && meta.rating > 0) {
              stars = Math.min(5, Math.max(0, Math.round(Number(meta.rating) / 20)));
            }
          }
          return {
            stars: stars,
            filledStars: "\u2605".repeat(stars),
            emptyStars: "\u2606".repeat(5 - stars)
          };
        };

        W.getInstalledMetadataTags = function (item) {
          var meta = W.getInstalledMetadata(item);
          if (!meta) return [];
          var tagsRaw = meta.tags;
          if (!tagsRaw) return [];
          var res = [];
          if (angular.isArray(tagsRaw)) {
            for (var i = 0; i < tagsRaw.length; i++) {
              var t = typeof tagsRaw[i] === "string" ? tagsRaw[i] : (tagsRaw[i] && (tagsRaw[i].tag || tagsRaw[i].name || ""));
              t = (t || "").trim();
              if (t && t.toLowerCase() !== "local" && res.indexOf(t) === -1) res.push(t);
            }
          } else if (angular.isString(tagsRaw)) {
            var parts = tagsRaw.split(/[,;\/]/);
            for (var j = 0; j < parts.length; j++) {
              var p = (parts[j] || "").trim();
              if (p && p.toLowerCase() !== "local" && res.indexOf(p) === -1) res.push(p);
            }
          }
          return res;
        };
        W.getAuthorFilterName = function () {
          if (W.sourceIsInstalled && W.filterAuthor && W.filterAuthor.installedAuthor) {
            return W.filterAuthor.installedAuthor;
          }
          if (W.sourceIsWorkshop && W.filterAuthor && W.filterAuthor.authorSteamId) {
            var u = W.steamUserInfos && W.steamUserInfos[W.filterAuthor.authorSteamId];
            return (u && u.name) || W.filterAuthor.authorSteamId;
          }
          return "";
        };
        W.filterByAuthor = function (author) {
          if (!author) return;
          if (W.sourceIsInstalled) {
            W.filterAuthor.installedAuthor = author;
            z();
          } else if (W.sourceIsWorkshop) {
            W.filter.text = author;
            P();
          }
        };
        W.deleteMultipleWallpapers = function (items) {
          if (!items || !items.length || !window.WengineHelper) return;

          var activeItems = [];
          var inactiveItems = [];
          for (var i = 0; i < items.length; i++) {
            if (isWallpaperActive(items[i])) {
              activeItems.push(items[i]);
            } else {
              inactiveItems.push(items[i]);
            }
          }

          if (inactiveItems.length === 0) {
            showActiveWallpaperNotice(true);
            return;
          }

          var performDeleteMulti = function () {
            var anyReverted = false;
            for (var i = 0; i < inactiveItems.length; i++) {
              if (revertPreviewIfActive(inactiveItems[i])) {
                anyReverted = true;
              }
            }

            var executeMulti = function () {
              var promises = [];
              for (var i = 0; i < inactiveItems.length; i++) {
                var it = inactiveItems[i];
                var wid = extractWorkshopId(it, it.file);
                var f = it.file || it.pkgfile || "";
                promises.push(window.WengineHelper.deleteWallpaper({
                  pubfileid: String(wid || ""),
                  file: String(f || "")
                }));
              }

              Promise.all(promises.map(function (promise, idx) {
                return promise.then(function (res) {
                  return { item: inactiveItems[idx], res: res };
                }, function (err) {
                  return { item: inactiveItems[idx], res: { ok: false, error: String(err) } };
                });
              })).then(function (outcomes) {
                var deletedItems = [];
                var failedCount = 0;
                for (var i = 0; i < outcomes.length; i++) {
                  if (outcomes[i] && outcomes[i].res && outcomes[i].res.ok !== false) {
                    deletedItems.push(outcomes[i].item);
                  } else {
                    failedCount++;
                  }
                }
                if (failedCount > 0) {
                  showDeleteError(O.instant("ui_wep_delete_partial", { count: failedCount }));
                }
                inactiveItems = deletedItems;
                m(function () {
                  for (var i = 0; i < inactiveItems.length; i++) {
                    var it = inactiveItems[i];
                    var wid = extractWorkshopId(it, it.file);
                    var f = it.file || it.pkgfile || "";
                    removeWallpaperFromUIState(it, wid, f);
                  }

                  if (window.WengineHelper && window.WengineHelper.setInstalledWallpapers) {
                    window.WengineHelper.setInstalledWallpapers(W.wallpapers);
                  }
                  st();

                  if (W.selectedMonitor && W.selectedMonitor.playlist && W.selectedMonitor.playlist.items) {
                    for (var i = 0; i < inactiveItems.length; i++) {
                      var it = inactiveItems[i];
                      var f = it.file || it.pkgfile || "";
                      if (f && W.selectedMonitor.playlistFlags) delete W.selectedMonitor.playlistFlags[f];
                      for (var pi = W.selectedMonitor.playlist.items.length - 1; pi >= 0; pi--) {
                        var pItem = W.selectedMonitor.playlist.items[pi];
                        var pW = pItem.wallpaper || pItem;
                        if (pW && (pW === it || (f && pW.file === f))) {
                          W.selectedMonitor.playlist.items.splice(pi, 1);
                        }
                      }
                    }
                  }

                  W.multiSelection = activeItems.slice();
                  W.refreshDownloadsAndPlugins();
                  W.refreshPluginData();
                  if (W.sourceIsInstalled) {
                    z();
                  }
                  if (W.sourceIsWorkshop) {
                    P();
                  }

                  if (activeItems.length > 0) {
                    showActiveWallpaperNotice(true);
                  }
                });
              });
            };

            if (anyReverted) {
              setTimeout(executeMulti, 250);
            } else {
              executeMulti();
            }
          };

          var count = inactiveItems.length;
          var title = count > 1 ? "ui_wep_delete_wallpapers" : "ui_wep_delete_wallpaper";
          var msg = count > 1
            ? "ui_wep_delete_confirm_many"
            : "ui_wep_delete_confirm_one";

          if (F && F.open) {
            F.open("genericConfirm", {
              data: {
                title: title,
                message: msg,
                labelValues: { count: count },
                okVisible: true,
                cancelVisible: true,
              },
            }).then(function () {
              performDeleteMulti();
            }).catch(function () {});
          } else {
            performDeleteMulti();
          }
        };
        W.extractStatusNotice = null;
        W._extractNoticeTimer = null;
        W.showExtractNotice = function (text, phase, duration) {
          m(function () {
            if (W._extractNoticeTimer) {
              clearTimeout(W._extractNoticeTimer);
              W._extractNoticeTimer = null;
            }
            W.extractStatusNotice = {
              text: text,
              phase: phase || "running"
            };
            if (duration) {
              W._extractNoticeTimer = setTimeout(function () {
                m(function () {
                  W.extractStatusNotice = null;
                });
              }, duration);
            }
          });
        };
        W.extractMultipleWallpapers = function (items) {
          if (!items || !items.length || !window.WengineHelper || !W.pluginsReady) return;
          window.WengineHelper.pickFolder().then(function (dialogRes) {
            if (!dialogRes || !dialogRes.ok || !dialogRes.path) return;
            var targetFolder = dialogRes.path;
            var total = items.length;
            var completed = 0;
            var hasErrors = false;
            W.showExtractNotice(O.instant("ui_wep_unpacking_many", { count: total }), "running");
            for (var i = 0; i < items.length; i++) {
              (function (it, idx) {
                var pid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(it) : (it.workshopid || it.id || ""));
                var file = it.file || it.pkgfile || "";
                var taskKey = pid || file || ("extract_" + idx);
                var itemTitle = it.title || O.instant("ui_wep_wallpaper_number", { number: idx + 1 });
                m(function () {
                  W.activeExtracts[taskKey] = { status: O.instant("ui_wep_starting_extraction"), phase: "starting", progress: 0 };
                });
                window.WengineHelper.extractItem(pid, file, targetFolder).then(function (res) {
                  if (res && res.error) {
                    m(function () {
                      W.activeExtracts[taskKey] = { status: res.error, phase: "failed" };
                    });
                    hasErrors = true;
                    completed++;
                    if (completed >= total) {
                      W.showExtractNotice(O.instant("ui_wep_unpack_errors"), "error", 5000);
                    }
                  } else {
                    var actualId = (res && res.pubfileid) ? res.pubfileid : (pid || taskKey);
                    W.pollExtractStatus(taskKey, actualId, itemTitle, function () {
                      completed++;
                      if (completed < total) {
                        W.showExtractNotice(O.instant("ui_wep_unpack_progress", { completed: completed, total: total }), "running");
                      } else {
                        if (!hasErrors) {
                          m(function () {
                            W.multiExtractSuccess = true;
                          });
                          setTimeout(function () {
                            m(function () {
                              W.multiExtractSuccess = false;
                            });
                          }, 2500);
                          W.showExtractNotice(O.instant("ui_wep_unpack_all_success", { count: total }), "success", 4500);
                        } else {
                          W.showExtractNotice(O.instant("ui_wep_unpack_errors"), "error", 5000);
                        }
                      }
                    }, pid, file);
                  }
                }).catch(function () {
                  hasErrors = true;
                  completed++;
                });
              })(items[i], i);
            }
          });
        };
        W.pluginStatus = null;
        // TODO i18n: activeDownloads[*].status, activeExtracts[*].status and
        // pluginStatus.message are produced by the Rust helper daemon and are
        // displayed verbatim; they cannot be translated from scripts.js alone.
        W.refreshDownloadsAndPlugins = function () {
          if (!window.WengineHelper) return;
          window.WengineHelper.getPluginStatus().then(function (st) {
            if (st) {
              m(function () {
                W.pluginStatus = st;
                W.pluginsReady = (st.ready === true);
              });
            }
          });
          window.WengineHelper.getDownloadsAll().then(function (tasks) {
            if (tasks) {
              var hasCompleted = false;
              for (var k in tasks) {
                if (tasks[k] && (tasks[k].phase === "completed" || tasks[k].phase === "done")) {
                  hasCompleted = true;
                  if (window.WengineHelper && window.WengineHelper.addInstalledWorkshopId) {
                    window.WengineHelper.addInstalledWorkshopId(k);
                  }
                  if (W.currentSelection) {
                    var curWid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(W.currentSelection) : (W.currentSelection.workshopid || W.currentSelection.id));
                    if (curWid && String(curWid) === String(k)) {
                      W.currentSelection.status = "installed";
                    }
                  }
                  if (!W._savedCompletedDownloads) W._savedCompletedDownloads = {};
                  if (!W._savedCompletedDownloads[k]) {
                    W._savedCompletedDownloads[k] = true;
                    (function (completedId) {
                      if (window.WengineHelper && window.WengineHelper.getItemDetails) {
                        window.WengineHelper.getItemDetails(completedId).then(function (det) {
                          if (det) {
                            if (!W.installedMetadata) W.installedMetadata = {};
                            W.installedMetadata[String(completedId)] = det;
                            if (window.WengineHelper && window.WengineHelper.saveMetadata) {
                              window.WengineHelper.saveMetadata(completedId, det);
                            }
                            if (W.sourceIsInstalled) z();
                          }
                        });
                      }
                    })(k);
                  }
                }
              }
              m(function () {
                W.activeDownloads = tasks;
              });
              if (hasCompleted && W.fetchWorkerMetadata) {
                W.fetchWorkerMetadata();
              }
            }
          });
        };
        W.isExtractSuccess = function (item) {
          if (!item || !W.extractSuccess) return false;
          var pid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(item) : (item.workshopid || item.id || ""));
          if (pid && W.extractSuccess[String(pid)]) return true;
          if (item.file && W.extractSuccess[item.file]) return true;
          return false;
        };
        W.isExtractRunning = function (item) {
          if (!item || !W.activeExtracts) return false;
          var pid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(item) : (item.workshopid || item.id || ""));
          var key = pid || item.file || "extract";
          var task = W.activeExtracts[key] || (pid && W.activeExtracts[String(pid)]) || (item.file && W.activeExtracts[item.file]);
          return !!(task && (task.phase === "starting" || task.phase === "running"));
        };
        W.getExtractBtnClass = function (item) {
          return W.isExtractSuccess(item) ? "btn btn-success" : "btn btn-primary";
        };
        W.getMultiExtractBtnClass = function () {
          return W.multiExtractSuccess ? "btn btn-success btn-block" : "btn btn-primary btn-block";
        };
        W.startWorkshopDownload = function (itemOrId) {
          if (!window.WengineHelper || !itemOrId) return;
          var pubfileid = typeof itemOrId === "object" ? (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(itemOrId) : (itemOrId.workshopid || itemOrId.id)) : itemOrId;
          if (pubfileid) {
            var wid = String(pubfileid);

          }
          window.WengineHelper.downloadItem(pubfileid).then(function () {
            W.refreshDownloadsAndPlugins();
          });
        };
        W.cancelWorkshopDownload = function (pubfileid) {
          if (!window.WengineHelper || !pubfileid) return;
          window.WengineHelper.cancelDownload(pubfileid).then(function () {
            W.refreshDownloadsAndPlugins();
          });
        };
        var savedPluginsReady = false;
        try {
          savedPluginsReady = localStorage.getItem("helper_plugins_ready") === "true";
        } catch (e) {}
        W.pluginsReady = savedPluginsReady;
        W.pollPluginReadyStatus = function () {
          if (!window.WengineHelper) return;
          window.WengineHelper.getPluginStatus().then(function (st) {
            if (st) {
              m(function () {
                W.workerRunning = true;
                W.pluginStatus = st;
                W.pluginsReady = (st.ready === true);
              });
              if (!st.ready) {
                setTimeout(W.pollPluginReadyStatus, st.is_downloading ? 400 : 1500);
              }
            }
          }).catch(function () {
            setTimeout(W.pollPluginReadyStatus, 2500);
          });
        };
        W.pluginsEnsureStarted = false;
        W.startPluginsIfNeeded = function(force) {
          if (force) W.pluginsEnsureStarted = false;
          if (W.pluginsEnsureStarted || !window.WengineHelper) return;
          W.pluginsEnsureStarted = true;
          window.WengineHelper.ensureRunning().then(function () {
            return window.WengineHelper.getPluginStatus();
          }).then(function (st) {
            if (st) {
              m(function () {
                W.pluginStatus = st;
                W.pluginsReady = (st.ready === true);
                try {
                  if (st.ready) localStorage.setItem("helper_plugins_ready", "true");
                  else localStorage.removeItem("helper_plugins_ready");
                } catch (e) {}
              });
              if (st.ready === true) return;
            }
            W.pollPluginReadyStatus();
            window.WengineHelper.ensurePlugins().then(function () {
              W.pollPluginReadyStatus();
            });
          }).catch(function () {
            W.pollPluginReadyStatus();
          });
        };
        W.serviceStartupStatus = {
          visible: true,
          type: "info",
          icon: "fa-spinner fa-spin",
          text: "ui_wep_service_launching",
          values: {},
        };
        W.initServiceStartupCheck = function () {
          if (!window.WengineHelper) {
            W.serviceStartupStatus.visible = false;
            return;
          }
          window.WengineHelper.ensureRunning().then(function (alive) {
            if (!alive) {
              m(function () {
                W.serviceStartupStatus.type = "warning";
                W.serviceStartupStatus.icon = "fa-exclamation-triangle";
                W.serviceStartupStatus.text = "ui_wep_service_failed";
                W.serviceStartupStatus.values = {};
                m(function () {
                  W.serviceStartupStatus.visible = false;
                }, 4000);
              });
              return;
            }
            W.initUpdateCheck(false);
            var checkAuthAttempts = 0;
            var maxAttempts = 20;
            function pollAuth() {
              window.WengineHelper.getAuthStatus().then(function (auth) {
                m(function () {
                  if (auth && auth.logged_in) {
                    var name = auth.persona_name ? (" (" + auth.persona_name + ")") : "";
                    W.serviceStartupStatus.type = "success";
                    W.serviceStartupStatus.icon = "fa-check-circle";
                    W.serviceStartupStatus.text = "ui_wep_service_logged_in";
                    W.serviceStartupStatus.values = { name: name };
                    W.refreshPluginData();
                    m(function () {
                      W.serviceStartupStatus.visible = false;
                    }, 1500);
                  } else if (auth && auth.is_logging_in) {
                    W.serviceStartupStatus.type = "info";
                    W.serviceStartupStatus.icon = "fa-spinner fa-spin";
                    W.serviceStartupStatus.text = "ui_wep_service_login_wait";
                    W.serviceStartupStatus.values = {};
                    if (++checkAuthAttempts < maxAttempts) {
                      setTimeout(pollAuth, 500);
                    } else {
                      W.serviceStartupStatus.type = "success";
                      W.serviceStartupStatus.icon = "fa-check-circle";
                      W.serviceStartupStatus.text = "ui_wep_service_started";
                      W.serviceStartupStatus.values = {};
                      m(function () {
                        W.serviceStartupStatus.visible = false;
                      }, 1500);
                    }
                  } else {
                    if (checkAuthAttempts < 3) {
                      checkAuthAttempts++;
                      setTimeout(pollAuth, 500);
                    } else {
                      W.serviceStartupStatus.type = "success";
                      W.serviceStartupStatus.icon = "fa-check-circle";
                      W.serviceStartupStatus.text = "ui_wep_service_started";
                      W.serviceStartupStatus.values = {};
                      m(function () {
                        W.serviceStartupStatus.visible = false;
                      }, 1500);
                    }
                  }
                });
              }).catch(function () {
                m(function () {
                  W.serviceStartupStatus.visible = false;
                });
              });
            }
            pollAuth();
          }).catch(function () {
            m(function () {
              W.serviceStartupStatus.visible = false;
            });
          });
        };
        W.initServiceStartupCheck();
        W.appUpdate = {
          current_version: "2.0.0",
          latest_version: null,
          has_update: false,
          status: "idle",
          progress: 0,
          error: null,
          checking: false,
          upToDateNotice: false,
        };
        W.$root.appUpdate = W.appUpdate;
        W.$root.initUpdateCheck = function (manual, ev) { return W.initUpdateCheck(manual, ev); };
        W.$root.startAppUpdate = function () { return W.startAppUpdate(); };
        W.initUpdateCheck = function (manual, ev) {
          if (!window.WengineHelper) return;
          var isMock = !!(ev && (ev.shiftKey || ev.altKey));
          m(function () {
            W.appUpdate.checking = true;
            W.appUpdate.error = null;
            W.appUpdate.upToDateNotice = false;
          });
          window.WengineHelper
            .checkUpdate({ force: !!manual, mock: isMock })
            .then(function (info) {
              m(function () {
                if (info) {
                  if (info.current_version)
                    W.appUpdate.current_version = info.current_version;
                  W.appUpdate.latest_version = info.latest_version;
                  W.appUpdate.has_update = !!info.has_update;
                  W.appUpdate.status = info.status || "idle";
                  W.appUpdate.progress = info.progress || 0;
                  W.appUpdate.error = info.error || null;
                  if (info.status === "checking") {
                    W.appUpdate.checking = true;
                    setTimeout(function () {
                      window.WengineHelper.getUpdateStatus().then(function (st) {
                        m(function () {
                          W.appUpdate.checking = false;
                          if (st) {
                            if (st.current_version)
                              W.appUpdate.current_version = st.current_version;
                            W.appUpdate.latest_version = st.latest_version;
                            W.appUpdate.has_update = !!st.has_update;
                            W.appUpdate.status = st.status || "idle";
                            W.appUpdate.progress = st.progress || 0;
                            W.appUpdate.error = st.error || null;
                          }
                        });
                      });
                    }, 1500);
                  } else {
                    W.appUpdate.checking = false;
                    if (manual && !info.has_update && !info.error) {
                      W.appUpdate.upToDateNotice = true;
                      setTimeout(function () {
                        m(function () {
                          W.appUpdate.upToDateNotice = false;
                        });
                      }, 3000);
                    }
                  }
                } else {
                  W.appUpdate.checking = false;
                  if (manual) {
                    W.appUpdate.error = O.instant("ui_wep_update_err_daemon");
                  }
                }
              });
            })
            .catch(function (e) {
              m(function () {
                W.appUpdate.checking = false;
                if (manual) {
                  W.appUpdate.error = O.instant("ui_wep_update_err_check") + ": " + e;
                }
              });
            });
        };
        W.startAppUpdate = function () {
          if (!window.WengineHelper) return;
          m(function () {
            W.appUpdate.status = "downloading";
            W.appUpdate.progress = 0;
            W.appUpdate.error = null;
          });

          window.WengineHelper
            .startUpdateDownload()
            .then(function (res) {
              if (!res || !res.ok) {
                m(function () {
                  W.appUpdate.status = "error";
                  W.appUpdate.error =
                    (res && res.error) || O.instant("ui_wep_update_err_download");
                });
                return;
              }

              var pollInterval = setInterval(function () {
                window.WengineHelper
                  .getUpdateStatus()
                  .then(function (st) {
                    m(function () {
                      if (!st) return;
                      W.appUpdate.status = st.status;
                      W.appUpdate.progress = st.progress || 0;
                      W.appUpdate.error = st.error;

                      if (st.status === "ready_to_install") {
                        clearInterval(pollInterval);
                        W.appUpdate.status = "installing";

                        window.WengineHelper
                          .applyUpdate()
                          .then(function (applyRes) {
                            if (applyRes && applyRes.ok) {
                              setTimeout(function () {
                                if (window.ui && window.ui.close) {
                                  window.ui.close();
                                }
                              }, 350);
                            } else {
                              W.appUpdate.status = "error";
                              W.appUpdate.error =
                                (applyRes && applyRes.error) ||
                                O.instant("ui_wep_update_err_apply");
                            }
                          })
                          .catch(function (err) {
                            W.appUpdate.status = "error";
                            W.appUpdate.error = O.instant("ui_wep_update_err_apply_prefix") + ": " + err;
                          });
                      } else if (st.status === "error") {
                        clearInterval(pollInterval);
                      }
                    });
                  })
                  .catch(function () {
                    clearInterval(pollInterval);
                  });
              }, 400);
            })
            .catch(function (err) {
              m(function () {
                W.appUpdate.status = "error";
                W.appUpdate.error = String(err);
              });
            });
        };
        W.initUpdateCheck();
        W.refreshPluginData();
        W.startPluginsIfNeeded();
        W.extractPlaylistWallpapers = function () {
          if (!W.selectedMonitor || !W.selectedMonitor.playlist || !W.selectedMonitor.playlist.items) return;
          var items = W.selectedMonitor.playlist.items.map(function (it) {
            return it.wallpaper || it;
          }).filter(Boolean);
          if (items.length) {
            W.extractMultipleWallpapers(items);
          }
        };
        W.deletePlaylistWallpapers = function () {
          if (!W.selectedMonitor || !W.selectedMonitor.playlist || !W.selectedMonitor.playlist.items) return;
          var items = W.selectedMonitor.playlist.items.map(function (it) {
            return it.wallpaper || it;
          }).filter(Boolean);
          if (items.length) {
            W.deleteMultipleWallpapers(items);
          }
        };
        W.extractInstalledWallpaper = function (wallpaper) {
          if (!window.WengineHelper || !wallpaper || !W.pluginsReady) return;
          window.WengineHelper.pickFolder().then(function (dialogRes) {
            if (!dialogRes || !dialogRes.ok || !dialogRes.path) {
              return;
            }
            var targetFolder = dialogRes.path;
            var pid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(wallpaper) : (wallpaper.workshopid || wallpaper.id || ""));
            var file = wallpaper.file || wallpaper.pkgfile || "";
            var taskKey = pid || file || "extract";
            var itemTitle = wallpaper.title || "";
            W.showExtractNotice(
              itemTitle
                ? O.instant("ui_wep_unpacking_one", { title: itemTitle })
                : O.instant("ui_wep_unpacking_one_fallback"),
              "running",
            );
            m(function () {
              W.activeExtracts[taskKey] = { status: O.instant("ui_wep_starting_extraction"), phase: "starting", progress: 0 };
            });
            window.WengineHelper.extractItem(pid, file, targetFolder).then(function (res) {
              if (res && res.error) {
                m(function () {
                  W.activeExtracts[taskKey] = { status: res.error, phase: "failed" };
                });
                W.showExtractNotice(O.instant("ui_wep_unpack_failed", { error: res.error }), "error", 5000);
              } else {
                var actualId = (res && res.pubfileid) ? res.pubfileid : (pid || taskKey);
                W.pollExtractStatus(taskKey, actualId, itemTitle, null, pid, file);
              }
            });
          });
        };
        W.pollExtractStatus = function (taskKey, pollId, itemTitle, onDone, itemPid, itemFile) {
          if (!window.WengineHelper || !taskKey) return;
          var queryId = pollId || taskKey;
          window.WengineHelper.getExtractStatus(queryId).then(function (st) {
            if (st) {
              m(function () {
                W.activeExtracts[taskKey] = st;
              });
              if (st.phase === "starting" || st.phase === "running") {
                setTimeout(function () {
                  W.pollExtractStatus(taskKey, queryId, itemTitle, onDone, itemPid, itemFile);
                }, 1000);
              } else if (st.phase === "completed" || st.phase === "done") {
                var successKeys = [];
                if (taskKey) successKeys.push(String(taskKey));
                if (queryId) successKeys.push(String(queryId));
                if (itemPid) successKeys.push(String(itemPid));
                if (itemFile) successKeys.push(String(itemFile));
                if (W.currentSelection) {
                  var curPid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(W.currentSelection) : (W.currentSelection.workshopid || W.currentSelection.id));
                  var curFile = W.currentSelection.file || W.currentSelection.pkgfile || "";
                  if (curPid && (curPid === itemPid || curPid === taskKey || curPid === queryId)) {
                    successKeys.push(String(curPid));
                  }
                  if (curFile && (curFile === itemFile || curFile === taskKey)) {
                    successKeys.push(String(curFile));
                  }
                }
                m(function () {
                  if (!W.extractSuccess) W.extractSuccess = {};
                  for (var k = 0; k < successKeys.length; k++) {
                    W.extractSuccess[successKeys[k]] = true;
                  }
                });
                setTimeout(function () {
                  m(function () {
                    if (W.extractSuccess) {
                      for (var k = 0; k < successKeys.length; k++) {
                        delete W.extractSuccess[successKeys[k]];
                      }
                      delete W.extractSuccess["extract"];
                    }
                    if (W.activeExtracts) {
                      delete W.activeExtracts[taskKey];
                      if (queryId) delete W.activeExtracts[String(queryId)];
                    }
                  });
                }, 2500);
                if (onDone) {
                  onDone();
                } else {
                  W.showExtractNotice(
                    itemTitle
                      ? O.instant("ui_wep_unpack_success", { title: itemTitle })
                      : O.instant("ui_wep_unpack_success_plain"),
                    "success",
                    4000,
                  );
                }
              } else if (st.phase === "failed" || st.phase === "error") {
                if (W.activeExtracts) {
                  setTimeout(function () {
                    m(function () {
                      delete W.activeExtracts[taskKey];
                      if (queryId) delete W.activeExtracts[String(queryId)];
                    });
                  }, 4000);
                }
                if (onDone) {
                  onDone();
                } else {
                  W.showExtractNotice(
                    O.instant("ui_wep_unpack_failed", {
                      error: st.status || O.instant("ui_wep_unknown_error"),
                    }),
                    "error",
                    5000,
                  );
                }
              }
            }
          });
        };
        setInterval(function () {
          if (W.sourceIsWorkshop || W.sourceIsInstalled) {
            W.refreshDownloadsAndPlugins();
          }
        }, 1500);
        function ve(t) {
          return function (e) {
            return e.id === t;
          };
        }
        function getWallpaperSortName(w) {
          if (!w) return "";
          var t = w.titleoverride || w.title || "";
          if (typeof t !== "string") t = String(t || "");
          if (t && typeof V !== "undefined" && V.instant) {
            try {
              var tr = V.instant(t);
              if (tr && typeof tr === "string") t = tr;
            } catch (_) {}
          }
          if (!t && w.file && typeof w.file === "string") {
            var p = w.file.split(/[\/\\]/);
            t = p[p.length - 1] || w.file;
          }
          return t.trim().toLowerCase();
        }

        var he = {
            install_date: function (e, t) {
              var a = getWallpaperInstallDate(e);
              var b = getWallpaperInstallDate(t);
              return a === b ? he.name(e, t) : a - b;
            },
            size: function (e, t) {
              var sa = getWallpaperSize(e);
              var sb = getWallpaperSize(t);
              return sa === sb ? he.name(e, t) : sa - sb;
            },
            posted_date: function (e, t) {
              var da = getWallpaperDate(e, "posted_date");
              var db = getWallpaperDate(t, "posted_date");
              return da === db ? he.name(e, t) : da - db;
            },
            updated_date: function (e, t) {
              var da = getWallpaperDate(e, "updated_date") || getWallpaperDate(e, "posted_date");
              var db = getWallpaperDate(t, "updated_date") || getWallpaperDate(t, "posted_date");
              return da === db ? he.name(e, t) : da - db;
            },
            name: function (e, t) {
              var na = getWallpaperSortName(e);
              var nb = getWallpaperSortName(t);
              return na.localeCompare(nb, undefined, { numeric: true, sensitivity: "base" });
            },
            rating: function (e, t) {
              var ra = getWallpaperRatingScore(e);
              var rb = getWallpaperRatingScore(t);
              return ra === rb ? he.name(e, t) : ra - rb;
            },
            subscriptiondate: function (e, t) {
              return he.install_date(e, t);
            },
            updatedate: function (e, t) {
              return he.updated_date(e, t);
            },
            favorite: function (e, t) {
              return e.favorite !== t.favorite
                ? (e.favorite ? -1 : 1)
                : he.name(e, t);
            },
            filesize: function (e, t) {
              return he.size(e, t);
            },
          },
          be = {
            install_date: function (e, t) {
              var a = getWallpaperInstallDate(e);
              var b = getWallpaperInstallDate(t);
              return a === b ? be.name(e, t) : b - a;
            },
            size: function (e, t) {
              var sa = getWallpaperSize(e);
              var sb = getWallpaperSize(t);
              return sa === sb ? be.name(e, t) : sb - sa;
            },
            posted_date: function (e, t) {
              var da = getWallpaperDate(e, "posted_date");
              var db = getWallpaperDate(t, "posted_date");
              return da === db ? be.name(e, t) : db - da;
            },
            updated_date: function (e, t) {
              var da = getWallpaperDate(e, "updated_date") || getWallpaperDate(e, "posted_date");
              var db = getWallpaperDate(t, "updated_date") || getWallpaperDate(t, "posted_date");
              return da === db ? be.name(e, t) : db - da;
            },
            name: function (e, t) {
              var na = getWallpaperSortName(e);
              var nb = getWallpaperSortName(t);
              return nb.localeCompare(na, undefined, { numeric: true, sensitivity: "base" });
            },
            rating: function (e, t) {
              var ra = getWallpaperRatingScore(e);
              var rb = getWallpaperRatingScore(t);
              return ra === rb ? be.name(e, t) : rb - ra;
            },
            subscriptiondate: function (e, t) {
              return be.install_date(e, t);
            },
            updatedate: function (e, t) {
              return be.updated_date(e, t);
            },
            favorite: function (e, t) {
              return e.favorite !== t.favorite
                ? (t.favorite ? -1 : 1)
                : be.name(e, t);
            },
            filesize: function (e, t) {
              return be.size(e, t);
            },
          };
        function _e() {
          return {
            delay: 60,
            order: "random",
            mode: "timer",
            transition: "0",
            transitiontime: 1500,
            videosequence: !1,
            updateonpause: !1,
          };
        }
        function ye() {
          var e = V.getResolutionTags(),
            t = {};
          return (
            angular.forEach(e, function (e) {
              t[e] = !0;
            }),
            t
          );
        }
        function we() {
          return { filterFavoritesOnly: !1, filterMobileCompatibleOnly: !1 };
        }
        function ke(e) {
          var t = V.getAvailableTags(),
            a = {};
          return (
            angular.forEach(t, function (e) {
              a[e] = !0;
            }),
            e || (a.Unspecified = !1),
            a
          );
        }
        function xe(e) {
          return !1 === e.Anime
            ? ["Anime", "MMD", "Girls", "Guys", "Music"]
            : [];
        }
        function Se(e) {
          var t = [];
          return (
            !0 === e.recommendedresolution && (t = angular.copy(re)),
            !1 === e.showotherresolution && t.push("Other resolution"),
            t
          );
        }
        function Ce(e) {
          return "workshop" === e
            ? {
                type: "",
                categorytags: { Wallpaper: !0, Preset: !0 },
                typetags: { Scene: !0, Web: !0, Application: !1, Video: !0 },
                sourcetags: { Official: !0, Workshop: !0, Local: !0 },
                ratingtags: { Mature: !1, Questionable: !1, Everyone: !0 },
                resolutiontags: ye(),
                tags: ke(),
                utilitytags: {},
                sort: me,
                descending: !1,
                text: "",
                filterTitle: !0,
              }
            : {
                type: "",
                categorytags: { Wallpaper: !0, Preset: !0 },
                typetags: { Scene: !0, Web: !0, Application: !0, Video: !0 },
                sourcetags: { Official: !0, Workshop: !0, Local: !0 },
                ratingtags: { Mature: !0, Questionable: !0, Everyone: !0 },
                resolutiontags: ye(),
                tags: ke(!0),
                utilitytags: {},
                sort: de[0].value,
                descending: !1,
                text: "",
              };
        }
        function Ee(t, e) {
          angular.isObject(t.resolutiontags) &&
            angular.forEach(Se(e), function (e) {
              t.resolutiontags[e] = !1;
            });
        }
        function Pe() {
          ((Z = !0),
            m(function () {
              Z = !1;
            }));
        }
        function L() {
          return (
            !angular.isObject(W.steamWorkshopStatus) ||
            !W.steamWorkshopStatus.error
          );
        }
        function Me(e) {
          return 3.5 < e.w / e.h || 3.5 < e.h / e.w;
        }
        W.filterStatus = {};
        var Ae,
          Te,
          t,
          Re,
          Ie = ["76561198828455240"];
        function Oe(i) {
          angular.isArray(i) || (i = [i]);
          var t = [],
            a = [],
            e = D.defer(),
            n = i
              .filter(function (e) {
                return (
                  "Video" === e.type &&
                  e.localAndExternal &&
                  e.file &&
                  !e.filesize
                );
              })
              .map(function (e) {
                return e.file;
              }),
            o = D.when();
          return (
            (o =
              0 < n.length
                ? j
                    .callDeferred(
                      "browseWallpaperObject",
                      "getLocalFileSizes",
                      n,
                    )
                    .then(function (e) {
                      angular.forEach(e, function (t, a) {
                        angular.forEach(i, function (e) {
                          e.file === a && (e.filesize = t);
                        });
                      });
                    })
                : o).then(function () {
              (angular.forEach(i, function (e) {
                (e.filesize && 4194304e3 < e.filesize ? a : t).push(e);
              }),
                0 < a.length
                  ? F.open("genericConfirm", {
                      data: {
                        title: "ui_browse_mobile_upload_size_warning_title",
                        message: "ui_browse_mobile_upload_size_warning_message",
                        okVisible: !0,
                      },
                    }).then(function () {
                      e.resolve(t);
                    })
                  : e.resolve(t));
            }),
            e.promise
          );
        }
        function De(e) {
          var a, i, t;
          return (
            angular.isArray(e) || (e = [e]),
            V.requiresMobileApproval()
              ? ((a = []),
                (i = []),
                angular.forEach(e, function (e) {
                  var t =
                    W.allowAllMobileUploads ||
                    e.allowmobileupload ||
                    e.local ||
                    e.official ||
                    Ie.includes(e.authorsteamid);
                  (t && i.push(e), t || a.push(e));
                }),
                (t = D.defer()),
                0 < a.length
                  ? F.open("browseMobilePermissionsMissing", {
                      data: {
                        title:
                          "ui_browse_mobile_modal_author_permission_missing_title",
                        message:
                          "ui_browse_mobile_modal_author_permission_missing_message",
                        okVisible: !0,
                        leftClass: "btn-info",
                        textinput: V.getWorkshopAgreementHelpURL(),
                        listWallpapers: a,
                        openWorkshop: function (e) {
                          W.openSteamWorkshopPage(e);
                        },
                        leftCallback: function () {
                          W.openSteamWorkshopPage(a[0]);
                        },
                        leftVisible: 1 === a.length,
                        leftText:
                          "ui_browse_mobile_modal_author_permission_missing_open_workshop",
                      },
                    })
                      .catch(function () {})
                      .then(function () {
                        0 < i.length ? t.resolve(i) : t.reject();
                      })
                  : t.resolve(i),
                t.promise)
              : D.when(e)
          );
        }
        function We(e) {
          ((W.isUsingBackup = !1),
            (W.searchTextInputModelOptions = {
              debounce: e ? se.backup : se.normal,
            }));
        }
        function Be() {
          (W.sourceIsExplore
            ? (angular.forEach(W.sortedExploreQueries, function (e) {
                angular.isArray(e.wallpapers) &&
                  (e.wallpapers = e.wallpapers.slice());
              }),
              (W.sortedFolders = []))
            : W.sourceIsWorkshop && (W.sortedFolders = []),
            (W.sortedWallpapers = W.sortedWallpapers.slice()));
        }
        function Ve(e) {
          var a;
          ("Scene" !== e.type && "Video" !== e.type) ||
            ((a = V.getSharedDefaultProperties()),
            angular.forEach(e.defaultproperties, function (e, t) {
              angular.isDefined(a[t]) && (e.value = a[t]);
            }));
        }
        function Fe() {
          var t;
          return W.sourceIsInstalled
            ? W.sortedFoldersPrePagination.concat(
                W.sortedWallpapersPrePagination,
              )
            : W.sourceIsWorkshop
              ? W.queryWallpapers
              : W.sourceIsExplore
                ? W.isExploreHomepage()
                  ? ((t = []),
                    angular.forEach(W.sortedExploreQueries, function (e) {
                      angular.isArray(e.wallpapers) &&
                        (t = t.concat(e.wallpapers));
                    }),
                    t)
                  : W.sortedWallpapers
                : void 0;
        }
        function hasHelperTag(w, tag) {
          if (!tag) return false;
          var tagLower = String(tag).toLowerCase().trim();
          if (tagLower === "" || tagLower === "all") return true;
          if (tagLower === "wallpaper") {
            return !w.ispreset;
          }
          if (tagLower === "preset") {
            return !!w.ispreset;
          }
          if (w.type && String(w.type).toLowerCase().trim() === tagLower) return true;
          if (w.contentrating && String(w.contentrating).toLowerCase().trim() === tagLower) return true;
          if (w.general) {
            if (w.general.type && String(w.general.type).toLowerCase().trim() === tagLower) return true;
            if (w.general.contentrating && String(w.general.contentrating).toLowerCase().trim() === tagLower) return true;
            if (w.general.properties && w.general.properties.resolution && String(w.general.properties.resolution).toLowerCase().trim() === tagLower) return true;
          }
          if (w.resolution) {
            if (typeof w.resolution === "string" && w.resolution.toLowerCase().trim() === tagLower) return true;
            if (typeof w.resolution === "object" && (w.resolution.width + " x " + w.resolution.height).toLowerCase() === tagLower) return true;
          }
          function matchTagList(tags) {
            if (!tags) return false;
            if (angular.isArray(tags)) {
              for (var k = 0; k < tags.length; k++) {
                var it = tags[k];
                var tStr = typeof it === "string" ? it : (it && (it.tag || it.name || it.label || ""));
                if (String(tStr).toLowerCase().trim() === tagLower) return true;
              }
            } else if (angular.isString(tags)) {
              var parts = tags.split(/[,;\/]/);
              for (var k = 0; k < parts.length; k++) {
                if (parts[k].toLowerCase().trim() === tagLower) return true;
              }
              if (tags.toLowerCase().includes(tagLower)) return true;
            }
            return false;
          }
          if (matchTagList(w.tags)) return true;
          if (w.general && matchTagList(w.general.tags)) return true;
          if (matchTagList(w.monitortags)) return true;

          var meta = W.getMetaForWallpaper ? W.getMetaForWallpaper(w) : null;
          if (!meta && W.installedMetadata) {
            var id = W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(w) : (w.workshopid || w.id);
            if (id) meta = W.installedMetadata[String(id)] || (w.workshopid && W.installedMetadata[String(w.workshopid)]);
          }
          if (meta) {
            if (meta.author && String(meta.author).toLowerCase().trim() === tagLower) return true;
            if (meta.type && String(meta.type).toLowerCase().trim() === tagLower) return true;
            if (meta.contentrating && String(meta.contentrating).toLowerCase().trim() === tagLower) return true;
            if (matchTagList(meta.tags)) return true;
          }
          if (w.title && w.title.toLowerCase().includes(tagLower)) return true;
          return false;
        }
        function z() {
          var t, i, n, o, a, e, r, s, l, c, d, p;
          W.sourceIsInstalled
            ? ((t = W.currentFolder && W.currentFolder.items),
              (d =
                (W.currentFolder && W.currentFolder.subfolders) ||
                W.folders ||
                []),
              (i = []),
              (l = W.wallpapers),
              (l =
                (angular.isObject(t)
                  ? angular.forEach(l, function (e) {
                      t[e.workshopid || e.file] && i.push(e);
                    })
                  : angular.forEach(l, function (e) {
                      W.folderRootExclusion[e.workshopid || e.file] ||
                        i.push(e);
                    }),
                i)),
              (i = []),
              (c = (l = V.requiresFullAsyncWorkshop()
                ? l.filter(function (e) {
                    return "downloadable" !== e.status;
                  })
                : l).length),
              (n = []),
              (o = []),
              W.filterTemp.filterFavoritesOnly &&
                (l = l.filter(function (e) {
                  return e.favorite;
                })),
              W.filterTemp.filterMobileCompatibleOnly &&
                ((l = l.filter(function (e) {
                  return e.allowmobileupload || e.local || e.official;
                })),
                o.push("Application"),
                o.push("Web")),
              (!W.filterHelper &&
                (angular.forEach(W.filter.categorytags, function (e, t) {
                  e || o.push(t);
                }),
                angular.forEach(W.filter.typetags, function (e, t) {
                  e || o.push(t);
                }),
                "screensaver" === W.wallpaperConfigGroup && o.push("Application"),
                angular.forEach(W.filter.sourcetags, function (e, t) {
                  e || o.push(t);
                }),
                angular.forEach(W.filter.resolutiontags, function (e, t) {
                  e || o.push(t);
                }),
                angular.forEach(W.filter.ratingtags, function (e, t) {
                  e || o.push(t);
                }),
                angular.forEach(W.filter.tags, function (e, t) {
                  e || o.push(t);
                }),
                angular.forEach(W.filter.utilitytags, function (e, t) {
                  1 === e ? n.push(t) : 2 === e && o.push(t);
                }),
                0 < n.length &&
                  (angular.forEach(l, function (t) {
                    var a = !0;
                    (angular.forEach(n, function (e) {
                      angular.isString(t.tags) &&
                        t.tags.indexOf(e) < 0 &&
                        (a = !1);
                    }),
                      a && i.push(t));
                  }),
                  (l = i),
                  (i = [])),
                0 < o.length &&
                  (angular.forEach(l, function (t) {
                    var a = !1;
                    (angular.forEach(o, function (e) {
                      angular.isString(t.tags) &&
                        0 <= t.tags.indexOf(e) &&
                        (a = !0);
                    }),
                      a || i.push(t));
                  }),
                  (l = i),
                  (i = [])))),
              (W.filterAuthor && W.filterAuthor.installedAuthor &&
                (l = l.filter(function (w) {
                  if (!w) return false;
                  var _targetAuthor = String(W.filterAuthor.installedAuthor).trim().toLowerCase();
                  if (w.author && String(w.author).trim().toLowerCase() === _targetAuthor) return true;
                  if (w.authorsteamid && String(w.authorsteamid).trim().toLowerCase() === _targetAuthor) return true;
                  var _wid = w.workshopid || (w.file ? String(w.file).replace(/^workshop\//, "") : null);
                  if (_wid && W.installedMetadata) {
                    var _meta = W.installedMetadata[_wid] || W.installedMetadata[w.file];
                    if (_meta) {
                      if (_meta.author && String(_meta.author).trim().toLowerCase() === _targetAuthor) return true;
                      if (_meta.authorsteamid && String(_meta.authorsteamid).trim().toLowerCase() === _targetAuthor) return true;
                    }
                  }
                  if (w.authorsteamid && W.steamUserInfos && W.steamUserInfos[w.authorsteamid]) {
                    var _u = W.steamUserInfos[w.authorsteamid];
                    if (_u && _u.name && String(_u.name).trim().toLowerCase() === _targetAuthor) return true;
                  }
                  return false;
                }))),
              (W.filterHelper &&
                (W.filterHelper.type_tag &&
                  (l = l.filter(function (w) {
                    return hasHelperTag(w, W.filterHelper.type_tag);
                  })),
                W.filterHelper.category &&
                  (l = l.filter(function (w) {
                    return hasHelperTag(w, W.filterHelper.category);
                  })),
                W.filterHelper.resolution &&
                  (l = l.filter(function (w) {
                    return hasHelperTag(w, W.filterHelper.resolution);
                  })),
                W.filterHelper.age_rating &&
                  (l = l.filter(function (w) {
                    return hasHelperTag(w, W.filterHelper.age_rating);
                  })),
                W.filterHelper.misc_tags && W.filterHelper.misc_tags.length > 0 &&
                  (l = l.filter(function (w) {
                    for (var mi = 0; mi < W.filterHelper.misc_tags.length; mi++) {
                      if (!hasHelperTag(w, W.filterHelper.misc_tags[mi])) return false;
                    }
                    return true;
                  })),
                W.filterHelper.genre_tags && W.filterHelper.genre_tags.length > 0 &&
                  (l = l.filter(function (w) {
                    for (var gi = 0; gi < W.filterHelper.genre_tags.length; gi++) {
                      if (!hasHelperTag(w, W.filterHelper.genre_tags[gi])) return false;
                    }
                    return true;
                  })),
                W.filterHelper.excluded_misc_tags && W.filterHelper.excluded_misc_tags.length > 0 &&
                  (l = l.filter(function (w) {
                    for (var mi = 0; mi < W.filterHelper.excluded_misc_tags.length; mi++) {
                      if (hasHelperTag(w, W.filterHelper.excluded_misc_tags[mi])) return false;
                    }
                    return true;
                  })),
                W.filterHelper.excluded_genre_tags && W.filterHelper.excluded_genre_tags.length > 0 &&
                  (l = l.filter(function (w) {
                    for (var gi = 0; gi < W.filterHelper.excluded_genre_tags.length; gi++) {
                      if (hasHelperTag(w, W.filterHelper.excluded_genre_tags[gi])) return false;
                    }
                    return true;
                  })))),
              angular.isString(W.filter.text) &&
              0 < W.filter.text.length &&
              ((a = W.filter.text.toLowerCase().replace(/[\?\.\!]/g, "")),
              (e = []),
              (r = /\b3d\b/gi),
              (s = /\b(puppet|puppet warp|puppetwarp)\b/gi),
              0 <= a.search((p = /\bhdr\b/gi)) &&
                ((a = a.replace(p, "")), e.push("HDR")),
              0 <= a.search(r) && ((a = a.replace(r, "")), e.push("3D")),
              0 <= a.search(s) &&
                ((a = a.replace(s, "")), e.push("Puppet Warp")),
              0 < e.length &&
                (angular.forEach(l, function (t) {
                  var a = !0;
                  (angular.forEach(e, function (e) {
                    angular.isString(t.tags) &&
                      t.tags.indexOf(e) < 0 &&
                      (a = !1);
                  }),
                    a && i.push(t));
                }),
                (l = i),
                (i = [])),
              0 < a.length)
                ? angular.forEach(l, function (e) {
                    var t = e.title.toLowerCase().replace(/[\?\.\!]/g, "");
                    (t.includes(a) || V.damerauLevenshteinDistance(t, a) < 3) &&
                      i.push(e);
                  })
                : (i = l.slice()),
              (W.filter.descending
                ? i.sort(be[W.filter.sort] || be.name)
                : i.sort(he[W.filter.sort] || he.name)),
              (p = (W.sortedWallpapers = i).length),
              (W.showFilter.counts = W.showFilter.base && p !== c),
              (W.filteredCount = p),
              (W.unfilteredCount = c),
              (d = d.slice()),
              W.filter.descending ? d.sort(be.name) : d.sort(he.name),
              (W.sortedFolders = d),
              (W.sortedWallpapersPrePagination = W.sortedWallpapers.slice()),
              (W.sortedFoldersPrePagination = W.sortedFolders.slice()),
              (r =
                (W.browserSettings && W.browserSettings.resultsperpage) || 100),
              (s = W.sortedFolders.length),
              (u.visible = r < (l = p + s)),
              u.visible &&
                ((c = Math.floor(l / r) + (l % r ? 1 : 0)),
                V.updatePagination(u, u.current, c),
                (d = r * (u.current - 1)),
                (p = r * u.current),
                (W.sortedFolders = W.sortedFolders.sliceLimit(d, p)),
                (W.sortedWallpapers = W.sortedWallpapers.sliceLimit(
                  d - s,
                  p - s,
                ))),
              angular.forEach(W.sortedWallpapers, function (e) {
                e.localAndExternal &&
                  !e.requestedThumbnail &&
                  ((e.requestedThumbnail = !0), W.requestThumbnailPath(e));
              }))
            : ((W.sortedWallpapersPrePagination = []),
              (W.sortedFoldersPrePagination = []),
              Be());
        }
        function je(e, t, a) {
          for (var i = 0; i < d.length; ++i) if (d[i].file === e) return d[i];
          var n,
            o = a || e,
            r = "ui_workshop_tags_local",
            s = "images/preview_local.jpg",
            l = ["Everyone", "Local"],
            c =
              (V.isURL(e)
                ? ((r = "ui_workshop_tags_local_url"),
                  (s = "images/preview_url.jpg"),
                  l.push((n = "Web")))
                : ((c = e),
                  Ae
                    ? Te.wallpaperFiles.push(c)
                    : ((Te = { wallpaperFiles: [c] }),
                      (Ae = m(function () {
                        ((Ae = void 0),
                          j
                            .callDeferred(
                              "browseWallpaperObject",
                              "updateLocalWallpaperProjectInfo",
                              Te.wallpaperFiles,
                            )
                            .then(function (e) {
                              (angular.forEach(e, function (t) {
                                angular.forEach(d, function (e) {
                                  e.file === t.file && angular.merge(e, t);
                                });
                              }),
                                z());
                            }));
                      }))),
                  V.isExtension(e, "video")
                    ? ((r = "ui_workshop_tags_local_video"),
                      l.push("Video"),
                      (n = "Video"))
                    : V.isExtension(e, "application")
                      ? ((r = "ui_workshop_tags_local_application"),
                        l.push("Application"),
                        (n = "Application"))
                      : V.isExtension(e, "web")
                        ? ((r = "ui_workshop_tags_local_web"),
                          l.push("Web"),
                          (n = "Web"))
                        : V.isExtension(e, "scene")
                          ? ((r = "ui_workshop_tags_local_scene"),
                            l.push("Scene"),
                            (n = "Scene"))
                          : V.isExtension(e, "static") &&
                            ((r = "ui_workshop_tags_local_image"),
                            l.push("Scene"),
                            (n = "Image")),
                  (o = a || V.getFilename(e))),
              {
                file: e,
                title: o,
                preview: s,
                previewsmall: s,
                tags: l.join(","),
                local: !0,
                localAndExternal: !0,
                status: "installed",
                type: n,
                typelabel: r,
                filesize: 0,
                subscriptiondate: 0,
                favorite: !1,
                rating: 0,
              });
          return (
            angular.isDefined(t) && (c.overridetype = t),
            d.push(c),
            W.wallpapers.push(c),
            c
          );
        }
        function Le(e) {
          if (angular.isArray(e)) return angular.forEach(e, Le);
          for (var t = 0; t < d.length; ++t) d[t].file === e && d.splice(t, 1);
          for (t = 0; t < W.wallpapers.length; ++t)
            W.wallpapers[t].file === e && W.wallpapers.splice(t, 1);
        }
        function _(t) {
          var a;
          return (
            angular.forEach(W.monitors, function (e) {
              e.location === t && (a = e);
            }),
            angular.forEach(W.monitorSplits, function (e) {
              e.left && e.left.location === t
                ? (a = e.left)
                : e.right && e.right.location === t && (a = e.right);
            }),
            a || W.monitorGroups[t]
          );
        }
        function ze() {
          var t = W.monitors.slice();
          return (
            angular.forEach(W.monitorSplits, function (e) {
              (e.left && t.push(e.left), e.right && t.push(e.right));
            }),
            angular.forEach(W.monitorGroups, function (e) {
              t.push(e);
            }),
            t
          );
        }
        function p(t) {
          var a;
          return (
            angular.forEach(W.wallpapers, function (e) {
              e.file === t && (a = e);
            }),
            a
          );
        }
        function He(t) {
          var a;
          return (
            (t = "" + t),
            angular.forEach(W.wallpapers, function (e) {
              e.workshopid === t && (a = e);
            }),
            a
          );
        }
        function $e(e) {
          if (angular.isObject(e)) return (e.localAndExternal ? je : p)(e.file);
        }
        function Ue() {
          var e = angular.element("#PlaylistContainerTimeline");
          (0 === e.length
            ? (t && t.remove(), (t = void 0))
            : (t && !e.has(t) && (t.remove(), (t = void 0)),
              t ||
                ((t = angular.element(document.createElement("div"))).addClass(
                  "currentTimeIndicator",
                ),
                e.append(t))),
            (Re = m(Ue, 1e4)),
            t &&
              ((e =
                ((60 * (e = new Date()).getHours() + e.getMinutes()) / 1440) *
                100),
              t.css({ left: e + "%" })));
        }
        function Ge(e) {
          for (var t = 0, a = 0, i = 0; i < e.length; ++i) {
            var n = e[i],
              o = void 0;
            if (
              (angular.isNumber(n.daytimeend)
                ? (o = n.daytimeend)
                : i === e.length - 1 && (o = 1),
              angular.isNumber(o))
            ) {
              if (0 < (r = i - t + 1))
                for (var r = (1 / r) * (o - a), s = t; s <= i; ++s)
                  e[s].flex = r;
              ((t = i + 1), (a = o));
            }
          }
          (Re && m.cancel(Re), (Re = m(Ue)));
        }
        function qe(e) {
          return {
            settings: angular.copy(e.settings),
            name: e.name || "",
            items: e.items.map(function (e) {
              var t;
              return angular.isNumber(e.daytimeend) ||
                angular.isString(e.preset)
                ? ((t = { file: e.wallpaper.file }),
                  angular.isNumber(e.daytimeend) &&
                    (t.daytimeend = e.daytimeend),
                  angular.isString(e.preset) && (t.preset = e.preset),
                  t)
                : e.wallpaper.file;
            }),
          };
        }
        function Ne(e) {
          for (
            var t = {
                settings: angular.copy(e.settings),
                name: e.name,
                items: [],
              },
              a = 0;
            a < e.items.length;
            ++a
          ) {
            var i,
              n = e.items[a];
            (angular.isString(n)
              ? ((i = p(n)), angular.isObject(i) && (i = { wallpaper: i }))
              : angular.isObject(n) &&
                angular.isString(n.file) &&
                ((i = p(n.file)), angular.isObject(i)) &&
                (i = {
                  wallpaper: i,
                  daytimeend: n.daytimeend,
                  preset: n.preset,
                }),
              angular.isObject(i) && t.items.push(i));
          }
          return (Ge(t.items), t);
        }
        function y(t) {
          var a;
          (((t = angular.isObject(t) ? t : W.selectedMonitor).playlistFlags =
            {}),
            0 < t.playlist.items.length &&
              (delete t.playlist.items[t.playlist.items.length - 1].daytimeend,
              (a = 0),
              angular.forEach(t.playlist.items, function (e) {
                (angular.isObject(e.wallpaper) &&
                  angular.isString(e.wallpaper.file) &&
                  (t.playlistFlags[e.wallpaper.file] = !0),
                  angular.isNumber(e.daytimeend) &&
                    (e.daytimeend < a || "daytime" !== t.playlist.settings.mode
                      ? delete e.daytimeend
                      : (a = e.daytimeend)));
              })),
            j.callDeferred(
              "browseWallpaperObject",
              "selectPlaylist",
              qe(t.playlist),
              t.location,
            ),
            Ge(t.playlist.items),
            snapshotAppliedConfig());
        }
        function Qe(e) {
          var t = _(e);
          (angular.isDefined(t) &&
            ((t.wallpaper = void 0),
            W.selectedMonitor === t && (W.currentSelection = void 0),
            (t.playlistFlags = {}),
            (t.playlist.items = [])),
            (W.wallpaperConfig.selectedwallpapers[e] = {}),
            j.callDeferred("browseWallpaperObject", "removeWallpaper", {
              location: e,
              playlist: !0,
            }));
        }
        function Ke(a, e) {
          e && W.currentSelection === a && (W.currentSelection = void 0);
          e = ze();
          angular.forEach(e, function (e) {
            delete e.playlistFlags[a.file];
            var t = e.playlist.items.findIndex(function (e) {
              return e.wallpaper === a;
            });
            0 <= t
              ? (e.playlist.items.splice(t, 1), y(e))
              : e.wallpaper === a &&
                ((e.wallpaper = void 0),
                j.callDeferred("browseWallpaperObject", "removeWallpaper", {
                  location: e.location,
                  playlist: !1,
                }));
          });
        }
        function l(e, t) {
          var a;
          ((t = t || (W.selectedMonitor && W.selectedMonitor.location)),
            !angular.isUndefined(t) &&
              angular.isObject(e) &&
              (((a = W.wallpaperConfig.selectedwallpapers[t] || {}).file =
                e.file),
              (W.wallpaperConfig.selectedwallpapers[t] = a),
              W.selectedMonitor && W.selectedMonitor.location === t
                ? ((W.currentSelection = e), (W.selectedMonitor.wallpaper = e))
                : ((a = _(t)), angular.isObject(a) && (a.wallpaper = e)),
              j.callDeferred(
                "browseWallpaperObject",
                "selectWallpaper",
                e.file,
                t,
                e.overridetype,
              )));
        }
        function Ye(o, e) {
          if (!angular.isArray(o)) {
            if (!angular.isObject(o)) return;
            o = [o];
          }
          var t,
            a,
            i,
            r = [],
            s = [],
            l = [],
            n = {};
          function c() {
            var e,
              t =
                W.sortedWallpapers &&
                W.sortedWallpapers.indexOf(W.currentSelection),
              a = t + r.length,
              i =
                0 <= t &&
                t < W.sortedWallpapers.length &&
                W.sortedWallpapers[a],
              n =
                0 < t &&
                t <= W.sortedWallpapers.length &&
                W.sortedWallpapers[t - 1];
            (0 < r.length &&
              (angular.forEach(r, function (it) {
                var wid = String(it.workshopid);
                if (wid && window.WengineHelper) {
                  if (window.WengineHelper.removeInstalledWorkshopId) window.WengineHelper.removeInstalledWorkshopId(wid);
                  if (window.WengineHelper._installedIds) delete window.WengineHelper._installedIds[wid];
                  if (!isWallpaperTrulyApplied(it)) {
                    var wasInPreview = revertPreviewIfActive(it);
                    var doDel = function () {
                      window.WengineHelper.deleteWallpaper({ pubfileid: wid, file: it.file || "" }).then(function (res) {
                        if (!res || res.ok === false) {
                          console.error("Delete failed:", (res && res.error) || res);
                        }
                      });
                    };
                    if (wasInPreview) {
                      setTimeout(doDel, 250);
                    } else {
                      doDel();
                    }
                  }
                }
                if (wid && W.activeDownloads) delete W.activeDownloads[wid];
                if (wid && W.activeExtracts) delete W.activeExtracts[wid];
                if (wid && W.queryWallpapers) {
                  for (var q = 0; q < W.queryWallpapers.length; q++) {
                    var qw = W.queryWallpapers[q];
                    if (qw && String(qw.workshopid) === wid) {
                      qw.status = "downloadable";
                      qw.local = false;
                      qw.file = "workshop/" + wid;
                    }
                  }
                }
                if (W.currentSelection && (String(W.currentSelection.workshopid) === wid || W.currentSelection.file === it.file)) {
                  if (W.sourceIsWorkshop) {
                    W.currentSelection.status = "downloadable";
                    W.currentSelection.local = false;
                    W.currentSelection.file = "workshop/" + wid;
                  }
                }
                if (wid && W.installedMetadata) delete W.installedMetadata[wid];
                if (wid && window.WengineHelper && window.WengineHelper.deleteMetadata) window.WengineHelper.deleteMetadata(wid);
              }),
              (function () {
                
              })(),
              j.callDeferred(
                "ui",
                "unsubscribeWorkshopItem",
                r.map(function (e) {
                  return e.workshopid;
                }),
              )),
              0 < s.length &&
                (Le(
                  (e = s.map(function (e) {
                    return e.file;
                  })),
                ),
                j.callDeferred(
                  "browseWallpaperObject",
                  "removeLocalWallpaperFromHistory",
                  e,
                )),
              0 < l.length &&
                (Le(
                  (e = l.map(function (e) {
                    return e.file;
                  })),
                ),
                j.callDeferred(
                  "browseWallpaperObject",
                  "removeOfficialWallpaper",
                  e,
                )),
              z(),
              (window.WengineHelper && window.WengineHelper.setInstalledWallpapers && window.WengineHelper.setInstalledWallpapers(W.wallpapers)),
              st(),
              (W.sourceIsWorkshop && P()),
              o.includes(W.currentSelection) &&
                (Ke(W.currentSelection, W.sourceIsInstalled),
                W.sourceIsInstalled) &&
                W.isMiniMode &&
                (a < W.sortedWallpapers.length
                  ? (i = p(i.file)) && W.callbackWallpaperSelected(i)
                  : 0 < t &&
                    (n = p(n.file)) &&
                    W.callbackWallpaperSelected(n)));
          }
          function d(e) {
            for (var t = "", a = Math.min(3, e.length), i = 0; i < a; ++i)
              ((t += e[i].title), i + 1 < a && (t += ", "));
            return (a < e.length && (t += ", ... (" + e.length + ")"), t);
          }
          (angular.forEach(o, function (e) {
            e.official
              ? l.push(e)
              : e.localAndExternal
                ? s.push(e)
                : angular.isString(e.workshopid) &&
                  (r.push(e), (n[e.workshopid] = !0));
          }),
            0 < r.length && 0 === s.length && 0 === l.length && !L()
              ? V.showSteamError()
              : 0 !== (t = r.concat(s).concat(l)).length &&
                ((a = []),
                angular.forEach(W.wallpapers, function (e) {
                  angular.isString(e.dependency) &&
                    n[e.dependency] &&
                    !r.includes(e) &&
                    a.push(e);
                }),
                (r = r.concat(a)),
                e
                  ? ((e = d(t)),
                    (i = d(a)),
                    O(
                      [
                        "ui_browse_modal_unsubscribe_body",
                        "ui_browse_modal_remove_local_body",
                        "ui_browse_modal_remove_preset_info",
                        "ui_browse_modal_unsubscribe_wallpapers_header",
                      ],
                      { title: e, presets: i, count: t.length },
                    )
                      .then(function (e) {
                        return F.open("genericConfirm", {
                          data: {
                            title:
                              0 < r.length
                                ? "ui_browse_modal_unsubscribe_header"
                                : "ui_browse_modal_remove_local_header",
                            message:
                              (0 < r.length
                                ? e.ui_browse_modal_unsubscribe_body
                                : e.ui_browse_modal_remove_local_body) +
                              (0 < a.length
                                ? e.ui_browse_modal_remove_preset_info
                                : ""),
                            okVisible: !0,
                            cancelVisible: !0,
                          },
                        });
                      })
                      .then(c))
                  : c()));
        }
        function Xe(n, o) {
          var r;
          return angular.isString(n) &&
            angular.isArray(W.browserSettings.applicationwhitelist) &&
            W.browserSettings.applicationwhitelist.includes(n)
            ? D.when()
            : O(
                [
                  "ui_browse_modal_application_warning_body",
                  "ui_browse_modal_application_warning_timer",
                ],
                { filepath: n, time: (r = 3) },
              ).then(function (t) {
                var a = {
                    title: "ui_browse_modal_application_warning_header",
                    message:
                      t.ui_browse_modal_application_warning_body +
                      t.ui_browse_modal_application_warning_timer,
                    leftIcon: "images/warning.png",
                    okClass: "btn-danger",
                    okText: "ui_browse_modal_proceed",
                    okVisible: !0,
                    okDisabled: !0,
                    cancelVisible: !0,
                    leftVisible: angular.isObject(o),
                    leftClass: "btn-danger",
                    leftText: "ui_browse_details_btn_unsubscribe",
                    leftAction: "unsubscribe",
                    checkboxCenterVisible: !0,
                    checkboxChecked: !1,
                    checkboxTitle:
                      "ui_browse_modal_application_warning_disable_checkbox",
                  },
                  i = function () {
                    O("ui_browse_modal_application_warning_timer", {
                      time: --r,
                    }).then(function (e) {
                      ((a.message =
                        t.ui_browse_modal_application_warning_body + e),
                        0 < r ? m(i, 1e3) : (a.okDisabled = !1));
                    });
                  };
                return (
                  m(i, 1e3),
                  F.open(
                    "genericConfirm",
                    { data: a },
                    { backdropClass: "modal-backdrop-danger" },
                  ).then(function (e) {
                    return "unsubscribe" === e
                      ? (Ye(o), D.reject())
                      : (a.checkboxChecked &&
                          (angular.isArray(
                            W.browserSettings.applicationwhitelist,
                          )
                            ? W.browserSettings.applicationwhitelist.push(n)
                            : (W.browserSettings.applicationwhitelist = [n])),
                        e);
                  })
                );
              });
        }
        function Je() {
          var t = [];
          return (
            angular.forEach(W.monitors, function (e) {
              (!e.isInGroup && angular.isObject(W.monitorSplits[e.location])) ||
                t.push(e);
            }),
            angular.forEach(W.monitorSplits, function (e) {
              (e.left &&
                !e.left.isInGroup &&
                angular.isUndefined(W.monitorSplits[e.left.location]) &&
                t.push(e.left),
                e.right &&
                  !e.right.isInGroup &&
                  angular.isUndefined(W.monitorSplits[e.right.location]) &&
                  t.push(e.right));
            }),
            angular.forEach(W.monitorGroups, function (e) {
              t.push(e);
            }),
            t
          );
        }
        function Ze() {
          var e = Je();
          ((W.showMonitorRow =
            "screensaver" === W.wallpaperConfigGroup ||
            1 < e.length ||
            (0 < e.length && e[0].isGroup) ||
            (1 === W.monitors.length && Me(W.monitors[0]))),
            (W.showMonitorIndex = 1 < W.monitors.length),
            (W.showMonitorAutoShowToggle = 1 < W.monitors.length));
        }
        function et(e) {
          var a = [];
          return (
            angular.forEach(e, function (e) {
              "folder" === e.type
                ? (angular.forEach(e.items, function (e, t) {
                    t = He(t) || p(t);
                    t && a.push(t);
                  }),
                  (a = a.concat(et(e.subfolders))))
                : a.push(e);
            }),
            a
          );
        }
        function H(e, t, a) {
          var i;
          if (0 === W.multiSelection.length && t)
            return ((i = [t]), (i = e ? et(i) : i));
          ((i = W.multiSelection.slice()),
            W.currentSelection && i.unshiftIfNew(W.currentSelection),
            t && i.unshiftIfNew(t),
            e && (i = et(i)));
          var n = et((n = Fe())),
            o = [];
          return (
            angular.forEach(i, function (e) {
              !n.includes(e) ||
                ((a ? e.status !== a : "downloadable" === e.status) &&
                  "any" !== a) ||
                o.push(e);
            }),
            o
          );
        }
        function tt(i) {
          function n(e) {
            W.sourceIsExplore ||
              ((e = angular.element(e)) &&
                e[0] &&
                e[0].scrollIntoView &&
                e[0].scrollIntoView({
                  behavior: "smooth",
                  inline: "nearest",
                  block: "nearest",
                }));
          }
          m(function () {
            var e, t, a;
            angular.isObject(W.wallpaperConfig) &&
              angular.isObject(W.selectedMonitor) &&
              angular.isObject(W.wallpaperConfig.selectedwallpapers) &&
              ((t = i || W.currentSelection),
              !angular.isObject(t) &&
                W.wallpaperConfig.selectedwallpapers.hasOwnProperty(
                  W.selectedMonitor.location,
                ) &&
                ((e =
                  W.wallpaperConfig.selectedwallpapers[
                    W.selectedMonitor.location
                  ]),
                (t = W.currentSelection = $e(e))),
              angular.isObject(t)) &&
              (window.safeApply(W),
              (a = 0),
              angular.forEach(W.sortedWallpapers, function (e) {
                (t === e && n("#wpimg" + a), ++a);
              }),
              (a = 0),
              angular.forEach(W.sortedFolders, function (e) {
                (t === e && n("#wpfolder" + a), ++a);
              }));
          });
        }
        function w(e) {
          angular.isObject(e) &&
            ((W.browserSettings.lastselectedmonitor = e.location),
            (W.selectedMonitor = e),
            (e = W.wallpaperConfig.selectedwallpapers[e.location]),
            (W.currentSelection = angular.isObject(e) ? $e(e) : void 0),
            tt());
        }
        function at(e) {
          return e && e.playlist && 1 < e.playlist.items.length;
        }
        function k(e) {
          ((e.playlistFlags = {}),
            (e.playlist = { items: [], settings: _e() }));
        }
        function it(e) {
          var t = {};
          return (
            at(e)
              ? ((t.playlistFlags = angular.copy(e.playlistFlags)),
                (t.playlist = angular.copy(e.playlist)),
                angular.isArray(e.playlist.items) &&
                  (t.playlist.items = e.playlist.items.slice()))
              : k(t),
            t
          );
        }
        function nt(e, t) {
          ((t = t || W.selectedMonitor),
            at(e)
              ? ((t.playlistFlags = angular.copy(e.playlistFlags)),
                (t.playlist = angular.copy(e.playlist)),
                angular.isArray(e.playlist.items) &&
                  (t.playlist.items = e.playlist.items.slice()))
              : k(t),
            y());
        }
        function ot(e, t) {
          at(e)
            ? ((t.playlistFlags = angular.copy(e.playlistFlags)),
              (t.playlist = angular.copy(e.playlist)),
              angular.isArray(e.playlist.items) &&
                (t.playlist.items = e.playlist.items.slice()))
            : k(t);
        }
        function rt() {
          var a;
          angular.isArray(W.monitors) &&
            angular.isObject(W.wallpaperConfig) &&
            angular.isObject(W.wallpaperConfig.selectedwallpapers) &&
            (angular.forEach(
              W.wallpaperConfig.selectedwallpapers,
              function (e, t) {
                var a = _(t);
                if (angular.isObject(a)) {
                  if (
                    (angular.isArray(a.missingPlaylistItems) ||
                      (angular.isObject(e.playlist)
                        ? ((a.playlist = Ne(e.playlist)),
                          (a.playlist.items = []),
                          (a.missingPlaylistItems = angular.isArray(
                            e.playlist && e.playlist.items,
                          )
                            ? e.playlist.items
                            : []),
                          (a.missingPlaylistItems = a.missingPlaylistItems.map(
                            function (e) {
                              return {
                                name: e.file || e,
                                daytimeend: e.daytimeend,
                                preset: e.preset,
                              };
                            },
                          )))
                        : (k(a), (a.missingPlaylistItems = []))),
                    angular.isArray(a.missingPlaylistItems))
                  )
                    for (var i = 0; i < a.missingPlaylistItems.length; ++i) {
                      var n,
                        o = a.missingPlaylistItems[i],
                        r = p(o.name);
                      angular.isObject(r)
                        ? (a.missingPlaylistItems.splice(i, 1),
                          --i,
                          (n = a.playlist.items.indexOf(o.stub)),
                          angular.isObject(o.stub) && 0 <= n
                            ? a.playlist.items.splice(n, 1, {
                                wallpaper: r,
                                daytimeend: o.daytimeend,
                                preset: o.preset,
                              })
                            : a.playlist.items.push({
                                wallpaper: r,
                                daytimeend: o.daytimeend,
                                preset: o.preset,
                              }),
                          (a.playlistFlags[o.name] = !0))
                        : angular.isObject(o.stub) ||
                          ((o.stub = {
                            wallpaper: {
                              file: o.name,
                              preview: "images/nopreview.jpg",
                              status: "error",
                            },
                            daytimeend: o.daytimeend,
                            preset: o.preset,
                            isStub: !0,
                          }),
                          a.playlist.items.push(o.stub));
                    }
                  a.playlist && a.playlist.items && Ge(a.playlist.items);
                }
              },
            ),
            te ||
              ((a = !0),
              angular.forEach(
                W.wallpaperConfig.selectedwallpapers,
                function (e, t) {
                  ((e = $e(e)), (t = _(t)));
                  ((a = angular.isDefined(e)),
                    angular.isObject(e) &&
                      angular.isObject(t) &&
                      (t.wallpaper = e));
                },
              ),
              (te = a)));
        }
        function g(e, t) {
          return (
            t && ((e = angular.copy(e)).refresh = !0),
            j.callDeferred("browseWallpaperObject", "updateProfile", e)
          );
        }
        function st() {
          if (
            angular.isArray(W.queryWallpapers) &&
            angular.isArray(W.wallpapers)
          ) {
            if (window.WengineHelper && window.WengineHelper.setInstalledWallpapers) {
              window.WengineHelper.setInstalledWallpapers(W.wallpapers);
            }
            var installedMap = {};
            for (var a = 0; a < W.wallpapers.length; ++a) {
              var inst = W.wallpapers[a];
              var iWid = W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(inst) : (inst.workshopid || "");
              if (iWid) {
                installedMap[String(iWid)] = inst;
              }
            }
            for (var e = 0; e < W.queryWallpapers.length; ++e) {
              var t = W.queryWallpapers[e];
              var tWid = W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(t) : (t.workshopid || "");
              if (tWid && installedMap[String(tWid)]) {
                var localInst = installedMap[String(tWid)];
                t.status = "installed";
                t.file = localInst.file;
                if (localInst.pkgfile && !t.pkgfile) t.pkgfile = localInst.pkgfile;
                if (W.currentSelection === t) {
                  W.callbackWallpaperSelected(t);
                }
              } else if (tWid && ((W.isWallpaperInstalled && W.isWallpaperInstalled(tWid)) || (window.WengineHelper && window.WengineHelper.isWallpaperInstalled && window.WengineHelper.isWallpaperInstalled(tWid)))) {
                t.status = "installed";
              } else {
                t.status = "downloadable";
                t.local = false;
                if (tWid) t.file = "workshop/" + tWid;
              }
              if (W.currentSelection && tWid) {
                var curWid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(W.currentSelection) : (W.currentSelection.workshopid || W.currentSelection.id));
                if (curWid && String(curWid) === String(tWid)) {
                  W.currentSelection.status = t.status;
                  W.currentSelection.local = t.local;
                  if (t.file) W.currentSelection.file = t.file;
                }
              }
            }
          }
        }
        function lt(e, t) {
          e = W.browserSettingsExtensions.authorblocklist.includes(
            e.authorsteamid,
          );
          return e ===
            W.browserSettingsExtensions.authorblocklist.includes(
              t.authorsteamid,
            )
            ? 0
            : e
              ? 1
              : -1;
        }
        function ct(e) {
          angular.isObject(ee) &&
            angular.forEach(e, function (e) {
              var t = ee[e.file];
              angular.isObject(t) &&
                (angular.isObject(e.properties) || (e.properties = {}),
                angular.merge(e.properties, t.properties),
                (e.defaultproperties = t.defaultproperties),
                (e.propertyPresets = t.presets),
                (e.cancreatepresets = t.cancreatepresets),
                (e.aspect = t.aspect),
                Ve(e));
            });
        }
        function $(e) {
          if (angular.isArray(e)) return angular.forEach(e, $);
          W.multiSelection.includes(e) || W.multiSelection.push(e);
        }
        function dt(e) {
          if (angular.isArray(e)) return angular.forEach(e, dt);
          (e === W.currentSelection && (W.currentSelection = void 0),
            W.multiSelection.findAndRemove(e));
        }
        function pt(e) {
          if (W.canUseMultiselect())
            return angular.isArray(e)
              ? angular.forEach(e, pt)
              : void (
                  W.multiSelection.includes(e) || W.currentSelection === e
                    ? dt
                    : $
                )(e);
        }
        function ut() {
          W.multiSelection = [];
        }
        function gt(e, t) {
          return ((e && e.title) || "").localeCompare((t && t.title) || "");
        }
        function ft(e) {
          (angular.isArray(e) || (e = [e]),
            angular.forEach(e, function (e) {
              "folder" === e.type && W.folders.findAndRemove(e);
            }),
            (function e(a, t) {
              angular.forEach(t, function (t) {
                (angular.forEach(a, function (e) {
                  "folder" === e.type
                    ? t.subfolders.findAndRemove(e)
                    : delete t.items[e.workshopid || e.file];
                }),
                  e(a, t.subfolders));
              });
            })(e, W.folders));
        }
        function mt(e, t) {
          ((e = angular.isArray(e) ? e : [e]).findAndRemove(function (e) {
            return e === t;
          }),
            ft(e),
            t
              ? angular.forEach(e, function (e) {
                  "folder" === e.type
                    ? t.subfolders.push(e)
                    : (t.items[e.workshopid || e.file] = 1);
                })
              : angular.forEach(e, function (e) {
                  "folder" === e.type && W.folders.pushIfNew(e);
                }));
        }
        function vt(e, t) {
          (mt(H(!1, e), t), ut());
        }
        function ht(e) {
          Ye(H(!0, e), !0);
        }
        function bt(e) {
          for (var t = 0; t < e.length; ++t) {
            var a = e[t];
            angular.isString(a.title) && 0 !== a.title.length
              ? ((a.approved = 0 <= a.tags.indexOf("Approved")),
                (a.portrait = 0 <= a.tags.indexOf("Portrait")))
              : (e.splice(t, 1), --t);
          }
        }
        ((W.sortWallpapers = z),
          (W.updateWallpapers = function (e, t) {
            try {
              var a,
                i = angular.isDefined(W.currentSelection),
                n = ((e, t) => {
                  for (
                    var a = { newWallpapers: [], shouldSort: !1 },
                      i = {},
                      n = 0;
                    n < W.wallpapers.length;
                    ++n
                  ) {
                    var o = W.wallpapers[n];
                    o.ispreset &&
                      (angular.isArray(i[o.dependency]) ||
                        (i[o.dependency] = []),
                      i[o.dependency].push(o));
                  }
                  for (var r = [], n = 0; n < e.length; ++n) {
                    var s,
                      l = e[n],
                      c = !1,
                      d = "unsubscribed" === l.status;
                    if (angular.isDefined(l.workshopid))
                      for (s = 0; s < t.length; ++s) {
                        var p,
                          u = t[s];
                        angular.isDefined(u.workshopid) &&
                          u.workshopid === l.workshopid &&
                          ((c = !0),
                          d
                            ? ((p = W.currentSelection === u),
                              W.sourceIsInstalled
                                ? (p && (W.currentSelection = void 0),
                                  (a.shouldSort = !0))
                                : (angular.merge(u, l),
                                  (u.status = "downloadable")),
                              Ke(u, W.sourceIsInstalled),
                              t.splice(s, 1),
                              --s)
                            : ((p = !1),
                              u.status !== l.status && "installed" === l.status
                                ? (angular.isArray(i[l.workshopid]) &&
                                    (r = r.concat(i[l.workshopid])),
                                  W.currentSelection === u &&
                                    (p = !(W.currentSelection = void 0)))
                                : W.currentSelection === u &&
                                  "installed" === l.status &&
                                  l.ispreset &&
                                  (p = !(W.currentSelection = void 0)),
                              angular.merge(u, l),
                              p && W.callbackWallpaperSelected(u)));
                      }
                    if (l.local)
                      for (s = 0; s < t.length; ++s)
                        (u = t[s]).local &&
                          u.file === l.file &&
                          (angular.merge(u, l), (a.shouldSort = c = !0));
                    ((l.approved =
                      angular.isString(l.tags) &&
                      0 <= l.tags.indexOf("Approved")),
                      (l.portrait =
                        angular.isString(l.tags) &&
                        0 <= l.tags.indexOf("Portrait")),
                      c || d || a.newWallpapers.push(l));
                  }
                  for (n = 0; n < a.newWallpapers.length; ++n) {
                    var g = a.newWallpapers[n];
                    angular.isArray(i[g.workshopid]) &&
                      (r = r.concat(i[g.workshopid]));
                  }
                  return (
                    0 < r.length &&
                      ((r = r.map(function (e) {
                        return e.workshopid;
                      })),
                      j.callDeferred(
                        "browseWallpaperObject",
                        "queryWorkshopIds",
                        r,
                      )),
                    a
                  );
                })(e, W.wallpapers);
              (ct(n.newWallpapers),
                Array.prototype.push.apply(W.wallpapers, n.newWallpapers),
                (0 < n.newWallpapers.length || n.shouldSort
                  ? ((a = function (a) {
                      return function (t) {
                        var e = a.findAndReplace(function (e) {
                          return e.workshopid && e.workshopid === t.workshopid;
                        }, t);
                        0 < e.length &&
                          e[0] === W.currentSelection &&
                          W.callbackWallpaperSelected(t);
                      };
                    }),
                    W.sourceIsExplore
                      ? (angular.forEach(W.sortedExploreQueries, function (e) {
                          angular.isArray(e.wallpapers) &&
                            angular.forEach(n.newWallpapers, a(e.wallpapers));
                        }),
                        angular.forEach(n.newWallpapers, a(W.sortedWallpapers)))
                      : W.sourceIsWorkshop &&
                        angular.forEach(n.newWallpapers, a(W.sortedWallpapers)),
                    z)
                  : Be)(),
                rt(),
                (!angular.isUndefined(t) &&
                  !angular.isUndefined(W.currentSelection)) ||
                  "installed" !== W.source ||
                  i ||
                  tt(),
                st(),
                W.hideYoutubeControls &&
                  W.currentSelection &&
                  delete W.currentSelection.youtube);
            } catch (e) {
              console.error(e);
            }
          }),
          (W.updateLocalThumbnail = function (t) {
            var e = W.wallpapers.find(function (e) {
              return e.preview === t.preview;
            });
            e && ((e.previewsmall = t.previewsmall), Be());
          }),
          (W.selectWallpaperByProjectOrId = function (e) {
            var t = (e.file && p(e.file)) || He(e.workshopid);
            !angular.isObject(t) &&
            e.workshopid &&
            L() &&
            !W.steamWorkshopStatus.complete
              ? m(function () {
                  W.selectWallpaperByProjectOrId(e);
                }, 500)
              : angular.isObject(t) &&
                (e.reload &&
                  j.callDeferred("browseWallpaperObject", "removeWallpaper", {
                    location: W.selectedMonitor.location,
                    playlist: !1,
                  }),
                l(t),
                snapshotAppliedConfig());
          }),
          (W.registerSteamUser = function (e) {
            var t = W.steamUserInfos[e.id] || {};
            ((t.name = e.name),
              (t.avatar = e.avatar),
              (W.steamUserInfos[e.id] = t),
              angular.isFunction(q) && q(e));
          }));
        var _t = {},
          yt = {};
        ((W.onTotalCountReceived = function (e) {
          (yt[e.preset] && (yt[e.preset].resolve(e.count), delete yt[e.preset]),
            (_t[e.preset] = e.count));
        }),
          (W.getNumberOfWorkshopPresets = function (e) {
            e = e.dependency || e.workshopid;
            return angular.isNumber(_t[e])
              ? _t[e]
              : (angular.isUndefined(_t[e]) &&
                  ((_t[e] = "?"),
                  j.callDeferred("browseWallpaperObject", "queryWorkshop", {
                    preset: e,
                    callback: "onTotalCountReceived",
                    totalOnly: !0,
                  })),
                "?");
          }));
        var wt = {},
          kt = {};
        ((W.onTotalCountByAuthorReceived = function (e) {
          (kt[e.authorsteamid] &&
            (kt[e.authorsteamid].resolve(e.count), delete kt[e.authorsteamid]),
            (wt[e.authorsteamid] = e.count));
        }),
          (W.callbackWallpaperAllMouse = function (e, o, t) {
            var a, i, n, r, s;
            if ((t.stopPropagation(), o && "highlightItem" === o.type))
              "left" === e && W.pushExplorePage(o);
            else
              switch (e) {
                case "left":
                  t.ctrlKey && W.canUseMultiselect()
                    ? pt(o)
                    : t.shiftKey && W.canUseMultiselect()
                      ? (ut(),
                        $(o),
                        (s = !1),
                        angular.forEach(Fe(), function (e) {
                          (s = e !== o && W.currentSelection !== e ? s : !s) &&
                            $(e);
                        }))
                      : (ut(),
                        W.callbackWallpaperSelected(o),
                        (A = angular
                          .element(t.target)
                          .closest(".browseWallpaperImage")[0]) &&
                          A.scrollIntoView &&
                          A.scrollIntoView({
                            behavior: "smooth",
                            inline: "nearest",
                            block: "nearest",
                          }));
                  break;
                case "right":
                  var l,
                    c,
                    d,
                    p,
                    u,
                    g,
                    f,
                    m,
                    v,
                    h,
                    b,
                    _,
                    y,
                    w,
                    k,
                    x,
                    S,
                    C,
                    E,
                    P,
                    M,
                    A = B.builder(),
                    T = function (e) {
                      e.button(
                        "ui_browse_context_menu_manage_blocklist",
                        "fas fa-users-slash",
                        function () {
                          F.open("browseCollections", {
                            data: {
                              type: "blocklist",
                              canCloseOnly: !0,
                              collection:
                                W.browserSettings.authorblocklistnames,
                            },
                          })
                            .catch(function () {
                              return D.when();
                            })
                            .then(function () {
                              ((W.browserSettingsExtensions.authorblocklist =
                                W.browserSettings.authorblocklistnames.map(
                                  function (e) {
                                    return e.value;
                                  },
                                )),
                                (W.sortedWallpapers =
                                  W.sortedWallpapers.slice()),
                                W.sortedWallpapers.sort(lt));
                            });
                        },
                      );
                    },
                    R =
                      (angular.isObject(o) &&
                        ((l = {
                          author:
                            o.authorsteamid &&
                            W.steamUserInfos[o.authorsteamid] &&
                            W.steamUserInfos[o.authorsteamid].name,
                          count: "?",
                        }),
                        (c = []),
                        !l.author &&
                          o.authorsteamid &&
                          (j.callDeferred(
                            "ui",
                            "pollSteamUserInfo",
                            o.authorsteamid,
                            "browseWallpapersCtrl",
                          ),
                          (q = function (e) {
                            e.id === o.authorsteamid &&
                              ((l.author = e.name),
                              angular.forEach(c, function (e) {
                                e();
                              }),
                              (q = void 0));
                          }),
                          (l.author = "?")),
                        "downloadable" !== o.status &&
                          (A.button(
                            "ui_browse_context_menu_add_to_playlist",
                            "fas fa-plus",
                            function () {
                              W.callbackToggleAllWallpapersInCurrentMonitorPlaylist(
                                o,
                                !1,
                                !0,
                              );
                            },
                          ),
                          W.selectedMonitor) &&
                          W.selectedMonitor.playlistFlags[o.file] &&
                          A.button(
                            "ui_browse_context_menu_remove_from_playlist",
                            "fas fa-minus",
                            function () {
                              W.callbackToggleAllWallpapersInCurrentMonitorPlaylist(
                                o,
                              );
                            },
                          ),
                        o.localAndExternal &&
                          A.button(
                            "ui_browse_context_menu_rename",
                            "fas fa-file-signature",
                            function () {
                              var e = {
                                title: "ui_browse_modal_rename_title",
                                message: "",
                                cancelVisible: !0,
                                okVisible: !0,
                                textinputVisible: !0,
                                textinput: o.title,
                              };
                              F.open("genericConfirm", { data: e }).then(
                                function () {
                                  ((e.textinput = e.textinput.trim()),
                                    0 < e.textinput.length &&
                                      ((o.title = e.textinput),
                                      z(),
                                      j.callDeferred(
                                        "browseWallpaperObject",
                                        "addLocalWallpaperToHistory",
                                        [{ file: o.file, name: o.title }],
                                      )));
                                },
                              );
                            },
                          ),
                        "downloadable" !== o.status &&
                          0 < W.folders.length &&
                          (1 < W.folders.length || W.folders[0] !== o) &&
                          ((P = B.builder()),
                          angular.isObject(W.currentFolder) &&
                            P.button("ui_browse_navigation_top", function () {
                              vt(o);
                            }),
                          (function t(e, a, i, n, o) {
                            angular.forEach(e.sort(gt), function (e) {
                              e !== a &&
                                (e !== W.currentFolder &&
                                  n.button(i + e.title, "", function () {
                                    o(e);
                                  }),
                                t(e.subfolders, a, i + e.title + " / ", n, o));
                            });
                          })(W.folders, o, "", P, function (e) {
                            vt(o, e);
                          }),
                          A.subMenu("ui_browse_context_menu_move_to", P)),
                        (P = "folder" !== o.type),
                        o.workshopid
                          ? ("downloadable" === o.status
                              ? A.button(
                                  "ui_browse_context_menu_subscribe",
                                  "fas fa-download",
                                  function () {
                                    var e;
                                    0 === W.multiSelection.length
                                      ? W.subscribeWorkshopItem(o)
                                      : ((e = H(!0, (e = o), "downloadable")),
                                        W.subscribeWorkshopItem(e));
                                  },
                                )
                              : A.button(
                                  "ui_browse_context_menu_unsubscribe",
                                  "fas fa-times",
                                  function () {
                                    0 === W.multiSelection.length
                                      ? Ye(o, !0)
                                      : ht(o);
                                  },
                                ),
                            (d = H(!0, o, "any")),
                            (p = (d = d.filter(function (e) {
                              return e.workshopid;
                            })).map(function (e) {
                              return e.workshopid;
                            })),
                            o.favorite
                              ? A.button(
                                  "ui_browse_context_menu_remove_favorite",
                                  "far fa-heart",
                                  function () {
                                    (j.callDeferred(
                                      "ui",
                                      "setFavorited",
                                      p,
                                      !1,
                                    ),
                                      angular.forEach(d, function (e) {
                                        e.favorite = !1;
                                      }),
                                      (W.sortedWallpapers =
                                        W.sortedWallpapers.slice()));
                                  },
                                )
                              : A.button(
                                  "ui_browse_context_menu_add_favorite",
                                  "fas fa-heart",
                                  function () {
                                    (j.callDeferred(
                                      "ui",
                                      "setFavorited",
                                      p,
                                      !0,
                                    ),
                                      angular.forEach(d, function (e) {
                                        e.favorite = !0;
                                      }),
                                      (W.sortedWallpapers =
                                        W.sortedWallpapers.slice()));
                                  },
                                ),
                            W.browserRuntime &&
                              Q.includes(W.browserRuntime.usersteamid) &&
                              V.canUseAdminMenu() &&
                              ((u = B.builder()),
                              (g = B.builder()),
                              (f = B.builder()),
                              (m = function () {
                                W.sourceIsExplore
                                  ? angular.forEach(
                                      W.sortedExploreQueries,
                                      function (e) {
                                        e.wallpapers &&
                                          (e.wallpapers = e.wallpapers.slice());
                                      },
                                    )
                                  : (W.sortedWallpapers =
                                      W.sortedWallpapers.slice());
                              }),
                              (v = function (t) {
                                var e = H(!0, o),
                                  a = e.map(function (e) {
                                    return e.workshopid;
                                  });
                                j.sendRequestWithSteamAuth(
                                  W.steamAuth,
                                  j.wpxAPIBackendUrl + "/api/updateApproval",
                                  { ids: a, approve: t },
                                )
                                  .then(function () {
                                    (angular.forEach(e, function (e) {
                                      angular.isString(e.tags) &&
                                        (t
                                          ? ((e.tags = e.tags.split(",")),
                                            e.tags.push("Approved"))
                                          : ((e.tags = e.tags.split(",")),
                                            e.tags.findAndRemove("Approved")),
                                        (e.tags = e.tags.join(",")));
                                    }),
                                      bt(e),
                                      m());
                                  })
                                  .catch(function (e) {
                                    console.error(
                                      "updating approval failed with",
                                      angular.toJson(e),
                                    );
                                  });
                              }),
                              u.button("Approve", "fas fa-trophy", function () {
                                v(!0);
                              }),
                              u.button(
                                "Approve & Like",
                                "fas fa-trophy",
                                function () {
                                  (v(!0),
                                    H(!0, o).map(function (e) {
                                      W.setUserVote(e.workshopid, "up");
                                    }));
                                },
                              ),
                              u.button(
                                "Unapprove",
                                "fas fa-times",
                                function () {
                                  v(!1);
                                },
                              ),
                              u.divider(),
                              (h = function (t) {
                                (W.lastAdminGenre.findAndRemove(t),
                                  W.lastAdminGenre.splice(0, 0, t));
                                var a = W.filterAllTags
                                    .map(function (e) {
                                      return e.value;
                                    })
                                    .findAndRemove(t),
                                  e = H(!0, o, "any"),
                                  i = e.map(function (e) {
                                    return e.workshopid;
                                  });
                                j.sendRequestWithSteamAuth(
                                  W.steamAuth,
                                  j.wpxAPIBackendUrl + "/api/updateGenre",
                                  { ids: i, genre: t },
                                )
                                  .then(function () {
                                    (angular.forEach(e, function (e) {
                                      angular.isString(e.tags) &&
                                        ((e.tags = e.tags.split(",")),
                                        e.tags.findAndRemoveMultiple(a).push(t),
                                        (e.tags = e.tags.join(",")));
                                    }),
                                      bt(e),
                                      m());
                                  })
                                  .catch(function (e) {
                                    console.error(
                                      "updating genre failed with",
                                      angular.toJson(e),
                                    );
                                  });
                              }),
                              angular.isArray(W.lastAdminGenre) ||
                                (W.lastAdminGenre = [
                                  "Anime",
                                  "Girls",
                                  "Unspecified",
                                ]),
                              W.lastAdminGenre.forEach((e) => {
                                u.button("Change Genre to " + e, function () {
                                  h(e);
                                });
                              }),
                              angular.forEach(W.filterAllTags, function (e) {
                                g.button(e.value, function () {
                                  h(e.value);
                                });
                              }),
                              angular.forEach(
                                V.getWallpaperRatingTags(),
                                function (n) {
                                  f.button(n.value, function () {
                                    var t, a, e, i;
                                    ((t = n.value),
                                      (a = V.getWallpaperRatingTags()
                                        .map(function (e) {
                                          return e.value;
                                        })
                                        .findAndRemove(t)),
                                      (e = H(!0, o, "any")),
                                      (i = e.map(function (e) {
                                        return e.workshopid;
                                      })),
                                      j
                                        .sendRequestWithSteamAuth(
                                          W.steamAuth,
                                          j.wpxAPIBackendUrl +
                                            "/api/updateRating",
                                          { ids: i, rating: t },
                                        )
                                        .then(function () {
                                          (angular.forEach(e, function (e) {
                                            angular.isString(e.tags) &&
                                              ((e.tags = e.tags.split(",")),
                                              e.tags
                                                .findAndRemoveMultiple(a)
                                                .push(t),
                                              (e.tags = e.tags.join(",")));
                                          }),
                                            bt(e),
                                            m());
                                        })
                                        .catch(function (e) {
                                          console.error(
                                            "updating rating failed with",
                                            angular.toJson(e),
                                          );
                                        }));
                                  });
                                },
                              ),
                              u.subMenu("Change Genre", g),
                              u.subMenu("Change Rating", f),
                              A.subMenu("Admin", u)),
                            (b = B.builder()),
                            V.useDynamicWorkshopAuthor() &&
                              ((_ = function () {
                                return O.instant(
                                  "ui_browse_context_menu_browse_by_author",
                                  l,
                                );
                              }),
                              c.push(function () {
                                b.updateLabel("authorbrowse", _());
                              }),
                              b
                                .button(_(), "fas fa-user", function () {
                                  W.callbackBrowseAuthor(o.authorsteamid);
                                })
                                .id("authorbrowse"),
                              (n = o),
                              (angular.isNumber(wt[n.authorsteamid])
                                ? D.when(wt[n.authorsteamid])
                                : (j.callDeferred(
                                    "browseWallpaperObject",
                                    "queryWorkshop",
                                    {
                                      itemid: n.authorsteamid,
                                      sort: "published_desc",
                                      callback: "onTotalCountByAuthorReceived",
                                      totalOnly: !0,
                                    },
                                  ),
                                  (r = D.defer()),
                                  (kt[n.authorsteamid] = r).promise)
                              ).then(function (e) {
                                ((l.count = e),
                                  b.updateLabel("authorbrowse", _()));
                              })),
                            ("Web" !== o.type && "Scene" !== o.type) ||
                              ((y = o.ispreset
                                ? He(o.dependency) || {
                                    title: o.dependency,
                                    workshopid: o.dependency,
                                  }
                                : o),
                              b
                                .button(
                                  O.instant(
                                    "ui_browse_details_properties_preset_browse_workshop",
                                    { count: "?" },
                                  ),
                                  V.getProviderIcon(),
                                  function () {
                                    W.callbackBrowsePresets(y);
                                  },
                                )
                                .id("presetbrowse"),
                              (n = y),
                              (angular.isNumber(_t[n.workshopid])
                                ? D.when(_t[n.workshopid])
                                : (j.callDeferred(
                                    "browseWallpaperObject",
                                    "queryWorkshop",
                                    {
                                      preset: n.workshopid,
                                      callback: "onTotalCountReceived",
                                      totalOnly: !0,
                                    },
                                  ),
                                  (r = D.defer()),
                                  (yt[n.workshopid] = r).promise)
                              )
                                .then(function (e) {
                                  return O(
                                    "ui_browse_details_properties_preset_browse_workshop",
                                    { count: e },
                                  );
                                })
                                .then(function (e) {
                                  b.updateLabel("presetbrowse", e);
                                })),
                            (E =
                              W.sourceIsWorkshop &&
                              "folder" !== o.type &&
                              o.authorsteamid),
                            (I = W.canSendReports && !W.isUsingBackup),
                            (M = E || I),
                            (!W.canOpenWallpaperDetailsOnPlatform &&
                              b.empty() &&
                              !M) ||
                              A.empty() ||
                              A.divider(),
                            W.canOpenWallpaperDetailsOnPlatform &&
                              A.button(
                                "ui_browse_context_menu_workshop",
                                V.getProviderIcon(),
                                function () {
                                  W.openSteamWorkshopPage(o);
                                },
                              ),
                            b.empty() ||
                              A.subMenu(
                                "ui_browse_context_menu_related_wallpapers",
                                b,
                              ),
                            (I || E || P) &&
                              ((w = B.builder()),
                              I &&
                                w.button(
                                  "ui_browse_context_menu_report",
                                  "fas fa-exclamation-triangle",
                                  function () {
                                    L()
                                      ? W.openReportDialog(o)
                                      : V.showSteamError();
                                  },
                                  void 0,
                                  "browserReportButton",
                                ),
                              E &&
                                ((k = function () {
                                  return O.instant(
                                    "ui_browse_context_menu_block_author",
                                    l,
                                  );
                                }),
                                (x = function () {
                                  return O.instant(
                                    "ui_browse_context_menu_unblock_author",
                                    l,
                                  );
                                }),
                                c.push(function () {
                                  (w.updateLabel("authoraddblacklist", k()),
                                    w.updateLabel(
                                      "authorremoveblacklist",
                                      x(),
                                    ));
                                }),
                                W.browserSettingsExtensions.authorblocklist.includes(
                                  o.authorsteamid,
                                )
                                  ? w
                                      .button(
                                        x(),
                                        "fas fa-user-check",
                                        function () {
                                          (W.browserSettingsExtensions.authorblocklist.findAndRemove(
                                            o.authorsteamid,
                                          ),
                                            W.browserSettings.authorblocklistnames.findAndRemove(
                                              function (e) {
                                                return (
                                                  e.value === o.authorsteamid
                                                );
                                              },
                                            ),
                                            (W.sortedWallpapers =
                                              W.sortedWallpapers.slice()),
                                            W.sortedWallpapers.sort(lt));
                                        },
                                      )
                                      .id("authorremoveblacklist")
                                  : w
                                      .button(
                                        k(),
                                        "fas fa-user-slash",
                                        function () {
                                          (W.browserSettingsExtensions.authorblocklist.push(
                                            o.authorsteamid,
                                          ),
                                            W.browserSettings.authorblocklistnames.push(
                                              {
                                                name:
                                                  l.author && "?" !== l.author
                                                    ? l.author
                                                    : o.authorsteamid,
                                                value: o.authorsteamid,
                                              },
                                            ),
                                            (W.sortedWallpapers =
                                              W.sortedWallpapers.slice()),
                                            W.sortedWallpapers.sort(lt));
                                        },
                                        void 0,
                                        "browserReportButton",
                                      )
                                      .id("authoraddblacklist")),
                              P && T(w),
                              A.subMenu(
                                "ui_browse_context_menu_report_and_block",
                                void 0,
                                w,
                                "browserReportButton",
                              )))
                          : (o.localAndExternal || o.official) &&
                            A.button(
                              "ui_browse_context_menu_remove",
                              "fas fa-times",
                              function () {
                                0 === W.multiSelection.length
                                  ? Ye(o, !0)
                                  : ht(o);
                              },
                            ),
                        "folder" !== o.type) &&
                        (W.sourceIsInstalled ||
                          o.workshopid ||
                          "installed" === o.status) &&
                        (A.divider(),
                        (!W.sourceIsInstalled && "installed" !== o.status) ||
                          ((a = o),
                          angular.forEach(
                            W.sharedSettings && W.sharedSettings.hotkeys,
                            function (e) {
                              e.value === a.file &&
                                e.location === W.selectedMonitor.location &&
                                "wallpaper" === e.action &&
                                (i = e);
                            },
                          ),
                          (S = i)
                            ? A.button(
                                "ui_browse_context_menu_remove_hotkey",
                                "fas fa-times",
                                function () {
                                  W.sharedSettings.hotkeys.findAndRemove(S);
                                },
                              )
                            : A.button(
                                "ui_browse_context_menu_assign_hotkey",
                                "far fa-keyboard",
                                function () {
                                  F.open("browseAssignHotkey", {
                                    data: {
                                      hotkeys: W.sharedSettings.hotkeys,
                                      name: o.title,
                                    },
                                  }).then(function (e) {
                                    W.sharedSettings.hotkeys.push({
                                      action: "wallpaper",
                                      keys: e,
                                      location: W.selectedMonitor.location,
                                      value: o.file,
                                      title: o.title,
                                    });
                                  });
                                },
                              )),
                        "installed" === o.status) &&
                        "URL" !== o.type &&
                        (A.button(
                          "ui_editor_filemenu_open_in_explorer",
                          "fas fa-folder-open",
                          function () {
                            j.callDeferred(
                              "browseWallpaperObject",
                              "openInExplorer",
                              o.project || o.file,
                            );
                          },
                        ),
                        (M = B.builder())
                          .button(
                            "ui_browse_context_menu_fullhd_preview",
                            "fas fa-computer",
                            function () {
                              W.promptWallpaperDependencySubscription(o).then(
                                function (e) {
                                  "pending" !== e &&
                                    "downloading" !== e &&
                                    j.callDeferred(
                                      "browseWallpaperObject",
                                      "playInWindow",
                                      {
                                        file: o.file,
                                        location: "Wallpaper Pop-out",
                                        propertylocation:
                                          W.selectedMonitor.location,
                                      },
                                    );
                                },
                              );
                            },
                          )
                          .button(
                            "ui_browse_context_menu_phone_preview",
                            "fas fa-mobile",
                            function () {
                              W.promptWallpaperDependencySubscription(o).then(
                                function (e) {
                                  "pending" !== e &&
                                    "downloading" !== e &&
                                    j.callDeferred(
                                      "browseWallpaperObject",
                                      "playInWindow",
                                      {
                                        file: o.file,
                                        location: "Wallpaper Pop-out",
                                        width: 607,
                                        height: 1080,
                                        propertylocation:
                                          W.selectedMonitor.location,
                                      },
                                    );
                                },
                              );
                            },
                          )
                          .divider()
                          .button(
                            "ui_browse_context_menu_maximized_preview",
                            "fas fa-window-maximize",
                            function () {
                              W.promptWallpaperDependencySubscription(o).then(
                                function (e) {
                                  "pending" !== e &&
                                    "downloading" !== e &&
                                    j.callDeferred(
                                      "browseWallpaperObject",
                                      "playInWindow",
                                      {
                                        file: o.file,
                                        location: "Wallpaper Pop-out",
                                        maximized: !0,
                                        propertylocation:
                                          W.selectedMonitor.location,
                                      },
                                    );
                                },
                              );
                            },
                          ),
                        A.subMenu("ui_browse_context_menu_play_in_window", M)),
                      H(!0, o)),
                    I =
                      (W.isMobileTranscoderAvailable() &&
                        o &&
                        ("installed" === o.status || "folder" === o.type) &&
                        W.canUploadWallpaperToMobileDevice(R, !0) &&
                        (A.requestDivider(),
                        (R = W.filterWallpapersForMobileDevice(R)),
                        (C = B.builder()),
                        R.empty()
                          ? C.button(
                              "ui_browse_context_menu_mobile_type_not_supported",
                              "fas fa-times",
                              void 0,
                              void 0,
                              "ctxBtnDisabled",
                            )
                          : (angular.forEach(
                              W.mobileManagerState.connectedDevices,
                              function (e) {
                                C.button(
                                  O.instant("ui_browse_context_menu_send_to", {
                                    name: e.name,
                                  }),
                                  "far fa-mobile-android",
                                  function () {
                                    W.sendToMobileDevice(R, e);
                                  },
                                );
                              },
                            ),
                            C.empty() || C.divider(),
                            C.button(
                              "ui_browse_context_menu_export_pkg",
                              "fas fa-file-download",
                              function () {
                                Oe(R)
                                  .then(De)
                                  .then(function (e) {
                                    0 < e.length &&
                                      F.open("browseMobileUpload", {
                                        data: {
                                          device: { name: "export" },
                                          location:
                                            W.selectedMonitor &&
                                            W.selectedMonitor.location,
                                          isExporting: !0,
                                          wallpapers: e,
                                        },
                                      });
                                  });
                              },
                            ),
                            C.button(
                              "ui_browse_context_menu_connect_new_device",
                              "fas fa-wifi",
                              function () {
                                W.mobileDeviceManagementActive = !0;
                              },
                            )),
                        A.subMenu("ui_browse_context_menu_send_to_device", C)),
                      A.requestDivider(),
                      W.sourceIsInstalled &&
                        (A.button(
                          "ui_browse_context_menu_create_folder",
                          "fas fa-folder-plus",
                          function () {
                            var a = {
                              title: "ui_browse_modal_folder_create_title",
                              cancelVisible: !0,
                              okVisible: !0,
                              textinputVisible: !0,
                            };
                            O("ui_browse_context_menu_new_folder_name")
                              .then(function (e) {
                                return (
                                  (a.textinput = a.textinputDefault = e),
                                  F.open("genericConfirm", { data: a })
                                );
                              })
                              .then(function () {
                                var e =
                                    (W.currentFolder &&
                                      W.currentFolder.subfolders) ||
                                    W.folders,
                                  t = {
                                    type: "folder",
                                    title: (0 === a.textinput.length
                                      ? a.textinputDefault
                                      : a.textinput
                                    ).toString(),
                                    subfolders: [],
                                    items: {},
                                  };
                                (e.push(t), z(), tt(t));
                              });
                          },
                        ),
                        o) &&
                        "folder" === o.type &&
                        (A.button(
                          "ui_browse_context_menu_remove_folder",
                          "fas fa-times",
                          function () {
                            var t = {
                              message: "ui_browse_modal_folder_remove_body",
                              checkboxTitle:
                                "ui_browse_modal_folder_remove_unsubscribe_and_remove_items",
                              checkboxVisible: !0,
                              okVisible: !0,
                              cancelVisible: !0,
                            };
                            O("ui_browse_modal_folder_remove_title", {
                              title: o.title,
                            })
                              .then(function (e) {
                                return (
                                  (t.title = e),
                                  F.open("genericConfirm", { data: t })
                                );
                              })
                              .then(function () {
                                (t.checkboxChecked && Ye(et([o])), ft(o));
                              });
                          },
                        ),
                        (I = function (e) {
                          e
                            ? angular.isObject(e)
                              ? ((o.folderIconOpen = e.open),
                                (o.folderIcon = e.close))
                              : (delete o.folderIconOpen, (o.folderIcon = e))
                            : (delete o.folderIconOpen, delete o.folderIcon);
                        }),
                        (E = B.builder()).grid(5),
                        E.gridItem(
                          "",
                          "fas fa-folder browseFolderIconEnlarge",
                          I,
                        ),
                        E.gridItem(
                          "",
                          "fas fa-star browseFolderIconEnlarge",
                          I,
                          "fas fa-star",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-heart browseFolderIconEnlarge",
                          I,
                          "fas fa-heart",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-gem browseFolderIconEnlarge",
                          I,
                          "fas fa-gem",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-car browseFolderIconEnlarge",
                          I,
                          { close: "fas fa-car", open: "fas fa-car-burst" },
                        ),
                        E.gridItem(
                          "",
                          "fas fa-rocket browseFolderIconEnlarge",
                          I,
                          {
                            close: "fas fa-rocket",
                            open: "fas fa-rocket-launch",
                          },
                        ),
                        E.gridItem(
                          "",
                          "far fa-snowflake browseFolderIconEnlarge",
                          I,
                          "fas fa-snowflake",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-thumbs-up browseFolderIconEnlarge",
                          I,
                          "fas fa-thumbs-up",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-gamepad-modern browseFolderIconEnlarge",
                          I,
                          "fas fa-gamepad-modern",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-gift browseFolderIconEnlarge",
                          I,
                          "fas fa-gift",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-music browseFolderIconEnlarge",
                          I,
                          "fas fa-music",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-trash browseFolderIconEnlarge",
                          I,
                          "fas fa-trash",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-bug browseFolderIconEnlarge",
                          I,
                          "fas fa-bug",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-magic browseFolderIconEnlarge",
                          I,
                          {
                            close: "fas fa-magic",
                            open: "fas fa-wand-magic-sparkles",
                          },
                        ),
                        E.gridItem(
                          "",
                          "fas fa-banana browseFolderIconEnlarge",
                          I,
                          "fas fa-banana",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-alien browseFolderIconEnlarge",
                          I,
                          "fas fa-alien",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-alien-8bit browseFolderIconEnlarge",
                          I,
                          "fas fa-alien-8bit",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-bat browseFolderIconEnlarge",
                          I,
                          "fas fa-bat",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-bomb browseFolderIconEnlarge",
                          I,
                          { close: "fas fa-bomb", open: "fas fa-explosion" },
                        ),
                        E.gridItem(
                          "",
                          "fas fa-boombox browseFolderIconEnlarge",
                          I,
                          "fas fa-boombox",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-candle-holder browseFolderIconEnlarge",
                          I,
                          "fas fa-candle-holder",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-dragon browseFolderIconEnlarge",
                          I,
                          "fas fa-dragon",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-fire browseFolderIconEnlarge",
                          I,
                          "fas fa-fire",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-meteor browseFolderIconEnlarge",
                          I,
                          "fas fa-meteor",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-tree-palm browseFolderIconEnlarge",
                          I,
                          "fas fa-tree-palm",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-skull-crossbones browseFolderIconEnlarge",
                          I,
                          "fas fa-skull-crossbones",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-tree-christmas browseFolderIconEnlarge",
                          I,
                          "fas fa-tree-christmas",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-tv-retro browseFolderIconEnlarge",
                          I,
                          "fas fa-tv-retro",
                        ),
                        E.gridItem(
                          "",
                          "fas fa-balloons browseFolderIconEnlarge",
                          I,
                          { close: "fas fa-balloons", open: "far fa-burst" },
                        ),
                        E.gridItem(
                          "",
                          "fas fa-bone browseFolderIconEnlarge",
                          I,
                          "fas fa-bone",
                        ),
                        A.subMenu("ui_browse_context_menu_change_icon", E),
                        (P = B.builder()).button(
                          "ui_browse_context_menu_default",
                          "",
                          (M = function (e) {
                            e ? (o.folderColor = e) : delete o.folderColor;
                          }),
                          {},
                          "ctxMenuNoIcon",
                        ),
                        P.grid(5),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorBrightBlue",
                          M,
                          "browseFolderColorBrightBlue",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorBlue",
                          M,
                          "browseFolderColorBlue",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorPurple",
                          M,
                          "browseFolderColorPurple",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorMagenta",
                          M,
                          "browseFolderColorMagenta",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorRed",
                          M,
                          "browseFolderColorRed",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorYellow",
                          M,
                          "browseFolderColorYellow",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorBrightYellow",
                          M,
                          "browseFolderColorBrightYellow",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorGreen",
                          M,
                          "browseFolderColorGreen",
                        ),
                        P.gridItem(
                          "",
                          "fas fa-square browseFolderColorDarkGreen",
                          M,
                          "browseFolderColorDarkGreen",
                        ),
                        A.subMenu("ui_browse_context_menu_change_color", P),
                        A.divider()),
                      o || T(A),
                      B.builder()
                        .button(
                          "ui_browse_context_menu_icon_small",
                          "small" === W.browserSettings.viewiconsize
                            ? "fas fa-check"
                            : "",
                          function () {
                            W.browserSettings.viewiconsize = "small";
                          },
                        )
                        .button(
                          "ui_browse_context_menu_icon_medium",
                          "medium" === W.browserSettings.viewiconsize
                            ? "fas fa-check"
                            : "",
                          function () {
                            W.browserSettings.viewiconsize = "medium";
                          },
                        )
                        .button(
                          "ui_browse_context_menu_icon_large",
                          "large" === W.browserSettings.viewiconsize
                            ? "fas fa-check"
                            : "",
                          function () {
                            W.browserSettings.viewiconsize = "large";
                          },
                        ));
                  (W.sourceIsInstalled &&
                    I.divider()
                      .button(
                        "ui_browse_context_menu_results_per_page_50",
                        50 === W.browserSettings.resultsperpage
                          ? "fas fa-check"
                          : "",
                        function () {
                          ((W.browserSettings.resultsperpage = 50), z());
                        },
                      )
                      .button(
                        "ui_browse_context_menu_results_per_page_100",
                        100 === W.browserSettings.resultsperpage
                          ? "fas fa-check"
                          : "",
                        function () {
                          ((W.browserSettings.resultsperpage = 100), z());
                        },
                      )
                      .button(
                        "ui_browse_context_menu_results_per_page_200",
                        200 === W.browserSettings.resultsperpage
                          ? "fas fa-check"
                          : "",
                        function () {
                          ((W.browserSettings.resultsperpage = 200), z());
                        },
                      ),
                    A.subMenu("ui_browse_context_menu_view", I).open(W, t));
                  break;
                case "dbl":
                  o && "folder" === o.type || W.callbackOk(!0);
                  break;
              }
          }),
          (W.callbackWallpaperSelectionRectangle = function (e, t) {
            (t.ctrlKey
              ? pt
              : (t.shiftKey || ((W.currentSelection = void 0), ut()), $))(e);
          }));
        var xt = 0;
        W.callbackWallpaperSelected = function (e) {
          var t, a;
          if (e && !e.type) e.type = "Scene";
          "folder" === e.type
            ? W.navigateFolder(e)
            : W.currentSelection !== e &&
              0 === xt &&
              (angular.isObject(W.currentSelection) &&
                angular.isObject(e) &&
                (W.currentSelection.title !== e.title ||
                  W.currentSelection.workshopid !== e.workshopid) &&
                (W.preview.play = !1),
              (t = D.when()),
              "application" !== (e.type || "scene").toLowerCase() ||
                "installed" !== e.status ||
                !angular.isDefined(e.workshopid) ||
                0 <= N.indexOf((a = e).authorsteamid) ||
                0 <= (a.tags || "").indexOf("Approved") ||
                e.local ||
                ((xt = e.workshopid), (t = Xe(e.file, e))),
              "downloadable" !== e.status &&
                (t = t.then(function () {
                  return W.promptWallpaperWindowsCompatibility(e);
                })),
              (t =
                "installed" === e.status
                  ? t.then(function () {
                      return W.promptWallpaperDependencySubscription(e);
                    })
                  : t)
                .then(function () {
                  (W.currentSelection = e);
                  if (!W.sourceIsWorkshop && ("installed" === e.status || e.local)) l(e);
                  if (e && e.authorsteamid && (e.author || e.author_avatar)) {
                    var u = W.steamUserInfos[e.authorsteamid] || {};
                    if (e.author) u.name = e.author;
                    if (e.author_avatar) u.avatar = e.author_avatar;
                    W.steamUserInfos[e.authorsteamid] = u;
                  }
                  var wid = (W.getWallpaperWorkshopId ? W.getWallpaperWorkshopId(e) : (e.workshopid || e.id));
                  if (wid && window.WengineHelper) {
                    var safeKeys = [
                      "author", "authorsteamid", "author_url", "author_avatar",
                      "file_size", "filesizelabel", "rating", "ratingrounded",
                      "hasrating", "rating_star_file", "num_ratings",
                      "posted_date", "updated_date", "installed_ts", "tags"
                    ];
                    var isInstalledMode = W.sourceIsInstalled || !W.sourceIsWorkshop;
                    var curMeta = W.getMetaForWallpaper ? W.getMetaForWallpaper(e) : null;
                    if (curMeta) {
                      if (W.sourceIsWorkshop) {
                        angular.extend(e, curMeta);
                      } else {
                        for (var sk = 0; sk < safeKeys.length; sk++) {
                          var k = safeKeys[sk];
                          if (curMeta[k] !== undefined && curMeta[k] !== null && curMeta[k] !== "") {
                            e[k] = curMeta[k];
                            if (W.currentSelection) W.currentSelection[k] = curMeta[k];
                          }
                        }
                      }
                      if (curMeta.authorsteamid && (curMeta.author || curMeta.author_avatar)) {
                        var u = W.steamUserInfos[curMeta.authorsteamid] || {};
                        if (curMeta.author) u.name = curMeta.author;
                        if (curMeta.author_avatar) u.avatar = curMeta.author_avatar;
                        W.steamUserInfos[curMeta.authorsteamid] = u;
                      }
                    }

                    // In Installed mode, if metadata is already present in the file, NEVER call network!
                    // Only fetch from Steam if we are in Workshop mode OR if installed wallpaper has NO metadata on disk yet.
                    if (!isInstalledMode || !curMeta) {
                      window.WengineHelper.getItemDetails(wid).then(function (det) {
                        if (det && (W.currentSelection === e || (W.currentSelection && (W.currentSelection.workshopid === wid || (W.getWallpaperWorkshopId && W.getWallpaperWorkshopId(W.currentSelection) === wid))))) {
                          m(function () {
                            if (!det.authorsteamid && e.authorsteamid) det.authorsteamid = e.authorsteamid;
                            if (!det.author_url && e.author_url) det.author_url = e.author_url;
                            if (!det.author_avatar && e.author_avatar) det.author_avatar = det.author_avatar;

                            // When loaded for an installed item missing metadata, save it so it's in the file for next time!
                            if (isInstalledMode) {
                              if (!W.installedMetadata) W.installedMetadata = {};
                              W.installedMetadata[String(wid)] = det;
                              if (window.WengineHelper.saveMetadata) {
                                window.WengineHelper.saveMetadata(wid, det);
                              }
                            } else if (W.installedMetadata && W.installedMetadata[String(wid)]) {
                              angular.extend(W.installedMetadata[String(wid)], det);
                            }

                            if (W.sourceIsWorkshop) {
                              angular.extend(e, det);
                              if (W.currentSelection && (W.currentSelection === e || W.currentSelection.workshopid === wid)) {
                                angular.extend(W.currentSelection, det);
                              }
                            } else {
                              for (var sk = 0; sk < safeKeys.length; sk++) {
                                var k = safeKeys[sk];
                                if (det[k] !== undefined && det[k] !== null && det[k] !== "") {
                                  e[k] = det[k];
                                  if (W.currentSelection && (W.currentSelection === e || (W.getWallpaperWorkshopId && W.getWallpaperWorkshopId(W.currentSelection) === wid) || W.currentSelection.workshopid === wid)) {
                                    W.currentSelection[k] = det[k];
                                  }
                                }
                              }
                            }
                            if (det.authorsteamid && (det.author || det.author_avatar)) {
                              var u = W.steamUserInfos[det.authorsteamid] || {};
                              if (det.author) u.name = det.author;
                              if (det.author_avatar) u.avatar = det.author_avatar;
                              W.steamUserInfos[det.authorsteamid] = u;
                            }
                          });
                        }
                      });
                    }
                  }
                })
                .catch(function () {
                  ((fe = !0),
                    m(function () {
                      fe = !1;
                    }, 1500));
                })
                .finally(function () {
                  xt = 0;
                }));
        };
        var St = [],
          a = [],
          Ct = !(W.callbackRemoveWallpaperAndPlaylistFromMonitor = function (
            e,
          ) {
            Qe(e);
            snapshotAppliedConfig();
          });
        function Et() {
          return W.sourceIsInstalled
            ? {
                source: "installed",
                next: W.currentFolder,
                page: W.pagination.current,
              }
            : W.sourceIsExplore
              ? {
                  source: "explore",
                  stack: W.exploreNavigation.slice(),
                  page: W.pagination.current,
                }
              : W.sourceIsWorkshop
                ? { source: "workshop", page: W.pagination.current }
                : void 0;
        }
        function Pt(e, t) {
          var a;
          return (
            !t ||
            ((a = !1),
            angular.forEach(e, function (e) {
              ((a = a || e === t),
                e.subfolders && (a = a || Pt(e.subfolders, t)));
            }),
            a)
          );
        }
        function Mt(e) {
          W.exploreNavigation.length = e.stack.length;
          for (var t = 0; t < e.stack.length; ++t)
            W.exploreNavigation[t] = e.stack[t];
          (W.navigateCurrentExplorePage(),
            1 < W.exploreNavigation.length && W.callbackChangePage(e.page));
        }
        function At(t) {
          var a;
          return t && t.isGroup
            ? t
            : (t &&
                t.isInGroup &&
                W.monitorGroups &&
                angular.forEach(W.monitorGroups, function (e) {
                  0 <= e.monitors.indexOf(t.location) && (a = e);
                }),
              a);
        }
        function x() {
          function u(e, t) {
            e && e[t.location] && e[t.location].flip
              ? (t.isFlipped = !0)
              : (t.isFlipped = !1);
          }
          var g,
            t,
            e = W.monitorProfile.splits || {},
            a = W.monitorProfile.groups || {},
            i = angular.copy(e),
            f = {};
          ((W.monitorGroups = {}),
            (W.monitorSplits = {}),
            angular.forEach(W.monitors, function (e) {
              ((e.isInGroup = !1),
                (e.isClone = !1),
                delete e.group,
                delete e.isCloneMaster);
            }));
          (0 === W.wallpaperConfig.layout
            ? (angular.forEach(e, function (e, t) {
                angular.isObject(e) &&
                  ((e = _(t)),
                  !angular.isObject(e) ||
                    e.isInGroup ||
                    e.isGroup ||
                    (function e(t, a, i, n, o) {
                      ((o = o || {
                        splitIndex: 1,
                        rootLocation: i,
                        deviceName: n.name + " Split ",
                      }),
                        (a.left = a.left || {}),
                        (a.right = a.right || {}),
                        (a.left.index = n.index),
                        (a.right.index = n.index),
                        (a.location = i),
                        (a.left.location = i + "/L"),
                        (a.right.location = i + "/R"),
                        (a.left.rootLocation = o.rootLocation),
                        (a.right.rootLocation = o.rootLocation),
                        (a.left.isSplit = !0),
                        (a.right.isSplit = !0),
                        (a.w = n.w),
                        (a.h = n.h),
                        k(a.left),
                        k(a.right),
                        0 === a.direction
                          ? ((a.left.h = n.h),
                            (a.right.h = n.h),
                            (a.left.w = a.position * n.w),
                            (a.right.w = n.w - a.position * n.w),
                            (a.left.x = n.x),
                            (a.right.x = n.x + a.position * n.w),
                            (a.left.y = n.y),
                            (a.right.y = n.y))
                          : ((a.left.w = n.w),
                            (a.right.w = n.w),
                            (a.left.h = a.position * n.h),
                            (a.right.h = n.h - a.position * n.h),
                            (a.left.x = n.x),
                            (a.right.x = n.x),
                            (a.left.y = n.y),
                            (a.right.y = n.y + a.position * n.h)),
                        angular.isObject(t[a.left.location])
                          ? e(t, t[a.left.location], a.left.location, a.left, o)
                          : ((a.left.splitIndex = o.splitIndex++),
                            (a.left.name = o.deviceName + a.left.splitIndex)),
                        angular.isObject(t[a.right.location])
                          ? e(
                              t,
                              t[a.right.location],
                              a.right.location,
                              a.right,
                              o,
                            )
                          : ((a.right.splitIndex = o.splitIndex++),
                            (a.right.name =
                              o.deviceName + a.right.splitIndex)));
                    })(i, i[t], t, e));
              }),
              (W.monitorSplits = i),
              (g = 0),
              angular.forEach(a, function (t, e) {
                var a, i, n, o, r, s, l, c, d, p;
                angular.isObject(t) &&
                  ((a = {}),
                  (i = t.monitors),
                  (n = e),
                  (o = a),
                  (c = l = -(s = r = 99999)),
                  (d = []),
                  (p = []),
                  angular.forEach(i, function (e) {
                    e = _(e);
                    angular.isObject(e) &&
                      ((r = Math.min(e.x, r)),
                      (s = Math.min(e.y, s)),
                      (l = Math.max(e.x + e.w, l)),
                      (c = Math.max(e.y + e.h, c)),
                      d.push(e.name),
                      p.push(e.location));
                  }),
                  !d.empty()) &&
                  ((o.x = r),
                  (o.y = s),
                  (o.w = l - r),
                  (o.h = c - s),
                  (o.location = n),
                  (o.monitors = p),
                  (o.name = "Group (" + d.join(", ") + ")"),
                  (o.isGroup = !0),
                  k(o),
                  1) &&
                  ((a.index = g++),
                  (a.layout = t.layout),
                  (a.source = t.source),
                  (a.monitorconfig = t.monitorconfig),
                  (f[e] = a),
                  angular.forEach(t.monitors, function (e) {
                    e = _(e);
                    angular.isObject(e) &&
                      ((e.isInGroup = !0),
                      (e.isClone = 2 === t.layout),
                      (e.group = a),
                      e.isClone &&
                        e.location === a.source &&
                        (e.isCloneMaster = !0),
                      u(a.monitorconfig, e));
                  }));
              }))
            : 2 === W.wallpaperConfig.layout &&
              ((t = W.monitors.find(function (e) {
                return 0 === e.index;
              })),
              angular.forEach(W.monitors, function (e) {
                ((e.isClone = 0 !== e.index),
                  (e.group = e.isClone ? t : void 0),
                  e.location === W.monitorProfile.source &&
                    (e.isCloneMaster = !0),
                  u(W.monitorProfile.monitorconfig, e));
              })),
            (W.monitorGroups = f),
            Ze());
        }
        function Tt(a) {
          angular.forEach(
            angular.copy(W.monitorProfile.splits),
            function (e, t) {
              t.startsWith(a) &&
                t.substr(a.length).match(/^[\/LR]*$/) &&
                (Qe(t + "/L"), Qe(t + "/R"), delete W.monitorProfile.splits[t]);
            },
          );
        }
        function Rt(e, t) {
          var a,
            i = W.monitorProfile.splits[e],
            e = W.monitorProfile.splits[e + "/R"];
          return (
            angular.isObject(e) &&
              e.direction === i.direction &&
              ((a = i.position + (1 - i.position) * e.position),
              (e.position = (a -= t) / (1 - t))),
            angular.isObject(i) && ((i.position = t), 1)
          );
        }
        ((W.pushNavigationHistory = function (e, t) {
          Ct ||
            (t ||
            (!a.empty() &&
              a[a.length - 1].source === e.source &&
              angular.equals(a[a.length - 1].next, e.current) &&
              angular.equals(a[a.length - 1].stack, e.stack) &&
              angular.equals(a[a.length - 1].page, e.page))
              ? a.pop()
              : (a = []),
            St.push(e),
            30 < St.length && St.shift());
        }),
          (W.pushNavigationHistoryPagination = function () {
            W.pushNavigationHistory(Et());
          }),
          (W.navigateFolder = function (e) {
            (W.pushNavigationHistory({
              source: "installed",
              next: W.currentFolder,
              current: e,
            }),
              (W.currentFolder = e),
              (u.current = 1),
              z(),
              (W.folderNavigation = (function a(e, i) {
                var n;
                return (
                  angular.forEach(e, function (e) {
                    var t;
                    e === i
                      ? (n = [e])
                      : (t = a(e.subfolders, i)) && (n = [e].concat(t));
                  }),
                  n
                );
              })(W.folders, e)),
              ut());
          }),
          (W.navigateFolderUp = function () {
            !angular.isArray(W.folderNavigation) ||
            W.folderNavigation.length < 2
              ? W.navigateFolder()
              : W.navigateFolder(
                  W.folderNavigation[W.folderNavigation.length - 2],
                );
          }),
          (W.navigateFolderBackwards = function () {
            var e;
            St.empty() ||
              (a.push(Et()),
              (e = St.pop()),
              W.setListSource(e.source),
              W.sourceIsInstalled
                ? Pt(W.folders, e.next)
                  ? ((Ct = !0),
                    W.navigateFolder(e.next),
                    (Ct = !1),
                    W.callbackChangePage(e.page))
                  : ((St = []), W.navigateFolder())
                : W.sourceIsExplore
                  ? Mt(e)
                  : W.sourceIsWorkshop && W.callbackChangePage(e.page));
          }),
          (W.navigateFolderForwards = function () {
            var e;
            a.empty() ||
              ((e = a[a.length - 1]),
              W.pushNavigationHistory(Et(), !0),
              W.setListSource(e.source),
              W.sourceIsInstalled
                ? Pt(W.folders, e.next)
                  ? ((Ct = !0),
                    W.navigateFolder(e.next),
                    (Ct = !1),
                    W.callbackChangePage(e.page))
                  : (a = [])
                : W.sourceIsExplore
                  ? Mt(e)
                  : W.sourceIsWorkshop && W.callbackChangePage(e.page));
          }),
          (W.callbackSplitSelectedMonitor = function (i) {
            F.open("browseSplitMonitor", {
              data: {
                config: { direction: 0, position: 0.5 },
                name: i.name,
                bounds: [{ max: i.w }, { max: i.h }],
              },
            }).then(function (e) {
              var t = i.wallpaper,
                a = it(i);
              ((W.monitorProfile.splits = W.monitorProfile.splits || {}),
                (W.monitorProfile.splits[i.location] = e.config),
                x(),
                g(W.monitorProfile).then(function () {
                  (W.callbackSelectMonitor(W.monitorSplits[i.location].left),
                    t && (l(t), nt(a)));
                }));
            });
          }),
          (W.callbackRemoveSplit = function (e) {
            var t = e.location.slice(0, -2),
              a =
                (Tt(t),
                x(),
                g(W.monitorProfile),
                angular.forEach(W.monitors, function (e) {
                  e.location === t && W.callbackSelectMonitor(e);
                }),
                "L" === t[t.length - 1]),
              i = t.slice(0, -2);
            angular.forEach(W.monitorSplits, function (e, t) {
              t === i && W.callbackSelectMonitor(a ? e.left : e.right);
            });
          }),
          (W.callbackSplitMoved = function (e, t) {
            Rt(e, t) &&
              ((e = W.selectedMonitor && W.selectedMonitor.location),
              x(),
              g(W.monitorProfile),
              (t = e && _(e))) &&
              W.callbackSelectMonitor(t);
          }),
          (W.callbackSplitDblClick = function (t) {
            var e = _(t),
              a = W.monitorProfile.splits[t];
            angular.isObject(a) &&
              angular.isObject(e) &&
              F.open("browseSplitMonitor", {
                data: {
                  config: angular.copy(a),
                  name: e.name,
                  bounds: [{ max: e.w }, { max: e.h }],
                },
              }).then(function (e) {
                (a.direction === e.config.direction
                  ? Rt(t, e.config.position)
                  : (a = angular.merge(a, e.config)),
                  x(),
                  g(W.monitorProfile));
              });
          }),
          (W.callbackCreateGroup = function (e) {
            var t = W.monitorSelectionState.createGroup;
            if (((W.monitorSelectionState.createGroup = 0), !(e.length < 2))) {
              2 !== t &&
                angular.forEach(e, function (e) {
                  e.isGroup || Tt(e.location);
                });
              var a,
                i,
                n = e.find(function (e) {
                  return e.isGroup ? e : e.isInGroup ? At(e) : void 0;
                });
              if (angular.isObject(n)) {
                var o = n.location,
                  r = W.monitorProfile.groups[n.location];
                (angular.isObject(r) &&
                  ((r.layout = t),
                  angular.forEach(e, function (e) {
                    var t;
                    e.isGroup
                      ? ((t = W.monitorProfile.groups[e.location]),
                        angular.forEach(t && t.monitors, function (e) {
                          -1 === r.monitors.indexOf(e) && r.monitors.push(e);
                        }))
                      : -1 === r.monitors.indexOf(e.location) &&
                        r.monitors.push(e.location);
                  })),
                  angular.forEach(e, function (e) {
                    e !== n &&
                      e.isGroup &&
                      delete W.monitorProfile.groups[e.location];
                  }));
              } else {
                W.monitorProfile.groups = W.monitorProfile.groups || {};
                var s = "";
                for (
                  angular.forEach(e, function (e) {
                    s += e.location;
                  }),
                    o = "group_" + s.hashCode();
                  angular.isDefined(W.monitorProfile.groups[o]);
                )
                  o =
                    "group_" +
                    Math.random()
                      .toString(36)
                      .replace(/[^a-z]+/g, "")
                      .substr(0, 6);
                e = {
                  monitors: e.map(function (e) {
                    return e.location;
                  }),
                  layout: t,
                };
                ((W.monitorProfile.groups[o] = e),
                  (n = _(o)),
                  W.selectedMonitor &&
                    ((a = W.selectedMonitor.wallpaper),
                    (i = it(W.selectedMonitor))));
              }
              (x(),
                g(W.monitorProfile).then(function () {
                  ((n = _(o)),
                    angular.isObject(n) &&
                      (W.callbackSelectMonitor(n),
                      angular.isDefined(a) && l(a),
                      angular.isDefined(i)) &&
                      nt(i));
                }));
            }
          }),
          (W.callbackRemoveGroup = function (a) {
            var i, t;
            if (
              W.monitorProfile.groups &&
              (a.isGroup
                ? (i = {
                    location: a.location,
                    monitors:
                      W.monitorProfile.groups &&
                      W.monitorProfile.groups[a.location] &&
                      W.monitorProfile.groups[a.location].monitors,
                  })
                : angular.forEach(W.monitorProfile.groups, function (e, t) {
                    e.monitors.includes(a.location) &&
                      (i = { location: t, monitors: e.monitors });
                  }),
              angular.isObject(i))
            ) {
              for (
                Qe(i.location),
                  delete W.monitorProfile.groups[i.location],
                  x(),
                  g(W.monitorProfile),
                  angular.forEach(i.monitors, function (e) {
                    t = t || _(e);
                  });
                t &&
                angular.isDefined(
                  W.monitorSplits && W.monitorSplits[t.location],
                );
              )
                t = W.monitorSplits[t.location].left;
              t ? W.callbackSelectMonitor(t) : (W.selectedMonitor = void 0);
            }
          }));
        var It,
          Ot,
          Dt,
          Wt = !(W.callbackCancelMonitorGrouping = function (e) {
            0 !== W.monitorSelectionState.createGroup &&
              ((W.monitorSelectionState.createGroup = 0),
              e.stopPropagation(),
              e.preventDefault());
          });
        function Bt(t, a, e) {
          (t.location === a.source && delete a.source,
            angular.isObject(a.monitorconfig) || (a.monitorconfig = {}),
            a.monitorconfig[t.location] && a.monitorconfig[t.location].flip
              ? delete a.monitorconfig[t.location].flip
              : ((a.monitorconfig[t.location] =
                  a.monitorconfig[t.location] || {}),
                (a.monitorconfig[t.location].flip = !0)));
          var i = 0;
          (angular.forEach(e, function (e) {
            (a.monitorconfig[e] && a.monitorconfig[e].flip) || ++i;
          }),
            0 === i &&
              (Wt ||
                ((Wt = !0),
                F.open("genericConfirm", {
                  data: {
                    title: "ui_browse_monitors_clone_flip_limitation_title",
                    message: "ui_browse_monitors_clone_flip_limitation_message",
                    okVisible: !0,
                  },
                })),
              angular.forEach(e, function (e) {
                0 === i &&
                  e !== t.location &&
                  (delete a.monitorconfig[e].flip, ++i);
              })));
        }
        function Vt(e, i, n) {
          ((n = n || []),
            angular.forEach(e, function (e, t) {
              var a = {},
                a =
                  ((a[t] = e.properties),
                  (e.properties = a),
                  angular.isObject(ee[e.file]) || (ee[e.file] = {}),
                  angular.merge(ee[e.file], e),
                  p(e.file));
              (a && n.push(a),
                (i[t] = { file: e.file, playlist: angular.copy(e.playlist) }));
            }));
        }
        function Ft() {
          var e, l, i;
          v &&
            W.syncStatus.subscriptionLoadAttempted &&
            ((!W.syncStatus.fileLoaded && !W.syncStatus.fileError) ||
              W.syncStatus.fileError ||
              (W.$watch(
                "syncFile",
                function (e, t) {
                  angular.isObject(e) &&
                    !angular.equals(e, t) &&
                    j.callDeferred(
                      "browseWallpaperObject",
                      "writeSyncFile",
                      angular.toJson(e),
                    );
                },
                !0,
              ),
              (e = function (e) {
                angular.isNumber(e.syncid) &&
                  (W.syncFile.nextId = Math.max(
                    W.syncFile.nextId,
                    e.syncid + 1,
                  ));
              }),
              angular.forEach(W.syncFile.playlists, e),
              angular.forEach(W.syncFile.folders, e),
              angular.forEach(W.playlists, e),
              angular.forEach(W.folders, e),
              (i = []),
              angular.forEach(W.playlists, function (e) {
                var t;
                if (!e.syncDisabled && angular.isNumber(e.syncid)) {
                  var r = W.syncFile.playlists.find(
                    ((t = e.syncid),
                    function (e) {
                      return e.syncid === t;
                    }),
                  );
                  if (angular.isObject(r) && angular.isArray(r.items)) {
                    var s = [];
                    for (
                      l = -1,
                        angular.forEach(e.items, function (e) {
                          var t,
                            a,
                            i,
                            n = angular.isObject(e) ? e.file : e,
                            o = p(n);
                          angular.isObject(o) && angular.isString(o.workshopid)
                            ? ++l < r.items.length &&
                              ((t = r.items[l]),
                              (i = (a = angular.isObject(t)) ? t.file : t) ===
                              o.workshopid
                                ? a
                                  ? (((t = angular.copy(t)).file = n),
                                    s.push(t))
                                  : s.push(n)
                                : ((o = He(i)),
                                  angular.isObject(o) && s.push(o.file)))
                            : s.push(e);
                        }),
                        ++l;
                      l < r.items.length;
                      ++l
                    ) {
                      var a = He(r.items[l]);
                      angular.isObject(a) && s.push(a.file);
                    }
                    ((e.name = r.name || e.name),
                      angular.equals(e.settings, r.settings) ||
                        (e.settings = r.settings || e.settings),
                      angular.equals(e.items, s) || (e.items = s));
                  } else i.push(e);
                }
              }),
              angular.forEach(i, function (e) {
                W.playlists.findAndRemove(e);
              }),
              W.$watch(
                "playlists",
                function (e, t) {
                  var a;
                  angular.isDefined(t) &&
                    angular.isArray(e) &&
                    (console.log("sync playlists with cloud save"),
                    (a = []),
                    angular.forEach(W.playlists, function (e) {
                      var i;
                      e.syncDisabled ||
                        (angular.isNumber(e.syncid) ||
                          (e.syncid = W.syncFile.nextId++),
                        (i = {
                          syncid: e.syncid,
                          name: e.name,
                          settings: e.settings,
                          items: [],
                        }),
                        angular.forEach(e.items, function (e) {
                          var t = angular.isObject(e),
                            a = p(t ? e.file : e);
                          angular.isObject(a) &&
                            angular.isString(a.workshopid) &&
                            (t
                              ? (((t = angular.copy(e)).file = a.workshopid),
                                i.items.push(t))
                              : i.items.push(a.workshopid));
                        }),
                        a.push(i));
                    }),
                    angular.equals(W.syncFile.playlists, a) ||
                      (W.syncFile.playlists = a));
                },
                !0,
              )));
        }
        function jt() {
          W.hideWallpaperSelection =
            W.sourceIsInstalled &&
            "screensaver" === W.wallpaperConfigGroup &&
            W.wallpaperConfigScreensaver.sameaswallpaper;
        }
        function Lt(e) {
          (delete e.utilitytags.Customizable,
            delete e.utilitytags.Approved,
            delete e.utilitytags["Audio responsive"]);
        }
        function zt() {
          var t = { x0: 0, y0: 0, x1: 0, y1: 0 },
            e = Dt.innerWidth(),
            a = Dt.innerHeight(),
            i =
              (angular.forEach(Ot, function (e) {
                ((t.x0 = Math.min(t.x0, e.x0)),
                  (t.y0 = Math.min(t.y0, e.y0)),
                  (t.x1 = Math.max(t.x1, e.x1)),
                  (t.y1 = Math.max(t.y1, e.y1)));
              }),
              t.x1 - t.x0),
            n = t.y1 - t.y0,
            e = Math.min(e / i, a / n);
          ((W.monitorScale = e),
            (W.monitorSelectionBoxStyle =
              "width:" +
              i * e +
              "px;height:" +
              n * e +
              "px;position:absolute;"),
            window.safeApply(W));
        }
        function Ht() {
          It && (It.disconnect(), (It = void 0));
        }
        ((W.callbackMonitorRightClick = function (e, r, t) {
          var a,
            i,
            n = B.builder(),
            o = Je(),
            s = 1 < o.length;
          2 === W.wallpaperConfig.layout
            ? (r.location === W.monitorProfile.source
                ? n.button(
                    "ui_browse_monitors_clone_remove_source",
                    "fas fa-lock-open-alt",
                    function () {
                      (delete W.monitorProfile.source,
                        x(),
                        g(W.monitorProfile, !0));
                    },
                  )
                : n.button(
                    "ui_browse_monitors_clone_set_source",
                    "fas fa-lock-alt",
                    function () {
                      ((W.monitorProfile.source = r.location),
                        angular.isObject(
                          W.monitorProfile.monitorconfig &&
                            W.monitorProfile.monitorconfig[r.location],
                        ) &&
                          delete W.monitorProfile.monitorconfig[r.location]
                            .flip,
                        x(),
                        g(W.monitorProfile, !0));
                    },
                  ),
              s &&
                n.button(
                  "ui_browse_monitors_clone_flip",
                  "fas fa-reflect-horizontal",
                  function () {
                    (Bt(
                      r,
                      W.monitorProfile,
                      o.map(function (e) {
                        return e.location;
                      }),
                    ),
                      x(),
                      g(W.monitorProfile, !0));
                  },
                ),
              n.empty() || n.open(W, e))
            : 0 !== W.wallpaperConfig.layout ||
              (1 < o.length &&
                angular.isObject(r.wallpaper) &&
                ((a = B.builder()),
                (i = B.builder()),
                angular.forEach(o, function (o) {
                  r.location === o.location ||
                    o.isInGroup ||
                    (a.button(o.name, function () {
                      (angular.isObject(r.wallpaper) &&
                        j.callDeferred(
                          "browseWallpaperObject",
                          "transferWallpaperProperties",
                          {
                            file: r.wallpaper.file,
                            source: r.location,
                            destination: o.location,
                          },
                        ),
                        l(r.wallpaper, o.location),
                        ot(r, o),
                        y(),
                        at(o) &&
                          j.callDeferred(
                            "browseWallpaperObject",
                            "transferWallpaperProperties",
                            {
                              file: Object.keys(o.playlistFlags),
                              source: r.location,
                              destination: o.location,
                            },
                          ),
                        snapshotAppliedConfig());
                    }),
                    i.button(o.name, function () {
                      var e = angular.isObject(r.wallpaper) && r.wallpaper.file,
                        t = angular.isObject(o.wallpaper) && o.wallpaper.file,
                        a = [],
                        i = [],
                        n =
                          (at(r) && (a = Object.keys(r.playlistFlags)),
                          at(o) && (i = Object.keys(o.playlistFlags)),
                          e && a.push(e),
                          t && i.push(t),
                          (a = a.uniquify()),
                          (i = i.uniquify()),
                          a.filter((e) => i.includes(e))),
                        a = a.filter((e) => !n.includes(e)),
                        i = i.filter((e) => !n.includes(e)),
                        e =
                          (n.empty() ||
                            j.callDeferred(
                              "browseWallpaperObject",
                              "transferWallpaperProperties",
                              {
                                file: n,
                                source: r.location,
                                destination: o.location,
                                swap: !0,
                              },
                            ),
                          a.empty() ||
                            j.callDeferred(
                              "browseWallpaperObject",
                              "transferWallpaperProperties",
                              {
                                file: a,
                                source: r.location,
                                destination: o.location,
                              },
                            ),
                          i.empty() ||
                            j.callDeferred(
                              "browseWallpaperObject",
                              "transferWallpaperProperties",
                              {
                                file: i,
                                source: o.location,
                                destination: r.location,
                              },
                            ),
                          o.wallpaper),
                        t =
                          (angular.isObject(r.wallpaper)
                            ? l(r.wallpaper, o.location)
                            : W.callbackRemoveWallpaperAndPlaylistFromMonitor(
                                o.location,
                              ),
                          angular.isObject(e)
                            ? l(e, r.location)
                            : W.callbackRemoveWallpaperAndPlaylistFromMonitor(
                                r.location,
                              ),
                          angular.copy(o));
                      (ot(r, o), ot(t, r), y(), snapshotAppliedConfig());
                    }));
                }),
                n.subMenu("ui_browse_monitors_copy_to", a),
                n.subMenu("ui_browse_monitors_swap_with", i)),
              W.monitorController.audioIsEnabledForMonitor(r)
                ? n.button(
                    "ui_browse_monitors_mute",
                    "fas fa-volume-mute",
                    function () {
                      W.monitorController.audioSetEnabledForMonitor(r, !1);
                    },
                  )
                : n.button(
                    "ui_browse_monitors_unmute",
                    "fas fa-volume-up",
                    function () {
                      W.monitorController.audioSetEnabledForMonitor(r, !0);
                    },
                  ),
              (!s && !r.isGroup) || n.empty() || n.divider(),
              s &&
                (r.isSplit ||
                  (r.isGroup && 2 === r.layout) ||
                  n.button(
                    "ui_browse_monitors_add_stretch_group",
                    "fas fa-object-group",
                    function () {
                      (W.callbackSelectMonitor(r),
                        (W.monitorSelectionState.createGroup = 1));
                    },
                  ),
                n.button(
                  "ui_browse_monitors_add_clone_group",
                  "fas fa-clone",
                  function () {
                    (W.callbackSelectMonitor(r),
                      (W.monitorSelectionState.createGroup = 2));
                  },
                )),
              r.isGroup &&
                (2 === r.layout &&
                  (r.source === t.location
                    ? n.button(
                        "ui_browse_monitors_clone_remove_source",
                        "fas fa-lock-open-alt",
                        function () {
                          (delete W.monitorProfile.groups[r.location].source,
                            x(),
                            g(W.monitorProfile, !0),
                            W.callbackSelectMonitor(_(r.location)));
                        },
                      )
                    : n.button(
                        "ui_browse_monitors_clone_set_source",
                        "fas fa-lock-alt",
                        function () {
                          var e = W.monitorProfile.groups[r.location];
                          ((e.source = t.location),
                            angular.isObject(
                              e.monitorconfig && e.monitorconfig[t.location],
                            ) && delete e.monitorconfig[t.location].flip,
                            x(),
                            g(W.monitorProfile, !0),
                            W.callbackSelectMonitor(_(r.location)));
                        },
                      ),
                  n.button(
                    "ui_browse_monitors_clone_flip",
                    "fas fa-reflect-horizontal",
                    function () {
                      var e = W.monitorProfile.groups[r.location];
                      (Bt(t, e, e.monitors),
                        x(),
                        g(W.monitorProfile, !0),
                        W.callbackSelectMonitor(_(r.location)));
                    },
                  )),
                n.button(
                  "ui_browse_monitors_remove_group",
                  "fas fa-object-ungroup",
                  function () {
                    W.callbackRemoveGroup(r);
                  },
                )),
              r.isGroup ||
                r.isInGroup ||
                (n.button(
                  "ui_browse_monitors_add_split",
                  "fas fa-cut",
                  function () {
                    W.callbackSplitSelectedMonitor(r);
                  },
                ),
                Me(r) && !r.isSplit
                  ? n.button(
                      "ui_browse_monitors_auto_split",
                      "fas fa-magic",
                      function () {
                        j.callDeferred(
                          "browseWallpaperObject",
                          "readSurroundDisplayInfo",
                        ).then(function (e) {
                          angular.isString(e.error)
                            ? F.open("genericConfirm", {
                                data: {
                                  title:
                                    "ui_browse_monitors_auto_split_error_header",
                                  message: e.error,
                                  okVisible: !0,
                                },
                              })
                            : angular.isObject(e.splits) &&
                              (Tt(r.location),
                              angular.merge(W.monitorProfile.splits, e.splits),
                              x(),
                              g(W.monitorProfile),
                              W.callbackSelectMonitor(
                                W.monitorSplits[r.location].left,
                              ));
                        });
                      },
                    )
                  : r.isSplit &&
                    n.button(
                      "ui_browse_monitors_remove_all_splits",
                      "fas fa-times",
                      function () {
                        (Tt(r.rootLocation),
                          x(),
                          g(W.monitorProfile),
                          W.callbackSelectMonitor(_(r.rootLocation)));
                      },
                    )),
              n.empty()) ||
              n.open(W, e);
        }),
          (W.callbackSplitRightClick = function (e, t) {
            var a = B.builder();
            (a
              .button(
                "ui_browse_monitors_edit_split",
                "fas fa-edit",
                function () {
                  W.callbackSplitDblClick(t);
                },
              )
              .button(
                "ui_browse_monitors_remove_split",
                "fas fa-times",
                function () {
                  W.callbackRemoveSplit(_(t + "/L"));
                },
              ),
              a.open(W, e));
          }),
          (W.syncFile = { nextId: 1 }),
          (W.syncStatus = {
            fileError: !1,
            fileLoaded: !1,
            subscriptionLoadAttempted: !1,
          }),
          (W.setSyncInfo = function (e) {
            (console.log("setSyncInfo", e),
              angular.merge(W.syncFile, e),
              angular.isArray(W.syncFile.playlists) ||
                (W.syncFile.playlists = []),
              angular.isArray(W.syncFile.folders) || (W.syncFile.folders = []),
              (W.syncStatus.fileLoaded = !0),
              Ft());
          }),
          (W.setSyncPaused = function () {
            (console.log("setSyncPaused"), (W.syncStatus.fileError = !0), Ft());
          }),
          W.$on("onSteamStatusFinished", function () {
            ((W.syncStatus.subscriptionLoadAttempted = !0), Ft());
          }),
          (W.initializeMonitorsFromMonitorCfg = function (e) {
            ((t = e),
              Ht(),
              (Ot = t),
              (t = document.getElementById("MonitorSelectionBox")),
              (Dt = angular.element(t)),
              t &&
                ((It = new ResizeObserver(zt)).observe(t),
                W.monitorController.rebuild) &&
                W.monitorController.rebuild(),
              zt());
            var t,
              a = [];
            (angular.forEach(e, function (e) {
              var t = {};
              ((t.x = e.x0),
                (t.y = e.y0),
                (t.w = e.x1 - e.x0),
                (t.h = e.y1 - e.y0),
                (t.index = e.index),
                (t.location = e.location),
                (t.name = e.name),
                0 === e.index && (t.selected = !0),
                k(t),
                a.push(t));
            }),
              a.sort(function (e, t) {
                return e.index < t.index ? -1 : t.index < e.index ? 1 : 0;
              }),
              (W.monitors = a));
          }),
          (W.getFirstActiveMonitor = function (e) {
            if (angular.isDefined(e && W.monitorSplits[e.location]))
              for (; angular.isDefined(W.monitorSplits[e.location]);)
                e = W.monitorSplits[e.location].left;
            return (e = e.isInGroup ? At(e) || e : e);
          }),
          (W.applyMonitorConfigurationAndWallpaperConfig = function (
            e,
            a,
            t,
            i,
          ) {
            (W.initializeMonitorsFromMonitorCfg(e), (re = t));
            function n(e) {
              var t = W.selectedMonitor.location,
                e =
                  (angular.forEach(W.monitors, function (e) {
                    (y(e),
                      angular.isObject(
                        W.wallpaperConfig.selectedwallpapers[e.location],
                      ) &&
                        (0 < e.playlist.items.length
                          ? (W.wallpaperConfig.selectedwallpapers[
                              e.location
                            ].playlist = qe(e.playlist))
                          : delete W.wallpaperConfig.selectedwallpapers[
                              e.location
                            ].playlist),
                      delete e.wallpaper);
                  }),
                  (W.wallpaperConfig =
                    "screensaver" === e
                      ? W.wallpaperConfigScreensaver
                      : W.wallpaperConfigRoot),
                  j.callDeferred("browseWallpaperObject", "changeConfigGroup", {
                    group: W.wallpaperConfigScreensaver.sameaswallpaper
                      ? "wallpaper"
                      : e,
                  }),
                  (W.monitorProfile =
                    (W.wallpaperConfig && W.wallpaperConfig.profile) || {}),
                  jt(),
                  x(),
                  _(t));
              (w(
                W.getFirstActiveMonitor(
                  e || (0 < W.monitors.length && W.monitors[0]),
                ),
              ),
                angular.forEach(W.monitors, function (e) {
                  (delete e.missingPlaylistItems, k(e));
                }),
                (te = !1),
                rt(),
                tt(),
                z(),
                j.callDeferred("browseWallpaperObject", "clearWorkerWindow"));
            }
            var o,
              r,
              s,
              l,
              c,
              d,
              p,
              u,
              e = a.wallpaperconfig || {},
              t = a.wallpaperconfigscreensaver || {},
              g =
                ((e.selectedwallpapers = e.selectedwallpapers || {}),
                (t.selectedwallpapers = t.selectedwallpapers || {}),
                (W.wallpaperConfig = e),
                (W.wallpaperConfigRoot = e),
                (W.wallpaperConfigScreensaver = t),
                (W._trulyAppliedWallpapers = angular.copy(e.selectedwallpapers)),
                (W._trulyAppliedScreensavers = angular.copy(t.selectedwallpapers)),
                !(W.wallpaperConfigGroup = "wallpaper")),
              t =
                ((W.startWatchingScreensaverSettings = function () {
                  var e;
                  g ||
                    ("screensaver" === W.wallpaperConfigGroup &&
                      ((g = !0),
                      (e = function () {
                        (j
                          .callDeferred(
                            "browseWallpaperObject",
                            "checkScreensaverSelected",
                          )
                          .then(function () {
                            W.showScreensaverWindowsSettingsWarning = !1;
                          })
                          .catch(function () {
                            W.showScreensaverWindowsSettingsWarning = g;
                          }),
                          (W.showScreensaverApplicationWallpaperWarning =
                            W.currentSelection &&
                            "Application" === W.currentSelection.type),
                          "screensaver" === W.wallpaperConfigGroup
                            ? (m.cancel(o), (o = m(e, 3e3)))
                            : (m.cancel(o),
                              (g = !1),
                              (W.showScreensaverWindowsSettingsWarning = !1),
                              (W.showScreensaverApplicationWallpaperWarning =
                                !1)));
                      })()));
                }),
                W.$watch("wallpaperConfigGroup", function (e, t) {
                  e !== t &&
                    ("screensaver" !== e || a.screensaverisavailable
                      ? n(e)
                      : F.open("genericConfirm", {
                          data: {
                            title: "ui_browse_modal_screensaver_install_header",
                            message: "ui_browse_modal_screensaver_install_body",
                            alert: "ui_browse_modal_screensaver_install_hint",
                            leftIcon: "images/uac_small.png",
                            okVisible: !0,
                            cancelVisible: !0,
                          },
                        })
                          .then(function () {
                            return j
                              .callDeferred(
                                "browseWallpaperObject",
                                "installScreensaver",
                              )
                              .catch(function () {
                                return (
                                  F.open("genericConfirm", {
                                    data: {
                                      title:
                                        "ui_browse_modal_screensaver_install_error_header",
                                      message:
                                        "ui_browse_modal_screensaver_install_error_body",
                                      leftIcon: "images/warning.png",
                                      okVisible: !0,
                                    },
                                  }),
                                  D.reject()
                                );
                              });
                          })
                          .then(function () {
                            ((a.screensaverisavailable = !0), n(e));
                          })
                          .catch(function () {
                            W.wallpaperConfigGroup = "wallpaper";
                          }),
                    Ze());
                }),
                W.$watch(
                  "wallpaperConfigScreensaver.sameaswallpaper",
                  function (e, t) {
                    e !== t &&
                      (j.callDeferred(
                        "browseWallpaperObject",
                        "changeConfigGroupOptions",
                        {
                          group: "screensaver",
                          options: { sameaswallpaper: e },
                        },
                      ),
                      n(e ? "wallpaper" : W.wallpaperConfigGroup));
                  },
                ),
                (W.monitorProfile =
                  (a.wallpaperconfig && a.wallpaperconfig.profile) || {}),
                x(),
                0 < W.monitors.length &&
                  w(W.getFirstActiveMonitor(W.monitors[0])),
                angular.merge(W.browserSettings, {
                  advertiseexplore: !0,
                  advertiseworkshop: !0,
                  advertiseworkshoppopup: V.canUseFilterSettings(),
                  advertisesendtomobile: !0,
                }),
                angular.isObject(a.browser) &&
                  (angular.isArray(a.browser.authorblacklist) &&
                    ((a.browser.authorblocklistnames =
                      a.browser.authorblacklist.map(function (e) {
                        return { name: e || "?", value: e };
                      })),
                    delete a.browser.authorblacklist),
                  angular.isArray(a.browser.authorblocklistnames) &&
                    (W.browserSettingsExtensions.authorblocklist =
                      a.browser.authorblocklistnames.map(function (e) {
                        return e.value;
                      })),
                  angular.merge(W.browserSettings, a.browser),
                  angular.merge(
                    h,
                    (a.browser.filterinfo && a.browser.filterinfo.installed) ||
                      {},
                  ),
                  angular.merge(
                    b,
                    (a.browser.filterinfo && a.browser.filterinfo.workshop) ||
                      {},
                  ),
                  Lt(h),
                  Lt(b),
                  (W.filterProxy.ratingtags = angular.copy(h.ratingtags)),
                  !W.browserSettings.advertiseworkshoppopup) &&
                  angular.isUndefined(
                    W.browserSettings.defaultfilterconfig.Anime,
                  ) &&
                  ((t = b.tags && !0 === b.tags.Anime),
                  (W.browserSettings.defaultfilterconfig = { Anime: t })),
                (W.folders = W.browserSettings.folders),
                m(function () {
                  W.$broadcast("rzSliderForceRender");
                }),
                {}),
              f =
                (Vt(a.wproperties || a.wallpaperproperties, t),
                ct(W.wallpapers),
                (e.selectedwallpapers = t),
                angular.isArray(a.localfiles) &&
                  (a.localfiles.map(function (e) {
                    angular.isObject(e) ? je(e.file, void 0, e.name) : je(e);
                  }),
                  z()),
                rt(),
                tt(),
                W.showMonitorRow
                  ? (W.browserSettings.showmonitorselectiononstart &&
                      W.showMonitorSelection(),
                    !W.changeMonitorActive &&
                      angular.isString(W.browserSettings.lastselectedmonitor) &&
                      ((e = _(W.browserSettings.lastselectedmonitor)),
                      angular.isObject(e)) &&
                      w(e))
                  : (W.canAdvertiseWorkshop = ie),
                []);
            (angular.forEach(W.monitors, function (e) {
              angular.isObject(e.wallpaper) && f.push(e.wallpaper);
            }),
              ct(f),
              (W.playlists = a.playlists || []),
              (W.profiles = a.profiles || []),
              (W.sharedSettings = a.shared || {}),
              (W.generalUserSettings = a.general || {}),
              (W.userMonitorSettings =
                W.generalUserSettings.usermonitors || {}),
              (W.browserRuntime = i),
              V.validateSharedSettings(W.sharedSettings),
              (W._trulyAppliedWallpapers = angular.copy((W.wallpaperConfig && W.wallpaperConfig.selectedwallpapers) || {})),
              (W._trulyAppliedScreensavers = angular.copy((W.wallpaperConfigScreensaver && W.wallpaperConfigScreensaver.selectedwallpapers) || {})),
              m(function () {
                ((v = !0), W.requestTrialWarning && W.showTrialWarning(), Ft());
              }),
              a.browseroptions &&
                ((r = V.getActiveEvent()) &&
                  W.browserSettings[r.key] &&
                  (r = void 0),
                a.browseroptions.safemodewarning
                  ? ((l = function () {
                      s.checkboxChecked ||
                        j.callDeferred(
                          "browseWallpaperObject",
                          "disableSafeMode",
                        );
                    }),
                    F.open("genericConfirm", {
                      data: (s = {
                        title: "ui_browse_modal_safe_mode_header",
                        message: "ui_browse_modal_safe_mode_body",
                        okVisible: !0,
                        cancelVisible: !0,
                        checkboxLowVisible: !0,
                        checkboxChecked: !0,
                        checkboxTitle: "ui_browse_use_safe_mode",
                      }),
                    })
                      .then(function () {
                        (j.callDeferred(
                          "browseWallpaperObject",
                          "reloadWallpaperConfig",
                        ),
                          l());
                      })
                      .catch(function () {
                        l();
                      }))
                  : a.browseroptions.showslideshowwarning &&
                      !1 !== W.sharedSettings.slideshowwarningenabled
                    ? ((c = {
                        title: "ui_win32_slideshow_compat_modal_title",
                        message: "ui_win32_slideshow_compat_modal_body",
                        okVisible: !0,
                        okText: "ui_close",
                        checkboxLowVisible:
                          a.browseroptions.candisableslideshowwarning,
                        checkboxChecked: !1,
                        checkboxTitle:
                          "ui_win32_slideshow_compat_modal_check_ignore",
                      }),
                      F.open("genericConfirm", { data: c }).then(function () {
                        c.checkboxChecked &&
                          (W.sharedSettings.slideshowwarningenabled = !1);
                      }))
                    : r
                      ? F.open("genericConfirm", {
                          data: {
                            title: r.title,
                            message: r.message,
                            okVisible: !0,
                            cancelVisible: !1,
                            leftVisible: !0,
                            leftClass: "btn-info",
                            leftAction: "browseEvent",
                            leftText:
                              "ui_browse_modal_seasonal_info_browse_collection",
                          },
                        }).then(function (e) {
                          "browseEvent" === e &&
                            (W.setListSource("explore"),
                            m(function () {
                              W.pushExplorePage(r.query);
                            }));
                        })
                      : a.browseroptions.seasonaldialogoptions &&
                        ((d = a.browseroptions.seasonaldialogoptions),
                        (p = {
                          title: d.header,
                          message: "ui_browse_modal_seasonal_info_body",
                          okVisible: !0,
                          cancelVisible: !1,
                          checkboxVisible: !0,
                          checkboxChecked: !1,
                          checkboxTitle:
                            "ui_browse_modal_seasonal_info_never_show_again",
                          leftVisible: !0,
                          leftClass: "btn-default",
                          leftAction: "browseCollection",
                          leftText:
                            "ui_browse_modal_seasonal_info_browse_collection",
                          left2Visible: !0,
                          left2Class: "btn-default",
                          left2Action: "revertTheme",
                          left2Text:
                            "ui_browse_modal_seasonal_info_disable_theming",
                        }),
                        F.open("genericConfirm", { data: p }).then(
                          function (e) {
                            ((W.browserSettings.seasonaldialogtimestamp =
                              d.timestamp),
                              p.checkboxChecked &&
                                (W.browserSettings.seasonaldialogdisabled = !0),
                              "browseCollection" === e
                                ? W.setListSource("explore")
                                : "revertTheme" === e &&
                                  j.callDeferred(
                                    "browseWallpaperObject",
                                    "disableUiSeasonalTheming",
                                  ));
                          },
                        )),
                a.browseroptions.showworkshop &&
                  W.setListSource(V.getDefaultWorkshopTab()),
                a.browseroptions.showscreensavers &&
                  m(function () {
                    W.showScreensaverSettings();
                  }),
                (W.browserOptions = a.browseroptions)),
              19536 <= I.getWindowsBuild() &&
                I.getWindowsBuild() < 19564 &&
                !W.browserSettings.buildversionerror19536newdisabled &&
                ((u = {
                  title: "Broken Windows Insider Build (19536 - 19564)",
                  message:
                    "Your current Windows Insider build " +
                    I.getWindowsBuild() +
                    " does not allow for Wallpaper Engine to work.<br/><br/>Please update to Insider build <b>19564</b> or later to make Wallpaper Engine work again.",
                  leftIcon: "images/warning.png",
                  okText: "ui_ok",
                  okVisible: !0,
                  checkboxLowVisible: !0,
                  checkboxChecked: !1,
                  checkboxTitle:
                    "ui_browse_modal_steam_redownload_never_show_again",
                }),
                F.open(
                  "genericConfirm",
                  { data: u },
                  { backdropClass: "modal-backdrop-danger" },
                ).then(function () {
                  u.checkboxChecked &&
                    (W.browserSettings.buildversionerror19536newdisabled = !0);
                })));
          }),
          (W.updateGeneralSettings = function (e) {
            angular.merge(W.generalUserSettings, e);
          }),
          (W.updateConfigWallpaperProperties = function (a, e) {
            var t;
            (e &&
              ((t = W.selectedMonitor.location),
              W.initializeMonitorsFromMonitorCfg(e),
              x(),
              (e = _(t)),
              w(
                W.getFirstActiveMonitor(
                  e || (0 < W.monitors.length && W.monitors[0]),
                ),
              ),
              angular.forEach(W.monitors, function (e) {
                (delete e.missingPlaylistItems, k(e));
              }),
              (te = !1),
              rt()),
              W.wallpaperConfig &&
                W.wallpaperConfig.selectedwallpapers &&
                (Vt(a, W.wallpaperConfig.selectedwallpapers, (t = [])),
                angular.forEach(
                  W.wallpaperConfig.selectedwallpapers,
                  function (e, t) {
                    !a.hasOwnProperty(t) &&
                      (delete W.wallpaperConfig.selectedwallpapers[t],
                      (t = _(t))) &&
                      delete t.wallpaper;
                  },
                ),
                ct(t),
                (te = !1),
                rt(),
                W.selectedMonitor && W.selectedMonitor.wallpaper
                  ? l(W.selectedMonitor.wallpaper)
                  : (W.currentSelection = void 0)));
          }),
          (W.applyUserVote = function (t, a) {
            (angular.forEach(W.wallpapers.concat(Fe()), function (e) {
              e.workshopid === t && (e.uservote = a);
            }),
              window.safeApply(W));
          }));
        var $t,
          Ut = [];
        function Gt() {
          D.all([
            e("views/includes/browseruserproperties.html"),
            e("views/includes/browseruserpropertiesgroup.html"),
          ]).then(function (e) {
            var a = e[0],
              o = e[1],
              r = angular.element(c.find("#BrowserUserPropertiesParent")[0]);
            if (
              (r.empty(),
              angular.forEach(Ut, function (e) {
                ((e.pending = !1),
                  e.scope.$destroy(),
                  e.groupScope && e.groupScope.$destroy());
              }),
              (Ut = []),
              W.currentSelection &&
                angular.isObject(W.currentSelection.properties) &&
                angular.isString(
                  W.selectedMonitor && W.selectedMonitor.location,
                ) &&
                angular.isObject(
                  W.currentSelection.properties[W.selectedMonitor.location],
                ))
            ) {
              var e = W.currentSelection.properties[W.selectedMonitor.location],
                i = [],
                t =
                  (angular.forEach(e, function (e, t) {
                    ((e.key = t), i.push(e));
                  }),
                  i.sort(function (e, t) {
                    return e.order - t.order;
                  }),
                  []),
                n = { properties: [] };
              t.push(n);
              for (var s = 0; s < i.length; ++s) {
                var l = i[s];
                (angular.isString(l.condition)
                  ? (l.condition = l.condition.replace("$", ""))
                  : delete l.condition,
                  "group" === l.type
                    ? t.push((n = { properties: [], property: l }))
                    : n.properties.push(l));
              }
              angular.forEach(t, function (e) {
                var t = W.$new(),
                  n =
                    ((t.properties = e.properties), { scope: t, pending: !0 });
                Ut.push(n);
                M(a)(t, function (i) {
                  n.pending &&
                    ((n.pending = !1),
                    e.property
                      ? ((n.groupScope = W.$new()),
                        (n.groupScope.groupProperty = e.property),
                        (n.groupScope.open = !1),
                        (n.propertiesElement = i),
                        M(o)(n.groupScope, function (e) {
                          function t() {
                            var e = n.propertiesElement[0].cloneNode(!0),
                              t =
                                (angular
                                  .element(e)
                                  .css({
                                    position: "absolute",
                                    width: "100px",
                                    left: "-10000px",
                                    visibility: "hidden",
                                  }),
                                c.find("body").append(e),
                                e.offsetHeight);
                            (e.remove(),
                              n.groupParent.css("max-height", t),
                              n.groupParent.css("overflow", "hidden"));
                          }
                          n.groupScope.toggleGroupVisibility = function () {
                            (m.cancel($t),
                              n.groupScope.open
                                ? ((n.groupScope.open = !1),
                                  n.propertiesElement && t())
                                : ((n.groupScope.open = !0),
                                  ($t = m(function () {
                                    (n.groupParent.css("max-height", "none"),
                                      n.groupParent.css("overflow", "visible"));
                                  }, 300))));
                          };
                          var a = e.find("#GroupFoldParent");
                          ((n.groupParent = a).append(i), r.append(e), m(t));
                        }))
                      : r.append(i));
                });
              });
            }
          });
        }
        var qt,
          Nt = !(W.setWallpaperProperties = function (t) {
            function e(e) {
              angular.isObject(e) &&
                e.file === t.file &&
                ((e.properties = e.properties || {}),
                (e.properties[t.location] = t.properties),
                (e.defaultproperties = t.defaultproperties),
                (e.propertyPresets = t.presets),
                (e.cancreatepresets = t.cancreatepresets),
                (e.aspect = t.aspect),
                Ve(e));
            }
            (angular.forEach(W.wallpapers, e),
              e(W.currentSelection),
              Pe(),
              W.currentSelection && t.file === W.currentSelection.file && Gt());
          });
        function Qt() {
          W.browserSettings.paireddevices.sort(function (e, t) {
            e = W.mobileManagerState.connectedDevices.find(ve(e.id)) ? 1 : 0;
            return (
              (W.mobileManagerState.connectedDevices.find(ve(t.id)) ? 1 : 0) - e
            );
          });
        }
        ((W.updateWorkshopStatus = function (e) {
          var t;
          ((W.steamWorkshopStatus = e).complete &&
            m(function () {
              W.steamWorkshopStatus.hidden = !0;
            }, 5e3),
            (e.complete || e.error) &&
              (e.isWrongPlatform && V.setWrongProviderFound(),
              T.$broadcast("onSteamStatusFinished", e),
              V.canUseMotd()) &&
              j.wpxAPIGet("/api/motd/v1").then(function (e) {
                ((e = e && e.data && e.data.response),
                  angular.isObject(e) &&
                    angular.isString(e.message) &&
                    e.status &&
                    ((W.motdMessage = n(e.message)), (W.showMotdMessage = !0)));
              }),
            L()
              ? !e.redownload ||
                Nt ||
                W.browserSettings.steamredownloaddialogdisabled ||
                ((t = {
                  title: "ui_browse_modal_steam_redownload_error_header",
                  message: "ui_browse_modal_steam_redownload_error_body",
                  okVisible: (Nt = !0),
                  checkboxVisible: !0,
                  checkboxChecked: !1,
                  checkboxTitle:
                    "ui_browse_modal_steam_redownload_never_show_again",
                }),
                F.open("genericConfirm", { data: t }).then(function () {
                  t.checkboxChecked &&
                    (W.browserSettings.steamredownloaddialogdisabled = !0);
                }))
              : ((ie = !1), (W.canAdvertiseWorkshop = !1)));
        }),
          (W.showInstallationWarning = function (e, t) {
            V.showInstallationWarning(e, t).then(function (e) {
              "disable" === e
                ? j.callDeferred(
                    "browseWallpaperObject",
                    "removeAutoStartCompletely",
                  )
                : "fix" === e &&
                  j.callDeferred("browseWallpaperObject", "fixAutoStart");
            });
          }),
          (W.callOpenStorePage = function () {
            j.callDeferred("browseWallpaperObject", "openStorePage");
          }),
          (W.showTrialWarning = function () {
            ((ne = !0),
              v
                ? W.browserSettings.hasshowntrialwarning ||
                  ((W.browserSettings.hasshowntrialwarning = !0),
                  O("ui_modal_trial_version_start_body", { hrs: 2 }).then(
                    function (e) {
                      return F.open("genericConfirm", {
                        data: {
                          title: "ui_modal_trial_version_start_title",
                          message: e,
                          okVisible: !0,
                          leftVisible: !0,
                          leftClass: "btn-info",
                          leftAction: "openStore",
                          leftText:
                            "ui_modal_trial_version_start_open_store_page",
                        },
                      }).then(function (e) {
                        "openStore" === e && W.callOpenStorePage();
                      });
                    },
                  ))
                : (W.requestTrialWarning = !0));
          }),
          (W.showWindowsInsiderWarning = function () {
            W.showMotdMessage ||
              ((W.motdMessage = "ui_windows_insider_warning"),
              (W.showMotdMessage = !0));
          }),
          (W.showMonitorMismatch = function () {
            F.open("genericConfirm", {
              data: {
                title: "ui_browse_modal_monitor_mismatch_title",
                message: "ui_browse_modal_monitor_mismatch_body",
                okVisible: !0,
              },
            });
          }),
          (W.openSteamUserPage = function (e) {
            if (angular.isString(e) && (e.indexOf("http://") === 0 || e.indexOf("https://") === 0)) {
              var u = e;
              if (u.indexOf("numperpage=") === -1) {
                u += (u.indexOf("?") === -1 ? "?" : "&") + "numperpage=30";
              }
              V.openUrl(u, {}, V.usePlatformBrowser());
            } else {
              V.openUrl("var_url_userpage", { id: e });
            }
          }),
          (W.openSteamWorkshopPage = function (e) {
            V.openUrl(e.workshopurl, {}, V.usePlatformBrowser());
          }),
          (W.openScreensaverFaq = function () {
            V.openUrl("var_url_faqscreensaver");
          }),
          (W.getWorkshopUrl = j.getWorkshopUrl),
          (W.copyWorkshopUrl = j.copyWorkshopUrl),
          (W.openSteamConnectFaq = function () {
            V.openUrl("var_url_faqsteam");
          }),
          (W.openReportDialog = function (e) {
            F.open("browseReport", {
              data: {
                wallpaper: e,
                backendUrl: j.wpxAPIBackendUrl,
                steamAuth: W.steamAuth,
              },
            });
          }),
          (W.canSendReports = V.canSendReports()),
          (W.canUseFilterSettings = V.canUseFilterSettings),
          (W.canUseMultiselect = function () {
            return W.sourceIsInstalled || !ne;
          }),
          (W.promptWallpaperWindowsCompatibility = function (t) {
            var e = D.defer();
            return (
              t &&
              angular.isString(t.tags) &&
              t.tags.toLowerCase().includes("video texture") &&
              I.getWindowsVersion() < 10
                ? (O(["ui_browse_modal_windows_10_warning_message"], {
                    title: t.title,
                  }).then(function (e) {
                    return F.open(
                      "genericConfirm",
                      {
                        data: {
                          title: "ui_browse_modal_windows_10_warning_title",
                          message: e.ui_browse_modal_windows_10_warning_message,
                          okVisible: !1,
                          cancelVisible: !0,
                          cancelText: "ui_close",
                          leftVisible: angular.isObject(t),
                          leftClass: "btn-danger",
                          leftText: "ui_browse_details_btn_unsubscribe",
                          leftAction: "unsubscribe",
                        },
                      },
                      {},
                    ).then(function (e) {
                      "unsubscribe" === e && Ye(t);
                    });
                  }),
                  e.reject())
                : e.resolve(),
              e.promise
            );
          }),
          (W.promptWallpaperDependencySubscription = function (e) {
            angular.isArray(e) || (e = [e]);
            var i = D.when(),
              n = [];
            return (
              angular.forEach(e, function (t) {
                var a;
                angular.isString(t.dependency) &&
                  ((a = !0),
                  angular.forEach(W.wallpapers, function (e) {
                    e.workshopid === t.dependency &&
                      "unsubscribed" !== e.status &&
                      ((a = !1), e.status);
                  }),
                  a) &&
                  (n.push(t.dependency), 1 === n.length) &&
                  (i = O("ui_browse_modal_subscribe_preset_body", {
                    title: t.title,
                  }).then(function (e) {
                    return F.open("genericConfirm", {
                      data: {
                        title: "ui_browse_modal_subscribe_preset_header",
                        message: e,
                        okVisible: !0,
                        cancelVisible: !0,
                      },
                    }).then(function () {
                      return j
                        .callDeferred("ui", "subscribeWorkshopItem", n)
                        .then(function () {
                          return "pending";
                        });
                    });
                  }));
              }),
              i
            );
          }),
          (W.subscribeWorkshopItem = function (e) {
            angular.isArray(e) || (e = [e]);
            
            W.promptWallpaperDependencySubscription(e).then(function () {
              if (
                V.canShowTrialWarning() &&
                ne &&
                (++oe, (W.showTrialAdvertiseAlert = 5 <= oe), 2 === oe)
              )
                return F.open("genericConfirm", {
                  data: {
                    title: "",
                    message: "ui_browse_modal_trial_reminder_body",
                    cancelVisible: !0,
                    cancelText: "ui_browse_alert_trial_reminder_button_cancel",
                    okVisible: !0,
                    okText: "ui_browse_alert_trial_reminder_button",
                  },
                }).then(function () {
                  j.callDeferred("browseWallpaperObject", "openStorePage");
                });
              if (window.WengineHelper) {
                e.forEach(function (w) {
                  if (w && w.workshopid) {
                    window.WengineHelper.downloadItem(w.workshopid);
                    var wid = String(w.workshopid);
                    var safeMeta = {};
                    var metaKeys = [
                      "workshopid", "pubfileid", "title", "author", "authorsteamid",
                      "author_url", "author_avatar", "file_size", "filesizelabel",
                      "rating", "ratingrounded", "hasrating", "rating_star_file",
                      "num_ratings", "posted_date", "updated_date", "file", "pkgfile",
                      "preview", "preview_url", "type", "description", "tags"
                    ];
                    for (var mk = 0; mk < metaKeys.length; mk++) {
                      var k = metaKeys[mk];
                      if (w[k] !== undefined && w[k] !== null && w[k] !== "") safeMeta[k] = w[k];
                    }
                    safeMeta.workshopid = wid;
                    safeMeta.pubfileid = wid;

                  }
                });
              }
              j.callDeferred(
                "ui",
                "subscribeWorkshopItem",
                e.map(function (e) {
                  return e.workshopid;
                }),
              );
            });
          }),
          (W.openFromFile = function (e) {
            j.callDeferred("browseWallpaperObject", "openFromFile", e).then(
              W.dropFile,
            );
          }),
          (W.openFromUrl = function () {
            F.open("openFromUrl", {
              data: { hotkeys: W.sharedSettings.hotkeys },
            }).then(function (e) {
              var t;
              angular.isString(e.url) &&
                0 < e.url.length &&
                (mt((t = je(e.url, "Web", e.name)), W.currentFolder),
                z(),
                l(t),
                snapshotAppliedConfig(),
                tt(),
                j.callDeferred(
                  "browseWallpaperObject",
                  "addLocalWallpaperToHistory",
                  [{ file: t.file, name: e.name }],
                ));
            });
          }),
          (W.getUserVote = function (e) {
            j.callDeferred(
              "ui",
              "getUserVote",
              "browseWallpapersCtrl",
              e.workshopid,
            );
          }),
          (W.setUserVote = function (e, t) {
            L()
              ? j.callDeferred(
                  "ui",
                  "setUserVote",
                  "browseWallpapersCtrl",
                  e,
                  t,
                )
              : V.showSteamError();
          }),
          (W.setFavorited = function (e, t) {
            L()
              ? j.callDeferred("ui", "setFavorited", e, t)
              : V.showSteamError();
          }),
          (W.makeLabelEditable = function (e, t) {
            var a = angular.element(e.currentTarget.parentElement),
              i = angular.element(a.children(".inputElement")[0]);
            function n(e) {
              (i.off("blur.edit"),
                i.off("keydown.edit"),
                a.removeClass("editSliderLabel"),
                !0 !== e &&
                  ((t.value = i.val()),
                  angular.isNumber(t.min) &&
                    (t.value = Math.max(t.min, t.value)),
                  angular.isNumber(t.max) &&
                    (t.value = Math.min(t.max, t.value)),
                  window.safeApply(W)));
            }
            (a.addClass("editSliderLabel"),
              i.focus(),
              i.val(t.value),
              i.select(),
              i.off("blur.edit"),
              i.off("keydown.edit"),
              i.on("blur.edit", n),
              i.on("keydown.edit", function (e) {
                13 === e.which ? n() : 27 === e.which && n(!0);
              }));
          }),
          (W.showMonitorSelection = function () {
            W.changeMonitorActive = !0;
          }),
          (W.toggleMonitorSelection = function () {
            (W.changeMonitorActive
              ? (W.changeMonitorActive = !1)
              : W.showMonitorSelection(),
              W.changeMonitorActive ||
                (W.monitorSelectionState.createGroup = 0),
              W.changeMonitorActive ||
                (!W.browserSettings.advertiseworkshop &&
                  !W.browserSettings.advertiseexplore) ||
                (W.canAdvertiseWorkshop = ie));
          }),
          (W.toggleMonitorSelectionBackground = function (e) {
            e.currentTarget === e.target && W.toggleMonitorSelection();
          }),
          (W.stopEvt = function (e) {
            (e.stopPropagation(), e.preventDefault());
          }),
          (W.changeConfigGroup = function (e) {
            "screensaver" === (W.wallpaperConfigGroup = e)
              ? W.startWatchingScreensaverSettings()
              : (W.showScreensaverWindowsSettingsWarning = !1);
          }),
          (W.toggleManageMobileDevices = function () {
            W.isMobileTranscoderAvailable()
              ? (W.mobileDeviceManagementActive &&
                  W.mobileManagerState.disableFirewallCheck &&
                  W.mobileManagerState.disableFirewallCheck(),
                (W.mobileDeviceManagementActive =
                  !W.mobileDeviceManagementActive))
              : F.open("genericConfirm", {
                  data: {
                    title: "ui_browse_mobile_upload_unavailable_title",
                    message: "ui_browse_mobile_upload_unavailable_body",
                    okVisible: !0,
                  },
                });
          }),
          (W.toggleManageMobileDevicesBackground = function (e) {
            e.currentTarget === e.target && W.toggleManageMobileDevices();
          }),
          (W.onMobileDeviceConnected = function (e) {
            (V.showSuccess(
              O.instant("ui_browse_mobile_devices_success_toast", e),
            ),
              "connect" === W.mobileManagerState.page &&
                ((W.mobileDeviceManagementActive = !1),
                (W.mobileManagerState.page = "")));
            var t = W.browserSettings.paireddevices.find(ve(e.id));
            (t
              ? (angular.merge(t, e), e.alias || delete t.alias)
              : W.browserSettings.paireddevices.push(e),
              W.mobileManagerState.connectedDevices.findAndRemove(ve(e.id)),
              W.mobileManagerState.connectedDevices.push(e),
              Qt());
          }),
          (W.onMobileDeviceDisconnected = function (t) {
            (W.mobileManagerState.connectedDevices.findAndRemove(function (e) {
              return e.id === t;
            }),
              Qt());
          }),
          (W.canUploadWallpaperToMobileDevice = function (e, t) {
            var a = !1;
            return (
              angular.isArray(e) || (e = [e]),
              angular.forEach(e, function (e) {
                a =
                  a ||
                  ("downloadable" !== e.status &&
                    ("Scene" === e.type || "Video" === e.type || t) &&
                    (!e.localAndExternal ||
                      e.file.toLowerCase().endsWith(".mp4") ||
                      e.file.toLowerCase().endsWith(".webm")));
              }),
              a
            );
          }),
          (W.filterWallpapersForMobileDevice = function (e) {
            return (e = angular.isArray(e) ? e : [e]).filter(
              W.canUploadWallpaperToMobileDevice,
            );
          }),
          (W.sendToMobileDevice = function (e, a) {
            Oe((e = angular.isArray(e) ? e : [e]))
              .then(De)
              .then(function (e) {
                var t;
                ((e = W.filterWallpapersForMobileDevice(angular.copy(e))),
                  W.canOpenWallpaperDetailsOnWeb &&
                    angular.forEach(e, function (e) {
                      var t = W.getWorkshopUrl(e);
                      t ? (e.sharelink = t) : delete e.sharelink;
                    }),
                  0 < e.length &&
                    ((t = W.browserSettings.paireddevices.find(ve(a.id))),
                    (a = t || a),
                    (W.browserSettings.advertisesendtomobile = !1),
                    F.open("browseMobileUpload", {
                      data: {
                        device: a,
                        location: W.selectedMonitor.location,
                        wallpapers: e,
                      },
                    })));
              });
          }),
          (W.cancelMobileUploads = function () {
            F.open("genericConfirm", {
              data: {
                title: "ui_browse_mobile_upload_cancel_title",
                message: "ui_browse_mobile_upload_cancel_body",
                okVisible: !0,
                cancelVisible: !0,
              },
            }).then(function () {
              return j.callDeferred(
                "browseWallpaperObject",
                "cancelMobileUploads",
              );
            });
          }),
          (W.mobileUploadState = {
            visible: !1,
            progress: 0,
            title: "<title>",
            device: "<device>",
            status: "<status>",
            count: "",
          }));
        var Kt = !(W.onMobileDeviceUploadProgress = function (t) {
          (m.cancel(qt),
            W.mobileUploadState.visible &&
              !t.visible &&
              (qt = m(function () {
                W.mobileUploadState.visible = !1;
              }, 3e3)),
            (t.visible = W.mobileUploadState.visible || t.visible),
            angular.merge(W.mobileUploadState, t),
            (W.mobileUploadState.status = O.instant(
              W.mobileUploadState.status,
            )),
            t.device
              ? (angular.forEach(
                  W.mobileManagerState.connectedDevices,
                  function (e) {
                    t.device === e.id && (W.mobileUploadState.device = e.name);
                  },
                ),
                (W.mobileUploadState.token =
                  "ui_browse_mobile_transcoder_progress_title"))
              : (W.mobileUploadState.token =
                  "ui_browse_mobile_transcoder_progress_title_export"));
        });
        function Yt() {
          return (
            angular.isString(W.selectedMonitor && W.selectedMonitor.location) &&
            angular.isObject(W.currentSelection)
          );
        }
        function Xt(e) {
          var a = {};
          return (
            angular.forEach(e, function (e, t) {
              a[t] = e.value;
            }),
            a
          );
        }
        function Jt(a) {
          var i,
            e = {
              file: W.currentSelection.file,
              location: W.selectedMonitor.location,
              properties:
                ((e = W.currentSelection.defaultproperties),
                (t = a),
                (i = angular.copy(e || {})),
                angular.forEach(t, function (e, t) {
                  ((i[t] = i[t] || {}), (i[t].value = e));
                }),
                i),
            },
            t =
              (j.callDeferred(
                "browseWallpaperObject",
                "applySingleProperty",
                angular.toJson(e),
              ),
              W.currentSelection.properties[W.selectedMonitor.location]);
          angular.forEach(t, function (e, t) {
            angular.isDefined(a[t]) && (e.value = a[t]);
          });
        }
        function Zt(t) {
          function e() {
            j.callDeferred("browseWallpaperObject", "saveWallpaperPresets", {
              file: t.file,
              presets: JSON.clean(t.propertyPresets),
            });
          }
          var a = D.when();
          return (a = angular.isArray(t.propertyPresets)
            ? a
            : j
                .callDeferred("browseWallpaperObject", "getWallpaperPresets", {
                  file: t.file,
                })
                .then(function (e) {
                  t.propertyPresets = e.presets;
                })).then(function () {
            return F.open("browseCollections", {
              data: {
                type: "presets",
                isSaving: !1,
                collection: t.propertyPresets,
                onDeleted: e,
              },
            });
          });
        }
        ((W.isMobileTranscoderAvailable = function () {
          return Kt;
        }),
          (W.onMobileTranscoderAvailable = function () {
            Kt = !0;
          }),
          (W.promptAcceptNewAgreement = function (e) {
            W.showWorkshopAgreementUpdate = e;
          }),
          (W.openWorkshopAgreementURL = function () {
            window.ui.shellexecute(V.getWorkshopAgreementURL());
          }),
          (W.hideWorkshopAgreementPrompt = function () {
            W.showWorkshopAgreementUpdate = !1;
          }),
          (W.callbackOk = function (e) {
            if (W.currentSelection && (W.currentSelection.status === "installed" || W.currentSelection.local)) {
              l(W.currentSelection);
            }
            snapshotAppliedConfig();
            e
              ? "downloadable" === (W.currentSelection && W.currentSelection.status)
                ? W.subscribeWorkshopItem(W.currentSelection)
                : (W.currentSelection && W.currentSelection.status) !== "installed" ||
                  fe ||
                  j.callDeferred("browseWallpaperObject", "acceptAndClose")
              : j.callDeferred("browseWallpaperObject", "acceptAndClose");
          }),
          (W.callbackClose = function () {
            j.callDeferred("browseWallpaperObject", "cancelAndClose");
          }),
          (W.callbackSelectMonitor = function (e, t) {
            (0 === W.wallpaperConfig.layout && w(e),
              t && W.toggleMonitorSelection());
          }),
          (W.callbackPropertyLabelClicked = function (e) {
            "bool" === e.type &&
              ((e.value = !e.value),
              W.callbackWallpaperPropertyChanged(e.key, e));
          }),
          (W.callbackWallpaperPropertyChangedSlider = function (e, t) {
            J[e] !== t.value &&
              ((J[e] = t.value), W.callbackWallpaperPropertyChanged(e, t));
          }),
          (W.callbackWallpaperPropertyChanged = function (e, t) {
            var a;
            Z ||
              (angular.isString(W.selectedMonitor.location) &&
                ((t = angular.copy(t)),
                ((a = {
                  file: W.currentSelection.file,
                  location: W.selectedMonitor.location,
                  properties: {},
                }).properties[e] = t),
                j.callDeferred(
                  "browseWallpaperObject",
                  "applySingleProperty",
                  angular.toJson(a),
                )));
          }),
          (W.isPropertyLabelVisible = function (e) {
            return (
              (e && "volume" !== e.type) ||
              W.isVolumeEnabled(W.selectedMonitor.location)
            );
          }),
          (W.isVolumeEnabled = function (e) {
            return (
              W.generalUserSettings &&
              W.userMonitorSettings &&
              W.generalUserSettings.videoaudiooutput &&
              (!angular.isObject(W.userMonitorSettings[e]) ||
                W.userMonitorSettings[e].videoaudiooutput)
            );
          }),
          (W.getVolumeDisabledText = function (e) {
            return W.userMonitorSettings &&
              angular.isObject(W.userMonitorSettings[e]) &&
              !W.userMonitorSettings[e].videoaudiooutput
              ? "ui_browse_properties_volume_disabled_monitor"
              : "ui_browse_properties_volume_disabled";
          }),
          (W.openMuteHelper = function (e) {
            W.userMonitorSettings &&
            angular.isObject(W.userMonitorSettings[e]) &&
            !W.userMonitorSettings[e].videoaudiooutput
              ? W.toggleMonitorSelection()
              : W.callbackShowSettings();
          }),
          (W.callbackResetCurrentWallpaperProperties = function () {
            Yt() &&
              F.open("genericConfirm", {
                data: {
                  title: "ui_browse_details_properties_reset_prompt_header",
                  message: "ui_browse_details_properties_reset_prompt_body",
                  okVisible: !0,
                  cancelVisible: !0,
                },
              }).then(function () {
                ((W.currentSelection.properties[W.selectedMonitor.location] =
                  angular.copy(W.currentSelection.defaultproperties)),
                  angular.forEach(
                    W.currentSelection.properties[W.selectedMonitor.location],
                    function (e, t) {
                      W.callbackWallpaperPropertyChanged(t, e);
                    },
                  ),
                  j.callDeferred(
                    "browseWallpaperObject",
                    "resetWallpaperLocalStorage",
                    W.currentSelection.file,
                  ),
                  Gt());
              });
          }),
          (W.callbackSaveWallpaperProperties = function () {
            Yt() &&
              F.open("browseCollections", {
                data: {
                  isSaving: !0,
                  type: "presets",
                  collection: W.currentSelection.propertyPresets || [],
                },
              }).then(function (t) {
                W.currentSelection.propertyPresets =
                  W.currentSelection.propertyPresets || [];
                var e = W.currentSelection.propertyPresets.find(function (e) {
                  return e.name === t.name;
                });
                (angular.isObject(e)
                  ? angular.merge(
                      e.properties,
                      Xt(
                        W.currentSelection.properties[
                          W.selectedMonitor.location
                        ],
                      ),
                    )
                  : ((e = {
                      name: t.name,
                      properties: Xt(
                        W.currentSelection.properties[
                          W.selectedMonitor.location
                        ],
                      ),
                    }),
                    W.currentSelection.propertyPresets.push(e)),
                  j.callDeferred(
                    "browseWallpaperObject",
                    "saveWallpaperPresets",
                    {
                      file: W.currentSelection.file,
                      presets: JSON.clean(W.currentSelection.propertyPresets),
                    },
                  ));
              });
          }),
          (W.callbackLoadWallpaperProperties = function () {
            Yt() &&
              Zt(W.currentSelection).then(function (e) {
                Jt(e.properties);
              });
          }),
          (W.callbackShareWallpaperProperties = function () {
            var t;
            Yt() &&
              ((t = Xt(
                W.currentSelection.properties[W.selectedMonitor.location],
              )),
              F.open("browseWallpaperSharePreset", {
                data: { preset: t },
              }).then(function (e) {
                angular.isObject(e) && !angular.equals(t, e) && Jt(e);
              }));
          }),
          (W.callbackSavePropertiesAsDefaults = function (e) {
            var a = H(!0);
            F.open("browseSetDefaults", {
              data: { properties: e, selectionCount: a.length },
            }).then(function (e) {
              var t = {
                properties: {},
                mode: e.mode,
                wallpapers: a.map(function (e) {
                  return e.file;
                }),
                monitors: W.monitors.map(function (e) {
                  return e.location;
                }),
              };
              (angular.forEach(e.options, function (e) {
                e.enabled && (t.properties[e.key] = e.value);
              }),
                j.callDeferred(
                  "browseWallpaperObject",
                  "setPropertyDefaults",
                  t,
                ));
            });
          }),
          (W.callbackShowSettings = function () {
            j.callDeferred("browseWallpaperObject", "showSettingsDialog");
          }),
          (W.callbackShowEditor = function () {
            j.callDeferred("browseWallpaperObject", "showEditorDialog");
          }),
          (W.callbackUnsubscribeOrRemove = function (e) {
            Ye(e, !0);
          }),
          (W.callbackOpenInEditor = function (e) {
            j.callDeferred("browseWallpaperObject", "openInEditor", e.file);
          }),
          (W.isPropertyFileValueSet = function (e, t) {
            return e.value && (!t || e.value !== t.value);
          }),
          (W.callbackSelectFileForProperty = function (t, e) {
            "usershortcut" === e
              ? F.open("browseAssignUserShortcut", {
                  data: { name: O.instant(t.text).toString(), value: t.value },
                }).then(function (e) {
                  ((t.value = e), W.callbackWallpaperPropertyChanged(t.key, t));
                })
              : j
                  .callDeferred(
                    "browseWallpaperObject",
                    "selectFileForProperty",
                    e,
                    t.fileType || "",
                  )
                  .then(function (e) {
                    e &&
                      ((t.value = e),
                      W.callbackWallpaperPropertyChanged(t.key, t));
                  });
          }),
          (W.callbackRemoveFileForProperty = function (e, t) {
            (t && angular.isString(t.value) && t.value
              ? (e.value = t.value)
              : (e.value = ""),
              W.callbackWallpaperPropertyChanged(e.key, e));
          }),
          (W.callbackOpenDirectory = function (e) {
            angular.isString(e) &&
              j.callDeferred("browseWallpaperObject", "openDirectory", e);
          }));
        var ea = T.$new(!0),
          ta =
            ((ea.checkPositionVisibility = function () {
              var e =
                W.selectedMonitor &&
                W.selectedMonitor.location &&
                W.currentSelection.properties[W.selectedMonitor.location];
              return (
                e &&
                e.alignment &&
                e.alignment.value < 2 &&
                (W.selectedMonitor.isGroup ||
                  !W.currentSelection.aspect ||
                  0.001 <
                    Math.abs(
                      W.currentSelection.aspect -
                        W.selectedMonitor.w / W.selectedMonitor.h,
                    ))
              );
            }),
            {
              $eval: ea.$eval,
              checkPositionVisibility: ea.checkPositionVisibility,
            }),
          f =
            ((W.evalCondition = function (e) {
              return (
                W.selectedMonitor &&
                W.selectedMonitor.location &&
                W.currentSelection &&
                W.currentSelection.properties &&
                ta.$eval(
                  e,
                  W.currentSelection.properties[W.selectedMonitor.location],
                )
              );
            }),
            (W.callbackClickSteamStatus = function () {
              angular.isObject(W.steamWorkshopStatus) &&
                W.steamWorkshopStatus.error &&
                V.showSteamError();
            }),
            (W.callbackResetFilter = function () {
              var t, e, sourceKey = W.sourceIsWorkshop ? "workshop" : "installed";
              if (!W.sourceIsWorkshop && !W.sourceIsInstalled) return;
              W.filterHelperBySource[sourceKey] = createFilterHelper();
              W.filterHelper = W.filterHelperBySource[sourceKey];
              if (W.filter) W.filter.text = "";
              if (W.sourceIsWorkshop) {
                if (W.filterAuthor) delete W.filterAuthor.authorSteamId;
                if (W.filterPreset) delete W.filterPreset.workshopid;
              } else if (W.sourceIsInstalled && W.filterAuthor) {
                delete W.filterAuthor.installedAuthor;
              }
              W.sourceIsExplore ||
                (angular.merge(W.filterTemp, we()),
                (W.filter = Ce(W.source)),
                (W.filterProxy.ratingtags = angular.copy(W.filter.ratingtags)),
                W.sourceIsWorkshop
                  ? ((t = W.filter),
                    (e = W.browserSettings.defaultfilterconfig),
                    angular.isObject(t.tags) &&
                      V.canUseFilterSettings() &&
                      angular.forEach(xe(e), function (e) {
                        t.tags[e] = !1;
                      }),
                    Ee(W.filter, W.browserSettings.defaultfilterconfig),
                    (b = W.filter),
                    (ge.current = 1),
                    P())
                  : W.sourceIsInstalled && ((h = W.filter), (u.current = 1), z()));
            }),
            (W.canUseAgeRatingTags = V.canUseAgeRatingTags),
            (W.callbackToggleResolutionFilter = function (e, t, a) {
              var i, n;
              switch ((e.preventDefault(), e.stopPropagation(), t)) {
                case 0:
                  ((i = 0), (n = 6));
                  break;
                case 1:
                  ((i = 6), (n = 9));
                  break;
                case 2:
                  ((i = 9), (n = 13));
                  break;
                case 3:
                  ((i = 13), (n = 18));
                  break;
                case 4:
                  ((i = 18), (n = 23));
              }
              for (var o = i; o < n; ++o) {
                var r = W.filterResolutionTags[o];
                W.filter.resolutiontags[r.value] = a;
              }
            }),
            (W.callbackToggleGenreFilter = function (e, t) {
              (e.preventDefault(),
                e.stopPropagation(),
                angular.forEach(W.filterAllTags, function (e) {
                  "Unspecified" === e.value && W.sourceIsWorkshop
                    ? (W.filter.tags[e.value] = !1)
                    : (W.filter.tags[e.value] = t);
                }));
            }),
            {}),
          s = {},
          S = {},
          aa = {},
          ia = {},
          C = {},
          na = D.when(),
          oa = !0,
          ra = !0,
          E = {};
        function sa() {
          return angular.isString(W.exploreNavigation[0].key)
            ? s[W.exploreNavigation[0].key]
            : [];
        }
        function la(e) {
          return (
            W.browserSettings.explore &&
            W.browserSettings.explore.disliked.includes(e.name)
          );
        }
        function ca(e) {
          return (
            W.browserSettings.explore &&
            W.browserSettings.explore.liked.includes(e.name)
          );
        }
        function da() {
          var t = 0,
            e =
              (angular.forEach(W.sortedExploreQueries, function (e) {
                (e.loading || e.showError) && ++t;
              }),
              W.exploreNavigation[0].key);
          e && 0 === t && (ia[e] <= 0 && (ia[e] = 5), W.refreshExplore());
        }
        function pa(t) {}
        ((W.isExploreHomepage = function () {
          return (
            W.sourceIsExplore && angular.isString(W.exploreNavigation[0].key)
          );
        }),
          (W.getExploreQueryFromSelection = function () {
            var t;
            return (
              angular.forEach(W.sortedExploreQueries, function (e) {
                0 <=
                  (e.wallpapers && e.wallpapers.indexOf(W.currentSelection)) &&
                  (t = e);
              }),
              t
            );
          }));
        var ua,
          ga,
          fa,
          ma = 0;
        function va(e) {
          var t = sa(),
            a = (t.findAndRemove(e), W.exploreNavigation[0].key);
          if (a)
            if (0 === t.length) ((s[a] = aa[a]), (aa[a] = []));
            else
              for (; 25 < W.sortedExploreQueries.length;) {
                for (
                  var i, n = !1, o = 0;
                  o < W.sortedExploreQueries.length;
                  ++o
                ) {
                  if (
                    (delete W.sortedExploreQueries[o].class,
                    !W.sortedExploreQueries[o].sticky)
                  ) {
                    (aa[a].push(W.sortedExploreQueries[o]),
                      W.sortedExploreQueries.splice(o, 1),
                      (n = !0),
                      (i.class = "exploreStickyQuery"));
                    break;
                  }
                  i = W.sortedExploreQueries[o];
                }
                if (!n) break;
              }
          (W.sortedExploreQueries.push(e), W.performExploreQuery(e));
        }
        function ha(e, t) {
          if ((f[t].push(e), S[t].empty())) s[t].push(e);
          else {
            for (var a = !1, i = 0; i < S[t].length; ++i)
              if ((S[t][i].priority || 0) < (e.priority || 0)) {
                (S[t].splice(i, 0, e), W.performExploreQuery(e), (a = !0));
                break;
              }
            a || s[t].push(e);
          }
        }
        function ba(e) {
          return (
            (e = angular.isArray(e) ? e : [e])
              .filter(function (e) {
                return e;
              })
              .map(function (e) {
                switch (
                  ((e.tags = e.tags || ["None"]),
                  (e.querytypes = e.querytypes || []),
                  (e.includetags = e.includetags || []),
                  (e.excludetags = e.excludetags || []),
                  angular.isNumber(e.weight)
                    ? (e.weight = Math.floor(e.weight))
                    : (e.weight = 1),
                  la(e)
                    ? (e.currentPriority = 0)
                    : (e.currentPriority = e.priority || 0),
                  V.updateQueryName(e),
                  e.category)
                ) {
                  case "genre":
                    e.title =
                      e.title ||
                      ("trend_year" === e.querytype ||
                      "top_rated" === e.querytype
                        ? "ui_browse_explore_category_genre_popular"
                        : "trend_month" === e.querytype
                          ? "ui_browse_explore_category_genre_recent_month"
                          : "trend_week" === e.querytype
                            ? "ui_browse_explore_category_genre_recent"
                            : "subscriptions" === e.querytype
                              ? "ui_browse_explore_category_genre_most_subscribed"
                              : "ui_browse_explore_category_genre_new");
                    break;
                  case "creator":
                    angular.isArray(e.includetags) && 0 < e.includetags.length
                      ? (e.title =
                          "published_desc" === e.querytype
                            ? "ui_browse_explore_category_creator_genre_recent"
                            : "ui_browse_explore_category_creator_genre_popular")
                      : (e.title =
                          "published_desc" === e.querytype
                            ? "ui_browse_explore_category_creator_recent"
                            : "ui_browse_explore_category_creator_popular");
                    break;
                  case "collection":
                    e.title =
                      e.title || "ui_browse_explore_category_collection";
                    break;
                  case "keyword":
                    e.title =
                      "trend_year" === e.querytype ||
                      "top_rated" === e.querytype
                        ? "ui_browse_explore_category_keyword_popular"
                        : "trend_week" === e.querytype
                          ? "ui_browse_explore_category_keyword_recent"
                          : "subscriptions" === e.querytype
                            ? "ui_browse_explore_category_keyword_most_subscribed"
                            : "ui_browse_explore_category_keyword_new";
                }
                return e;
              }),
            e
          );
        }
        function _a() {
          var o, e;
          W.sourceIsExplore &&
            ((na = D.when()),
            (f = {
              home: ba(V.getStaticExploreQueries()),
              favorites: [],
              disliked: [],
              highlights: [],
            }),
            (s = { home: angular.copy(f.home), favorites: [], disliked: [] }),
            (S = { home: [], favorites: [], disliked: [] }),
            (aa = { home: [], favorites: [], disliked: [] }),
            (E = {}),
            (r.visible = !1),
            (r.current = 1),
            (ia = { home: 5, favorites: 5, disliked: 5 }),
            (W.exploreNavigation = [{ title: "", key: "home" }]),
            (W.sortedWallpapers = []),
            (W.sortedFolders = []),
            (W.sortedExploreQueries = S.home),
            (o = V.getSeasonalCollections()),
            angular.forEach(o, function (e) {
              f.home.push(e);
            }),
            W.browserSettings.explore &&
              (ba(
                (e = angular
                  .copy(W.browserSettings.explore.custom)
                  .map(function (e) {
                    return ((e.custom = !0), e);
                  })),
              ),
              (f.favorites = s.favorites.concat(e)),
              (s.favorites = f.favorites.slice())),
            V.canUseDiscover()
              ? ((ua = m(da, 5e3)),
                j
                  .wpxAPIGet("/api/explore/v1")
                  .then(function (e) {
                    m.cancel(ua);
                    var i,
                      t,
                      a,
                      n,
                      e =
                        e && e.data && e.data.response && e.data.response.items;
                    (angular.isArray(e) &&
                      ((i = []),
                      (t = {
                        name: "app_highlights_creators",
                        querytype: "most_recent",
                        category: "highlight",
                        tags: ["Approved"],
                        includetags: ["Approved"],
                        excludetags: [],
                        items: [],
                        summaryItems: [],
                        emoji: "✨",
                        title:
                          "ui_browse_explore_category_highlighted_creators",
                        priority: 0.8,
                        isBackendQuery: !0,
                        wtTag: "homeHighlights",
                        sticky: !0,
                      }),
                      (a = {
                        name: "app_highlights_collections",
                        querytype: "most_recent",
                        category: "highlight",
                        tags: ["Approved"],
                        includetags: ["Approved"],
                        excludetags: [],
                        items: [],
                        summaryItems: [],
                        emoji: "✨",
                        title:
                          "ui_browse_explore_category_highlighted_collections",
                        priority: 0.25,
                        isBackendQuery: !0,
                        wtTag: "homeHighlights",
                        sticky: !0,
                      }),
                      (n = function (e) {
                        e.sticky
                          ? ha(e, "home")
                          : angular.isDefined(e.coversubmission) &&
                            (V.updateQueryName(e),
                            ("collection" === e.category ? a : t).items.push(
                              e,
                            ));
                      }),
                      angular.forEach(e, function (a) {
                        angular.isObject(a) &&
                          angular.isString(a.category) &&
                          ((angular.isObject(a.platforms) &&
                            !a.platforms[V.getProvider()]) ||
                            ((a.isBackendQuery = !0),
                            "creator" === a.category
                              ? angular.forEach(a.querytypes, function (e) {
                                  var t = angular.copy(a);
                                  (delete t.querytypes,
                                    (t.querytype = e),
                                    n(t));
                                })
                              : "collection" === a.category
                                ? n(a)
                                : angular.forEach(a.querytypes, function (e) {
                                    var t = angular.copy(a);
                                    (delete t.querytypes,
                                      (t.querytype = e),
                                      i.push(t));
                                  })));
                      }),
                      0 < a.items.length &&
                        (f.home.findAndRemoveMultiple(o),
                        W.sortedExploreQueries.findAndRemoveMultiple(o),
                        angular.forEach(o, function (e) {
                          e.sticky ? ha(e, "home") : a.items.push(e);
                        }),
                        (a.items = a.items.concat(V.getBestOfYearQueries(!0)))),
                      (e = function (e) {
                        0 < e.items.length &&
                          (e.items.shuffle(),
                          ba(e.items),
                          (e.summaryItems = e.items.slice(0, 20)),
                          ha(e, "home"),
                          (f.highlights = f.highlights.concat(e.items)));
                      })(t),
                      e(a),
                      ba(i),
                      angular.forEach(i, function (e) {
                        angular.isObject(e) && (f.home.push(e), s.home.push(e));
                      })),
                      da());
                  })
                  .catch(function () {
                    (m.cancel(ua), da());
                  }))
              : W.refreshExplore());
        }
        function ya() {
          ((W.sortedWallpapers = []), (r.visible = !1), (r.current = 1));
        }
        ((W.performExploreQuery = function (i, t) {
          if (W.sourceIsExplore)
            if (
              "collection" !== i.category ||
              V.canUseCollectionsInDiscover()
            ) {
              "creator" === i.category &&
                angular.isUndefined(W.steamUserInfos[i.itemid]) &&
                j.callDeferred(
                  "ui",
                  "pollSteamUserInfo",
                  i.itemid,
                  "browseWallpapersCtrl",
                );
              var s = {
                sort: i.querytype,
                category: i.category,
                text: i.keyword,
                requiredTags:
                  angular.isArray(i.includetags) &&
                  i.includetags.concat(["Wallpaper", "Everyone"]),
                excludedTags: i.excludetags,
                requiredTagGroups: i.requiredtaggroups,
                limit: t ? 0 : 20,
                page: r.current,
                token: ++ae,
                fullQueryToken: ++ma,
                isusingbackup: W.isUsingBackup,
              };
              switch ((i.exact && (s.text = '"' + s.text + '"'), i.category)) {
                case "creator":
                case "collection":
                  ((s.itemid = i.itemid), (s.randomize = !t));
                  break;
                case "keyword":
                  s.searchText = i.keyword;
                  break;
                case "misc":
                  delete s.text;
                  break;
                case "highlight":
                  s.items = t ? i.items : i.summaryItems;
                  break;
                case "top_year":
                  ((s.timestampstart = i.timestampstart),
                    (s.timestampend = i.timestampend));
              }
              t
                ? ((W.sortedWallpapers = []),
                  (W.queryActive = !0),
                  (W.showErrorInBackground = !1),
                  (r.query = i))
                : ((i.wallpapers = []),
                  (i.loading = !0),
                  (i.showError = !1),
                  (s.page = 1));
              var n = function (e) {
                  ((i.loading = !1),
                    !W.sourceIsExplore ||
                      e.token !== s.token ||
                      (t && ae !== s.token) ||
                      (angular.isObject(e.collection) &&
                        (i.collection = e.collection),
                      (W.queryWallpapers = e.wallpapers),
                      st(),
                      "highlight" !== i.category && bt(W.queryWallpapers),
                      0 !== e.wallpapers.length ||
                        i.custom ||
                        W.sortedExploreQueries.findAndRemove(i),
                      We(e.isbackup),
                      t
                        ? ((W.queryActive = !1),
                          (W.sortedWallpapers = W.queryWallpapers),
                          V.updatePagination(r, s.page, e.pagecount),
                          (r.visible = 1 < e.pagecount))
                        : (W.queryWallpapers.shuffle(),
                          (i.wallpapers = W.queryWallpapers),
                          W.refreshExplore())));
                },
                e = na.then(function () {
                  var t,
                    a,
                    e =
                      "highlight" !== s.category
                        ? j.callDeferred(
                            "browseWallpaperObject",
                            "queryWorkshop",
                            s,
                          )
                        : ((t = []),
                          (a = []),
                          angular.forEach(s.items, function (e) {
                            ("creator" === e.category &&
                              angular.isUndefined(W.steamUserInfos[e.itemid]) &&
                              t.push(e.itemid),
                              angular.isString(e.coversubmission) &&
                                a.push(e.coversubmission),
                              "collection" === e.category && a.push(e.itemid));
                          }),
                          (s.itemids = a),
                          (s.disablesanitize = !0),
                          (s.limit = 0),
                          t.empty() ||
                            j.callDeferred(
                              "ui",
                              "pollSteamUserInfo",
                              t,
                              "browseWallpapersCtrl",
                            ),
                          j
                            .callDeferred(
                              "browseWallpaperObject",
                              "queryWorkshop",
                              s,
                            )
                            .then(function (e) {
                              var n = [],
                                o = {},
                                r =
                                  (e.wallpapers &&
                                    e.wallpapers.forEach((e) => {
                                      o[e.workshopid] = e;
                                    }),
                                  O.use());
                              return (
                                s.items.forEach(function (e) {
                                  var t =
                                      (e.translation && e.translation[r]) || "",
                                    a = o[e.coversubmission];
                                  if (angular.isObject(a)) {
                                    var i = {
                                      querytype: e.querytype,
                                      name: e.name,
                                      emoji: e.emoji,
                                      category: e.category,
                                      excludetags: e.excludetags,
                                      includetags: e.includetags,
                                      year: e.year,
                                      timestampstart: e.timestampstart,
                                      timestampend: e.timestampend,
                                      preview: a.previewsmall,
                                      previewsmall: a.previewsmall,
                                      status: "downloadable",
                                      updatedate: 0,
                                      title: t && 0 < t.length ? t : e.title,
                                      itemid: e.itemid,
                                      type: "highlightItem",
                                      translation: e.translation,
                                    };
                                    switch (e.category) {
                                      case "collection":
                                        i.queryTitle =
                                          o[e.itemid] && o[e.itemid].title;
                                        break;
                                      case "creator":
                                        i.titleoverride =
                                          "ui_browse_explore_category_creator_short";
                                    }
                                    n.push(i);
                                  }
                                }),
                                {
                                  isbackup: e.isbackup,
                                  pagecount: 1,
                                  token: e.token,
                                  wallpapers: n,
                                }
                              );
                            }));
                  return e.then(n).catch(function () {
                    (W.hasShownSteamServiceError ||
                      pa((W.hasShownSteamServiceError = !0)),
                      j.setCallErrorSuppressed("queryWorkshop", !0),
                      i.isBackendQuery
                        ? (W.sortedExploreQueries.findAndRemove(i),
                          (i.loading = !1),
                          (i.wallpapers = []),
                          W.refreshExplore())
                        : W.queryBackup(s)
                            .then(n)
                            .catch(function () {
                              ((i.loading = !1), (i.showError = !0));
                            }));
                  });
                });
              t || (na = e);
            } else
              ((i.wallpapers = []),
                (i.loading = !1),
                (i.showError = !1),
                W.sortedExploreQueries.findAndRemove(i),
                W.refreshExplore());
        }),
          (W.exploreScrollSentinelChanged = function (e) {
            (oa = e) && da();
          }),
          (W.refreshExplore = function () {
            if (W.sourceIsExplore && ra) {
              var t,
                a,
                e = W.exploreNavigation[0].key,
                i = e ? ia[e] : 0;
              if ((e && oa && i < 1 && (i = ia[e] = 1), e && 0 < i)) {
                var n,
                  o = sa();
                if ("home" === e)
                  (ba(o),
                    0 !== o.length &&
                      ((C = {
                        tagCounts: {},
                        categoryCounts: {},
                        maxTagCount: {},
                        categoryMaxCounts: {},
                      }),
                      angular.forEach(S.home, function (e) {
                        (angular.forEach(e.tags, function (e) {
                          angular.isNumber(C.tagCounts[e])
                            ? ++C.tagCounts[e]
                            : (C.tagCounts[e] = 1);
                        }),
                          angular.isNumber(C.categoryCounts[e.category])
                            ? ++C.categoryCounts[e.category]
                            : (C.categoryCounts[e.category] = 1));
                      }),
                      angular.forEach(f.home, function (e) {
                        (angular.forEach(e.tags, function (e) {
                          angular.isNumber(C.maxTagCount[e])
                            ? ++C.maxTagCount[e]
                            : (C.maxTagCount[e] = 1);
                        }),
                          angular.isNumber(C.categoryMaxCounts[e.category])
                            ? ++C.categoryMaxCounts[e.category]
                            : (C.categoryMaxCounts[e.category] = 1));
                      }),
                      angular.forEach(f.home, function (e) {
                        var t = ca(e),
                          a = la(e),
                          i = t ? 1 : a ? -1 : 0;
                        0 != i &&
                          angular.forEach(e.tags, function (e) {
                            angular.isNumber(C[e]) ? (C[e] += i) : (C[e] = i);
                          });
                      }),
                      (a = t = 0),
                      angular.forEach(C, function (e) {
                        (e < 0 && (t = Math.min(t, e)),
                          0 < e && (a = Math.max(a, e)));
                      }),
                      (t = Math.min(-1, t)),
                      (a = Math.max(1, a)),
                      (C.mins = t),
                      (C.maxs = a),
                      o.shuffle(),
                      angular.forEach(o, function (a) {
                        e = a;
                        var t,
                          i,
                          n,
                          e = angular.isNumber(C.categoryCounts[e.category])
                            ? 0.9 *
                                (1 -
                                  C.categoryCounts[e.category] /
                                    C.categoryMaxCounts[e.category]) +
                              0.1
                            : 1,
                          o =
                            ((t = 1),
                            angular.forEach(a.tags, function (e) {
                              angular.isNumber(C.tagCounts[e]) &&
                                ((e = 1 - C.tagCounts[e] / C.maxTagCount[e]),
                                (t = Math.min(e, t)));
                            }),
                            0.9 * t + 0.1),
                          r =
                            ((r = a),
                            (i = 1),
                            angular.forEach(r.tags, function (e) {
                              angular.isNumber(C[e]) && (i += C[e]);
                            }),
                            (i = (i - C.mins) / (C.maxs - C.mins)),
                            la(r) && (i = 0),
                            Math.easeInOutQuad(i) * (ca(r) ? 1.9 : 2));
                        ((a.currentWeight = Math.log(1 + r * (o + e))),
                          la(a) ||
                            (angular.isNumber(a.priority)
                              ? (a.currentWeight += a.priority)
                              : ((n = !1),
                                angular.forEach(a.tags, function (e) {
                                  var t;
                                  angular.isNumber(E[e]) &&
                                    ((t = Math.pow(
                                      Math.clamp(E[e] - 3, 0, 4) / 4,
                                      2,
                                    )),
                                    Math.random() < t) &&
                                    ((a.currentWeight = 999),
                                    (E[e] = 0),
                                    (n = !0));
                                }),
                                n &&
                                  angular.forEach(
                                    angular.copy(E),
                                    function (e, t) {
                                      E[t] = 0.21 * e;
                                    },
                                  ))));
                      }),
                      o.sort(function (e, t) {
                        return e.currentPriority !== t.currentPriority
                          ? t.currentPriority - e.currentPriority
                          : t.currentWeight - e.currentWeight;
                      }),
                      (n = o[0]),
                      (i = V.getAvailableTags()),
                      angular.forEach(i, function (e) {
                        n.tags.includes(e)
                          ? (E[e] = 0)
                          : (!angular.isNumber(C[e]) || 0 <= C[e]) &&
                            (angular.isNumber(E[e]) ? ++E[e] : (E[e] = 1));
                      }),
                      va(n),
                      --ia[e]));
                else if (W.browserSettings.explore) {
                  for (
                    var r =
                        "favorites" === e
                          ? W.browserSettings.explore.favorites
                          : W.browserSettings.explore.disliked,
                      s = r.length - 1;
                    0 <= s;
                    --s
                  ) {
                    var l,
                      c = r[s],
                      d = function (e) {
                        return e.name === c;
                      };
                    !f[e].find(d) &&
                      ((l = f.home.find(d)),
                      (l = angular.isObject(l) ? l : f.highlights.find(d))) &&
                      (f[e].push(l), o.push(l));
                  }
                  (ba(o),
                    0 !== o.length &&
                      (o.sort(function (e, t) {
                        return e.currentPriority !== t.currentPriority
                          ? t.currentPriority - e.currentPriority
                          : t.currentWeight - e.currentWeight;
                      }),
                      va(o[0]),
                      --ia[e]));
                }
              }
            }
          }),
          (W.navigateCurrentExplorePage = function () {
            ya();
            var e = W.exploreNavigation[0];
            1 === W.exploreNavigation.length
              ? (e.key
                  ? ((W.sortedExploreQueries = S[e.key]),
                    W.sortedExploreQueries.length < 5 && (ia[e.key] = 5))
                  : (W.sortedExploreQueries = []),
                angular.frameTimeout(m, 2, W.refreshExplore))
              : e.key
                ? "wallpaperfavorites" === e.key
                  ? (delete e.key,
                    (W.sortedExploreQueries = []),
                    W.performExploreQuery(e, !0))
                  : ((W.sortedExploreQueries = []),
                    (S[e.key] = []),
                    (s[e.key] = f[e.key].slice()),
                    s[e.key].push({
                      category: "misc",
                      querytype: "followers_created",
                      title: "ui_browse_explore_category_followed",
                      tags: ["Misc"],
                      priority: 99,
                    }),
                    angular.frameTimeout(m, 2, da))
                : ((W.sortedExploreQueries = []), W.performExploreQuery(e, !0));
          }),
          (W.pushExplorePage = function (e) {
            W.pushNavigationHistory({
              source: "explore",
              stack: W.exploreNavigation.slice(),
            });
            var t = W.exploreNavigation[0].key,
              a = (t && (S[t] = W.sortedExploreQueries), !1);
            switch (e.key) {
              case "favorites":
                e.title = "ui_browse_explore_followed_content";
                break;
              case "wallpaperfavorites":
                ((e.title = "ui_browse_explore_favorites"),
                  (e.querytype = "my_favorites"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
                break;
              case "followers_created":
                ((e.title = "ui_browse_explore_followed_users"),
                  (e.querytype = "followers_created"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
                break;
              case "voted_up":
                ((e.title = "ui_browse_explore_category_user_up_voted"),
                  (e.querytype = "voted_up"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
                break;
              case "created_by_user":
                ((e.title = "ui_browse_explore_category_user_created"),
                  (e.querytype = "created_by_user"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
                break;
              case "friends_created":
                ((e.title = "ui_browse_explore_category_friends_created"),
                  (e.querytype = "friends_created"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
                break;
              case "friends_favorites":
                ((e.title = "ui_browse_explore_category_friends_favorites"),
                  (e.querytype = "friends_favorites"),
                  (e.category = "misc"),
                  (a = e.noicons = !0));
            }
            (ya(),
              W.exploreNavigation.unshift(e),
              e.key
                ? a
                  ? (delete e.key,
                    (W.sortedExploreQueries = []),
                    W.performExploreQuery(e, !0))
                  : ((W.sortedExploreQueries = []),
                    (S[e.key] = []),
                    (s[e.key] = f[e.key].slice()),
                    s[e.key].push({
                      category: "misc",
                      querytype: "followers_created",
                      title: "ui_browse_explore_category_followed",
                      tags: ["Misc"],
                      priority: 99,
                    }),
                    angular.frameTimeout(m, 2, da))
                : ((W.sortedExploreQueries = []),
                  W.performExploreQuery(e, !0)));
          }),
          (W.popExplorePage = function () {
            (W.pushNavigationHistory({
              source: "explore",
              stack: W.exploreNavigation.slice(),
            }),
              1 < W.exploreNavigation.length &&
                (W.exploreNavigation.shift(), W.navigateCurrentExplorePage()));
          }),
          (W.addExploreCustomFavoriteQuery = function () {
            F.open("browseExploreCreateQuery", {
              data: { isEditing: !1, query: { category: "keyword" } },
            }).then(function (e) {
              (console.log("create query", e),
                W.browserSettings.explore.custom.push(angular.copy(e)),
                (e.custom = !0),
                ba(e),
                f.favorites.push(e),
                W.sortedExploreQueries.unshift(e),
                W.performExploreQuery(e));
            });
          }),
          (W.exploreCustomRemoveCallback = function (t) {
            ((W.browserSettings.explore.custom =
              W.browserSettings.explore.custom.filter(function (e) {
                if (
                  e.category !== t.category ||
                  e.querytype !== t.querytype ||
                  ("keyword" === e.category && e.keyword !== t.keyword) ||
                  ("creator" === e.category && e.itemid !== t.itemid) ||
                  ("collection" === e.category && e.itemid !== t.itemid)
                )
                  return !0;
              })),
              W.sortedExploreQueries.findAndRemove(t),
              f.favorites.findAndRemove(t),
              S.favorites.findAndRemove(t),
              t === W.exploreNavigation[0] && W.popExplorePage());
          }),
          (W.exploreLikedCallback = function (e, t, a) {
            angular.isDefined(e)
              ? (e
                  ? (W.browserSettings.explore.liked.includes(a.name)
                      ? W.browserSettings.explore.liked.findAndRemove(a.name)
                      : W.browserSettings.explore.liked.push(a.name),
                    W.browserSettings.explore.disliked.findAndRemove(a.name))
                  : (W.browserSettings.explore.liked.findAndRemove(a.name),
                    W.browserSettings.explore.disliked.includes(a.name)
                      ? W.browserSettings.explore.disliked.findAndRemove(a.name)
                      : W.browserSettings.explore.disliked.push(a.name)),
                (W.browserSettings.explore.hasLikedAny = !0))
              : angular.isDefined(t) &&
                (t
                  ? W.browserSettings.explore.favorites.push(a.name)
                  : W.browserSettings.explore.favorites.findAndRemove(a.name));
          }),
          (W.openExplorePersonalizedContentDropdown = function (e, t) {
            if (!t) {
              if (((fa = !1), ga && B.getCurrentContextMenu() === ga)) return;
              fa = !0;
            }
            fa &&
              (ga = B.builder()
                .button("ui_browse_explore_followed_content", function () {
                  W.pushExplorePage({ key: "favorites" });
                })
                .button("ui_browse_explore_favorites", function () {
                  W.pushExplorePage({ key: "wallpaperfavorites" });
                })
                .button("ui_browse_explore_your_upvotes", function () {
                  W.pushExplorePage({ key: "voted_up" });
                })
                .button("ui_browse_explore_your_wallpapers", function () {
                  W.pushExplorePage({ key: "created_by_user" });
                })
                .divider()
                .button("ui_browse_explore_friends_favorites", function () {
                  W.pushExplorePage({ key: "friends_favorites" });
                })
                .button("ui_browse_explore_friends_created", function () {
                  W.pushExplorePage({ key: "friends_created" });
                })
                .open(W, e, { placement: { target: e.currentTarget } }));
          }));
        var wa = D.when(),
          ka = {},
          xa =
            ((W.queryBackup = function (t) {
              var a, i, e;
              return V.canUseBackup()
                ? ("relevance" === (t = angular.copy(t)).sort &&
                    (t.sort = "top_rated"),
                  [
                    "most_recent",
                    "most_up_votes",
                    "subscriptions",
                    "top_rated",
                    "trend_year",
                    "trend_month",
                    "trend_week",
                    "trend_day",
                    "relevance",
                  ].includes(t.sort)
                    ? ((a = {}),
                      angular.forEach(t, function (e, t) {
                        ((angular.isString(e) && 0 < e.length) ||
                          (angular.isArray(e) && 0 < e.length) ||
                          angular.isNumber(e)) &&
                          (a[t] = e);
                      }),
                      delete a.token,
                      (i = ""),
                      angular.forEach(a, function (e, t) {
                        if (
                          (0 !== i.length &&
                            (!angular.isArray(e) || 0 < e.length) &&
                            (i += "&"),
                          angular.isArray(e))
                        )
                          for (var a = 0; a < e.length; ++a)
                            ((i += t + "[" + a + "]" + "=" + e[a]),
                              a + 1 < e.length && (i += "&"));
                        else i += t + "=" + e;
                      }),
                      (e = function (e) {
                        if (
                          angular.isArray(
                            e &&
                              e.data &&
                              e.data.response &&
                              e.data.response.items,
                          )
                        )
                          return (
                            (ka[i] = e),
                            (W.backupDate = e.data.response.date),
                            (wa = wa.then(function () {
                              return j.callDeferred(
                                "browseWallpaperObject",
                                "convertWorkshopBackup",
                                t,
                                e.data.response.items,
                                e.data.response.totalpagecount || 1,
                              );
                            }))
                          );
                        (We(!1), D.reject());
                      }),
                      ka[i]
                        ? e(ka[i])
                        : j.wpxAPIGet("/api/backupquery/v1?" + i).then(e))
                    : D.when({
                        action: "queryMostPopular",
                        wallpapers: [],
                        token: t.token,
                        pagecount: 1,
                        isbackup: !0,
                      }))
                : D.reject();
            }),
            (W.searchHasSpaces = function () {
              return (
                angular.isString(W.filter.text) &&
                0 < W.filter.text.length &&
                W.filter.text.trim().includes(" ")
              );
            }),
            {}),
          Sa = 3;
        function P(t) {
          var e, i, n, a, o, r, s;
          W.sourceIsWorkshop &&
            ((e = angular.isString(W.filterPreset.workshopid)),
            (o = angular.isString(W.filterAuthor.authorSteamId)),
            (a = W.filter.text),
            W.filter.exactMatch &&
              angular.isString(a) &&
              0 < a.length &&
              !a.trim().includes('"') &&
              (a = '"' + a + '"'),
            (i = {
              requiredTags: [],
              excludedTags: [],
              sort: (o ? W.filterAuthor : W.filter).sort,
              text: a,
              preset: W.filterPreset.workshopid,
              itemid: W.filterAuthor.authorSteamId,
              page: ge.current,
              filterTitle: W.filter.filterTitle,
              token: ++ae,
              isusingbackup: W.isUsingBackup,
            }),
            (o = function (e, t) {
              var a = i.excludedTags.length - n;
              e <= a &&
                (i.excludedTags.splice(i.excludedTags.length - a, a),
                angular.isString(t)) &&
                i.excludedTags.push(t);
            }),
            (a = function () {
              n = i.excludedTags.length;
            })(),
            (function () {
              if (W.sourceIsWorkshop && W.filterHelper) {
                if (W.filterHelper.category) i.requiredTags.push(W.filterHelper.category);
                if (W.filterHelper.type_tag) i.requiredTags.push(W.filterHelper.type_tag);
                if (W.filterHelper.resolution) i.requiredTags.push(W.filterHelper.resolution);
                if (W.filterHelper.age_rating) i.requiredTags.push(W.filterHelper.age_rating);
                if (W.filterHelper.asset_type) i.requiredTags.push(W.filterHelper.asset_type);
                if (W.filterHelper.asset_genre) i.requiredTags.push(W.filterHelper.asset_genre);
                if (W.filterHelper.script_type) i.requiredTags.push(W.filterHelper.script_type);
                angular.forEach(W.filterHelper.misc_tags, function (t) {
                  if (!i.requiredTags.includes(t)) i.requiredTags.push(t);
                });
                angular.forEach(W.filterHelper.genre_tags, function (t) {
                  if (!i.requiredTags.includes(t)) i.requiredTags.push(t);
                });
                angular.forEach(W.filterHelper.excluded_misc_tags, function (t) {
                  if (!i.excludedTags.includes(t)) i.excludedTags.push(t);
                });
                angular.forEach(W.filterHelper.excluded_genre_tags, function (t) {
                  if (!i.excludedTags.includes(t)) i.excludedTags.push(t);
                });
                if (W.filterHelper.incompatible) {
                  i.incompatible = true;
                  i.required_flags = "incompatible";
                }
              } else {
                angular.forEach(W.filter.tags, function (e, t) {
                  e || i.excludedTags.push(t);
                });
                o(W.filterAllTags.length, "Unspecified");
                angular.forEach(W.filter.utilitytags, function (e, t) {
                  1 === e
                    ? i.requiredTags.push(t)
                    : 2 === e && i.excludedTags.push(t);
                });
                e ||
                  (a(),
                  angular.forEach(W.filter.categorytags, function (e, t) {
                    e || i.excludedTags.push(t);
                  }),
                  o(W.filterCategoryTags.length),
                  a(),
                  angular.forEach(W.filter.typetags, function (e, t) {
                    e || i.excludedTags.push(t);
                  }),
                  o(W.filterTypeTags.length),
                  a(),
                  angular.forEach(W.filter.resolutiontags, function (e, t) {
                    e || i.excludedTags.push(t);
                  }),
                  o(W.filterResolutionTags.length));
                a();
                angular.forEach(W.filter.ratingtags, function (e, t) {
                  e || i.excludedTags.push(t);
                });
                o(W.filterRatingTags.length);
              }
            })(),
            t &&
              t.forceAllowQuestionable &&
              i.excludedTags.findAndRemove("Questionable"),
            W.filterTemp.filterMobileCompatibleOnly &&
              (angular.forEach(["Application", "Web"], function (e) {
                i.excludedTags.includes(e) || i.excludedTags.push(e);
              }),
              (i.kvs = { app_workshop_eula_version: "3" })),
            (W.queryActive = !0),
            (W.showErrorInBackground = !1),
            (W.sortedWallpapers = []),
            (W.sortedFolders = []),
            (W.sortedExploreQueries = []),
            (r = function (e) {
              ((W.queryActive = !1),
                W.sourceIsWorkshop &&
                  (e.token !== i.token
                    ? P()
                    : (We(e.isbackup),
                      e.isbackup ||
                        j.setCallErrorSuppressed("queryWorkshop", !1),
                      (W.queryWallpapers = e.wallpapers),
                      (e.wallpapers && angular.isArray(e.wallpapers) && angular.forEach(e.wallpapers, function (item) {
                        if (item.authorsteamid && (item.author || item.author_avatar)) {
                          var u = W.steamUserInfos[item.authorsteamid] || {};
                          if (item.author) u.name = item.author;
                          if (item.author_avatar) u.avatar = item.author_avatar;
                          W.steamUserInfos[item.authorsteamid] = u;
                        }
                      })),
                      st(),
                      (W.sortedWallpapers = W.queryWallpapers),
                      W.sortedWallpapers.sort(lt),

                      bt(W.queryWallpapers),
                      V.updatePagination(ge, i.page, e.pagecount),
                      "queryMostPopular" === e.action && (W.filter.sort = me),
                      1 < ge.current && ge.current > e.pagecount
                        ? ((ge.current = e.pagecount), P())
                        : (e.wallpapers && !e.wallpapers.empty()) ||
                          !i.excludedTags.includes("Everyone") ||
                          !i.excludedTags.includes("Questionable") ||
                          (t && t.forceAllowQuestionable) ||
                          P({ forceAllowQuestionable: !0 }))));
            }),
            (xa.cancel = !0),
            (xa = { queryFailureCount: 0 }),
            (s = function () {
              if (!xa.cancel) {
                if (window.WengineHelper) {
                  return window.WengineHelper.browse(i)
                    .then(function (res) {
                      if (!xa.cancel) {
                        m(function () {
                          r(res);
                        });
                      }
                    })
                    .catch(function (err) {
                      console.warn("[WEngineHelper] Worker query failed, falling back to engine:", err);
                      j.setCallErrorSuppressed("queryWorkshop", !0);
                      return j
                        .callDeferred("browseWallpaperObject", "queryWorkshop", i)
                        .then(r)
                        .catch(function (e) {
                          xa.queryFailureCount < Sa
                            ? (++xa.queryFailureCount,
                              s(),
                              xa.queryFailureCount !== Sa ||
                                W.hasShownSteamServiceError ||
                                j.setCallErrorSuppressed("queryWorkshop", !0))
                            : (!angular.isNumber(e) || 1 === e) &&
                                1 < ge.current &&
                                !W.isUsingBackup
                              ? ((ge.current = 1), P())
                              : (W.hasShownSteamServiceError ||
                                  pa((W.hasShownSteamServiceError = !0)),
                                W.queryBackup(i)
                                  .then(r)
                                  .catch(function () {
                                    ((W.queryActive = !1),
                                      (W.showErrorInBackground = !0));
                                  }));
                        });
                    });
                }
                return (
                  j.setCallErrorSuppressed("queryWorkshop", !0),
                  j
                    .callDeferred("browseWallpaperObject", "queryWorkshop", i)
                    .then(r)
                    .catch(function (e) {
                      xa.queryFailureCount < Sa
                        ? (++xa.queryFailureCount,
                          s(),
                          xa.queryFailureCount !== Sa ||
                            W.hasShownSteamServiceError ||
                            j.setCallErrorSuppressed("queryWorkshop", !0))
                        : (!angular.isNumber(e) || 1 === e) &&
                            1 < ge.current &&
                            !W.isUsingBackup
                          ? ((ge.current = 1), P())
                          : (W.hasShownSteamServiceError ||
                              pa((W.hasShownSteamServiceError = !0)),
                            W.queryBackup(i)
                              .then(r)
                              .catch(function () {
                                ((W.queryActive = !1),
                                  (W.showErrorInBackground = !0));
                              }));
                    })
                );
              }
            })());
        }
        var Ca,
          Ea = { category: "preset", publishedItems: [], isSteamAvailable: L };
        function Pa(e, t) {
          return (
            angular.isNumber(t) || (t = 1),
            !(
              e.settings &&
              "dayofweek" === e.settings.mode &&
              angular.isArray(e.items) &&
              7 < e.items.length + t
            )
          );
        }
        function Ma() {
          F.open("genericConfirm", {
            data: {
              title:
                "ui_browse_playlist_modal_settings_day_of_week_warning_title",
              message:
                "ui_browse_playlist_modal_settings_day_of_week_warning_message",
              okVisible: !0,
            },
          });
        }
        ((W.onReceivePresets = function (e) {
          Ea.publishedItems = Ea.publishedItems.concat(e);
        }),
          (W.callbackPublishPreset = function () {
            if (!L()) return V.showSteamError();
            var e =
                (W.currentSelection.dependency &&
                  He(W.currentSelection.dependency)) ||
                W.currentSelection,
              t = { dependency: e.workshopid },
              a =
                ((Ea.dependentProject = {
                  tags: W.currentSelection.tags.split(","),
                }),
                (Ea.publishedItems = []),
                {});
            (angular.forEach(
              W.currentSelection.properties[W.selectedMonitor.location],
              function (e, t) {
                a[t] = { value: e.value, type: e.type };
              },
            ),
              W.isMiniMode && T.$broadcast("sendToggleMiniMode"),
              j
                .callDeferred(
                  "browseWallpaperObject",
                  "preparePublishPreset",
                  e.file,
                  { properties: a, dependency: e.workshopid },
                )
                .then(function () {
                  return F.open("editorSteamPublish", {
                    projectData: t,
                    editorSettings: Ea,
                  });
                }));
          }),
          (W.callbackBrowsePresets = function (e) {
            if (!L()) return V.showSteamError();
            (e.ispreset && (e = He(e.dependency)),
              W.setListSource("workshop"),
              (W.filterPreset.title = e.title),
              (W.filterPreset.workshopid = e.workshopid),
              (W.pagination.current = 1),
              P());
          }),
          (W.callbackClearPresetFilter = function () {
            (delete W.filterPreset.workshopid, P());
          }),
          (W.callbackBrowseAuthor = function (e) {
            if (W.sourceIsInstalled) {
              var authorName = e;
              if (W.steamUserInfos && W.steamUserInfos[e] && W.steamUserInfos[e].name) {
                authorName = W.steamUserInfos[e].name;
              }
              W.filterAuthor.installedAuthor = authorName;
              z();
              return;
            }
            (W.setListSource("workshop"),
              (W.filterAuthor.sortOptions = ue),
              (W.filterAuthor.sort = ue[0].value),
              (W.filterAuthor.authorSteamId = e),
              (W.pagination.current = 1),
              P());
          }),
          (W.callbackClearAuthorFilter = function () {
            if (W.sourceIsInstalled) {
              delete W.filterAuthor.installedAuthor;
              z();
            } else {
              delete W.filterAuthor.authorSteamId;
              P();
            }
          }),
          (W.callbackShowPresetHint = function () {
            F.open("genericConfirm", {
              data: {
                title: "ui_browse_details_properties_preset_hint_header",
                message: "ui_browse_details_properties_preset_hint_body",
                okVisible: !0,
              },
            });
          }),
          (W.showPresetPublishOptions = function (e) {
            return (
              e.workshopid &&
              !W.steamWorkshopStatus.error &&
              (("Scene" === e.type && e.cancreatepresets) ||
                "Web" === e.type) &&
              angular.isObject(
                W.selectedMonitor &&
                  e.properties &&
                  e.properties[W.selectedMonitor.location],
              ) &&
              1 < Object.keys(e.properties[W.selectedMonitor.location]).length
            );
          }),
          (W.onFileSubscriptionError = function () {
            pa();
          }),
          (W.showWorkshopAdvertiseModal = function (e, t) {
            (t && t.stopPropagation(),
              F.open("browseWallpaperWorkshopInfo", {
                data: {
                  filterConfig: W.browserSettings.defaultfilterconfig,
                  canCancel: e,
                },
              }).then(W.callbackResetFilter));
          }),
          (W.showResolutionSettingsModal = function (e) {
            (e && e.stopPropagation(),
              F.open("browseResolutionSettings", {
                data: { filterConfig: W.browserSettings.defaultfilterconfig },
              }).then(function () {
                (angular.forEach(
                  angular.copy(W.filter.resolutiontags),
                  function (e, t) {
                    W.filter.resolutiontags[t] = !0;
                  },
                ),
                  Ee(W.filter, W.browserSettings.defaultfilterconfig),
                  (b = W.filter));
              }));
          }),
          (W.setListSourceInstalled = function () {
            ("installed" === W.source &&
              "screensaver" === W.wallpaperConfigGroup &&
              W.changeConfigGroup("wallpaper"),
              W.setListSourceRecorded("installed"));
          }),
          (W.setListSourceRecorded = function (e) {
            (W.pushNavigationHistory(Et()), W.setListSource(e));
          }),
          (W.setListSource = function (e) {
            if (e === "installed" && W.fetchWorkerMetadata) W.fetchWorkerMetadata();
            if (W.source !== e) {
              if (("workshop" === e || "explore" === e) && !L())
                return V.showSteamError();
              if (W.showFilter && W.showFilterBySource) {
                if (W.sourceIsWorkshop) {
                  W.showFilterBySource.workshop = !!W.showFilter.visible;
                } else if (W.sourceIsInstalled) {
                  W.showFilterBySource.installed = !!W.showFilter.visible;
                }
              }
              ("workshop" === e &&
                L() &&
                ((W.browserSettings.advertiseworkshop = !1),
                W.browserSettings.advertiseworkshoppopup) &&
                ((W.browserSettings.advertiseworkshoppopup = !1),
                (W.showFilter.visible = !0),
                (W.showFilterBySource && (W.showFilterBySource.workshop = !0)),
                W.showWorkshopAdvertiseModal()),
                "explore" === e &&
                  L() &&
                  ((W.browserSettings.advertiseexplore = !1),
                  W.browserRuntime) &&
                  angular.isUndefined(
                    W.steamUserInfos[W.browserRuntime.usersteamid],
                  ) &&
                  j.callDeferred(
                    "ui",
                    "pollSteamUserInfo",
                    W.browserRuntime.usersteamid,
                    "browseWallpapersCtrl",
                  ),
                W.clearCurrentThumbnailQueue(),
                (W.canAdvertiseAny = !1),
                (W.queryActive = !1),
                (W.source = e),
                (W.sourceIsPluginSettings = "pluginSettings" === e),
                (W.sourceIsWorkshop = "workshop" === e),
                (W.sourceIsExplore = "explore" === e),
                (W.sourceIsInstalled =
                  !W.sourceIsWorkshop && !W.sourceIsExplore && !W.sourceIsPluginSettings),
                jt(),
                W.sourceIsWorkshop
                  ? ((W.pagination = ge),
                    (W.filter = b),
                    (W.filterHelper = W.filterHelperBySource.workshop),
                    (W.filterTemp = le),
                    (W.sortOptions = pe),
                    (W.filter.typetags.Application = !1))
                  : W.sourceIsExplore
                    ? ((W.pagination = r),
                      (W.filter = {}),
                      (W.filterTemp = we()),
                      (W.sortOptions = []))
                    : W.sourceIsInstalled &&
                      ((W.pagination = u),
                      (W.filter = h),
                      (W.filterHelper = W.filterHelperBySource.installed),
                      (W.filterTemp = ce),
                      (W.sortOptions = de)),
                (W.filterProxy.ratingtags = angular.copy(W.filter.ratingtags)),
                (W.showFilter.base = !1),
                (W.showFilter.counts = !1),
                W.showFilter &&
                  W.showFilterBySource &&
                  (W.showFilter.visible = W.sourceIsWorkshop
                    ? !!W.showFilterBySource.workshop
                    : W.sourceIsInstalled
                      ? !!W.showFilterBySource.installed
                      : !1),
                (W.sortedWallpapers = []),
                (W.currentSelection = void 0),
                (W.preview.play = !1),
                ut(),
                W.sourceIsExplore && _a(),
                W.sourceIsPluginSettings && (W.startPluginsIfNeeded(), W.refreshPluginData()),
                W.sourceIsInstalled && z(),
                W.sourceIsWorkshop && P(),
                W.skipNextFilterDebounce());
            }
          }),
          (W.getDisplayTags = function (e) {
            e = e.split(",");
            var t = [],
              a = [
                "Wallpaper",
                "Preset",
                "Web",
                "Video",
                "Scene",
                "Application",
                "Approved",
                "Multi-monitor optimized",
                "Workshop",
                "Official",
                "Local",
              ];
            return (
              angular.forEach(e, function (e) {
                a.indexOf(e) < 0 && t.push(e);
              }),
              V.createTranslatedTagList(t)
            );
          }),
          (W.getDisplayType = V.translateTagInstant),
          (W.callbackChangePage = function (e, t, a) {
            var i;
            "…" === e
              ? V.showPaginationPageNumberPrompt(e).then(W.callbackChangePage)
              : ((i = e),
                angular.isString(i) &&
                  ((i = W.pagination.current), "next" === e ? ++i : --i),
                ((i = Math.clamp(i, 1, W.pagination.count)) ===
                  W.pagination.current &&
                  !a) ||
                  (W.clearCurrentThumbnailQueue(),
                  !a && t && W.pushNavigationHistoryPagination(),
                  V.updatePagination(W.pagination, i, W.pagination.count),
                  m.cancel(Ca),
                  W.sourceIsExplore
                    ? W.isUsingBackup
                      ? (Ca = m(function () {
                          W.performExploreQuery(r.query, !0);
                        }, 1e3))
                      : W.performExploreQuery(r.query, !0)
                    : W.sourceIsWorkshop
                      ? W.isUsingBackup
                        ? (Ca = m(P, 1e3))
                        : P()
                      : (z(), X.scrollTop(0))));
          }),
          (W.callbackCancelEvent = window.cancelEventBubble),
          (W.callbackToggleAllWallpapersInCurrentMonitorPlaylist = function (
            t,
            e,
            a,
          ) {
            var i =
                W.selectedMonitor.playlist.items.findIndex(function (e) {
                  return e.wallpaper === t;
                }) < 0 || a,
              e = e ? [t] : H(!0, t),
              n = !1;
            (angular.forEach(e, function (t) {
              function e(e) {
                return e.wallpaper === t && !a;
              }
              (W.selectedMonitor.playlistFlags[t.file] = i)
                ? Pa(W.selectedMonitor.playlist)
                  ? W.selectedMonitor.playlist.items.pushIfNew(
                      { wallpaper: t },
                      e,
                    )
                  : (n = !0)
                : W.selectedMonitor.playlist.items.findAndRemove(e);
              if (i) {
                $(t);
              } else {
                dt(t);
              }
            }),
              n && Ma(),
              y());
          }),
          (W.callbackToggleEntryInCurrentMonitorPlaylist = function (a, e) {
            var t = a.wallpaper,
              i = W.selectedMonitor.playlist.items.findIndex(function (e) {
                return e === a;
              }),
              n = W.selectedMonitor.playlist.items.filter(function (e) {
                return e.wallpaper === t;
              }).length,
              o = i < 0,
              i = e ? [t] : H(!0, t),
              r = !1;
            (angular.forEach(i, function (e) {
              W.selectedMonitor.playlistFlags[e.file] = o || 1 < n;
              function t(e) {
                return e === a;
              }
              o
                ? Pa(W.selectedMonitor.playlist)
                  ? W.selectedMonitor.playlist.items.pushIfNew(
                      { wallpaper: e },
                      t,
                    )
                  : (r = !0)
                : W.selectedMonitor.playlist.items.findAndRemove(t);
            }),
              r && Ma(),
              y());
          }));
        var Aa,
          i,
          Ta,
          Ra,
          Ia,
          Oa = {},
          Da = [
            "ui_browse_playlist_day_monday",
            "ui_browse_playlist_day_tuesday",
            "ui_browse_playlist_day_wednesday",
            "ui_browse_playlist_day_thursday",
            "ui_browse_playlist_day_friday",
            "ui_browse_playlist_day_saturday",
            "ui_browse_playlist_day_sunday",
          ];
        function Wa() {
          Aa && (Aa.cancel(), (Aa = void 0));
        }
        function Ba(e) {
          e = angular
            .element(e.target)
            .closest(".browseWallpaperPlaylistImage")[0];
          return { target: angular.element(e), scope: e && e.attachedScope };
        }
        function Va(e) {
          if (50 < W.selectedMonitor.playlist.items.length) return e;
          e = Math.clamp(e, 0, 1);
          return (5 * Math.floor((1440 * e) / 5)) / 1440;
        }
        ((W.getDayOfWeekLabel = function (e, t) {
          for (
            var a = Math.min(
                7,
                (angular.isArray(e.items) && e.items.length) || 1,
              ),
              i = 1,
              n = 0,
              o = 7,
              r = 0;
            r < a;
            ++r
          ) {
            n = 7 - o;
            if (((o -= i = r < a - 1 ? Math.floor(o / (a - r)) : o), r === t))
              break;
          }
          var e = W.browserOptions.dayofweekoffset || 0;
          return (
            (Oa[(n = (n + e) % 7)] = Oa[n] || O.instant(Da[n % 7]).toString()),
            1 < i
              ? ((Oa[(e = (n + i - 1) % 7)] =
                  Oa[e] || O.instant(Da[e % 7]).toString()),
                Oa[n] + " - " + Oa[e])
              : Oa[n]
          );
        }),
          (W.callbackShowProfiles = function (i) {
            var t = angular.copy(W.wallpaperConfig),
              e =
                ((t.selectedwallpapers = t.selectedwallpapers || {}),
                (t.profile = angular.copy(W.monitorProfile)),
                angular.forEach(ze(), function (e) {
                  angular.isObject(e.playlist) &&
                  1 < e.playlist.items.length &&
                  angular.isObject(t.selectedwallpapers[e.location])
                    ? (t.selectedwallpapers[e.location].playlist = qe(
                        e.playlist,
                      ))
                    : angular.isObject(t.selectedwallpapers[e.location]) &&
                      delete t.selectedwallpapers[e.location].playlist;
                }),
                {
                  isSaving: i,
                  collectionItem: t,
                  collection: W.profiles,
                  hotkeys: W.sharedSettings.hotkeys,
                  type: "profiles",
                });
            F.open("browseCollections", { data: e }).then(function (e) {
              var t, a;
              i
                ? ((t = e),
                  (a = W.profiles.find(function (e) {
                    return e.name === t.name;
                  })),
                  angular.isObject(a)
                    ? angular.merge(a, t)
                    : W.profiles.push(t),
                  (W.wallpaperConfig.name = t.name))
                : ((a = e),
                  (e = ze()),
                  angular.forEach(e, function (e) {
                    (Qe(e.location), delete e.missingPlaylistItems);
                  }),
                  (W.wallpaperConfig = angular.copy(a)),
                  (W.monitorProfile = a.profile || {}),
                  x(),
                  g(W.monitorProfile),
                  (te = !1),
                  rt(),
                  angular.forEach(
                    angular.copy(W.wallpaperConfig.selectedwallpapers),
                    function (e, t) {
                      angular.isString(e.file) && l(p(e.file), t);
                    },
                  ),
                  angular.forEach(e, y),
                  snapshotAppliedConfig(),
                  w(e[0]));
            });
          }),
          (W.callbackShowPlaylists = function (i) {
            var e = {
              isSaving: i,
              collectionItem: W.selectedMonitor.playlist,
              collection: W.playlists,
              hotkeys: W.sharedSettings.hotkeys,
              location: W.selectedMonitor.location,
              type: "playlists",
            };
            F.open("browseCollections", { data: e }).then(function (e) {
              var t, a;
              i
                ? ((t = qe((t = e))),
                  (a = W.playlists.find(function (e) {
                    return e.name === t.name;
                  })),
                  angular.isObject(a)
                    ? (angular.merge(a, t), (a.items = t.items))
                    : W.playlists.push(t))
                : ((a = Ne((a = e))),
                  (W.selectedMonitor.playlist = a),
                  (W.selectedMonitor.playlistFlags = {}),
                  angular.forEach(a.items, function (e) {
                    W.selectedMonitor.playlistFlags[e.wallpaper.file] = !0;
                  }),
                  y());
            });
          }),
          (W.callbackShowPlaylistSettings = function () {
            F.open("browsePlaylistSettings", {
              data: {
                settings: W.selectedMonitor.playlist.settings,
                items: W.selectedMonitor.playlist.items,
                defaultSettings: _e(),
                fnPreviewTransition: function (e) {
                  j.callDeferred(
                    "ui",
                    "previewPlaylistTransition",
                    angular.toJson({
                      location: W.selectedMonitor.location,
                      settings: e,
                    }),
                  );
                },
              },
            }).then(function (e) {
              (Object.clear(W.selectedMonitor.playlist.settings),
                angular.merge(W.selectedMonitor.playlist.settings, e),
                "dayofweek" === W.selectedMonitor.playlist.settings.mode &&
                  angular.isArray(W.selectedMonitor.playlist.items) &&
                  7 < W.selectedMonitor.playlist.items.length &&
                  (W.selectedMonitor.playlist.items.length = 7),
                y());
            });
          }),
          (W.callbackClearPlaylist = function () {
            ((W.selectedMonitor.playlistFlags = {}),
              (W.selectedMonitor.playlist.items = []),
              ut(),
              y());
          }),
          (W.getPreviewUrl = V.getPreviewUrl),
          c.on("mousedown.daytimedrag", function (e) {
            var t;
            angular.element(e.target).hasClass("daytimeDragBorder") &&
              ((t = Ba(e)), angular.isObject(t.scope)) &&
              angular.isObject(t.scope.entry) &&
              (window.cancelEventImmediately(e),
              (e = angular.offsetToAncestor(e, Y)),
              (i = { active: !1, entry: t.scope.entry, lastX: e.left }));
          }),
          c.on("mousemove.daytimedrag", function (e) {
            var t, a;
            angular.isDefined(i) &&
              ((e = angular.offsetToAncestor(e, Y)),
              i.active ||
                (2 < Math.abs(e.left - i.lastX) &&
                  ((i.active = !0),
                  (i.indicator = angular.element(
                    document.createElement("div"),
                  )),
                  i.indicator.addClass("daytimeIndicator"),
                  i.indicator.css({ left: e.left }),
                  K.append(i.indicator),
                  (t = angular.element(document.createElement("div"))),
                  (a = angular.element(document.createElement("div"))),
                  t.addClass("timeHint"),
                  a.addClass("timeHintWrapper"),
                  a.append(t),
                  i.indicator.append(a),
                  t.text(o("date")(0, W.getTimelineFormat(), "+0000")),
                  (i.timeHint = t))),
              i.active) &&
              (i.indicator.css({ left: e.left }),
              (a = Va((a = e.left / Y.innerWidth())) + 1e-4),
              i.timeHint.text(
                o("date")(
                  24 * a * 60 * 60 * 1e3,
                  W.getTimelineFormat(),
                  "+0000",
                ),
              ));
          }),
          c.on("mouseup.daytimedrag", function (e) {
            var t;
            (angular.isObject(i) &&
              i.active &&
              ((t = angular.offsetToAncestor(e, Y)),
              i.indicator.remove(),
              (t = t.left / Y.innerWidth()),
              (i.entry.daytimeend = Va(t)),
              y()),
              (i = void 0),
              window.safeApply(W),
              window.cancelEventBubble(e));
          }),
          c.on("contextmenu.daytimedrag", function (e) {
            var t = angular.element(e.target),
              a = Ba(e);
            t.hasClass("daytimeDragBorder")
              ? angular.isObject(a.scope) &&
                angular.isObject(a.scope.entry) &&
                angular.isNumber(a.scope.entry.daytimeend) &&
                B.builder()
                  .button(
                    "ui_browse_context_menu_remove",
                    "fas fa-times",
                    function () {
                      (delete a.scope.entry.daytimeend,
                        y(),
                        window.safeApply(W));
                    },
                  )
                  .open(W, e)
              : t.hasClass("browseWallpaperPlaylistImageChild") &&
                angular.isObject(a.scope) &&
                angular.isObject(a.scope.entry) &&
                angular.isObject(a.scope.entry.wallpaper) &&
                !a.scope.entry.wallpaper.isStub &&
                ((t = B.builder()),
                a.scope.entry.wallpaper !== W.currentSelection &&
                  t.button(
                    "ui_browse_context_menu_replace_with_selection",
                    "fas fa-sync",
                    function () {
                      ((a.scope.entry.wallpaper = W.currentSelection),
                        y(),
                        window.safeApply(W));
                    },
                  ),
                t.button(
                  "ui_browse_context_menu_choose_preset",
                  "fas fa-folder-open",
                  function () {
                    Zt(a.scope.entry.wallpaper).then(function (e) {
                      ((a.scope.entry.preset = e.name), y());
                    });
                  },
                ),
                angular.isString(a.scope.entry.preset) &&
                  t.button(
                    "ui_browse_context_menu_remove_preset",
                    "fas fa-times",
                    function () {
                      (delete a.scope.entry.preset, y());
                    },
                  ),
                t.open(W, e));
          }),
          W.$on("onMiniModeChanged", function (e, t) {
            (W.isMiniMode = t)
              ? (W.canAdvertiseAny = !1)
              : angular.element("#WallpaperBrowseInner2").scrollTop(Ta);
          }),
          angular.element("#WallpaperBrowseInner2").scroll(function (e) {
            400 < window.innerWidth && (Ta = e.target.scrollTop);
          }),
          (W.getTimelineFormat = function () {
            return W.browserOptions.timeformat12hr ? "hh:mm a" : "HH:mm";
          }),
          (W.openSystemWallpaperDialog = function () {
            j.callDeferred(
              "browseWallpaperObject",
              "openSystemWallpaperDialog",
            );
          }),
          (W.showScreensaverSettings = function () {
            (W.changeMonitorActive || W.toggleMonitorSelection(),
              (W.wallpaperConfigGroup = "screensaver"));
          }),
          (W.openConfigGroup = function () {
            ((W.status.isopengroup = !0),
              c.off("mousemove.tmp.configgroup"),
              m.cancel(Ra),
              (Ra = void 0));
            var a = angular.element(c.find("#configGroupSelector")[0]);
            c.on("mousemove.tmp.configgroup", function (e) {
              var t = document.elementFromPoint(e.pageX, e.pageY - 4);
              0 === a.has(e.target).length && 0 === a.has(t).length
                ? void 0 === Ra &&
                  ((Ra = m(function () {
                    ((W.status.isopengroup = !1),
                      c.off("mousemove.tmp.configgroup"));
                  }, 250)),
                  window.safeApply(W))
                : (m.cancel(Ra), (Ra = void 0));
            });
          }));
        var Fa,
          ja,
          La,
          za,
          Ha,
          $a,
          Ua,
          Ga,
          qa = [];
        function Na(e, t) {
          if (angular.isObject(e) && e !== t && !W.sourceIsExplore && !W.sourceIsPluginSettings) {

            var a,
              i = La !== W.sourceIsWorkshop;
            if (
              ((La = W.sourceIsWorkshop),
              i || ((W.pagination.current = 1), (ge.current = 1), (u.current = 1)),
              (W.filterStatus.type =
                (W.filter.typetags &&
                  (!W.filter.typetags.Scene ||
                    !W.filter.typetags.Video ||
                    !W.filter.typetags.Web)) ||
                (W.filter.categorytags &&
                  (!W.filter.categorytags.Wallpaper ||
                    !W.filter.categorytags.Preset))),
              (W.filterStatus.rating =
                W.filter.ratingtags && !W.filter.ratingtags.Everyone),
              (W.filterStatus.source =
                W.filter.sourcetags &&
                (!W.filter.sourcetags.Workshop ||
                  !W.filter.sourcetags.Official ||
                  !W.filter.sourcetags.Local)),
              (a = W.sourceIsWorkshop
                ? Se(W.browserSettings.defaultfilterconfig)
                : []),
              (W.filterStatus.resolution = !1),
              angular.forEach(W.filter.resolutiontags, function (e, t) {
                !1 !== e || a.includes(t) || (W.filterStatus.resolution = !0);
              }),
              (W.filterStatus.utility = !1),
              angular.forEach(W.filter.utilitytags, function (e) {
                0 !== e && (W.filterStatus.utility = !0);
              }),
              (W.filterStatus.tags = !1),
              (a = W.sourceIsWorkshop
                ? xe(W.browserSettings.defaultfilterconfig)
                : []),
              angular.forEach(W.filter.tags, function (e, t) {
                !1 !== e ||
                  "Unspecified" === t ||
                  a.includes(t) ||
                  (W.filterStatus.tags = !0);
              }),
              (W.filterStatus.text =
                angular.isString(W.filter.text) &&
                0 < W.filter.text.trim().length),
              (W.showFilter.base =
                W.filterStatus.type ||
                W.filterStatus.rating ||
                W.filterStatus.source ||
                W.filterStatus.resolution ||
                W.filterStatus.tags ||
                W.filterStatus.utility ||
                W.filterStatus.text),
              W.sourceIsWorkshop)
            ) {
              (W.showFilter.counts = W.showFilter.base);
              P();
            } else z();
            (m.cancel(ja),
              v &&
                (ja = m(function () {
                  ((W.browserSettings.filterinfo = {
                    installed: angular.copy(h),
                    workshop: angular.copy(b),
                  }),
                    delete W.browserSettings.filterinfo.installed.text,
                    delete W.browserSettings.filterinfo.workshop.text,
                    delete W.browserSettings.filterinfo.installed.exactMatch,
                    delete W.browserSettings.filterinfo.workshop.exactMatch);
                }, 1e3)));
          }
        }
        function Qa() {
          var e,
            t = arguments;
          0 < W.searchTextInputModelOptions.debounce
            ? (angular.isUndefined($a) && ($a = arguments[1]),
              (e = Ua ? 0 : W.searchTextInputModelOptions.debounce),
              m.cancel(Ha),
              (Ha = m(function () {
                (Na.apply(null, [t[0], $a]), ($a = void 0), (Ua = !1));
              }, e)))
            : ((Ua = !1), Na.apply(null, t));
        }
        function Ka(e) {
          (angular.forEach(e.items, function (e, t) {
            W.folderRootExclusion[t] = !0;
          }),
            angular.forEach(e.subfolders, Ka));
        }
        function Ya() {
          var t;
          (angular.forEach(W.filterUtilityTags, function (t) {
            V.translateTag(t.value).then(function (e) {
              t.label = e;
            });
          }),
            angular.forEach(W.filterAllTags, function (t) {
              V.translateTag(t.value).then(function (e) {
                t.label = e;
              });
            }),
            angular.forEach(W.filterResolutionTags, function (t) {
              V.translateTag(t.value).then(function (e) {
                t.label = e;
              });
            }),
            (W.lutFilterOptions = [
              { label: "ui_browse_properties_image_filter_none", value: "" },
            ]),
            (t = 1),
            angular.forEach(
              window.wpxGlobalData.lutFilterOptionFiles,
              function (e) {
                (W.lutFilterOptions.push({
                  value: e,
                  label: t + " " + O.instant("ui_browse_lut_filter_" + e),
                }),
                  ++t);
              },
            ),
            (Oa = {}));
        }
        function Xa() {
          Ga ||
            ((Ga = !0),
            j
              .callDeferred(
                "browseWallpaperObject",
                "toggleMiniMode",
                !!W.generalUserSettings.minimodeminimizewindows,
              )
              .then(function (e) {
                (m(function () {
                  Ga = !1;
                }, 250),
                  e
                    ? (document.body.classList.add("browseWallpaperMiniMode"),
                      (W.changeMonitorActive = !1),
                      (W.mobileDeviceManagementActive = !1))
                    : document.body.classList.remove("browseWallpaperMiniMode"),
                  T.$broadcast("onMiniModeChanged", e));
              })
              .catch(function () {
                Ga = !1;
              }));
        }
        ((W.requestThumbnailPath = function (e) {
          e &&
            e.file &&
            (Ia
              ? qa.push(e.file)
              : ((Ia = e.file),
                j.callDeferred("browseWallpaperObject", "getThumbnail", Ia)));
        }),
          (W.clearCurrentThumbnailQueue = function () {
            (angular.forEach(qa, function (e) {
              delete e.requestedThumbnail;
            }),
              (qa = []));
          }),
          (W.onThumbnailReceived = function (t) {
            ((t && t.file !== Ia) || (Ia = void 0),
              0 < qa.length &&
                ((Ia = qa.shift()),
                j.callDeferred("browseWallpaperObject", "getThumbnail", Ia)),
              t &&
                angular.isString(t.preview) &&
                (angular.forEach(d, function (e) {
                  e.file === t.file &&
                    ((e.preview = t.preview), (e.previewsmall = t.preview));
                }),
                (Fa =
                  Fa ||
                  m(function () {
                    ((W.sortedWallpapers = W.sortedWallpapers.slice()),
                      (Fa = void 0));
                  }, 250))));
          }),
          (W.setSteamAuthTicket = function (e) {
            W.steamAuth.ticket = e.ticket;
            e = W.steamAuth.listeners;
            ((W.steamAuth.listeners = []),
              angular.forEach(e, function (e) {
                e();
              }));
          }),
          (W.steamAuth = { listeners: [] }),
          (W.resetSearchFilter = function () {
            ((W.filter.text = ""),
              angular.element("#browseSearchFilterText").focus());
          }),
          (W.openAccountPreferences = function () {
            V.openUrl(V.getAccountPreferencesUrl());
          }),
          ((window.browseWallpapersCtrl = W).folders = []),
          (W.folderRootExclusion = {}),
          (W.currentFolder = void 0),
          (W.sortedExploreQueries = []),
          (W.sortedWallpapers = []),
          (W.sourceIsInstalled = !0),
          (W.steamUserInfos = {}),
          (W.wallpapers = []),
          (W.colorPickerOptions = V.getColorPickerDefaults()),
          (W.source = "installed"),
          (W.pagination = u),
          (W.multiSelection = []),
          (W.preview = { play: !1 }),
          (W.monitorSelectionState = { createGroup: 0 }),
          (W.filterProxy = {}),
          (W.filter = {}),
          (W.filterTemp = {}),
          (W.filterPreset = {}),
          (W.filterAuthor = {}),
          (W.showFilter = { visible: !1, counts: !1 }),
          (W.showFilterBySource = { installed: !1, workshop: !1 }),
          W.$watch("showFilter.visible", function (val) {
            if (W.showFilterBySource) {
              if (W.sourceIsWorkshop) {
                W.showFilterBySource.workshop = !!val;
              } else if (W.sourceIsInstalled) {
                W.showFilterBySource.installed = !!val;
              }
            }
          }),
          (W.searchTextInputModelOptions = { debounce: se.normal }),
          (W.canAdvertiseAny = !0),
          (W.canOpenWallpaperDetailsOnPlatform =
            V.canOpenWallpaperDetailsOnPlatform()),
          (W.canOpenWallpaperDetailsOnWeb = V.canOpenWallpaperDetailsOnWeb()),
          (W.monitorController = {}),
          (W.browserSettings = {
            viewiconsize: "medium",
            showmonitorselectiononstart: !0,
            paireddevices: [],
            resultsperpage: 100,
            explore: { favorites: [], liked: [], disliked: [], custom: [] },
            folders: [],
            authorblocklistnames: [],
            defaultfilterconfig: {
              recommendedresolution: !1,
              showotherresolution: !0,
            },
          }),
          (W.browserSettingsExtensions = { authorblocklist: [] }),
          (W.mobileManagerState = { page: "", connectedDevices: [] }),
          (de = [
            { value: "install_date", label: "ui_wep_sort_install_date" },
            { value: "name", label: "ui_browse_sort_name" },
            { value: "rating", label: "ui_browse_sort_rating" },
            { value: "size", label: "ui_browse_sort_filesize" },
            { value: "posted_date", label: "ui_wep_sort_posted_date" },
            { value: "updated_date", label: "ui_wep_sort_updated_date" }
          ]),
          (pe = [
            { value: "trend_today", label: "ui_browse_query_sort_by_trend_today" },
            { value: "trend_week", label: "ui_browse_query_sort_by_trend_last_week" },
            { value: "trend_month", label: "ui_browse_query_sort_by_trend_last_month" },
            { value: "trend_3months", label: "ui_wep_sort_popular_3months" },
            { value: "trend_6months", label: "ui_wep_sort_popular_6months" },
            { value: "trend_year", label: "ui_browse_query_sort_by_trend_year" },
            { value: "top_rated", label: "ui_browse_query_sort_by_votes" },
            { value: "most_recent", label: "ui_browse_query_sort_by_date" },
            { value: "last_updated", label: "ui_wep_sort_recently_updated" },
            { value: "subscriptions", label: "ui_wep_sort_subscribers" },
          ]),
          (ue = [
            { value: "most_recent", label: "ui_browse_query_sort_by_date" },
            { value: "top_rated", label: "ui_browse_query_sort_by_votes" },
            { value: "last_updated", label: "ui_wep_sort_recently_updated" },
          ]),
          (W.layouts = [
            { label: "ui_browse_monitors_layout_per_monitor", value: 0 },
            { label: "ui_browse_monitors_layout_fit", value: 1 },
            { label: "ui_browse_monitors_layout_clone_wallpaper", value: 2 },
          ]),
          (W.layoutsScreensaver = [
            {
              label: "ui_browse_monitors_layout_screensaver_per_monitor",
              value: 0,
            },
            { label: "ui_browse_monitors_layout_screensaver_fit", value: 1 },
            {
              label: "ui_browse_monitors_layout_screensaver_clone_wallpaper",
              value: 2,
            },
          ]),
          W.$watch("currentSelection", function (e, t) {
            ((J = {}),
              Pe(),
              angular.isDefined(e) &&
                (angular.isString(e.authorsteamid) &&
                  angular.isUndefined(W.steamUserInfos[e.authorsteamid]) &&
                  j.callDeferred(
                    "ui",
                    "pollSteamUserInfo",
                    e.authorsteamid,
                    "browseWallpapersCtrl",
                  ),
                !angular.isDefined(e.workshopid) ||
                  (angular.isDefined(t && t.workshopid) &&
                    e.workshopid === t.workshopid) ||
                  (V.requiresFullAsyncWorkshop() &&
                    j.callDeferred(
                      "ui",
                      "updateWorkshopItemMetaData",
                      e.workshopid,
                    ),
                  W.getUserVote(e))),
              angular.isObject(e && e.localization) &&
                (G.insertTranslations(e.localization), O.refresh()),
              e && ut(),
              Gt());
          }),
          W.$watch("selectedMonitor", Gt),
          W.$watch("wallpaperConfig.layout", function (e, t) {
            if (angular.isNumber(e) && v && e !== t)
              switch (
                (j.callDeferred("browseWallpaperObject", "changeLayout", e),
                x(),
                W.wallpaperConfig.layout)
              ) {
                case 0:
                  var a = W.monitors.find(function (e) {
                    return 0 === e.index;
                  });
                  w(a.group || a);
                  break;
                case 1:
                  w(W.monitors[0]);
                  break;
                case 2:
                  w(
                    W.monitors.find(function (e) {
                      return 0 === e.index;
                    }),
                  );
              }
          }),
          W.$on("onInternalDropStart", function () {
            W.isDragDropActive = !0;
          }),
          W.$on("onInternalDropStop", function () {
            W.isDragDropActive = !1;
          }),
          (W.skipNextFilterDebounce = function () {
            Ua = !0;
          }),
          W.$watch(
            "browserSettings",
            function (e) {
              angular.isObject(e) &&
                v &&
                j.callDeferred(
                  "browseWallpaperObject",
                  "persistBrowserSettings",
                  angular.toJson(e),
                );
            },
            !0,
          ),
          W.$watch(
            "sharedSettings",
            function (e) {
              angular.isObject(e) &&
                v &&
                j.callDeferred(
                  "browseWallpaperObject",
                  "persistSharedSettings",
                  angular.toJson(e),
                );
            },
            !0,
          ),
          W.$watch(
            "userMonitorSettings",
            function (e) {
              angular.isObject(e) &&
                v &&
                j.callDeferred(
                  "browseWallpaperObject",
                  "persistUserMonitorSettings",
                  angular.toJson(e),
                );
            },
            !0,
          ),
          W.$watch("filter", Qa, !0),
          W.$watch("filterAuthor", Qa, !0),
          W.$watch(
            "filterProxy.ratingtags",
            function (e) {
              !W.sourceIsWorkshop ||
              !angular.isObject(e) ||
              (!e.Questionable && !e.Mature) ||
              W.browserSettings.agegateconfirmed
                ? (W.filter.ratingtags = angular.copy(e))
                : F.open("ageGate")
                    .then(function () {
                      ((W.filter.ratingtags = angular.copy(e)),
                        (W.browserSettings.agegateconfirmed = !0));
                    })
                    .catch(function () {
                      W.filterProxy.ratingtags = {
                        Everyone: !0,
                        Questionable: !1,
                        Mature: !1,
                      };
                    });
            },
            !0,
          ),
          W.$watch(
            "folders",
            function (e, t) {
              e !== t &&
                ((W.folderRootExclusion = {}), angular.forEach(e, Ka), z());
            },
            !0,
          ),
          W.$watch(
            "playlists",
            function (e, t) {
              angular.isArray(e) &&
                e !== t &&
                v &&
                j.callDeferred(
                  "browseWallpaperObject",
                  "playlistsChanged",
                  angular.toJson(e),
                );
            },
            !0,
          ),
          W.$watch(
            "profiles",
            function (e, t) {
              angular.isArray(e) &&
                e !== t &&
                v &&
                j.callDeferred(
                  "browseWallpaperObject",
                  "profilesChanged",
                  angular.toJson(e),
                );
            },
            !0,
          ),
          W.$on("onCppInit", function (e, t) {
            ((W.providerIcon = V.getProviderIcon()),
              (W.showDiscover = V.canUseDiscover()),
              (W.showExactMath = V.canUseExactMatch()),
              (W.showApprovedTag = V.canUseApprovedTag()),
              (W.filterAllTags = V.getAvailableTags()),
              (W.filterUtilityTags = V.getAvailableTags(!0)),
              (W.filterSourceTags = V.getWallpaperSourceTags()),
              (W.filterTypeTags = V.getWallpaperTypeTags()),
              (W.filterCategoryTags = V.getWallpaperCategoryTags()),
              (W.filterRatingTags = V.getWallpaperRatingTags()),
              (W.filterResolutionTags = V.getResolutionTags()));
            var a = W.filterAllTags[0];
            (W.filterAllTags.splice(0, 1),
              W.filterAllTags.push(a),
              (W.filterAllTags = W.filterAllTags.map(function (e) {
                return { label: e, value: e };
              })),
              (W.filterUtilityTags = W.filterUtilityTags.map(function (e) {
                return { label: e, value: e };
              })),
              (W.filterResolutionTags = W.filterResolutionTags.map(
                function (e) {
                  return {
                    label: e.replace(/Standard Definition/g, "SD"),
                    value: e,
                  };
                },
              )),
              (h = Ce()),
              (b = Ce("workshop")),
              (W.sortOptions = de),
              (W.filter = h),
              (W.filterTemp = ce),
              Ya(),
              (W.tempFilterChanged = function () {
                W.sourceIsWorkshop
                  ? P()
                  : W.sourceIsInstalled && W.sortWallpapers();
              }),
              t && (W.allowAllMobileUploads = !0));
          }),
          T.$on("$translateChangeEnd", Ya),
          W.$on("sendToggleMiniMode", Xa),
          (W.navigateWallpapers = function (e) {
            if (W.isExploreHomepage())
              ((a = "left" === e ? -1 : "right" === e ? 1 : 0),
                (i = W.getExploreQueryFromSelection()) &&
                  0 <= (n = i.wallpapers.indexOf(W.currentSelection)) &&
                  ((n = (n + a) % i.wallpapers.length),
                  W.callbackWallpaperSelected(i.wallpapers[n])));
            else {
              var t = W.sortedWallpapers.indexOf(W.currentSelection),
                a = X,
                i = angular.element("#wpimg0"),
                n = a.width(),
                a = i.width(),
                o = Math.floor(n / a);
              switch (e) {
                case "left":
                  --t;
                  break;
                case "up":
                  t -= o;
                  break;
                case "right":
                  t += 1;
                  break;
                case "down":
                  t += o;
              }
              angular.isNumber(t) &&
                0 <= t &&
                t < W.sortedWallpapers.length &&
                !W.changeMonitorActive &&
                W.callbackWallpaperSelected(W.sortedWallpapers[t]);
            }
          }),
          c.on("keydown.wpe.wallpaperbrowser", function (e) {
            switch (e.keyCode) {
              case 121:
                return (window.cancelEventBubble(e), void Xa());
              case 122:
                (window.cancelEventBubble(e),
                  j.callDeferred("browseWallpaperObject", "toggleMaximize"));
            }
            var t = angular.element(":focus");
            if (!(0 < t.length || F.isAnyModalVisible())) {
              if (37 <= e.keyCode && e.keyCode <= 40)
                switch (e.keyCode) {
                  case 37:
                    (window.cancelEventBubble(e), W.navigateWallpapers("left"));
                    break;
                  case 38:
                    (window.cancelEventBubble(e), W.navigateWallpapers("up"));
                    break;
                  case 39:
                    (window.cancelEventBubble(e),
                      W.navigateWallpapers("right"));
                    break;
                  case 40:
                    (window.cancelEventBubble(e), W.navigateWallpapers("down"));
                }
              else
                46 === e.keyCode
                  ? (window.cancelEventBubble(e), ht())
                  : e.ctrlKey &&
                    65 === e.keyCode &&
                    (window.cancelEventBubble(e),
                    W.sourceIsInstalled
                      ? ($(W.sortedWallpapersPrePagination),
                        $(W.sortedFoldersPrePagination))
                      : W.sourceIsWorkshop
                        ? $(W.sortedWallpapers)
                        : W.sourceIsExplore &&
                          (W.isExploreHomepage()
                            ? (t = W.getExploreQueryFromSelection()) &&
                              $(t.wallpapers)
                            : $(W.sortedWallpapers)));
              window.safeApply(W);
            }
          }));
        function Ja() {
          return ((ra = !1), D.when());
        }
        var Za,
          ei = {
            findElement: function (e) {
              var t,
                e = Ba(e);
              if (angular.isObject(e.scope))
                return (
                  (t = e.scope.entry && e.scope.entry.wallpaper),
                  angular.isObject(t)
                    ? { element: e.target, data: e.scope.entry }
                    : void 0
                );
            },
          };
        (U.registerInitiator(ei),
          (W.dropFile = function (e) {
            var t = "",
              a =
                (angular.forEach(e, function (e) {
                  !t && e.toLowerCase().includes(".exe") && (t = e);
                }),
                D.when(e));
            (a = t
              ? Xe(t).then(function () {
                  return e;
                })
              : a).then(function (e) {
              var t = [];
              (angular.forEach(e, function (e) {
                t.push(je(e));
              }),
                0 < t.length &&
                  ((e = t[0]),
                  mt(t, W.currentFolder),
                  z(),
                  l(e),
                  tt(e),
                  j.callDeferred(
                    "browseWallpaperObject",
                    "addLocalWallpaperToHistory",
                    t.map(function (e) {
                      return e.file;
                    }),
                  )));
            });
          }),
          (W.dropFileEditor = function (e) {
            j.callDeferred("browseWallpaperObject", "createInEditor", e[0]);
          }),
          (W.dropConfigEditor = {
            label: "ui_browse_footer_btn_open_wallpaper_in_editor",
            icon: "fas fa-pencil-ruler",
            class: "browseWallpaperDropElements",
            fnCondition: function (e) {
              return (
                (W.dropConfigEditor.disabled =
                  1 !== e.length || e[0].toLowerCase().endsWith(".exe")),
                !0
              );
            },
          }),
          (W.dropConfigBrowser = {
            fnCondition: function (e) {
              var t = !1;
              return (
                angular.forEach(e, function (e) {
                  V.isExtension(e, "static") && (t = !0);
                }),
                (W.dropConfigBrowser.label = t
                  ? "ui_browse_footer_btn_open_wallpaper_in_gallery_static"
                  : "ui_browse_footer_btn_open_wallpaper_in_gallery"),
                (W.dropConfigBrowser.icon = t ? "fas fa-image" : "fas fa-film"),
                !0
              );
            },
            class: "browseWallpaperDropElements",
          }));
        function ti() {
          Za && (Za.remove(), (Za = void 0));
        }
        function ai(e, t) {
          for (
            var a = angular.element(Y.children()[0]).children(),
              i = e.pageX - Y[0].getBoundingClientRect().left,
              n = 0,
              o = 0;
            o < a.length;
            ++o
          ) {
            var r = angular.element(a[o]).outerWidth(!0);
            if (i < n + 0.5 * r) return t ? n : o;
            n += r;
          }
          return t ? n : a.length;
        }
        (I.addCloseCallback(Ja),
          W.$on("$destroy", function () {
            (Ht(),
              ea.$destroy(),
              I.removeCloseCallback(Ja),
              c.off("keydown.wpe.wallpaperbrowser"),
              c.off("mousedown.daytimedrag"),
              c.off("mousemove.daytimedrag"),
              c.off("mouseup.daytimedrag"),
              c.off("contextmenu.daytimedrag"),
              U.unregisterInitiator(ei),
              U.unregisterContainer(K),
              U.unregisterContainer(X));
          }),
          U.registerContainer(K, {
            onMouseEnter: function () {
              ((Za = angular.element(document.createElement("div"))).addClass(
                "browseWallpaperPlaylistHoverIndicator",
              ),
                K.append(Za),
                Wa(),
                (Aa = U.beginAutoScroll("playlistScroll", K, !0)));
            },
            onMouseLeave: function () {
              (ti(), Wa());
            },
            onMouseMove: function (e) {
              ((e = e), Za && ((e = ai(e, !0)), Za.css({ left: e })));
            },
            onElementDropped: function (e, t) {
              (ti(), Wa(), delete t.daytimeend);
              var a,
                i,
                n = ai(e, !1),
                e = W.selectedMonitor.playlist.items.indexOf(t);
              (-1 === e
                ? ((a = H(!0, t)),
                  (i = !1),
                  angular.forEach(a, function (e) {
                    Pa(W.selectedMonitor.playlist)
                      ? ((W.selectedMonitor.playlistFlags[e.file] = !0),
                        W.selectedMonitor.playlist.items.splice(n, 0, {
                          wallpaper: e,
                        }))
                      : (i = !0);
                  }),
                  i && Ma())
                : n !== e &&
                  (n < e
                    ? (W.selectedMonitor.playlist.items.splice(e, 1),
                      W.selectedMonitor.playlist.items.splice(n, 0, t))
                    : (W.selectedMonitor.playlist.items.splice(n, 0, t),
                      W.selectedMonitor.playlist.items.splice(e, 1))),
                W.$apply(),
                y());
            },
          }),
          U.registerContainer(X, {
            onMouseEnter: function () {},
            onMouseLeave: function () {},
            onMouseMove: function () {},
            onElementDropped: function (e, t) {
              e =
                (e = angular
                  .element(e.target)
                  .closest(".browseWallpaperImage")[0]) &&
                e.ctx &&
                e.ctx.wallpaper;
              angular.isObject(e) && "folder" === e.type && vt(t, e);
            },
          }));
      },
    ];

    // The queue payload is the whole arguments list of the registration call:
    // ["<name>", <DI array with the factory function>]. Both elements are needed,
    // the name included, because bootstrap does provider[method].apply(provider, args).
    var patched = {
      "$compileProvider:directive:titlebar": ["titlebar", titlebar],
      "$provide:factory:localeLoader": ["localeLoader", localeLoader],
      "$compileProvider:directive:wallpaperThumbnail": ["wallpaperThumbnail", wallpaperThumbnail],
      "$provide:service:modals": ["modals", modals],
      "$controllerProvider:register:BrowseWallpapersCtrl": ["BrowseWallpapersCtrl", browseWallpapers],
    };

    // Replace the queue payload in place; never append new entries.
    var queue = app._invokeQueue;
    for (var i = 0; i < queue.length; i++) {
      var entry = queue[i];
      var key = entry[0] + ":" + entry[1] + ":" + entry[2][0];
      if (patched.hasOwnProperty(key)) entry[2] = patched[key];
    }
  })();

  // ==========================================================================
  // Stage 3: the remaining WEP registrations moved out of scripts.js.
  //
  // Same queue-patch contract as stage 2: scripts.js stays upstream, the overlay
  // rewrites the already queued entry in place before bootstrap. The blocks
  // below are verbatim copies from scripts.js; docs/ARCHITECTURE.md has the
  // source line ranges.
  // ==========================================================================
  (function () {
    var app = angular.module("wallpaperbrowserApp");

    // Read by EditorEffectListModalCtrl; the base assigns it right before the
    // controller registration.
    window.effectListModalGalleryMode = "gallery";

    var utils = [
    "$document",
    "$rootScope",
    "$timeout",
    "$translate",
    "modals",
    "toastr",
    function (t, a, i, n, o, r) {
      var s,
        l,
        c,
        d,
        p,
        u,
        g,
        f,
        e,
        m,
        v = [],
        h = [],
        b = [],
        _ = [],
        y = [],
        w = [],
        k = 0,
        x = this,
        S = {
          chooseText: "OK",
          cancelText: "Cancel",
          showPalette: !0,
          palette: [
            ["white", "silver", "black"],
            ["red", "orange", "yellow"],
            ["lime", "green", "#254117"],
            ["lightblue", "blue", "darkblue"],
            ["cyan", "purple", "Magenta"],
          ],
          preferredFormat: "hex",
          showInput: !0,
          maxSelectionSize: 3,
        },
        C = angular.copy(S),
        E = ((C.flat = !0), angular.copy(S));
      function P(e) {
        e = e.toString(16);
        return 1 === e.length ? "0" + e : e;
      }
      function M(e, t, a) {
        return "#" + P(e) + P(t) + P(a);
      }
      function A(e) {
        e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return e
          ? {
              r: parseInt(e[1], 16),
              g: parseInt(e[2], 16),
              b: parseInt(e[3], 16),
            }
          : { r: 0, g: 0, b: 0 };
      }
      ((E.showPalette = !1),
        (E.showInput = !1),
        (E.containerClassName = "spectrumHueOnly"),
        (this.formatSize = function (e, t) {
          var a, i;
          return angular.isString(e)
            ? e
            : ((a = Math.round(e)),
              (e = Math.round(e / 1024)),
              0 < (i = Math.round(e / 1024))
                ? i + " MB"
                : 0 < e || !t
                  ? e + " kB"
                  : a + " bytes");
        }),
        (this.getAvailableTags = function (e) {
          return angular.copy(e ? h : v);
        }),
        (this.getResolutionTags = function () {
          return angular.copy(b);
        }),
        (this.getWallpaperSourceTags = function () {
          return [
            { value: "Official", label: "ui_browse_filter_source_official" },
            { value: "Workshop", label: "ui_browse_filter_source_workshop" },
            { value: "Local", label: "ui_browse_filter_source_my_wallpapers" },
          ];
        }),
        (this.getWallpaperCategoryTags = function () {
          return [
            {
              value: "Wallpaper",
              label: "ui_browse_filter_category_wallpaper",
            },
            { value: "Preset", label: "ui_browse_filter_category_preset" },
          ];
        }),
        (this.getWallpaperTypeTags = function () {
          return [
            { value: "Scene", label: "ui_browse_filter_type_scene" },
            { value: "Video", label: "ui_browse_filter_type_video" },
            { value: "Web", label: "ui_browse_filter_type_web" },
            {
              value: "Application",
              label: "ui_browse_filter_type_application",
            },
          ];
        }),
        (this.getWallpaperRatingTags = function () {
          return [
            { value: "Everyone", label: "ui_workshop_tags_rating_everyone" },
            {
              value: "Questionable",
              label: "ui_workshop_tags_rating_questionable",
            },
            { value: "Mature", label: "ui_workshop_tags_rating_mature" },
          ];
        }),
        (this.setAvailableTags = function (e, t, a) {
          ((v = e),
            angular.isArray(t) && (h = t),
            angular.isArray(a) && (b = a));
        }),
        (this.setAvailableAssetTags = function (e, t) {
          ((_ = e), (y = t));
        }),
        (this.getAssetTypeTags = function () {
          return angular.copy(_);
        }),
        (this.getAssetGenreTags = function () {
          return angular.copy(y);
        }),
        (this.prepareTagForTranslation = function (e) {
          return (e && e.toLowerCase().replace(/[\- ]/g, "_")) || "";
        }),
        (this.translateTag = function (t) {
          return n("ui_workshop_tags_" + x.prepareTagForTranslation(t))
            .then(function (e) {
              return 0 < e.toString().length ? e.toString() : t;
            })
            .catch(function () {
              return t;
            });
        }),
        (this.translateTagInstant = function (e) {
          var t =
            (e &&
              n
                .instant(
                  "ui_workshop_tags_" + e.toLowerCase().replace(/[\- ]/g, "_"),
                )
                .toString()) ||
            "";
          return 0 < t.length ? t : e;
        }),
        (this.translateRatingTag = function (t) {
          return n(
            "ui_workshop_tags_rating_" + t.toLowerCase().replace(/[\- ]/g, "_"),
          )
            .then(function (e) {
              return 0 < e.toString().length ? e.toString() : t;
            })
            .catch(function () {
              return t;
            });
        }),
        (this.translateRatingTagInstant = function (e) {
          var t =
            (e &&
              n
                .instant(
                  "ui_workshop_tags_rating_" +
                    e.toLowerCase().replace(/[\- ]/g, "_"),
                )
                .toString()) ||
            "";
          return 0 < t.length ? t : e;
        }),
        (this.translateAssetTypeTag = function (t) {
          return n(
            "ui_workshop_tags_asset_type_" +
              t.toLowerCase().replace(/[\- ]/g, "_"),
          )
            .then(function (e) {
              return 0 < e.toString().length ? e.toString() : t;
            })
            .catch(function () {
              return t;
            });
        }),
        (this.createTranslatedTagList = function (e) {
          var e = angular.isArray(e) ? e : e.split(","),
            t = ["everyone", "questionable", "mature"],
            a = [];
          return (
            angular.forEach(e, function (e) {
              t.includes(e.toLowerCase())
                ? x.canUseAgeRatingTags() &&
                  a.push(x.translateRatingTagInstant(e))
                : v.includes(e) || h.includes(e)
                  ? a.push(x.translateTagInstant(e))
                  : a.push(e);
            }),
            a
          );
        }),
        (this.showError = function (e, t) {
          if (
            e &&
            (typeof e === "string" || e instanceof String) &&
            (e.indexOf("Steam") !== -1 ||
              e.indexOf("steam") !== -1 ||
              
              e.indexOf("Invalid parameter") !== -1 ||
              e.indexOf("network error") !== -1)
          )
            return;
          var a = {};
          (angular.isNumber(t) && ((a.timeOut = t), (a.extendedTimeOut = t)),
            r.error(e, "Error", a));
        }),
        (this.showWarning = function (e) {
          r.warning(e, "Warning");
        }),
        (this.showSuccess = function (e) {
          r.success(e, "Success");
        }),
        (this.showBuildVersionError = function (e, t) {
          ((c = { callerVersion: e, appVersion: t }),
            (l = {
              title: "ui_modal_updaterequired_title",
              message: "",
              leftIcon: "images/warning.png",
              okClass: "btn-primary",
              okText: "ui_ok",
              okVisible: !0,
            }),
            o.open(
              "genericConfirm",
              { data: l },
              { backdropClass: "modal-backdrop-warning" },
            ),
            n((s = "ui_modal_updaterequired_body"), c).then(function (e) {
              l.message = e;
            }));
        }),
        (this.registerWindowsVersion = function (e) {
          k = e;
        }),
        (this.showAvailableDistroUpdate = function (e) {
          var t = 0 < k && k < 10;
          ((c = { distroVersion: e }),
            (l = {
              title: "ui_modal_updateavailable_title",
              message: "",
              okClass: "btn-primary",
              okText: "ui_ok",
              okVisible: !0,
              cancelVisible: !0,
            }),
            (s = "ui_modal_updateavailable_body_distro"),
            t &&
              ((l.title = "ui_modal_updateavailable_body_title"),
              (s = "ui_modal_updateavailable_body_outdated")),
            o.open("genericConfirm", { data: l }).then(function () {
              t || window.ui.updatedistro();
            }),
            n(s, c).then(function (e) {
              l.message = e;
            }));
        }),
        (this.showInstallationWarning = function (e, t) {
          ((u = { runPath: e, steamPath: t }),
            (p = {
              title: "ui_modal_installationpath_error_title",
              message: "",
              leftIcon: "images/warning.png",
              okClass: "btn-default",
              cancelVisible: !0,
              leftVisible: !0,
              left2Visible: !0,
              leftClass: "btn btn-primary",
              left2Class: "btn btn-default",
              leftText: "ui_modal_installationpath_fix_auto_start",
              left2Text: "ui_modal_installationpath_disable_auto_start",
              leftAction: "fix",
              left2Action: "disable",
              leftImg: "images/uac_small.png",
              left2Img: "images/uac_small.png",
            }));
          e = o.open(
            "genericConfirm",
            { data: p },
            { backdropClass: "modal-backdrop-warning" },
          );
          return (
            n((d = "ui_modal_installationpath_error_body"), u).then(
              function (e) {
                p.message = e;
              },
            ),
            e
          );
        }),
        (this.getColorPickerDefaults = function (e) {
          switch (e) {
            case "flat":
              return C;
            case "hueonly":
              return E;
            default:
              return S;
          }
        }));
      var T = function (e, t, a, i) {
        i = (i + e / 60) % 6;
        return a - a * t * Math.max(Math.min(i, 4 - i, 1), 0);
      };
      ((this.convertVec3ToHex = function (e) {
        var t;
        return angular.isString(e)
          ? 3 === (t = e.split(" ")).length
            ? M(
                Math.round(255 * parseFloat(t[0])),
                Math.round(255 * parseFloat(t[1])),
                Math.round(255 * parseFloat(t[2])),
              )
            : e
          : "#000000";
      }),
        (this.convertVec3ToHex_255 = function (e) {
          var t;
          return angular.isString(e)
            ? 3 === (t = e.split(" ")).length
              ? M(
                  Math.round(parseFloat(t[0])),
                  Math.round(parseFloat(t[1])),
                  Math.round(parseFloat(t[2])),
                )
              : e
            : "#000000";
        }),
        (this.convertHueFloatToHex = function (e) {
          var t, a;
          return angular.isNumber(e)
            ? ((e = [
                T((e = 360 * e), (t = 1), (a = 1), 5),
                T(e, t, a, 3),
                T(e, t, a, 1),
              ]),
              M(
                Math.round(255 * e[0]),
                Math.round(255 * e[1]),
                Math.round(255 * e[2]),
              ))
            : "#FF0000";
        }),
        (this.convertHexToVec3 = function (e) {
          e = A(e);
          return e.r / 255 + " " + e.g / 255 + " " + e.b / 255;
        }),
        (this.convertHexToVec3_255 = function (e) {
          e = A(e);
          return e.r + " " + e.g + " " + e.b;
        }),
        (this.convertHexToHueFloat = function (e) {
          var t,
            a,
            i,
            n,
            e = A(e);
          return (
            (t = e.r),
            (a = e.g),
            (e = e.b),
            (i = Math.max(t, a, e)),
            (n = i - Math.min(t, a, e)),
            ([
              60 *
                ((e =
                  n &&
                  (i === t
                    ? (a - e) / n
                    : i === a
                      ? 2 + (e - t) / n
                      : 4 + (t - a) / n)) < 0
                  ? e + 6
                  : e),
              i && n / i,
              i,
            ][0] /
              360) %
              1
          );
        }),
        (this.onProjectNameChanged = function (e) {
          angular.isString(e) && 0 < e.length
            ? (a.captionPrefix = e + " - ")
            : (a.captionPrefix = "Untitled - ");
        }),
        (this.damerauLevenshteinDistance = function (e, t) {
          if (!angular.isString(e) || e.length < 1)
            return angular.isString(t) && 0 < t.length ? t.length : 0;
          if (!angular.isString(t) || t.length < 1)
            return angular.isString(e) && 0 < e.length ? e.length : 0;
          for (
            var a,
              i,
              n,
              o,
              r = e.length,
              s = t.length,
              l = new Array(r + 1),
              c = 0;
            c < l.length;
            ++c
          )
            l[c] = new Array(s + 1);
          for (c = 0; c <= r; ++c) l[c][0] = c;
          for (c = 0; c <= s; ++c) l[0][c] = c;
          for (c = 1; c <= r; c++)
            for (var d = 1; d <= s; d++)
              ((a = e[c - 1] === t[d - 1] ? 0 : 1),
                (i = l[c - 1][d] + 1),
                (n = l[c][d - 1] + 1),
                (o = l[c - 1][d - 1] + a),
                (l[c][d] = Math.min(i, Math.min(n, o))),
                1 < c &&
                  1 < d &&
                  e[c - 1] === t[d - 2] &&
                  e[c - 2] === t[d - 1] &&
                  (l[c][d] = Math.min(l[c][d], l[c - 2][d - 2] + a)));
          return l[r][s];
        }),
        (this.getWallpaperTypeIcon = function (e) {
          var t = "fas fa-pencil-ruler";
          switch (e) {
            case "Video":
              t = "fas fa-film";
              break;
            case "Web":
              t = "fas fa-globe-americas";
              break;
            case "Application":
              t = "fas fa-application";
              break;
            case "Image":
              t = "fas fa-image";
          }
          return t;
        }),
        (this.smartStringCompare = function (e, t) {
          ((e = e.toLowerCase().replace(/[\?\.\!]/g, "")),
            (t = t.toLowerCase().replace(/[\?\.\!]/g, "")));
          return !!(t.includes(e) || x.damerauLevenshteinDistance(t, e) < 3);
        }),
        (this.getQualityPreset = function (e) {
          switch (e) {
            case "low":
              return {
                msaa: "none",
                resolution: "full",
                fps: 10,
                postprocessing: "disabled",
                reflection: !1,
                shadows: "low",
                volumetrics: "low",
                preset: "low",
              };
            case "medium":
              return {
                msaa: "none",
                resolution: "full",
                fps: 15,
                postprocessing: "enabled",
                reflection: !0,
                shadows: "medium",
                volumetrics: "medium",
                preset: "medium",
              };
            case "high":
              return {
                msaa: "x2",
                resolution: "full",
                fps: 25,
                postprocessing: "enabled",
                reflection: !0,
                shadows: "high",
                volumetrics: "high",
                preset: "high",
              };
            case "ultra":
              return {
                msaa: "x2",
                resolution: "full",
                fps: 30,
                postprocessing: "ultra",
                reflection: !0,
                shadows: "ultra",
                volumetrics: "ultra",
                preset: "ultra",
              };
          }
        }),
        (this.getFilename = function (e, t) {
          var a = e.split(/(\\|\/)/g).pop();
          return (a = t ? a.split(/(\.)/g)[0] || a || e : a);
        }),
        (this.isURL = function (e) {
          return (
            e.beginsWith("http://") ||
            e.beginsWith("https://") ||
            e.beginsWith("www.") ||
            e.beginsWith("edge://")
          );
        }),
        (this.openUrl = function (e, t, a) {
          t = n.instant(e, t);
          a
            ? window.ui.openplatformbrowser(t.toString() || e)
            : window.ui.shellexecute(t.toString() || e);
        }),
        (this.addUrlTimestamp = function (e) {
          return angular.isString(e) && 0 < e.length
            ? e + "?refresh=" + new Date().getTime()
            : e;
        }),
        (this.cppInit = function (e, t) {
          (x.setLanguage(e), x.setSteamLanguage(t));
        }),
        (this.setProvider = function (e) {
          f = e;
        }),
        (this.getProvider = function () {
          return f;
        }),
        (this.lockAgeRating = function () {
          e = !0;
        }),
        (this.canSendReports = function () {
          return "steamint" === f;
        }),
        (this.canUseAdminMenu = function () {
          return "steamint" === f;
        }),
        (this.canUseBackup = function () {
          return "steamint" === f;
        }),
        (this.canUseFilterSettings = function () {
          return "wegame" !== f;
        }),
        (this.canUseApprovedTag = function () {
          return "wegame" !== f;
        }),
        (this.canUseAgeRatingTags = function () {
          return "steamint" === f && !0 !== e;
        }),
        (this.canOpenWallpaperDetailsOnPlatform = function () {
          return "steamchina" !== f;
        }),
        (this.canDeleteSubmissionsFromPlatform = function () {
          return "steamchina" === f;
        }),
        (this.canOpenWallpaperDetailsOnWeb = function () {
          return "steamint" === f;
        }),
        (this.canSkipReview = function () {
          return "steamint" === f;
        }),
        (this.canUseDiscover = function () {
          return !1;
        }),
        (this.canUseCollectionsInDiscover = function () {
          return "wegame" !== f;
        }),
        (this.canUseExactMatch = function () {
          return "wegame" !== f;
        }),
        (this.requiresFullAsyncWorkshop = function () {
          return "wegame" === f;
        }),
        (this.useRatingStars = function () {
          return "wegame" !== f;
        }),
        (this.useDynamicWorkshopAuthor = function () {
          return "steamint" === f;
        }),
        (this.canUploadApplications = function () {
          return "wegame" !== f;
        }),
        (this.showOSProviderConnectionOverlay = function () {
          return !0;
        }),
        (this.canShowSpecializedBrowseLists = function () {
          return "wegame" !== f;
        }),
        (this.showFullTagValue = function () {
          return "wegame" !== f;
        }),
        (this.usePlatformBrowser = function () {
          return "wegame" === f;
        }),
        (this.canTakeScreenshots = function () {
          return "wegame" !== f;
        }),
        (this.getDefaultWorkshopTab = function () {
          return "wegame" === f ? "workshop" : "explore";
        }),
        (this.canUseSeasonalTheming = function () {
          return "wegame" !== f;
        }),
        (this.canShowTrialWarning = function () {
          return "wegame" === f;
        }),
        (this.canPublishUnlisted = function () {
          return "steamint" === f;
        }),
        (this.requiresMobileApproval = function () {
          return "wegame" !== f;
        }),
        (this.getWorkshopAgreementURL = function () {
          return "steamint" === f
            ? "steam://url/WorkshopEula/431960/"
            : "steamchina://url/WorkshopEula/431960/";
        }),
        (this.supportsDLCManagement = function () {
          return !0;
        }),
        (this.getWorkshopAgreementHelpURL = function () {
          return "https://help.wallpaperengine.io/mobile/workshop";
        }),
        (this.getAccountPreferencesUrl = function () {
          return n.instant("var_url_platform_account_preferences");
        }),
        (this.getProviderIcon = function (e) {
          return e
            ? "wegame" === f
              ? "fas fa-globe-asia"
              : "fab fa-steam-square"
            : "wegame" === f
              ? "fas fa-globe-asia"
              : "fab fa-steam";
        }),
        (this.canUseMotd = function () {
          return "wegame" !== f;
        }),
        (this.setLanguage = function (e) {
          ("default" === e && angular.isString(g) && (e = g),
            n.use(e).then(function () {
              i(n.refresh);
            }),
            (a.languageClass = "langCSS" + e));
        }),
        (this.setSteamLanguage = function (e) {
          g = e;
        }),
        (this.setAvailableLanguages = function (e) {
          ((w = e).sort(function (e, t) {
            return e.label.localeCompare(t.label);
          }),
            angular.forEach(w, function (t) {
              "en-us" !== t.value &&
                n("system_language_" + t.value).then(function (e) {
                  t.label += " (" + e + ")";
                });
            }));
          var t = {
            label: "Default",
            icon: x.getProviderIcon(!0),
            value: "default",
          };
          (w.splice(0, 0, t),
            n("system_language_" + g).then(function (e) {
              t.label += " (" + e + ")";
            }));
        }),
        (this.getAvailableLanguages = function () {
          return w;
        }));
      var R,
        I = {},
        O =
          ((this.setKnownExtensions = function (e) {
            I = e;
          }),
          (this.isExtension = function (e, t) {
            e = (e = "." + /(?:\.([^.]+))?$/.exec(e)[1]).toLowerCase();
            return 0 <= (I[t] || []).indexOf(e);
          }),
          (this.toDegrees = function (e) {
            return e * (180 / Math.PI);
          }),
          (this.toRadians = function (e) {
            return e * (Math.PI / 180);
          }),
          (this.getElementBounds = function (e) {
            var t = { top: e.position().top, left: e.position().left };
            return (
              (t.bottom = t.top + e.innerHeight()),
              (t.right = t.left + e.innerWidth()),
              t
            );
          }),
          (this.checkBoundsOverlap = function (e, t) {
            return !(
              e.right < t.left ||
              e.left > t.right ||
              e.bottom < t.top ||
              e.top > t.bottom
            );
          }),
          {});
      ((this.updateTexturePreview = function (e) {
        O[e.id] = e.data;
      }),
        (this.getTexturePreviews = function () {
          return O;
        }),
        (this.flushTexturePreviews = function () {
          for (var e in O) O.hasOwnProperty(e) && delete O[e];
        }),
        (this.incrementNameIndex = function (e, t) {
          for (; 0 <= t.indexOf(e);) {
            var a = e.split(" "),
              i = parseInt(a[a.length - 1]);
            return a.length < 2 || i < 2
              ? e + " 2"
              : (a.pop(), a.join(" ") + (i + 1));
          }
          return e;
        }),
        (this.setWrongProviderFound = function () {
          m = !0;
        }),
        (this.showSteamError = function () {
          return o.open("genericConfirm", {
            data: {
              title: "ui_browse_modal_no_steam_title",
              message: m
                ? "ui_browse_modal_no_steam_body_wrong_provider"
                : "ui_browse_modal_no_steam_body",
              okVisible: !0,
            },
          });
        }),
        (this.getStaticExploreQueries = function () {
          var e = [],
            t = [
              "Portrait Standard Definition",
              "Portrait 720 x 1280",
              "Portrait 1080 x 1920",
              "Portrait 1440 x 2560",
              "Portrait 2160 x 3840",
            ],
            a =
              ((e = (e = x.canUseApprovedTag()
                ? e.concat([
                    {
                      querytype: "most_recent",
                      tags: ["Approved"],
                      excludetags: t,
                      emoji: "🏆",
                      priority: 1,
                      title: "ui_browse_explore_category_genre_recent_approved",
                      sticky: !0,
                    },
                    {
                      querytype: "trend_month",
                      tags: ["Approved"],
                      excludetags: t,
                      emoji: "🔥",
                      priority: 0.9,
                      sticky: !0,
                    },
                    {
                      querytype: "trend_year",
                      excludetags: t,
                      tags: ["Approved"],
                    },
                    {
                      querytype: "most_recent",
                      includetags: ["Approved"],
                      tags: ["Mobile"],
                      title: "ui_browse_explore_category_mobile",
                      requiredtaggroups: [t],
                      emoji: "📱",
                      priority: 0.5,
                    },
                  ])
                : e).concat([
                {
                  querytype: "trend_year",
                  tags: ["Audio responsive"],
                  excludetags: ["Relaxing", "Anime", "CGI", "Game"],
                },
                { querytype: "top_rated", tags: ["Abstract"] },
                { querytype: "top_rated", tags: ["Animal"] },
                { querytype: "top_rated", tags: ["Anime"] },
                { querytype: "top_rated", tags: ["Cartoon"] },
                { querytype: "top_rated", tags: ["Cyberpunk"] },
                { querytype: "top_rated", tags: ["Fantasy"] },
                { querytype: "top_rated", tags: ["Game"] },
                { querytype: "top_rated", tags: ["Landscape"] },
                { querytype: "top_rated", tags: ["Medieval"] },
                { querytype: "top_rated", tags: ["MMD", "Anime"] },
                { querytype: "top_rated", tags: ["Nature"] },
                { querytype: "top_rated", tags: ["Pixel art"] },
                { querytype: "top_rated", tags: ["Retro"] },
                { querytype: "top_rated", tags: ["Sci-fi"] },
                { querytype: "top_rated", tags: ["Sports"] },
                { querytype: "top_rated", tags: ["Technology"] },
                { querytype: "top_rated", tags: ["Vehicle"] },
                { querytype: "top_rated", tags: ["Memes"] },
              ])),
              ["Unspecified"]);
          return (
            angular.forEach(e, function (e) {
              ((e.category = "genre"),
                e.includetags || (e.includetags = [e.tags[0]]),
                angular.isArray(e.excludetags)
                  ? (e.excludetags = e.excludetags.concat(a))
                  : (e.excludetags = a));
            }),
            e
          );
        }),
        (this.getSeasonalCollections = function () {
          var t = [];
          return (
            angular.forEach(
              [
                {
                  f: { m: 3, d: 20 },
                  t: { m: 4, d: 20 },
                  e: "🌱",
                  l: "ui_browse_explore_category_seasonal_collection_spring",
                  i: "1884277090",
                },
                {
                  f: { m: 6, d: 19 },
                  t: { m: 7, d: 31 },
                  e: "☀️",
                  l: "ui_browse_explore_category_seasonal_collection_summer",
                  i: "1884277844",
                },
                {
                  f: { m: 9, d: 23 },
                  t: { m: 10, d: 23 },
                  e: "🍂",
                  l: "ui_browse_explore_category_seasonal_collection_fall",
                  i: "1884263373",
                },
                {
                  f: { m: 10, d: 24 },
                  t: { m: 11, d: 2 },
                  e: "🎃",
                  l: "ui_browse_explore_category_seasonal_collection_halloween",
                  i: "1873353144",
                },
                {
                  f: { m: 12, d: 1 },
                  t: { m: 1, d: 31 },
                  e: "❄️",
                  l: "ui_browse_explore_category_seasonal_collection_winter",
                  i: "1884258271",
                },
              ],
              function (e) {
                x.isInDateRangeInclusive(e.f, e.t, !0)
                  ? t.push({
                      category: "collection",
                      itemid: e.i,
                      title: e.l,
                      emoji: e.e,
                      tags: ["Curated"],
                      coversubmission: e.i,
                      sticky: !0,
                      priority: 0.8,
                    })
                  : t.push({
                      category: "collection",
                      itemid: e.i,
                      title: e.l,
                      emoji: e.e,
                      tags: ["Curated"],
                      coversubmission: e.i,
                    });
              },
            ),
            t
          );
        }),
        (this.getBestOfYearQueries = function (n) {
          var o = [];
          return (
            angular.forEach(
              {
                2016: "818603284",
                2017: "932995255",
                2018: "1339064732",
                2019: "1962375063",
                2020: "2292710588",
                2021: "2388299037",
                2022: "2784382079",
                2023: "2944773634",
                2024: "3163333989",
                2025: "3441873795",
                2026: "3696323523",
              },
              function (e, t) {
                t = parseInt(t);
                var a = new Date(t, 0, 1),
                  i = new Date(t + 1, 0, 1),
                  t = {
                    category: "top_year",
                    querytype: "top_rated",
                    title: "ui_browse_explore_category_top_year",
                    year: t,
                    excludetags: n
                      ? ["Anime", "MMD", "Unspecified"]
                      : ["Unspecified"],
                    coversubmission: e,
                    timestampstart: x.getUnixTimestampFromDate(a),
                    timestampend: x.getUnixTimestampFromDate(i),
                  };
                o.push(t);
              },
            ),
            o
          );
        }),
        (this.updateQueryName = function (e) {
          switch (e.category) {
            case "genre":
              e.name = e.category + e.tags[0] + e.querytype;
              break;
            case "creator":
              e.name = e.category + e.itemid + e.querytype;
              break;
            case "collection":
              e.name = e.category + e.itemid;
              break;
            case "keyword":
              e.name = e.category + e.keyword + e.querytype;
              break;
            default:
              e.name = e.category + e.querytype;
          }
          e.custom && (e.name = "custom" + e.name);
        }),
        (this.isInDateRangeInclusive = function (e, t) {
          var a = new Date(),
            i = a.getDate(),
            n = a.getMonth() + 1,
            a = a.getFullYear(),
            a =
              ((e.y && t.y) || ((e.y = a = 0), (t.y = 0)),
              372 * a + 31 * n + i),
            n = 372 * e.y + 31 * e.m + e.d,
            i = 372 * t.y + 31 * t.m + t.d;
          return (i < n && (a < n && (a += 372), (i += 372)), n <= a && a <= i);
        }),
        (this.getUnixTimestampFromDate = function (e) {
          return parseInt((e.getTime() / 1e3).toFixed(0));
        }),
        (this.getActiveEvent = function () {}),
        (this.startHotkeyListener = function (e) {
          ((R = e),
            window.ui.startHotkeyListener(),
            t.on("keydown.hotkey", window.cancelEventImmediately),
            t.on("keypress.hotkey", window.cancelEventImmediately),
            t.on("keyup.hotkey", window.cancelEventImmediately));
        }),
        (this.onHotkeyUpdate = function (e) {
          (angular.isFunction(R) && R(e),
            (e.cancel || e.finished) &&
              ((R = void 0),
              t.off("keydown.hotkey"),
              t.off("keypress.hotkey"),
              t.off("keyup.hotkey")));
        }),
        (this.stopHotkeyListener = function () {
          ((R = void 0),
            t.off("keydown.hotkey"),
            t.off("keypress.hotkey"),
            t.off("keyup.hotkey"),
            window.ui.stopHotkeyListener());
        }),
        (this.isUserHotkeyAction = function (e) {
          return "wallpaper" === e || "playlist" === e || "profile" === e;
        }),
        (this.validateSharedSettings = function (e) {
          ((e.hotkeys = e.hotkeys || []),
            void 0 === e.slideshowwarningenabled &&
              (e.slideshowwarningenabled = !0));
        }),
        (this.getSharedDefaultProperties = function (e) {
          var t = {
            alignment: 0,
            alignmentposition: 50,
            rate: 100,
            volume: 50,
            cameraparallax: !0,
          };
          return (e && (t.schemecolor = ""), t);
        }),
        (this.displayGifWarning = function (e) {
          return o.open(
            "genericConfirm",
            {
              data: {
                title: "ui_editor_importer_gif_warning_header",
                message: "ui_editor_importer_gif_warning_body",
                leftIcon: "images/warning.png",
                okVisible: !0,
                cancelVisible: e,
              },
            },
            { backdropClass: "modal-backdrop-danger" },
          );
        }),
        (this.updatePagination = function (e, t, a) {
          for (
            var i = [],
              n = ((a = a || 1), (t = t || 1), Math.max(1, t - 4)),
              o = Math.min(a, t + 4),
              r = 1;
            r <= a;
            ++r
          )
            (((1 !== r && r < n) || (r !== a && o < r)) &&
              (i.push({ label: "…", class: "normalText" }),
              (r = r < n ? n : a)),
              i.push({ label: r }));
          ((e.current = t), (e.count = a), (e.pages = i));
        }),
        (this.showPaginationPageNumberPrompt = function () {
          var e = {
            title: "ui_modal_pagination_enter_page_title",
            message: "",
            numberInputVisible: !0,
            okVisible: !0,
            cancelVisible: !0,
            numberinput: void 0,
          };
          return o.open("genericConfirm", { data: e }).then(function () {
            return angular.isNumber(e.numberinput) ? e.numberinput : void 0;
          });
        }),
        (this.getPreviewUrl = function (e) {
          return e.previewsmall || e.preview
            ? 'url("' + (e.previewsmall || e.preview) + '")'
            : "";
        }),
        (this.makeLogoAnimation = function (e, t) {
          return lottie.loadAnimation({
            container: e,
            renderer: "svg",
            loop: !0,
            autoplay: !0,
            path: t || "anims/logo_blue.json",
          });
        }),
        (this.assetTypeGroups = {
          layers: [
            "Image",
            "Particle",
            "Sound",
            "Model",
            "Text",
            "Sprite",
            "Fullscreen",
            "Composite",
            "Scripted Layer",
          ],
          effects: ["Effect"],
          scripts: ["Script"],
        }),
        (this.assetGroupType = {
          Image: "layers",
          Particle: "layers",
          Sound: "layers",
          Model: "layers",
          Text: "layers",
          Sprite: "layers",
          Fullscreen: "layers",
          Composite: "layers",
          "Scripted Layer": "layers",
          Effect: "effects",
          Script: "scripts",
        }),
        (this.url = {
          docs: "https://docs.wallpaperengine.io",
          docsScene: "https://docs.wallpaperengine.io/scene/overview.html",
          docsSceneEffects:
            "https://docs.wallpaperengine.io/scene/effects/introduction.html",
          docsSceneParticles:
            "https://docs.wallpaperengine.io/scene/particles/introduction.html",
          docsSceneAnimation:
            "https://docs.wallpaperengine.io/scene/timeline/introduction.html",
          docsSceneUserProperties:
            "https://docs.wallpaperengine.io/scene/userproperties/overview.html",
          docsSceneAudioVisualization: "",
          docsSceneScript:
            "https://docs.wallpaperengine.io/scene/scenescript/introduction.html",
          docsSceneShaders:
            "https://docs.wallpaperengine.io/scene/shader/overview.html",
          docsSceneTextureOptimization:
            "https://docs.wallpaperengine.io/scene/performance/texture.html",
          docsScenePuppetWarp:
            "https://docs.wallpaperengine.io/scene/puppet-warp/introduction.html",
          docsSceneForegroundSeparation:
            "https://docs.wallpaperengine.io/scene/image-preparation/foreground-separation.html",
          docsSceneLightingReflections:
            "https://docs.wallpaperengine.io/scene/lighting/introduction.html",
          docsWeb: "https://docs.wallpaperengine.io/web/overview.html",
          docsWebUserProperties:
            "https://docs.wallpaperengine.io/web/customization/properties.html",
          docsWebAudioVisualization:
            "https://docs.wallpaperengine.io/web/audio/visualizer.html",
          docsWebRGB: "https://docs.wallpaperengine.io/web/api/rgb.html",
          docsWebFPS:
            "https://docs.wallpaperengine.io/web/performance/fps.html",
          docsWebDebugging:
            "https://docs.wallpaperengine.io/web/debug/debug.html",
        }),
        (this.dlc = {
          editorExtensions: {
            id: function () {
              switch (f) {
                case "steamint":
                case "steamchina":
                  return 1790230;
                case "wegame":
                  return 2001765;
              }
            },
            name: "ui_dlc_editor_extensions_name",
            size: "8GB",
            dlSize: "3000MB",
          },
        }),
        (this.getTransitionOptions = function () {
          return [
            {
              label:
                "ui_browse_playlist_modal_settings_transition_none_no_flicker",
              value: "-2",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_none",
              value: "none",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_random",
              value: "random",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_fade",
              value: "0",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_fade_to_black",
              value: "18",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_mosaic",
              value: "1",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_diffuse",
              value: "2",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_horizontal_slide",
              value: "3",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_vertical_slide",
              value: "4",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_horizontal_fade",
              value: "5",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_vertical_fade",
              value: "6",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_clouds",
              value: "7",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_burnt_paper",
              value: "8",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_circular",
              value: "9",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_zipper",
              value: "10",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_door",
              value: "11",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_lines",
              value: "12",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_radial_wipe",
              value: "22",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_zoom",
              value: "13",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_twister",
              value: "19",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_drip",
              value: "14",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_pixelate",
              value: "15",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_bricks",
              value: "16",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_paint",
              value: "17",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_black_hole",
              value: "20",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_crt",
              value: "21",
            },
            {
              label:
                "ui_browse_playlist_modal_settings_transition_glass_shatter",
              value: "23",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_bullets",
              value: "24",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_ice",
              value: "25",
            },
            {
              label: "ui_browse_playlist_modal_settings_transition_boilover",
              value: "26",
            },
          ];
        }),
        (this.getTransitionButtons = function () {
          return x.getTransitionOptions().filter(function (e) {
            return (
              "random" !== e.value && "none" !== e.value && "-2" !== e.value
            );
          });
        }),
        (this.configureTransitionSlider = function () {
          return { hideLimitLabels: !0, floor: 0, ceil: 3e3, step: 50 };
        }),
        (this.transitionPoolSelectAll = function (e, t) {
          t ? delete e.transitionpool : (e.transitionpool = []);
        }),
        (this.transitionPoolToggle = function (e, t, a) {
          var i = e.transitionpool && !e.transitionpool.includes(a),
            n = x.getTransitionButtons(),
            o = n.length;
          i
            ? (e.transitionpool.push(a),
              e.transitionpool.length === o && delete e.transitionpool,
              ((i = angular.copy(e)).transition = a),
              t(i))
            : (e.transitionpool ||
                (e.transitionpool = n.map(function (e) {
                  return e.value;
                })),
              e.transitionpool.findAndRemove(a));
        }),
        (this.isValueUserShortcut = function (e) {
          return (
            angular.isString(e) &&
            (e.startsWith("cmd:") ||
              e.startsWith("file:") ||
              e.startsWith("directory:") ||
              e.startsWith("web:"))
          );
        }),
        a.$on("$translateChangeEnd", function () {
          (angular.isObject(c) &&
            angular.isObject(l) &&
            n(s, c).then(function (e) {
              l.message = e;
            }),
            angular.isObject(u) &&
              angular.isObject(p) &&
              n(d, u).then(function (e) {
                p.message = e;
              }),
            n(["ui_ok", "ui_cancel"]).then(function (e) {
              ((S.chooseText = e.ui_ok.toString()),
                (S.cancelText = e.ui_cancel.toString()),
                (C.chooseText = S.chooseText),
                (C.cancelText = S.cancelText),
                (E.chooseText = S.chooseText),
                (E.cancelText = S.cancelText));
            }));
        }));
    },
  ];

    var host = [
    "$q",
    "$http",
    "$timeout",
    "$translate",
    "$httpParamSerializer",
    "modals",
    "utils",
    function (c, s, t, a, l, r, d) {
      var e,
        p,
        u = this,
        g = {},
        f =
          ((this.setCallErrorSuppressed = function (e, t) {
            g[e + "Callback"] = t;
          }),
          (this.callDeferred = function (e, t) {
            for (
              var a = c.defer(), i = [], n = 2;
              n < arguments.length && !angular.isUndefined(arguments[n]);
              ++n
            )
              i.push(arguments[n]);
            function o() {
              ((window[s] = void 0), (window[l] = void 0));
            }
            var r = t,
              s =
                ("genericSceneAction" === r && 2 < arguments.length
                  ? (r += "_" + arguments[2])
                  : "modelAction" === r &&
                    3 < arguments.length &&
                    (r += "_" + arguments[3]),
                r + "Callback"),
              l = r + "CallbackError";
            return (
              (window[s] = function () {
                (o(), a.resolve.apply(null, arguments));
              }),
              (window[l] = function () {
                (o(),
                  !g[s] &&
                    "queryWorkshopCallback" !== s &&
                    arguments[0] &&
                    d.showError(arguments[0]),
                  a.reject.apply(null, [
                    1 < arguments.length ? arguments[1] : void 0,
                  ]));
              }),
              window[e][t].apply(window[e], i),
              a.promise
            );
          }),
          (this.callEditor = function (e) {
            for (var t = ["editorObject", e], a = 1; a < arguments.length; ++a)
              t.push(arguments[a]);
            return this.callDeferred.apply(null, t);
          }),
          (this.callUI = function (e) {
            for (var t = ["ui", e], a = 1; a < arguments.length; ++a)
              t.push(arguments[a]);
            return this.callDeferred.apply(null, t);
          }),
          (this.logError = function (e) {
            window.ui && window.ui.logError && window.ui.logError(e);
          }),
          (this.getVirtualKeyNames = function () {
            return (e = angular.isUndefined(e)
              ? u.callDeferred("ui", "getVirtualKeyNames")
              : e);
          }),
          (this.selectExternalApp = function (e, t, a) {
            return u.callEditor("selectExternalApp", e).then(function (e) {
              a[t] = e;
            });
          }),
          (this.promptExternalApp = function (e, t, a, i, n, o) {
            return u.callEditor("checkExternalApp", e[t]).catch(function () {
              return r
                .open("genericConfirm", {
                  data: {
                    title: n || "ui_editor_external_app_not_found_title",
                    message: o || "ui_editor_external_app_not_found_body",
                    labelValues: { name: a },
                    okVisible: !0,
                  },
                })
                .then(function () {
                  return u.selectExternalApp(i, t, e);
                })
                .then(function () {
                  u.callEditor("saveEditorSettings", angular.toJson(e));
                });
            });
          }),
          0),
        i =
          ((this.sendRequestWithSteamAuth = function (a, i, n) {
            function o() {
              var e, t;
              return (
                p
                  ? ((e = c.defer()),
                    a.listeners.push(function () {
                      e.resolve();
                    }),
                    e)
                  : ((t = c.defer()),
                    (a.ticket = ""),
                    a.listeners.push(function () {
                      ((p = void 0), t.resolve());
                    }),
                    (p = u.callDeferred("ui", "refreshAuthToken")),
                    t)
              ).promise;
            }
            function r(e) {
              var t = e || c.defer(),
                e = l({ steamauthticket: a.ticket });
              return (
                s
                  .post(i + "?" + e, n)
                  .then(function (e) {
                    t.resolve(e);
                  })
                  .catch(function (e) {
                    if (!(3 < f))
                      return (
                        ++f,
                        console.error("steam rejected user ticket."),
                        o().then(function () {
                          r(t);
                        })
                      );
                    t.reject(e);
                  }),
                t.promise
              );
            }
            var e = c.when();
            return (e = a.ticket && 0 !== a.ticket.length ? e : o()).then(r);
          }),
          (this.getWorkshopUrl = function (e) {
            return e.workshopid
              ? "https://steamcommunity.com/sharedfiles/filedetails/?id=" +
                  e.workshopid
              : void 0;
          }),
          !0),
        n =
          ((this.copyWorkshopUrl = function (e) {
            e = u.getWorkshopUrl(e);
            e &&
              u.callDeferred("ui", "copyToClipboard", e).then(function () {
                i &&
                  ((i = !1),
                  t(function () {
                    i = !0;
                  }, 3e3),
                  a("ui_browse_details_toast_url_copied").then(function (e) {
                    d.showSuccess(e);
                  }));
              });
          }),
          (this.wpxAPIBackendUrl = "https://www.wallpaperengineapi.com"),
          !1),
        o = !1;
      ((this.wpxAPISetDev = function () {
        ((this.wpxAPIBackendUrl = "http://localhost:3000"), (n = !0));
      }),
        (this.wpxAPIGet = function (e) {
          function t() {
            s.get("http://www.wallpaperengineapi.com" + e, { timeout: 6e3 })
              .then(function (e) {
                ((o = !0), a.resolve(e));
              })
              .catch(function (e) {
                a.reject(e);
              });
          }
          var a = c.defer();
          return (
            o
              ? t()
              : s
                  .get(u.wpxAPIBackendUrl + e, { timeout: 6e3 })
                  .then(function (e) {
                    a.resolve(e);
                  })
                  .catch(function (e) {
                    n ? a.reject(e) : t();
                  }),
            a.promise
          );
        }),
        (this.isAPIDNSBlocked = function () {
          return o;
        }));
    },
  ];

    var editorEffectListModalCtrl = [
      "$scope",
      "$uibModalInstance",
      "$timeout",
      "$translate",
      "modals",
      "utils",
      "host",
      "data",
      function (s, e, t, a, o, l, i, n) {
        function r(t, e) {
          ((e = e || s.groupList),
            angular.forEach(e, function (e) {
              (angular.isArray(e.items) && e.items.findAndRemove(t),
                angular.isArray(e.nestedGroupList) && r(t, e.nestedGroupList));
            }));
        }
        function c() {
          function i(e) {
            return (
              !t.empty() &&
              !a.instant(e.name).toString().toLowerCase().includes(t)
            );
          }
          var t = s.search.text.trim().toLowerCase();
          angular.forEach(s.groupList, function (e) {
            var a = 0;
            (angular.forEach(e.items, function (e) {
              var t;
              (angular.isArray(e.variants)
                ? ((t = i(e)),
                  angular.forEach(e.variants, function (e) {
                    t = t && i(e);
                  }),
                  (e.filtered = t))
                : (e.filtered = i(e)),
                e.filtered || ++a);
            }),
              angular.forEach(e.nestedGroupList, function (e) {
                var t = 0;
                (angular.forEach(e.items, function (e) {
                  ((e.filtered = i(e)), e.filtered || (++a, ++t));
                }),
                  (e.filtered = 0 === t));
              }),
              (e.filtered = 0 === a));
          });
        }
        function d(e) {
          (e.videopreview &&
            (e.videopreviewurl = "videos/previews/" + e.videopreview + ".webm"),
            e.previewimg && (e.previewsmall = e.previewimg),
            (e.title = a.instant(e.name)),
            (e.status = "downloadable"));
        }
        function p(t) {
          var a = !1;
          if (angular.isArray(t.variants)) {
            var e = t.variants,
              i = t.options && t.options.droplistOptions;
            if (angular.isArray(e) && angular.isArray(i))
              for (var n = 0; n < i.length; ++n) {
                var o,
                  r = i[n];
                angular.isNumber(r.value) &&
                  r.value < e.length &&
                  (((o = e[r.value]).name = r.label),
                  (o.droplistIndex = r.value));
              }
            angular.forEach(t.variants, d);
          } else d(t);
          (angular.forEach(s.groupList, function (e) {
            (e.group !== t.group && (t.group || "empty" !== e.group)) ||
              a ||
              (t.nestedgroup
                ? (angular.forEach(e.nestedGroupList, function (e) {
                    e.nestedgroup === t.nestedgroup &&
                      (e.items.push(t),
                      (a = !0),
                      e.items.sort(function (e, t) {
                        return e.name.localeCompare(t.name);
                      }));
                  }),
                  a ||
                    (e.nestedGroupList.push({
                      name: l.translateTagInstant(t.nestedgroup) || "",
                      items: [t],
                      nestedgroup: t.nestedgroup,
                      visible: !0,
                      open: !0,
                    }),
                    e.nestedGroupList.sort(function (e, t) {
                      return e.name.localeCompare(t.name);
                    })))
                : (e.items.push(t), (a = !0)),
              (e.visible = !0),
              a &&
                ((t.nogallery = e.nogallery),
                (t.nogalleryvariantexpansion = e.nogalleryvariantexpansion)));
          }),
            c());
        }
        (((window.effectListModalCtrl = s).galleryMode = n.disableGallery
          ? "list"
          : window.effectListModalGalleryMode),
          (s.dataUI = n.ui),
          (s.workshopController = n.workshopController),
          (s.inputList = n.groupList),
          (s.showAssetCreation = n.showAssetCreation),
          (s.fnCreateNew = n.fnCreateNew),
          (s.fnDelete = n.fnDelete),
          (s.currentSelection = void 0),
          (s.disableGallery = n.disableGallery),
          (s.wallpaperThumbnailConfig = {
            videosupport: !0,
            removePseudoElements: !0,
          }),
          (s.groupList = [
            {
              group: "workshop",
              name: "ui_editor_effects_modal_group_workshop",
              visible: !1,
              filtered: !1,
              open: !0,
              nestedGroupList: [],
              items: [],
              nogalleryvariantexpansion: !0,
            },
            {
              group: "localeffects",
              name: "ui_editor_effects_modal_group_my_effects",
              visible: !1,
              filtered: !1,
              open: !0,
              items: [],
              nogallery: !0,
            },
            {
              group: "preset",
              name: "ui_editor_effects_modal_group_presets",
              visible: !1,
              filtered: !1,
              open: !0,
              items: [],
            },
            {
              group: "renderable",
              name: "ui_editor_effects_modal_group_renderables",
              visible: !1,
              filtered: !1,
              open: !0,
              items: [],
              nogallery: !0,
            },
            {
              group: "utility",
              name: "ui_editor_effects_modal_group_utilities",
              visible: !1,
              filtered: !1,
              open: !0,
              items: [],
              nogallery: !0,
            },
            {
              group: "animate",
              name: "ui_editor_effects_modal_group_animate",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "interactive",
              name: "ui_editor_effects_modal_group_interactive",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "blur",
              name: "ui_editor_effects_modal_group_blur",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "colorize",
              name: "ui_editor_effects_modal_group_colorize",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "distort",
              name: "ui_editor_effects_modal_group_distort",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "enhance",
              name: "ui_editor_effects_modal_group_enhance",
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
            {
              group: "empty",
              name: void 0,
              visible: !1,
              filtered: !1,
              open: !0,
              gallerycombineitems: !0,
              items: [],
            },
          ]),
          (s.search = { text: "" }),
          (s.selected = {}),
          n.disableGallery &&
            angular.forEach(s.groupList, function (e) {
              e.nogallery = !0;
            }),
          angular.forEach(n.groupList, p),
          (s.title = n.title),
          (s.colorPickerOptions = l.getColorPickerDefaults()),
          0 < s.groupList.length && (s.selected.group = s.groupList[0]),
          (s.close = function () {
            e.dismiss("cancel");
          }),
          (s.ok = function () {
            e.close(s.selected.item);
          }),
          (s.browseWorkshop = function () {
            n.workshopModalFn(n.workshopGroup);
          }),
          (s.registerSteamUser = function (e) {
            var t = s.steamUserInfos[e.id] || {};
            ((t.name = e.name),
              (t.avatar = e.avatar),
              (s.steamUserInfos[e.id] = t));
          }),
          (s.providerIcon = l.getProviderIcon()),
          (s.openSteamUserPage = function (e) {
            if (angular.isString(e) && (e.indexOf("http://") === 0 || e.indexOf("https://") === 0)) {
              l.openUrl(e, {}, l.usePlatformBrowser && l.usePlatformBrowser());
            } else {
              l.openUrl("var_url_userpage", { id: e });
            }
          }),
          (s.openSteamWorkshopPage = function (e) {
            l.openUrl(e.workshopurl);
          }),
          (s.openInfoLinkPage = function () {
            l.openUrl(s.dataUI.infoLink);
          }),
          (s.unsubscribeWorkshopItem = function (e) {
            s.workshopController
              .unsubscribeWorkshopItem(e.name, e.workshopid)
              .then(function () {
                (r(e), (s.selected.item = void 0));
              });
          }),
          (s.createNew = function (i) {
            var n = angular.isDefined(i),
              e = (n && i.name) || "";
            return a(
              n
                ? "ui_editor_effect_list_modal_create_duplicate_effect_body"
                : "ui_editor_effect_list_modal_create_new_effect_body",
              { effect: a.instant(e).toString() },
            ).then(function (e) {
              var t = {
                  title: n
                    ? "ui_editor_effect_list_modal_create_duplicate_effect_header"
                    : "ui_editor_effect_list_modal_create_new_effect_header",
                  message: e,
                  cancelVisible: !0,
                  okVisible: !0,
                  textinputVisible: !0,
                  textinput: "",
                  textinputRequired: !0,
                },
                a = (n && angular.copy(i)) || {
                  path: "effects/_empty/effect.json",
                };
              o.open("genericConfirm", { data: t })
                .then(function () {
                  return ((a.name = t.textinput), s.fnCreateNew(a));
                })
                .then(function (e) {
                  ((s.selected.item = e), s.ok());
                });
            });
          }),
          (s.deleteItem = function (e) {
            return a("ui_editor_effect_list_modal_delete_effect_body", {
              effect: e.name,
            })
              .then(function (e) {
                return o.open(
                  "genericConfirm",
                  {
                    data: {
                      title: "ui_editor_effect_list_modal_delete_effect_header",
                      message: e,
                      leftIcon: "images/warning.png",
                      cancelVisible: !0,
                      okVisible: !0,
                    },
                  },
                  { backdropClass: "modal-backdrop-danger" },
                );
              })
              .then(function () {
                (r(e), s.fnDelete(e), (s.selected.item = void 0));
              });
          }),
          (s.applyUserVote = function (e, t) {
            e === s.selected.item.workshopid && (s.selected.item.uservote = t);
          }),
          (s.rebuildGalleryPreviews = function () {
            var a = [];
            (angular.forEach(s.groupList, function (e) {
              e &&
                e.items &&
                0 !== e.items.length &&
                angular.forEach(e.items, function (t) {
                  t.preview
                    ? a.push({ path: t.path, preview: t.preview })
                    : angular.isArray(t.variants) &&
                      angular.forEach(t.variants, function (e) {
                        a.push({ path: t.path, preview: e.preview });
                      });
                });
            }),
              i.callEditor("exportListModalPreviews", a));
          }),
          (s.callbackGalleryAllMouse = function (e, t) {
            var a, i, n;
            (("left" !== e && "dbl" !== e) ||
              ((s.currentSelection = t),
              (i = t),
              angular.forEach(s.groupList, function (e) {
                angular.forEach(e.items, function (t) {
                  angular.forEach(t.variants, function (e) {
                    e === i && (n = t);
                  });
                });
              }),
              (a = n),
              console.log("variantParent", a),
              (s.selected.item = a || t),
              a && (a.options.droplistSelected = t.droplistIndex)),
              "dbl" === e && s.ok());
          }),
          s.$watch("selected.item", function (e, t) {
            angular.isObject(e) &&
              e !== t &&
              (e.preview && !e.isworkshopasset
                ? i.callEditor("startEffectPreview", e.path || "", e.preview)
                : e.options &&
                  e.options.droplistOptions &&
                  (("gallery" === s.galleryMode && !e.isworkshopasset) ||
                    (e.options.droplistSelected =
                      e.options.droplistOptions[0].value),
                  e.variants) &&
                  !e.isworkshopasset &&
                  i.callEditor(
                    "startEffectPreview",
                    e.path,
                    e.variants[e.options.droplistSelected].preview,
                  ),
              s.workshopController) &&
              (e.authorsteamid &&
                s.workshopController.requestSteamUserInfo(e.authorsteamid),
              e.workshopid) &&
              s.workshopController.getUserVote(e.workshopid);
          }),
          s.$watch("selected.item.options.droplistSelected", function (e, t) {
            angular.isObject(s.selected.item) &&
              angular.isArray(s.selected.item.variants) &&
              angular.isObject(s.selected.item.variants[e]) &&
              angular.isString(s.selected.item.variants[e].preview) &&
              e !== t &&
              !e.isworkshopasset &&
              i.callEditor(
                "startEffectPreview",
                s.selected.item.path,
                s.selected.item.variants[e].preview,
              );
          }),
          s.$watch(
            "inputList",
            function (e) {
              angular.isArray(e) &&
                (!(function t(e) {
                  angular.forEach(e, function (e) {
                    (angular.isArray(e.items) &&
                      e.items.findAndRemove(function (e) {
                        return angular.isString(e.workshopid);
                      }),
                      angular.isArray(e.nestedGroupList) &&
                        t(e.nestedGroupList));
                  });
                })(s.groupList),
                angular.forEach(
                  e.filter(function (e) {
                    return angular.isString(e.workshopid);
                  }),
                  p,
                ));
            },
            !0,
          ),
          s.workshopController && s.workshopController.callbacks.push(s),
          s.$on("$destroy", function () {
            ((window.effectListModalCtrl = null),
              n.disableGallery ||
                (window.effectListModalGalleryMode = s.galleryMode),
              i.callEditor("stopEffectPreview"),
              s.workshopController &&
                s.workshopController.callbacks.findAndRemove(s));
          }),
          s.$watch("search.text", c));
      },
    ];

    // The queue payload is the whole arguments list of the registration call:
    // ["<name>", <DI array with the factory function>]. Both elements are needed,
    // the name included, because bootstrap does provider[method].apply(provider, args).
    var patched = {
      "$provide:service:utils": ["utils", utils],
      "$provide:service:host": ["host", host],
      "$controllerProvider:register:EditorEffectListModalCtrl": [
        "EditorEffectListModalCtrl",
        editorEffectListModalCtrl,
      ],
    };

    // Replace the queue payload in place; never append new entries.
    var queue = app._invokeQueue;
    for (var i = 0; i < queue.length; i++) {
      var entry = queue[i];
      var key = entry[0] + ":" + entry[1] + ":" + entry[2][0];
      if (patched.hasOwnProperty(key)) entry[2] = patched[key];
    }
  })();

  // WEP templates are registered with a separate run block. Run blocks execute
  // in registration order, so these puts run after the base's own template run
  // block and win: $templateCache is a plain map and the last put wins.
  angular.module("wallpaperbrowserApp").run([
    "$templateCache",
    function (e) {
      (e.put(
          "views/templates/titlebar.html",
          '<div class="titlebar" ng-hide="hideTitle"> <button class="titlebarBtn closeButton" ng-click="closeWindow()"> <div class="fal fa-times closeButtonIcon"> </div> </button> <button ng-if="!isDialog" class="titlebarBtn windowButton" tooltip="ui_title_maximize" ng-disabled="!maximizeEnabled || isMiniMode" onclick="window.ui.maximize()"> <div class="far" ng-class="{\'fa-square\':!isMaximized,\'fa-window-restore\':isMaximized}"> </div> </button> <button ng-if="!isDialog" class="titlebarBtn windowButton" onclick="window.ui.minimize()"> <div class="fal fa-minus"> </div> </button> <button ng-if="showMiniMode && !isMaximized" tooltip="ui_title_mini_mode" class="titlebarBtn miniModeBtn" ng-click="sendToggleMiniMode()"> <div class="fas" ng-class="{\'fa-chevron-double-right\':!isMiniMode, \'fa-chevron-double-left\':isMiniMode}"> </div> </button> <div class="title"> <span ng-bind="captionPrefix"></span><span translate="{{caption}}" translate-values="captionValues"></span> </div> <div class="browseWallpaperVersionContainer center" ng-if="appUpdate && (!caption || caption === \'ui_caption_browse\') && !isMiniMode" style="position:absolute;top:24px;left:0;right:0;margin:0 auto;width:max-content;display:flex;align-items:center;justify-content:center;gap:6px;user-select:none;pointer-events:auto;-webkit-app-region:no-drag;"> <span style="display:inline-flex;align-items:center;height:18px;font-size:10.5px;opacity:0.65;font-family:sans-serif;cursor:pointer;white-space:nowrap;" ng-click="initUpdateCheck(true, $event)" tooltip="ui_wep_update_check_tooltip">WEngine+ {{appUpdate.current_version || \'2.0.0\'}}</span> <span ng-if="appUpdate.checking" style="display:inline-flex;align-items:center;height:18px;font-size:10.5px;opacity:0.6;gap:4px;"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_update_checking"></span></span> <span ng-if="appUpdate.upToDateNotice" class="label label-default" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 6px;font-size:10px;font-weight:500;border-radius:3px;margin:0;"><span translate="ui_wep_update_latest"></span></span> <span ng-if="appUpdate.has_update && appUpdate.status !== \'downloading\' && appUpdate.status !== \'installing\'" style="display:inline-flex;align-items:center;gap:5px;"><span class="label label-success" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 6px;font-size:10px;font-weight:500;border-radius:3px;margin:0;"><span translate="ui_wep_update_available" translate-values="{version: appUpdate.latest_version}"></span></span> <button type="button" class="btn btn-xs btn-success" ng-click="startAppUpdate()" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 8px;font-size:10px;border-radius:3px;margin:0;gap:3px;"><span class="fas fa-arrow-alt-circle-up"></span> <span translate="ui_wep_update_btn"></span></button></span> <span ng-if="appUpdate.status === \'downloading\'" style="display:inline-flex;align-items:center;gap:5px;"><span class="label label-info" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 8px;font-size:10px;font-weight:500;border-radius:3px;margin:0;gap:4px;"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_update_downloading" translate-values="{progress: (appUpdate.progress | number:0)}"></span></span></span> <span ng-if="appUpdate.status === \'installing\'" style="display:inline-flex;align-items:center;gap:5px;"><span class="label label-warning" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 8px;font-size:10px;font-weight:500;border-radius:3px;margin:0;gap:4px;"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_update_installing"></span></span></span> <span ng-if="appUpdate.error" style="display:inline-flex;align-items:center;gap:5px;"><span class="label label-danger" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 6px;font-size:10px;font-weight:500;border-radius:3px;margin:0;gap:4px;" tooltip="{{appUpdate.error}}"><span class="fas fa-exclamation-triangle"></span> <span translate="ui_wep_update_failed"></span></span> <button type="button" class="btn btn-xs btn-warning" ng-click="startAppUpdate()" style="display:inline-flex;align-items:center;justify-content:center;height:18px;line-height:18px;box-sizing:border-box;padding:0 8px;font-size:10px;border-radius:3px;margin:0;"><span translate="ui_retry"></span></button></span> </div> </div> ',
        ),
        e.put(
          "views/modals/steamloginmodal.html",
          '<div class="modalContainer" style="min-width: 420px; max-width: 480px; margin: 0 auto;"> <div class="modal-header"> <h4 class="modal-title" style="margin:0;"><span class="fab fa-steam" style="margin-right:8px;"></span><span translate="ui_wep_steam_login_title"></span></h4> </div> <div class="modal-body text-center" style="padding: 24px 20px;"> <div ng-if="status == \'loading\'"> <div style="font-size:16px;margin-bottom:12px;"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_steam_connecting"></span></div> <p class="text-muted" style="font-size:12px;" translate="ui_wep_steam_init_session"></p> </div> <div ng-if="status == \'logged_in\'"> <div style="font-size:48px;color:#5cb85c;margin-bottom:12px;"><span class="fas fa-check-circle"></span></div> <h4 style="margin: 4px 0 12px 0;"><span translate="ui_wep_logged_in_as"></span> <b>{{accountName}}</b></h4> <p class="text-muted" style="font-size:13px;" translate="ui_wep_steam_adult_unlocked"></p> <div style="margin-top:20px;"> <button class="btn btn-warning" ng-click="logout()"><span class="fas fa-sign-out-alt"></span> <span translate="ui_wep_btn_switch_logout"></span></button> </div> </div> <div ng-if="status != \'logged_in\' && status != \'success\'"> <div style="display:flex;gap:8px;margin-bottom:14px;"> <button type="button" class="btn btn-sm" ng-class="{\'btn-primary\': mode===\'qr\', \'btn-default\': mode!==\'qr\'}" ng-click="setMode(\'qr\')"><span class="fas fa-qrcode"></span> <span translate="ui_wep_mode_qr"></span></button> <button type="button" class="btn btn-sm" ng-class="{\'btn-primary\': mode===\'password\', \'btn-default\': mode!==\'password\'}" ng-click="setMode(\'password\')"><span class="fas fa-key"></span> <span translate="ui_wep_mode_password"></span></button> <button type="button" class="btn btn-sm" ng-class="{\'btn-primary\': mode===\'cookie\', \'btn-default\': mode!==\'cookie\'}" ng-click="setMode(\'cookie\')"><span class="fas fa-cookie-bite"></span> <span translate="ui_wep_mode_cookie"></span></button> <button type="button" class="btn btn-sm" ng-class="{\'btn-primary\': mode===\'system\', \'btn-default\': mode!==\'system\'}" ng-click="setMode(\'system\')"><span class="fab fa-steam"></span> <span translate="ui_wep_mode_system"></span></button> </div> </div> <div ng-if="mode===\'system\' && status != \'success\' && status != \'logged_in\'" style="text-align:center;padding:16px 8px;"> <div style="font-size:42px;color:#66c0f4;margin-bottom:12px;"><span class="fab fa-steam"></span></div> <p style="font-size:13px;margin-bottom:16px;" translate="ui_wep_system_login_hint"></p> <button type="button" class="btn btn-primary" ng-click="loginSystemAccount()" ng-disabled="credBusy"> <span ng-if="credBusy" class="fas fa-spinner fa-spin"></span> <span ng-if="!credBusy"><span class="fas fa-shield-alt"></span> <span translate="ui_wep_btn_login_system"></span></span> </button> </div> <div ng-if="status == \'waiting_qr\' && mode===\'qr\'"> <p style="font-size:14px;margin-bottom:16px;"><span translate="ui_wep_qr_scan_prefix"></span> <b>Steam Mobile App</b> <span translate="ui_wep_qr_scan_suffix"></span></p> <div style="background:#fff;padding:14px;display:inline-block;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:240px;max-height:240px;" ng-bind-html="qrSvg"></div> <div style="margin-top:16px;font-size:12px;" class="text-muted"> <span translate="ui_wep_qr_waiting"></span> <span class="fas fa-spinner fa-spin" style="margin-left:6px;"></span> </div> </div> <div ng-if="mode===\'cookie\' && status != \'success\' && status != \'logged_in\'"> <form ng-submit="submitCookie()" style="text-align:left;margin-top:8px;"> <p class="text-muted" style="font-size:12px;margin-bottom:10px;"><span translate="ui_wep_cookie_hint_prefix"></span> <code>steamLoginSecure</code> <span translate="ui_wep_cookie_hint_suffix"></span></p> <div class="form-group"> <label style="font-size:12px;color:#aaa;" translate="ui_wep_cookie_value_label"></label> <textarea class="form-control" rows="2" ng-model="cookieForm.cookie" placeholder="{{\'ui_wep_cookie_placeholder\' | translate}}" autofocus></textarea> </div> <div class="form-group" style="margin-bottom:12px;"> <label style="font-size:12px;color:#aaa;" translate="ui_wep_steamid_label"></label> <input type="text" class="form-control input-sm" ng-model="cookieForm.steamid" placeholder="76561198000000000"> </div> <button type="submit" class="btn btn-primary fullWidth" ng-disabled="credBusy || !cookieForm.cookie"> <span ng-if="!credBusy"><span class="fas fa-sign-in-alt"></span> <span translate="ui_wep_btn_login_cookie"></span></span> <span ng-if="credBusy"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_btn_validating_cookie"></span></span> </button> </form> </div> <div ng-if="mode===\'password\' && status != \'success\' && status != \'logged_in\'"> <form ng-submit="submitLogin()" style="text-align:left;margin-top:8px;"> <div class="form-group"> <label style="font-size:12px;color:#aaa;" translate="ui_wep_username"></label> <input type="text" class="form-control" ng-model="credentials.username" placeholder="{{\'ui_wep_username_placeholder\' | translate}}" autocomplete="username" style="background:#1a2030;color:#fff;border:1px solid #444;"> </div> <div class="form-group"> <label style="font-size:12px;color:#aaa;" translate="ui_wep_password"></label> <input type="password" class="form-control" ng-model="credentials.password" placeholder="{{\'ui_wep_password_placeholder\' | translate}}" autocomplete="current-password" style="background:#1a2030;color:#fff;border:1px solid #444;"> </div> <button type="submit" class="btn btn-primary btn-block" ng-disabled="credBusy"> <span ng-if="credBusy" class="fas fa-spinner fa-spin"></span> <span ng-if="!credBusy"><span class="fas fa-sign-in-alt"></span> <span translate="ui_wep_btn_sign_in"></span></span> </button> <p class="text-muted" style="font-size:11px;margin-top:8px;" translate="ui_wep_f2p_hint"></p> </form> </div> <div ng-if="status == \'success\'"> <div style="font-size:48px;color:#5cb85c;margin-bottom:12px;"><span class="fas fa-check-circle"></span></div> <h4 translate="ui_wep_steam_success"></h4> <p class="text-success"><span translate="ui_wep_welcome"></span> <b>{{accountName}}</b></p> </div> <div ng-if="status == \'error\'"> <div style="font-size:44px;color:#d9534f;margin-bottom:12px;"><span class="fas fa-exclamation-triangle"></span></div> <h4 class="text-danger" style="margin-bottom:8px;" translate="ui_wep_auth_error"></h4> <p style="font-size:12px;color:#ccc;word-break:break-word;">{{errorMessage}}</p> <div style="margin-top:16px;"> <button class="btn btn-primary" ng-click="retry()"><span class="fas fa-redo"></span> <span translate="ui_wep_btn_try_again"></span></button> </div> </div> </div> <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;"> <div style="font-size:11px;color:#888;"> <span class="fas fa-shield-alt"></span> <span translate="ui_wep_session_saved"></span></div> <div> <button class="btn btn-default" ng-click="close()" translate="ui_close"></button> </div> </div> </div> ',
        ),
        e.put(
          "views/modals/addaccountmodal.html",
          '<div class="modalContainer" style="min-width: 440px; max-width: 480px; margin: 0 auto;"> <div class="modal-header"> <h4 class="modal-title" style="margin:0;"><span class="fas fa-user-plus" style="margin-right:8px;"></span><span translate="ui_wep_add_account_title"></span></h4> </div> <div class="modal-body" style="padding: 20px;"> <div style="display:flex;gap:10px;margin-bottom:16px;"> <button type="button" class="btn" style="flex:1;" ng-class="{\'btn-primary\': mode === \'qr\', \'btn-default\': mode !== \'qr\'}" ng-click="setMode(\'qr\')"><span class="fas fa-qrcode"></span> <span translate="ui_wep_mode_qr"></span></button> <button type="button" class="btn" style="flex:1;" ng-class="{\'btn-primary\': mode === \'manual\', \'btn-default\': mode !== \'manual\'}" ng-click="setMode(\'manual\')"><span class="fas fa-key"></span> <span translate="ui_wep_mode_password"></span></button> </div> <div ng-if="mode === \'qr\'" style="text-align:center;"> <div ng-if="qrStatus === \'generating\'" style="padding:24px 10px;"> <span class="fas fa-spinner fa-spin" style="font-size:24px;color:#66c0f4;"></span> <p style="margin-top:10px;font-size:12px;color:#aaa;" translate="ui_wep_generating_qr"></p> </div> <div ng-if="qrStatus === \'waiting_qr\'"> <p style="font-size:12px;margin-bottom:10px;" translate="ui_wep_scan_mobile"></p> <pre style="font-family:monospace;font-size:9.5px;line-height:1;letter-spacing:0;background:#fff;color:#000;padding:12px;display:inline-block;border-radius:6px;user-select:none;margin:0 auto;box-shadow:0 4px 12px rgba(0,0,0,0.3);overflow:hidden;">{{qrText}}</pre> <div style="margin-top:12px;font-size:11px;color:#aaa;"><span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_waiting_confirmation"></span></div> </div> <div ng-if="qrStatus === \'success\'" style="padding:24px 10px;color:#5cb85c;"> <span class="fas fa-check-circle" style="font-size:36px;"></span> <h4 style="margin-top:10px;"><span translate="ui_wep_account_added_prefix"></span> <b>{{successUsername}}</b> <span translate="ui_wep_account_added_suffix"></span></h4> </div> <div ng-if="qrStatus === \'error\'" style="padding:15px;color:#d9534f;"> <span class="fas fa-exclamation-triangle" style="font-size:30px;"></span> <p style="margin-top:8px;font-size:12px;">{{error}}</p> <button class="btn btn-primary btn-sm" ng-click="startQr()"><span class="fas fa-redo"></span> <span translate="ui_retry"></span></button> </div> </div> <div ng-if="mode === \'manual\'"> <p class="text-muted" style="font-size:12px;margin-bottom:15px;" translate="ui_wep_manual_hint"></p> <div class="form-group" style="margin-bottom:14px;"> <label style="font-size:12px;display:block;margin-bottom:5px;" translate="ui_wep_username"></label> <input type="text" class="form-control" ng-model="account.username" placeholder="{{\'ui_wep_username_placeholder\' | translate}}" autofocus> </div> <div class="form-group" style="margin-bottom:14px;"> <label style="font-size:12px;display:block;margin-bottom:5px;" translate="ui_wep_password"></label> <input type="password" class="form-control" ng-model="account.password" placeholder="{{\'ui_wep_password_placeholder\' | translate}}"> </div> <div ng-if="error" class="text-danger" style="font-size:12px;margin-top:10px;"><span class="fas fa-exclamation-triangle"></span> {{error}}</div> </div> </div> <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;"> <button class="btn btn-default" ng-click="cancel()" translate="ui_cancel"></button> <button ng-if="mode === \'manual\'" class="btn btn-primary" ng-disabled="saving || !account.username" ng-click="save()"> <span ng-if="saving" class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_btn_add_account"></span> </button> </div> </div> ',
        ),
        e.put(
          "views/views/browsewallpapers.html",
'<style> .browseWallpaperSearchContainerSort { min-width: 280px !important; width: auto !important; max-width: 420px !important; display: inline-flex !important; align-items: center !important; } .browseWallpaperSearchContainerSort > droplist { min-width: 250px !important; width: auto !important; flex: 1 1 auto !important; } .browseWallpaperSearchContainerSort .dropDownComboBox { width: 100% !important; min-width: 250px !important; } .browseWallpaperSearchContainerSort .dropDownComboBox button { width: 100% !important; min-width: 250px !important; white-space: nowrap !important; } .tag-chip { margin: 2px !important; border-radius: 4px !important; font-size: 11px !important; user-select: none !important; } .browseFilterActiveClass { display: none !important; } .tag-chip-excluded { text-decoration: none !important; opacity: 0.9 !important; } .filterHelperGroup { margin-bottom: 12px; } .filterHelperLabel { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; margin-bottom: 4px; display: block; } .browseWallpaperDetailsWorkshopRateRow { min-height: 24px !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 4px 0 !important; } .browseWallpaperDetailsWorkshopRateRowRating { position: static !important; min-height: 20px !important; display: flex !important; align-items: center !important; justify-content: center !important; min-width: 0 !important; } .browseWallpaperDetailsWorkshopRateRowRatingStars { position: static !important; display: inline-flex !important; align-items: center !important; top: auto !important; left: auto !important; } .browseWallpaperDetailsWorkshopRateRowRatingScore { position: static !important; display: inline-block !important; top: auto !important; } .browseWallpaperDetailsWorkshopRateRowRating:hover .browseWallpaperDetailsWorkshopRateRowRatingStars { display: inline-flex !important; } .browseWallpaperDetailsWorkshopRateRowRating:hover .browseWallpaperDetailsWorkshopRateRowRatingScore { display: inline-block !important; } .browseWallpaperDetailsWorkshopRateRowRatingButtons { display: none !important; } .browseWallpaperDetailsWorkshopRateRowRatingButtonsLeft { display: none !important; } .browseWallpaperDetailsWorkshopRateRowRatingButtonsRight { display: none !important; } </style><div class="clientArea responsive"> \x3c!--     <div class="browseAlert browsePiracyAlert ng-hide" ng-show="showPirateWarning">\r\n        <uib-alert type="danger">\r\n            <div translate="ui_alert_connect_steam"></div>\r\n        </uib-alert>\r\n    </div> --\x3e <div class="browseWallpaperBrowseContainer"> <div class="browseWallpaperBrowseContainerLeft"> <div class="browseWallpaperBrowseContainerLeftTop"> <div class="browseWallpaperMonitorHeader" ng-if="showMonitorRow"> <div class="browseWallpaperMonitorChangeButton"> <a ng-click="toggleMonitorSelection()" class="browseWallpaperConfigHeaderLink"> <h1 class="browseWallpaperConfigHeader">{{(wallpaperConfigGroup==\'screensaver\' ? \'ui_browse_screensaver\' : \'ui_browse_monitor\' | translate) + \' \' + (showMonitorIndex ? selectedMonitor.index + 1 : \'\') + \' \' + (selectedMonitor.isSplit ? (\'ui_browse_split\' | translate) + \' \' + selectedMonitor.splitIndex : \'\')}}</h1> <button ng-if="wallpaperConfigGroup==\'wallpaper\'" class="btn btn-default btnPill" translate="ui_browse_choose_monitor"></button> <div ng-if="wallpaperConfigGroup==\'screensaver\'" ng-click="$event.stopPropagation()" style="padding: 3px 9px 3px 0;cursor:default;"> <button ng-click="openSystemWallpaperDialog();stopEvt($event)" class="btn btn-default btnPill"><span class="fab fa-windows"></span> <span class="btnPillLabel" translate="ui_browse_windows_screensaver_settings"></span></button> <button ng-click="changeConfigGroup(\'wallpaper\');stopEvt($event)" class="btn btn-danger btnPill"><span class="fas fa-times"></span> <span class="btnPillLabel" translate="ui_browse_close_screensaver"></span></button> </div> </a> </div> </div> <div class="browseAlert ng-hide" ng-show="showMotdMessage"> <uib-alert close="showMotdMessage=false"> <div style="display:flex;align-items:center;"> <div>{{motdMessage|translate}}</div> </div> </uib-alert> </div> <div class="browseWallpaperSourceContainer"> <div class="controls"> <span class="controlHeaderBtn"><a class="btn controlBtn" ng-class="{\'btn-default\':mobileManagerState.connectedDevices.length==0,\'btn-success\':mobileManagerState.connectedDevices.length>0}" ng-click="toggleManageMobileDevices()" tooltip="ui_browse_header_option_mobile_devices"><span class="far fa-mobile-android"></span> <span class="controlText" translate="ui_browse_header_option_mobile_devices"></span></a> </span> <span class="controlHeaderBtn"><a class="btn btn-default controlBtn" ng-click="toggleMonitorSelection();" tooltip="ui_browse_header_option_monitors"><span class="far fa-desktop"></span> <span class="controlText" translate="ui_browse_header_option_monitors"></span></a> </span> <span class="controlHeaderBtn"><a class="btn btn-default controlBtn" ng-click="callbackShowSettings()" tooltip="ui_browse_header_option_settings"><span class="fas fa-cog"></span> <span class="controlText" translate="ui_browse_header_option_settings"></span></a> </span> </div> <div class="sourceBox" style="position: relative"> <script type="text/ng-template" id="exploreAdvertiseTemplate.html"> <div ng-click="setListSourceRecorded(\'explore\')" translate="ui_browse_advertise_explore"></div> <\/script> <script type="text/ng-template" id="workshopAdvertiseTemplate.html"> <div ng-click="setListSourceRecorded(\'workshop\')" translate="ui_browse_advertise_workshop"></div> <\/script> <div class="btn-group browserSourceGroupButton" id="configGroupSelector" uib-dropdown is-open="status.isopengroup"> <a ng-click="setListSourceInstalled()" class="btn-primary browserSourceButton" ng-class="{\'sourceOverrideActive\':source==\'installed\'}" ng-mouseenter="openConfigGroup()"><span class="fas fa-save"></span> <span translate="ui_browse_list_source_installed"></span> <span class="fas fa-caret-down"></span></a> <ul class="dropdown-menu" uib-dropdown-menu role="menu" style="border-top-left-radius: 0px;border-top-right-radius: 0px;z-index: 10001;"> <li role="menuitem"><a ng-click="changeConfigGroup(\'wallpaper\');setListSourceRecorded(\'installed\')"><span class="fas fa-image"></span> <span translate="ui_browse_monitors_wallpaper"></span></a></li> <li role="menuitem"><a ng-click="changeConfigGroup(\'screensaver\');setListSourceRecorded(\'installed\')"><span class="fas fa-moon-stars"></span> <span translate="ui_browse_monitors_screensaver"></span></a></li> </ul> </div> <a ng-click="setListSourceRecorded(\'explore\')" class="btn-primary browserSourceButton" ng-class="{\'sourceOverrideActive\':source==\'explore\', \'advertiseWorkshop\':browserSettings.advertiseexplore&&!steamWorkshopStatus.error}" ng-if="false"><span class="fas fa-compass"></span> <span translate="ui_browse_list_source_explore" uib-popover-template="\'exploreAdvertiseTemplate.html\'" popover-placement="bottom" popover-is-open="browserSettings.advertiseexplore && canAdvertiseAny && canAdvertiseWorkshop" popover-trigger="none" popover-class="popoverAdvertiseWorkshop" popover-append-to-body="true"></span></a> <a ng-click="setListSourceRecorded(\'workshop\')" class="btn-primary browserSourceButton" ng-class="{\'sourceOverrideActive\':source==\'workshop\', \'advertiseWorkshop\':browserSettings.advertiseworkshop&&!steamWorkshopStatus.error}" uib-popover-template="\'workshopAdvertiseTemplate.html\'" popover-placement="right" popover-is-open="browserSettings.advertiseworkshop && canAdvertiseAny && canAdvertiseWorkshop" popover-trigger="none" popover-class="popoverAdvertiseWorkshop" popover-append-to-body="true"><span ng-class="providerIcon"></span> <span translate="ui_browse_list_source_workshop"></span></a> <a ng-click="setListSourceRecorded(\'pluginSettings\')" class="btn-primary browserSourceButton" ng-class="{\'sourceOverrideActive\':source==\'pluginSettings\'}"><span class="fas fa-sliders-h"></span> <span translate="ui_wep_plugin_settings"></span></a> </div> </div>  <div class="browseAlert ng-hide" ng-show="showTrialAdvertiseAlert"> <uib-alert> <div style="display:flex;align-items:center"> <div translate="ui_browse_alert_trial_reminder"></div> <a class="btn btn-primary" translate="ui_browse_alert_trial_reminder_button" style="margin-left:10px" ng-click="callOpenStorePage()"></a> </div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="browserOptions.activeloadrule"> <uib-alert type="info"> <div translate="ui_browse_alert_active_application_rule" translate-values="{executable:browserOptions.activeloadrule}"></div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="browserOptions.activevramtrigger"> <uib-alert type="info"> <div translate="ui_browse_alert_vram_exhausted"></div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="showScreensaverWindowsSettingsWarning"> <uib-alert type="info"> <div style="display:flex;align-items:center"> <div translate="ui_browse_monitors_configure_in_windows_hint" style="flex:1"></div> <button ng-click="openSystemWallpaperDialog();stopEvt($event)" class="btn btn-default btnPill"><span class="fab fa-windows"></span> <span class="btnPillLabel" translate="ui_browse_windows_screensaver_settings"></span></button> </div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="showScreensaverApplicationWallpaperWarning"> <uib-alert> <div translate="ui_browse_alert_screensaver_app"></div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="showWorkshopAgreementUpdate"> <uib-alert> <div style="display:flex;align-items:center"> <div translate="ui_browse_mobile_modal_author_permission_missing_alert" style="margin-right: 10px;flex:1"></div> <button ng-click="openWorkshopAgreementURL();stopEvt($event)" class="btn btn-default btnPill"><span class="fab fa-steam"></span> <span class="btnPillLabel" translate="ui_browse_mobile_modal_author_permission_missing_open_agreement"></span></button> </div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="sourceIsWorkshop && filterPreset.workshopid"> <uib-alert close="callbackClearPresetFilter()"> <div translate="ui_browse_preset_filter_notice" translate-values="{title:filterPreset.title}"></div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="(sourceIsWorkshop && filterAuthor.authorSteamId) || (sourceIsInstalled && filterAuthor.installedAuthor)"> <uib-alert close="callbackClearAuthorFilter()"> <div translate="ui_browse_author_filter_notice" translate-values="{author: getAuthorFilterName()}"></div> </uib-alert> </div> <div class="browseAlert ng-hide" ng-show="false"> <uib-alert type="info"> <div translate="ui_browse_steam_offline_notice" translate-values="{date:(backupDate|date)}"></div> </uib-alert> </div> <div ng-if="wallpaperConfigGroup==\'screensaver\'"> <div class="browseWallpaperScreensaverModeRow scalable"> <div class="browseWallpaperScreensaverModeRowInner"> <span class="lbl" translate="ui_browse_monitors_screensaver_mode_label"></span> <div class="btn-group"> <a class="btn scrnBtn" ng-class="{\'btn-default\':!wallpaperConfigScreensaver.sameaswallpaper,\'btn-primary\':wallpaperConfigScreensaver.sameaswallpaper}" translate="ui_browse_monitors_same_as_wallpaper" ng-click="wallpaperConfigScreensaver.sameaswallpaper=true"></a> <a class="btn scrnBtn" ng-class="{\'btn-default\':wallpaperConfigScreensaver.sameaswallpaper,\'btn-primary\':!wallpaperConfigScreensaver.sameaswallpaper}" translate="ui_browse_monitors_configured_separately" ng-click="wallpaperConfigScreensaver.sameaswallpaper=false"></a> </div> </div> </div> <hr style="margin:0 0 11px 0;border-width: 3px"> </div> <div class="browseWallpaperSearchContainer" ng-if="!sourceIsExplore && !sourceIsPluginSettings && !hideWallpaperSelection"> <div class="form-group has-feedback browseWallpaperSearchContainerSearchField" ng-class="{\'showOptions\':searchHasSpaces()}"> <div ng-class="{\'input-group\':filter.text}"> <div class="textOptionsParent"> <input id="browseSearchFilterText" type="text" class="form-control" placeholder="{{\'ui_browse_search_placeholder\' | translate}}" ng-model="filter.text" ng-model-options="{debounce:100}" maxlength="40"> <span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span> <div class="browseWallpaperSearchTextOptions" tabindex="0" ng-if="sourceIsWorkshop&&showExactMath"> <div class="content"> <checkbox cb-title="\'ui_browse_search_exact_match\'" cb-checked="filter.exactMatch"></checkbox> </div> </div> </div> <div class="input-group-btn"> <button ng-if="filter.text" class="btn btn-danger" ng-click="resetSearchFilter()"> <i class="glyphicon glyphicon-remove"></i> </button> </div> </div> </div> <div> <a ng-click="showFilter.visible=!showFilter.visible" class="btn btn-primary filterBtn"> <span class="fas fa-tasks filterIcon"></span> <span class="filterLabel" translate="ui_browse_filter_results"></span> <span ng-if="showFilter.counts && !sourceIsWorkshop && (steamWorkshopStatus.complete || steamWorkshopStatus.error)" class="browseFilterActiveClass" translate="ui_browse_filter_results_count" translate-values="{filtered:filteredCount, unfiltered:unfilteredCount}"></span> <span ng-if="showFilter.counts && sourceIsWorkshop && (steamWorkshopStatus.complete || steamWorkshopStatus.error)" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </a> </div> <div class="browseWallpaperSearchContainerFill"> </div> <div class="browseWallpaperSearchContainerSort"> <span style="cursor: pointer" class="glyphicon sortDirection" ng-class="{\'glyphicon-triangle-bottom\': filter.descending, \'glyphicon-triangle-top\': !filter.descending}" ng-click="skipNextFilterDebounce();filter.descending=!filter.descending;" ng-if="!sourceIsWorkshop"></span> <droplist style="min-width: 250px; width: 100%;" ng-if="!sourceIsWorkshop || !filterAuthor.authorSteamId" dp-options="sortOptions" dp-selected="filter.sort"></droplist> <droplist style="min-width: 250px; width: 100%;" ng-if="sourceIsWorkshop && filterAuthor.authorSteamId" dp-options="filterAuthor.sortOptions" dp-selected="filterAuthor.sort"></droplist> </div> </div> <div class="browseWallpaperSearchContainer" ng-if="sourceIsExplore"> <div class="browseExploreRow"> <a ng-visible="exploreNavigation.length>1" ng-click="popExplorePage()"><span class="fas fa-arrow-circle-left browseExploreIcon browseExploreBackIcon"></span></a> <span ng-show="!exploreNavigation[0].key" class="exploreQueryTitle"> <explorequerytitle eqt-query="exploreNavigation[0]" eqt-user-info="steamUserInfos"></explorequerytitle> <explorequeryactions eqt-query="exploreNavigation[0]" eqt-settings="browserSettings.explore" eqt-callbacks="{like:exploreLikedCallback,remove:exploreCustomRemoveCallback}"></explorequeryactions> </span> <span ng-show="exploreNavigation[0].key && exploreNavigation[0].title" class="browseExploreTitle">{{exploreNavigation[0].title | translate}}</span> <span class="browseExploreHomeRow" ng-show="exploreNavigation.length==1"> <a class="btn btn-default browseExploreTextIcon" ng-mousedown="openExplorePersonalizedContentDropdown($event, false)" ng-mouseup="openExplorePersonalizedContentDropdown($event, true)"> <div class="browseExploreHomePersonalizedBtn"> <img ng-if="steamUserInfos[browserRuntime.usersteamid]" ng-src="{{steamUserInfos[browserRuntime.usersteamid].avatar}}" class="browseExploreHomeAvatar"> <img ng-if="!steamUserInfos[browserRuntime.usersteamid]" src="images/noavatar.jpg" class="browseExploreHomeAvatar"> <span translate="ui_browse_explore_your_content"></span> <span style="margin-left:10px;font-size: 90%;" class="fas fa-caret-down"></span> </div> </a> <a class="btn btn-default browseExploreTextIcon" ng-click="setListSourceRecorded(\'workshop\')" tooltip="ui_browse_explore_search"> <span class="fas fa-search" style="font-size: 90%;"></span> <span class="text" translate="ui_browse_explore_search"></span> </a> \x3c!--                             <a class="btn btn-default browseExploreTextIcon" ng-click="pushExplorePage({title:\'ui_browse_explore_favorites\', key: \'wallpaperfavorites\'})" tooltip="ui_browse_explore_favorites">\r\n                                <span class="fas fa-heart"></span> <span class="text" translate="ui_browse_explore_favorites"></span>\r\n                            </a>\r\n                            <a class="btn btn-default browseExploreTextIcon" ng-click="pushExplorePage({title:\'ui_browse_explore_followed_users\', key: \'favorites\'})" tooltip="ui_browse_explore_followed_users">\r\n                                <span class="fas fa-star"></span> <span class="text" translate="ui_browse_explore_followed_users"></span>\r\n                            </a> --\x3e </span> <span ng-show="exploreNavigation[0].key==\'favorites\'"> <a class="btn btn-default browseExploreIcon" ng-click="addExploreCustomFavoriteQuery()"><span class="fas fa-plus fa-fw"></span></a> </span> </div> </div> <div class="browseAlert" ng-if="serviceStartupStatus && serviceStartupStatus.visible"> <uib-alert type="{{serviceStartupStatus.type || \'info\'}}" close="serviceStartupStatus.visible=false"> <div style="display:flex;align-items:center;justify-content:space-between;"> <div style="display:flex;align-items:center;"> <span class="fas" ng-class="serviceStartupStatus.icon || \'fa-spinner fa-spin\'" style="margin-right:8px;"></span> <span translate="{{serviceStartupStatus.text}}" translate-values="serviceStartupStatus.values"></span> </div> </div> </uib-alert> </div> <div class="browseAlert" ng-if="(sourceIsWorkshop || sourceIsInstalled) && pluginStatus && (pluginStatus.is_downloading || !pluginsReady || pluginStatus.error)"> <uib-alert type="{{pluginStatus.error ? \'danger\' : \'info\'}}"> <div style="display:flex;align-items:center;justify-content:space-between;width:100%;"> <div style="display:flex;align-items:center;"> <span class="fas" ng-class="pluginStatus.error ? \'fa-exclamation-triangle\' : \'fa-spinner fa-spin\'" style="margin-right:8px;"></span> <span ng-if="pluginStatus.error" translate="ui_wep_plugins_init_failed" translate-values="{error: pluginStatus.error}"></span> <span ng-if="!pluginStatus.error && pluginStatus.is_downloading"> <span ng-if="pluginStatus.current_plugin === \'.NET Runtime\'"><span translate="ui_wep_downloading_runtime"></span> <b>.NET Runtime</b> ({{pluginStatus.progress | number:0}}%)...</span> <span ng-if="pluginStatus.current_plugin !== \'.NET Runtime\'"><span translate="ui_wep_downloading_plugins"></span> <b>{{pluginStatus.current_plugin}}</b> ({{pluginStatus.progress | number:0}}%)...</span> </span> <span ng-if="!pluginStatus.error && !pluginStatus.is_downloading && !pluginsReady"><span translate="ui_wep_initializing_plugins"></span></span> </div> <div style="display:flex;align-items:center;gap:10px;"> <div style="font-size:11px;color:#eee;" ng-if="pluginStatus.message && !pluginStatus.error">{{pluginStatus.message}}</div> <button ng-if="pluginStatus.error" class="btn btn-xs btn-warning" ng-click="startPluginsIfNeeded(true)"><span translate="ui_retry"></span></button> </div> </div> </uib-alert> </div> <div class="browseWallpaperGridParent" ng-hide="sourceIsPluginSettings"> <div class="browseWallpaperGridContainerParent"> <div class="browseWallpaperFilter ng-hide" ng-show="showFilter.visible && !sourceIsExplore && (wallpaperConfigGroup!=\'screensaver\'||!wallpaperConfigScreensaver.sameaswallpaper||!sourceIsInstalled)"> <div> <div class="browseFilterTopBar"> <span> <a ng-click="callbackResetFilter()" class="btn btn-primary iconInfo"> <span class="fas fa-sync-alt"></span> <span translate="ui_browse_filter_reset"></span> </a> </span>  </div> <div ng-if="sourceIsWorkshop || sourceIsInstalled" class="helperFilterContainer" style="padding: 10px 10px 20px 4px;"> <div class="filterHelperGroup"> <label class="filterHelperLabel" translate="ui_wep_filter_category"></label> <droplist dp-options="categoryOptions" dp-selected="filterHelper.category" dp-change="onFilterChange()"></droplist> </div> <div class="filterHelperGroup"> <label class="filterHelperLabel" translate="ui_browse_filter_type"></label> <droplist dp-options="typeOptions" dp-selected="filterHelper.type_tag" dp-change="onFilterChange()"></droplist> </div> <div class="filterHelperGroup"> <label class="filterHelperLabel" translate="ui_browse_filter_resolution"></label> <droplist dp-options="resolutionOptions" dp-selected="filterHelper.resolution" dp-change="onFilterChange()"></droplist> </div> <div class="filterHelperGroup"> <label class="filterHelperLabel" translate="ui_workshop_workshop_tags_rating"></label> <droplist dp-options="ageRatingOptions" dp-selected="filterHelper.age_rating" dp-change="onFilterChange()"></droplist> </div> <div ng-if="sourceIsWorkshop" class="filterHelperGroup" style="border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 8px 10px; background: rgba(0,0,0,0.15);"> <div ng-click="filterHideAssets = !filterHideAssets" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;"> <div style="display: flex; align-items: center; gap: 6px;"> <span class="fas fa-layer-group" style="font-size: 11px; opacity: 0.8;"></span> <span style="font-size: 12px; font-weight: 600;" translate="ui_wep_filter_assets_scripts"></span> <span ng-if="filterHelper.asset_type || filterHelper.asset_genre || filterHelper.script_type" class="badge badge-info" style="font-size: 9px; padding: 2px 5px;"><span translate="ui_wep_filter_active"></span></span> </div> <span class="fas fa-fw" ng-class="{\'fa-caret-down\': !filterHideAssets, \'fa-caret-right\': filterHideAssets}"></span> </div> <div ng-hide="filterHideAssets" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;"> <div> <label class="filterHelperLabel" style="font-size: 10px;" translate="ui_wep_filter_asset_type"></label> <droplist dp-options="assetTypeOptions" dp-selected="filterHelper.asset_type" dp-change="onFilterChange()"></droplist> </div> <div> <label class="filterHelperLabel" style="font-size: 10px;" translate="ui_wep_filter_asset_genre"></label> <droplist dp-options="assetGenreOptions" dp-selected="filterHelper.asset_genre" dp-change="onFilterChange()"></droplist> </div> <div> <label class="filterHelperLabel" style="font-size: 10px;" translate="ui_wep_filter_script_type"></label> <droplist dp-options="scriptTypeOptions" dp-selected="filterHelper.script_type" dp-change="onFilterChange()"></droplist> </div> </div> </div> <div ng-if="sourceIsWorkshop" class="filterHelperGroup"> <label class="filterHelperLabel" translate="ui_wep_filter_special"></label> <div class="filterItem" style="display:flex;align-items:center;" tooltip="ui_wep_filter_incompatible_tooltip"> <checkbox cb-checked="filterHelper.incompatible" cb-changed="onFilterChange()" cb-title="\'ui_wep_filter_incompatible\'"></checkbox> </div> </div> <div class="filterHelperGroup"> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;"> <label class="filterHelperLabel" style="margin-bottom: 0;" translate="ui_wep_filter_misc"></label> </div> <div style="display: flex; flex-wrap: wrap; gap: 4px;"> <button type="button" ng-repeat="tag in miscTagsList" class="btn btn-xs tag-chip" ng-class="{\'btn-default\': getTagState(\'misc\', tag) === \'off\', \'btn-success\': getTagState(\'misc\', tag) === \'included\', \'btn-danger tag-chip-excluded\': getTagState(\'misc\', tag) === \'excluded\'}" ng-click="toggleMiscTag(tag)"> <span ng-if="getTagState(\'misc\', tag) === \'included\'" class="fas fa-plus" style="font-size: 9px; margin-right: 3px;"></span> <span ng-if="getTagState(\'misc\', tag) === \'excluded\'" class="fas fa-minus" style="font-size: 9px; margin-right: 3px;"></span> {{getTagLabel(tag)}} </button> </div> </div> <div class="filterHelperGroup"> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;"> <label class="filterHelperLabel" style="margin-bottom: 0;" translate="ui_wep_filter_genres"></label> </div> <div style="display: flex; flex-wrap: wrap; gap: 4px;"> <button type="button" ng-repeat="tag in genreTagsList" class="btn btn-xs tag-chip" ng-class="{\'btn-default\': getTagState(\'genre\', tag) === \'off\', \'btn-success\': getTagState(\'genre\', tag) === \'included\', \'btn-danger tag-chip-excluded\': getTagState(\'genre\', tag) === \'excluded\'}" ng-click="toggleGenreTag(tag)"> <span ng-if="getTagState(\'genre\', tag) === \'included\'" class="fas fa-plus" style="font-size: 9px; margin-right: 3px;"></span> <span ng-if="getTagState(\'genre\', tag) === \'excluded\'" class="fas fa-minus" style="font-size: 9px; margin-right: 3px;"></span> {{getTagLabel(tag)}} </button> </div> </div> </div> <div ng-if="false"> \x3c!-- SPECIAL TAGS --\x3e <div style="margin: 0 10px 0 0" ng-if="false"> <div class="groupBox" style="padding: 15px 10px 10px 0px"> <div class="heading" translate="ui_browse_filter_show_only"></div>\x3c!-- <span class="fas fa-play headerIcon"></span> --\x3e <div class="filterItem" ng-if="showApprovedTag"> <checkbox cb-type="tag" cb-checked="filter.utilitytags.Approved"></checkbox><span ng-click="filter.utilitytags.Approved=filter.utilitytags.Approved?0:1"><span class="fas fa-trophy fa-fw browseWallpaperApproved"></span><span class="filterItemLabel" translate="ui_workshop_tags_approved" ng-class="{successText:filter.utilitytags.Approved}"></span></span> </div> <div class="filterItem" ng-if="sourceIsInstalled"> <checkbox cb-type="tag" cb-checked="filterTemp.filterFavoritesOnly" cb-changed="tempFilterChanged()"></checkbox><span ng-click="filterTemp.filterFavoritesOnly=filterTemp.filterFavoritesOnly?0:1;tempFilterChanged()"><span class="fas fa-heart fa-fw browseWallpaperFavorite"></span><span class="filterItemLabel" translate="ui_browse_query_sort_my_favorites" ng-class="{successText:filterTemp.filterFavoritesOnly}"></span></span> </div> <div class="filterItem"> <checkbox cb-type="tag" cb-checked="filterTemp.filterMobileCompatibleOnly" cb-changed="tempFilterChanged()"></checkbox><span ng-click="filterTemp.filterMobileCompatibleOnly=filterTemp.filterMobileCompatibleOnly?0:1;tempFilterChanged()"><span class="fas fa-mobile-android fa-fw browseWallpaperPortrait"></span><span class="filterItemLabel" translate="ui_workshop_filter_mobile_compatible" ng-class="{successText:filterTemp.filterMobileCompatibleOnly}"></span></span> </div> <div class="filterItem"> <checkbox cb-type="tag" cb-checked="filter.utilitytags[filterUtilityTags[0].value]" cb-title="filterUtilityTags[0].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-type="tag" cb-checked="filter.utilitytags[filterUtilityTags[1].value]" cb-title="filterUtilityTags[1].label"></checkbox> </div> </div> \x3c!--                                     <div class="filterItem" ng-repeat="tag in filterUtilityTags" ng-class="{\'approved\':tag.value==\'Approved\'}">\r\n                                        <checkbox cb-type="tag" cb-checked="filter.utilitytags[tag.value]" cb-title="tag.label"></checkbox> <span class="fas fa-trophy browseWallpaperApproved"></span>\r\n                                    </div> --\x3e <div class="browseFilterBottomPadding"></div> </div> \x3c!-- TYPES --\x3e <div ng-if="!sourceIsWorkshop || !filterPreset.workshopid"> <div class="filterHeader browseFilterToggle" ng-click="filterHideTypes=!filterHideTypes"> <span ng-if="filterHideTypes" class="fas fa-fw fa-caret-down"></span> <span ng-if="!filterHideTypes" class="fas fa-fw fa-caret-right"></span> <span translate="ui_browse_filter_type"></span> <span ng-if="filterStatus.type" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </div> <div class="browseFilterHide" ng-show="filterHideTypes"> \x3c!--                                         <div class="filterItem" ng-repeat="tag in filterTypeTags">\r\n                                            <checkbox cb-checked="filter.typetags[tag.value]" cb-title="tag.label"></checkbox>\r\n                                        </div> --\x3e <div class="filterItem"> <checkbox cb-checked="filter.typetags[filterTypeTags[0].value]" cb-title="filterTypeTags[0].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.typetags[filterTypeTags[1].value]" cb-title="filterTypeTags[1].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.typetags[filterTypeTags[2].value]" cb-title="filterTypeTags[2].label"></checkbox> </div> <div class="filterItem" ng-if="wallpaperConfigGroup!=\'screensaver\' && !sourceIsWorkshop"> <checkbox cb-checked="filter.typetags[filterTypeTags[3].value]" cb-title="filterTypeTags[3].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem"> <checkbox cb-checked="filter.categorytags[filterCategoryTags[0].value]" cb-title="filterCategoryTags[0].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.categorytags[filterCategoryTags[1].value]" cb-title="filterCategoryTags[1].label"></checkbox> </div> <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- RATING --\x3e <div ng-if="canUseAgeRatingTags()"> <div class="filterHeader browseFilterToggle" ng-click="filterHideRating=!filterHideRating"> <span ng-if="filterHideRating" class="fas fa-fw fa-caret-down"></span> <span ng-if="!filterHideRating" class="fas fa-fw fa-caret-right"></span> <span translate="ui_workshop_workshop_tags_rating"></span> <span ng-if="filterStatus.rating" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </div> <div class="browseFilterHide" ng-show="filterHideRating"> <div class="filterItem" ng-repeat="tag in filterRatingTags"> <checkbox cb-checked="filterProxy.ratingtags[tag.value]" cb-title="tag.label"></checkbox> </div>  <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- RESOLUTION --\x3e <div ng-if="!sourceIsWorkshop || !filterPreset.workshopid"> <div class="filterHeader browseFilterToggle" ng-click="filterHideResolution=!filterHideResolution"> <span ng-if="filterHideResolution" class="fas fa-fw fa-caret-down"></span> <span ng-if="!filterHideResolution" class="fas fa-fw fa-caret-right"></span> <span translate="ui_browse_filter_resolution"></span> <span ng-if="filterStatus.resolution" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </div> <div class="browseFilterHide" ng-show="filterHideResolution"> <span ng-if="sourceIsWorkshop" style="display:flex;"> <a ng-click="showResolutionSettingsModal()" class="btn btn-info iconInfo" style="flex:1;margin:0 5px 0 15px;"> <span class="fas fa-cog"></span> <span translate="ui_browse_resolution_settings"></span> </a> </span> \x3c!--                                         <div class="filterItem" ng-repeat="tag in filterResolutionTags">\r\n                                            <checkbox cb-checked="filter.resolutiontags[tag.value]" cb-title="tag.label"></checkbox>\r\n                                        </div> --\x3e \x3c!-- var asd = \'\'; for(var x = 0; x < 24; ++x)asd += \'<div class="filterItem"><checkbox cb-checked="filter.resolutiontags[filterResolutionTags[%V].value]" cb-title="filterResolutionTags[%V].label"></checkbox></div>\\n\'.replaceAll(\'%V\', x);console.log(asd) --\x3e <div class="filterItem filterResolutionTitle" translate="ui_resolution_widescreen"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[0].value]" cb-title="filterResolutionTags[0].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[1].value]" cb-title="filterResolutionTags[1].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[2].value]" cb-title="filterResolutionTags[2].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[3].value]" cb-title="filterResolutionTags[3].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[4].value]" cb-title="filterResolutionTags[4].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[5].value]" cb-title="filterResolutionTags[5].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem filterResolutionTitle" translate="ui_resolution_ultrawide"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[6].value]" cb-title="filterResolutionTags[6].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[7].value]" cb-title="filterResolutionTags[7].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[8].value]" cb-title="filterResolutionTags[8].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem filterResolutionTitle" translate="ui_resolution_dual"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[9].value]" cb-title="filterResolutionTags[9].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[10].value]" cb-title="filterResolutionTags[10].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[11].value]" cb-title="filterResolutionTags[11].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[12].value]" cb-title="filterResolutionTags[12].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem filterResolutionTitle" translate="ui_resolution_triple"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[13].value]" cb-title="filterResolutionTags[13].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[14].value]" cb-title="filterResolutionTags[14].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[15].value]" cb-title="filterResolutionTags[15].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[16].value]" cb-title="filterResolutionTags[16].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[17].value]" cb-title="filterResolutionTags[17].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem filterResolutionTitle" translate="ui_resolution_portrait"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[18].value]" cb-title="filterResolutionTags[18].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[19].value]" cb-title="filterResolutionTags[19].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[20].value]" cb-title="filterResolutionTags[20].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[21].value]" cb-title="filterResolutionTags[21].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[22].value]" cb-title="filterResolutionTags[22].label"></checkbox> </div> <div class="filterDivider"></div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[23].value]" cb-title="filterResolutionTags[23].label"></checkbox> </div> <div class="filterItem"> <checkbox cb-checked="filter.resolutiontags[filterResolutionTags[24].value]" cb-title="filterResolutionTags[24].label"></checkbox> </div> <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- SOURCE --\x3e <div ng-if="!sourceIsWorkshop"> <div class="filterHeader browseFilterToggle" ng-click="filterHideSource=!filterHideSource"> <span ng-if="!filterHideSource" class="fas fa-fw fa-caret-down"></span> <span ng-if="filterHideSource" class="fas fa-fw fa-caret-right"></span> <span translate="ui_browse_filter_source"></span> <span ng-if="filterStatus.source" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </div> <div class="browseFilterHide" ng-hide="filterHideSource"> <div class="filterItem" ng-repeat="tag in filterSourceTags"> <checkbox cb-checked="filter.sourcetags[tag.value]" cb-title="tag.label"></checkbox> </div> <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- GENRES --\x3e <div class="filterHeader browseFilterToggle" ng-click="filterHideGenres=!filterHideGenres"> <span ng-if="!filterHideGenres" class="fas fa-fw fa-caret-down"></span> <span ng-if="filterHideGenres" class="fas fa-fw fa-caret-right"></span> <span class="filterHeader" translate="ui_browse_filter_tags"></span> <span ng-if="filterStatus.tags" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </div> <div class="browseFilterHide" ng-hide="filterHideGenres"> <div class="filterItem" ng-repeat="tag in filterAllTags"> <checkbox cb-checked="filter.tags[tag.value]" cb-title="tag.label"></checkbox> </div> </div> </div> </div> </div> <div class="browseWallpaperScreensaverMirrorView ng-hide" ng-show="hideWallpaperSelection"> <div class="hint" translate="ui_browse_monitors_same_as_wallpaper_hint"></div> <div> <a class="btn btn-primary btn-lg"><span class="fas fa-fw fa-question" ng-click="openScreensaverFaq()"></span></a> </div> </div> <div class="browseWallpaperGridAndNavigationView" ng-show="(!sourceIsExplore || !exploreNavigation[0].key) && !hideWallpaperSelection"> <div class="browseFolderNavigation" ng-class="{visible:sourceIsInstalled && currentFolder}"> <a class="item itemUpArrow fas fa-arrow-circle-up" ng-click="navigateFolderUp()"></a> <a class="item" ng-click="navigateFolder()" translate="ui_browse_navigation_top"></a> <span ng-repeat="folder in folderNavigation"><span class="item">&gt;</span><a class="item" ng-click="navigateFolder(folder)">{{folder.title}}</a></span> </div> <div class="browseWallpaperGridView"> <div ng-if="sortedWallpapers.length == 0 && sortedFolders.length == 0" class="emptyGrid"> <span ng-class="{\'emptyGridDanger\':showErrorInBackground}" ng-bind-html="queryActive ? \'ui_browse_grid_no_results_refreshing\' : showErrorInBackground ? \'ui_browse_no_service_body\' : \'ui_browse_grid_no_results\' | translate"></span> <div ng-if="!queryActive && showErrorInBackground" style="margin-top:20px;"> <a class="btn btn-default btn-lg" ng-click="callbackChangePage(currentPage, false, true)"><span class="fas fa-sync-alt"></span> <span translate="ui_browse_reload"></span></a> </div> <wp-anim ng-if="queryActive" class="wpAnimQuery" wpa-file="anims/logo_white.json"></wp-anim> </div> <wallpaper-thumbnail id="WallpaperBrowseInner1" class="wallpaperBrowseInner" wt-wallpapers="sortedWallpapers" wt-folders="sortedFolders" wt-wallpaper-flags="selectedMonitor.playlistFlags" wt-selection="currentSelection" wt-multiselection="multiSelection" wt-flagcallback="callbackToggleAllWallpapersInCurrentMonitorPlaylist(wallpaper)" wt-mousecallback="callbackWallpaperAllMouse(btn, context, $event)" wt-selectioncallback="callbackWallpaperSelectionRectangle(items, $event)" wt-enabledragdrop="!sourceIsWorkshop" ng-class="\'browseViewSize\' + browserSettings.viewiconsize" wt-blacklist="sourceIsWorkshop && browserSettingsExtensions.authorblocklist" wt-steam-user-infos="steamUserInfos" wt-tag="source!=\'explore\'?source:exploreNavigation[0].wtTag||\'explore\'"></wallpaper-thumbnail> </div> </div> <div class="browseWallpaperGridAndNavigationView" ng-show="sourceIsExplore && exploreNavigation[0].key" intersectionhandler ish-sentinel="#ExploreViewSentinel" ish-callback="exploreScrollSentinelChanged(visible)"> <div class="browseWallpaperGridView"> <div id="WallpaperBrowseInner2" class="wallpaperBrowseInner exploreList" ng-show="exploreNavigation[0].key"> <div ng-repeat="query in sortedExploreQueries" class="browseExploreQueryRow" ng-class="query.class"> <div class="browseExploreQueryControls"> <explorequerytitle eqt-query="query" eqt-user-info="steamUserInfos"></explorequerytitle> </div> <div ng-if="query.loading"> <wp-anim class="wpAnimQueryExplore" wpa-file="anims/logo_white.json"></wp-anim> \x3c!--                                             <div class="wpAnim">\r\n                                                <img class="spin" src="images/wp_logo_blue_inner_rect.png">\r\n                                            </div> --\x3e <div class="exploreQueryLoadingLabel" translate="ui_browse_grid_no_results_refreshing"></div> </div> <div ng-if="query.showError"> <span class="emptyGridDanger" ng-bind-html="\'ui_browse_no_service_body\' | translate"></span> <a class="btn btn-default btn-lg" ng-click="performExploreQuery(query)"><span class="fas fa-sync-alt"></span> <span translate="ui_browse_reload"></span></a> </div> <div class="browseExploreQueryWallpaperBox" ng-class="{disliked:browserSettings.explore.disliked.includes(query.name)}"> <div class="browseExploreQueryWallpapers" ng-if="query.wallpapers.length > 0" explorescroll> <div class="exploreArrow exploreArrowLeft"> <span class="fas fa-chevron-left chevronIcon"></span> </div> <div class="exploreArrow exploreArrowRight"> <span class="fas fa-chevron-right chevronIcon"></span> </div> <div class="browseExploreQueryScroll"> <wallpaper-thumbnail class="wallpaperQueryList" wt-wallpapers="query.wallpapers" wt-wallpaper-flags="selectedMonitor.playlistFlags" wt-selection="currentSelection" wt-multiselection="multiSelection" wt-flagcallback="callbackToggleAllWallpapersInCurrentMonitorPlaylist(wallpaper)" wt-mousecallback="callbackWallpaperAllMouse(btn, context, $event)" wt-selectioncallback="callbackWallpaperSelectionRectangle(items, $event)" wt-enabledragdrop="false" ng-class="\'browseViewSize\' + browserSettings.viewiconsize" wt-steam-user-infos="steamUserInfos" wt-tag="query.category!==\'highlight\' ? \'explore\' : \'exploreHighlights\'"></wallpaper-thumbnail> </div> </div> </div> <div class="browseExploreQueryFooter" ng-if="!query.loading"> <explorequeryactions eqt-query="query" eqt-settings="browserSettings.explore" eqt-callbacks="{pushExplorePage:pushExplorePage,like:exploreLikedCallback,remove:exploreCustomRemoveCallback}"></explorequeryactions> \x3c!--                                             <div ng-if="!browserSettings.explore.hasLikedAny && !query.custom" class="exploreVotePrompt warningText">\r\n                                                <span class="fas fa-fw fa-arrow-up exploreIcon warningText"></span>\r\n                                                <span translate="ui_browse_explore_prompt_to_vote"></span>\r\n                                            </div> --\x3e </div> </div> <div id="ExploreViewSentinel" class="exploreViewSentinel"></div> </div> </div> </div> </div> <div class="browseWallpaperPagination" ng-show="pagination.visible && !hideWallpaperSelection && !sourceIsPluginSettings"> <span><a class="fas fa-angle-double-left paginationIcon" ng-click="callbackChangePage(\'prev\', true)"></a></span> <span ng-repeat="page in pagination.pages"><a class="paginationIcon pageItem" ng-click="callbackChangePage(page.label, true)" ng-class="{\'{{page.class}}\':true, \'linkOverrideActive\':page.label==pagination.current}">{{page.label}}</a></span> <span><a class="fas fa-angle-double-right paginationIcon" ng-click="callbackChangePage(\'next\', true)"></a></span> </div> <div class="browseWallpaperGridPlaylistParent" ng-class="{playlistShow:selectedMonitor.playlist.items.length>0 || isDragDropActive,playlistDaytime:selectedMonitor.playlist.settings.mode === \'daytime\'||selectedMonitor.playlist.settings.mode === \'dayofweek\'}" ng-show="!hideWallpaperSelection && !sourceIsPluginSettings"> <div class="browseWallpaperGridPlaylistParentChild"> <div class="browseWallpaperGridPlaylistHeader"> <h3 translate="{{(selectedMonitor.playlist.items.length) ? \'ui_browse_playlist_header_count\' : \'ui_browse_playlist_header\'}}" translate-values="{count:selectedMonitor.playlist.items.length}"></h3> <a ng-click="callbackShowPlaylists()" class="btn btn-default"> <span class="fas fa-folder-open"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_load"></span> </a> <a ng-click="callbackShowPlaylists(true)" ng-class="{\'disabled\': selectedMonitor.playlist.items.length<2}" class="btn btn-default"> <span class="fas fa-save"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_save"></span> </a> <a ng-click="callbackShowPlaylistSettings()" ng-class="{\'disabled\': !selectedMonitor.playlist.items.length}" class="btn btn-default"> <span class="fas fa-cogs"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_configure"></span> </a> <a ng-if="!selectedMonitor.playlistFlags[currentSelection.file]" ng-click="callbackToggleAllWallpapersInCurrentMonitorPlaylist(currentSelection)" ng-class="{\'disabled\': !currentSelection.file}" class="btn btn-primary"> <span class="fas fa-plus"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_add"></span> </a> <a ng-if="selectedMonitor.playlistFlags[currentSelection.file]" ng-click="callbackToggleAllWallpapersInCurrentMonitorPlaylist(currentSelection)" class="btn btn-primary"> <span class="fas fa-minus"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_remove"></span> </a> <a ng-if="selectedMonitor.playlist.items.length" style="margin-left: auto;" ng-click="callbackClearPlaylist()" class="btn btn-danger"> <span class="fas fa-trash"></span> <span class="playlistLabel" translate="ui_browse_playlist_button_clear"></span> </a> </div> <div class="browseWallpaperPlaylist" id="PlaylistContainer" scroll-horizontal> <div class="browseWallpaperPlaylistRow" ng-attr-style="min-width:{{52 * selectedMonitor.playlist.items.length * (selectedMonitor.playlist.items.length<1001)}}px"> <div ng-if="selectedMonitor.playlist.settings.mode === \'daytime\'" class="playlistTimeline" id="PlaylistContainerTimeline"> <div class="playlistTimelineFixed"> <div class="timelineParent"><span class="timelineChild">{{1 | date : getTimelineFormat() : \'+0000\'}}</span></div> <div class="timelineParent"><span class="timelineChild">{{(1000*60*60*6) | date : getTimelineFormat() : \'+0000\'}}</span></div> <div class="timelineParent"><span class="timelineChild">{{(1000*60*60*12) | date : getTimelineFormat() : \'+0000\'}}</span></div> <div class="timelineParent"><span class="timelineChild">{{(1000*60*60*18) | date : getTimelineFormat() : \'+0000\'}}</span></div> <div class="timelineParent"><span class="timelineChild">{{(1000*60*60*24-1000*60) | date : getTimelineFormat() : \'+0000\'}}</span></div> </div> </div> <div ng-if="selectedMonitor.playlist.settings.mode === \'dayofweek\'" class="playlistTimeline"> <div class="playlistTimelineFixed"> <div class="timelineParentDayOfWeek" ng-repeat="entry in selectedMonitor.playlist.items track by $index"> <span class="timelineChild"> {{getDayOfWeekLabel(selectedMonitor.playlist, $index)}} </span> </div> </div> </div> <div class="playlistWallpaperContainer" id="PlaylistContainerRow"> <div ng-if="selectedMonitor.playlist.items.length > 1000"> <span class="playlistWallpaperContainerLimitHint" translate="ui_browse_playlist_too_many_items"></span> </div> <div ng-if="selectedMonitor.playlist.items.length < 1001" class="playlistWallpaperRow"> <div ng-repeat="entry in selectedMonitor.playlist.items track by $index" class="browseWallpaperPlaylistImage" ng-attr-style="flex-grow:{{entry.flex || 1}}" ng-class="{selected:entry.wallpaper===currentSelection}" ng-click="callbackWallpaperSelected(entry.wallpaper)" attach-scope> <div class="browseWallpaperPlaylistImageChild" ng-attr-style="background: {{getPreviewUrl(entry.wallpaper)}}, rgba(127,127,127,0.1)"> <a class="trashIcon" ng-click="callbackToggleEntryInCurrentMonitorPlaylist(entry, true);callbackCancelEvent($event);"><span class="fas fa-times"></span></a> <div class="presetName" ng-if="entry.preset">{{entry.preset}}</div> <div class="selectBorder"></div> <div class="daytimeDragBorder"></div> <div class="playlistTimelineMarker" ng-if="entry.daytimeend > 0"></div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="browsePluginSettingsView autoScrollY" ng-if="sourceIsPluginSettings" style="flex:1 1 auto;overflow-y:auto;padding:15px 30px;margin-top:10px;">  <div ng-if="pluginStatus && !pluginsReady" class="alert alert-info" style="margin-bottom:15px;display:flex;align-items:center;gap:10px;"> <span class="fas fa-spinner fa-spin"></span> <span translate="ui_wep_plugins_loading_notice"></span> </div> <div class="row"> <div class="col-xs-6"> <div class="groupBox" style="padding:16px;min-height:280px;margin-bottom:20px;"> <div class="heading" style="font-size:15px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;"> <div><span class="fab fa-steam headerIcon" style="color:#66c0f4;"></span> <span translate="ui_wep_steam_web_session"></span></div> <button class="btn btn-primary btn-sm" style="margin-left: 18px;" ng-click="openSteamLoginModal()"><span class="fab fa-steam"></span> <span translate="ui_wep_btn_login"></span></button> </div> <div ng-if="steamAuthUser.logged_in" style="display:flex;align-items:center;background:rgba(0,0,0,0.25);padding:12px;border-radius:6px;margin-bottom:14px;"> <img ng-if="steamAuthUser.avatar_url" ng-src="{{steamAuthUser.avatar_url}}" style="width:52px;height:52px;border-radius:50%;margin-right:14px;border:2px solid #5cb85c;"> <div ng-if="!steamAuthUser.avatar_url" style="width:52px;height:52px;border-radius:50%;margin-right:14px;background:#333;display:flex;align-items:center;justify-content:center;font-size:24px;color:#5cb85c;"><span class="fas fa-user"></span></div> <div style="flex:1;"> <div style="font-size:15px;font-weight:bold;color:#fff;">{{steamAuthUser.persona_name || (\'ui_wep_steam_user\' | translate)}}</div> <div style="font-size:11px;color:#aaa;margin-top:2px;">SteamID: {{steamAuthUser.steamid || (\'ui_wep_unknown\' | translate)}}</div> <div style="font-size:11px;color:#5cb85c;margin-top:3px;"><span class="fas fa-check-circle"></span> <span translate="ui_wep_status_authorized"></span></div> </div> </div> <div ng-if="!steamAuthUser.logged_in" style="background:rgba(0,0,0,0.25);padding:12px;border-radius:6px;margin-bottom:14px;display:flex;align-items:center;"> <div style="width:52px;height:52px;border-radius:50%;margin-right:14px;background:#2a2f3a;display:flex;align-items:center;justify-content:center;font-size:24px;color:#888;"><span class="fas fa-user-slash"></span></div> <div> <div style="font-size:14px;font-weight:bold;color:#fff;"><span translate="ui_wep_status_not_logged_in"></span></div> <div style="font-size:11px;color:#aaa;margin-top:2px;"><span translate="ui_wep_login_for_adult"></span></div> </div> </div>  </div> </div> <div class="col-xs-6"> <div class="groupBox" style="padding:16px;min-height:280px;margin-bottom:20px;"> <div class="heading" style="font-size:15px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;"> <div><span class="fas fa-users-cog headerIcon"></span> <span translate="ui_wep_download_accounts"></span></div> <button class="btn btn-primary btn-sm" style="margin-left: 18px;" ng-click="openAddAccountModal()"><span class="fas fa-plus"></span> <span translate="ui_wep_btn_add_account"></span></button> </div> <p class="text-muted" style="font-size:11px;margin-bottom:10px;"><span translate="ui_wep_accounts_hint"></span></p> <div style="max-height:150px;overflow-y:auto;background:rgba(0,0,0,0.25);border-radius:6px;padding:6px;"> <div ng-repeat="acc in downloadAccounts.accounts track by $index" ng-click="selectDownloadAccount($index)" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;margin-bottom:4px;border-radius:4px;cursor:pointer;" ng-class="{\'bg-primary\':downloadAccounts.selected_index===$index,\'bg-dark\':downloadAccounts.selected_index!==$index}"> <div style="display:flex;align-items:center;"> <span class="fas fa-check-circle" style="margin-right:8px;" ng-style="{opacity:downloadAccounts.selected_index===$index?1:0.2}"></span> <span style="font-size:13px;font-weight:bold;">{{acc.username}}</span> <span ng-if="acc.is_auto || acc.username===\'Auto\'" class="label label-info" style="margin-left:8px;font-size:10px;"><span translate="ui_wep_account_default"></span></span> <span ng-if="!acc.is_auto && acc.username!==\'Auto\' && acc.has_password" class="label label-success" style="margin-left:8px;font-size:10px;"><span translate="ui_wep_account_protected"></span></span> </div> <div ng-if="!acc.is_auto && acc.username!==\'Auto\' && acc.is_custom"> <button class="btn btn-danger btn-xs" ng-click="removeDownloadAccount(acc, $event)"><span class="fas fa-trash"></span></button> </div> </div> </div> </div> </div> </div> </div> </div> <div class="browseWallpaperDetailView" ng-class="{\'showScrollY\':isMiniMode}" ng-hide="sourceIsPluginSettings"> <div ng-if="sourceIsInstalled && multiSelection && multiSelection.length > 0" class="details" style="display:flex;flex-direction:column;gap:10px;padding:15px;background:rgba(0,0,0,0.35);border-radius:6px;border:1px solid rgba(255,255,255,0.1);margin:10px;"> <div style="font-size:14px;font-weight:bold;color:#66c0f4;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;"> <span><i class="fas fa-check-square"></i> <span translate="ui_wep_selected_count" translate-values="{count: multiSelection.length}"></span></span> </div> <div style="display:flex;flex-direction:column;gap:8px;"> <button ng-class="getMultiExtractBtnClass()" ng-click="extractMultipleWallpapers(multiSelection)" ng-disabled="!pluginsReady || (extractStatusNotice && extractStatusNotice.phase===\'running\')"> <span class="fas" ng-class="multiExtractSuccess ? \'fa-check\' : ((extractStatusNotice && extractStatusNotice.phase===\'running\') ? \'fa-spinner fa-spin\' : \'fa-box-open\')"></span> <span ng-if="multiExtractSuccess" translate="ui_wep_btn_extracted"></span> <span ng-if="!multiExtractSuccess && (!extractStatusNotice || extractStatusNotice.phase!==\'running\')"><span translate="ui_wep_extract_selected"></span></span> <span ng-if="!multiExtractSuccess && (extractStatusNotice && extractStatusNotice.phase===\'running\')"><span translate="ui_wep_extracting"></span></span> </button> <button class="btn btn-danger btn-block" ng-click="deleteMultipleWallpapers(multiSelection)"> <span class="fas fa-trash"></span> <span translate="ui_wep_delete_selected_disk"></span> </button> </div> </div> <div ng-if="!currentSelection && (!sourceIsInstalled || !multiSelection || multiSelection.length === 0)" class="details placeholder"> <div translate="ui_browse_select_prompt"></div> </div> <div ng-if="currentSelection && (!sourceIsInstalled || !multiSelection || multiSelection.length === 0)" class="details"> <div class="previewContainer"> <div ng-if="currentSelection.youtube && preview.play" class="browseWallpaperDetailsViewInner browseWallpaperYoutubeEmbed"> <iframe ng-src="{{currentSelection.youtube}}" onload="youtubeLoaded(this)"> </iframe> </div> <div ng-if="!currentSelection.youtube || !preview.play" class="browseWallpaperDetailsViewInner"> \x3c!-- {{currentSelection.preview}} --\x3e <img ng-src="{{currentSelection.preview}}" class="previewImage"> <div class="browseWallpaperDetailViewYoutubePlayOverlay" ng-show="currentSelection.youtube"> <a ng-click="preview.play = true"> <div> <span class="centerButton"> <span class="fas fa-play playButton"></span> </span> </div> </a> </div> </div> </div> <div class="info"> <div class="browseWallpaperDetailViewTopPadding" ng-if="isMiniMode || currentSelection.youtube"> <div class="browseWallpaperPagination" ng-if="isMiniMode"> <span><a class="fas fa-angle-double-left paginationIcon" ng-click="navigateWallpapers(\'left\')"></a></span> <span><a class="fas fa-angle-double-right paginationIcon" ng-click="navigateWallpapers(\'right\')"></a></span> </div> </div> <div class="content-title"> {{currentSelection.title}} </div> <div class="infoRow center" ng-if="!sourceIsInstalled && !currentSelection.local"> <workshop-author wa-item="currentSelection" wa-infos="steamUserInfos" wa-browse-author="callbackBrowseAuthor" wa-open-user-page="openSteamUserPage"></workshop-author> </div> <div ng-if="!sourceIsInstalled && currentSelection.hasrating" class="infoRow browseWallpaperDetailsWorkshopRateRow"> <workshop-rating wr-item="currentSelection" set-user-vote="setUserVote" set-favorited="setFavorited"></workshop-rating> </div> <div class="infoRow center infoRowFaint" ng-if="!sourceIsInstalled"> <span>{{(currentSelection.typelabel|translate) || getDisplayType(currentSelection.type)}}</span> <span style="margin-left:6px" ng-if="currentSelection.filesizelabel">{{currentSelection.filesizelabel}}</span> </div> <div class="infoRow center wrap" ng-if="!sourceIsInstalled && currentSelection.tags"> \x3c!-- <span class="fas fa-tags infoRowIcon"></span> --\x3e \x3c!-- {{getDisplayTags(currentSelection.tags)}} --\x3e <span ng-repeat="tag in getDisplayTags(currentSelection.tags)" class="infoTagPill">{{tag}}</span> </div> <div class="infoRow" ng-if="currentSelection.description" style="margin:10px 0 5px 0;max-height:160px;overflow-y:auto;background:rgba(0,0,0,0.25);border-radius:4px;padding:8px;font-size:11px;line-height:1.4;white-space:pre-wrap;word-break:break-word;color:#ccc;text-align:left;">{{currentSelection.description}}</div> </div> <div class="detailButtons"> <div ng-if="sourceIsWorkshop && currentSelection.workshopid"> <div class="browseWallpaperDetailsWorkshopControls" style="display:flex;flex-direction:column;gap:8px;"> <div ng-if="activeDownloads[currentSelection.workshopid] && (activeDownloads[currentSelection.workshopid].phase === \'starting\' || activeDownloads[currentSelection.workshopid].phase === \'running\')"> <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:12px;"> <span class="text-info"><i class="fas fa-spinner fa-spin"></i> {{activeDownloads[currentSelection.workshopid].status}}</span> <span style="font-weight:bold;">{{(activeDownloads[currentSelection.workshopid].progress | number:0) || 0}}%</span> </div> <div class="progress" style="height:14px;margin-bottom:8px;background:rgba(255,255,255,0.1);"> <div class="progress-bar progress-bar-striped active" role="progressbar" ng-style="{width: (activeDownloads[currentSelection.workshopid].progress || 5) + \'%\'}"></div> </div> <button class="btn btn-danger btn-sm fullWidth" ng-click="cancelWorkshopDownload(currentSelection.workshopid)"> <span class="fas fa-times"></span> <span translate="ui_cancel"></span> </button> </div> <div ng-if="!activeDownloads[currentSelection.workshopid] || (activeDownloads[currentSelection.workshopid].phase !== \'starting\' && activeDownloads[currentSelection.workshopid].phase !== \'running\')"> <button class="btn btn-success fullWidth" ng-click="startWorkshopDownload(currentSelection.workshopid)" ng-disabled="!pluginsReady || isWallpaperInstalled(currentSelection.workshopid)"> <span class="fas fa-download"></span> <span ng-if="!pluginsReady && !isWallpaperInstalled(currentSelection.workshopid)"><span translate="ui_wep_loading_plugins"></span></span> <span ng-if="pluginsReady && isWallpaperInstalled(currentSelection.workshopid)"><span translate="ui_wep_btn_downloaded"></span></span> <span ng-if="pluginsReady && !isWallpaperInstalled(currentSelection.workshopid)"><span translate="ui_wep_btn_download"></span></span> </button> </div> </div> </div> <div ng-if="sourceIsInstalled && currentSelection" style="display:flex;gap:6px;margin-bottom:8px;"> <button ng-class="getExtractBtnClass(currentSelection)" style="flex:1;" ng-click="extractInstalledWallpaper(currentSelection)" ng-disabled="!pluginsReady || isExtractRunning(currentSelection)"> <span class="fas" ng-class="isExtractSuccess(currentSelection) ? \'fa-check\' : (isExtractRunning(currentSelection) ? \'fa-spinner fa-spin\' : \'fa-box-open\')"></span> <span ng-if="isExtractSuccess(currentSelection)"><span translate="ui_wep_btn_extracted"></span></span> <span ng-if="!isExtractSuccess(currentSelection) && !pluginsReady"><span translate="ui_wep_loading_plugins"></span></span> <span ng-if="!isExtractSuccess(currentSelection) && pluginsReady && isExtractRunning(currentSelection)"><span translate="ui_wep_extracting"></span></span> <span ng-if="!isExtractSuccess(currentSelection) && pluginsReady && !isExtractRunning(currentSelection)"><span translate="ui_wep_btn_extract"></span></span> </button> <button class="btn btn-danger" style="flex:1;" ng-click="deleteInstalledWallpaper(currentSelection)"> <span class="fas fa-trash"></span> <span translate="ui_wep_btn_delete"></span> </button> </div> <div ng-if="sourceIsInstalled && currentSelection && activeExtracts[currentSelection.workshopid || currentSelection.file || \'extract\'] && activeExtracts[currentSelection.workshopid || currentSelection.file || \'extract\'].status" style="font-size:11px;color:#aaa;margin-bottom:8px;">{{activeExtracts[currentSelection.workshopid || currentSelection.file || \'extract\'].status}}</div> <div ng-if="currentSelection.localAndExternal || currentSelection.official"> <a ng-click="callbackUnsubscribeOrRemove(currentSelection)" class="btn btn-danger fullWidth"> <span class="fas fa-times" aria-hidden="true"></span> {{\'ui_browse_details_btn_remove_from_history\' | translate}} </a> </div> <div ng-if="!(currentSelection.localAndExternal || currentSelection.official || currentSelection.workshopid)"> <a ng-click="callbackOpenInEditor(currentSelection)" class="btn btn-primary fullWidth"> <span class="fas fa-folder-open" aria-hidden="true"></span> {{\'ui_browse_details_btn_open_in_editor\' | translate}} </a>  </div> </div> <div ng-if="mobileManagerState.connectedDevices.length > 0 && canUploadWallpaperToMobileDevice(currentSelection)" class="browseWallpaperDetailsProperties"> <div class="browseWallpaperDetailsHeader"> <h5 class="browseWallpaperDetailsHeaderItem" translate="ui_browse_details_mobile_devices"></h5> <hr class="browseWallpaperDetailsHeaderDivider"> </div> <script type="text/ng-template" id="sendToAdvertiseTemplate.html"> <div ng-click="sendToMobileDevice(currentSelection, mobileManagerState.connectedDevices[0])" translate="ui_browse_advertise_send_to_mobile"></div> <\/script> <div class="browseWallpaperDetailSendToDeviceList" style="margin-top:4px" uib-popover-template="\'sendToAdvertiseTemplate.html\'" popover-placement="left" popover-is-open="browserSettings.advertisesendtomobile" popover-trigger="none" popover-class="popoverAdvertiseWorkshop" popover-append-to-body="true"> <a ng-repeat="device in mobileManagerState.connectedDevices" ng-click="sendToMobileDevice(currentSelection, device)" class="btn btn-default fullWidth sendBtn"> <span class="far fa-mobile-android" aria-hidden="true"></span> <span translate="ui_browse_details_btn_send_to_mobile_device" translate-values="{device:device.name}"></span> </a> </div> </div> <div class="browseWallpaperDetailsProperties" ng-if="sourceIsInstalled && getInstalledMetadata(currentSelection)" style="margin-bottom:12px;"> <div class="browseWallpaperDetailsHeader"> <h5 class="browseWallpaperDetailsHeaderItem"><span class="fab fa-steam" style="margin-right:6px;color:#66c0f4;"></span><span translate="ui_wep_details_metadata"></span></h5> <hr class="browseWallpaperDetailsHeaderDivider"> </div> <div style="background:rgba(0,0,0,0.25);border-radius:6px;padding:10px;font-size:12px;color:#ccc;"> <div ng-if="getInstalledMetadata(currentSelection).author" style="display:flex;justify-content:space-between;margin-bottom:6px;"> <span class="text-muted" translate="ui_browse_details_author"></span> <a style="cursor:pointer;color:#66c0f4;font-weight:bold;" ng-click="filterByAuthor(getInstalledMetadata(currentSelection).author)">{{getInstalledMetadata(currentSelection).author}}</a> </div> <div ng-if="getInstalledMetadata(currentSelection).file_size" style="display:flex;justify-content:space-between;margin-bottom:6px;"> <span class="text-muted" translate="ui_wep_details_size"></span> <span>{{getInstalledMetadata(currentSelection).file_size}}</span> </div> <div ng-if="getInstalledRating(currentSelection).stars > 0 || getInstalledMetadata(currentSelection).num_ratings" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"> <span class="text-muted" translate="ui_browse_details_rating"></span> <span> <span style="color:#ffc107;">{{getInstalledRating(currentSelection).filledStars}}</span><span style="color:rgba(255,193,7,0.3);">{{getInstalledRating(currentSelection).emptyStars}}</span> <span ng-if="getInstalledMetadata(currentSelection).num_ratings" class="text-muted" style="margin-left:4px;font-size:11px;">({{getInstalledMetadata(currentSelection).num_ratings}})</span> </span> </div> <div ng-if="getInstalledMetadata(currentSelection).posted_date" style="display:flex;justify-content:space-between;margin-bottom:6px;"> <span class="text-muted" translate="ui_wep_details_posted"></span> <span>{{getInstalledMetadata(currentSelection).posted_date}}</span> </div> <div ng-if="getInstalledMetadata(currentSelection).updated_date" style="display:flex;justify-content:space-between;margin-bottom:6px;"> <span class="text-muted" translate="ui_wep_details_updated"></span> <span>{{getInstalledMetadata(currentSelection).updated_date}}</span> </div> <div ng-if="getInstalledMetadataTags(currentSelection).length > 0" style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);"> <div class="text-muted" style="margin-bottom:6px;font-size:11px;" translate="ui_browse_filter_tags"></div> <div style="display:flex;flex-wrap:wrap;gap:3px 2px;"> <span ng-repeat="tag in getInstalledMetadataTags(currentSelection)" class="infoTagPill" style="display:inline-block;background:rgba(255,255,255,0.12);color:#e0e0e0;font-size:11px;font-weight:500;padding:2px 6px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);line-height:1.2;">{{getTagLabel(tag)}}</span> </div> </div> </div> </div> <div ng-if="sourceIsInstalled && currentSelection.status == \'installed\'" class="browseWallpaperDetailsProperties"> <div class="browseWallpaperDetailsHeader"> <h5 class="browseWallpaperDetailsHeaderItem" translate="ui_browse_details_properties"></h5> <hr class="browseWallpaperDetailsHeaderDivider"> </div> <div id="BrowserUserPropertiesParent"></div> <div ng-if="showPresetPublishOptions(currentSelection)"> <div class="browseWallpaperDetailsHeader"> <h5 class="browseWallpaperDetailsHeaderItem" translate="ui_browse_details_header_workshop"></h5> <hr class="browseWallpaperDetailsHeaderDivider"> </div> <div class="browseWallpaperDetailsActions"> <div class="browseWallpaperDetailsActionsRow"> <button class="btn btn-default browseWallpaperDetailsActionsRowItem" ng-click="callbackBrowsePresets(currentSelection)" tooltip="ui_browse_details_properties_preset_browse_workshop" t-values="{count:getNumberOfWorkshopPresets(currentSelection)}" t-align-right="true"><span ng-class="providerIcon + \'fa-fw\'"></span> <span class="browseWallpaperDetailsActionsRowItemLabel" translate="ui_browse_details_properties_preset_browse_workshop" translate-values="{count:getNumberOfWorkshopPresets(currentSelection)}"></span></button> <button class="btn btn-default browseWallpaperDetailsActionsRowItem browseWallpaperDetailsActionsRowItemSmall" ng-click="callbackShowPresetHint()"><span class="fas fa-fw fa-question"></span></button> </div> <div class="browseWallpaperDetailsActionsRow"> <button class="btn btn-primary browseWallpaperDetailsActionsRowItem" ng-click="callbackPublishPreset()"><span class="fas fa-fw fa-share"></span> {{\'ui_browse_details_properties_preset_publish_to_workshop\'|translate}}</button> </div> </div> </div> <div class="browseWallpaperDetailsHeader"> <h5 class="browseWallpaperDetailsHeaderItem" translate="ui_browse_details_header_presets"></h5> <hr class="browseWallpaperDetailsHeaderDivider"> </div> <div class="browseWallpaperDetailsActions"> <div class="browseWallpaperDetailsActionsRow"> \x3c!-- load / save --\x3e <a class="btn btn-default browseWallpaperDetailsActionsRowItem" ng-click="callbackLoadWallpaperProperties()" tooltip="ui_browse_details_properties_load" t-align-right="true"><span class="fas fa-fw fa-folder-open"></span> <span class="browseWallpaperDetailsActionsRowItemLabel">{{\'ui_browse_details_properties_load\'|translate}}</span></a> <a class="btn btn-default browseWallpaperDetailsActionsRowItem" ng-click="callbackSaveWallpaperProperties()" tooltip="ui_browse_details_properties_save" t-align-right="true"><span class="fas fa-fw fa-save"></span> <span class="browseWallpaperDetailsActionsRowItemLabel">{{\'ui_browse_details_properties_save\'|translate}}</span></a> </div> <div class="browseWallpaperDetailsActionsRow" ng-if="currentSelection.type===\'Scene\'||currentSelection.type===\'Video\'||currentSelection.type===\'Image\'"> \x3c!-- set as default --\x3e <a class="btn btn-default browseWallpaperDetailsActionsRowItem" ng-click="callbackSavePropertiesAsDefaults(currentSelection.properties[selectedMonitor.location])"><span class="fas fa-fw fa-list-alt"></span> <span translate="ui_browse_details_properties_apply_to_all_wallpapers" class="browseWallpaperDetailsActionsRowItemLabel"></span><span translate="ui_browse_details_properties_apply_to_all" class="browseWallpaperDetailsActionsRowItemLabelShow"></span></a> </div> <div class="browseWallpaperDetailsActionsRow"> \x3c!-- share json --\x3e <a class="btn btn-default browseWallpaperDetailsActionsRowItem" ng-click="callbackShareWallpaperProperties()"><span class="fas fa-fw fa-retweet"></span> {{\'ui_browse_details_properties_share_json\'|translate}}</a> </div> <div class="browseWallpaperDetailsActionsRow"> \x3c!-- reset --\x3e <a class="btn btn-danger browseWallpaperDetailsActionsRowItem" ng-click="callbackResetCurrentWallpaperProperties()"><span class="fas fa-fw fa-sync-alt"></span> {{\'ui_browse_details_properties_reset\'|translate}}</a> </div> </div> </div> </div> </div> </div> <div class="browseWallpaperFooter"> <div class="browseWallpaperFooterControls"> <div class="navigationControls controlFlex"> <div> <a class="btn btn-primary" tooltip="ui_browse_footer_btn_wallpaper_editor" ng-click="callbackShowEditor()" style="margin-right: 5px;"> <span class="fas fa-pencil-ruler" aria-hidden="true"></span> <span class="footerLeftText" translate="ui_browse_footer_btn_wallpaper_editor"></span> </a> <div class="btn-group dropup" tooltip="ui_browse_footer_btn_open_wallpaper" uib-dropdown is-open="status.isopen"> <a id="open-file-button-button" type="button" class="btn btn-default" uib-dropdown-toggle> <span class="glyphicon glyphicon-open" aria-hidden="true"></span> <span class="footerLeftText" translate="ui_browse_footer_btn_open_wallpaper"></span> </a> <ul class="dropdown-menu" uib-dropdown-menu role="menu"> <li role="menuitem"><a ng-click="callbackShowEditor()"><span class="fas fa-pencil-ruler"></span> <span translate="ui_browse_footer_btn_create_new_wallpaper"></span></a></li> <li role="menuitem"><a ng-click="openFromFile()"><span class="fas fa-film"></span> <span translate="ui_browse_footer_btn_open_animated_wallpaper"></span></a></li> <li role="menuitem"><a ng-click="openFromFile(\'static\')"><span class="fas fa-image"></span> <span translate="ui_browse_footer_btn_open_static_wallpaper"></span></a></li> <li role="menuitem"><a ng-click="openFromUrl()"><span class="fas fa-globe"></span> <span translate="ui_browse_footer_btn_open_from_url"></span></a></li> </ul> </div> </div> </div> <div> <div class="controls footerButtons"> <a class="btn btn-primary" ng-click="callbackOk()" translate="ui_ok"></a> <a class="btn btn-default" ng-click="callbackClose()" translate="ui_cancel"></a> </div> </div> </div> </div> <div class="browseWallpaperDropOverlay"> <div native-drop-target="dropFileEditor(droppedFiles)" style="margin-bottom:20px" ndt-config="dropConfigEditor"></div> <div native-drop-target="dropFile(droppedFiles)" ndt-config="dropConfigBrowser"></div> </div> </div> <div class="browseMonitorSelectionContainer" ng-hide="!changeMonitorActive"> <div class="backdrop" ng-click="toggleMonitorSelectionBackground($event)"></div> <div class="monitorModalOuter"> <div class="inner"> <div class="row" ng-click="toggleMonitorSelection()" style="cursor:pointer"> <a class="closeSelection"> <h3 style="margin:0"><span class="glyphicon glyphicon-chevron-up"></span></h3> </a> </div> <div class="row" ng-click="toggleMonitorSelection()" style="cursor:pointer;margin-bottom:15px;"> <div class="col-xs-12"> <h1 class="monitorHeader" translate="ui_browse_monitors_choose_monitor"></h1> </div> </div> <div ng-if="wallpaperConfigGroup==\'screensaver\'"> <div> <div class="row" style="margin-top: 10px;"> <div class="col-xs-12 monitorLayoutRow"> <div class="browseWallpaperScreensaverModeRow" style="margin:0"> <div class="browseWallpaperScreensaverModeRowInner"> <span class="lbl" translate="ui_browse_monitors_screensaver_mode_label"></span> <button class="btn" style="flex:1" ng-class="{\'btn-default\':!wallpaperConfigScreensaver.sameaswallpaper,\'btn-primary\':wallpaperConfigScreensaver.sameaswallpaper}" translate="ui_browse_monitors_same_as_wallpaper" ng-click="wallpaperConfigScreensaver.sameaswallpaper=true"></button> <button class="btn" style="flex:1" ng-class="{\'btn-default\':wallpaperConfigScreensaver.sameaswallpaper,\'btn-primary\':!wallpaperConfigScreensaver.sameaswallpaper}" translate="ui_browse_monitors_configured_separately" ng-click="wallpaperConfigScreensaver.sameaswallpaper=false"></button> </div> </div> </div> </div> <div class="row" style="margin-top:20px;" ng-if="wallpaperConfigScreensaver.sameaswallpaper"> <div class="col-xs-12 monitorLayoutRow"> <div class="browseAlert"> <uib-alert> <div style="display:flex;align-items:center;"> <div translate="ui_browse_monitors_same_as_wallpaper_hint"></div> </div> </uib-alert> </div> </div> </div> </div> <hr ng-if="!wallpaperConfigScreensaver.sameaswallpaper"> </div> <div ng-show="wallpaperConfigGroup==\'wallpaper\'||!wallpaperConfigScreensaver.sameaswallpaper"> <div class="row browseMonitorSelectionButtonRow"> <div class="col-xs-12 monitorLayoutRow"> <droplist class="monitorLayoutRowItem" dp-options="wallpaperConfigGroup==\'screensaver\'?layoutsScreensaver:layouts" dp-selected="wallpaperConfig.layout"></droplist> </div> </div> <div class="row" style="margin-top: 5px;" ng-show="wallpaperConfig.layout === 2"> <div class="col-xs-12 centerText" translate="ui_browse_monitors_clone_hdr_hint"> </div> </div> <div class="row browseMonitorSelectionButtonRow" ng-show="wallpaperConfig.layout === 0"> <div class="col-xs-12 monitorLayoutRow"> <a class="btn btn-default monitorLayoutRowItem" tooltip="ui_browse_monitors_split" ng-if="!selectedMonitor.isGroup && !selectedMonitor.isInGroup" ng-click="callbackSplitSelectedMonitor(selectedMonitor)"><span class="fas fa-fw fa-cut"></span> {{\'ui_browse_monitors_split\'|translate}}</a> \x3c!-- Remove group button --\x3e <a class="btn btn-danger monitorLayoutRowItem" ng-if="selectedMonitor.isGroup || selectedMonitor.isInGroup" ng-click="callbackRemoveGroup(selectedMonitor)" tooltip="ui_browse_monitors_ungroup"><span class="fas fa-fw fa-object-ungroup"></span> {{\'ui_browse_monitors_ungroup\'|translate}}</a> \x3c!-- Group extend button, no drop down --\x3e <button class="btn btn-default dropdown-toggle monitorLayoutRowItem" ng-if="!selectedMonitor.isSplit && selectedMonitor.isGroup" ng-class="{\'active\':monitorSelectionState.createGroup}" ng-disabled="monitors.length < 2" tooltip="ui_browse_monitors_group" data-toggle="dropdown" ng-click="monitorSelectionState.createGroup=selectedMonitor.layout"><span class="fas fa-fw fa-object-group"></span> {{\'ui_browse_monitors_group\'|translate}}</button> \x3c!-- Group create button with drop down --\x3e <div class="monitorLayoutRowItem" ng-if="!selectedMonitor.isSplit && !selectedMonitor.isGroup" style="position:relative"> <button class="btn btn-default dropdown-toggle" ng-class="{\'active\':monitorSelectionState.createGroup}" ng-disabled="monitors.length < 2" tooltip="ui_browse_monitors_group" data-toggle="dropdown" ng-click="callbackCancelMonitorGrouping($event)" style="width: 100%;"><span class="fas fa-fw fa-object-group"></span> {{\'ui_browse_monitors_group\'|translate}}</button> <ul class="dropdown-menu" style="width:100%"> <li ng-click="monitorSelectionState.createGroup=1"> <a><span class="fas fa-fw fa-object-group"></span> <div class="dropdown-san-item" translate="ui_browse_monitors_stretch"></div> </a> </li> <li ng-click="monitorSelectionState.createGroup=2"> <a><span class="fas fa-fw fa-clone"></span> <div class="dropdown-san-item" translate="ui_browse_monitors_clone"></div> </a> </li> </ul> </div> <a class="btn btn-danger monitorLayoutRowItem" ng-if="selectedMonitor.isSplit" ng-click="callbackRemoveSplit(selectedMonitor)" tooltip="ui_browse_monitors_remove_split"><span class="fas fa-fw fa-times"></span> {{\'ui_browse_monitors_remove_split\'|translate}}</a> </div> </div> <div class="row browseMonitorSelectionButtonRow" style="margin-bottom: 20px"> <div class="col-xs-12 monitorLayoutRow"> <a class="btn btn-default monitorLayoutRowItem" tooltip="ui_browse_monitors_load_profile" ng-click="callbackShowProfiles()"><span class="fas fa-fw fa-folder-open"></span> {{\'ui_browse_monitors_load_profile\'|translate}}</a> <a class="btn btn-default monitorLayoutRowItem" tooltip="ui_browse_monitors_save_profile" ng-click="callbackShowProfiles(true)"><span class="fas fa-fw fa-save"></span> {{\'ui_browse_monitors_save_profile\'|translate}}</a> </div> </div> <div> <div class="monitorSelectionInnerLayout"> \x3c!-- <div > --\x3e <div class="monitorSelectionBox" id="MonitorSelectionBox"> <div class="monitorSelectionFlex"> <div ng-attr-style="{{monitorSelectionBoxStyle}}" ng-class="{\'monitorSelectionGroupActive\':monitorSelectionState.createGroup}"> <monitor-selection ms-controller="monitorController" ms-monitors="monitors" ms-scale="monitorScale" ms-splits="monitorSplits" ms-selected-monitor="selectedMonitor" ms-make-selection="callbackSelectMonitor(monitor, toggleMonitorSelection === true)" ms-on-split-moved="callbackSplitMoved(location, position)" ms-split-dbl-click="callbackSplitDblClick(location)" ms-selection-state="monitorSelectionState" ms-create-group="callbackCreateGroup(monitors)" ms-groups="monitorGroups" ms-layout="wallpaperConfig.layout" ms-monitor-context-menu="callbackMonitorRightClick($event, monitor, baseMonitor)" ms-split-context-menu="callbackSplitRightClick($event, location)" ms-user-monitor-settings="userMonitorSettings"></monitor-selection> </div> </div> </div> \x3c!-- </div> --\x3e </div> </div> <div class="buttonRow"> <a class="btn btn-primary" ng-click="toggleMonitorSelection()">{{wallpaperConfigGroup==\'screensaver\'?\'ui_browse_monitors_change_screensaver\':\'ui_browse_monitors_change_wallpaper\'|translate}}</a> <a class="btn btn-default" ng-click="callbackRemoveWallpaperAndPlaylistFromMonitor(selectedMonitor.location)">{{wallpaperConfigGroup==\'screensaver\'?\'ui_browse_monitors_remove_screensaver\':\'ui_browse_monitors_remove_wallpaper\'|translate}}</a> </div> </div> <div class="checkboxRow" ng-if="showMonitorAutoShowToggle"> <checkbox cb-checked="browserSettings.showmonitorselectiononstart" cb-title="\'ui_browse_monitors_show_on_start\'"></checkbox> </div> </div> </div> </div> <div class="browseMonitorSelectionContainer" ng-hide="!mobileDeviceManagementActive"> <div class="backdrop" ng-click="toggleManageMobileDevicesBackground($event)"></div> <div class="monitorModalOuter"> <div class="inner"> <div class="row" ng-click="toggleManageMobileDevices()" style="cursor:pointer;"> <a class="closeSelection"> <h3><span class="glyphicon glyphicon-chevron-up"></span></h3> </a> </div> <div class="row" ng-click="toggleManageMobileDevices()" style="cursor:pointer;"> <div class="col-xs-12"> <h1 class="monitorHeader" translate="ui_browse_mobile_devices_header"></h1> </div> </div> <div> <mobile-manager mm-state="mobileManagerState" mm-devices="browserSettings.paireddevices"></mobile-manager> </div> </div> </div> </div> <div class="browseWallpaperTopBar"> <div ng-if="steamWorkshopStatus" ng-click="callbackClickSteamStatus()" class="browseWallpapersWorkshopStatus" ng-class="{\'workshopError\' : steamWorkshopStatus.error, \'invis\':steamWorkshopStatus.hidden}"> <div> <span ng-class="providerIcon"></span></div> <div translate="{{steamWorkshopStatus.text}}" translate-values="{{steamWorkshopStatus}}"></div> </div> </div> <div class="browseMobileToastParent ng-hide" ng-show="mobileUploadState.visible"> <div class="toast"> <div> <wp-anim class="wpAnimMobile" wpa-file="anims/logo_white.json" wpa-playing="mobileUploadState.visible"></wp-anim> </div> <div class="status"> <div class="message" translate="{{mobileUploadState.token}}" translate-values="mobileUploadState"></div> <div class="info">{{mobileUploadState.status|translate}}</div> </div> <div class="controls"> <a ng-click="cancelMobileUploads()" class="cancelButton"> <span class="fas fa-times"></span> </a> </div> <div class="mmProgress" ng-attr-style="width:{{mobileUploadState.progress * 100}}%"> <div ng-if="extractStatusNotice" style="position:fixed;bottom:24px;right:24px;z-index:99999;background:rgba(18,24,38,0.96);border:1px solid rgba(255,255,255,0.15);border-left:4px solid;border-radius:6px;padding:9px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.6);display:flex;align-items:center;gap:10px;color:#fff;font-size:12px;font-family:sans-serif;pointer-events:none;transition:all .2s ease-in-out;" ng-style="{\'border-left-color\': extractStatusNotice.phase===\'success\' ? \'#5cb85c\' : (extractStatusNotice.phase===\'error\' ? \'#d9534f\' : \'#66c0f4\')}"> <span class="fas" ng-class="{\'fa-spinner fa-spin\': extractStatusNotice.phase===\'running\', \'fa-check-circle\': extractStatusNotice.phase===\'success\', \'fa-exclamation-triangle\': extractStatusNotice.phase===\'error\'}" ng-style="{\'color\': extractStatusNotice.phase===\'success\' ? \'#5cb85c\' : (extractStatusNotice.phase===\'error\' ? \'#d9534f\' : \'#66c0f4\')}"></span> <span>{{extractStatusNotice.text}}</span> </div> </div> </div> </div> </div> ',
        ),
        e.put(
          "views/modals/queryworkshopmodal.html",
          '<div class="modalContainer editorQueryAssetModal"> <div class="modal-header"> <h4 class="modal-title" translate="ui_query_workshop_modal_header_assets" translate-values="settings"></h4> </div> <div class="modal-body editorQueryAssetModalLayout"> <div class="left"> <div class="browseWallpaperSearchContainer"> <div class="form-group has-feedback browseWallpaperSearchContainerSearchField"> <div ng-class="{\'input-group\':filter.text}"> <input id="browseSearchFilterText" type="text" class="form-control" placeholder="{{\'ui_browse_search_placeholder\' | translate}}" ng-model="filter.text" ng-model-options="{debounce:100}"> <span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span> <div class="input-group-btn"> <button ng-if="filter.text" class="btn btn-danger" ng-click="resetSearchFilter()"> <i class="glyphicon glyphicon-remove"></i> </button> </div> </div> </div> <div> <a ng-click="showFilter.visible=!showFilter.visible" class="btn btn-primary filterBtn"> <span class="fas fa-tasks filterIcon"></span> <span class="filterLabel" translate="ui_browse_filter_results"></span> <span ng-if="showFilter.counts && sourceIsWorkshop && (steamWorkshopStatus.complete || steamWorkshopStatus.error)" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> </a> </div> <div class="browseWallpaperSearchContainerFill"> </div> <div class="browseWallpaperSearchContainerSort" style="min-width: 280px; width: auto; max-width: 420px; display: inline-flex; align-items: center;"> <droplist ng-class="sortOptionsClass" dp-options="sortOptions" dp-selected="filter.sort"></droplist> </div> </div> <div class="browseWallpaperGridParent" ng-hide="sourceIsPluginSettings"> <div class="browseWallpaperGridContainerParent"> <div class="browseWallpaperFilter ng-hide" ng-show="showFilter.visible && !sourceIsExplore"> <div> <div class="browseFilterTopBar"> <span> <a ng-click="callbackResetFilter()" class="btn btn-primary iconInfo"> <span class="fas fa-sync-alt"></span> <span translate="ui_browse_filter_reset"></span> </a> </span> </div> \x3c!-- TYPES --\x3e <div ng-if="!filterPreset.workshopid"> <div class="filterHeader browseFilterToggle" ng-click="filterHideTypes=!filterHideTypes"> <span ng-if="filterHideTypes" class="fas fa-fw fa-caret-down"></span> <span ng-if="!filterHideTypes" class="fas fa-fw fa-caret-right"></span> <span translate="ui_browse_filter_type"></span> \x3c!-- <span ng-if="filterStatus.type" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> --\x3e </div> <div class="browseFilterHide" ng-show="filterHideTypes"> <div class="filterItem" ng-repeat="tag in filterTypeTags"> <checkbox cb-checked="filter.typetags[tag.value]" cb-title="tag.label"></checkbox> </div> <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- RATING --\x3e <div ng-if="canUseAgeRatingTags()"> <div class="filterHeader browseFilterToggle" ng-click="filterHideRating=!filterHideRating"> <span ng-if="filterHideRating" class="fas fa-fw fa-caret-down"></span> <span ng-if="!filterHideRating" class="fas fa-fw fa-caret-right"></span> <span translate="ui_workshop_workshop_tags_rating"></span> \x3c!-- <span ng-if="filterStatus.rating" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> --\x3e </div> <div class="browseFilterHide" ng-show="filterHideRating"> <div class="filterItem" ng-repeat="tag in filterRatingTags"> <checkbox cb-checked="filter.ratingtags[tag.value]" cb-title="tag.label"></checkbox> </div> <div class="browseFilterBottomPadding"></div> </div> </div> \x3c!-- GENRES --\x3e <div class="filterHeader browseFilterToggle" ng-click="filterHideGenres=!filterHideGenres"> <span ng-if="!filterHideGenres" class="fas fa-fw fa-caret-down"></span> <span ng-if="filterHideGenres" class="fas fa-fw fa-caret-right"></span> <span class="filterHeader" translate="ui_browse_filter_tags"></span> \x3c!-- <span ng-if="filterStatus.tags" class="browseFilterActiveClass" translate="ui_browse_filter_results_filtered"></span> --\x3e </div> <div class="browseFilterHide" ng-hide="filterHideGenres"> <div class="filterItem" ng-repeat="tag in filterUtilityTags"> <checkbox cb-type="tag" cb-checked="filter.utilitytags[tag.value]" cb-title="tag.label"></checkbox> <span ng-if="tag.value==\'Approved\'" class="fas fa-trophy browseWallpaperApproved"></span> </div> <div class="filterDivider"></div> <div class="filterItem" ng-repeat="tag in filterAssetGenreTags"> <checkbox cb-checked="filter.assetgenretags[tag.value]" cb-title="tag.label"></checkbox> </div> </div> </div> </div> <div class="browseWallpaperGridAndNavigationView"> <div class="browseWallpaperGridView"> <div ng-if="queryWallpapers.length == 0" class="emptyGrid"> <span ng-class="{\'emptyGridDanger\':showErrorInBackground}" ng-bind-html="queryActive ? \'ui_browse_grid_no_results_refreshing\' : showErrorInBackground ? \'ui_browse_no_service_body\' : \'ui_browse_grid_no_results_generic\' | translate"></span> <div ng-if="!queryActive && showErrorInBackground" style="margin-top:20px;"> <a class="btn btn-default btn-lg" ng-click="callbackChangePage(currentPage, true)"><span class="fas fa-sync-alt"></span> <span translate="ui_browse_reload"></span></a> </div> <wp-anim class="wpAnimQuery" wpa-file="anims/logo_white.json"></wp-anim> </div> <wallpaper-thumbnail class="wallpaperBrowseInner" wt-wallpapers="queryWallpapers" wt-selection="currentSelection" wt-mousecallback="callbackWallpaperAllMouse(btn, context, $event)" ng-class="\'browseViewSizemedium\'" id="BrowseAssetGrid" wt-tag="\'assetworkshop\'"></wallpaper-thumbnail> </div> </div> </div> <div class="browseWallpaperPagination" ng-show="pagination.visible"> <div> <span><a class="fas fa-angle-double-left paginationIcon" ng-click="callbackChangePage(\'prev\')"></a></span> <span ng-repeat="page in pagination.pages"><a class="paginationIcon pageItem" ng-click="callbackChangePage(page.label)" ng-class="{\'{{page.class}}\':true, \'linkOverrideActive\':page.label==pagination.current}">{{page.label}}</a></span> <span><a class="fas fa-angle-double-right paginationIcon" ng-click="callbackChangePage(\'next\')"></a></span> </div> </div> </div> </div> <div class="browseWallpaperDetailView right"> <div ng-if="!currentSelection" class="placeholder details"> <div translate="ui_browse_select_prompt_asset"></div> </div> <div ng-if="currentSelection" class="details"> <div class="previewContainer"> <div> <img ng-src="{{currentSelection.preview}}" class="previewImage" style="object-fit: contain;width:100%;"> </div> </div> <div class="info"> <div class="content-title"> {{currentSelection.title}} </div> <div class="infoRow center" ng-if="!currentSelection.local"> <workshop-author wa-item="currentSelection" wa-infos="workshopController.steamUserInfos" wa-open-user-page="openSteamUserPage"></workshop-author> </div> <div class="infoRow center" ng-if="currentSelection.assettypeslabel"> <div>{{currentSelection.assettypeslabel}}</div> </div> <div class="infoRow center" ng-if="currentSelection.filesizelabel"> <div>{{\'ui_browse_details_filesize\'|translate}} {{currentSelection.filesizelabel}}</div> </div> <div ng-if="currentSelection.hasrating" class="infoRow browseWallpaperDetailsWorkshopRateRow" style="min-height:24px;display:flex;align-items:center;justify-content:center;margin:4px 0;"> <workshop-rating wr-item="currentSelection" set-user-vote="workshopController.setUserVote" set-favorited="workshopController.setFavorited"></workshop-rating> </div> </div> <div class="detailButtons" ng-if="currentSelection.workshopid"> <div class="browseWallpaperDetailsWorkshopControls"> <a ng-if="currentSelection.status !== \'downloadable\'" ng-click="unsubscribeWorkshopItem(currentSelection)" class="btn btn-danger"> <span class="fas fa-times" aria-hidden="true"></span> {{\'ui_browse_details_btn_unsubscribe\' | translate}} </a> <a ng-if="currentSelection.status === \'downloadable\'" ng-click="workshopController.subscribeWorkshopItem(currentSelection.workshopid)" class="btn btn-success"> <span class="fas fa-download" aria-hidden="true"></span> {{\'ui_browse_details_btn_download\' | translate}} </a> <a ng-click="workshopController.openSteamWorkshopPage(currentSelection)" class="btn btn-default" tooltip="ui_browse_details_btn_workshop" t-align-right="true"> <span ng-class="providerIcon" aria-hidden="true"></span> {{\'ui_browse_details_btn_comment\' | translate}} </a> </div> </div> <div class="info" ng-if="currentSelection.description"> <pre class="resetPre" style="margin-top:10px">{{currentSelection.description}}</pre> </div> </div> </div> </div> <div class="modal-footer"> <div> \x3c!-- <button class="btn btn-primary" ng-click="ok()" translate="ui_ok"></button> --\x3e <button class="btn btn-default" ng-click="close()" translate="ui_close"></button> </div> </div> </div> ',
        ),
        e.put(
          "views/templates/workshopauthordynamic.html",
          '<span class="infoAuthor"> <img ng-if="waInfos[waItem.authorsteamid] && waInfos[waItem.authorsteamid].avatar" ng-src="{{waInfos[waItem.authorsteamid].avatar}}" class="avatar infoAuthorItem" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)"> <img ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].avatar) && waItem.author_avatar" ng-src="{{waItem.author_avatar}}" class="avatar infoAuthorItem" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)"> <img ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].avatar) && !waItem.author_avatar" src="images/noavatar.jpg" class="avatar infoAuthorItem"> <a ng-if="waInfos[waItem.authorsteamid] && waInfos[waItem.authorsteamid].name" class="infoAuthorItem infoAuthorTitle" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)">{{waInfos[waItem.authorsteamid].name}}</a> <a ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].name) && waItem.author" class="infoAuthorItem infoAuthorTitle" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)">{{waItem.author}}</a> <span ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].name) && !waItem.author" class="infoAuthorItem infoAuthorTitle">{{waItem.author || (\'ui_browse_details_author_pending\' | translate)}}</span> </span> ',
        ),
        e.put(
          "views/templates/workshopauthorstatic.html",
          '<span> <img ng-if="waInfos[waItem.authorsteamid] && waInfos[waItem.authorsteamid].avatar" ng-src="{{waInfos[waItem.authorsteamid].avatar}}" class="avatar infoAuthorItem" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)"> <img ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].avatar) && waItem.author_avatar" ng-src="{{waItem.author_avatar}}" class="avatar infoAuthorItem" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)"> <img ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].avatar) && !waItem.author_avatar" src="images/noavatar.jpg" class="avatar infoAuthorItem"> <a ng-if="waInfos[waItem.authorsteamid] && waInfos[waItem.authorsteamid].name" class="infoAuthorItem infoAuthorTitle" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)">{{waInfos[waItem.authorsteamid].name}}</a> <a ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].name) && waItem.author" class="infoAuthorItem infoAuthorTitle" style="cursor:pointer;" ng-click="waBrowseAuthor(waItem.authorsteamid || waItem.author_url || waItem.author, $event)">{{waItem.author}}</a> <span ng-if="(!waInfos[waItem.authorsteamid] || !waInfos[waItem.authorsteamid].name) && !waItem.author" class="infoAuthorItem infoAuthorTitle">{{waItem.author || (\'ui_browse_details_author_pending\' | translate)}}</span> </span> ',
        ),
        e.put(
          "views/templates/workshopratingscore.html",
          '<div class="browseWallpaperDetailsWorkshopRateRowRating" style="position:static !important;display:flex !important;align-items:center !important;justify-content:center !important;min-height:24px !important;margin:4px 0 !important;"> <div class="browseWallpaperDetailsWorkshopRateRowRatingScore"> <span class="score">{{wrItem.rating | number : 1}}&percnt;</span> </div> </div> ',
        ),
        e.put(
          "views/templates/workshopratingstars.html",
          '<div class="browseWallpaperDetailsWorkshopRateRowRating" style="position:static !important;display:flex !important;align-items:center !important;justify-content:center !important;min-height:24px !important;margin:4px 0 !important;"> <div style="display:inline-flex;align-items:center;"> <span class="browseWallpaperDetailsWorkshopRateRowRatingStars" style="position:static !important;display:inline-flex !important;align-items:center;" ng-class="{\'disabled\':wrItem.ratingrounded < 1}"> <span class="glyphicon" ng-class="{\'glyphicon-star-empty\':wrItem.ratingrounded < 1,\'glyphicon-star\':wrItem.ratingrounded >= 1}"></span> <span class="glyphicon" ng-class="{\'glyphicon-star-empty\':wrItem.ratingrounded < 2,\'glyphicon-star\':wrItem.ratingrounded >= 2}"></span> <span class="glyphicon" ng-class="{\'glyphicon-star-empty\':wrItem.ratingrounded < 3,\'glyphicon-star\':wrItem.ratingrounded >= 3}"></span> <span class="glyphicon" ng-class="{\'glyphicon-star-empty\':wrItem.ratingrounded < 4,\'glyphicon-star\':wrItem.ratingrounded >= 4}"></span> <span class="glyphicon" ng-class="{\'glyphicon-star-empty\':wrItem.ratingrounded < 5,\'glyphicon-star\':wrItem.ratingrounded >= 5}"></span> </span> </div> </div> ',
        ),
        e.put(
          "views/views/welcome.html",
          '<div class="welcomeDialogRoot"> <div class="welcomeTitle"> <h3 translate="ui_welcome_header"></h3> \x3c!-- <img src="images/wp_logo.png"> --\x3e </div> <div class="welcomeBody container-fluid"> <div class="page container-fluid" ng-class="{\'past\': page > 0}" ng-show="page===0||lastPage===0"> <div class="row" style="margin-top: 10px;"> <div class="col-xs-2"></div> <div class="col-xs-2"><span style="position:relative;top:-7px;font-size:280%" class="far fa-language"></span></div> <div class="col-xs-6"> <droplist class="welcomeLanguageDropList" dp-options="availableLanguages" dp-selected="generalSettings.language"></droplist> </div> <div class="col-xs-2"></div> </div> <div class="row" style="margin-top: 10px;"> <div class="col-xs-12" translate="ui_welcome_intro"></div> </div> <div class="row"> <div class="col-xs-12 text-center" style="pointer-events: none;"> <div class="wpAnim"> <wp-anim class="wpAnimWelcome" ng-if="!useDarkSkin"></wp-anim> <wp-anim class="wpAnimWelcome" ng-if="useDarkSkin" wpa-file="anims/logo_blue_white.json"></wp-anim> \x3c!--                         <img class="offset" src="images/wp_logo_blue_outer_rect.png">\r\n                        <img class="spin" src="images/wp_logo_blue_inner_rect.png"> --\x3e </div> </div> </div> </div> <div class="page welcomeDialogOptions" ng-class="{\'past\': page > 1, \'future\': page < 1}" ng-show="page===1||lastPage===1"> <div class="col-xs-12"> \x3c!-- <span class="wdLabel" translate="ui_welcome_quality_body"></span> --\x3e \x3c!-- <br /> --\x3e \x3c!-- <br /> --\x3e <div class="row wdRow"> <div class="col-xs-12" translate="ui_welcome_quality_column_header"></div> </div> <br> <div class="row"> <div class="col-xs-12"> <div class="btn-group wdQualityRow"> <a class="btn btn-primary wdQualityButton" uib-btn-radio="\'low\'" ng-model="qualityPreset"><span translate="ui_settings_gfx_preset_low"></span></a> <a class="btn btn-primary wdQualityButton" uib-btn-radio="\'medium\'" ng-model="qualityPreset"><span translate="ui_settings_gfx_preset_medium"></span></a> <a class="btn btn-primary wdQualityButton" uib-btn-radio="\'high\'" ng-model="qualityPreset"><span translate="ui_settings_gfx_preset_high"></span></a> <a class="btn btn-primary wdQualityButton" uib-btn-radio="\'ultra\'" ng-model="qualityPreset"><span translate="ui_settings_gfx_preset_ultra"></span></a> </div> </div> </div> <br> <div class="row"> \x3c!-- <div class="col-xs-5" translate="ui_welcome_quality_description_header"></div> --\x3e <div class="col-xs-12"> <div class="row"> <div class="col-xs-6" translate="ui_welcome_quality_fps_limit"></div> <div class="col-xs-6 wdLabel">{{generalSettings.fps}}</div> </div> <div class="row"> <div class="col-xs-6" translate="ui_welcome_quality_anti_aliasing"></div> <div class="col-xs-6 wdLabel">MSAA {{generalSettings.msaa}}</div> </div> <div class="row"> <div class="col-xs-6" translate="ui_welcome_quality_bloom"></div> <div class="col-xs-6 wdLabel">{{generalSettings.postprocessing == \'ultra\' ? \'ui_settings_gfx_ultra\' : generalSettings.postprocessing == \'enabled\' ? \'ui_settings_gfx_enabled\' : \'ui_settings_gfx_disabled\' | translate}}</div> </div> <div class="row"> <div class="col-xs-6" translate="ui_welcome_quality_lighting"></div> <div class="col-xs-6 wdLabel">{{(\'ui_settings_gfx_preset_\' + generalSettings.shadows) | translate}}</div> </div> <div class="row"> <div class="col-xs-6" translate="ui_welcome_quality_reflections"></div> <div class="col-xs-6 wdLabel">{{generalSettings.reflection ? \'ui_settings_gfx_enabled\' : \'ui_settings_gfx_disabled\' | translate}}</div> </div> </div> </div> <div ng-if="led.visible"> <hr> <span class="wdLabel" translate="ui_welcome_use_led_effects_description"></span> <div class="row wdRow"> <div class="col-xs-5" translate="ui_welcome_use_led_effects" ng-click="led.enabled=!led.enabled"></div> <div class="col-xs-7"> <checkbox cb-checked="led.enabled"></checkbox> </div> </div> </div> </div> </div> <div class="page welcomeDialogOptions" ng-class="{\'past\': page > 2, \'future\': page < 2}" ng-show="page===2||lastPage===2"> <div class="col-xs-12"> <div class="wdAutoBorder"> <span class="wdLabel" translate="ui_welcome_autostart_description"></span> <br> <div class="row wdRow"> <div class="col-xs-5" translate="ui_welcome_autostart_label"></div> <div class="col-xs-7"> <div class="wdAutoStart"> <checkbox cb-checked="generalSettings.autostart" cb-changed="toggleAutoStartRegistry(generalSettings.autostart)" cb-title="\'\'" cb-disabled="generalSettings.autostartscheduler" ng-show="!generalSettings.autostartscheduler"></checkbox> <a class="btn btn-primary" ng-class="{\'btn-success\':generalSettings.autostartscheduler}" ng-click="generalSettings.autostart&&toggleAutoStartScheduler(!generalSettings.autostartscheduler)" ng-disabled="!generalSettings.autostart"><img src="images/uac_small.png"> {{generalSettings.autostartscheduler ? \'ui_settings_remove_service\' : \'ui_settings_register_service\' | translate}}</a> </div> </div> </div> </div> <br> <br> <span class="wdLabel" translate="ui_welcome_windows_color_description"></span> <br> <div class="row wdRow"> <div class="col-xs-5" translate="ui_welcome_windows_color_header"></div> <div class="col-xs-7"> <checkbox ng-if="!isWindows10OrGreater" cb-title="\'\'" cb-checked="dwmColorSettings.adjustdwmcolor"></checkbox> <droplist ng-if="isWindows10OrGreater" dp-options="adjustDWMColorModes" dp-selected="dwmColorSettings.adjustdwmcolormode"></droplist> </div> </div> <br> <br> <span class="wdLabel" translate="ui_welcome_use_dark_theme_description"></span> <br> <div class="row wdRow"> <div class="col-xs-5" translate="ui_welcome_use_dark_theme" ng-click="useDarkSkin=!useDarkSkin"></div> <div class="col-xs-7"> <checkbox cb-checked="useDarkSkin"></checkbox> </div> </div> </div> </div> <div class="page welcomeDialogOptions" ng-class="{\'past\': page > 3, \'future\': page < 3}" ng-show="page===3||lastPage===3"> <div class="col-xs-12"> <span translate="ui_welcome_finish_body"></span> <div style="margin-top:20px" class="text-center"> <img src="images/tray_example.png"> </div> </div> </div> </div> <div class="welcomeFooter container-fluid"> <div class="row"> <div class="col-xs-12 text-center"> <a class="navigationDot" ng-class="{\'active\':page===0}" ng-click="page=0"></a> <a class="navigationDot" ng-class="{\'active\':page===1}" ng-click="page=1"></a> <a class="navigationDot" ng-class="{\'active\':page===2}" ng-click="page=2"></a> <a class="navigationDot" ng-class="{\'active\':page===3}" ng-click="page=3"></a> </div> </div> <div style="display: flex;"> <div style="flex-grow: 1"> <div style="padding-top: 4px" ng-show="page===3"> <checkbox cb-checked="showBrowseWallpapers" cb-title="\'ui_welcome_browse_wallpapers_now\'"></checkbox> </div> </div> <div> <a class="btn btn-primary buttonParent btn-lg pull-right" ng-click="advancePage()"> <div class="buttonFade" ng-show="page===0"><span translate="ui_welcome_button_first_page"></span> <span class="glyphicon pull-right glyphicon-chevron-right"></span></div> <div class="buttonFade" ng-show="page!==0&&page!==3"><span translate="ui_welcome_button_next_page"></span> <span class="glyphicon pull-right glyphicon-chevron-right"></span></div> <div class="buttonFade" ng-show="page===3"> <span translate="ui_welcome_button_last_page"></span> <span class="fas pull-right fa-check" style="position:relative;top:2px;"></span></div> </a> </div> </div> </div>   </div> ',
        ));
    },
  ]);
