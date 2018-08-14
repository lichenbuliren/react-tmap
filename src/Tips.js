import React from 'react'
import { merge } from 'lodash'

export default class Tips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      style: {
        position: 'absoulte',
        border: '1px solid #ccc',
        borderRadius: '2px'
      }
    }
  }

  static defaultProps = {
    show: false,
    showCloseIcon: false,
    onClose: () => {},
    onDestroy: () => {},
    styles: {},
    position: {
      x: 0,
      y: 0
    }
  }

  componentWillUnmount () {
    const { onDestroy } = this.props
    if (onDestroy) {
      onDestroy()
    } else {
      this.tipNode.parentNode.removeChild(this.tipNode)
    }

    this.tipNode = null
  }

  handleClose = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  render () {
    const { show, showCloseIcon, className, children, style, position } = this.props
    const { style: defaultStyle } = this.state
    let _style = merge(defaultStyle, style)
    if (!show) _style.display = 'none'
    _style.left = `${position.x}px`
    _style.right = `${position.y}px`

    return (
      <div className={`tmap-tips ${className}`} style={_style} ref={node => { this.tipNode = node }}>
        {children}
        <i
          className='tmap-tips-close-icon'
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            width: '20px',
            height: '20px',
            fontSize: '14px',
            transform: 'rotate(45deg)',
            display: showCloseIcon ? '' : 'none'
          }}
          onClick={this.handleClose}
        >+
        </i>
      </div>
    )
  }
}
