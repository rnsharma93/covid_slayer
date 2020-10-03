import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import * as Constants from '../Constants';

export default class Login extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			email : "",
			password : "",
			loading : false,
			btn_signin_text : "Sing In",
			errors : {},
			error_message : "",
			is_login : localStorage.getItem('is_login'),
		}
		
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		
		
		
	}
	
	onFormSubmit(e) {
		e.preventDefault() ;
		this.setState({loading:true,btn_signin_text:"Submitting..."});
		
		let formData = new FormData();
		formData.append("email",this.state.email);
		formData.append("password",this.state.password);
		
		axios
		.post(Constants.API_URL+"login", formData)
		.then((res) => {
			//console.log(JSON.stringify(res));
			alert("Logged in Successfully");
			localStorage.setItem('is_login',true);
			localStorage.setItem('user_token',res.data.token)
			localStorage.setItem('user_detail',JSON.stringify(res.data.user));
			//this.props.history.push("/user-detail");
			window.location.href="/user-detail";
			
		})
		.catch((error) => { 
			this.setState({loading:false,btn_signin_text:"Sign In"});
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
				//alert(data.message);
				this.setState({error_message:data.message});
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
		this.setState({[e.target.name]:e.target.value});
	}
	
    render() {
        return (
			<div className="auth-wrapper">
				<div className="auth-inner">
					<form onSubmit = {this.onFormSubmit}>
						<h3>Sign In</h3>
						{this.state.error_message && (
								<div className="alert alert-danger">{this.state.error_message}</div>
						)}
						<div className="form-group">
							<label>Email address</label>
							<input type="email" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" />
							{this.state.errors.email && (
								<span className="alert-danger">{this.state.errors.email[0]}</span>
							)}
						</div>

						<div className="form-group">
							<label>Password</label>
							<input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} placeholder="Enter password" />
							{this.state.errors.password && (
								<span className="alert-danger">{this.state.errors.password[0]}</span>
							)}
						</div>
						{
						/*
						<div className="form-group">
							<div className="custom-control custom-checkbox">
								<input type="checkbox" className="custom-control-input" id="customCheck1" />
								<label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
							</div>
						</div>
						*/
						}

						<button type="submit" className="btn btn-primary btn-block" disabled={this.state.loading}>{this.state.btn_signin_text}</button>
						<p className="forgot-password text-right">
							Not Registered ? <Link to={"/sign-up"}>Sign up</Link>
						</p>
					</form>
				</div>
			</div>	
        );
    }
}
