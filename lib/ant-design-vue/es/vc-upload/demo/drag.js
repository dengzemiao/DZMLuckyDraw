import Upload from '../index';

export default {
  render: function render() {
    var h = arguments[0];

    var uploaderProps = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        type: 'drag',
        accept: '.png',
        beforeUpload: function beforeUpload(file) {
          console.log('beforeUpload', file.name);
        },

        openFileDialogOnClick: false
      },
      on: {
        start: function start(file) {
          console.log('start', file, file.name);
        },
        success: function success(file) {
          console.log('success', file);
        },
        progress: function progress(step, file) {
          console.log('progress', Math.round(step.percent), file.name);
        },
        error: function error(err) {
          console.log('error', err);
        },
        click: function click() {
          alert('click');
        }
      },
      style: {
        display: 'inline-block',
        width: '200px',
        height: '200px',
        background: '#eee'
      }
    };
    return h(Upload, uploaderProps);
  }
};