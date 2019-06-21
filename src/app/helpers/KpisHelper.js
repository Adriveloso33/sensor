const idColumn = 'COL_1';
const nameColumn = 'COL_2';

export function parseKpisDataToSelect2(rawData) {
  if (!rawData || !rawData.data) return [];

  const kpiList = rawData.data.map((kpiInfo) => {
    return {
      id: kpiInfo[idColumn],
      text: kpiInfo[nameColumn]
    };
  });

  return kpiList;
}

export function parseKpiListToSelect2(list) {
  if (!list) return [];

  const newList = list.map((kpiInfo) => {
    return {
      id: kpiInfo.id,
      text: kpiInfo.alias || kpiInfo.name
    };
  });

  return newList;
}
