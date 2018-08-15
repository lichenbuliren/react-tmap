/* global qq */
import React from 'react'
import CanvasLayer from '../CanvasLayer'
import Circle from '../../Circle'
// import Overlay from '../../Overlay'

export default class Ruler extends React.Component {
  static defaultProps = {
    editable: false,
    // 提示弹层相对测距点中心偏移
    tipsOffset: {
      x: 30,
      y: 0
    },
    // 原点背景色颜色
    dotStrokeColor: 'red',
    dotRadius: 10,
    // 原点描边类型 solid || dash
    dotStrokeDashStyle: 'solid',
    // 测距线宽度
    dotStrokeWeight: '1',
    // 原点背景色颜色
    dotFillColor: '#fff',
    lineStrokeColor: 'red',
    lineStrokeDashStyle: 'solid',
    lineStrokeWeight: '1',
    // 点击新增测距点
    onClick: () => {},
    // 双击完成测距
    onCompleted: () => {},
    // 删除测距点
    onDelete: () => {},
    // 清空测距点
    onClear: () => {},
    onBoundsChanged: () => {},
    // 鼠标移动事件
    onMouseMove: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      results: []
    }
  }

  componentDidMount () {
    this.initialize()
  }

  get circleOptions () {
    const { dotStrokeColor: strokeColor, dotStrokeDashStyle: strokeDashStyle, dotStrokeWeight: strokeWeight, dotRadius: radius } = this.props
    return {
      strokeColor,
      strokeWeight,
      radius,
      strokeDashStyle
    }
  }

  get overlayOptions () {
    const { tipsOffset: offset } = this.props
    return {
      offset,
      style: {
        border: '1px solid #000',
        boxShadow: '2px 2px 4px 2px rgba(0, 0, 0, 0.2)'
      }
    }
  }

  initialize = () => {
    const { map } = this.props
    if (!map) return

    this.canvasLayer = new CanvasLayer(map, {
      update: this.handleUpdate
    })
  }

  bindEvent = () => {
    const { map } = this.props
    qq.maps.event.addListener(map, 'bounds_changed', this.proxyEvent(this.handleBoundsChanged))

    qq.maps.event.addListener(map, 'click', this.proxyEvent(this.handleClick))

    qq.maps.event.addListener(map, 'dblclick', this.proxyEvent(this.handleDoubleClick))

    qq.maps.event.addListener(map, 'mousemove', this.proxyEvent(this.handleMouseMove))

    qq.maps.event.addListener(map, 'rightclick', this.proxyEvent(this.handleDoubleClick))
  }

  proxyEvent = fn => () => {
    const { editable } = this.props
    if (editable) fn()
    return false
  }

  handleBoundsChanged = () => {
    const { onBoundsChanged } = this.props
    onBoundsChanged && onBoundsChanged()
  }

  handleClick = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  handleDoubleClick = () => {
    const { onCompleted } = this.props
    onCompleted && onCompleted()
  }

  handleMouseMove = () => {
    const { onMouseMove } = this.props
    onMouseMove && onMouseMove()
  }

  // 清空测距
  handleClear = () => {
    const { onClear } = this.props
    onClear && onClear()
  }

  // 删除测距点
  handleDelete = () => {
    const { onDelete } = this.props
    onDelete && onDelete()
  }

  handleUpdate = () => {
    // 绘制核心逻辑
  }

  render () {
    const { results } = this.state
    return (
      <div className='ruler-container'>
        {results.map((path, i) => {
          // 绘制定点 dots
          const { dots } = path
          return (
            <React.Fragment>
              {dots.map((dot, i) => {
                const { lat, lng } = dot
                return (
                  <React.Fragment>
                    <Circle center={{ lat, lng }} {...this.circleOptions} />
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
}
