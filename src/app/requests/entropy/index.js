import api from '../../services/api/Entropy';

const CacheHandler = require('../../helpers/requests/CacheHandler');

export function getVendorList() {
  const GetVendorList = () => api.get('entropy/vendor');
  CacheHandler.makeCache(GetVendorList);
  return CacheHandler.cache.GetVendorList();
}

export function getVendors() {
  const GetVendors = () => api.get('entropy/getvendor');
  CacheHandler.makeCache(GetVendors);
  return CacheHandler.cache.GetVendors();
}

export function getRegionList(vendor_id = null) {
  return api.get('entropy/region', { vendor_id });
}

export function getGeneralFilterGroupLevel(region_id, vendor_id, family_level) {
  const GetGeneralFilterGroupLevel = (region_id, vendor_id, family_level) => {
    return api.get('entropy/dashboard/generalfilter/grouplevel', { vendor_id, region_id, family_level });
  };
  CacheHandler.makeCache(GetGeneralFilterGroupLevel);
  return CacheHandler.cache.GetGeneralFilterGroupLevel(region_id, vendor_id, family_level);
}

export function getFirstGroupLevel(report) {
  return api.get('entropy/grouplevel', { report });
}

export function getEntropyKpis(vendor_id, family_level, region_id) {
  const GetEntropyKpis = (vendor_id, family_level, region_id) => {
    return api.get('entropy/generalfilter/kpis', { vendor_id, family_level, region_id });
  };
  CacheHandler.makeCache(GetEntropyKpis);
  return CacheHandler.cache.GetEntropyKpis(vendor_id, family_level, region_id);
}

export function getCorrelationKpis(vendor_id, family_level) {
  const GetCorrelationKpis = (vendor_id, family_level) => {
    return api.get('entropy/functionalities/correlation/grouplevel', { vendor_id, family_level });
  };
  CacheHandler.makeCache(GetCorrelationKpis);
  return CacheHandler.cache.GetCorrelationKpis(vendor_id, family_level);
}

export function getEntropyCounters(vendor_id, family_level, region_id) {
  const GetEntropyCounters = (vendor_id, family_level, region_id) => {
    return api.get('entropy/generalfilter/counters', { vendor_id, family_level, region_id });
  };
  CacheHandler.makeCache(GetEntropyCounters);
  return CacheHandler.cache.GetEntropyCounters(vendor_id, family_level, region_id);
}

export function getNetworkElements(filter) {
  return api.post('entropy/network', { filter });
}

export function getGeneralNetworkElements(filter) {
  const GetGeneralNetworkElements = (filter) => {
    return api.post('entropy/gridnetwork', { ...filter });
  };
  CacheHandler.makeCache(GetGeneralNetworkElements);
  return CacheHandler.cache.GetGeneralNetworkElements(filter);
}

export function getGeneralFilterCounters(vendor_id, family_level, region_id) {
  return api.get('entropy/dashboard/generalfilter/counters', {
    vendor_id,
    region_id,
    family_level,
  });
}

export function getKpiEvolutionChart(filter) {
  return api.post('entropy/kpievolution/chartkpievolution', { ...filter });
}

export function getEntropyFamilyLevels(vendor_id, region_id) {
  return api.get('entropy/generalfilter/familylevel', { vendor_id, region_id });
}

export function getEntropyFamilyLevelId(vendor, family_name) {
  return api.get('entropy/getfamilylevelid', { vendor, family_name });
}

export function getReportFamilyLevelId(vendor, report) {
  const GetReportFamilyLevelId = (vendor, report) => {
    return api.get('entropy/dashboardfamilylevelid', { vendor, report });
  };
  CacheHandler.makeCache(GetReportFamilyLevelId);
  return CacheHandler.cache.GetReportFamilyLevelId(vendor, report);
}

export function getAlarmsChart(filter) {
  return api.post('entropy/functionalities/alarms/chart', { ...filter });
}

export function getDeltaChart(filter) {
  return api.post('entropy/functionalities/delta/chart', { ...filter });
}
