import TabLoader from '../../../components/tabs/components/TabLoader';
import Edit from '../containers/Edit';

import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  dashboardId = () => {
    return _.get(this.props.match, 'params.id');
  };

  /* Override tab loader method */
  loadTab = (tabId) => {
    const id = this.dashboardId();

    store.dispatch(removeAll());

    const tabData = {
      id: tabId,
      active: true,
      title: 'Edit dashboard',
      component: Edit,
      props: {
        title: 'Edit dashboard',
        id,
      },
    };

    store.dispatch(addTab(tabData));
  };
}
