import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainGraph from '../components/troubleshooting/MainGraph';
import MainTable from '../components/troubleshooting/MainTable';
import AlarmsDeltaGraph from '../components/troubleshooting/AlarmsDeltaGraph';
import MasterCellsTable from '../components/troubleshooting/MasterCellsTable';

/* Sidebar */
import MainFilters from '../addons/mainfilter/MainFilters';
import Functions from '../addons/troubleshooting/Functions';

const reportName = 'TROUBLESHOOTING';

const config = [
  {
    widths: [12, 12, 12],
    component: MainGraph,
    props: {},
  },
  {
    widths: [12, 12, 12],
    component: MainTable,
    props: {},
  },
  {
    widths: [12, 12, 12],
    component: AlarmsDeltaGraph,
    props: {},
  },
  {
    widths: [12, 12, 12],
    component: MasterCellsTable,
    props: {},
  },
];

export default function load(props = {}) {
  /* Adjust main filter initial state */
  const { filter = {} } = props;
  const filterInitialState = cleanMainFilter({
    ...filter,
    report: reportName,
  });

  const MainFilterComponennt = () => <MainFilters initialState={filterInitialState} />;
  const sidebar = [MainFilterComponennt, Functions];

  return <DashboardLauncher config={config} sidebar={sidebar} />;
}

function cleanMainFilter(mainFilter = {}) {
  const cleanedFilter = _.cloneDeep(mainFilter);

  // adjust granularity for troubleshooting
  const allowedGranularities = ['24h', '7d', '30d'];
  if (!allowedGranularities.includes(mainFilter.groupDateTime)) {
    cleanedFilter.groupDateTime = '24h';
    cleanedFilter.lastDays = -6;
    cleanedFilter.date = [moment().format('YYYY-MM-DD')];
    cleanedFilter.flatpickrMode = 'single';
  }

  return cleanedFilter;
}
