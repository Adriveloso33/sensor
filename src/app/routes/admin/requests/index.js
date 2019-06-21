import api from '../../../services/api/Entropy';

export function getLicenses() {
  return api.get('entropy/crud/licenses');
}

export function getUsers() {
  return api.get('users');
}
