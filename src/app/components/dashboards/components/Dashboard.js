import React from 'react';

import _ from 'lodash';

import { WidgetGrid } from '../../../components';

const duration = 500;
const expandHeight = 'calc(100vh - 37px - 74px - 60px)';
const normalHeight = '400px';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // generate some random ids
    this.ids = [];
    for (let i = 0; i < 20; i++) {
      this.ids.push(getStr());
    }

    this.id = getStr();
  }

  componentDidMount() {
    // Set up first order button
    setTimeout(() => {
      $(this.el)
        .find('.button-icon.jarviswidget-custom-btn')
        .on('click', (e) => {
          e.preventDefault();
          this.reOrder(e);
        });
    }, 0);
  }

  expandItem = (id) => {
    const firstElement = $(`#${id}`);
    const btn = firstElement.find('i').first();
    firstElement.find('.widget-body').height(expandHeight);

    setTimeout(() => {
      btn.attr('class', 'fa fa-arrow-up');
    }, 0);
  };

  collapseItem = (id) => {
    const firstElement = $(`#${id}`);
    const btn = firstElement.find('i').first();
    firstElement.find('.widget-body').height(normalHeight);

    setTimeout(() => {
      btn.attr('class', 'fa fa-arrow-down');
    }, 0);
  };

  /**
   * Expand or collapse first JarvisWidget
   */
  expandOrCollapse = () => {
    const id = this.ids[0];
    const firstElement = $(`#${id}`);
    const btn = firstElement.find('i').first();
    const btnClass = btn.attr('class');

    switch (btnClass) {
      case 'fa fa-arrow-down':
        this.expandItem(id);
        break;
      case 'fa fa-arrow-up':
        this.collapseItem(id);
        break;
      default:
        break;
    }
  };

  /**
   * Swap the DOM (div) clicked element to top
   * @param {Event} e
   */
  reOrder = (e) => {
    e.preventDefault();
    const element = e.target;

    const divId = $(element)
      .closest('.dashboardContainer')
      .first();

    const secondId = divId.attr('id');
    const firstId = this.ids[0];

    if (firstId === secondId) return;

    /* get elements */
    const firstNode = $(`#${firstId}`);
    const firstNodeChild = firstNode.children();

    const secondNode = $(`#${secondId}`);
    const secondNodeChild = secondNode.children();

    /* animations to hide elements */
    const hide1 = new Promise((resolve, reject) => {
      firstNodeChild.fadeTo(duration, 0, () => {
        resolve(true);
      });
    });

    const hide2 = new Promise((resolve, reject) => {
      secondNodeChild.fadeTo(duration, 0, () => {
        resolve(true);
      });
    });

    /* swap elements */
    Promise.all([hide1, hide2]).then((val) => {
      /* do the DOM swap */
      firstNode.prepend(secondNodeChild);
      secondNode.prepend(firstNodeChild);

      window.dispatchEvent(new Event('resize'));

      /* fade in DOM elements */
      firstNodeChild.stop().fadeTo(duration, 1);
      secondNodeChild.stop().fadeTo(duration, 1);
    });
  };

  render() {
    const { components, config } = this.props;

    return (
      <div ref={(el) => (this.el = el)} id="content">
        <WidgetGrid>
          <div className="row">
            {components &&
              components.map((Cmp, index) => {
                let { widths } = config ? config[index] : {};
                if (!widths) widths = [];

                const sm = widths[0] || 12;
                const md = widths[1] || 12;
                const lg = widths[2] || 12;

                const bsClass = `col-sm-${sm} col-md-${md} col-lg-${lg}`;

                return (
                  <article key={index} className={bsClass}>
                    <div id={this.ids[index]} className="dashboardContainer">
                      {<Cmp />}
                    </div>
                  </article>
                );
              })}
          </div>
        </WidgetGrid>
      </div>
    );
  }
}
