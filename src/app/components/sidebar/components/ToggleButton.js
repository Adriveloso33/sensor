import React from 'react';

const showBarClass = 'fa fa-bars txt-color-white';
const hideBarClass = 'fa fa-bars txt-color-white';

export default class ToggleButton extends React.Component {
  toggle = () => {
    let visibleTab = $('.ui-tabs-panel:visible');
    let sideBar = visibleTab.find('#right-panel');

    // if there is no right bar
    if (!sideBar.length) return false;

    if (sideBar.hasClass('hidden-functions')) {
      this.show();
    } else {
      if (this.isMobile() && sideBar.hasClass('hidden-xs')) this.show();
      else this.hide();
    }

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  };

  show = () => {
    let visibleTab = $('.ui-tabs-panel:visible');
    let sideBar = visibleTab.find('#right-panel');
    let tabContent = visibleTab.find('#tab-main-content');
    let icon = $(this.refs.icon);

    sideBar.removeClass('hidden-functions');
    if (!this.isMobile()) sideBar.addClass('hidden-xs');
    else sideBar.removeClass('hidden-xs');

    tabContent.addClass('tab-left-content');

    icon.removeClass(hideBarClass);
    icon.addClass(showBarClass);
  };

  hide = () => {
    let visibleTab = $('.ui-tabs-panel:visible');
    let sideBar = visibleTab.find('#right-panel');
    let tabContent = visibleTab.find('#tab-main-content');
    let icon = $(this.refs.icon);

    sideBar.addClass('hidden-functions hidden-xs');
    tabContent.removeClass('tab-left-content');
    icon.removeClass(showBarClass);
    icon.addClass(hideBarClass);
  };

  isMobile = () => {
    return $(window).width() < 768;
  };

  render() {
    return (
      <div id="toggle-func-btn" className="transparent">
        <span>
          <a title="Toggle functions bar" onClick={this.toggle}>
            <i ref="icon" className={showBarClass} />
          </a>
        </span>
      </div>
    );
  }
}
