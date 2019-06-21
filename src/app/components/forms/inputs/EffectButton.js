import React from 'react';
import PropTypes from 'prop-types';

import ReactSVG from 'react-svg';

export default class EffectButton extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    srcImage: PropTypes.string.isRequired,
    imageType: PropTypes.string,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    imageType: 'normal',
  };

  handleClick = (e) => {
    e.preventDefault();

    const { onClick, name } = this.props;
    if (typeof onClick === 'function') onClick(name);
  };

  render() {
    const { name, srcImage, title, imageType, color = '#FFF' } = this.props;

    return (
      <div className="contenedor" style={{ borderColor: color }} name={name} onClick={this.handleClick}>
        {imageType === 'svg' ? (
          <ReactSVG src={srcImage} svgClassName="img-responsive img-select-filter icon" />
        ) : (
          <img className="img-responsive img-select-filter icon" src={srcImage} alt={title} />
        )}
        <p className="texto">{title}</p>
      </div>
    );
  }
}
