import TabLoader from '../../../components/tabs/components/TabLoader';
import { removeAll } from '../../../components/tabs/TabsActions';
import { createTab } from '../../../helpers/TabsHelper';

import List from '../containers/areas/List';

export default class Loader extends TabLoader {
  loadTab = () => {
    store.dispatch(removeAll());

    const dataTab = {
      title: 'All Areas',
      component: List,
      active: true,
      props: {},
    };
    createTab(dataTab);
  };
}
