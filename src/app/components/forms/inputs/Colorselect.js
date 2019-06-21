'use strict';

import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class SketchColor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: props.color || '#0000FF'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.color) {
      this.setState({
        color: nextProps.color
      });
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex });

    if (typeof this.props.handleChange === 'function') this.props.handleChange(this.props.name, color.hex);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '19px',
          borderRadius: '2px',
          background: `${this.state.color}`
        },
        swatch: {
          padding: '5px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '0px',
          border: '1px solid #888',
          // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'fixed',
          zIndex: '999'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker color={this.state.color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SketchColor;
