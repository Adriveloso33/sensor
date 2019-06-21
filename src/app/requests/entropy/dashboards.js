import api from '../../services/api/Entropy';

const CacheHandler = require('../../helpers/requests/CacheHandler');

export function getMainChart(params) {
  return api.post('entropy/dashboard/chart', { ...params });
}

export function getDashboardGrid(params) {
  return api.post('entropy/dashboard/grid', { ...params });
}

export function getDashboardMap(params) {
  return api.post('entropy/dashboard/map', { ...params });
}

export function getKpisByReport(vendor_id, report) {
  const getDashboardKpisByReport = (vendor_id, report) => {
    return api.get('entropy/dashboard/kpi', { vendor_id, report });
  };
  CacheHandler.makeCache(getDashboardKpisByReport);
  return CacheHandler.cache.getDashboardKpisByReport(vendor_id, report);
}
