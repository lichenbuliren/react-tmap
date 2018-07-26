/* global qq */
import PropTypes from 'prop-types'
import { pointToLatLng } from './utils'
import Graphy from './Graphy'

export default class Marker extends Graphy {
  static defaultProps = {
    decoration: null,
    visible: true
  }

  static propTypes = {
    position: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    })
  }

  get events () {
    return [
      'animation_changed',
      'clickable_changed',
      'cursor_changed',
      'draggable_changed',
      'flat_changed',
      'icon_changed',
      'map_changed',
      'position_changed',
      'shadow_changed',
      'shape_changed',
      'title_changed',
      'visible_changed',
      'zindex_changed',
      'click',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'dblclick',
      'rightclick',
      'dragstart',
      'dragging',
      'dragend',
      'moving',
      'moveend'
    ]
  }

  get options () {
    return [
      'animation',
      'clickable',
      'draggable',
      'flat',
      'cursor',
      'icon',
      'shadow',
      'shape',
      'title',
      'visible',
      'zIndex',
      'map',
      'position',
      'rotation',
      'autoRotation',
      'decoration'
    ]
  }

  _getOptions = () => {
    const { decoration } = this.props
    const options = this.getOptions(this.options)
    options.position = pointToLatLng(options.position)
    if (decoration) {
      options.decoration = new qq.maps.MarkerDecoration(decoration, new qq.maps.Point(0, -5))
    }

    return options
  }

  getOverlay = () => {
    const { map, visible } = this.props
    if (!map) return null
    // 记录副本
    const _options = this._getOptions()
    if (!this.marker) {
      this.marker = new qq.maps.Marker(_options)
    }

    visible ? this.marker.setMap(map) : this.marker.setMap(null)
    return this.marker
  }
}
