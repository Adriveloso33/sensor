import React from 'react';
import 'jQuery-QueryBuilder/dist/js/query-builder.standalone.js';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import 'sql-parser-mistic/browser/sql-parser.min.js';

if (!window.interact) window.interact = require('interactjs');
if (!window.SQLParser) window.SQLParser = require('sql-parser-mistic/browser/sql-parser.min.js');

const defaultFilters = [
  {
    id: 'none',
    label: '-----',
    type: 'double',
  },
];

const defaultRules = [
  {
    empty: true,
  },
];

export default class SqlBuilder extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);

    this.state = {
      sql: null,
    };
  }

  componentDidMount() {
    const { filters, rules } = this.props;

    this.initializeQueryBuilder(filters, rules);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      // Comprobar que hay filtros
      const filtersHasChanged = !_.isEqual(nextProps.filters, this.props.filters);
      const rulesHasChanged = !_.isEqual(nextProps.rules, this.props.rules);

      if (filtersHasChanged || rulesHasChanged) {
        this.destroyComponent();
        this.initializeQueryBuilder(nextProps.filters, nextProps.rules);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state != nextState;
  }

  componentWillUnmount() {
    $(this.refs.queryBuilder).queryBuilder('destroy');
  }

  destroyComponent = () => {
    const element = this.refs.queryBuilder;

    $(element).queryBuilder('destroy');
  };

  initializeQueryBuilder = (filters = defaultFilters, rules = defaultRules) => {
    const element = this.refs.queryBuilder;

    const plugins = ['invert', 'unique-filter', 'filter-description', 'sortable'];

    const areRulesInvalid = !rules || (Array.isArray(rules) && rules.length === 0);
    const validRules = areRulesInvalid ? defaultRules : rules;
    $(element).queryBuilder({ filters, rules: validRules, plugins });

    // Para evitar que de error de validacion al hacer un getSQL
    $(element).on('validationError.queryBuilder', (e, rule, error, value) => {
      if (error[0] == 'number_nan') {
        e.preventDefault();
      }
    });

    // Al actualizar los datos
    $(element).on(
      `afterDeleteRule.queryBuilder
      afterUpdateRuleValue.queryBuilder
      afterUpdateRuleOperator.queryBuilder
      afterDeleteGroup.queryBuilder
      afterUpdateGroupCondition.queryBuilder
      afterUpdateRuleFilter.queryBuilder`,
      () => {
        this.notifyChangeRulesSql();
      }
    );
  };

  notifyChangeRulesSql = () => {
    const instruction = $(this.refs.queryBuilder).queryBuilder('getSQL', false, false);

    if (instruction) {
      const { sql } = instruction || [];

      this.setState({ sql }, () => {
        this.props.onChange(sql);
      });
    }
  };

  getRulesSql = (SQL) => {
    const element = this.refs.queryBuilder;

    const rules = $(element).queryBuilder('getRulesFromSQL', SQL);

    return rules;
  };

  setRulesSql = (SQL) => {
    const element = this.refs.queryBuilder;

    const rules = $(element).queryBuilder('setRulesFromSQL', SQL);

    return rules;
  };

  getRules = () => {
    const element = this.refs.queryBuilder;

    const rules = $(element).queryBuilder('getRules');

    return rules;
  };

  setRules = (newRules) => {
    const element = this.refs.queryBuilder;

    $(element).queryBuilder('setRules', newRules);
  };

  setFilters = (newFilters) => {
    const element = this.refs.queryBuilder;

    $(element).queryBuilder('setFilters', newFilters);
  };

  render() {
    return (
      <div>
        <div id="query-builder" ref="queryBuilder" />
        SQL
        <pre>{this.state.sql}</pre>
      </div>
    );
  }
}
