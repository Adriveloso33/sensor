import TabLoader from '../../../components/tabs/components/TabLoader';

import { addTab, removeAll } from '../../../components/tabs/TabsActions';

import List from '../containers/apps/List';

export default class Loader extends TabLoader {
  loadTab = () => {
    store.dispatch(removeAll());

    const dataTab = {
      title: 'All Apps',
      active: true,
      component: List,
      props: {},
    };

    store.dispatch(addTab(dataTab));
  };
}
