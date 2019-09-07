'use strict'

/**
 * This function sends a browser notification based on the task name input
 * Taken from https://developer.mozilla.org/en-US/docs/Web/API/notification
 *
 * @param {string} taskNameInput - The notification string to display
 *
 * @example
 */
function sendNotification(taskNameInput) {

  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notification = new Notification('Podoromo Timer', { 'body': taskNameInput })
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        const notification = new Notification('Podoromo Timer', { 'body': taskNameInput })
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
} Notification.requestPermission().then(function (result) {
  // console.log(result);
});

/**
 * This function returns a UUID
 * Taken from from https://stackoverflow.com/a/8809472/6622966
 *
 * @return {string} A UUID in string
 *
 * @example
 */
function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * This function reads a value in local storage and parse that data into an object
 *
 * @param {string} key - The key of the object to read from
 *
 * @return {Object} A UUID in string
 */
function readLS(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

/**
 * This function reads an string for the key and an object to write to
 *
 * @param {string} key - The key of the object to write to
 * @param {Object} inputObj - The JSON Object to stringify and write to the local storage
 */
function writeLS(key, inputObj) {
  window.localStorage.setItem(key , JSON.stringify(inputObj));
}