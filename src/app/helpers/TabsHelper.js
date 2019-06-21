import store from '../store/configureStore';
import { addTab, removeTab, removeAll } from '../components/tabs/TabsActions';

const ErrorMessages = {
  InvalidTabInfo: 'Invalid tab info',
  InvalidTabId: 'Invalid tab id',
};

export function createTab(tabInfo, removeOtherTabs = false) {
  if (!tabInfo) throw ErrorMessages.InvalidTabInfo;

  if (removeOtherTabs) store.dispatch(removeAll());

  store.dispatch(addTab(tabInfo));
}

export function closeTab(tabId) {
  if (!tabId) throw ErrorMessages.InvalidTabId;

  store.dispatch(removeTab(tabId));
}
