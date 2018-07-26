import BaseComponent from './BaseComponent'
import PropTypes from 'prop-types'
import { ControlPosition } from './constants'

export default class Control extends BaseComponent {
  constructor (props) {
    super(props)
    this.controlNode = undefined
  }
  static propTypes = {
    position: PropTypes.oneOf(ControlPosition)
  }

  componentDidMount () {
    this.initialize()
  }

  initialize = () => {
    const { map } = this.props
    if (!map) return
    this.control = this.getControl()
  }

  getControl () {
    const { map, position } = this.props
    if (!map || !this.controlNode) return
    const mapControls = map.controls[position]
    mapControls.push(this.controlNode)
    this.control = this.controlNode
    this.control.index = mapControls.length
    return this.control
  }
}
