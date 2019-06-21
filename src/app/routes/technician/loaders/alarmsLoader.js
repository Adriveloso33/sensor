import TabLoader from '../../../components/tabs/components/TabLoader';
import MainDashboard from '../containers/MainDashboard';

import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'Technician | Alarms Dashboard',
      component: MainDashboard,
      props: {
        report: 'TECHNICIAN_ALARMS',
        title: 'Alarms',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
