'use strict'

// https://scotch.io/bar-talk/build-a-pomodoro-timer-with-vuejs-solution-to-code-challenge-6
const app = new Vue({
  el: '#app',
  data: {
    resetButton: false,
    clearButton: false,
    taskName: '',
    timer: null,
    taskDone: [],
    private: {
      timeLeft: -5,
      timeInput: -5,
      alertTiming: 800,
      default: {
        taskName: 'task',
        timeLeft: (25 * 60)
      }
    }
  },
  mounted () {
    this.taskDone = readLS('tasks');
    if (!this.taskDone) {
      this.taskDone = [];
    }
    if (this.taskDone.length > 0) {
      this.clearButton = true;
    } else {
      this.clearButton = false;
    }
  },
  methods: {
    clearHistory: function () {
      this.taskDone = [];
    },
    removeTask: function (taskId) {
      // https://www.w3schools.com/jsref/jsref_find.asp
      const item = this.taskDone.find(function (item) {
        return item.UUID == taskId;
      });

      // searches for the index of the item and removes it from the array
      this.taskDone.splice(this.taskDone.indexOf(item), 1);
    },
    countingState: function () {
      if (this.private.timeInput === -5 && this.private.timeLeft === -5) { this.private.timeInput = this.private.default.timeLeft; }
      this.private.timeLeft = (this.private.timeLeft === -5 ? this.private.default.timeLeft : this.private.timeLeft);

      this.timer = setInterval(() => this._countdown(), 1000);
      this.resetButton = true;

      this.taskName = this.taskName == '' ? this.private.default.taskName : this.taskName;

      document.getElementById('task-input').setAttribute('hidden', 'hidden');
      document.getElementById('task-display').removeAttribute('hidden');

      setTimeout(() => { document.getElementById('pause-btn').focus(); }, 100);
    },
    pausedState: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;

      setTimeout(() => { document.getElementById('start-btn').focus(); }, 100);
    },
    resetState: function () {
      this._saveTask();
      this.private.timeLeft = -5;
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = false;
      this.taskName = ''
      this.private.timeInput = -5;

      document.getElementById('task-input').removeAttribute('hidden');
      document.getElementById('task-display').setAttribute('hidden', 'hidden');

      document.getElementById('task-input').focus();
    },
    _completeState: function () {
      const bgColor = document.body.style.backgroundColor;
      document.body.style.backgroundColor = 'red';
      setTimeout(() => { document.body.style.backgroundColor = bgColor }, this.private.alertTiming);

      this.resetState();
      sendNotification(this.taskName);
    },
    _saveTask: function () {
      const time = this.private.timeInput - this.private.timeLeft;
      const timeDone = new Date();
      const completedTask = {
        'UUID': generateUUID(),
        'timeMinutesFancy': Math.floor(time / 60),
        'timeSecondsFancy': time - (Math.floor(time / 60)) * 60,
        'taskName': this.taskName,
        'timeDone': timeDone.toLocaleTimeString()
      }
      this.taskDone.unshift(completedTask);
    },
    _padTime: function (time) {
      return (time < 10 ? '0' : '') + time;
    },
    _countdown: function () {
      if (this.private.timeLeft >= 1) {
        this.private.timeLeft--;
      } else {
        this.private.timeLeft = 0;
        this._completeState();
      }
    }
  },
  computed: {
    countMinutes: function () {
      const displayTime = (this.private.timeLeft === -5 ? this.private.default.timeLeft : this.private.timeLeft);
      const minutes = Math.floor(displayTime / 60);
      return this._padTime(minutes);
    },
    countSeconds: function () {
      const displayTime = (this.private.timeLeft === -5 ? this.private.default.timeLeft : this.private.timeLeft);
      const seconds = displayTime - (this.countMinutes * 60);
      return this._padTime(seconds);
    }
  },
  watch: {
    taskDone: function (val) {
      writeLS('tasks', this.taskDone);
      
      if (this.taskDone.length > 0) {
        this.clearButton = true;
      } else {
        this.clearButton = false;
      }
    }
  }
})

document.getElementById("task-input").focus();