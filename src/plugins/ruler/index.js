/* global qq */
import React from 'react'
import CanvasLayer from '../CanvasLayer'
import Circle from '../../Circle'

export default class Ruler extends React.Component {
  static defaultProps = {
    editable: false,
    // 提示弹层相对测距点中心偏移
    tipsOffset: {
      x: 30,
      y: 0
    },
    // 原点背景色颜色
    dotBorderColor: 'red',
    dotRadius: 10,
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

  constructor (props) {
    super(props)
    this.state = {
      paths: []
    }
  }

  componentDidMount () {
    this.initialize()
  }

  get _paths () {
    const { paths } = this.state
    return paths.map((path, i) => {
      const { dots } = path
      return new qq.maps.LatLng(dots)
    })
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
    const { paths } = this.state
    const { dotRadius } = this.props
    return (
      <div className='ruler-container'>
        {paths.map((path, i) => {
          // 绘制定点 dots
          const { dots: { lat, lng } } = path
          return <Circle center={{ lat, lng }} radius={dotRadius} />
        })}
      </div>
    )
  }
}
