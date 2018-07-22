/* global qq */
import PropTypes from 'prop-types'
import { convertorPointsToPath } from './utils'
import Graphy from './Graphy'

export default class Polygon extends Graphy {
  static defaultProps = {
    points: [],
    visible: true
  }

  static propTypes = {
    points: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
      })
    ),
    visible: PropTypes.bool
  }

  get events () {
    return [
      'map_changed',
      'visible_changed',
      'zindex_changed',
      'click',
      'dblclick',
      'rightclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'mousemove',
      'insertNode',
      'removeNode',
      'adjustNode'
    ]
  }

  get options () {
    return [
      'clickable',
      'cursor',
      'editable',
      'fillColor',
      'map',
      'path',
      'strokeColor',
      'strokeDashStyle',
      'strokeWeight',
      'visible',
      'zIndex',
      'draggable'
    ]
  }

  _getOptions = () => {
    const { points } = this.props
    const path = convertorPointsToPath(points)
    const options = this.getOptions(this.options)
    options.path = path
    return options
  }

  getOverlay = () => {
    const { visible, map } = this.props
    const options = this._getOptions()
    if (!map) return
    if (!this.polygon) {
      this.polygon = new qq.maps.Polygon(options)
    }
    visible ? this.polygon.setMap(map) : this.polygon.setMap(null)
    return this.polygon
  }
  render () {
    return null
  }
}
