export default class Stack {
  _stack = null;

  constructor() {
    this._stack = [];
  }

  pop = () => {
    this._stack.pop();

    return this;
  };

  push = (element) => {
    this._stack.push(element);

    return this;
  };

  top = () => {
    const stackLenght = this._stack.length;

    if (stackLenght === 0) return null;

    const topElementIndex = stackLenght - 1;
    const topElement = this._stack[topElementIndex];

    return topElement;
  };

  size = () => {
    return this._stack.length;
  };
}
