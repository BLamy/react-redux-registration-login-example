import { userService } from './user.service';
import { alertActions } from './alert';
import { history } from '../_helpers';

const REGISTER_REQUEST = 'USERS_REGISTER_REQUEST';
const REGISTER_SUCCESS = 'USERS_REGISTER_SUCCESS';
const REGISTER_FAILURE = 'USERS_REGISTER_FAILURE';
const LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
const LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
const LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';
const LOGOUT = 'USERS_LOGOUT';
const GETALL_REQUEST = 'USERS_GETALL_REQUEST';
const GETALL_SUCCESS = 'USERS_GETALL_SUCCESS';
const GETALL_FAILURE = 'USERS_GETALL_FAILURE';
const DELETE_REQUEST = 'USERS_DELETE_REQUEST';
const DELETE_SUCCESS = 'USERS_DELETE_SUCCESS';
const DELETE_FAILURE = 'USERS_DELETE_FAILURE';  

const loginRequest = user => ({ type: LOGIN_REQUEST, user }) 
const loginSuccess = user => ({ type: LOGIN_SUCCESS, user }) 
const loginFailure = error => ({ type: LOGIN_FAILURE, error })
export const login = (username, password) => dispatch => {
    dispatch(loginRequest({ username }));
    
    userService.login(username, password)
        .then(
            user => { 
                dispatch(loginSuccess(user));
                history.push('/');
            },
            error => {
                dispatch(loginFailure(error));
                dispatch(alertActions.error(error));
            }
        );
}

export const logout = () => {
    userService.logout();
    return { type: LOGOUT };
}

const registerRequest = user => ({ type: REGISTER_REQUEST, user })
const registerSuccess = user => ({ type: REGISTER_SUCCESS, user })
const registerFailure = error => ({ type: REGISTER_FAILURE, error })
export const register = user => dispatch => {
        dispatch(registerRequest(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(registerSuccess());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(registerFailure(error));
                    dispatch(alertActions.error(error));
                }
            );

}

const getAllRequest = () => ({ type: GETALL_REQUEST })
const getAllSuccess = users => ({ type: GETALL_SUCCESS, users })
const getAllFailure = error => ({ type: GETALL_FAILURE, error })
export const getAll = () => dispatch => {
    dispatch(getAllRequest());

    userService.getAll()
        .then(
            users => dispatch(getAllSuccess(users)),
            error => dispatch(getAllFailure(error))
        );
};

const deleteRequest = (id) => ({ type: DELETE_REQUEST, id })
const deleteSuccess = (id) => ({ type: DELETE_SUCCESS, id })
const deleteFailure = (id, error) => ({ type: DELETE_FAILURE, id, error })
// prefixed function name with underscore because delete is a reserved word in javascript
const _delete = id => dispatch => {
    dispatch(deleteRequest(id));

    userService.delete(id)
        .then(
            user => { 
                dispatch(deleteSuccess(id));
            },
            error => {
                dispatch(deleteFailure(id, error));
            }
        );
};

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case LOGIN_FAILURE:
      return {};
    case LOGOUT:
      return {};
    default:
      return state
  }
}

export function registration(state = {}, action) {
    switch (action.type) {
      case REGISTER_REQUEST:
        return { registering: true };
      case REGISTER_SUCCESS:
        return {};
      case REGISTER_FAILURE:
        return {};
      default:
        return state
    }
  }

export default (state = {}, action) => {
    switch (action.type) {
      case GETALL_REQUEST:
        return {
          loading: true
        };
      case GETALL_SUCCESS:
        return {
          items: action.users
        };
      case GETALL_FAILURE:
        return { 
          error: action.error
        };
      case DELETE_REQUEST:
        // add 'deleting:true' property to user being deleted
        return {
          ...state,
          items: state.items.map(user =>
            user.id === action.id
              ? { ...user, deleting: true }
              : user
          )
        };
      case DELETE_SUCCESS:
        // remove deleted user from state
        return {
          items: state.items.filter(user => user.id !== action.id)
        };
      case DELETE_FAILURE:
        // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
        return {
          ...state,
          items: state.items.map(user => {
            if (user.id === action.id) {
              // make copy of user without 'deleting:true' property
              const { deleting, ...userCopy } = user;
              // return copy of user with 'deleteError:[error]' property
              return { ...userCopy, deleteError: action.error };
            }
  
            return user;
          })
        };
      default:
        return state
    }
}