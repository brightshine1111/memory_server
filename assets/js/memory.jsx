import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function game_init(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      score: 0,
      lastGuess: -1,
      tiles: getDummyTiles(),
      hold: false,
    }

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);
  }

  tileOnClick(tid) {
    this.props.channel.push("guess", {tile: tid})
      .receive("ok", this.gotView.bind(this));
  }

  resetBoard() {
    this.props.channel.push("reset", {})
      .receive("ok", this.gotView.bind(this));
  }
  
  renderTile(i) {
    if (this.state.hold) {
      return (
        <Tile tid={i} letter={this.state.tiles[i].letter} status={this.state.tiles[i].status} />
      );
    } else {
      return (
        <Tile tid={i} letter={this.state.tiles[i].letter} status={this.state.tiles[i].status} onClick={() => this.tileOnClick(i)}/>
      );
    }
  }

  // Render function
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col"><h3>{"Score: " + this.state.score}</h3></div>
          <div className="col"><button type="button" className="btn btn-outline-primary" onClick={() => this.resetBoard()}>Restart</button></div>
        </div>
        <div className="row">
          <div className="col">{this.renderTile(0)}</div>
          <div className="col">{this.renderTile(1)}</div>
          <div className="col">{this.renderTile(2)}</div>
          <div className="col">{this.renderTile(3)}</div>
        </div>
        <div className="row">
          <div className="col">{this.renderTile(4)}</div>
          <div className="col">{this.renderTile(5)}</div>
          <div className="col">{this.renderTile(6)}</div>
          <div className="col">{this.renderTile(7)}</div>
        </div>
        <div className="row">
          <div className="col">{this.renderTile(8)}</div>
          <div className="col">{this.renderTile(9)}</div>
          <div className="col">{this.renderTile(10)}</div>
          <div className="col">{this.renderTile(11)}</div>
        </div>
        <div className="row">
          <div className="col">{this.renderTile(12)}</div>
          <div className="col">{this.renderTile(13)}</div>
          <div className="col">{this.renderTile(14)}</div>
          <div className="col">{this.renderTile(15)}</div>
        </div>
      </div>
    );
  }
  
}

// form elements
function Tile(params) {
  let status = params.status;
  if (status == "selected") {
    return (
      <div className="border border-primary tile text-center align-middle alert alert-primary">
        <p>{ params.letter }</p>
      </div>
    );
  } else if (status == "matched") {
    return (
      <div className="border border-primary tile text-center align-middle alert alert-secondary">
        <p>{ params.letter }</p>
      </div>
    );
  } else {
    return (
       <div className="border border-primary tile text-center align-middle alert alert-primary" onClick={ params.onClick }>
        <p></p>
      </div>
    );
  }
}

function getDummyTiles() {
  var letters = ('XXXXXXXXXXXXXXXX').split("")
  var tiles = _.map(letters, function(letter) { return {letter: letter, status: "unmatched"}; });
  return tiles;
}
