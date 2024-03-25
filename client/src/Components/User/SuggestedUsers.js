import React from 'react';
import './SuggestedUsersList.css';


const SuggestedUsersList = ({ users }) => {
  return (
    <div className="suggested-users">
      <h2>Suggested Friends</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <img src={user.avatar} alt={`Avatar of ${user.name}`} />
            <div>
              <h3>{user.name}</h3>
              <p>@{user.username}</p>
            </div>
            <button className='suggested_add_button'>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedUsersList;
