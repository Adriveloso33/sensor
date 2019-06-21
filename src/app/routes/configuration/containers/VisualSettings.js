import React from 'react';

import { WidgetGrid, JarvisWidget } from '../../../components';
import PropTypes from 'prop-types';

import SkinSwitcher from '../components/SkinSwitcher';

export default class VisualSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    return (
      <div id="content">
        {/* widget grid */}

        <WidgetGrid>
          {/* START ROW */}

          <div className="row">
            {/* NEW COL START */}
            <article className="col-sm-12 col-md-12 col-lg-6">
              {/* Widget ID (each widget will need unique ID)*/}
              <JarvisWidget
                editbutton={false}
                togglebutton={false}
                editbutton={false}
                fullscreenbutton={false}
                colorbutton={false}
                deletebutton={false}
              >
                <header>
                  <ul className="nav nav-tabs pull-left in">
                    <li className="active">
                      <a data-toggle="tab" href="#hr1">
                        {' '}
                        <i className="fa fa-user" /> <span className="hidden-mobile hidden-tablet"> Skins </span>{' '}
                      </a>
                    </li>
                  </ul>
                </header>

                {/* widget content */}
                <div className="widget-body" style={{ padding: 0 }}>
                  <div className="tab-content">
                    <div className="tab-pane active" id="hr1">
                      <SkinSwitcher />
                    </div>
                  </div>
                </div>
                {/* end widget content */}
              </JarvisWidget>
              {/* end widget */}
            </article>
            {/* END COL */}
          </div>

          {/* END ROW */}
        </WidgetGrid>

        {/* end widget grid */}
      </div>
    );
  }
}
