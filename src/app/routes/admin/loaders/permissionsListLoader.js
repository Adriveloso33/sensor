import TabLoader from '../../../components/tabs/components/TabLoader';
import { removeAll } from '../../../components/tabs/TabsActions';
import { createTab } from '../../../helpers/TabsHelper';

import List from '../containers/permissions/List';

export default class Loader extends TabLoader {
  loadTab = () => {
    store.dispatch(removeAll());
    const dataTab1 = {
      title: 'All Permissions',
      active: true,
      component: List,
      props: {},
    };
    createTab(dataTab1);
  };
}
