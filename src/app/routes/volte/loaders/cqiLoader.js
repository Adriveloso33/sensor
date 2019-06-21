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
      title: 'VoLTE CQI Dashboard',
      component: MainDashboard,
      props: {
        report: 'VOLTE_CQI',
        title: 'VoLTE CQI',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
