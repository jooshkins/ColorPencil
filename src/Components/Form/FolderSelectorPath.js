import React from 'react'

// FolderSelector -- allows user to select dir and report 
  class FolderSelectorPath extends React.Component {  
    render () {
      return (
        <div>
            <label className="btn-group container-fluid p-0">
            <span className="btn btn-primary">
                Browse&hellip; <input type="file" style={{display: 'none'}} webkitdirectory="" directory="" onChange={this.props.onChangeBrowsePath}/>
            </span>
            <input type="text" value={this.props.path} className="form-control rounded-0 bg-secondary text-light" onChange={this.props.onChangeTxtPath}/>
            <button className="btn btn-warning" onClick={this.props.onClickPath}>Get Permissions</button>
            </label>
        </div>
      );
    }
  }
  
  export default FolderSelectorPath;