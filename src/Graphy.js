import BaseComponent from './BaseComponent'
import { toPascal } from './utils'

export default class Graphy extends BaseComponent {
  componentDidMount () {
    this.initialize()
  }

  componentWillUnmount () {
    this.destroy()
  }

  componentDidUpdate (prevProps) {
    const receiveProps = this.options || []
    const curOptions = this._getOptions()
    if (!this.overlay) return
    receiveProps.forEach(key => {
      const fnName = `set${toPascal(key)}`
      // 判断前后属性和 set 方法是否存在，如果存在，则执行对应的更新
      if (this.props[key] !== prevProps[key] && !!this.overlay[fnName]) {
        this.overlay[fnName](curOptions[key])
      }
    })
  }

  destroy () {
    // 将当前覆盖物移出地图
    if (this.overlay) {
      this.overlay.setMap(null)
      this.overlay = null
    }
  }

  initialize = () => {
    const { map } = this.props
    if (!map) return
    this.destroy()
    // getOverlay 由子类具体实现
    this.overlay = this.getOverlay()
    if (this.overlay) this.bindEvent(this.overlay, this.events)
  }

  // 子类特殊构造 options 方法，可以做一些自定义的转化
  _getOptions = () => {
    return {}
  }

  getOverlay () {
    return null
  }

  render () {
    return null
  }
}
