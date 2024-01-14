import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();

  useEffect(() => {
    getUsers();
    }, []);

    const onDelete = (user) => {
      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      } else {
        axiosClient.delete(`/users/${user.id}`)
          .then(() => {
            setNotification('User deleted successfully!');
            getUsers();
          })
          .catch(() => {
            alert('Something went wrong!');
          })
      }
    }

    const getUsers = () => { 
      setLoading(true);
      axiosClient.get('/users')
        .then(({data}) => {
          setLoading(false);
          setUsers(data.data);
          console.log(data);
        })
        .catch(() => {
          setLoading(false);
        })
    };

  return (
    <div>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Users</h1>
        <Link to="/users/create" className="btn-add">Create User</Link>
      </header>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && <tbody>
            <tr>
              <td colSpan="5" className="text-center">Loading...</td>
            </tr>
          </tbody>}
          {!loading && <tbody>
            {users.map(u => (
              <tr>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link to={`/users/${u.id}`} className="btn-edit">Edit</Link>
                  &nbsp;
                  <button onClick={e => onDelete(u)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>}
        </table>
      </div>
    </div>
  )
}
