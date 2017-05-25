import React, { Component } from 'react'

const styles = {
  container: {
    backgroundColor: '#f8f8f8',
    backgroundSize: 'cover',
    overflow: 'hidden',
    height: '100vh',
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },

  textView: {
    position: 'absolute',
    color: '#CACACA',
    fontSize: '54px',
    top: '30%'
  }
}

class CustomPlaceholder extends Component {
  render () {
    return (
      <div>
        {this.props.show
        ? <div style={styles.container}>
          <p style={styles.textView}>
            {this.props.message}
          </p>
        </div>
          : null}
      </div>
    )
  }
}

export default CustomPlaceholder
