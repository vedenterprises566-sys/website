/**
 * Authentication service for Ved Enterprises Admin Console
 */

const AUTH_STORAGE_KEY = 'ved_admin_auth_session';
const CUSTOM_PASS_KEY = 'ved_admin_custom_password';
const DEFAULT_PASSWORD = 'admin@ved2026';
const VALID_USERNAMES = [
  'admin',
  'admin@ved.enterprises',
  'vedenterprises566@gmail.com',
];

export interface AuthSession {
  username: string;
  loginTime: number;
  rememberMe: boolean;
}

export class AuthService {
  /**
   * Returns current active password (custom password if changed by admin, or default)
   */
  static getActivePassword(): string {
    try {
      const custom = localStorage.getItem(CUSTOM_PASS_KEY);
      if (custom && custom.trim().length >= 4) {
        return custom.trim();
      }
    } catch (e) {}
    return DEFAULT_PASSWORD;
  }

  /**
   * Sets a new admin password
   */
  static setCustomPassword(newPassword: string): boolean {
    if (!newPassword || newPassword.trim().length < 4) return false;
    try {
      localStorage.setItem(CUSTOM_PASS_KEY, newPassword.trim());
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Resets password back to default
   */
  static resetToDefaultPassword(): void {
    try {
      localStorage.removeItem(CUSTOM_PASS_KEY);
    } catch (e) {}
  }

  /**
   * Checks whether the user is currently authenticated
   */
  static isAuthenticated(): boolean {
    try {
      // Check session storage first (for session-only logins)
      const sessionData = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData) as AuthSession;
        if (parsed.username) return true;
      }

      // Check local storage (for "remember me" logins - valid for 30 days)
      const localData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData) as AuthSession;
        const now = Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        if (parsed.username && now - parsed.loginTime < thirtyDaysMs) {
          return true;
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('[AuthService] Error checking auth:', e);
    }
    return false;
  }

  /**
   * Validates credentials and creates session
   */
  static login(
    identifier: string,
    passwordAttempt: string,
    rememberMe: boolean = true
  ): { success: boolean; message: string } {
    const cleanUser = (identifier || '').toLowerCase().trim();
    const cleanPass = (passwordAttempt || '').trim();

    if (!cleanUser) {
      return { success: false, message: 'Please enter your username or email address.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    const isUserValid =
      cleanUser === 'admin' ||
      cleanUser === 'admin@ved.enterprises' ||
      cleanUser === 'vedenterprises566@gmail.com';

    const currentPass = this.getActivePassword();

    // Check against active password
    const isPassValid = cleanPass === currentPass;

    if (!isUserValid || !isPassValid) {
      return {
        success: false,
        message: 'Invalid username or password. Access denied.',
      };
    }

    const session: AuthSession = {
      username: cleanUser,
      loginTime: Date.now(),
      rememberMe,
    };

    try {
      const sessionStr = JSON.stringify(session);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, sessionStr);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, sessionStr);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthService] Storage write notice:', e);
    }

    return {
      success: true,
      message: `Welcome back, ${cleanUser}! Redirecting to Admin Console...`,
    };
  }

  /**
   * Logs out the user and clears all credentials
   */
  static logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
  }

  /**
   * Gets current logged in user display name
   */
  static getCurrentUser(): string {
    try {
      const s = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        return parsed.username || 'Administrator';
      }
    } catch (e) {}
    return 'Administrator';
  }
}
