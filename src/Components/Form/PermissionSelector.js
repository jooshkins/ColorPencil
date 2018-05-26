import React from 'react';

// PermissionSelector -- allows user to select permissions
class PermissionSelector extends React.Component {
    render () {
      return (
        <div className="form-group">
          <label className="radio-inline mr-sm-2">
            <input type="radio" name="read" onChange={this.props.onChange} checked={this.props.readSel}/> Read
          </label>
           <label className="radio-inline mr-sm-2">
            <input type="radio" name="modify" onChange={this.props.onChange} checked={this.props.modifySel}/> Modify
          </label>
          <label className="radio-inline mr-sm-2">
            <input type="radio" name="remove" onChange={this.props.onChange} checked={this.props.removeSel}/> Remove
          </label>
        </div>
      );
    }
  }
  export default PermissionSelector;