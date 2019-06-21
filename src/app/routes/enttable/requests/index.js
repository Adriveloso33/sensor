import api from '../../../services/api/Entropy';

export function getTableList() {
  return api.get('entropy/crud/standardcrud/list');
}

export function insertEntTable(params) {
  return api.post('entropy/crud/standardcrud/insert', { ...params });
}

export function updateEntTable(params) {
  return api.post('entropy/crud/standardcrud/update', { ...params });
}

export function deleteEntTable(params) {
  return api.post('entropy/crud/standardcrud/delete', { ...params });
}

export function getGridInfo(params) {
  return api.post('entropy/crud/standardcrud/grid', { ...params });
}
