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
      title: 'Readings Dashboard',
      component: MainDashboard,
      props: {
        report: 'READINGS',
        title: 'Readings',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
