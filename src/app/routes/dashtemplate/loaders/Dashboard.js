import TabLoader from '../../../components/tabs/components/TabLoader';
import Dashboard from '../containers/Dashboard';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'Dash template',
      component: Dashboard,
      props: {
        title: 'Dash template',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
