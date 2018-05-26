import React from 'react'

class UserSelector extends React.Component {
    render () {
      // return empty list if still waiting on data
      let usersList = this.props && this.props.users.length > 0 ?
      this.props.users.map((user, i) => 
        <option value={user} key={'user_' + i}>{user}</option>
        ) : <option></option>
        
      return (
        <div className="form-group">
          <select className="form-control bg-secondary text-light" onChange={this.props.onChange}>
            {usersList}
          </select>
        </div>
      );
    }
  }
  
  export default UserSelector;