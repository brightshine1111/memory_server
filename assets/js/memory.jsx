import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_game(root) {
  ReactDOM.render(<MemoryGame />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    
    // fill in initial state
    this.state = {
      score: 0,
      lastGuess: -1,
      tiles: getNewTiles(),
    };
  }
  
  isGameComplete() {
    
  }
  
  // Game Functions
  tileOnClick(tid) {
    let newTiles = this.state.tiles.slice();
    let newScore = this.state.score + 1;
    let lastGuess = this.state.lastGuess;
    let newLastGuess = -1;  // reset by default
    
    console.log("OnClick called. Last guess: " + lastGuess);
    
    if(lastGuess == -1) {
      // first move
      newTiles[tid].status = "selected";
      newLastGuess = tid;
      console.log("Selected " + tid);
      
      this.setState({
        score: newScore,
        lastGuess: newLastGuess,
        tiles: newTiles,
        hold: false,
      });
      
    } else if (this.state.tiles[tid].letter == this.state.tiles[lastGuess].letter) {
      // match found
      newTiles[tid].status = "matched";
      newTiles[lastGuess].status = "matched";
      console.log("Found match");
      
      this.setState({
        score: newScore,
        lastGuess: newLastGuess,
        tiles: newTiles,
      });
      
    } else {
      console.log("Match not found");
      newTiles[tid].status = "selected";
      // change state then pause
      this.setState({
        score: newScore,
        tiles: newTiles,
        hold: true,
      });
      
      this.render();
      
      // reset display of tiles on next render
      setTimeout(() => {
        newTiles.forEach(function(tile) {
          if (tile.status == "selected")
            tile.status = "unmatched";
        });
        
        newLastGuess = -1;
        console.log("Re-rendering...");
        this.setState({
          lastGuess: newLastGuess,
          tiles: newTiles,
          hold: false,
        });
      }, 1500); 
    }
  }
  
  resetBoard() {
    this.setState({
      score: 0,
      lastGuess: -1,
      tiles: getNewTiles(),
    });
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

function getNewTiles() {
  var letters = _.shuffle('AABBCCDDEEFFGGHH');
  var tiles = _.map(letters, function(letter) { return {letter: letter, status: "unmatched"}; });
  return tiles;
}
