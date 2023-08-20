import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  //This will be altered to be using groups instead of the DB. One idea is to make a big group called Workercustomers or whatever
  //and then have sub roles associated with each company that we then assign to each worker associated with that customer
  axios.get("https://crmpilot0.azurewebsites.net/workercustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}

export const addWorkerToCustomer = (customer_id, worker_id) => dispatch => {
  //We will change this to be using groups rather than the DB
  axios.post(`https://crmpilot0.azurewebsites.net/workercustomers`, {customer_id: customer_id, worker_id: worker_id})
  .then((response) => {
    console.log('here')
    dispatch({type: 'ADDED_WORKER', payload: response.data});
    })
  .catch(err => console.log(err))
}