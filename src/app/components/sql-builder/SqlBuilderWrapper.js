import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import 'jQuery-QueryBuilder/dist/js/query-builder.standalone';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import 'sql-parser-mistic/browser/sql-parser.min';

window.interact = require('interactjs');
window.SQLParser = require('sql-parser-mistic/browser/sql-parser.min.js');

const DEFAULT_FILTERS = [
  {
    id: 'none',
    label: '-----',
    type: 'double',
  },
];

const DEFAULT_RULES = [
  {
    empty: true,
  },
];

const DEFAULT_PLUGINS = ['invert', 'unique-filter', 'filter-description', 'sortable'];

const DEFAULT_NOTIFY_EVENTS = [
  'afterDeleteRule.queryBuilder',
  'afterUpdateRuleValue.queryBuilder',
  'afterUpdateRuleOperator.queryBuilder',
  'afterDeleteGroup.queryBuilder',
  'afterUpdateGroupCondition.queryBuilder',
  'afterUpdateRuleFilter.queryBuilder',
];

export default class SqlBuilderWrapper extends React.Component {
  static propTypes = {
    rules: PropTypes.array,
    filters: PropTypes.array,
    onChange: PropTypes.func,
    onRef: PropTypes.func,
  };

  static defaultProps = {
    rules: DEFAULT_RULES,
    filters: DEFAULT_FILTERS,
    onChange: null,
    onRef: null,
  };

  constructor(props) {
    super(props);

    this.$element = null;
    this.state = {
      sqlQueryString: null,
    };
  }

  componentDidMount() {
    this.initializeQueryBuilder(this.props);

    const { onRef } = this.props;
    if (typeof onRef === 'function') onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      const filtersHasChanged = !_.isEqual(nextProps.filters, this.props.filters);
      const rulesHasChanged = !_.isEqual(nextProps.rules, this.props.rules);

      if (filtersHasChanged || rulesHasChanged) {
        this.destroyComponent();
        this.initializeQueryBuilder(nextProps);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  componentWillUnmount() {
    this.destroyComponent();
  }

  initializeQueryBuilder = (config = {}) => {
    const { $element } = this;

    const filters = config.filters || DEFAULT_FILTERS;
    const rules = config.rules || DEFAULT_RULES;
    const plugins = DEFAULT_PLUGINS;

    $($element).queryBuilder({ filters, rules, plugins });

    // Avoid throws Validation Error on getSQL Event
    $($element).on('validationError.queryBuilder', (e, rule, error) => {
      if (error[0] === 'number_nan') {
        e.preventDefault();
      }
    });

    const notifyOnEvents = DEFAULT_NOTIFY_EVENTS;
    notifyOnEvents.forEach((event) => {
      $($element).on(event, this.notifyChanges);
    });

    this.setState({
      sqlQueryString: null,
    });
  };

  destroyComponent = () => {
    $(this.$element).queryBuilder('destroy');
  };

  notifyChanges = () => {
    const sqlQueryString = this.getSqlQueryString();

    if (!sqlQueryString) {
      this.setState({
        sqlQueryString,
      });

      return null;
    }

    const notification = {
      sqlQueryString,
      rules: this.getRules(),
    };

    this.setState({ sqlQueryString: notification.sqlQueryString }, () => {
      const { onChange } = this.props;
      if (typeof onChange === 'function') onChange(notification);
    });

    return null;
  };

  getSqlQueryString = () => {
    const query = $(this.$element).queryBuilder('getSQL', false, false);
    if (!query) return null;

    return query.sql;
  };

  /* UTILS */
  getRules = () => $(this.$element).queryBuilder('getRules');

  setRules = (rules) => $(this.$element).queryBuilder('setRules', rules);

  getFilters = () => $(this.$element).queryBuilder('getFilters');

  setFilters = (filters) => $(this.$element).queryBuilder('setFilters', filters);

  getRulesFromSqlQuery = (sqlQuery) => $(this.$element).queryBuilder('getRulesFromSQL', sqlQuery);

  setRulesFromSqlQuery = (sqlQuery) => $(this.$element).queryBuilder('setRulesFromSQL', sqlQuery);

  render() {
    return (
      <div>
        <div
          id="query-builder"
          ref={(ref) => {
            if (!this.$element) this.$element = ref;
          }}
        />
        SQL
        <pre>{this.state.sqlQueryString}</pre>
      </div>
    );
  }
}
