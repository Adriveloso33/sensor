import TabLoader from '../../../components/tabs/components/TabLoader';
import List from '../containers/List';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'All Dashboards',
      component: List,
      props: {},
    };

    store.dispatch(addTab(tabData));
  };
}
