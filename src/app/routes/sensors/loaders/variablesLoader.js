import TabLoader from '../../../components/tabs/components/TabLoader';
import MainDashboard from '../containers/MainDashboard';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      title: 'Sensors | Variables Dashboard',
      active: true,
      component: MainDashboard,
      props: {
        report: 'SENSORS_VARIABLES',
        title: 'Variables',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
