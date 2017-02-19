myApp.controller( 'HomeController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal){
  console.log( 'in HomeController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('HC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('HC. Admin:', $scope.isAdmin);

  var username = authFactory.username;
  console.log('Username-->', username);

  //display the day view table as default
  $scope.dayViewDisplay = true;

  //create blank simple items array for week view
  $scope.weekViewItemsArray = [];

  $scope.allItems = [];

  $scope.freePeriods = [
    { name: 'BS', reserved: false, class: 'enabled' },
    { name: 'One', reserved: false, class: 'enabled' },
    { name: 'Two', reserved: false, class: 'enabled' },
    { name: 'Three', reserved: false, class: 'enabled' },
    { name: 'Four', reserved: false, class: 'enabled' },
    { name: 'Five', reserved: false, class: 'enabled' },
    { name: 'Six', reserved: false, class: 'enabled' },
    { name: 'Seven', reserved: false, class: 'enabled' },
    { name: 'AS', reserved: false, class: 'enabled' },
  ]; // end periodsArray

  var addReservationsToAllItems = function(reservationArray) {
    console.log('in addReservationsToAllItems');
    //For each reservation in reservationArray...
    reservationArray.map(function(reservationObject) {
      // loop through each item in allItems array
      for (var i = 0; i < $scope.allItems.length; i++) {
        // if reservationObject.item matches the current reservationArray.newItem property
        if (reservationObject.item === $scope.allItems[i].newItem) {
          //save the username for reservation in teacher variable
          var teacher = reservationObject.user;
          //save reservation data in data variable
          var data;
          if (reservationObject.roomNumber) {
            data = { value: reservationObject.roomNumber, display: 'Room #'};
          } else {
            data = { value: reservationObject.numberOfStudents, display: '# of Students: '};
          } // end else
          //split the periods property into an array
          var newPeriodsReserved = reservationObject.period.split(',');
          //save existing periods reserved as a variable to pass to formatPeriodsReservedArray
          var existingPeriodsReserved = $scope.allItems[i].period;
          //Format the periodsReserved array to be an array of objects...
          var periodsReserved = formatPeriodsReservedArray(newPeriodsReserved, existingPeriodsReserved, teacher, data);
          //add period array value as a property of allItems[i] object
          $scope.allItems[i].period = periodsReserved;
        } // end if
      } // end for
    }); // end .map
  }; // end addReservationsToAllItems

  var calculateThisWeeksDates = function() {
    //Calculate the start and end dates of this week
    console.log('in getThisWeeksDates');



    var todayNum = moment().day();
    var weekStart;
    var weekEnd;
    if (todayNum > 5) {
      //view next week if today is a weekend
      weekStart = moment().add(1, 'weeks').startOf('week').add(1, 'days').format('YYYY-MM-DD');
      weekEnd = moment().add(1, 'weeks').endOf('week').format('YYYY-MM-DD');
    } else {
      //Monday of this week
      weekStart = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
      //Friday of this week
      weekEnd = moment().endOf('week').subtract(1, 'days').format('YYYY-MM-DD');
    } // end else
    //construct object to return
    var startEndDates = {
      weekStart: weekStart,
      weekEnd: weekEnd
    }; // end startEndDates
    return startEndDates;
  }; // end getThisWeeksDates

  var convertDayToIndex = function(date) {
    //convert date to index number [monday=0, etc.]
    var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    date = moment(date.split('T')[0]).format('dddd');
    index = weekdays.indexOf(date);
    return index;
  }; // end convertDayToIndex

  var disabled = function(data) {
    // Disable weekend selection on daypicker
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  $scope.displayDayView = function() {
    console.log('in displayDayView');
    $scope.dayViewDisplay = true;
  }; // end displayDayView

  $scope.displayWeekView = function() {
    console.log('in display week view');
    $scope.dayViewDisplay = false;
    //calculate the start and end dates of this week
    var startEndDates = calculateThisWeeksDates();
    //get all reservations for the current week
    getAllWeeksReservations(startEndDates);
    //get all days of this week, scope them for thead repeat
    $scope.thisWeeksDates = enumerateDaysBetweenDates(startEndDates.weekStart);
  }; // end displayWeekView

  var enumerateDaysBetweenDates = function(startDate) {
    //make an array of the dates this week, startDate is Monday
    var dates = [];
    //push Monday in
    dates.push(moment(startDate).format('dddd MM/DD'));
    var rangeArray = [1, 2, 3, 4];
    //push Tuesday-Friday in
    for (var i = 0; i < rangeArray.length; i++) {
      dates.push(moment(startDate).add(rangeArray[i], 'days').format('dddd MM/DD'));
    } // end for
    return dates;
  }; // end enumerateDaysBetweenDates

  var getAllWeeksReservations = function(startEndDates) {
    //construct url
    var urlParamString = startEndDates.weekStart + '/' + startEndDates.weekEnd;
    $http({
      method: 'GET',
      url: '/private/reservations/range/' + urlParamString
    }).then(function(response) {
      console.log('getAllWeeksReservations response-->', response.data.results);
      //add date object to each item object in $scope.weekViewItemsArray
      addDefaultObjectsToWeekViewItemsArray();
      //populate $scope.weekViewItemsArray with reservations
      addReservationsToWeekViewItems(response.data.results);
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getAllWeeksReservations

  var addReservationsToWeekViewItems = function(reservationArray) {
    console.log('in addReservationsToWeekViewItems');
    //For each reservation...
    reservationArray.map(function(reservation) {
      //convert date to index number [monday=0, etc.]
      var dayIndex = convertDayToIndex(reservation.dateScheduled);
      //save item name as variable
      var itemName = reservation.item;
      //compare against each item name in weekViewItemsArray
      for (var i = 0; i < $scope.weekViewItemsArray.length; i++) {
        //store current item as variable
        var thisItem = $scope.weekViewItemsArray[i];
        //if the reservation item name matches the item name of this current object
        if (thisItem.itemName === reservation.item) {
          //split periods into array for this reservation
          var periodsArray = reservation.period.split(',');
          //match the day index and go into that object
          var thisDatesAvailability = thisItem.reservationsByDate[dayIndex];
          //For each time period for this day
            for (var y = 0; y < thisDatesAvailability.length; y++) {
              //If the periodsArray containts this time period,
              if (periodsArray.indexOf(thisDatesAvailability[y].name) > -1) {
                //Mark reserved as true
                thisDatesAvailability[y].reserved = true;
                //add teacher name to object
                thisDatesAvailability[y].teacher = reservation.user;
                //and meta data to this reservation object
                //If the reservation has number of students, attach that data
                if (reservation.numberOfStudents) {
                  thisDatesAvailability[y].meta =
                        { title : '# Students:',
                        data : reservation.numberOfStudents };
                //If reservation has room num, attach that data
                } else if (reservation.roomNumber) {
                  thisDatesAvailability[y].meta =
                        { title : 'Room #:',
                        data : reservation.roomNumber };
                } // end else if
              } // end if
            } // end for
        } // end if
      } // end for
    }); // end map
  }; // end addReservationsToWeekViewItems

  var addDefaultObjectsToWeekViewItemsArray = function() {
    console.log('in addDefaultObjectsToWeekViewItemsArray');
    //add date object to each item object in $scope.weekViewItemsArray
    $scope.weekViewItemsArray.map(function(x) {
      //set periodsArrayDefaults array
      function PeriodsArrayDefaults() {
        return [ {name: 'BS', display: 'BS', reserved : false},
                                     {name: 'One', display: '1', reserved : false},
                                     {name: 'Two', display: '2', reserved : false},
                                     {name: 'Three', display: '3', reserved : false},
                                     {name: 'Four', display: '4', reserved : false},
                                     {name: 'Five', display: '5', reserved : false},
                                     {name: 'Six', display: '6', reserved : false},
                                     {name: 'Seven', display: '7', reserved : false},
                                     {name: 'AS', display: 'AS', reserved : false}
                                   ];
      } // end function

      //create reservationsByDate property with values for each item
      x.reservationsByDate = [
        new PeriodsArrayDefaults(), //Monday
        new PeriodsArrayDefaults(), //Tuesday
        new PeriodsArrayDefaults(), //Wednesday
        new PeriodsArrayDefaults(), //Thursday
        new PeriodsArrayDefaults() //Friday
      ]; // end reservationsByDate property object
    }); // end map
  }; // end addDefaultObjectsToWeekViewItemsArray

  var formatPeriodsReservedArray = function(periodsArray, existingPeriodsReservedArray, teacherName, data) {
    //combine with existing periods reserved
    var newPeriodsArray = existingPeriodsReservedArray;
    //Map all values in periodsArray
    periodsArray.map(function(value) {
      //If the value matches the name of a period in newPeriods array,
      for (var i = 0; i < newPeriodsArray.length; i++) {
        if (value === newPeriodsArray[i].name) {
          //change the reserved value to true
          newPeriodsArray[i].reserved = true;
          //change the class value to disabled
          newPeriodsArray[i].class = 'disabled';
          //set the user name for the reservation
          newPeriodsArray[i].teacher = teacherName;
          //set data value for reservation
          newPeriodsArray[i].data = data;
        } // end if
      } // end for
    }); // end map
    //Return the newPeriodsArray
    return newPeriodsArray;
  }; // end formatPeriodsReservedArray

  var getAllItems = function() {
    $http({
      method: 'GET',
      url: '/private/items'
    }).then(function(response) {
      //scope all items as allItems for table repeat
      $scope.allItems = response.data.results;
      //create weekViewItems array
      $scope.weekViewItemsArray = populateWeekViewItemsArray(response.data.results);
      //Get all reservations for today
      $scope.getReservationsByDate($scope.today());
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getAllItems

  var populateWeekViewItemsArray = function(array) {
    console.log('in populateWeekViewItemsArray');
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      //push the item name in to the array as an object
      newArray.push({itemName: array[i].newItem});
    } // end for
    return newArray;
  }; // end createWeekViewItemsArray

  $scope.getReservationsByDate = function(date) {
    console.log('in getReservationsByDate');
    $scope.currentDate = date;
    //reset period property of all items to default
    resetPeriodsProperties($scope.allItems);
    //convert date string to correct timezone using moment.js
    date = moment(date).format('YYYY-MM-DD');
    //Get all reservations for selected date
    $http({
      method: 'GET',
      url: 'private/reservations/date/' + date,
    }).then(function(response) {
      console.log('getReservationsByDate response-->',response.data);
      var reservationArray = response.data.results;
      //consolidate allItems with this
      addReservationsToAllItems(reservationArray);
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getAll

  var init = function() {
    console.log('in init');

    getAllItems();

    //Initialize datepicker default to today
    $scope.today();
    //Initialize datepicker popup to closed
    $scope.popup = {
      opened: false
    }; // end popup

    //Set datepicker options
    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 0,
      showWeeks: false
    }; // end dateOptions

    //Require user to add their name within the modal
    //Run only after the entire view has been loaded
    angular.element(document).ready(function() {
      //If the username is blank, open modal
      if (username.length < 1) {
        openUsernameModal('md');
      } // end if
    }); // end doc ready function

  }; // end init

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  //open username modal (returns a modal instance)
  openUsernameModal = function (size) {
    //open the modal
    console.log('Open Username Modal');
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: 'updateUsernameModal.html',
      controller: 'UpdateUsernameModalController',
      size: size
    }); // end modalInstance
  }; // end openUsernameModal

  $scope.printView = function() {
    window.print();
  }; // end printView

  var resetPeriodsProperties = function(array) {
    //TODO: fix this undefined value
    console.log('in clearPeriodsProperty');
    for (var i = 0; i < array.length; i++) {
      array[i].period = [
        { name: 'BS', reserved: false, class: 'enabled' },
        { name: 'One', reserved: false, class: 'enabled' },
        { name: 'Two', reserved: false, class: 'enabled' },
        { name: 'Three', reserved: false, class: 'enabled' },
        { name: 'Four', reserved: false, class: 'enabled' },
        { name: 'Five', reserved: false, class: 'enabled' },
        { name: 'Six', reserved: false, class: 'enabled' },
        { name: 'Seven', reserved: false, class: 'enabled' },
        { name: 'AS', reserved: false, class: 'enabled' },
      ]; // end periodsArray
    } // end for
  }; //end resetPeriodsProperties

  $scope.today = function() {
    //Sets the default date picker date.
    //Sets it to monday if the current day is a weekend
    var dayOfWeekToday = moment().isoWeekday();
    var datePickDefault;
    if (dayOfWeekToday > 5) {
      //set the default to the next monday
      var num = 8 - dayOfWeekToday;
      datePickDefault = moment().add(num, 'days');
    } else {
      //set the default to the current day
      datePickDefault = moment();
    } // end else
    $scope.date = datePickDefault._d;
    return datePickDefault._d;
  }; // end today

  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } else {
    //If they are logged in, initialize the view
    init();
  } // end else

  $scope.makePDF = function (item) {
    //rows and columns are used to make PDF
    var rows = [];
    var columns = [];

    console.log('current date', $scope.currentDate);

    //Date and Item for header of PDF
    var date = $scope.currentDate;
    var newItem =  moment(date).format('dddd MMMM DD, YYYY') + '\n' + item.newItem;
    columns.push(newItem);
    var oneRow = [];
    var oneRowName = [];

      //iterate through each period to check if reserved
      item.period.forEach(function(period){
        var name;
        var nameArray;
        if (period.class === 'disabled'){
          var teacher = period.teacher;
          teacher += "\n";
          name = period.name;
          var display = period.data.display;
          display = display.replace(/#/g, "Number");
          console.log('display ->', display);
          nameArray = [name];
          var newData = [teacher, display, period.data.value];
          newData = newData.toString();
          console.log('new Data', newData);
          newData = newData.replace(/,/g, " ");
          oneRowName.push(nameArray);
          oneRow.push(newData);
        } else {
          name = period.name;
          var open = ['Available'];
          nameArray = [name];
          var newDataTwo = [open];
          newDataTwo = newDataTwo.toString();
          newDataTwo = newDataTwo.replace(/,/g, " ");
          oneRowName.push(nameArray);
          oneRow.push(newDataTwo);
        } // end else
        rows.push(oneRowName);
        rows.push(oneRow);

      oneRow = [];
      oneRowName = [];

  }); // end makePDF

  //PDF is created
  var doc = new jsPDF('p', 'pt');
  doc.setFont("courier");
  //styling of PDF
  doc.setFontSize(14);
    doc.autoTable(columns, rows, {
    styles: {
      fontSize: 18,
      font: "arial",
      halign: "center",
      lineWidth: 2
    },
    columnStyles: {
    },
    margin: {top: 60, left: 150, right: 150},
    addPageContent: function(data) {},
      createdCell: function (cell, data) {
        if (cell.raw === "One") {
           cell.styles.fillColor = [0,200,0];
        }
      }, // end createdCell
      drawCell: function(cell, data) {
        if (data.row.index % 2 === 0) {
            doc.setFillColor(169, 169, 169);
            doc.setFontStyle('bold');
            doc.setFontSize(24);
        } // end if
      } // end drawCell
    }); // end addPageContent

    //file name of created PDF
    newItem = newItem.replace("(", "");
    newItem = newItem.replace(")", "");
    newItem = newItem.replace(/ /g,'');
    newItem = newItem.toLowerCase();
    doc.save(newItem + '.pdf');

  }; //end doc styling

}]); // end HomeController

//UpdateUsernameModalController
myApp.controller('UpdateUsernameModalController', ['$scope', '$http', '$uibModalInstance', 'AuthFactory',
function ($scope, $http, $uibModalInstance, AuthFactory) {
    console.log('in UpdateUsernameModalController');

    //Declare auth factory
    var authFactory = AuthFactory;
    //Get current user's ID
    var currentUserId = authFactory.currentUserId;

    //close the modal
    var close = function() {
      //Close the modal
      $uibModalInstance.dismiss('cancel');
    }; // end close

    //close the  modal
    $scope.saveUsername = function (firstName, lastName) {
      //If the names they entered are not blank...
      if (firstName && lastName) {
        //Format name variables
        firstName = firstName.trim();
        lastName = lastName.trim();
        var fullName = firstName + ' ' + lastName;
        console.log('full name-->', fullName);
        //assemble object to send
        var userInfoToSend = {
          name: fullName,
          id: currentUserId
        }; // end userInfoToSend
        //Update the users's name with name entered
        $http({
          method: 'PUT',
          url: '/private/users/name',
          data: userInfoToSend
        }).then(function(response) {
          console.log(response);
          //Close the modal
          close();
        }).catch(function(err) {
          //TODO: add better error handling here
          console.log(err);
        }); // end $http
      //If they entered blank names
      } else {
        //TODO: add better error handling here
        console.warn('name is required');
      } // end else

    }; // end saveUsername

  } // end controller callback
]); // end ModalInstanceController
