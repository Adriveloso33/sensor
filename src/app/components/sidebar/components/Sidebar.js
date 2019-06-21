import React from "react";
import ToggleButton from "./ToggleButton";
import Loader from "../../dashboards/components/Loader";
import { connect } from "react-redux";
import classnames from "classnames";

const step = 50;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minHeight: false
    };

    this.aside = null;
    this.el = null;
  }

  componentDidMount() {
    const { showInitSidebar } = this.props;
    if (showInitSidebar == false) this.hide();
  }

  hide = () => {
    setTimeout(() => {
      let visibleTab = $(".ui-tabs-panel:visible");
      let tabContent = visibleTab.find("#tab-main-content");

      tabContent.removeClass("tab-left-content");
    }, 0);
  };

  render() {
    const { items, tabId, block, showInitSidebar } = this.props;

    return (
      <aside
        ref={el => {
          this.aside = el;
        }}
        id="right-panel"
        className={classnames([
          "hidden-xs",
          showInitSidebar == false ? "hidden-functions" : ""
        ])}
      >
        <ToggleButton showInitSidebar={showInitSidebar} />
        <div
          className="right-panel-content"
          ref={el => {
            this.el = el;
          }}
        >
          <Loader show={block} overlay={false} background={true} />
          {items &&
            items.map((Cmp, index) => {
              return (
                <div key={index} id="sidebar-elem-container">
                  {Cmp && <Cmp tabId={tabId} />}
                </div>
              );
            })}
        </div>
      </aside>
    );
  }
}

const mapStateToProps = state => {
  const { block } = state.getIn(["sidebar"], {});
  return {
    block
  };
};

export default connect(mapStateToProps)(Sidebar);
