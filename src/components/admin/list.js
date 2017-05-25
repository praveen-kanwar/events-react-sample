import React, { Component } from 'react'
import {
  List
} from 'material-ui'
import Item from './item'

class ItemsList extends Component {
  render () {
    return (
      <List>
        {this.props.itemsList.map((item, i) => {
          return (
            <Item
              key={item.key}
              type={this.props.type}
              item={item}
            />
          )
        })}
      </List>
    )
  }
}

export default ItemsList
