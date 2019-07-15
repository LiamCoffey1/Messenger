import React from "react";
import "./chat.css"

import {
  setNickname,
  setSocket,
} from "../utils/api"

import LoginScreen from "./LoginScreen";
import ChatScreen from "./ChatScreen";



import openSocket from 'socket.io-client';
import ErrorModal from "./ErrorModal";



class ChatContainer extends React.Component {

  componentDidCatch(error, info) {
    alert(info);
  }

  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      hasLoggedIn: false,
      errorMessage: null,
      infoDuration: 0,

    };
  }

   connect() {
    return new Promise(function(resolve, reject) {
      const socket = openSocket('http://192.168.0.228:8000', {
        reconnection: false
      });
      socket.on('connect', function() {
        setSocket(socket);
        resolve();
      });
      socket.on('error', function(err) {
        reject(err);
      });
      socket.io.on('connect_error', function() {
        reject("Error connecting to server!")
      });
    });
  }

  setErrorMessage = (params) => {
    console.log(params);
    this.setState({errorMessage: params})
  };

  remove = () => {
    this.setState({hasLoggedIn: false, nickname: ""});
  };

  closeErrorModal = () => {
    this.setState({errorMessage: null})
  };

  set(nickname) {
    setNickname(nickname)
      .then(() => {
        this.setState({hasLoggedIn: true, nickname: nickname});
      })
      .catch((error) => {
        this.setErrorMessage({text: error, options: ["ok"]});
      });
  }


  login = (nickname) => {
    this.connect()
      .then(()=>this.set(nickname || this.state.nickname))
      .catch((error) => {
        this.setErrorMessage({text: error, options: ["retry", "cancel"]});
      });
  };


  render() {
    const {hasLoggedIn, errorMessage} = this.state;
    console.log(this.state);
    return (
      <div className="chatContainer">
        <ErrorModal {...this.props}
                    login = {this.login}
                    closeErrorModal = {this.closeErrorModal}
                    remove = {this.remove}
                    error = {this.state.errorMessage}/>
        {
          hasLoggedIn ? <ChatScreen {...this.props}
                                    remove = {this.remove}
                                    nickname = {this.state.nickname}/>
                      :<LoginScreen {...this.props}
                       setErrorMessage = {this.setErrorMessage}
                       login = {this.login}/>
          }
      </div>
    )
  }


}

export default ChatContainer;