import React from 'react'
import PropTypes from 'prop-types'
import Marker from './Marker'
import { ANIMATION_DROP } from './constants'

export default class MarkerList extends React.Component {
  static defaultProps = {
    data: [],
    animation: ANIMATION_DROP,
    showDecoration: true
  }

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
      })
    )
  }

  render () {
    const { data, showDecoration, ...rest } = this.props
    return data.map((item, i) => {
      const options = {...rest}
      options.position = item
      if (showDecoration) {
        options.decoration = item.decoration ? item.decoration : (i + 1)
      }
      return <Marker key={i} {...options} />
    })
  }
}
