import React from "react";
import "./styles.css";
import Loader from "react-loader-spinner";
import new_moves from "./new_moves";
// import piece from "./piece";
import swal from "sweetalert2";
import ChessBoard from "./components/ChessBoard";
import diffboard from "./components/diffboard";
import SetToSpecifiedValue from "./components/SetToSpecifiedValue";
import ImagetoShow from "./components/ImageToShow";
import WhichColorToShow from "./components/WhchColorToShow";
// Creator gets Piece A and join gets Piece B.
// and this is stored inside this.turn
// A for white and B for black.
// Creator gets White
/*  By default board view.

 WWWWWWWWW

 BBBBBBBBB


 But if this.turn == A then Board view:
 
 BBBBBBBBBB

 WWWWWWWWWW


*/

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
  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
    // Text written here is wrong.
    if (this.state.currentCount < 1) {
      if (this.turn === "A") {
        swal.fire({
          position: 'center',
          allowOutsideClick: false,
          text: 'Cannot make move',
          width: 275,
          padding: '0.7em',
          timer:2000,
          showConfirmButton:false,
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
          text: 'Cannot make move',
          width: 275,
          padding: '0.7em',
          timer:2000,
          showConfirmButton:false,
          customClass: {
              heightAuto: false,
              title: 'title-class',
              popup: 'popup-class',
          }
        })
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
      board: ChessBoard(this.turn),
      TEAMA: diffboard(),
      TEAMB: diffboard(),
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
  
  Clicked(xx, yy) {
    if (this.state.isgameOver === 1) {
      swal.fire({
        position: 'center',
        allowOutsideClick: false,
        text: 'Game is over Press the button on your screen to go back..',
        width: 275,
        padding: '0.7em',
        timer:2000,
        showConfirmButton:false,
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
    if (
      play === "Pawn" &&
      arr[this.state.prevx][this.state.prevy].TEAMNAME === "A" && this.turn ==="A"
    ) {
      play = "PawnBlack";
    }
    play = new_moves[play];
    let clicked_array = SetToSpecifiedValue(
      this.state.prevx,
      this.state.prevy,
      play,
      1,this.state.board
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
    a=Math.abs(7-a);
    b=Math.abs(7-b);
    c=Math.abs(7-c);
    d=Math.abs(7-d);
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
        if(this.turn === "A" && piecename === "Pawn"){
          piecename="PawnBlack";
        }
        const get = SetToSpecifiedValue(x, y, new_moves[piecename], 1,this.state.board);
        this.setState({ TEAMA: get }); 
      } else {
        if (piecename === "Pawn" && this.turn === "B") {
          piecename = "PawnBlack";
        }
        const get = SetToSpecifiedValue(x, y, new_moves[piecename], 1,this.state.board);
        this.setState({ TEAMB: get });
      }
    }
  }
  Leave(x, y) {
    const xx = diffboard();
    this.setState({ TEAMA: xx, TEAMB: xx });
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
                    className={"cell " + WhichColorToShow(rowidx, colidx,this.state.prevx,this.state.prevy,
                      this.state.enableHoverState,this.state.TEAMA[rowidx][colidx],this.state.TEAMB[rowidx][colidx])}
                  >
                    {ImagetoShow(this.state.board[rowidx][colidx].TEAMNAME,this.state.board[rowidx][colidx].PLAYER) !== "" ? (
                      <img
                        src={ImagetoShow(this.state.board[rowidx][colidx].TEAMNAME,this.state.board[rowidx][colidx].PLAYER)}
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
