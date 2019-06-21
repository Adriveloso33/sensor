import TabLoader from '../../../components/tabs/components/TabLoader';
import { removeAll } from '../../../components/tabs/TabsActions';
import { createTab } from '../../../helpers/TabsHelper';

import List from '../containers/List';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = () => {
    store.dispatch(removeAll());
    const tabData = {
      active: true,
      title: 'Entropy Tables',
      component: List,
      props: {},
    };

    createTab(tabData);
  };
}
