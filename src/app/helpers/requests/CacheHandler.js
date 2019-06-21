const CachedRequests = require('./CachedRequests');

function CacheHandler() {
  this.cache = new CachedRequests();

  this.makeCache = (...args) => {
    this.cache.addRequests(...args);
  };

  this.resetCache = () => {
    this.cache = new CachedRequests();
  };
}

const ch = new CacheHandler();

module.exports = ch;
