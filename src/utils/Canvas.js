export default class Canvas {
  constructor (width, height) {
    var canvas = document.createElement('canvas')
    if (width) {
      canvas.width = width
    }

    if (height) {
      canvas.height = height
    }

    return canvas
  }
}
