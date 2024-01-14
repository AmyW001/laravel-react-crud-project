import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [errors, setErrors] = useState(null)
    const {setNotification} = useStateContext();
    const [ user, setUser ] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    if (id) {
        // fetch user data
        useEffect(() => {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => {
                    setLoading(false);
                })
        }, [])
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                setNotification('User updated successfully!');
                // redirect to users page
                navigate('/users');
            })
            .catch((err) => {
                const response = err.response;
                // 422 = validation error
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
        } else {
            axiosClient.post('/users', user)
            .then(() => {
                setNotification('User created successfully!');
                // redirect to users page
                navigate('/users');
            })
            .catch((err) => {
                const response = err.response;
                // 422 = validation error
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
        }
    }

  return (
    <>
    {user.id && <h1>Update User: {user.name}</h1>}
    {!user.id && <h1>New User</h1>}
    <div className="card animated fadeInDown">
        {loading && <div>Loading...</div>}
        {errors && <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div> }
          {!loading && <form onSubmit={onSubmit}>
                <input onChange={e => setUser({...user, name: e.target.value})} value={user.name} type="text" placeholder="Name"></input>
                <input onChange={e => setUser({...user, email: e.target.value})} value={user.email} type="email" placeholder="Email"></input>
                <input onChange={e => setUser({...user, password: e.target.value})} value={user.password} type="password" placeholder="Password"></input>
                <input onChange={e => setUser({...user, password_confirmation: e.target.value})} type="password" placeholder="Password Confirmation"></input>
                <button className="btn">Save</button>
            </form>}
    </div>
    </>
  )
}
