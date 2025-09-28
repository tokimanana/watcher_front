export class StorageKeys {
  // Auth related keys
  static readonly ACCESS_TOKEN = 'access_token';
  static readonly REFRESH_TOKEN = 'refresh_token';
  static readonly USER = 'current_user';
  static readonly TOKEN_EXPIRES_AT = 'token_expires_at';

  // App preferences
  static readonly THEME = 'app_theme';
  static readonly LANGUAGE = 'app_language';

  // User preferences
  static readonly TECH_INTERESTS = 'tech_interests';
  static readonly NOTIFICATION_SETTINGS = 'notification_settings';

  // Session data
  static readonly LAST_ACTIVE = 'last_active_timestamp';
  static readonly REMEMBER_ME = 'remember_me';

  // Feature flags
  static readonly FEATURE_FLAGS = 'feature_flags';
}
