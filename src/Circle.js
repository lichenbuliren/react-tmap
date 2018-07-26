/* global qq */
import Graphy from './Graphy'
import PropTypes from 'prop-types'
import { pointToLatLng } from './utils'

export default class Circle extends Graphy {
  static defaultProps = {
    center: {},
    radius: 10,
    visible: true
  }

  static propTypes = {
    center: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }).isRequired,
    radius: PropTypes.number.isRequired
  }

  get events () {
    return [
      'center_changed',
      'map_changed',
      'radius_changed',
      'visible_changed',
      'zindex_changed',
      'click',
      'dblclick',
      'rightclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'mousemove'
    ]
  }

  get options () {
    return [
      'center',
      'clickable',
      'cursor',
      'fillColor',
      'map',
      'radius',
      'strokeColor',
      'strokeDashStyle',
      'strokeWeight',
      'visible',
      'zIndex'
    ]
  }

  _getOptions = () => {
    const { center } = this.props
    const options = this.getOptions(this.options)
    options.center = pointToLatLng(center)
    return options
  }

  getOverlay = () => {
    const { map, visible } = this.props
    const _options = this._getOptions()
    if (!map) return
    if (this.circle) this.circle.setMap(null)
    this.circle = new qq.maps.Circle(_options)

    visible ? this.circle.setMap(map) : this.circle.setMap(null)
    return this.circle
  }
}
