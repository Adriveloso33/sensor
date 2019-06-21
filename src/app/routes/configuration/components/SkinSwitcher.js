import React from 'react';

import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { config } from '../../../config/config';

import * as LayoutActions from '../../../components/layout/LayoutActions';

class SkinSwitcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClickFunction = (event, skin) => {
    event.preventDefault();
    return this.props.onSmartSkin.bind(this, skin)();
  };

  render() {
    return (
      <div className="visual-options-form">
        <form>
          <h1>Choose your Skin</h1>

          <h3 className="margin-top -10 semi-bold margin-bottom-5">Skins</h3>

          <section id="smart-styles">
            {config.skins.map((skin) => {
              const check = this.props.smartSkin == skin.name ? <i className="fa fa-check fa-fw" /> : '';
              const beta = skin.beta ? <sup>beta</sup> : '';
              return (
                <span className="pull-left mr-1">
                  <img
                    className="preview-img"
                    onClick={(event) => {
                      this.onClickFunction(event, skin);
                    }}
                    src={`assets/img/preview_${skin.label.toLowerCase()}.png`}
                  />
                  <button
                    onClick={(event) => {
                      this.onClickFunction(event, skin);
                    }}
                    className={skin.class}
                    style={Object.assign({}, skin.style, {
                      marginBottom: '16px',
                    })}
                    key={skin.name}
                  >
                    {check} {skin.label} {beta}
                  </button>
                </span>
              );
            })}
          </section>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => state.getIn(['layout']);

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LayoutActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkinSwitcher);
