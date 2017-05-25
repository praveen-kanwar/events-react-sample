import React from 'react'
import {
  SelectField,
  MenuItem
} from 'material-ui'
import C from '../../utilities/constants'

class ObjectSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      objects: []
    }
  }

  componentWillMount () {
    this.fetchObjects()
  }

  handleObjectChange = (e, objectIndex) => {
    this.props.onChange(e, this.state.objects[objectIndex].key, this.state.objects[objectIndex].name, this.state.objects[objectIndex].color)
  }

  fetchObjects = () => {
    let ref = C.FIREBASE.app().database().ref(this.props.objectType)
    ref.on('value', snapshot => {
      var newObjects = []
      var obj = snapshot.val()
      var arr = Object.keys(obj).map(function (key) { return obj[key] })
      arr.forEach((object, index) => {
        const myObject = {
          'key': object.key,
          'name': object.name,
          'color': object.color
        }
        newObjects = Object.freeze(newObjects.concat(myObject))
      })
      this.setState({
        objects: newObjects
      })
    })
  }
  render () {
    return (
      <div>
        <SelectField
          value={this.props.objectValue}
          floatingLabelText={this.props.floatingLabelText}
          onChange={this.handleObjectChange}
          fullWidth
          errorText={this.props.errorText}>
          {this.state.objects.map(option => {
            return (
              <MenuItem
                key={option.key}
                value={option.name}
                primaryText={option.name}
                rightIcon={option.color ? <b style={{color: option.color, fontSize: 40}}>■</b> : null}
              />
            )
          })}
        </SelectField>
      </div>
    )
  }
}

ObjectSelector.propTypes = {
  objectValue: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  objectType: React.PropTypes.string.isRequired,
  floatingLabelText: React.PropTypes.string.isRequired,
  errorText: React.PropTypes.string
}

export default ObjectSelector
