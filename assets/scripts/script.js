// Adding dayjs plugins so that I can get the ordinal date of the day with the correct syntax
dayjs.extend(window.dayjs_plugin_advancedFormat);
dayjs.extend(window.dayjs_plugin_updateLocale);

const today = dayjs();

// function for adding the ordinal with the day so that it has the correct syntax
// Function gotten off of a github issue since the ordinal was not working the way it was supposed to
// Github Issue: https://github.com/iamkun/dayjs/issues/1891
dayjs.updateLocale('en', {
  ordinal: (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
  },
});

// Function for getting the saved Data from the localStorage and parses it then it just returns the parsed data for use
function getData(currentDay) {
  const data = localStorage.getItem(currentDay.format('MMMM DD, YYYY'));
  return data ? JSON.parse(data) : data;
}

// A function that takes in the day hour and data to be saved
// This function grabbs the data form localStorage if their is any if their isn't we use an empty object.
// Now either way we have a object to work with and I can add the data to it with the key of the hour the data is saved to
function setData(today, hour, data) {
  const localStore = localStorage.getItem(today.format('MMMM DD, YYYY'));
  const storage = localStore ? JSON.parse(localStore) : {};

  storage[hour] = data.trim();
  localStorage.setItem(today.format('MMMM DD, YYYY'), JSON.stringify(storage));
}

// A Function that takes in the data grabbed the start of the workDay and also what day the user wants to look at and loads the appropriate time-block
function loadPage(today, timeblocks, workDay) {
  $('#currentDay').text(today.format('dddd MMMM, Do'));

  // Loop 1 - 9 so that I get
  for (let i = 1; i <= 9; i++) {
    // Getting the current hour of the work day depending on the position of the loop
    let currentHour = workDay.add(i, 'hour');

    // Grabbing the main div for holding the time-blocks with the id I set on it and appending a string template litteral holding the correct element within
    // The id is using the string litteral syntax in order to programmatically set it depending on the time (Same with the textarea content)
    $('#time-blocks').append(`
     <div id="hour-${currentHour.hour()}" class="row time-block ${
      today.hour() === currentHour.hour()
        ? 'present'
        : today.hour() > currentHour.hour()
        ? 'past'
        : 'future'
    }">
        <div class="col-2 col-md-1 hour text-center py-3">${currentHour.format(
          'h A',
        )}</div>
        <textarea class="col-8 col-md-10 description" rows="3"> ${
          timeblocks ? timeblocks[currentHour.hour()] || '' : ''
        } </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>
    `);

    // Here I just want to add the event listener to the button while i am already looping and have the index for the buttons at hand.
    // So I an grabbing the button at the current Hour with the parents id then I an just calling the setData method and passing in the nessecary params.
    $(`#hour-${currentHour.hour()} button`).click((e) => {
      console.log($(`#hour-${currentHour.hour()} textarea`).val());
      setData(
        today,
        currentHour.hour(),
        $(`#hour-${currentHour.hour()} textarea`).val(),
      );
    });
  }
}

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Making a new day object
  const currentDay = dayjs();
  // Making a day object that starts at 8AM on the dot so I can manipulate it for my timeblock labels
  const workDay = dayjs().hour(8).minute(0).second(0);
  // Getting the current data in the localStorage and applying it to a variable
  const timeblocks = getData(currentDay);

  let pageOffset = 0;

  //Load Page Function that takes the current day of the user is looking at and loads accordingly
  loadPage(currentDay, timeblocks, workDay);

  //Next Button Handler for changing the date
  $('#next-day').click((e) => {
    pageOffset++;
    $('#time-blocks').empty();
    loadPage(
      currentDay.add(pageOffset, 'day'),
      getData(currentDay.add(pageOffset, 'day')),
      workDay,
    );
  });

  //Previous Button Handler for changing the date
  $('#prev-day').click(() => {
    pageOffset--;
    $('#time-blocks').empty();
    loadPage(
      currentDay.add(pageOffset, 'day'),
      getData(currentDay.add(pageOffset, 'day')),
      workDay,
    );
  });
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?

  // TODO: Add code to display the current date in the header of the page.
});
