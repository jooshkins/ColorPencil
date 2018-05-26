import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// PermissionModal -- displays list of user permissions
class PermissionModal extends React.Component {
    render() {
        if (!this.props.modalShow) {
            return null;
        }
        return (
            <Modal isOpen={true} toggle={this.props.onClose} className={this.props.className}>
                <ModalHeader toggle={this.props.onClose}>User Permissions</ModalHeader>
                <ModalBody>
                    <div className="table table-sm" dangerouslySetInnerHTML={{ __html: this.props.modalData }} />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.props.onClose}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
export default PermissionModal;