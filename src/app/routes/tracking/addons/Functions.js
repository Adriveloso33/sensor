import React from 'react';
import PropTypes from 'prop-types';
 
import Select2 from 'react-select2-wrapper';
import { errorMessage } from '../../../components/notifications/index';
import { getErrorMessage } from '../../../components/utils/ResponseHandler';
import 'flatpickr/dist/themes/dark.css';
import Flatpickr from 'react-flatpickr';
import { getUserList } from '../requests/index';

export default class Functions extends React.Component {
  constructor(props) {
    super(props);

    this.tabId = getStr();
    this.state = {
      user_id: 0,
      date: [
        moment()
          .add(-60, 'days')
          .format('Y-MM-DD'),
        ,
        moment().format('Y-MM-DD'),
      ],
      data: null,
      dateStart: moment()
        .add(-6, 'days')
        .format('Y-MM-DD'),
      dateEnd: moment().format('Y-MM-DD'),
    };
  }

  componentDidMount() {
    this.load();
  }

  submit = (event) => {
    event.preventDefault();
    const { date, user_id } = this.state || {};

    if (date.length == 0) {
      let errorMsg = getErrorMessage('You must choose a date');
      errorMessage('Error', errorMsg);
      return;
    }

    const dateStart = moment(date[0]).format('Y-MM-DD');
    const dateEnd = moment(date[1]).format('Y-MM-DD');

    // parse data
    const data = {
      user_id,
      dateStart,
      dateEnd,
    };

    // submit
    this.setState(
      {
        trackingData: data,
      },
      () => {
        this.context.updateParent({ trackingData: data });
      }
    );
  };

  load = () => {
    getUserList()
      .then((resp) => {
        //Delete user:id = 1
        resp.shift();
        
        this.setState({
          getUserList: resp,
        });
      })
      .catch((error) => {
        let errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
      });
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleSelect1 = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      user_id: value,
    });
  };

  handleChangesDate = (values) => {
    this.setState({ date: values });
  };

  handleChanges = (values) => {
    const { onChange } = this.props || {};

    if (typeof onChange === 'function') {
      onChange(values);
    }
  };

  render() {
    const { getUserList, date } = this.state;

    return (
      <div className="main-filters">
        <form className="smart-form no-back" onSubmit={this.submit}>
          <div className="row">
            <div className="cl-element">
              <label className="label">Date</label>
              <label className="input">
                {' '}
                <Flatpickr
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChangesDate}
                  options={{ dateFormat: 'Y-m-d', mode: 'range', maxDate: new Date() }}
                  placeholder="Select dates"
                  style={{ width: '100%' }}
                />
                <i className="icon-append fa fa-calendar" />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="cl-element">
              <label className="label">List Users</label>
              {getUserList && (
                <Select2
                  name="user_id"
                  data={[{ id: 0, text: 'All' }].concat(getUserList)}
                  value={this.state.user_id}
                  onSelect={this.handleSelect1}
                  onUnselect={this.handleSelect1}
                  style={{ width: '100%' }}
                />
              )}
            </div>
          </div>

          <div className="tracking cl-element ">
            <button type="submit" className="filter-btn btn btn-primary">
              <i className="fa fa-play" />
              GO
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
