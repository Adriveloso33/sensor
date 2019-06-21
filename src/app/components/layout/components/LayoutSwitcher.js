import React from 'react';

import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import classnames from 'classnames';

import { config } from '../../../config/config';

import * as LayoutActions from '../LayoutActions';

class LayoutSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActivated: false
    };
  }

  onToggle = () => {
    this.setState({
      isActivated: !this.state.isActivated
    });
  };

  render() {
    return (
      <div className="btn-header transparent pull-right">
        <span id="demo-setting" onClick={this.onToggle}>
          <a>
            <i className="fa fa-cog" />
          </a>
        </span>

        <div
          className={classnames('demo', {
            activate: this.state.isActivated
          })}
        >
          <form>
            <legend className="no-padding margin-bottom-10">
              Visual Options{' '}
              <span id="close-demo" onClick={this.onToggle}>
                <a>
                  <i className="fa fa-times" />
                </a>
              </span>
            </legend>
            <section>             
              <span id="smart-bgimages" />
            </section>           

            <h6 className="margin-top-10 semi-bold margin-bottom-5">Skins</h6>

            <section id="smart-styles">
              {config.skins.map((skin) => {
                const check = this.props.smartSkin == skin.name ? <i className="fa fa-check fa-fw" /> : '';
                const beta = skin.beta ? <sup>beta</sup> : '';
                return (
                  <a
                    onClick={this.props.onSmartSkin.bind(this, skin)}
                    className={skin.class}
                    style={skin.style}
                    key={skin.name}
                  >
                    {check} {skin.label} {beta}
                  </a>
                );
              })}
            </section>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => state.getIn(["layout"]),;

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LayoutActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutSwitcher);
