import axios from 'axios';

export const getWorkers = () => dispatch => {
  //This will be changed to be from Azure groups rather than from the DB
  axios.get("https://crmpilot0.azurewebsites.net/workers")
  .then(response => dispatch({ type: 'GET_ALL_WORKERS', payload: response.data}))
}

export const createWorker = (worker_information) => dispatch => {
  //Does exactly what it says it does
  //This will be most likely removed since we don't need to create workers in app
  if (worker_information.email === worker_information.confirmation_email){
    // We add this if since we're just gonna do the confirmation email validation here to simplify things since it's not a key in the worker table
    axios.post("https://crmpilot0.azurewebsites.net/workers", worker_information)
    .then(response => {
      dispatch({ type: 'CREATE_NEW_WORKER', payload: response.data}) 
    })
    .catch(err => {
      console.log(err)
      dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}})})
  }
  else{
    dispatch({type: 'ERROR_CAUGHT', payload: {err_message: "Email and confirmation email do not match", err_code: 406, err_value: "didn't work"}})
  }
}

export const setCurrentWorker = (worker_information) => dispatch => {
  //Once we have confirmation that the worker is signed in, we set the current worker to be this
  //This will remain since we still want this
  dispatch({type: 'SET_CURRENT_WORKER', payload: worker_information});
}
export const getGroupList = (accessToken) => dispatch => {
  //Gets us our list of workers who are admins
    axios.get(`https://graph.microsoft.com/v1.0/groups/628f70b0-c47a-43f9-8e0a-e7b34cafd770/members`,
    {headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
          'Prefer' : 'outlook.body-content-type="text"'
    }})
    .then(response => {
      dispatch({type: 'GROUP_WORKER_LIST', payload: response.data.value})})
    .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: "Can't find calendar for account", err_code: err.response.request.status, err_value: err.response.request.statusText}}));
}

export const setCurrentWorkerRole = (worker_role) => dispatch => {
  //Sets the current worker role in redux. Arguably, we can get rid of this since the above saves us in the admin list, but we'll see if pulling it 
  //directly will be easier
  dispatch({type: 'SET_WORKER_ROLE', payload: worker_role})
}
