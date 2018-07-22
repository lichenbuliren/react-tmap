/* global qq, QQMapPlugin */
import React from 'react'
import PropTypes from 'prop-types'

export default class HeatMap extends React.Component {
  static defaultProps = {
    options: {
      radius: 1,
      maxOpacity: 0.8,
      useLocalExtrema: true,
      valueField: 'count'
    },
    heatData: {
      max: 100,
      data: []
    }
  }

  static propTypes = {
    options: PropTypes.object,
    heatData: PropTypes.shape({
      max: PropTypes.number,
      data: PropTypes.arrayOf(PropTypes.object)
    })
  }

  componentDidMount () {
    this.initHeatMap()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.heatData.data !== this.props.heatData.data && this.heatMap) {
      this.heatMap.setData(this.props.heatData)
    }
  }

  initHeatMap = () => {
    const { options, heatData, map } = this.props
    if (!map) return
    qq.maps.event.addListenerOnce(map, 'idle', () => {
      this.heatMap = new QQMapPlugin.HeatmapOverlay(map, options)
      this.heatMap.setData(heatData)
    })
  }

  render () {
    return null
  }
}
