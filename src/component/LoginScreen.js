import React from "react";
import ErrorModal from "./ErrorModal";

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nickname : ""
    }
    console.log(this.props);
    //this.props.setErrorMessage({type: 'single'});
  }

  handleChange = (event) => {
    this.setState({nickname: event.target.value});
  };

  login = () => {
    const {nickname} = this.state;
    this.props.login(nickname);
  }

  render() {
    const {errorMessage} = this.props;
    console.log(errorMessage);
    return (
      <div class = "login">

      <div className = "loginContainer container">
        <div className = "login-content">
          <h1 className="inset-shadow">Login</h1>
          <p>Please enter a nickname to be identified by</p>
          <input value={this.state.nickname} id = "nickname" onChange={event => this.handleChange(event)}/>
          <button onClick={this.login}>Enter</button>

        </div>
      </div>
      </div>
    )
  }

}

export default LoginScreen
