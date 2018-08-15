/* global qq */
import React from 'react'

function Overlay (options) {
  qq.maps.Overlay.call(this, options)
  return this
}

Overlay.prototype = new qq.maps.Overlay()
Overlay.prototype.construct = function () {
  const content = this.get('content')
  if (content) {
    this.$dom = content
    // overlayMouseTarget 可接受点击事件
    this.getPanes().overlayMouseTarget.appendChild(content)
  }
}

Overlay.prototype.draw = function () {
  const position = this.get('position')
  const { x, y } = this.get('offset')
  if (position) {
    const pixel = this.getProjection().fromLatLngToDivPixel(position)
    this.$dom.style.left = `${pixel.getX() + x}px`
    this.$dom.style.top = `${pixel.getY() + y}px`
  }
}

Overlay.prototype.destory = function () {
  this.$dom.parentNode.removeChild(this.$dom)
}

class OverlayComponent extends React.Component {
  static defaultProps = {
    position: {},
    style: {}
  }

  componentDidMount () {
    this.initialize()
  }

  getMap () {
    return this.map
  }

  getPanes () {
    return this.map.getPanes()
  }

  getProjection () {
    return this.map.getProjection()
  }

  initialize = () => {
    const { map, position, offset } = this.props
    if (!map) return
    this.overlay = new Overlay({
      map,
      position: new qq.maps.LatLng(position.lat, position.lng),
      content: this.overlayNode,
      offset
    })
  }

  componentWillUnmount () {
    this.overlay.destory()
  }

  render () {
    const { children, style } = this.props
    const _style = Object.assign({
      position: 'absolute',
      backgroundColor: 'red',
      transform: 'translateY(-50%)',
      whiteSpace: 'nowrap'
    }, style)

    return (
      <div
        ref={node => { this.overlayNode = node }}
        style={_style}
      >
        {children}
      </div>
    )
  }
}

export default OverlayComponent
