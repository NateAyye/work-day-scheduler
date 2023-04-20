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

// Function for getting the saved Data
function getData(currentDay) {
  const data = localStorage.getItem(currentDay.format('MMMM DD, YYYY'));
  return data ? JSON.parse(data) : data;
}

function setData(hour, data) {
  const localStore = localStorage.getItem(today.format('MMMM DD, YYYY'));
  const storage = localStore ? JSON.parse(localStore) : {};

  storage[hour] = data.trim();
  localStorage.setItem(today.format('MMMM DD, YYYY'), JSON.stringify(storage));
}

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const currentDay = dayjs();
  const workDay = dayjs().hour(8).minute(0).second(0);
  const timeblocks = getData(currentDay);
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
  $('#currentDay').text(currentDay.format('dddd MMMM, Do'));
});
