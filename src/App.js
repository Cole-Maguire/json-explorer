import React from 'react';
import parseTextString from './parser';

class ResultContainer extends React.Component {

  render() {
    if (Object.keys(this.props.parsed).length === 0) {
      return (<div>empty</div>)
    } else {
      return (<ResultHeader key="" keyName="" className="top-level" child={this.props.parsed} />)
    }
  }
}

class ResultHeader extends React.Component {
  getChild() {
    if (typeof this.props.child === "undefined") {
      return "undefined";
    } else if (this.props.child === null) {
      return "null";
    } else if (typeof this.props.child === "object" && this.props.child !== null) {
      return Object.keys(this.props.child).map(k => {
        return <ResultHeader key={k} keyName={k} child={this.props.child[k]} />
      });
    } else {
      return this.props.child;
    }
  }
  render() {
    return (
      <div className={`resultHeader ${this.props.className}`}>
        <span className="fieldName">{this.props.keyName}</span>
        {this.getChild()}
      </div>)

  }
}

class FileHandler extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }
  handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.props.onFileParsed(parseTextString(e.target.result));
    }
    reader.onload = reader.onload.bind(this)
    reader.readAsText(file);
  }
  render() {
    return (<input type="file" id="file-upload" accept="application/json" onChange={this.handleFileUpload} />)
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { parsed: {} };
    this.handleParsed = this.handleParsed.bind(this);
  }
  handleParsed(obj) {
    this.setState({ parsed: obj })
    console.log(obj)
  }
  render() {
    return (<div id="app">
      <FileHandler onFileParsed={this.handleParsed} />
      <ResultContainer parsed={this.state.parsed}></ResultContainer>
    </div>)
  }
}

export default App;
