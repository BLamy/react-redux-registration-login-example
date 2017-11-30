const SUCCESS =  'ALERT_SUCCESS';
const ERROR = 'ALERT_ERROR';
const CLEAR = 'ALERT_CLEAR';

export const success = message => ({
    type: SUCCESS, message
})

export const error = message => ({
    type: ERROR, message
})

export const clear = () => ({
    type: CLEAR
})

export const alertActions = {
    success,
    error,
    clear
};

export default (state = {}, action) => {
    switch (action.type) {
      case SUCCESS:
        return {
          type: 'alert-success',
          message: action.message
        };
      case ERROR:
        return {
          type: 'alert-danger',
          message: action.message
        };
      case CLEAR:
        return {};
      default:
        return state
    }
  }