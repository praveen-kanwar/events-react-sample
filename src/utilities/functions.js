import C from './constants'

/**
  Takes in venue Id as input parameter and returns venue name to be displayed
*/
var getVenue = function (venueId, context) {
  let ref = C.FIREBASE.app().database().ref('venues')
  ref.on('value', snapshot => {
    var obj = snapshot.val()
    var arr = Object.keys(obj).map(function (key) { return obj[key] })
    arr.forEach((object, index) => {
      if (object.key === venueId) {
        context.setState({
          venue: object.name
        })
      }
    })
  })
}

exports.getVenue = getVenue

var fetchVenues = function (context) {
  var venueList = []
  let ref = C.FIREBASE.app().database().ref('venues')
  ref.on('value', snapshot => {
    var obj = snapshot.val()
    if (obj) {
      var arr = Object.keys(obj).map(function (key) {
        obj[key].uuid = key
        return obj[key]
      })
      arr.forEach((object, index) => {
        venueList.push(object)
      })
      context.setState({
        venueList: venueList
      })
      venueList = []
    } else { // This is necessarry to force update the list once we delete the last child, because obj is null in that case
      context.setState({
        venueList: venueList
      })
    }
  })
}

exports.fetchVenues = fetchVenues

var fetchCategories = function (context) {
  var categoryList = []
  let ref = C.FIREBASE.app().database().ref('categories')
  ref.on('value', snapshot => {
    var obj = snapshot.val()
    if (obj) {
      var arr = Object.keys(obj).map(function (key) {
        obj[key].uuid = key
        return obj[key]
      })
      arr.forEach((object, index) => {
        categoryList.push(object)
      })
      context.setState({
        categoryList: categoryList
      })
      categoryList = []
    } else {
      context.setState({
        categoryList: categoryList
      })
    }
  })
}

exports.fetchCategories = fetchCategories

var getTextColor = function (backgroundColor) {
  let red = (backgroundColor.replace('#', '0x') & 0xFF0000) >> 16
  let green = (backgroundColor.replace('#', '0x') & 0x00FF00) >> 8
  let blue = backgroundColor.replace('#', '0x') & 0x0000FF
  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
    return '#000000'
  } else {
    return '#FFFFFF'
  }
}

exports.getTextColor = getTextColor

var fetchUserList = function (context, users) {
  var userList = []
  users.forEach((object, index) => {
    var ref = C.FIREBASE.database().ref('users').orderByChild('uid').equalTo(object.id)
    ref.once('value', function (snapshot) {
      var userObject = snapshot.val()
      userObject = {
        'displayName': userObject[object.id].displayName,
        'avatar': userObject[object.id].photoURL,
        'action': object.action
      }
      userList.push(userObject)
      context.setState({
        userList: userList
      })
    })
  })
}

exports.fetchUserList = fetchUserList

var fetchUsers = function (context) {
  var userList = []
  let ref = C.FIREBASE.app().database().ref('users')
  ref.on('value', snapshot => {
    var obj = snapshot.val()
    if (obj) {
      var arr = Object.keys(obj).map(function (key) {
        return obj[key]
      })
      arr.forEach((object, index) => {
        if (!object.isSuper) {
          userList.push(object)
        }
      })
      context.setState({
        userList: userList
      })
      userList = []
    } else {
      context.setState({
        userList: userList
      })
    }
  })
}

exports.fetchUsers = fetchUsers

var fetchEventList = function (context, stateName, userId, action) {
  var stateObj = {}
  var eventListRef = C.FIREBASE.database().ref('events').orderByChild('users/' + userId).equalTo(action)
  eventListRef.on('value', function (snapshot) {
    var obj = snapshot.val()
    if (obj) {
      var eventList = Object.keys(obj).map(function (key) {
        obj[key].id = key
        obj[key].isAdmin = key.isAdmin
        return obj[key]
      })
      stateObj[stateName] = eventList
    } else {
      stateObj[stateName] = []
    }
    context.setState(stateObj)
  })
}

exports.fetchEventList = fetchEventList

var isAdmin = function (context, userId) {
  var userRef = C.FIREBASE.database().ref('users').child(userId)
  userRef.on('value', function (snapshot) {
    var userObj = snapshot.val()
    if (userObj) {
      context.setState({
        isAdmin: userObj.isAdmin
      })
    }
  })
}

exports.isAdmin = isAdmin

var isSuper = function (context, userId) {
  var userRef = C.FIREBASE.database().ref('users').child(userId)
  userRef.on('value', function (snapshot) {
    var userObj = snapshot.val()
    if (userObj) {
      context.setState({
        isSuper: userObj.isSuper
      })
    }
  })
}

exports.isSuper = isSuper

var getWeekDays = function (context) {
  let weekDays = [
    {
      id: 0,
      day: 'Sunday',
      isChecked: false
    },
    {
      id: 1,
      day: 'Monday',
      isChecked: false
    }, {
      id: 2,
      day: 'Tuesday',
      isChecked: false
    }, {
      id: 3,
      day: 'Wednesday',
      isChecked: false
    }, {
      id: 4,
      day: 'Thursday',
      isChecked: false
    }, {
      id: 5,
      day: 'Friday',
      isChecked: false
    }, {
      id: 6,
      day: 'Saturday',
      isChecked: false
    }
  ]
  context.setState({
    weekDays: weekDays
  })
}
exports.getWeekDays = getWeekDays
