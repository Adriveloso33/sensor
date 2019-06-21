import TabLoader from '../../../components/tabs/components/TabLoader';
import EmptyPage from '../containers/EmptyPage';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = (tabId) => {
    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'Empty page',
      component: EmptyPage,
      props: {
        title: 'Empty page',
      },
    };

    store.dispatch(addTab(tabData));
  };
}
