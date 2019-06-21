import React from "react";
import _ from "lodash";

require("fuelux/js/wizard.js");

export default class GeneralWizard extends React.Component {
  componentDidMount() {
    const self = this;
    this.props.onRef(this);
    const element = $(this.refs.wizard);

    const wizard = element.wizard();

    wizard.on("actionclicked.fu.wizard", function(e, data) {
      self.handlesNextStep(e, data);
    });

    wizard.on("stepclicked.fu.wizard", function(e, data) {
      self.handleCompletedStepClick(e, data);
    });

    wizard.on("finished.fu.wizard", function(e, data) {
      self.handleFinishedStep(e, data);
    });
  }

  componentWillUnMount() {
    this.props.onRef(undefined);
  }

  handlesNextStep = (e, data) => {
    const element = $(this.refs.wizard);
    const $form = element.find("form");

    const { customValidation } = this.props;

    if (customValidation) {
      if (data) {
        data.nextStep = this.getPageNext(data);
      }

      if (typeof customValidation === "function") {
        customValidation(e, data);
      }

      return null;
    }

    if ($form.data("validator")) {
      if (!$form.valid()) {
        $form.data("validator").focusInvalid();
        e.preventDefault();
        return null;
      }
    }

    if (data) {
      data.nextStep = this.getPageNext(data);
    }

    this.props.onChange(data);
  };

  handleCompletedStepClick = (e, data) => {
    const element = $(this.refs.wizard);
    const { step } = element.wizard("selectedItem");
    const nextStep = data.step;

    const newData = {
      step,
      nextStep,
      direction: "other"
    };

    const { customValidation } = this.props;
    if (customValidation) {
      if (typeof customValidation === "function") {
        customValidation(e, newData);
      }

      return null;
    }
  };

  handleFinishedStep = (e, data) => {
    const element = $(this.refs.wizard);
    const $form = element.find("form");

    const formData = {};

    _.each($form.serializeArray(), function(field) {
      formData[field.name] = field.value;
    });

    if (_.isFunction(this.props.onComplete)) {
      this.props.onComplete(formData);
    }
  };

  goNextStep = () => {
    const element = $(this.refs.wizard);
    element.wizard("next");
  };

  goPreviousStep = () => {
    const element = $(this.refs.wizard);
    element.wizard("previous");
  };

  goSpecificStep = step => {
    const element = $(this.refs.wizard);

    element.wizard("selectedItem", {
      step: step
    });
  };

  getPageNext = data => {
    const { step, direction } = data;
    let nextStep;

    if (direction == "previous") {
      nextStep = step - 1;
    } else if (direction == "next") {
      nextStep = step + 1;
    }

    return nextStep;
  };

  render() {
    let { children, className } = this.props;
    return (
      <div className={className} ref="wizard">
        {children}
      </div>
    );
  }
}
