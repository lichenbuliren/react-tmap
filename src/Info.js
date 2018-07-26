/* global qq */
import PropTypes from 'prop-types'
import BaseComponent from './BaseComponent'
import { pointToLatLng } from './utils'

export default class Info extends BaseComponent {
  static defaultProps = {
    visible: false,
    position: {},
    content: '测试'
  }

  static propTypes = {
    visible: PropTypes.bool,
    position: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    content: PropTypes.any
  }

  get events () {
    return ['content_changed', 'position_changed', 'zindex_changed', 'domready', 'closeclick']
  }

  get options () {
    return ['content', 'position', 'zIndex', 'visible']
  }

  componentDidMount () {
    this.initInfo()
  }

  componentDidUpdate () {
    this.initInfo()
  }

  initInfo = () => {
    const {
      map,
      visible,
      position: { lat, lng }
    } = this.props
    const latLng = pointToLatLng({lat, lng})
    const options = this.getOptions(this.options)
    options.position = latLng
    if (!map) return
    if (!this.info) {
      this.info = new qq.maps.InfoWindow({
        ...options,
        map: map
      })
      this.bindEvent(this.info, this.events)
    }
    let infoContent = `<div style="width: 100%;max-width: 300px;text-align:left;">${options.content}</div>`
    this.info.setPosition(latLng)
    this.info.setContent(infoContent)
    visible ? this.info.open() : this.info.close()
  }

  render () {
    return null
  }
}
