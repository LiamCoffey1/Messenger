import React from 'react';


import Textarea from 'react-textarea-autosize';

import {
  pushMessage,
  removeUser,
  subscribeToServer,
  unSubscribeListeners
} from "../utils/api";

class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      messageText: "",
      alertNew: false,
      pendingScroll: false,
      notifications: [],
      sidebarShown: true,
    };


    this.messageBoxRef = React.createRef();


    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submitMessage = this.submitMessage.bind(this);

    subscribeToServer((err, bundle) => {
      if(err) throw new Error(err);
      const {users, messages} = bundle;
      this.setState({
        users,
        messages
      });
      if(this.state.pendingScroll) {
        this.scrollToBottomOfMessageBox();
        this.setState({pendingScroll: false})
      }
    });

  }

  componentWillUpdate(nextProps, nextState) {
    let hasChanged = (nextState.messages.length !== this.state.messages.length);
    if(hasChanged) {
      if(this.isAtBottomOfMessageBox()) {
        this.setState({pendingScroll:true, alertNew: false});
      } else {
        this.setState({alertNew:true});
      }
    }
  }
  isAtBottomOfMessageBox() {
    const {current: messageBox} = this.messageBoxRef;
    return messageBox.scrollHeight - messageBox.scrollTop === messageBox.clientHeight;
  }

  scrollToBottomOfMessageBox() {
    const {current: messageBox} = this.messageBoxRef;
    const {scrollHeight} = messageBox;
    messageBox.scrollTo(0,  scrollHeight);
  }



  submitMessage() {
    const {messageText} = this.state;
    const {nickname} = this.props;
    pushMessage(messageText, nickname);
    this.setState({
      messageText:"",
      pendingScroll: true
    });
  }

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return removeUser(this.props.nickname);
    });
  };

  componentWillMount() {
    this.setupBeforeUnloadListener();
  }

  componentWillUnmount() {
    unSubscribeListeners();
    removeUser(this.props.nickname);
  }

  handleChange(event) {
    switch(event.target.id) {
      case "message":
        this.setState({messageText: event.target.value});
        break;
      case "new-message":
        this.scrollToBottomOfMessageBox();
        break;
      case "sidebar":
        this.setState({sidebarShown: !this.state.sidebarShown});
      break;
      default:this.props.remove();
    }
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      if(event.target.value.length) this.submitMessage();
      event.preventDefault();
    }
  };

  onScroll = () => {
    if(this.isAtBottomOfMessageBox())
      this.setState({alertNew:false})
  };

  render() {
  const {sidebarShown} = this.state;
    return (
      <div>
            <div className="chatTitle">
              <h4>Chat server</h4>
              <span data-toggle="tooltip" title="Settings" className="glyphicon glyphicon-wrench settingsButton"/>
              <span data-toggle="tooltip" title="Disconnect" onClick={this.handleChange} className="glyphicon glyphicon glyphicon-log-out settingsButton"/>
              <span data-toggle="tooltip" id = "sidebar" title="Show/hide users" onClick={this.handleChange} className="glyphicon glyphicon glyphicon-user logoutButton"/>
            </div>

              <div className={"messageBox" +  (!sidebarShown ? " toggled" : "")}
                   onTouchStart={this.onScroll}
                   onScroll = {this.onScroll}
                   ref = {this.messageBoxRef}>
                <div className="container-fluid">
                  {this.state.messages.map((value, index, array) => {
                    const {nickname} = this.props;
                    const isOwnMessage = ((value.name === nickname) && nickname !== "");
                    const {type, name, timestamp, message} = value;
                    switch(type) {
                      case 'notification':
                        return (<div id="message notification" key={index}>
                            <p id = "notification">{message}</p>
                        </div>);

                      default:
                        return (
                          <div id="message" key={index}>
                            { index !== 0 && array[index-1].timestamp !== timestamp && <p style = {{textAlign:'center'}}>{timestamp}</p>}
                            <p className = {isOwnMessage ? "other" : "own"}>{name}</p>
                            <div className={"message" + ((name === nickname) && nickname !== "" ? "-own" : "")}>
                              <p>{message}</p>
                            </div>
                          </div>
                        );

                    }
                  })}
                  {this.state.alertNew && <div onClick={this.handleChange} id = "new-message" class = "newMessageBox">new messages</div>}
                </div>
              </div>
              <div className={"sideBar" +  (!sidebarShown ? " toggled" : "")}>
                <li className="list-group-item-heading">
                  <p>Users online: {this.state.users.length}</p>
                </li>
                <div className="list-group">
                  {
                    this.state.users.map((value, index) => {
                      return (
                        <li className="list-group-item1"
                            id = {value}
                            key={index}>
                          <span className="activeDot"/>
                          <p>{value}</p>
                        </li>
                      )
                    })
                  }
                </div>
              </div>


          <div className = "bottomBar">
            <div className="input-group">
              <Textarea  className="form-control custom-control"
                         rows="2"
                         ref={tag => (this.textarea = tag)}
                         value = {this.state.messageText}
                         minRows={2}
                         maxRows={8}
                         placeholder="Aa"
                         onKeyPress={(e)=> {
                           this.handleKeyPress(e)
                         }}
                         onChange={event => {
                           console.log("change");
                           this.handleChange(event)
                         }}
                         id="message"/>
              <span className="input-group-addon">
               ☺
                  </span>
            </div>
            <span  onClick={this.submitMessage} className="glyphicon glyphicon-chevron-right">
                  </span>
          </div>
        }
      </div>
    )
  }


}

export default ChatScreen;