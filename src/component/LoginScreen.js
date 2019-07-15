import React from "react";

import "../css/login.css"

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nickname : ""
    };
  }
  
  handleChange = (event) => {
    this.setState({nickname: event.target.value});
  };

  handleKeyEvent = (event) => {
    if(event.key === 'Enter'){
      this.props.login(this.state.nickname);
      event.preventDefault();
    }
  };

  login = () => {
    const {nickname} = this.state;
    this.props.login(nickname);
  };

  render() {

    return (
      <div className = "login">
      <div className = "loginContainer container">
        <div className = "login-content">
          <h1>Login</h1>
          <p>Please enter a nickname to be identified by</p>
            <input placeholder="Nickname"
                   value={this.state.nickname}
                   id = "nickname"
                   onChange={event => this.handleChange(event)}
                    onKeyPress={event => this.handleKeyEvent(event)}/>
          <li/>
          <button onClick={this.login}>Enter</button>
        </div>
      </div>
      </div>
    )
  }

}

export default LoginScreen
