/* global qq */
import BaseLayer from '../BaseLayer'
import CanvasLayer from './CanvasLayer'
import DataSet from '../../data/DataSet'
import { clear } from '../../utils'
import { gradient } from '../../config'
import _extend from 'extend'

class GridHeatmap extends BaseLayer {
  constructor (map, data, options) {
    options = _extend(true, {}, {
      gradient,
      unit: 'm',
      countField: 'count',
      showText: true,
      showTextZoomLevel: 16,
      // 是否没屏都开启颜色计算，如果是，则没屏都会有一个最深颜色
      useLocalExtrema: true
    }, options)
    super(map, data, options)
    // 记录当前在可是区域内的网格数
    this.inViewPortCount = 0
    this.init(options)
    this._zoom = map.getZoom()
    this.options.showText = this._zoom > this.options.showTextZoomLevel
    this.canvasLayer = new CanvasLayer(map, {
      context: this.context,
      paneName: options.paneName,
      zIndex: options.zIndex,
      update: () => this._canvasUpdate()
    })

    qq.maps.event.addListener(this.map, 'zoom_changed', () => {
      const zoom = this.map.getZoom()
      const showTextZoomLevel = options.showTextZoomLevel
      this.options.showText = zoom > showTextZoomLevel
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

  setData (data) {
    let _dataSet
    if (!(_dataSet instanceof DataSet)) {
      _dataSet = data.map((point, i) => ({
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        },
        count: data[i][this.options.countField]
      }))
    }

    this.dataSet.set(_dataSet)
    if (this.canvasLayer) this.canvasLayer.draw()
  }

  updateOptions (opts) {
    console.log(opts)
    this.options = _extend(true, this.options, opts)
    console.log(this.options)
  }

  getContext () {
    if (!this.canvasLayer.canvas) return null
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
    const context = this.getContext()
    const zoomUnit = Math.pow(2, 17 - zoom)
    const layerProjection = this.canvasLayer.getProjection()
    const layerOffset = layerProjection.fromLatLngToDivPixel(topLeft)
    const dataGetOptions = {
      fromColumn: 'coordinates',
      filter: item => {
        const { geometry: { coordinates } } = item
        const point = new qq.maps.LatLng(coordinates[1], coordinates[0])
        return bounds.contains(point)
      },
      transferCoordinate: function (coordinate) {
        const pixel = layerProjection.fromLatLngToDivPixel(new qq.maps.LatLng(coordinate[1], coordinate[0]))
        const point = {
          x: pixel.x - layerOffset.x,
          y: pixel.y - layerOffset.y
        }
        return [point.x, point.y]
      }
    }

    const data = this.dataSet.get(dataGetOptions)
    if (!data.length) return
    if (this.context === '2d') {
      // 配置全局 canvas 上下文参数
      for (let key in this.options) {
        context[key] = this.options[key]
      }
    } else {
      context.clear(context.COLOR_BUFFER_BIT)
    }

    // 计算缩放级别
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
    this.options.zoom = zoom

    clear(context)

    this.drawContext(context, data, this.options, {
      x: layerOffset.x,
      y: layerOffset.y
    })
  }

  init (options) {
    this.options = options
    // 调用父类方法，得到颜色分割区间
    this.initDataRange(options)
    // 颜色配置区间
    this.options.choropleth = this.choropleth
    this.options.category = this.category
    this.options.intensity = this.intensity
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
}

export default GridHeatmap
