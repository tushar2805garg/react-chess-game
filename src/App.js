import React from "react";
import ReactDom from "react-dom";
import "./styles.css";
import Loader from "react-loader-spinner";
import new_moves from "./new_moves";
import piece from "./piece";
import swal from "sweetalert2";
// import { Link } from "react-router-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whosTurn: this.props.myTurn, // Initially True For White and False for Black. 
      board: [[]],
      heading: "",
      TEAMA: [[]],
      TEAMB: [[]],
      prevx: -1,
      prevy: -1,
      enableHoverState: 1,
      currState: "off",
      currentCount: 60,
      totalTime: 0,
      isgameOver: 0,
      loading: true,
      tm: 1000
    };
    this.currTurn=this.props.currTurn; // It initially consists of A's Turn; // i guess not in use..
    this.turn = this.props.piece; // A for White and  B for Black. always fix never gonna to be change.
    this.gameOver = false;
    this.counter = 0;
  }
  diffboard() {
    const arr = [];
    for (var i = 0; i < 8; i++) {
      const new_arr = [];
      for (var j = 0; j < 8; j++) {
        new_arr.push(0);
      }
      arr.push(new_arr);
    }
    return arr;
  }
  createboard() {
    const arr = [];
    for (var i = 0; i < 8; i++) {
      const new_arr = [];
      let Teamname = "Empty";
      let player = "Empty";
      if (i < 2) {
        Teamname = "A";
      }
      if (i >= 6) {
        Teamname = "B";
      }
      for (var j = 0; j < 8; j++) {
        if (j === 0 || j === 7) {
          player = "Rook";
        }
        if (j === 1 || j === 6) {
          player = "Knight";
        }
        if (j === 2 || j === 5) {
          player = "Bishop";
        }
        if (j === 3) {
          player = "King";
        }
        if (j === 4) {
          player = "Queen";
        }
        if (i === 1 || i === 6) {
          player = "Pawn";
        }
        if (i === 7) {
          if (j === 3) {
            player = "Queen";
          }
          if (j === 4) {
            player = "King";
          }
        }
        if (Teamname === "Empty") {
          player = "Empty";
        }
        new_arr.push({ TEAMNAME: Teamname, PLAYER: player });
      }
      arr.push(new_arr);
    }
    return arr;
  }
  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
    if (this.state.currentCount < 1) {
      if (this.state.turn === "A") {
        swal("You cannot make a move and hence Team BLACK Wins", {
          buttons: false,
          timer: 3000
        });
      } else {
        swal("You cannot make a move and hence Team WHITE Wins", {
          buttons: false,
          timer: 3000
        });
      }
      this.setState({ isgameOver: 1 });
    }
    if (this.state.isgameOver === 1) {
      clearInterval(this.intervalId);
    }
  }
  totaltimer() {
    this.setState({
      totalTime: this.state.totalTime + 1
    });
    if (this.state.isgameOver === 1) {
      clearInterval(this.totaltimerId);
    }
  }
  componentDidMount() {
    // console.log(this.state.whosTurn);
    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      // console.log(this.turn);
      // console.log(msg.message.turn);
      if(msg.message.prevx!=-1 && msg.message.nowtoturn === this.turn){
        console.log("HELLO");
        console.log(this.state.whosTurn);
        this.publishMove(msg.message.prevx,msg.message.prevy,msg.message.currx,msg.message.curry);
      }
      // Start a new round
      if(msg.message.reset){
        this.setState({
          squares: Array(9).fill(''),
          whosTurn : this.props.myTurn
        });

        this.turn = 'A';
        this.gameOver = false;
        this.counter = 0;
        swal.close()
      }

      // End the game and go back to the lobby
      else if(msg.message.endGame){
        swal.close();
        this.props.endGame();
      }
    });
    this.setState({
      whosTurn: this.props.myTurn,
      board: this.createboard(),
      TEAMA: this.diffboard(),
      TEAMB: this.diffboard(),
      heading: "Chess Game",
      prevx: -1,
      prevy: -1,
      turn: "A",
      enableHoverState: 1,
      currState: "off",
      currentCount: 60,
      totalTime: 0,
      isgameOver: 0,
      loading: true,
      tm: 1000
    });
    this.intervalId = setInterval(this.timer.bind(this), this.state.tm);
    this.totaltimerId = setInterval(this.totaltimer.bind(this), this.state.tm);
  }
  SetToSpecifiedValue(xx, yy, objectt, value) {
    let arr = this.diffboard();
    let player = this.state.board[xx][yy];
    player = player.PLAYER; // store name of piece of teamA / teamB;
    for (var i = 0; i < objectt.length; i++) {
      var curx = xx + objectt[i].x;
      var cury = yy + objectt[i].y;
      while (curx < 8 && cury < 8 && curx >= 0 && cury >= 0) {
        if (
          this.state.board[curx][cury].TEAMNAME ===
          this.state.board[xx][yy].TEAMNAME
        ) {
          break;
        } else {
          if (
            player === "Pawn" &&
            this.state.board[curx][cury].PLAYER !== "Empty" &&
            this.state.board[xx][yy].TEAMNAME !==
              this.state.board[curx][cury].TEAMNAME
          ) {
            //
          } else {
            if (this.state.board[curx][cury].PLAYER === "King") {
              const z = this.state.board[curx][cury].PLAYER;
              console.log(z);
              arr[curx][cury] = 2;
            } else {
              arr[curx][cury] = Number(value);
            }
            curx = curx + objectt[i].x;
            cury = cury + objectt[i].y;
          }
        }
        if (
          player === "Pawn" ||
          player === "Knight" ||
          player === "King" ||
          (this.state.board[curx - objectt[i].x][cury - objectt[i].y]
            .TEAMNAME !== this.state.board[xx][yy].TEAMNAME &&
            this.state.board[curx - objectt[i].x][cury - objectt[i].y]
              .TEAMNAME !== "Empty")
        ) {
          break;
        }
      }
    }
    if (player === "Pawn") {
      if (this.state.board[xx][yy].TEAMNAME === "A") {
        if (xx === 1) {
          if (
            arr[xx + 1][yy] === 1 &&
            this.state.board[xx + 2][yy].TEAMNAME === "Empty"
          ) {
            arr[xx + 2][yy] = 1;
          }
        }
        if (
          xx < 7 &&
          yy > 0 &&
          this.state.board[xx + 1][yy - 1].PLAYER !== "Empty" &&
          this.state.board[xx + 1][yy - 1].TEAMNAME !==
            this.state.board[xx][yy].TEAMNAME
        ) {
          arr[xx + 1][yy - 1] = Number(value);
        }
        if (
          xx < 7 &&
          yy < 7 &&
          this.state.board[xx + 1][yy + 1].PLAYER !== "Empty" &&
          this.state.board[xx + 1][yy + 1].TEAMNAME !==
            this.state.board[xx][yy].TEAMNAME
        ) {
          arr[xx + 1][yy + 1] = Number(value);
        }
      } else {
        if (xx === 6) {
          if (
            arr[xx - 1][yy] === 1 &&
            this.state.board[xx - 2][yy].TEAMNAME === "Empty"
          ) {
            arr[xx - 2][yy] = 1;
          }
        }
        if (
          xx > 0 &&
          yy > 0 &&
          this.state.board[xx - 1][yy - 1].PLAYER !== "Empty" &&
          this.state.board[xx - 1][yy - 1].TEAMNAME !==
            this.state.board[xx][yy].TEAMNAME
        ) {
          arr[xx - 1][yy - 1] = Number(value);
        }
        if (
          xx > 0 &&
          yy < 7 &&
          this.state.board[xx - 1][yy + 1].PLAYER !== "Empty" &&
          this.state.board[xx - 1][yy + 1].TEAMNAME !==
            this.state.board[xx][yy].TEAMNAME
        ) {
          arr[xx - 1][yy + 1] = Number(value);
        }
      }
    }
    return arr;
  }
  Clicked(xx, yy) {
    if (this.state.isgameOver === 1) {
      swal.fire({
        position: 'center',
        allowOutsideClick: false,
        text: 'Game is over Press the button on your screen to go back..',
        width: 275,
        padding: '0.7em',
        timer:2000,
        customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
        }
      })
      return;
    }
    let arr = this.state.board;
    if (this.state.prevx === -1 && this.state.prevy === -1) {
      if (arr[xx][yy].PLAYER !== "Empty") {
        if (this.state.whosTurn === false) {
          swal.fire({
            position: 'center',
            text: 'Its your opponents turn',
            width: 275,
            padding: '0.7em',
            timer: 1000,
            showConfirmButton:false,
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
            }
          })
        }
        else if(this.turn !==arr[xx][yy].TEAMNAME){ // you are moving your opponent's piece that is wrong;
          swal.fire({
            position: 'center',
            showConfirmButton:false,
            timer: 1000,
            text: 'Stop! You are moving your opponents piece.',
            width: 275,
            padding: '0.7em',
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
            }
          })
        }
         else {
          this.setState({ prevx: xx, prevy: yy });
        }
      }
      return;
    }
    let play = arr[this.state.prevx][this.state.prevy].PLAYER;
    if (
      play === "Pawn" &&
      arr[this.state.prevx][this.state.prevy].TEAMNAME === "B"
    ) {
      play = "PawnBlack";
    }
    play = new_moves[play];
    let clicked_array = this.SetToSpecifiedValue(
      this.state.prevx,
      this.state.prevy,
      play,
      1
    );
    clicked_array = clicked_array[xx][yy];
    if (clicked_array === 0) {
      this.setState({ prevx: -1, prevy: -1 });
      swal.fire({
        position: 'center',
        showConfirmButton:false,
        title: 'Wait!',
        text: 'Wrong Move',
        width: 275,
        timer:500,
        padding: '0.7em',
        customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
        }
      })
    } else {
      let arr = this.state.board;
      if (arr[xx][yy].PLAYER === "King") {
        if (this.state.whosTurn === true) {
          swal.fire({
            position: 'center',
            title: 'Congratulations!',
            text: 'You Won the Match',
            width: 275,
            padding: '0.7em',
            showConfirmButton:false,
            timer:3000, 
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
            }
          })
        } else {
          swal.fire({
            position: 'center',
            allowOutsideClick: false,
            title: 'Better Luck Next Time!',
            text: 'You Lose the Match.',
            showConfirmButton:false,
            width: 275,
            padding: '0.7em',
            timer: 3000,
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
            }
          })
        }
        this.setState({ isgameOver: 1 });
      }
      arr[xx][yy] = arr[this.state.prevx][this.state.prevy];
      arr[this.state.prevx][this.state.prevy] = {
        TEAMNAME: "Empty",
        PLAYER: "Empty"
      };
      let zz=this.state.whosTurn == true ? false: true;
      this.setState({
        board: arr,
        prevx: -1,
        prevy: -1,
        currentCount: 60,
        whosTurn: zz
      });
      let curr=this.turn == "A" ? "B" : "A";
      this.props.pubnub.publish({
        message: {
          prevx:this.state.prevx,
          prevy: this.state.prevy,
          currx: xx,
          curry:yy,
          nowtoturn: curr,
        },
        channel: this.props.gameChannel
      });
    }
  }
  publishMove(a,b,c,d) {
    let arr=this.state.board;
    if(arr[c][d].PLAYER == "King"){
      swal.fire({
        position: 'center',
        title: 'Better Luck Next Time!',
        text: 'You Lose the Match.',
        showConfirmButton:false,
        width: 275,
        padding: '0.7em',
        timer: 3000,
        customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
        }
      })
      this.setState({isgameOver:1});
    }
    arr[c][d]=arr[a][b];
    arr[a][b]={TEAMNAME:"Empty",PLAYER:"Empty"};
    let zz=this.state.whosTurn == true ? false: true;
    this.setState({board: arr,whosTurn:zz,currentCount:60});
  }
  Hover(x, y) {
    const now = this.state.board[x][y];
    let piecename = now.PLAYER;
    if (piecename !== "Empty") {
      if (now.TEAMNAME === "A") {
        const get = this.SetToSpecifiedValue(x, y, new_moves[piecename], 1);
        this.setState({ TEAMA: get }); 
      } else {
        if (piecename === "Pawn") {
          piecename = "PawnBlack";
        }
        const get = this.SetToSpecifiedValue(x, y, new_moves[piecename], 1);
        this.setState({ TEAMB: get });
      }
    }
  }
  Leave(x, y) {
    const xx = this.diffboard();
    this.setState({ TEAMA: xx, TEAMB: xx });
}
  ImagetoShow(x, y) {
    const present = this.state.board[x][y];
    if (present.TEAMNAME === "A") {
      const name = present.PLAYER;
      return piece[name][0];
    } else if (present.TEAMNAME === "B") {
      const name = present.PLAYER;
      return piece[name][1];
    } else {
      return "";
    }
  }
  ToogleButton() {
    let x;
    if (this.state.currState === "off") {
      x = "on";
    } else {
      x = "off";
    }
    this.setState({
      enableHoverState: !this.state.enableHoverState,
      currState: x
    });
  }
  WhichColorToShow(xx, yy) {
    if (this.state.prevx === xx && this.state.prevy === yy) {
      return "selected";
    }
    if (this.state.enableHoverState) {
      if (this.state.TEAMA[xx][yy] === 1) {
        return "yellow";
      }
      if (this.state.TEAMA[xx][yy] === 2) {
        return "red";
      }
      if (this.state.TEAMB[xx][yy] === 1) {
        return "blue";
      }
      if (this.state.TEAMB[xx][yy] === 2) {
        return "red";
      }
      if ((xx + yy) % 2 === 0) {
        return "brown";
      } else {
        return "light-brown";
      }
    } else {
      if ((xx + yy) % 2 === 0) {
        return "brown";
      } else {
        return "light-brown";
      }
    }
  }
  render() {
    if (this.state.loading === true) {
      setTimeout(() => {
        this.setState({ loading: false, currentCount: 60, totalTime: 0 });
      }, 3000);
      return (
        <Loader
          className="loader"
          type="BallTriangle"
          color="#00BFFF"
          height={100}
          width={100}
        />
      );
    }
    return (
      <div className="App ">
        {/* {this.state.isgameOver === 1 ? (
          <Link to="/">
            <button className="btn-right"> Go back</button>
          </Link>
        ) : null} */}
        <h1 className="heading"> {this.state.heading} </h1>
        <h1 className="Totaltime"> Total time: {this.state.totalTime} secs</h1>
        <h1 className="TimeRemaining">
          Time Rem: {this.state.currentCount} secs
        </h1>
        <button
          className="btn-left"
          onClick={() => {
            this.ToogleButton();
          }}
        >
          {" "}
          Hover {this.state.currState}{" "}
        </button>
        {this.state.board.map((row, rowidx) => {
          return (
            <div className="row">
              {row.map((col, colidx) => {
                return (
                  <div
                    onMouseEnter={() => {
                      this.Hover(rowidx, colidx);
                    }}
                    onMouseLeave={() => {
                      this.Leave(rowidx, colidx);
                    }}
                    onClick={() => {
                      this.Clicked(rowidx, colidx);
                    }}
                    className={"cell " + this.WhichColorToShow(rowidx, colidx)}
                  >
                    {this.ImagetoShow(rowidx, colidx) !== "" ? (
                      <img
                        src={this.ImagetoShow(rowidx, colidx)}
                        className="img"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
