import _extends from 'babel-runtime/helpers/extends';
/* eslint-disable no-console, no-unused-vars */
import '../assets/index.less';
import Notification from '../index';
var notification = null;
Notification.newInstance({
  maxCount: 10
}, function (n) {
  notification = n;
});

function simpleFn() {
  notification.notice({
    content: function content() {
      return h('span', ['simple show']);
    },
    onClose: function onClose() {
      console.log('simple close');
    }
  });
}

function durationFn() {
  notification.notice({
    content: function content(h) {
      return h('span', ['can not close...']);
    },
    duration: null
  });
}

function closableFn() {
  notification.notice({
    content: function content(h) {
      return h('span', ['closable']);
    },
    duration: null,
    onClose: function onClose() {
      console.log('closable close');
    },
    onClick: function onClick() {
      console.log('clicked!!!');
    },

    closable: true
  });
}

function close(key) {
  notification.removeNotice(key);
}

function manualClose() {
  var key = Date.now();
  notification.notice({
    content: function content(h) {
      return h('div', [h('p', ['click below button to close']), h(
        'button',
        {
          on: {
            'click': close.bind(null, key)
          }
        },
        ['close']
      )]);
    },
    key: key,
    duration: null
  });
}

var counter = 0;
var intervalKey = void 0;
function updatableFn() {
  if (counter !== 0) {
    return;
  }

  var key = 'updatable-notification';
  var initialProps = {
    content: 'Timer: ' + counter + 's',
    key: key,
    duration: null,
    closable: true,
    onClose: function onClose() {
      clearInterval(intervalKey);
      counter = 0;
    }
  };

  notification.notice(initialProps);
  intervalKey = setInterval(function () {
    notification.notice(_extends({}, initialProps, { content: 'Timer: ' + ++counter + 's' }));
  }, 1000);
}

var notification2 = null;
var clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' + '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' + '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' + ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' + '28.7 64-64V306c0-35.3-28.7-64-64-64z';
Notification.newInstance({
  closeIcon: function closeIcon(h) {
    return h('i', [h(
      'svg',
      {
        attrs: {
          viewBox: '0 0 1024 1024',
          width: '1em',
          height: '1em',
          fill: 'currentColor'
        },
        style: { verticalAlign: '-.125em ' }
      },
      [h('path', {
        attrs: { d: clearPath }
      })]
    )]);
  }
}, function (n) {
  notification2 = n;
});
function customCloseIconFn() {
  notification2.notice({
    content: 'It is using custom close icon...',
    closable: true,
    duration: 0
  });
}

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h(
      'button',
      {
        on: {
          'click': simpleFn
        }
      },
      ['simple show']
    ), h(
      'button',
      {
        on: {
          'click': durationFn
        }
      },
      ['duration=0']
    ), h(
      'button',
      {
        on: {
          'click': closableFn
        }
      },
      ['closable']
    ), h(
      'button',
      {
        on: {
          'click': manualClose
        }
      },
      ['controlled close']
    ), h(
      'button',
      {
        on: {
          'click': updatableFn
        }
      },
      ['updatable']
    ), h('div', [h(
      'button',
      {
        on: {
          'click': customCloseIconFn
        }
      },
      ['custom close icon']
    )])]);
  }
};