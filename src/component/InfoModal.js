import React from 'react'


class InfoModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      duration : 0
    }
  }

  componentWillMount() {
    this.setState({duration : this.props.duration});
    setTimeout(function() {
          this.setState({duration: 0});
      }, this.state.duration
    )
  }


  render() {
    if(this.state.duration !== 0)
      return(
        <div className="errorBackground">
          <div className="errorContainer">
            <p class = "errorText">{this.props.info}</p>
          </div>
        </div>
      );
    else return null;
  }
}

export default InfoModal