export const SET_FILTER_DATA = 'SET_FILTER_DATA';

export function setFilterData(filterData) {
  return {
    type: SET_FILTER_DATA,
    data: filterData
  };
}
