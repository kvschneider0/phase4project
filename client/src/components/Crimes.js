import { useState, useEffect } from 'react';
import { useFormik } from "formik";
import { useHistory } from 'react-router-dom';

function Crimes({user}){

    const history = useHistory();
    const [crimes, setCrimes] = useState([]);
    const [newCrime, setNewCrime] = useState(false);

    useEffect(() => {
        fetch('/crimes')
        .then(res => res.json())
        .then((data) => setCrimes(data.reverse()));
    }, []);

    function newCrimeButton(){
        setNewCrime(current => !current)
    }

    function editButton(){
        console.log('edit');
    }

    function deleteButton(e){
        if(window.confirm('Are you sure you want to delete this crime? Click OK to confirm.') === true){
            fetch('/crimes/'+e.target.name, {
                method: "DELETE",
            })
            .then(res => {
                if(res.ok){
                    setCrimes(crimes=> crimes.filter((crime) => parseInt(crime.id)!==parseInt(e.target.name)))
                }
            })
        }
    }

    const formik = useFormik({
        // enableReinitialize: true,
        initialValues: {
            name: '',
            description: ''
        },
        onSubmit: (values, {resetForm}) => {
            fetch('/crimes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        setCrimes([data, ...crimes]);
                        newCrimeButton();
                        resetForm();
                        history.push('/crimes');
                    })
                } else {
                    console.log('nope')
                    res.json().then(error => console.log(error.message))
                };
        })
        }
    })

    if (user&&user.is_admin === false){
        return <h1>NOT AUTHOIRIZED</h1>
    } else {
        return (
            <>
                <button onClick={newCrimeButton}>Create a new crime</button>
                {newCrime?<div className='new-crime-form'>
                    <form onSubmit={formik.handleSubmit} >
                    <label >Name of Crime</label>
                    <input type="text"  name="name" value={formik.values.name} onChange={formik.handleChange} />
                    <br></br>
                    <label >Description</label>
                    <input type="text"  name="description" value={formik.values.description} onChange={formik.handleChange} />
                    <br></br>
                    <input type='submit' value='Save' />
                </form>


                </div>:''}
                <h2>Edit Available Crimes:</h2>
                <div className="crimes">
                    <ul>
                        {crimes.map((crime, index) => (
                            <li key={index} className='singlecrime'>{crime.name}
                                <button onClick={editButton}>Edit</button>
                                <button onClick={deleteButton} name={crime.id}>Delete</button>
                                <ul>
                                    <li>{crime.description}</li>
                                    <br></br>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )
    }

}

export default Crimes;