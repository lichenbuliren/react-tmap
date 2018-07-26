/* eslint-disable */
import { gradient as defaultGradient } from '../../config'
/**
 * @author kyle / http://nikai.us/
 */

/**
 * Choropleth
 * @param {Object} splitList:
 *       [
 *           {
 *               start: 0,
 *               end: 2,
 *               value: randomColor()
 *           },{
 *               start: 2,
 *               end: 4,
 *               value: randomColor()
 *           },{
 *               start: 4,
 *               value: randomColor()
 *           }
 *       ]
 *
 */
function Choropleth (splitList) {
  this.splitList = splitList || [{
    start: 0,
    value: 'red'
  }]
}

Choropleth.prototype.get = function (count) {
  var splitList = this.splitList

  var value = false

  for (var i = 0; i < splitList.length; i++) {
    if (
      (splitList[i].start === undefined || (splitList[i].start !== undefined && count >= splitList[i].start)) &&
      (splitList[i].end === undefined || (splitList[i].end !== undefined && count < splitList[i].end))) {
      value = splitList[i].value
      break
    }
  }

  return value
}

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByDataSet = function (dataSet, gradient) {
  var min = dataSet.getMin('count')
  var max = dataSet.getMax('count')

  this.generateByMinMax(min, max, gradient)
}

/**
 * 根据渐变规则
 * 自动生成对应的 splitList
 */
Choropleth.prototype.generateByMinMax = function (min, max, gradient) {
  var colors = gradient || defaultGradient
  var splitNum = Number(Math.ceil((max - min) / colors.length))
  max = Number(max)
  var index = Number(min)
  this.splitList = []
  var count = 0

  while (index < max) {
    this.splitList.push({
      start: index,
      end: index + splitNum,
      value: colors[count]
    })
    count++
    index += splitNum
  }
}

Choropleth.prototype.getLegend = function (options) {
  return this.splitList
}

export default Choropleth
