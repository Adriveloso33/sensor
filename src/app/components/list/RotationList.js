import _ from 'lodash';

export default class RotationList {
  _interval = null;
  _rotationIsPaused = false;

  constructor(list, timeOut, callback) {
    this._list = list;
    this._timeOut = timeOut;
    this._callback = callback;

    this._it = 0;
    this._cycle = 0;
  }

  startRotation = () => {
    if (this._interval) return;

    this._rotateList();
  };

  stopRotation = () => {
    if (this._interval) clearInterval(this._interval);
  };

  pauseRotation = () => {
    this.rotationIsPaused = true;
  };

  resumeRotation = () => {
    this.rotationIsPaused = false;
  };

  currentItem = () => {
    return this._list[this._it];
  };

  goNext = () => {
    this._rotateNext();
  };

  goToItem = (specificItem, compareFunc = this._defaultCompareFunction) => {
    const itemIndex = this._findElement(specificItem, compareFunc);

    if (itemIndex != null) {
      this._goToIndex(itemIndex);
    }
  };

  getList = () => {
    return this._list;
  };

  size = () => {
    return this._list.length;
  };

  _rotateList = () => {
    const { _timeOut } = this;
    this._it = 0;

    this._rotateNext();

    this._interval = setInterval(() => {
      if (!this.rotationIsPaused) this._rotateNext();
    }, _timeOut);
  };

  _rotateNext = () => {
    const keys = this._getKeys();
    if (keys.length === 0) return;

    const itemKey = keys[this._it];
    const itemValue = this._list[itemKey];

    this._notify(itemValue);

    this._incrementIterator();
  };

  _incrementIterator = () => {
    if (this._it + 1 >= this.size()) {
      this._it = 0;
      this._cycle++;
    } else this._it++;
  };

  _getKeys = () => {
    return Object.keys(this._list);
  };

  _notify = (item) => {
    const { _callback, _cycle } = this;

    if (typeof _callback === 'function') _callback(item, _cycle);
  };

  _defaultCompareFunction = (itemA, itemB) => {
    return _.isEqual(itemA, itemB);
  };

  _findElement(specificItem, compareFunc) {
    const keys = this._getKeys();
    const { _list } = this;
    let itemIndex = null;

    keys.forEach((key, index) => {
      const currentItem = _list[key];
      if (compareFunc(specificItem, currentItem)) {
        itemIndex = index;
      }
    });

    return itemIndex;
  }

  _goToIndex = (index) => {
    this._it = index;
    this._rotateNext();
  };
}
