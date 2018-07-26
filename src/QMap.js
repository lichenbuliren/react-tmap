/* global qq */
import React from 'react'
import BaseComponent from './BaseComponent'
import PropTypes from 'prop-types'
import { pointToLatLng } from './utils'

class QQMap extends BaseComponent {
  static defaultProps = {
    style: {
      height: '600px'
    }
  }

  static propTypes = {
    center: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    })
  }

  get events () {
    return [
      'click',
      'dblclick',
      'rightclick',
      'mouseover',
      'mouseout',
      'mousemove',
      'drag',
      'dragstart',
      'dragend',
      'longpress',
      'bounds_changed',
      'center_changed',
      'zoom_changed',
      'maptypeid_changed',
      'projection_changed',
      ['idle', true],
      'tilesloaded',
      'resize'
    ]
  }

  get options () {
    return [
      'center',
      'zoom',
      'minZoom',
      'maxZoom',
      'mapZoomType',
      'noClear',
      'backgroundColor',
      'boundary',
      'draggableCursor',
      'mapTypeId',
      'draggable',
      'scrollwheel',
      'disableDoubleClickZoom',
      'keyboardShortcuts',
      'mapTypeControl',
      'mapTypeControlOptions',
      'panControl',
      'panControlOptions',
      'zoomControl',
      'zoomControlOptions',
      'scaleControl',
      'scaleControlOptions'
    ]
  }

  componentDidMount () {
    this.initMap()
    this.forceUpdate()
  }

  componentWillUnmount () {
    this.map = null
  }

  componentDidUpdate (prevProps) {
    const { center, zoom } = prevProps
    const curCenter = pointToLatLng(this.props.center)
    if (zoom !== this.props.zoom) {
      this.map.zoomTo(this.props.zoom)
    }

    if (center !== this.props.center) {
      this.map.panTo(curCenter)
    }
  }

  initMap = () => {
    const options = this.getOptions(this.options)
    options.center = pointToLatLng(options.center)
    this.map = new qq.maps.Map(this.mapNode, options)
    this.bindEvent(this.map, this.events)
  }

  onRender = () => {
    if (!this.props.render || !this.map) {
      return
    }

    return this.props.render(this.map)
  }

  renderChildren = () => {
    const { children } = this.props
    if (!children || !this.map) return
    return React.Children.map(children, child => {
      if (!child) return
      if (typeof child === 'string') return child
      return React.cloneElement(child, {
        map: this.map
      })
    })
  }

  render () {
    const { style } = this.props
    return (
      <div className='qmap-container' style={style}>
        <div ref={node => (this.mapNode = node)} className={this.props.className} style={{height: '100%', width: '100%'}}>
          加载地图中...
          {this.renderChildren()}
          {this.onRender()}
        </div>
      </div>
    )
  }
}

export default QQMap
