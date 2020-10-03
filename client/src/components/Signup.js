import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import * as Constants from '../Constants';

export default class SignUp extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			full_name : "",
			email : "",
			password : "",
			avatar : null,
			loading : false,
			btn_signup_text : "Sing Up",
			errors : {},
		}
		
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		
	}
	
	onFormSubmit(e) {
		e.preventDefault() ;
		this.setState({loading:true,btn_signup_text:"Please Wait..."});
		
		let formData = new FormData();
		formData.append('full_name',this.state.full_name);
		formData.append('email',this.state.email);
		formData.append('password',this.state.password);
		formData.append('avatar',this.state.avatar);
		
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		
		axios
		.post(Constants.API_URL+"user", formData, config)
		.then((res) => {
			console.log(JSON.stringify(res));
			alert("User Created Successfully");
			
			//this.props.history.push("/sign-in");
			window.location.href = "/sign-in"
			
		})
		.catch((error) => { 
			this.setState({loading:false,btn_signup_text:"Sign Up"});
			if (error.response) {
			  // The request was made and the server responded with a status code
			  // that falls out of the range of 2xx
			  console.log(error.response.data);
			  //console.log(error.response.status);
			  //console.log(error.response.headers);
			  let data = error.response.data;
			  if(data.errors) {
				this.setState({errors:data.errors});
			  } else {
				  alert(data.message);
			  }
			  
			  //alert(error.response.);
			} else if (error.request) {
			  // The request was made but no response was received
			  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			  // http.ClientRequest in node.js
			  console.log(error.request);
			} else {
			  // Something happened in setting up the request that triggered an Error
			  console.log('Error', error.message);
			}
			//console.log(error.config);
		
		});
		
		
		
	}
	
	handleChange(e) {
		if(e.target.type=="file") {
			this.setState({[e.target.name]:e.target.files[0]});
		} else {
			this.setState({[e.target.name]:e.target.value});
		}
	}
	
    render() {
		
		return (
			<div className="auth-wrapper">
				<div className="auth-inner">
					<form onSubmit={this.onFormSubmit}>
						<h3>Sign Up</h3>

						<div className="form-group">
							<label>Full Name</label>
							<input type="text" name="full_name" className="form-control" value={this.state.full_name} onChange={this.handleChange} placeholder="Full Name" required />
							{this.state.errors.full_name && (
								<span className="alert-danger">{this.state.errors.full_name[0]}</span>
							)}
						</div>

						<div className="form-group">
							<label>Email address</label>
							<input type="email" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" required />
							{this.state.errors.email && (
								<span className="alert-danger">{this.state.errors.email[0]}</span>
							)}
						</div>

						<div className="form-group">
							<label>Password</label>
							<input type="text" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} placeholder="Enter password" required />
							{this.state.errors.password && (
								<span className="alert-danger">{this.state.errors.password[0]}</span>
							)}
						</div>
						<div className="form-group">
							<label>Avatar</label>
							<input type="file" name="avatar" className="form-control" onChange={this.handleChange}   />
							{this.state.errors.avatar && (
								<span className="alert-danger">{this.state.errors.avatar[0]}</span>
							)}
						</div>

						<button type="submit" className="btn btn-primary btn-block" disabled={this.state.loading}>{this.state.btn_signup_text}</button>
						<p className="forgot-password text-right">
							Already registered <Link to={"/sign-in"}>Sign in?</Link>
						</p>
					</form>
				</div>
			</div>		
        );
    }
}