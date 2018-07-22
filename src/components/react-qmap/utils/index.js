/* global qq */
const getAddressByPosition = ({ lat, lng }) => {
  return getAddressByLatLng(pointToLatLng({ lat, lng }))
}

const getAddressByLatLng = latLng => {
  return new Promise(resolve => {
    const geocoder = new qq.maps.Geocoder({
      complete: result => resolve(result)
    })

    geocoder.getAddress(latLng)
  })
}

const convertorPointsToPath = points => {
  return points.map(position => {
    return pointToLatLng(position)
  })
}

const pointToLatLng = ({ lat, lng }) => {
  return new qq.maps.LatLng(lat, lng)
}

// 简单的首字母大写
const toPascal = str => {
  if (!str || str.length === 0) return ''
  return `${str[0].toUpperCase()}${str.substr(1)}`
}

// 计算直线是否相交
const crossMul = (v1, v2) => (v1.x * v2.y - v1.y * v2.x)
const isCrossingLine = ([p1, p2], [p3, p4]) => {
  let v1 = { x: p1.x - p3.x, y: p1.y - p3.y }
  let v2 = { x: p2.x - p3.x, y: p2.y - p3.y }
  let v3 = { x: p4.x - p3.x, y: p4.y - p3.y }
  let v = crossMul(v1, v3) * crossMul(v2, v3)
  v1 = { x: p3.x - p1.x, y: p3.y - p1.y }
  v2 = { x: p4.x - p1.x, y: p4.y - p1.y }
  v3 = { x: p2.x - p1.x, y: p2.y - p1.y }
  return !!((v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0))
}

// 是否是无交叉多边形
const hasNoneCrossingLinePolygonal = (points) => {
  const lines = getPointsLines(points)
  return !lines.some((line, i) => {
    const targetLines = lines.filter((_, ti) => Math.abs(ti - i) >= 2 && Math.abs(ti - i) < lines.length - 1)
    return targetLines.some(targetLine => isCrossingLine(line, targetLine))
  })
}

// 获取点阵组成的线
const getPointsLines = (points) => {
  let lines = []
  if (points && points.length) {
    points.forEach((p, i) => {
      lines.push([p, points[(i + 1 === points.length) ? 0 : i + 1]])
    })
  }
  return lines
}

// 判断两个多边形是否相交
const isCrossingPolygonal = ([points1, points2]) => {
  const lineList1 = getPointsLines(points1)
  const lineList2 = getPointsLines(points2)
  return lineList1.some(l1 => lineList2.some(l2 => isCrossingLine(l1, l2)))
}
// 判断一组多边形是否有交叉，如果有交叉，返回交叉的index
const getCrossingPolygonal = (list) => {
  const groupList = []
  let crossingList = []
  if (list && Array.isArray(list) && list.length > 1) {
    for (let i = 0, len = list.length; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        groupList.push({
          index: [i, j],
          polygonal: [list[i], list[j]]
        })
      }
    }
    groupList.forEach(({ polygonal, index }) => {
      if (isCrossingPolygonal(polygonal)) {
        crossingList.push(index)
      }
    })
  }
  return crossingList
}

// getPolygonAreaCenter 计算多边形质心
function Area (p0, p1, p2) {
  let area = 0.0
  area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y
  return area / 2
}

const getPolygonAreaCenter = (points) => {
  let sumX = 0
  let sumY = 0
  let sumArea = 0
  let p1 = points[1]
  let p2, area
  for (let i = 2; i < points.length; i++) {
    p2 = points[i]
    area = Area(points[0], p1, p2)
    sumArea += area
    sumX += (points[0].x + p1.x + p2.x) * area
    sumY += (points[0].y + p1.y + p2.y) * area
    p1 = p2
  }
  let x = sumX / sumArea / 3
  let y = sumY / sumArea / 3
  return { x, y }
}

export {
  getAddressByLatLng,
  convertorPointsToPath,
  getAddressByPosition,
  pointToLatLng,
  toPascal,
  hasNoneCrossingLinePolygonal,
  getCrossingPolygonal,
  isCrossingPolygonal,
  getPolygonAreaCenter
}
