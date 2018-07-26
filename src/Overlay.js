import React from 'react'

export default class Overlay extends React.Component {
  constructor (props) {
    super(props)
    this.container = null
    this.map = null
  }

  draw () {
    console.log('overlay draw')
  }

  destory () {
    if (Object.prototype.toString.call(this.map) === '[object Null]' && this.container) {
      this.destory()
    }
    this.container.parentNode.removeChild(this.container)
    this.container = null
  }

  getMap () {
    return this.map
  }

  getPanes () {
    return this.map.getPanes()
  }

  getProjection () {
    return this.map.getProjection()
  }

  setMap (map) {
    this.map = map
    if (Object.prototype.toString.call(map) === '[object Null]' && this.container) {
      this.destory()
    }
  }

  componentWillUnmount () {
    this.destory()
  }
}
