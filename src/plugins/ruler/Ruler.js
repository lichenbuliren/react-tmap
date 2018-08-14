/* global qq */
import React from 'react'
import CanvasLayer from '../CanvasLayer'

export default class Ruler extends React.Component {
  static defaultProps = {
    // 原点背景色颜色
    dotBorderColor: 'red',
    // 原点描边类型 solid || dash
    dotStrokeStyle: 'solid',
    // 测距线宽度
    strokeWidth: '1',
    // 原点背景色颜色
    dotBgColor: '#fff',
    strokeColor: 'red',
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

  componentDidMount () {
    this.initialize()
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
    qq.maps.event.addListener(map, 'bounds_changed', this.handleBoundsChanged)

    qq.maps.event.addListener(map, 'click', this.handleClick)

    qq.maps.event.addListener(map, 'dblclick', this.handleDoubleClick)

    qq.maps.event.addListener(map, 'mousemove', this.handleMouseMove)

    qq.maps.event.addListener(map, 'rightclick', this.handleDoubleClick)
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

  }

  // 删除测距点
  handleDelete = () => {

  }

  handleUpdate = () => {
    // 绘制核心逻辑
  }

  render () {
    return null
  }
}
