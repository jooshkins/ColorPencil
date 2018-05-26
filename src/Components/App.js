import React from 'react';
import ChangePermissionContainer from './Form/ChangePermissionContainer.js'
import { TitleBar } from './Titlebar/lib/index.js'
import './Titlebar/assets/style.css'
import  'bootstrap/dist/css/bootstrap.min.css'

var title = <p className="text-light p-1">Change Folder Permissions</p>

// App -- top level container
class App extends React.Component {
    render() {
      return (
        <div>
          <TitleBar children={title} icon={"./icon.png"}/>
            <div className="container-fluid bg-dark">
              <div className="bg-dark text-light">
                <ChangePermissionContainer />
              </div>
            </div>
        </div>
      );
    }
  }

  export default App;