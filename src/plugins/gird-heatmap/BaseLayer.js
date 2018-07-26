import DataSet from '../../data/DataSet'
import Intensity from '../../utils/data-range/Intensity'
import Category from '../../utils/data-range/Category'
import Choropleth from '../../utils/data-range/Choropleth'
import drawGrid from '../../utils/grid'

class BaseLayer {
  constructor (map, dataSet, options) {
    if (!(dataSet instanceof DataSet)) {
      dataSet = new DataSet(dataSet)
    }

    this.dataSet = dataSet
    this.map = map
  }

  getDefaultContextConfig () {
    return {
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      imageSmoothingEnabled: true,
      strokeStyle: '#000000',
      fillStyle: '#000000',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: 'rgba(0, 0, 0, 0)',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      lineDashOffset: 0,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic'
    }
  }

  initDataRange () {
    this.intensity = new Intensity({
      maxSize: this.options.maxSize,
      minSize: this.options.minSize,
      gradient: this.options.gradient,
      max: this.options.max || this.dataSet.getMax('count')
    })
    this.category = new Category(this.options.splitList)
    this.choropleth = new Choropleth(this.options.splitList)
    if (this.options.splitList === undefined) {
      this.category.generateByDataSet(this.dataSet, this.options.color)
    }
    // 根据给定的颜色区间，获取对应数据所在的颜色区间
    if (this.options.splitList === undefined) {
      const min = this.options.min || this.dataSet.getMin('count')
      const max = this.options.max || this.dataSet.getMax('count')
      this.choropleth.generateByMinMax(min, max)
    }
  }

  drawContext (context, dataSet, options, offset) {
    this.options.offset = {
      x: offset.x,
      y: offset.y
    }

    drawGrid.draw(context, dataSet, this.options)
  }

  clickEvent (pixel, e) {
    if (!this.options.methods) {
      return
    }
    var dataItem = this.isPointInPath(this.getContext(), pixel)

    if (dataItem) {
      this.options.methods.click(dataItem, e)
    } else {
      this.options.methods.click(null, e)
    }
  }

  mousemoveEvent (pixel, e) {
    if (!this.options.methods) {
      return
    }
    var dataItem = this.isPointInPath(this.getContext(), pixel)
    if (dataItem) {
      this.options.methods.mousemove(dataItem, e)
    } else {
      this.options.methods.mousemove(null, e)
    }
  }

  /**
   * obj.options
   */
  update (obj, isDraw) {
    const _options = obj.options
    const options = this.options
    for (let i in _options) {
      options[i] = _options[i]
    }

    this.init(options)
    if (isDraw !== false) {
      this.draw()
    }
  }

  setOptions (options) {
    this.dataSet.reset()
    this.init(options)
    this.draw()
  }

  set (obj) {
    var ctx = this.getContext()
    const conf = this.getDefaultContextConfig()
    for (let i in conf) {
      ctx[i] = conf[i]
    }
    this.init(obj.options)
    this.draw()
  }

  destroy () {
    this.unbindEvent()
    this.hide()
  }
}

export default BaseLayer
