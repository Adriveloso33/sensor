import React from 'react';
import PropTypes from 'prop-types';
import { parseDataToText, parseTextToData, parseTextToFilters } from '../helpers/TextHelper';

const defaultFilters = '";", ":", "|"';
const additionalFilters = [',', ' ', '\n'];

export default class TextItemsSelector extends React.Component {
  constructor(props) {
    super(props);

    this.$modal = null;
    this.state = {
      text: '',
      count: 0,
      filters: defaultFilters,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    const { values } = this.props || {};

    this.updateText(values);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { values } = nextProps || {};
    this.updateText(values);
  }

  /* Utils */
  updateText = (values) => {
    const text = parseDataToText(values);

    this.setState({
      text,
      count: values ? values.length : 0,
    });
  };

  getUniques = (values) => {
    let uniques = [];

    values && (uniques = values.filter((elem, index) => values.indexOf(elem) === index));

    return uniques;
  };

  getCapitalize = (list) => {
    let newList = [];

    list && (newList = list.map((elem) => elem.toUpperCase()));

    return newList;
  };

  removeTextLineBreaks = (text) => {
    if (!text) return '';

    return text.replace(/\n/g, ' ');
  };

  getSaveText = () => {
    const { text, filters } = this.state || {};

    const filterArr = additionalFilters.concat(parseTextToFilters(filters));
    const textWithOutLineBreaks = this.removeTextLineBreaks(text);

    const values = parseTextToData(textWithOutLineBreaks, filterArr);

    const uniqueValues = this.getUniques(values);
    const capitalizeValues = this.getCapitalize(uniqueValues);

    return capitalizeValues;
  };

  /* Handlers */

  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value,
    });
  };

  handleSave = (event) => {
    const values = this.getSaveText();
    const { onSave } = this.props || {};
    if (typeof onSave === 'function') onSave(values);
  };

  render() {
    const { text, filters } = this.state || {};

    return (
      <div className="ne-text-form">
        <div className="ne-text-form-container">
          {/* Interfaz */}
          <form className="form-horizontal">
            <textarea name="text" onChange={this.handleChanges} value={text} />
          </form>
        </div>
        <div className="ne-text-form-footer">
          <form className="form-inline delimiters-form">
            <div className="form-group">
              <label htmlFor="delimiters">Delimiters: </label>
              <input
                type="text"
                className="form-control"
                id="delimiters"
                name="filters"
                placeholder='",", ";", ":", "|"'
                value={filters}
                onChange={this.handleChanges}
              />
            </div>
          </form>
          <button type="button" className="btn btn-primary" onClick={this.handleSave}>
            SET ITEMS
          </button>
        </div>
      </div>
    );
  }
}

TextItemsSelector.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
