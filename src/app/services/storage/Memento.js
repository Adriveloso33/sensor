class Memento {
  state = {};

  constructor(initialState = {}) {
    this.state = initialState || {};
  }

  getState(name) {
    return this.state[name];
  }

  setState(name, data) {
    this.state[name] = data;
    return this;
  }

  clear() {
    this.state = {};
    return this;
  }
}

export default Memento;
