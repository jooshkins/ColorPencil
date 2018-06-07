import React from 'react'
import FolderSelectorPath from './FolderSelectorPath.js'
import UserSelector from './UserSelector'
import PermissionSelector from './PermissionSelector.js'
import PermissionModal from '../Modal/PermissionModal.js'
const electron = window.require('electron');
const powershell = electron.remote.require('powershell');
const basePath = electron.remote.app.getAppPath();
const scriptPath = basePath + '\\build\\change-share.ps1'


// ChangeFolderContainer -- gets all user inputs
class ChangePermissionContainer extends React.Component {
  constructor(props) {
    super(props);
      this.state = { 
        users: '',
        path: '',
        userSel: '',
        permissionSel: '',
        readSel: false,
        modifySel: false,
        removeSel: false,
        modalData: '',
        modalShow: false
    };

    this.handleChangeTxtPath = this.handleChangeTxtPath.bind(this);
    this.handleChangeBrowsePath = this.handleChangeBrowsePath.bind(this);
    this.handleClickPath = this.handleClickPath.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePermission = this.handleChangePermission.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //// START get inital user list
    let cmd = `${scriptPath} -getUsr`;
    let ps = new powershell(cmd, {
        executionPolicy: 'Bypass',
        noProfile: true,
    })
    ps.on("output", data => {
        let obj = JSON.parse(data)
        this.setState({ users: obj });
    });
    //// END get inital user list
  }

  //// START Folder Selection Logic
  handleChangeTxtPath(event) {
    this.setState({path: event.target.value})
  }

  handleChangeBrowsePath(event) {  // read path from browse button
    if (event.target.files.length > 0) {
        this.setState({path: event.target.files[0].path});
    }
  }

  handleClickPath(event) {
    let dir = this.state.path
    var cmd = `${scriptPath} -getPer -dir "${dir}"`
    let ps = new powershell(cmd, {
        executionPolicy: 'Bypass',
        noProfile: true,
    })
    ps.on("output", data => {
        this.setState({ modalData: data });
        this.toggleModal();
    });
    event.preventDefault();
  }
  //// END Folder Selection Logic

  toggleModal = () => {
      this.setState({
          modalShow: !this.state.modalShow
      });
  }

  handleChangeUser(event) {
    this.setState({userSel: event.target.value});
  }

  handleChangePermission(event) {
    const name = event.target.name;
    if (name === 'read') {
      this.setState({readSel: true});
      this.setState({modifySel: false});
      this.setState({removeSel: false});
    }
    if (name === 'modify') {
      this.setState({readSel: false});
      this.setState({modifySel: true});
      this.setState({removeSel: false});
     }
    if (name === 'remove') {
      this.setState({readSel: false});
      this.setState({modifySel: false});
      this.setState({removeSel: true});
    }
    this.setState({permissionSel: name});
  }

  handleSubmit(event){
    let dir = this.state.path
    let usr = this.state.userSel
    let per = this.state.permissionSel
    var cmd = `${scriptPath} -setPer -dir "${dir}" -usr "${usr}" -per "${per}"`
    let ps = new powershell(cmd, {
        executionPolicy: 'Bypass',
        noProfile: true,
    })
    ps.on("output", data => {
        var TemplateSuccess = `<div class="progress" style="height:40px">
        <div class="progress-bar bg-success text-dark" style="width:100%; height:45px"><h6>Permissions Applied</h6></div>`;
  
        this.setState({ modalData: TemplateSuccess });
    });

    var TemplateWor = `<div class="progress" style="height:40px">
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning text-dark" style="width:100%; height:45px"><h6>Updating</h6></div>`;
    this.setState({ modalData: TemplateWor });
    this.toggleModal();

    event.preventDefault();
  }

  render () {
    return (
      <div className="card-body">
          <div className="form-group">
            <div><label>Folder:</label></div>
            <FolderSelectorPath 
              path={this.state.path}
              onChangeTxtPath={this.handleChangeTxtPath}
              onChangeBrowsePath={this.handleChangeBrowsePath}
              onClickPath={this.handleClickPath}
            />
            <div><label>User:</label></div>
            <UserSelector 
              users={this.state.users} 
              onChange={this.handleChangeUser} 
            />
            <div><label>Select Permissions:</label></div>
            <PermissionSelector 
              onChange={this.handleChangePermission} 
              readSel={this.state.readSel}
              modifySel={this.state.modifySel}
              removeSel={this.state.removeSel}
            />
          </div>
          <PermissionModal 
            modalShow={this.state.modalShow} 
            modalData={this.state.modalData} 
            onClose={this.toggleModal}
          />
          <button className="btn btn-primary btn-block" onClick={this.handleSubmit}>Set Permissions</button>
      </div>
    );
  }
}

  export default ChangePermissionContainer;