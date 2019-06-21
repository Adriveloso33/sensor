import TabLoader from '../../../components/tabs/components/TabLoader';
import MainDashboard from '../containers/MainDashboard';

import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      title: 'Technician | Pending Customers Dashboard',
      active: true,
      component: MainDashboard,
      props: {
        report: 'TECHNICIAN_PENDING_CUSTUMERS',
        title: 'PendingCustomers',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
