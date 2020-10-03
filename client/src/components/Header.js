import React, { Component } from "react";
import { Link } from "react-router-dom";

//import axios from 'axios'
//import * as Constants from '../Constants';

export default class Header extends Component {
	
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.state = {
			avatar : ""
		}
	}
	
	componentDidMount(){
		if(localStorage.getItem('is_login')=='true') {
			let user_detail = JSON.parse(localStorage.getItem('user_detail')); 
			this.setState({avatar: user_detail.avatar });
		}
	}
	
	handleLogout() {
		//e.preventDefault() ;
		console.log('Log out');
		localStorage.removeItem('is_login');
		localStorage.removeItem('user_token');
		//this.props.history.push("/sign-in");
		window.location.href="/sign-in";
	}
	
	render() {
		return(
		  <nav className="navbar navbar-expand-lg navbar-light">
			<div className="container">
			  <Link className="navbar-brand" to={"/sign-in"}>GlobalSignIn</Link>
			  <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
				<ul className="navbar-nav ml-auto">
				{ localStorage.getItem('is_login')=='true' && (
					<>
					  <li className="nav-item">
						 <img src={this.state.avatar} className="rounded" style={{width:"40px"}} /> 
					  </li>	
					  <li className="nav-item">
						<Link className="nav-link" to={"/sign-in"}>New Game</Link>
					  </li>
					  <li className="nav-item">
						<Link className="nav-link" to={"/history"}>History</Link>
					  </li>
					  <li className="nav-item">
						<a className="nav-link" href="#" onClick={this.handleLogout}>LogOut</a>
					  </li>
					</>
				)}
				
				{ localStorage.getItem('is_login')===null && (
					<>
						<li className="nav-item">
							<Link className="nav-link" to={"/sign-in"}>Login</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={"/sign-up"}>Sign up</Link>
						</li>
					</>
				)}
				
				
				  
				</ul>
			  </div>
			</div>
		  </nav>
		
		)
	}
	
}
