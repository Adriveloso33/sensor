const newLine = '\n';

/**
 * Parse the select 2 array to text
 * @param {Array} data
 *
 * @returns {String} text
 */
export function parseDataToText(data) {
  let text = '';

  data &&
    data.forEach((elem) => {
      text += elem ? `${elem}${newLine}` : '';
    });

  return text;
}

/**
 * Parse some text with some filters to an array of string
 * @param {String} data
 * @returns {String} text
 */
export function parseTextToData(text, filters) {
  let values = [];
  let token = '';

  // iterate over all String finding filter items
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let isFilter = filters.indexOf(char);

    // is a delimiter filter
    if (isFilter != -1 && token) {
      values.push(token);
      token = '';
    } else {
      token += char;
    }
  }

  if (token) values.push(token);
  return values;
}

/**
 * Parse some filters array to input text
 * @param {Array} data
 *
 * @returns {String} text
 */
export function parseFiltersToText(data) {
  let text = '';

  text = data.reduce((prev, elem) => {
    const value = `${prev}${prev ? ', ' : ''}"${elem}"`;
    return value;
  }, '');

  return text;
}

/**
 * Parse a text of filters in the format ",", "|", "." to an array of items
 * @param {String} text
 *
 * @returns {Array} values
 */
export function parseTextToFilters(data) {
  let values = [];

  if (data) {
    const mock = data.split(/[\s,]+/).map((elem) => elem.replace(/"/g, ''));

    values = mock.filter((elem) => elem);
  }

  return values;
}
