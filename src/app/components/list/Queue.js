export default class Queue {
  _queue = null;

  constructor() {
    this._queue = [];
  }

  popFront = () => {
    this._queue.shift();

    return this;
  };

  push = (element) => {
    this._queue.push(element);

    return this;
  };

  first = () => {
    const queueLenght = this._queue.length;

    if (queueLenght === 0) return null;

    const firstElement = this._queue[0];

    return firstElement;
  };

  size = () => {
    return this._queue.length;
  };
}
