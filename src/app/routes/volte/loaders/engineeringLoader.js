import TabLoader from '../../../components/tabs/components/TabLoader';
import MainDashboard from '../containers/MainDashboard';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      title: 'Engineering Dashboard',
      active: true,
      component: MainDashboard,
      props: {
        report: 'ENGINEERING_DASHBOARD',
        title: 'Engineering',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
