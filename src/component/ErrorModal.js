import React from 'react'

import '../css/error-modal.css'


class ErrorModal extends React.Component {

  handleClick = (value) => {
    switch(value) {
      case 'retry':
        this.props.closeErrorModal();
        this.props.login(null);
        break;
      default:
        this.props.closeErrorModal();
    }
  };

  renderButtons() {
    const {error} = this.props;
    const {options} = error;
    return(
      <div className="row">
      {options.map((value, index, array) => {
        console.log(options.length);
          if(options.length === 1) {
            return (
              <button key = {index} onClick={this.handleClick.bind(this, value)} type="button" className={"btn-single"}>{value}</button>
            )
          }  else {
            return ( <button key = {index} onClick={this.handleClick.bind(this, value)} type="button" className={"btn-multi-" + (index+1)}>{value}</button>)
          }
      })}
      </div>
    )
  }
  
  render() {
    if(this.props.error)
    return(
        <div className="errorBackground">
          <div className="errorContainer">
            <p className = "errorText">{this.props.error.text}</p>
           {this.renderButtons()}
          </div>
        </div>
  )
    else return null;
  }
}

export default ErrorModal