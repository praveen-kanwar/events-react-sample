import React, { Component } from 'react'
import {
  Dialog,
  DatePicker,
  MenuItem,
  SelectField,
  Checkbox,
  FlatButton
} from 'material-ui'
import ObjectSelector from '../object-selector/'
import * as GlobalFunctions from '../../utilities/functions'

const styles = {
  header: {
    top: 10,
    float: 'center',
    height: '230px',
    justifyContent: 'center',
    display: 'flex'
  },
  container: {
    width: '100%',
    justifyContent: 'center'
  },
  label: {
    width: '30%',
    justifyContent: 'center',
    display: 'inline-block',
    float: 'left'
  },
  options: {
    width: '70%',
    display: 'inline-block',
    float: 'left'
  },
  checkbox: {
    marginBottom: 16,
    width: '25%',
    justifyContent: 'center',
    display: 'inline-block',
    float: 'left'
  }
}

var items = []
let DatesOk = true
const mandatoryMessage = 'Mandatory field!'

class ReoccurringOptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      frequency: '',
      frequencyError: '',
      frequencyId: 'days',
      repeatInterval: 1,
      weekDays: [],
      endDate: props.minEndDate || new Date(),
      reoccurringEndDateError: ''
    }
  }

  handleClose = () => {
    this.props.onRequestClose()
  }

  handleCheck = (value) => {
    var weekdays = this.state.weekDays
    for (var i = 0; i < weekdays.length; i++) {
      if (weekdays[i].id === value) {
        weekdays[i].isChecked = !weekdays[i].isChecked
      }
    }
  }

  saveReoccuringDetail = () => {
    if (this.checkFields() && DatesOk) {
      this.props.saveReoccuringDetail(this.state)
    }
  }

  componentWillMount () {
    GlobalFunctions.getWeekDays(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      isOpen: nextProps.isOpen,
      endDate: nextProps.minEndDate
    })
  }

  frequencyChange = (event, frequencyKey, value, color) => {
    this.setState({
      frequency: value,
      frequencyId: frequencyKey
    })

    var itemType = 0
    switch (value) {
      case 'Daily':
        itemType = 'Day'
        break
      case 'Weekly':
        itemType = 'Week'
        break
      case 'Monthly':
        itemType = 'Month'
        break
      case 'Yearly':
        itemType = 'Year'
        break
      default:
    }
    items = []
    items.push(<MenuItem value={1} key={1} primaryText={`${1} ${itemType}`} />)
    for (let i = 2; i <= 30; i++) {
      items.push(<MenuItem value={i} key={i} primaryText={`${i} ${itemType}s`} />)
    }
  }

  getActionButton = () => {
    return [
      <FlatButton
        label='Cancel'
        primary={false}
        keyboardFocused={false}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Done'
        primary
        keyboardFocused={false}
        onTouchTap={this.saveReoccuringDetail}
      />
    ]
  }

  endDateChange = (event, date) => {
    if (date >= this.props.minEndDate) {
      DatesOk = true
      this.setState({
        endDate: date,
        reoccurringEndDateError: ''
      })
    } else {
      DatesOk = false
      this.setState({
        reoccurringEndDateError: 'Want to finish it before it started!'
      })
    }
  }

  handleRepeatIntervalChange = (event, index, repeatInterval) => {
    this.setState({repeatInterval})
  };

  checkFields () {
    let allFieldsOK = true
    if (this.state.frequency.trim().length < 1) {
      this.setState({
        frequencyError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        frequencyError: ''
      })
    }
    return allFieldsOK
  }

  render () {
    const { isOpen } = this.state
    let title = 'Reoccuring details'

    return (
      <div>
        <Dialog
          autoScrollBodyContent
          title={title}
          modal={false}
          open={isOpen}
          actions={this.getActionButton()}
          onRequestClose={this.handleClose}>
          <ObjectSelector
            floatingLabelText={'Repeats'}
            objectType={'frequency'}
            errorText={this.state.frequencyError}
            objectValue={this.state.frequency}
            onChange={this.frequencyChange} />
          { this.state.frequency
            ? <div>
              <div style={styles.container}>
                <p style={styles.label}>Repeats every: </p>
                <SelectField
                  style={styles.options}
                  value={this.state.repeatInterval}
                  onChange={this.handleRepeatIntervalChange}
                  maxHeight={200}>
                  {items}
                </SelectField>
              </div>
              { this.state.frequency === 'Weekly'
                ? <div>
                  <p style={styles.label}>Repeats on: </p>
                  <div style={styles.container}>
                    {this.state.weekDays.map(checkbox =>
                      <Checkbox
                        key={checkbox.id}
                        label={checkbox.day}
                        onCheck={() => this.handleCheck(checkbox.id)}
                      />)
                    }
                  </div>
                </div>
                : null
              }
            </div>
            : null
            }

          <DatePicker
            floatingLabelText='End Date'
            hintText='Date Picker'
            fullWidth
            autoOk
            errorText={this.state.reoccurringEndDateError}
            value={this.state.endDate}
            onChange={this.endDateChange} />
        </Dialog>
      </div>
    )
  }
}

ReoccurringOptions.propTypes = {
  onRequestClose: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired
}

export default ReoccurringOptions
