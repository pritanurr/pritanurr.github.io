var ContactList;
var CitiesList;
var cityList = [];
var submitButton = document.querySelector("#submitToParse");
var emailClient = document.querySelector("#emailClient");
var nameClient = document.getElementById("nameClient");
var cityClient = document.querySelector("#cityClient");
var facebookClient = document.querySelector("#facebookClient");
var dropDownButton = document.querySelector("#cityDropDown");
var data = [
  ["email", "name", "cityClient", "facebook"]
];
var dataImport;
var querylimit = 1000;
var skipNumber = 0;

init();

// Init function to start all of the listener and start up code
function init() {

  Parse.initialize("fullandstarvingnew4009452495311007");
  Parse.serverURL = 'http://fullandstarvingnew.herokuapp.com/parse';
  ContactList = Parse.Object.extend("ContactList");
  CitiesList = Parse.Object.extend("CitiesList");
  setupButtonListener();
  skipNumber = 0;
  listCity();

}

// Function to add listener to buttons
function setupButtonListener() {

  // Add listener to upload data
  submitButton.addEventListener("click", function() {
    submitButton.disabled = "true";
    checkForExistingContact()
  })

}

// Function to upload data to the server
function uploadData() {

  var contactList = new ContactList();
  contactList.set("email", emailClient.value.toLowerCase());
  contactList.set("name", nameClient.value);

  // Check if user wants to add new city or choose from the list
  if (dropDownButton.value === "Add city") {

    contactList.set("cityClient", cityClient.value.toLowerCase());
    var citiesList = new CitiesList();
    citiesList.set("city", cityClient.value.toLowerCase());
    citiesList.set("size", 1);
  } else {

    contactList.set("cityClient", dropDownButton.value.toLowerCase())

  }

  contactList.set("facebook", facebookClient.value);
  contactList.save(null, {
    success: function(contactList) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + contactList.id);

      var query = new Parse.Query("CitiesList");

      if (dropDownButton.value === "Add city") {

        query.equalTo("city", cityClient.value.toLowerCase());

      } else {

        query.equalTo("city", dropDownButton.value.toLowerCase());

      }

        query.find({
          success: function(results) {
            //alert("Successfully retrieved " + results.length + " records.");
            if (results.length > 0) {

              var tempLength = results[0].get("size")+1;
              results[0].set("size",tempLength);
              alert("The city has "+ tempLength + " data\nDon't go more than 6000 data!");
              results[0].save(null, {
                success: function(citiesList) {
                  // Execute any logic that should take place after the object is saved.
                  location.reload();
                },
                error: function(citiesList, error) {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and message.
                  alert('Failed to create new city, with error code: ' + error.message);
                }
              });


            } else {
              alert("Uploading city data");
              citiesList.save(null, {
                success: function(citiesList) {
                  // Execute any logic that should take place after the object is saved.
                  location.reload();
                },
                error: function(citiesList, error) {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and message.
                  alert('Failed to create new city, with error code: ' + error.message);
                }
              });
            }

          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
            return true;
          }
        });
    },
    error: function(contactList, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

// Check if the email has been registered
function checkForExistingContact() {

  // Check if there is empty field on the email field
  if (emailClient.value.toLowerCase() !== "") {

    var query = new Parse.Query("ContactList");
    query.limit(querylimit);
    query.equalTo("email", emailClient.value.toLowerCase());
    query.find({
      success: function(results) {
        //alert("Successfully retrieved " + results.length + " records.");
        if (results.length > 0) {
          alert("The email has been registered");
        } else {
          alert("Uploading data");
          uploadData();
        }

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
        return true;
      }
    });

  } else {

    // Check if the is no data filled, then discontinue the upload
    if (emailClient.value.toLowerCase() === "" && nameClient.value === "" && cityClient.value.toLowerCase() === "" && facebookClient.value === "")
      alert("No data is filled, Upload is cancelled");
    else {

      // Upload data to server
      uploadData();
      alert("Uploading data");
    }
  }


}

// List cities that have been uploaded to server
function listCity() {

  console.log("listing city");
  var query = new Parse.Query("CitiesList");
  query.find({
    success: function(results) {
      results.sort(function(a, b){
          if(a.get("city") < b.get("city")) { return -1; }
          if(a.get("city") > b.get("city")) { return 1; }
          return 0;
      })

      console.log(results);

      if (results.length >= 0) {

        for (var i = 0; i < results.length; i++) {

          console.log(results[i].get("city").toLowerCase());
          add(results[i].get("city").toLowerCase());

        }
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });

/*
  var query = new Parse.Query("ContactList");
  query.limit(querylimit);
  query.skip(skipNumber * querylimit);
  query.find({
    success: function(results) {
      //alert("Successfully retrieved " + results.length + " records.");

      if (results.length >= 0) {

        for (var i = 0; i < results.length; i++) {

          cityList.push(results[i].get("cityClient").toLowerCase());
          //console.log(results[i].get("cityClient"));

        }

        if (results.length === querylimit) {
          console.log("recall");
          skipNumber++;
          listCity();
        } else {
          var sortedCity = cityList.slice().sort();

          //console.log(sortedCity);

          var sortedCityTrun = [];
          for (var i = 0; i < cityList.length; i++) {
            if (sortedCity[i + 1] != sortedCity[i]) {
              sortedCityTrun.push(sortedCity[i]);
              add(sortedCity[i]);
            }
          }

          console.log(sortedCityTrun);
          alert("Data has been updated to the latest version")
        }
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      return true;
    }
  });*/

}

// Add city to the dropdown list
function add(cityArg) {
  var el = document.getElementById("cityDropDown");
  var node = document.createElement("option");
  node.innerHTML = cityArg;
  el.appendChild(node);
}
