import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/Signup";
import Header from "./components/Header";
import UserDetail from "./components/UserDetail";
import NotFound from "./components/NotFound";
import History from "./components/History";

function App() {
  return (
	<Router>
		<div className="App">
		  
		  <Header/>
			<Switch>
				<Route exact path='/'  >
					{localStorage.getItem('is_login')=='true' ? <Redirect to="/user-detail" /> : <Login />}
				</Route>
				<Route path='/sign-in'  >
					{localStorage.getItem('is_login')=='true' ? <Redirect to="/user-detail" /> : <Login />}
				</Route>
				<Route path='/sign-up'  >
					{localStorage.getItem('is_login')=='true' ? <Redirect to="/user-detail" /> : <SignUp />}
				</Route>
				
				<Route path='/user-detail'  >
					{localStorage.getItem('is_login')=='true' ?  <UserDetail /> : <Redirect to="/sign-in" /> }
				</Route>
				
				<Route path='/history'  >
					{localStorage.getItem('is_login')=='true' ?  <History /> : <Redirect to="/sign-in" /> }
				</Route>
				/*
				<PrivateRoute path="/user-detail">
					<UserDetail />
				</PrivateRoute>
				*/
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</div>
	</Router>
  );
}

export default App;

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem('is_login')=='true' ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
