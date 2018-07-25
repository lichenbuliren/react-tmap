/* global qq */
import React from 'react'

export default class BaseComponent extends React.Component {
  /**
   * 给某个对象绑定对应需要的事件
   * @param {element} obj 事件对象
   * @param {array} events 事件数组
   */
  bindEvent = (obj, events) => {
    const self = this
    if (events.length) {
      events.forEach(event => {
        if (Object.prototype.toString.call(event) === '[object Array]' && event[1]) {
          // 绑定一次事件
          const eventName = event[0]
          qq.maps.event.addListenerOnce(obj, eventName, mouseEvent => {
            self.props.events && self.props.events[eventName] && self.props.events[eventName].call(self, obj, mouseEvent)
          })
        } else {
          qq.maps.event.addListener(obj, event, mouseEvent => {
            self.props.events && self.props.events[event] && self.props.events[event].call(self, obj, mouseEvent)
          })
        }
      })
    }
  }

  /**
   * 给某个对象绑定需要切换的属性对应的方法
   * @param {element} obj 事件对象
   * @param {object} toggleMethods 属性和对应的2个切换方法
   */
  bindToggleMeghods = (obj, toggleMethods) => {
    for (let key in toggleMethods) {
      if (this.props[key] !== undefined) {
        if (this.props[key]) {
          obj[toggleMethods[key][0]]()
        } else {
          obj[toggleMethods[key][1]]()
        }
      }
    }
  }

  /**
   * 返回组件支持的属性对象
   * @param {array} opts 组件各自支持的属性对象集合
   */
  getOptions = (opts) => {
    let result = {}
    opts.forEach(key => {
      if (this.props[key] !== undefined) {
        result[key] = this.props[key]
      }
    })
    return result
  }

  render () {
    return null
  }
}
