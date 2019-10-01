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

  constructor(props) {
    super(props);
    this.getExample = this.getExample.bind(this);
  }
  getAllParents(node) {
    if (node.classList.contains("top-level")) {
      return []
    } else {
      return [...this.getAllParents(node.parentNode), node]
    }
  }

  getRandomValue(obj, path) {
    // Recurses through an object to the right depth, then finds a random value at that level

    if (Array.isArray(obj)) {
      //Get a random value if we're dealing with an Array of Values
      const newObj = obj[Math.floor(Math.random() * obj.length)];
      return this.getRandomValue(newObj, path);
    } else if (path.length > 0) {
      //Just get the next value in the tree if we know the key name instead
      const newObj = obj[path[0].querySelector(".fieldName").textContent];
      return this.getRandomValue(newObj, path.slice(1, path.length));
    } else {
      return obj;
    }
  }
  getExample(e) {
    const parents = this.getAllParents(e.target.parentNode);

    const reader = new FileReader();

    reader.onload = (e) => {
      let obj = JSON.parse(e.target.result);
      obj = obj.length === undefined ? [obj] : obj;
      const x = this.getRandomValue(obj, parents);
      console.log(x)
    }
    reader.onload = reader.onload.bind(this)
    reader.readAsText(document.querySelector("input#file-upload").files[0]);
  }


  getChild() {
    function isMalformedArray(obj) {
      // I'm aware of Array.isArray() obviously, 
      // but for whatever reason that returns false for arrays that have been munged by React.
      // My guess is it's because it stores the keys [0,1,2...n] as strings for some godforsaken reason
      // I can't be bothered plumbing the depths to discover where this happens, so here we are.

      const keys = Object.keys(obj).map(k => Number(k));
      // An empty object will show as an array if we don't check for it
      return keys.length !== 0 && keys.every((key, index) => key === index);
    }

    if (typeof this.props.child === "undefined") {
      return "undefined";
    } else if (this.props.child === null) {
      return "null";
    } else if (typeof this.props.child === "object" && this.props.child !== null) {

      if (isMalformedArray(this.props.child)) {
        const arr = Object.values(this.props.child)
          .map(item => {
            // Undefined and nulls don't show unless converted to strings
            if (typeof item === "undefined") { return "undefined" }
            else if (item === null) { return "null" }
            else { return item }
          })
        const counter = arr.reduce((accum, val) => {
          if (!(val in accum)) accum[val] = 0
          accum[val] += 1
          return accum
        }, {});
        
        const counterEnglish = Object.entries(counter).map(([key, val]) => val > 1 ? `${val}x ${key}s` : `${val}x ${key}`)
        return `[${arr.length} entries: ${counterEnglish.join(", ")}]`

      } else {
        //Standard object
        return Object.keys(this.props.child).map(k => {
          return <ResultHeader key={k} keyName={k} child={this.props.child[k]} />
        });
      }

    } else {
      return this.props.child;
    }
  }
  render() {
    return (
      //Ternary prevents an "undefined" class showing up when there is no class passed
      <div className={`resultHeader${this.props.className ? ` ${this.props.className}` : ""}`}>
        <span className="fieldName">{this.props.keyName}</span>
        {this.getChild()}
        <button onClick={this.getExample} type="button" >Show Example</button>
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
