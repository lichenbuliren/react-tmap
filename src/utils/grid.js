import Intensity from './data-range/Intensity'
import DataSet from '../data/DataSet'

export default {
  draw: function (context, dataSet, options) {
    context.save()
    const grids = {}
    const data = dataSet instanceof DataSet ? dataSet.get() : dataSet
    const size = options._size || options.size || 50
    const _width = options._width
    const _height = options._height
    // 如果有配置 width,height 项，则优先取 width,height
    const xScale = _width || size
    const yScale = _height || size

    var offset = options.offset || {
      x: 0,
      y: 0
    }

    for (var i = 0; i < data.length; i++) {
      var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates
      let coordX = (coordinates[0] - offset.x) / xScale
      let coordY = (coordinates[1] - offset.y) / yScale
      coordX = parseFloat(coordX.toFixed(4))
      coordY = parseFloat(coordY.toFixed(4))
      var gridKey = coordX + ',' + coordY
      if (!grids[gridKey]) {
        grids[gridKey] = 0
      }
      grids[gridKey] += ~~(data[i].count || 1)
    }

    var intensity = new Intensity({
      max: options.max || 100,
      gradient: options.gradient
    })

    for (let gridKey in grids) {
      gridKey = gridKey.split(',')
      context.beginPath()
      // context.rect(gridKey[0] * size + 0.5 + offset.x, (gridKey[1] * size + 0.5 + offset.y), size, size)
      context.rect(gridKey[0] * xScale + offset.x - xScale / 2, (gridKey[1] * yScale + offset.y - yScale / 2), xScale, yScale)
      context.fillStyle = intensity.getColor(grids[gridKey])
      context.fill()
      if (options.strokeStyle && options.lineWidth) {
        context.stroke()
      }
    }

    if (options.label && options.label.show !== false) {
      context.fillStyle = options.label.fillStyle || 'white'

      if (options.label.font) {
        context.font = options.label.font
      }

      if (options.label.shadowColor) {
        context.shadowColor = options.label.shadowColor
      }

      if (options.label.shadowBlur) {
        context.shadowBlur = options.label.shadowBlur
      }

      for (let gridKey in grids) {
        gridKey = gridKey.split(',')
        var text = grids[gridKey]
        var textWidth = context.measureText(text).width
        // context.fillText(text, gridKey[0] * size + 0.5 + offset.x + size / 2 - textWidth / 2, gridKey[1] * size + 0.5 + offset.y + size / 2 + 5)
        context.fillText(text, gridKey[0] * xScale + offset.x - textWidth / 2, gridKey[1] * yScale + offset.y + 5)
      }
    }

    context.restore()
  }
}
