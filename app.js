// https://scotch.io/bar-talk/build-a-pomodoro-timer-with-vuejs-solution-to-code-challenge-6
const app = new Vue({
  el: '#app',
  data: {
    resetButton: false,
    title: 'Enter your task name and hit Start!',
    taskName: '',
    timer: null,
    taskDone: [],
    private: {
      time: (25*60),
      totalTime: 0,
      message: {
        start: 'Hit start!',
        counting: 'Greatness is within sight!!',
        pause: 'Never quit, keep going!!'
      },
      alertTiming: 800,
      default: {
        taskName: 'task'
      }
    }
  },
  methods: {
    removeTask: function (taskId) {
      // https://www.w3schools.com/jsref/jsref_find.asp
      const item = this.taskDone.find(function (item) {
        return item.UUID == taskId;
      });

      // searches for the index of the item and removes it from the array
      this.taskDone.splice(this.taskDone.indexOf(item), 1);
    },
    countingState: function () {
      if (!this.private.totalTime) { this.private.totalTime = this.private.time; }
      this.timer = setInterval(() => this._countdown(), 1000);
      this.resetButton = true;
      this.title = this.private.message.counting;

      this.taskName = this.taskName == '' ? this.private.default.taskName : this.taskName;

      document.getElementById('task-input').setAttribute('hidden', 'hidden');
      document.getElementById('task-display').removeAttribute('hidden');
    },
    pausedState: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;
      this.title = this.private.message.pause;
    },
    resetState: function () {
      this._saveTask();
      this.private.time = (25*60);
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = false;
      this.title = this.private.message.start;
      this.taskName = ''
      this.private.totalTime = 0;

      document.getElementById('task-input').removeAttribute('hidden');
      document.getElementById('task-display').setAttribute('hidden', 'hidden');
    },
    _completeState: function () {
      const bgColor = document.body.style.backgroundColor;
      document.body.style.backgroundColor = 'red';
      setTimeout(() => { document.body.style.backgroundColor = bgColor }, this.private.alertTiming);

      this.resetState();
      sendNotification(this.taskName);
    },
    _saveTask: function () {
      const time = this.private.totalTime - this.private.time
      var completedTask = {
        'UUID': generateUUID(),
        'time': time,
        'timeMinutesFancy': Math.floor(time / 60),
        'timeSecondsFancy': time - (Math.floor(time / 60))*60,
        'taskName': this.taskName
      }
      this.taskDone.unshift(completedTask);
    },
    _padTime: function (time) {
      return (time < 10 ? '0' : '') + time;
    },
    _countdown: function () {
      if (this.private.time >= 1) {
        this.private.time--;
      } else {
        this.private.time = 0;
        this._completeState();
      }
    }
  },
  computed: {
    countMinutes: function () {
      const minutes = Math.floor(this.private.time / 60);
      return this._padTime(minutes);
    },
    countSeconds: function () {
      const seconds = this.private.time - (this.countMinutes * 60);
      return this._padTime(seconds);
    }
  }
})

// https://developer.mozilla.org/en-US/docs/Web/API/notification
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
  console.log(result);
});

// Generate a UUID from https://stackoverflow.com/a/8809472/6622966
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