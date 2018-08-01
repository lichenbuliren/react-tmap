/* global qq */
import PropTypes from 'prop-types'
import { convertorPointsToPath } from './utils'
import Graphy from './Graphy'

export default class Polyline extends Graphy {
  static defaultProps = {
    points: [],
    visible: false
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
      'map',
      'path',
      'points',
      'strokeColor',
      'strokeDashStyle',
      'strokeWeight',
      'visible',
      'zIndex'
    ]
  }

  setPoints = (points) => {
    const path = convertorPointsToPath(points)
    if (!this.polyline) return
    this.polyline.setPath(path)
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
    if (!this.polyline) {
      this.polyline = new qq.maps.Polyline(options)
      this.polyline.setPoints = this.setPoints
    }
    visible ? this.polyline.setMap(map) : this.polyline.setMap(null)
    return this.polyline
  }

  render () {
    return null
  }
}
