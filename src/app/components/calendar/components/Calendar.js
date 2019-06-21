import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Moment from '../../utils/Moment';
import Task from './Task';
import Auth from '../../auth/Auth';
import { config } from '../../../config/config';

// import Integrity from '../../../routes/integrity/containers/Integrity';
import { addTab, activeTab } from '../../tabs/TabsActions';

const tasksUrl = `${config.apiRootUrl}/entropy/calendar/data`;

class Calendar extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._active = false;
    this.$el = null;

    this.state = {
      activity: {
        data: [],
      },
      activities: [],
      lastUpdate: new Date(),
    };
  }

  componentWillMount() {
    this.fetch();
  }

  componentDidMount() {
    $(document).mouseup((e) => {
      const container = $(this.$el);

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0 && this._active) {
        this.toggleDropdown(new Event(null));
      }
    });
  }

  handleItemClick = (item) => {
    const { type } = item || {};
    this.toggleDropdown(new Event(null));
    this.loadIntegrityTab(type);
  };

  loadIntegrityTab = (type) => {
    // SETUP DATA FOR NEW TABS
    const id = `alma_${type}`;

    if ($('#main-tabs').find(`#${id}`).length != 0) {
      store.dispatch(activeTab(id));
    } else {
      let dataTab1 = {
        id: id,
        title: 'Data Integrity',
        active: true,
        // component: Integrity,
        props: {
          title: 'Integrity',
          type,
        },
      };

      store.dispatch(addTab(dataTab1));
    }
  };

  setActivity = (activity) => {
    this.setState({
      activity,
    });
  };

  toggleDropdown = (e) => {
    e.preventDefault();
    const $dropdown = $(this.refs.dropdown);
    const $dropdownToggle = $(this.refs.dropdownToggle);

    if (this._active) {
      $dropdown.fadeOut(150);
    } else {
      $dropdown.fadeIn(150);
    }

    this._active = !this._active;
    $dropdownToggle.toggleClass('active', this._active);
  };

  update = () => {
    $(this.refs.loadingText).html('Loading...');
    $(this.refs.loadingSpin).addClass('fa-spin');
    this.fetch().then(() => {
      $(this.refs.loadingText).html('');
      $(this.refs.loadingSpin).removeClass('fa-spin');
    });
  };

  fetch = () => {
    return axios
      .get(tasksUrl, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((resp) => {
        const activities = resp.data;
        this.setState({
          activities: activities,
          activity: activities[0],
          lastUpdate: new Date(),
        });
      });
  };

  render() {
    const activities = this.state.activities;
    const activity = this.state.activity;

    const count = activities ? activities.reduce((sum, a) => sum + a.data.length, 0) : 0;
    // const imageName = this.getImageName(this.props.skinName || 'default');

    return (
      <div className="alma pull-right">
        <div
          ref={(el) => {
            this.$el = el;
          }}
          id="alma"
        >
          <div id="activity" onClick={this.toggleDropdown} ref="dropdownToggle" className="activity-dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 26 26"
              enableBackground="new 0 0 26 26"
              title="Calendar"
              data-toggle="tooltip"
              data-placement="bottom"
            >
              <g transform="matrix(6.12323e-17 1 -1 6.12323e-17 26 0)">
                <g>
                  <path
                    d="M25.7,8.3C22.4,5,18,3,13,3S3.5,5,0.3,8.3C0.1,8.5,0,8.7,0,9c0,0.3,0.1,0.5,0.3,0.7l1.4,1.4c0.4,0.4,1,0.4,1.4,0   C5.6,8.6,9.1,7,13,7s7.4,1.6,9.9,4.1c0.4,0.4,1,0.4,1.4,0l1.4-1.4C25.9,9.5,26,9.3,26,9S25.9,8.4,25.7,8.3z"
                    class="active-path"
                    fill="#000000"
                  />
                  <path
                    d="m13,11c-2.8,0-5.2,1.1-7,2.9-0.4,0.4-0.4,1 0,1.4l1.4,1.4c0.4,0.4 1,0.4 1.4,0 1.1-1.1 2.6-1.7 4.2-1.7 1.6,0 3.1,0.7 4.2,1.7 0.4,0.4 1,0.4 1.4,0l1.4-1.4c0.4-0.4 0.4-1 0-1.4-1.8-1.8-4.2-2.9-7-2.9z"
                    class="active-path"
                    fill="#000000"
                  />
                  <circle cx="13" cy="21" r="2" class="active-path" fill="#000000" />
                </g>
              </g>
            </svg>

            <b className="badge bg-color-red">{count}</b>
          </div>
          <div className="ajax-dropdown" ref="dropdown">
            <div className="btn-group btn-group-justified" data-toggle="buttons">
              {activities &&
                activities.map((_activity, idx) => {
                  return (
                    <label
                      className={classnames([
                        'btn',
                        'btn-default',
                        {
                          active: _activity.title == activity.title,
                        },
                      ])}
                      key={idx}
                      onClick={this.setActivity.bind(this, _activity)}
                    >
                      <input type="radio" name="activity" />
                      {_activity.title} ({_activity.data.length})
                    </label>
                  );
                })}
            </div>

            {/* notification content */}
            <div className="ajax-notifications custom-scroll">
              <ul className="notification-body">
                {activity &&
                  activity.data.map((item, idx) => {
                    let component = Task;
                    return (
                      <li key={idx}>
                        {React.createElement(component, {
                          item: item,
                          onClick: this.handleItemClick,
                        })}
                      </li>
                    );
                  })}
              </ul>
            </div>
            {/* end notification content */}

            {/* footer: refresh area */}
            <div className="alma-footer">
              <span className="last-updated-span">
                {' '}
                Last updated on: <Moment data={this.state.lastUpdate} format="h:mm:ss a" />
              </span>
              <button
                type="button"
                onClick={this.update}
                className="btn btn-xs btn-default pull-right alma-refresh-btn"
              >
                <i ref="loadingSpin" className="fa fa-refresh" />
                <span ref="loadingText" />
              </button>
            </div>
            {/* end footer */}
          </div>
        </div>
      </div>
    );
  }

  // getImageName = (skinName) => {
  //   switch (skinName) {
  //     case 'smart-style-entropy-light':
  //       return 'wifi_light.png';
  //     case 'smart-style-entropy-dark':
  //       return 'wifi_dark.png';
  //     default:
  //       return 'wifi_dark.png';
  //   }
  // };
}

const mapStateToProps = (state) => {
  return {
    skinName: state.getIn(['layout', 'smartSkin']),
  };
};

export default connect(mapStateToProps)(Calendar);
