import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import * as Constants from '../Constants';
import {LogModal} from './LogModal';

export default class History extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			data : [],
			loading: true,
			user : JSON.parse(localStorage.getItem('user_detail')),
			error : "",
			show_modal: false,
			logs : []
		}
		this.handleModal = this.handleModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	
	componentDidMount() {
		if(localStorage.getItem('is_login')==null) {
			window.location.href = "/sign-in";
		}
		this.getData();
	}
	
	
	handleModal(e) {
		console.log(e.target.id);
		this.setState({show_modal:true});
		let single_logs = [];
		for(let i=0;i<this.state.data.length;i++) {
			if(this.state.data[i].id==e.target.id) {
				this.setState({logs:this.state.data[i].logs});
				//console.log(this.state.data[i].logs);
			}
		}
		
		//console.log(single_logs);
	}
	
	
	
	
	
	getData() {
		
		this.setState({loading:true,data : [],error:""});
			
		const config = {
			headers: {
				'Authorization': 'Bearer '+localStorage.getItem('user_token')
			}
		}
		
		axios
		.get(Constants.API_URL+"history", config)
		.then((res) => {
			this.setState({loading:false,data:res.data.history});
			console.log(JSON.stringify(res));
			
			
		})
		.catch((error) => { 
			this.setState({loading:false});
			if (error.response) {
			  console.log(error.response);
			  this.setState({error:error.response.statusText});
			  
			  //alert(error.response.);
			} else if (error.request) {
			  console.log("Error Request "+error.request);
			} else {
			  // Something happened in setting up the request that triggered an Error
			  console.log('Error', error.message);
			}
			//console.log(error.config);
		
		});
		
	}
	
	closeModal() {
		this.setState({show_modal:false,logs:[]});
	}
	
    render() {
		
		let tableData = this.state.data.map((row,key) => 
							<tr key={key}>
								<td>{row.id}</td>	
								<td>{row.created_at}</td>	
								<td>
									{row.won==1 ? ("Won") : ("Lost") }
								</td>
								<td>{row.my_health}</td>
								<td>{row.dragon_health}</td>
								<td>{row.time_left}</td>
								<td> <a href="javascript:void()" id={row.id} onClick={this.handleModal}>View</a> </td>
							</tr>
		
						);
		
		
						
        return (
			<div className="container">
				<LogModal show={this.state.show_modal} logs={this.state.logs} handleClose={this.closeModal} />
				<h2>Hello, {this.state.user.name}</h2>
				
				{this.state.loading==true && (
					<div className="spinner-border text-primary" role="status">
					  <span className="sr-only">Loading...</span>
					</div>
				)}
				
				{this.state.data && this.state.loading==false && (
					<table className="table table-bordered table-stiped">
						<thead>	
							<tr>
								<td>#</td>
								<td>Date</td>
								<td>Status</td>
								<td>My Health</td>
								<td>Dragon Health</td>
								<td>Time Left</td>
								<td>Logs</td>
							</tr>
						</thead>
						<tbody>
							{tableData}
						</tbody>
						
					</table>
				)}
				
				{this.state.error!="" && (
				<div className="alert alert-warning">{this.state.error}</div>
				)}
				
			</div>	
        );
    }
}
