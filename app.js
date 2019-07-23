// https://scotch.io/bar-talk/build-a-pomodoro-timer-with-vuejs-solution-to-code-challenge-6
const app = new Vue({
  el: '#app',
  data: {
    resetButton: false,
    title: 'Enter your task name and hit Start!',
    taskName: '',
    timer: null,
    private: {
      totalTime: (25*60),
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
    countingState: function () {
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
      this.private.totalTime = (25 * 60);
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = false;
      this.title = this.private.message.start;
      this.taskName = ''

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
    _padTime: function (time) {
      return (time < 10 ? '0' : '') + time;
    },
    _countdown: function () {
      if (this.private.totalTime >= 1) {
        this.private.totalTime--;
      } else {
        this.private.totalTime = 0;
        this._completeState();
      }
    }
  },
  computed: {
    countMinutes: function () {
      const minutes = Math.floor(this.private.totalTime / 60);
      return this._padTime(minutes);
    },
    countSeconds: function () {
      const seconds = this.private.totalTime - (this.countMinutes * 60);
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