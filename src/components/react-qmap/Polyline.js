/* global qq */
import React from 'react'
import PropTypes from 'prop-types'
import { convertorPointsToPath } from './utils'

export default class Polyline extends React.Component {
  static defaultProps = {
    points: [],
    options: {},
    visible: false,
    // 移动折线节点事件
    adjustNode: () => {},
    removeNode: () => {},
    insertNode: () => {}
  }

  static propTypes = {
    points: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
      })
    ),
    visible: PropTypes.bool,
    options: PropTypes.object
  }

  componentDidMount () {
    this.initPolyline()
  }

  componentDidUpdate () {
    this.initPolyline()
  }

  initPolyline = () => {
    const { map, points, options, visible } = this.props
    const path = convertorPointsToPath(points)
    const _options = {
      ...options,
      path
    }
    if (!map) return
    if (!this.polyline) {
      this.polyline = new qq.maps.Polyline(_options)
      // qq.maps.addEventListener(this.polyline, 'adjustNode', adjustNode)
      // qq.maps.addEventListener(this.polyline, 'removeNode', removeNode)
    }
    this.polyline.setOptions(_options)
    visible ? this.polyline.setMap(map) : this.polyline.setMap(null)
  }

  render () {
    return null
  }
}
