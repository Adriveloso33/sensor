import TabLoader from '../../../components/tabs/components/TabLoader';
import { removeAll } from '../../../components/tabs/TabsActions';
import { createTab } from '../../../helpers/TabsHelper';

import ListAll from '../containers/licenses/List';

export default class Loader extends TabLoader {
  loadTab = () => {
    store.dispatch(removeAll());

    const dataTab = {
      title: 'Licenses',
      component: ListAll,
      active: true,
      props: {},
    };
    createTab(dataTab);
  };
}
