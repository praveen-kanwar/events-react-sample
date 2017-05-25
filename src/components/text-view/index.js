import React from 'react'
import './index.css'

class TextView extends React.Component {
  render () {
    return (
      <div id='textview-content'>
        <img className='icon' src={this.props.iconLeft} alt='Icon' />
        <textview className={this.props.textSizeCss}>{this.props.text}</textview>
      </div>
    )
  }
}

TextView.propTypes = {
  text: React.PropTypes.string,
  textSizeCss: React.PropTypes.string,
  iconLeft: React.PropTypes.string
}

export default TextView
