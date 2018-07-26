import Intensity from './data-range/Intensity'
import DataSet from '../data/DataSet'

export default {
  draw: function (context, dataSet, options) {
    context.save()
    const grids = {}
    const data = dataSet instanceof DataSet ? dataSet.get() : dataSet
    const size = options._size || options.size || 50
    const choropleth = options.choropleth
    const _width = options._width
    const _height = options._height
    // 如果有配置 width,height 项，则优先取 width,height
    const xScale = _width || size
    const yScale = _height || size

    const offset = options.offset || {
      x: 0,
      y: 0
    }

    for (let i = 0; i < data.length; i++) {
      const coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates
      let coordX = (coordinates[0] - offset.x) / xScale
      let coordY = (coordinates[1] - offset.y) / yScale
      coordX = parseFloat(coordX.toFixed(4))
      coordY = parseFloat(coordY.toFixed(4))
      const gridKey = coordX + ',' + coordY
      if (!grids[gridKey]) {
        grids[gridKey] = 0
      }
      grids[gridKey] += ~~(data[i].count || 1)
    }

    const intensity = new Intensity({
      max: options.max || 100,
      gradient: options.gradient
    })

    for (let gridKey in grids) {
      gridKey = gridKey.split(',')
      context.beginPath()
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
        const text = grids[gridKey]
        const { value: { color } } = intensity.getTextColor(choropleth.getLegend(), grids[gridKey])
        // 根据当前 count 值所在区间，获取对应的 text color 值
        if (Object.prototype.toString.call(color) === '[object Array]' && color.length === 2) {
          context.fillStyle = color[1]
        }
        var textWidth = context.measureText(text).width
        context.fillText(text, gridKey[0] * xScale + offset.x - textWidth / 2, gridKey[1] * yScale + offset.y + 5)
      }
    }

    context.restore()
  }
}
