export default class Auth {
  static _storage = localStorage;
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token, remember) {
    this._storage.setItem("token", token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return this._storage.getItem("token") !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    this._storage.removeItem("token");
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return this._storage.getItem("token");
  }
}
