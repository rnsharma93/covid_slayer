import React,{Component, useState, useEffect} from 'react';
import { Modal,Button } from 'react-bootstrap';


export class LogModal extends Component  {
		
		handleClose = () => {
			//alert("hello");
			//this.setState({show:false});
			this.props.handleClose();
		}
		
		
		
	render() {
		let log_list =  this.props.logs.map((log,key)=>
							<li key={key}>{log.description}</li>
						);
		return(
			<Modal show={this.props.show} onHide={this.handleClose}>
				<Modal.Header closeButton>
				  <Modal.Title>Game Logs</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ul>
					{log_list}
					</ul>
				</Modal.Body>
				<Modal.Footer>
				  <Button variant="secondary" onClick={this.handleClose}>
					Close
				  </Button>
				</Modal.Footer>
			</Modal>
			
		);
	}	
		
	
	
	


}
