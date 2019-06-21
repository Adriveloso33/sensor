import TabLoader from '../../../components/tabs/components/TabLoader';
import New from '../containers/New';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'New dashboard',
      component: New,
      props: {
        title: 'New dashboard',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
