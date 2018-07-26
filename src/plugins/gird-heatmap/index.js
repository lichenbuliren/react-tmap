/* global qq */
import BaseLayer from './BaseLayer'
import CanvasLayer from './CanvasLayer'
import { clear } from '../../utils'
import DataSet from '../../data/DataSet'

class GridHeatmap extends BaseLayer {
  constructor (map, data, options = {}) {
    const dataSet = new DataSet(data)
    super(map, dataSet, options)
    this.init(options)
    const canvasLayer = this.canvasLayer = new CanvasLayer(map, {
      context: this.context,
      paneName: options.paneName,
      mixBlendMode: options.mixBlendMode,
      enableMassClear: options.enableMassClear,
      zIndex: options.zIndex,
      update: () => this._canvasUpdate()
    })

    dataSet.on('change', function () {
      canvasLayer.draw()
    })
  }

  clickEvent (e) {
    var pixel = e.pixel
    super.clickEvent(pixel, e)
  }

  mousemoveEvent (e) {
    var pixel = e.pixel
    super.mousemoveEvent(pixel, e)
  }

  bindEvent (e) {
    this.unbindEvent()
    if (this.options.methods) {
      if (this.options.methods.click) {
        this.clickMapHandler = qq.maps.event.addListener(this.map, 'click', this.clickEvent)
      }
      if (this.options.methods.mousemove) {
        this.mouseMoveMapHandler = qq.maps.event.addListener(this.map, 'mousemove', this.mousemoveEvent)
      }
    }
  }

  unbindEvent (e) {
    if (this.options.methods) {
      if (this.options.methods.click) {
        qq.maps.event.removeListener(this.clickMapHandler)
      }
      if (this.options.methods.mousemove) {
        qq.maps.event.removeListener(this.mouseMoveMapHandler)
      }
    }
  }

  getContext () {
    return this.canvasLayer.canvas.getContext(this.context)
  }

  _canvasUpdate () {
    const map = this.map
    const projection = map.getProjection()
    if (!this.canvasLayer || !projection) {
      return
    }
    const bounds = map.getBounds()
    const topLeft = new qq.maps.LatLng(
      bounds.getNorthEast().getLat(),
      bounds.getSouthWest().getLng()
    )
    const zoom = map.getZoom()
    // 计算缩放级别
    const zoomUnit = Math.pow(2, 17 - zoom)
    const layerProjection = this.canvasLayer.getProjection()
    const layerOffset = layerProjection.fromLatLngToDivPixel(topLeft)
    const context = this.getContext()
    clear(context)

    if (this.context === '2d') {
      for (let key in this.options) {
        context[key] = this.options[key]
      }
    } else {
      context.clear(context.COLOR_BUFFER_BIT)
    }

    if ((this.options.minZoom && map.getZoom() < this.options.minZoom) || (this.options.maxZoom && map.getZoom() > this.options.maxZoom)) {
      return
    }
    // get data from data set
    if (this.options.unit === 'm') {
      if (this.options.size) {
        this.options._size = this.options.size / zoomUnit
        this.options._height = this.options.height / zoomUnit
        this.options._width = this.options.width / zoomUnit
      }
    } else {
      this.options._size = this.options.size
      this.options._height = this.options.height
      this.options._width = this.options.width
    }

    const dataGetOptions = {
      fromColumn: 'coordinates',
      transferCoordinate: function (coordinate) {
        const pixel = layerProjection.fromLatLngToDivPixel(new qq.maps.LatLng(coordinate[1], coordinate[0]))
        // 这里偏移网格大小的一半
        return [pixel.x - layerOffset.x, pixel.y - layerOffset.y]
      }
    }

    const data = this.dataSet.get(dataGetOptions)
    this.drawContext(context, data, this.options, {
      x: parseFloat(layerOffset.x.toFixed(4)),
      y: parseFloat(layerOffset.y.toFixed(4))
    })
  }

  init (options) {
    this.options = options
    // 调用父类方法，得到颜色分割区间
    this.initDataRange(options)
    // 设置 canvas 绘制上下文
    this.context = this.options.context || '2d'

    if (this.options.zIndex) {
      this.canvasLayer && this.canvasLayer.setZIndex(this.options.zIndex)
    }

    if (this.options.max) {
      this.intensity.setMax(this.options.max)
    }

    if (this.options.min) {
      this.intensity.setMin(this.options.min)
    }

    this.bindEvent()
  }

  addAnimatorEvent () {
    qq.maps.event.addListener(this.map, 'movestart', this.animatorMovestartEvent.bind(this))
    qq.maps.event.addListener(this.map, 'moveend', this.animatorMoveendEvent.bind(this))
  }

  draw () {
    this.canvasLayer.draw()
  }
}

export default GridHeatmap
