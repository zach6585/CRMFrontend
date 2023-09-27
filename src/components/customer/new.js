import {useState, useEffect, useRef} from 'react';
import { MultiSelect } from "react-multi-select-component";
import { useSelector, useDispatch } from 'react-redux';
import {createCustomer} from '../../actions/customer.js';
import { useNavigate } from 'react-router-dom';

import '../components.scss';

const New = () => {
    const [customer, setCustomer] = useState(
        {
         company: "",
         contact_name: "",
         title: "",
         email: "",
         number: "",
         old_address: "",
         new_address: "",
         category: "REB",
        });

    const [selected, setSelected] = useState([]); //This determines what has and hasn't been selected yet with workers

    const dispatch = useDispatch();
    const workers = useSelector((state) => state.workers);
    const errors = useSelector((state) => state.errors.error);
    const customers = useSelector((state) => state.customers.customers); //We add this purely so the useEffect where we navigate will be called when a new customer is made!
    const selectedWorker = useSelector((state) => state.workers.current_worker); //We will be using this to determine if the user has a right to access this page
        

    const navigate = useNavigate();


    const hasBeenRenderedRef = useRef(false); //Used to determine if we've rendered it yet or not so that we don't have to run second useEffect at first render

    useEffect(() => {
        //This useEffect is for determining if we've had our workersTables changed so that we can render our show and 
        //not worry about the index page having a lack of workers in it
        if (hasBeenRenderedRef.current === true && Object.keys(errors).length === 0){
           navigate("/contact");
        }
        else{
            hasBeenRenderedRef.current = false
        }
        }, [errors, customers, navigate]) 


    
    
     

    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        hasBeenRenderedRef.current = true;
        dispatch(createCustomer(customer, selected));
    }


    const handleChange = (e) => {
        const newKey = e.target.id;
        const newValue = e.target.value
        setCustomer(oldState => ({ ...oldState, [newKey]: newValue}));
    }
    
    if (Object.keys(selectedWorker).length !== 0){
        if (selectedWorker.admin === 1){//This needs to be changed to using the groups admin
            return(
                <div className='form-container'>
                    <h1 className="form-title">Create a new Contact</h1>
                    <form id="customer_form" onSubmit={handleSubmit}>
                        <div className='form-field-container'>
                            <div className="form-field">
                                <label>
                                    Company Name: <span className='red_asterisk'>*</span>
                                    <input type="text" defaultValue={customer.company} id="company" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Contact Name: <span className='red_asterisk'>*</span>
                                    <input type="text" defaultValue={customer.contact_name} id="contact_name" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    WB Wood Owners: <span className='red_asterisk'>*</span>
                                    <div id="multi_select">
                                    <MultiSelect 
                                        options={workers.select_tag_worker_list}
                                        value={selected}
                                        onChange={setSelected}
                                        labelledBy="Select"
                                    />
                                    </div>
                                
                                    
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Title: 
                                    <input type="text" id="title" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Email: <span className='red_asterisk'>*</span> 
                                    <input type="text" defaultValue={customer.email} id="email" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                        <div className="form-field">
                            <label>
                                Number: <span className='red_asterisk'>*</span>
                                <input type="text" defaultValue={customer.number} id="number" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>
                        
                    
                        <div className="form-field">
                            <label>
                                Category: 
                                <div className="custom-select">
                                    <select id="category" onChange={e => handleChange(e)}>
                                        <option value="REB">Real Estate Broker</option>
                                        <option value="A&D">Architect Designer</option>
                                        <option value="PMfirm">Project Management Firm</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                            </label>
                        </div>
                        </div>

                      
                    <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button form-button">Submit</button>
                    </form>
                </div>
            )
        }
        else{
            return(
                <div id="Forbidden">
                    <h1>Error 403 - Forbidden</h1>
                    <h2>You do not have access to this page</h2>
                </div>
            )
        }
    }
    else{
        return(<h1>Loading...</h1>)
    }
    
}

export default New;

