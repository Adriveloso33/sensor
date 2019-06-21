import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_COLOR = '#FFFFFF';

class WdnaAnimation extends React.Component {
  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    color: DEFAULT_COLOR,
  };

  componentWillMount() {
    const { color } = this.props;
    window.createWdnaAnimation(color || DEFAULT_COLOR);
  }

  componentDidMount() {
    startAnimation();
  }

  render() {
    return (
      <div id="animation_container" style={{ width: '340px', height: '330px' }}>
        <canvas
          id="canvas"
          width="340"
          height="400"
          style={{ position: 'absolute', display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.00)' }}
        />
        <div
          id="dom_overlay_container"
          style={{
            pointerEvents: 'none',
            overflow: 'hidden',
            width: '340px',
            height: '330px',
            position: 'absolute',
            left: '0px',
            top: '0px',
            display: 'block',
          }}
        />
      </div>
    );
  }
}

export default WdnaAnimation;

/* eslint-disable */
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
function startAnimation() {
  canvas = document.getElementById('canvas');
  anim_container = document.getElementById('animation_container');
  dom_overlay_container = document.getElementById('dom_overlay_container');
  var comp = AdobeAn.getComposition('BAD85D37F72F4348BC97946CCA0337CF');
  var lib = comp.getLibrary();
  createjs.MotionGuidePlugin.install();
  handleComplete({}, comp);
}
function handleComplete(evt, comp) {
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  var lib = comp.getLibrary();
  var ss = comp.getSpriteSheet();
  exportRoot = new lib.ani_WDNA_condensed_black_trans();
  stage = new lib.Stage(canvas);
  //Registers the "tick" event listener.
  fnStartAnimation = function() {
    stage.addChild(exportRoot);
    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener('tick', stage);
  };
  //Code to support hidpi screens and responsive scaling.
  function makeResponsive(isResp, respDim, isScale, scaleType) {
    var lastW,
      lastH,
      lastS = 1;
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    function resizeCanvas() {
      var w = lib.properties.width,
        h = lib.properties.height;
      var iw = window.innerWidth,
        ih = window.innerHeight;
      var pRatio = window.devicePixelRatio || 1,
        xRatio = iw / w,
        yRatio = ih / h,
        sRatio = 1;
      if (isResp) {
        if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
          sRatio = lastS;
        } else if (!isScale) {
          if (iw < w || ih < h) sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 1) {
          sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 2) {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
      canvas.width = w * pRatio * sRatio;
      canvas.height = h * pRatio * sRatio;
      canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
      canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
      stage.scaleX = pRatio * sRatio;
      stage.scaleY = pRatio * sRatio;
      lastW = iw;
      lastH = ih;
      lastS = sRatio;
      stage.tickOnUpdate = false;
      stage.update();
      stage.tickOnUpdate = true;
    }
  }
  makeResponsive(false, 'both', false, 1);
  AdobeAn.compositionLoaded(lib.properties.id);
  fnStartAnimation();
}
