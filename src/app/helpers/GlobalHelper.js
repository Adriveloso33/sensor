import Queue from '../components/list/Queue';

/**
 * Returns the parent state of a connected element
 *
 * @param {Object} _this The current instance of React class
 * @returns {Object} parentState
 */
export function getParentState(_this) {
  const { parentState } = _this.context || {};
  return parentState;
}

/**
 * Returns the mainFilter internal state by calling getFilterInternalState function
 *
 * @param {Object} _this The current instance of React class
 * @returns {Object} mainFilter
 */
export function getMainFilterState(_this) {
  try {
    return _this.context.parentState.getFilterInternalState();
  } catch (Ex) {}

  return {};
}

/**
 * Returns an item of the parent state,
 * for example 'mainFilter'
 *
 * @param {Object} _this The current instance of React class
 * @param {String} itemName
 * @returns {Object} itemValue
 */
export function getParentItem(_this, itemName) {
  const parentState = getParentState(_this);
  const itemValue = parentState ? parentState[itemName] : null;

  return itemValue;
}

/**
 * Returns the regions list contained in the parent state
 *
 * @param {Object} _this The current instance of React class
 * @returns {Array} regionList
 */
export function getRegionsList(_this) {
  const parentState = getParentState(_this);
  const { regionList } = parentState || {};

  return regionList;
}

/**
 * Returns the vendors list contained in the parent state
 *
 * @param {Object} _this The current instance of React class
 * @returns {Array} vendorList
 */
export function getVendorsList(_this) {
  const parentState = getParentState(_this);
  const { vendorList } = parentState || {};

  return vendorList;
}

/**
 * Returns the name {String} of a given region id
 *
 * @param {Object} _this The current instance of React class
 * @param {Number} region_id The region id
 * @returns {String} name
 */
export function getRegionName(_this, region_id) {
  const regionList = getRegionsList(_this);

  let name = '';
  regionList &&
    regionList.forEach((region) => {
      if (region.id == region_id) name = region.name || region.text;
    });

  return name;
}

/**
 * Returns the name {String} of a given vendor id
 *
 * @param {Object} _this The current instance of React class
 * @param {Number} region_id The vendor id
 * @returns {String} name
 */
export function getVendorName(_this, vendor_id) {
  const vendorList = getVendorsList(_this);

  let name = '';
  vendorList &&
    vendorList.forEach((vendor) => {
      if (vendor.id == vendor_id) name = vendor.name || vendor.text;
    });

  return name;
}

/**
 * Returns the id {Number} of a given element in the list providing the name
 *
 * @param {Array} list The list of objects with the format {id, name}
 * @param {String} name The element name
 * @returns {Number} elment id
 */
export function getElementIdByName(list, name) {
  let id = null;

  list &&
    list.forEach((element) => {
      if (element.name === name) id = element.id;
    });

  return id;
}

/**
 * Returns the id {Number} of a given element in the list providing the text field
 *
 * @param {Array} list The list of objects with the format {id, name}
 * @param {String} text The element text
 * @returns {Number} elment id
 */
export function getElementIdByText(list, text) {
  let id = null;

  list &&
    list.forEach((element) => {
      if (element.text === text) id = element.id;
    });

  return id;
}

/**
 * Returns the name {String} of a given element in the list providing the id
 *
 * @param {Array} list The list of objects with the format {id, name}
 * @param {Number} id The element id
 * @returns {String} elment name
 */
export function getElementNameById(list, id) {
  let name = null;

  list &&
    list.forEach((element) => {
      if (element.id === id) name = element.name;
    });

  return name;
}

/**
 * Returns the text {String} of a given element in the list providing the id
 *
 * @param {Array} list The list of objects with the format {id, name}
 * @param {Number} id The element id
 * @returns {String} elment text
 */
export function getElementTextById(list, id) {
  let text = null;

  list &&
    list.forEach((element) => {
      if (element.id === id) text = element.text;
    });

  return text;
}

/**
 * Returns the index {Number} of a given element in the list providing the id
 *
 * @param {Array} list The list of objects with the format {id, name}
 * @param {Number} id The element id
 * @returns {Number} elment index in the list
 */
export function getElementIndexById(list = [], id) {
  const index = list.findIndex((item) => item.id === id);

  return index;
}

/**
 * Returns the color string for a given element wiht it value.
 * The thresholds is in the Object structure of Entropy
 *
 * @param {Number} value
 * @param {String} element
 * @param {Object} thresholds
 * @returns {String} color
 */
export function getColorStr(value, element, thresholds) {
  let colorStr = null;
  if (thresholds[element] && value) {
    const ranges = thresholds[element];

    ranges &&
      ranges.forEach((r) => {
        const { min, max, color } = r;

        if (min && max && value >= min && value <= max) colorStr = color;
        if (!min && value <= max) colorStr = color;
        if (!max && value >= min) colorStr = color;
      });
  }

  return colorStr;
}

/**
 * Returns true if the expression is valid using the levels (SUM, MIN, MAX..) or signs (*, /, +, -)
 *
 * @param {String} expression
 * @param {String} allowedLevels
 * @param {String} allowedSigns
 */
export function validateAggregationExpression(expression = '', allowedLevels = '', allowedSigns = '') {
  const queue = new Queue();

  const isValidSign = (sign = '') => {
    return allowedSigns.includes(sign);
  };

  const isValidLevel = (level = '') => {
    return allowedLevels.toLowerCase().includes(level.toLowerCase());
  };

  const size = expression.length;
  let lastElement = '';

  // separate every element of the expression and push to the stack
  for (let i = 0; i < size; i++) {
    const char = expression.charAt(i);

    if (allowedSigns.includes(char)) {
      if (lastElement !== '') {
        queue.push(lastElement);
        lastElement = '';
      }

      queue.push(char);
    } else {
      lastElement = lastElement.concat(char);
    }
  }

  if (lastElement !== '') queue.push(lastElement);

  // special case with only one token
  if (queue.size() === 1) {
    const element = queue.first();

    return isValidLevel(element);
  }

  // special case with 2 tokens (ex: 2*)
  if (queue.size() === 2) {
    const firstElement = queue.first();
    const secondElement = queue.popFront().first();

    const isValid = !isNaN(firstElement) && isValidSign(secondElement);

    return isValid;
  }

  // for a multiple tokens expression
  let isSign = false;

  while (queue.size() > 0) {
    const element = queue.first();

    if (!isSign) {
      if (!isValidLevel(element) && isNaN(element)) return false;
    } else {
      if (!isValidSign(element)) return false;
    }

    isSign = !isSign;
    queue.popFront();
  }

  const isValid = !isSign; // in a multiple expression the last token must be a sign

  return isValid;
}
