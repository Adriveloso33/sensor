import React from 'react';
import classnames from 'classnames';

export default class Task extends React.Component {
  handleClick = () => {
    const { onClick, item } = this.props;

    if (typeof onClick === 'function') {
      onClick(item);
    }
  };

  render() {
    const { item } = this.props;
    return (
      <span onClick={this.handleClick}>
        <div className="bar-holder no-padding">
          <p className="margin-bottom-5 task-title">
            {item.status == 'PRIMARY' ? <i className="fa fa-warning text-warning" /> : null}
            <strong>{item.status}:</strong> <i>{item.title}</i>
            <span
              className={classnames([
                'pull-right',
                'semi-bold',
                item.status == 'CRITICAL' ? 'text-danger' : 'text-muted'
              ])}
            >
              {<span>{item.width + '%'}</span>}
            </span>
          </p>
          <div className={classnames(['progress', item.progressClass])}>
            <div
              className={classnames([
                'progress-bar',
                {
                  'progress-bar-success': item.barType == 'MINOR' || item.status == 'NORMAL',
                  'bg-color-teal': item.status == 'PRIMARY' || item.status == 'URGENT',
                  'progress-bar-danger': item.status == 'CRITICAL'
                }
              ])}
              style={{ width: item.width + '%' }}
            />
          </div>
          <em className="note no-margin">
            last updated on {moment(item.last_update, 'DD/MM/YYYY').format('MMMM Do, YYYY')}
          </em>
        </div>
      </span>
    );
  }
}
