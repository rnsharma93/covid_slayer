import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from 'axios'
import * as Constants from '../Constants';

import { MyLoader } from './MyLoader';



export default class UserDetail extends Component {
	
	constructor(props) {
		//console.log(Constants.API_URL);
		super(props);
		
		this.state = {	user : JSON.parse(localStorage.getItem('user_detail')),
						time_left : 60,
						player_turn : 1,
						logs : [],
						my_health : 100,
						dragon_health : 100,
						game_on : false,
						my_power_attack : true,
						my_healing: true,
						dragon_power_attack: true,
						dragon_healing: true,
						loading_status : false,
						error_message: ""
					};
					
		this.startGame = this.startGame.bind(this);			
		this.handleAttack = this.handleAttack.bind(this);
		this.handleBlast = this.handleBlast.bind(this);
		this.handleHeal = this.handleHeal.bind(this);
		this.handleGiveup = this.handleGiveup.bind(this);
		this.findWinner = this.findWinner.bind(this);
	}
	
	handleLogout() {
		//e.preventDefault() ;
		localStorage.removeItem('is_login');
		localStorage.removeItem('user_token');
		//this.props.history.push("/sign-in");
		window.location.href="/sign-in";
	}
	
	componentDidMount() {
		if(localStorage.getItem('user_token')) {
			this.checkLoginUser();
		}
		
	}
	
	componentDidUpdate() {
		this.findWinner();
		
		
	}
	
	checkLoginUser() {
		this.setState({loading_status:true});
		const config = {
			headers: {
				'Authorization': 'Bearer '+localStorage.getItem('user_token')
			}
		}
		
		axios
		.get(Constants.API_URL+"user", config)
		.then((res) => {
			console.log(JSON.stringify(res));
			localStorage.setItem('user_detail',JSON.stringify(res.data.user));
			this.setState({user : res.data.user,loading_status:false,time_left:res.data.game_duration});
			
			
		})
		.catch((error) => { 
			this.setState({loading_status:false});
			//console.log("Check Login User Error");	
			if (error.response) {
			  console.log(error.response);
			  this.handleLogout();
			} else if (error.request) {
			  console.log(error.request);
			} else {
			  console.log('Error', error.message);
			}
			//console.log(error.config);
			//this.handleLogout();
		});
	}
	
	startGame() {
		this.timer = setInterval(
		  () => this.tick(),
		  1000
		);
		this.setState({
			game_on : true,
			error_message:""
		});
	}
	
	tick() {
		/*
		if(this.state.time_left<=0 ) {
			//this.findWinner();
			clearInterval(this.timer);
			this.setState({
				game_on : false,
				time_left : 60
			});
		}
		*/
		
		if(this.state.game_on) {
			this.setState({
			  time_left:this.state.time_left-1,
			});
		}
		
	}
	// Handle Attack -> Decrease a random health of opponent's
	handleAttack() {
		let turn = this.state.player_turn;
		let random = this.randomNumber();
		if(turn==1) {
			this.state.logs.unshift(this.state.user.name+" Attack by "+random);
			this.setState({player_turn:2,dragon_health:this.state.dragon_health-random});	
		} else if(turn==2) {
			this.state.logs.unshift("Dragon Attack by "+random);
			this.setState({player_turn:1,my_health:this.state.my_health-random});
		}
		
		//this.findWinner();
	}
	
	//Blast will descrease random health of opponent's and new random health of self
	handleBlast() {
		let turn = this.state.player_turn;
		let random1 = this.randomNumber();
		let random2 = this.randomNumber();
		if(turn==1) {
			this.setState({player_turn:2,dragon_health:this.state.dragon_health-random1,my_health:this.state.my_health-random2});	
			this.state.logs.unshift(this.state.user.name+" Did Blast. Self Lost : "+random2+". Dragon Lost : "+random1);
		} else if(turn==2) {
			this.setState({player_turn:1,dragon_health:this.state.dragon_health-random1,my_health:this.state.my_health-random2});	
			this.state.logs.unshift("Dragon Did Blast. Self Lost : "+random1+". "+this.state.user.name+" Lost : "+random2);
		}
		//this.findWinner();
	}
	
	// Healing -> increase the health by random number to self
	handleHeal() {
		let turn = this.state.player_turn;
		let random = this.randomNumber();
		let new_health = 0;
		if(turn==1 ) {
			new_health = this.state.my_health+random;
			if(new_health>100) {
				new_health=100;
			}
			this.setState({player_turn:2,my_health:new_health});	
			this.state.logs.unshift(this.state.user.name+" healed by "+random+". Updated health : "+new_health);
		} else if(turn==2) {
			new_health = this.state.dragon_health+random;
			if(new_health>100) {
				new_health=100;
			}
			this.setState({player_turn:1,dragon_health:new_health});
			this.state.logs.unshift("Dragon healed by "+random+". Updated health : "+new_health);
		}
		//this.findWinner();
	}
	
