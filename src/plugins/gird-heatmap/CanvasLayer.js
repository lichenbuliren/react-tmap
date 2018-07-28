/* global qq */
import { getMapSize } from '../../utils'

function CanvasLayer (map, options) {
  this.setMap(map)
  this.options = options || {}
  this.context = this.options.context || '2d'
  this.zIndex = this.options.zIndex || 0
  qq.maps.Overlay.call(this)
}

var global = typeof window === 'undefined' ? {} : window

CanvasLayer.prototype = new qq.maps.Overlay()

CanvasLayer.CSS_TRANSFORM = (function () {
  var div = document.createElement('div')
  var props = [
    'transform',
    'WebkitTransform',
    'MozTransform',
    'OTransform',
    'msTransform'
  ]

  for (var i = 0; i < props.length; i++) {
    var prop = props[i]
    if (div.style[prop] !== undefined) {
      return prop
    }
  }

  return props[0]
})()

CanvasLayer.prototype.construct = function () {
  var mapSize = getMapSize(this.map)
  var canvas = this.canvas = document.createElement('canvas')
  canvas.style.cssText = `width: ${mapSize.width}px;height: ${mapSize.height}px;border: 1px solid red;box-sizing: border-box;position: relative;z-index: ${this.zIndex}`
  this.resize()
  this.getPanes().overlayLayer.appendChild(canvas)
  qq.maps.event.addListener(this.map, 'bounds_changed', () => {
    this.resize()
    this.draw()
  })
  this.constructed = true
}

CanvasLayer.prototype.destory = function () {
  this.canvas.parentElement.removeChild(this.canvas)
  if (this.changeHandler) {
    qq.maps.event.removeListener(this.changeHandler)
    this.changeHandler = null
  }
  this.canvas = null
}

CanvasLayer.prototype.repositionCanvas = function () {
  if (!this.map) return
  // 返回当前地图的视野范围
  var bounds = this.map.getBounds()
  // 地图视野范围内左上角坐标经纬度 LatLng
  var topLeft = new qq.maps.LatLng(
    bounds.getNorthEast().getLat(),
    bounds.getSouthWest().getLng()
  )

  // 返回覆盖物容器的相对像素坐标或是经纬度坐标
  var projection = this.getProjection()
  // 左上角移动偏移量
  var offset = projection.fromLatLngToDivPixel(topLeft)

  this.canvas.style[CanvasLayer.CSS_TRANSFORM] = `translate(${Math.round(offset.x)}px, ${Math.round(offset.y)}px)`
  this.draw()
}

CanvasLayer.prototype.draw = function () {
  this.options.update && this.options.update.call(this)
}

CanvasLayer.prototype.resize = function () {
  if (!this.map) return
  var size = getMapSize(this.map)
  var width = size.width
  var height = size.height
  var canvas = this.canvas

  var devicePixelRatio = this.devicePixelRatio = global.devicePixelRatio || 1

  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio
  if (this.context === '2d') {
    canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio)
  }

  if (width === this.width && height === this.height) {
    return
  }

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  this.repositionCanvas()
}

CanvasLayer.prototype.getContainer = function () {
  return this.canvas
}

CanvasLayer.prototype.show = function () {
  this.canvas.style.display = ''
}

CanvasLayer.prototype.hide = function () {
  this.canvas.style.display = 'none'
}

CanvasLayer.prototype.setZIndex = function (zIndex) {
  this.zIndex = zIndex
  this.canvas.style.zIndex = this.zIndex
}

CanvasLayer.prototype.getZIndex = function () {
  return this.zIndex
}

export default CanvasLayer
