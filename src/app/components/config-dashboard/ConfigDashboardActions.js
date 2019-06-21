export const FILTER_LOAD_CONFIGDASHBOARD = "FILTER_LOAD_CONFIGDASHBOARD";

export function sendFilter(filter) {
  return {
    type: FILTER_LOAD_CONFIGDASHBOARD,
    filter
  };
}