	handleGiveup() {
		let turn = this.state.player_turn;
		
		if(turn==1) {
			this.setState({my_health:0});	
			this.state.logs.unshift(this.state.user.name+" Giveup, Lost the game");
		} else if(turn==2) {
			this.setState({dragon_health:0});
			this.state.logs.unshift("Dragon Giveup, Lost the game");
		}
		
		
		//this.findWinner();
	}
	
	randomNumber(limit=10) {
		return Math.floor(Math.random() * limit)+1; 
	}
	
	findWinner() {
		if(this.state.my_health<=0 || this.state.dragon_health<=0 || this.state.time_left<=0) {
			if(this.state.my_health > this.state.dragon_health) {
				alert("You Won :) ");
			} else if(this.state.my_health < this.state.dragon_health) {
				alert("You Loose :( ");
			} else if(this.state.my_health == this.state.dragon_health) {
				alert(" Draw ");
			} else {
				alert("Nothing!");
			}
			this.postGame();
			this.resetGame();
		}
		
		console.log("Find Winner");
		  
	}
	
	resetGame(){
		
		this.setState({
			time_left : 60,
			player_turn : 1,
			logs : [],
			my_health : 100,
			dragon_health : 100,
			game_on : false,
		})
		clearInterval(this.timer);
	}
	
	postGame() {
		this.setState({loading_status:true});
		const config = {
			headers: {
				'Authorization': 'Bearer '+localStorage.getItem('user_token'),
				'Content-Type': 'application/json'
			}
		}
		
		let params = {my_health:this.state.my_health,
					  dragon_health:this.state.dragon_health,
					  time_left:this.state.time_left,
					  logs: this.state.logs
					};
		
		axios
		.post(Constants.API_URL+"game", params, config)
		.then((res) => {
			this.setState({loading_status:false});
			console.log(JSON.stringify(res));
			
		})
		.catch((error) => { 
			this.setState({loading_status:false});
			//console.log("Check Login User Error");	
			if (error.response) {
			  this.setState({error_message:error.request.statusText});
			  console.log("Error Response");	
			  console.log(error.response);
			  
			} else if (error.request) {
			  this.setState({error_message:error.request.statusText});
			  console.log("Error Request");
			  console.log(error.request);
			  
			} else {
			  console.log('Error', error.message);
			}
			//console.log(error.config);
			//this.handleLogout();
		});
		
		
	}
	
    render() {
		
		let user = this.state.user;
		
		let comments = this.state.logs.map((comment,key) =>  <li className="text-left" key={key}>{comment}</li>);
		
		return (
            <div className="container">
				<h1>Hello {user.name}</h1>
				<br/>
				{this.state.error_message!="" && (
					<div className="alert alert-danger">{this.state.error_message}</div>
				)}
				{!this.state.loading_status && (
					<div className="row">
						<div className="col-sm-8">
							<div className="row">
								<div className="col-sm-6">
									<h3>{user.name}</h3>
									<div className="progress" >
									  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width:this.state.my_health+"%"}}>{this.state.my_health} %</div>
									</div> 
								</div>
								<div className="col-sm-6">
									<h3>Dragon</h3>
									 <div className="progress" >
									  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width:this.state.dragon_health+"%"}}>{this.state.dragon_health} %</div>
									</div> 
								</div>
							</div>
							<br/>
							<br/>
							{ !this.state.game_on && (
								<div className="btn btn-warning" onClick={this.startGame}>Start</div>
							
							)}
							
							{ this.state.game_on && (
								<div className="row">
									<div className="col-sm-4">
										<button className='btn btn-danger btn-block' disabled> { this.state.player_turn==1 ? "Your" : "Dragon" } 's Turn
										</button>
									</div>
									<div className="col-sm-2">
										<button className="btn btn-success" onClick={this.handleAttack}  >Attack</button>
									</div>
									<div className="col-sm-2">
										<button className="btn btn-success" onClick={this.handleBlast} >Blast</button>
									</div>
									<div className="col-sm-2">
										<button className="btn btn-success" onClick={this.handleHeal} >Heal</button>
									</div>
									<div className="col-sm-2">
										<button className="btn btn-success" onClick={this.handleGiveup} >Give Up</button>
									</div>
									
								</div>
							)}
							
						
						</div>
						
						<div className="col-sm-4">
							<div className="card">
								<div className="card-header" >
									<span> <h5 className="float-left"> Commentry </h5> </span>
									<span className="float-right">Time Left : {this.state.time_left} Seconds</span>
								</div>
								<div className="card-body " id="commentry">
									<ul >
									{
										comments
									}
									</ul>
								
								</div>
							</div>
						</div>
					
					</div>
				)}
				{this.state.loading_status && (
					<MyLoader />	
				)}
			</div>
        );
    }
}