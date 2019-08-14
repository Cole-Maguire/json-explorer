import React from 'react';
import parseTextString from './parser';

class ResultContainer extends React.Component {

  render() {
    if (Object.keys(this.props.parsed).length === 0) {
      return (<div>empty</div>)
    } else {
      return (<div>
        <ResultHeader key="" keyName="" child={this.props.parsed} />
      </div>)
    }
  }
}

class ResultHeader extends React.Component {
  getChild() {
    if (typeof this.props.child === "object" && this.props.child !== null) {
      return Object.keys(this.props.child).map(k => {
        return <ResultHeader key={k} keyName={k} child={this.props.child[k]} />
      });
    } else {
      return this.props.child;
    }
  }
  render() {
    console.log(this.props.keyName)

    return (
      <div className="resultHeader">
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
    return (<div>
      <FileHandler onFileParsed={this.handleParsed} />
      <ResultContainer parsed={this.state.parsed}></ResultContainer>
    </div>)
  }
}

export default App;
