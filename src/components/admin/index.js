import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, RaisedButton} from 'material-ui/'
import './index.css'
import ItemsList from './list'
import UsersList from './users'
import * as GlobalFunctions from '../../utilities/functions'
import AddAction from 'material-ui/svg-icons/content/add'
import AddDialog from './create'

class Admin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: window.localStorage.getItem('userData') ? JSON.parse(window.localStorage.getItem('userData')).key : '',
      categoryList: [],
      venueList: [],
      userList: [],
      isOpen: false,
      type: '',
      key: '0',
      isAdmin: false,
      isSuper: false
    }
  }

  componentDidMount () {
    GlobalFunctions.fetchCategories(this)
    GlobalFunctions.fetchVenues(this)
    GlobalFunctions.fetchUsers(this)
    GlobalFunctions.isAdmin(this, this.state.userId)
    GlobalFunctions.isSuper(this, this.state.userId)
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  addCategoryAction = () => {
    this.setState({
      key: ((this.state.categoryList.length === 0 ? 0
                 : parseInt(this.state.categoryList[this.state.categoryList.length - 1].key, 10)) + 1).toString(),
      type: 'categories',
      isOpen: true
    })
  }

  addVenueAction = () => {
    this.setState({
      key: ((this.state.venueList.length === 0 ? 0
                 : parseInt(this.state.venueList[this.state.venueList.length - 1].key, 10)) + 1).toString(),
      type: 'venues',
      isOpen: true
    })
  }

  render () {
    return (
      <div>
        {this.state.isAdmin && <div className='admin-wrapper'>
          <Card className='card-left'>
            <CardHeader
              title='Categories'
              subtitle='Colors'
              actAsExpander
              showExpandableButton
          />
            <CardActions>
              <RaisedButton
                label='Add'
                primary
                icon={<AddAction />}
                onTouchTap={this.addCategoryAction}
              />
            </CardActions>
            <CardMedia expandable>
              <ItemsList
                itemsList={this.state.categoryList}
                type={'categories'}
            />
            </CardMedia>
          </Card>
          {this.state.isSuper && <Card className='card-left'>
            <CardHeader
              title='Users'
              subtitle='Select Admins'
              actAsExpander
              showExpandableButton
          />
            <CardMedia expandable>
              <UsersList
                userList={this.state.userList}
            />
            </CardMedia>
          </Card>}
          <AddDialog
            onRequestClose={this.handleClose}
            isOpen={this.state.isOpen}
            type={this.state.type}
            id={this.state.key}
            update={false}
          />
        </div>}
        {this.state.isAdmin && <div className='admin-wrapper'>
          <Card className='card-right'>
            <CardHeader
              title='Board Rooms'
              subtitle='Venues'
              actAsExpander
              showExpandableButton
          />
            <CardActions>
              <RaisedButton
                label='Add'
                primary
                icon={<AddAction />}
                onTouchTap={this.addVenueAction}
              />
            </CardActions>
            <CardMedia expandable>
              <ItemsList
                itemsList={this.state.venueList}
                type={'venues'}
              />
            </CardMedia>
          </Card>
        </div>}
      </div>
    )
  }
}

export default Admin
