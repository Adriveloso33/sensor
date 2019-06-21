import TabLoader from '../../../components/tabs/components/TabLoader';
import { removeAll } from '../../../components/tabs/TabsActions';
import { createTab } from '../../../helpers/TabsHelper';

import ListAll from '../containers/users/ListAll';

export default class Loader extends TabLoader {
  loadTab = () => {
    store.dispatch(removeAll());

    const dataTab = {
      title: 'All Users List',
      component: ListAll,
      active: true,
      props: {},
    };
    createTab(dataTab);
  };
}
