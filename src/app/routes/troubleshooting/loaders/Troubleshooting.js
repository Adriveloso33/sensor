import TabLoader from '../../../components/tabs/components/TabLoader';
import Troubleshooting from '../containers/Troubleshooting';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';

export default class Loader extends TabLoader {
  /* Override tab loader method */
  loadTab = () => {
    store.dispatch(removeAll());

    const tabData = {
      active: true,
      title: 'Troubleshooting',
      component: Troubleshooting,
      props: {},
    };

    store.dispatch(addTab(tabData));
  };
}
