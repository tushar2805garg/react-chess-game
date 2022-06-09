import React from "react";
import "./styles.css";
import Loader from "react-loader-spinner";
import new_moves from "./new_moves";
import swal from "sweetalert2";
import ChessBoard from "./components/ChessBoard";
import diffboard from "./components/diffboard";
import ImagetoShow from "./components/ImageToShow";
import WhichColorToShow from "./components/WhchColorToShow";
import SetToSpecifiedValue from "./components/SetToSpecifiedValue";
import differentmoves from "./components/different moves";
import CenterControl from "./components/CenterControl";
// TEAMNAME -> A(WHITE) and B(BLACK)
class Computer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            whosTurn: "Black" , // Means Player(BLACK) goes first then Computer(WHITE). 
            board: [[]],
            heading: "",
            TEAMA: [[]],
            TEAMB: [[]],
            prevx: -1,
            prevy: -1,
            enableHoverState: 1,
            currState: "off", // this is used to show in button . opposite than enablehoverstate.
            currentCount: 60,
            totalTime: 0,
            isgameOver: 0,
            loading: true,
            tm: 1000
          };
    }
    timer() {
        this.setState({
          currentCount: this.state.currentCount - 1
        });
        if (this.state.currentCount < 1) {
            var message="";
            if(this.whosTurn === "White"){
                message = "Computer Wins You Lose the Match";
            }
            else{
                message="You won against computer";
            }
            swal.fire({
              position: 'center',
              allowOutsideClick: false,
              text: message,
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
        this.setState({
          whosTurn: "Black",
          board: ChessBoard("B"), //  we will use the default view of board.
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


      
    
      evaluation(board){
           var ans=0;
           for(var i=0;i<8;i++){
                 for(var j=0;j<8;j++){
                   var pos=1;
                   var piecevalue=[[]];
                      if(board[i][j].TEAMNAME === "Empty") continue;
                      else if(board[i][j].TEAMNAME === "B"){ // black
                               pos=-1;
                      }
                      // else{
                           
                      // }
                      if(board[i][j].PLAYER === "Pawn") {
                        ans=ans+pos*10;
                        if(pos==-1){
                          ans=ans+CenterControl["pawnEvalWhite"][i][j];
                        }
                        else{
                          ans=ans+CenterControl["pawnEvalBlack"][i][j];
                        }
                      }
                      else if(board[i][j].PLAYER === "Knight" ){
                         ans=ans+pos*30;
                         if(pos==-1){
                          ans=ans+CenterControl["knightEval"][i][j]; // maybe fault.
                        }
                        else{
                          ans=ans+CenterControl["knightEval"][i][j];
                        }
                      }
                      else if(board[i][j].PLAYER === "Bishop"){
                        if(pos==-1){
                          ans=ans+CenterControl["bishopEvalWhite"][i][j];
                        }
                        else{
                          ans=ans+CenterControl["bishopEvalBlack"][i][j];
                        }
                      }
                      else if(board[i][j].PLAYER === "Rook") {
                        ans=ans+pos*50;
                        if(pos==-1){
                          ans=ans+CenterControl["rookEvalWhite"][i][j];
                        }
                        else{
                          ans=ans+CenterControl["rookEvalBlack"][i][j];
                        }
                      }
                      else if(board[i][j].PLAYER === "Queen") {
                        ans=ans+pos*90;
                        if(pos==-1){
                          ans=ans+CenterControl["evalQueen"][i][j]; /// may be fault.
                        }
                        else{
                          ans=ans+CenterControl["evalQueen"][i][j];
                        }
                      }
                      else{
                        ans=ans+pos*900;
                        if(pos==-1){
                          ans=ans+CenterControl["kingEvalWhite"][i][j];
                        }
                        else{
                          ans=ans+CenterControl["kingEvalBlack"][i][j];
                        }
                      }
              }
          }
          return ans;
      }


       minimaxRoot( depth , isMaximisingPlayer ) { // isMaximisingPlayer is White..  Computer's Turn.
        var newGameMoves = differentmoves(this.state.board,"White");
        console.log(CenterControl);
        var bestMove = -9999;
        var bestMoveFound=[]; // array..
        for(var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i];
            var prevx=newGameMove[0]; 
            var prevy=newGameMove[1]; 
            var currx=newGameMove[2]; 
            var curry=newGameMove[3];
            var cb=this.state.board;
            var currboard=JSON.parse(JSON.stringify(cb));

            var isGameEnd=false;
             
            if(currboard[currx][curry].PLAYER === "King") isGameEnd =true;

            currboard[currx][curry]={TEAMNAME:currboard[prevx][prevy].TEAMNAME,PLAYER:currboard[prevx][prevy].PLAYER};

            currboard[prevx][prevy]={TEAMNAME:"Empty" ,PLAYER:"Empty"}; 
            
            var value = this.minimax(depth - 1, currboard, -10000, 10000, !isMaximisingPlayer,isGameEnd);
            
            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }
        return bestMoveFound;
    };

     minimax(depth, board, alpha, beta, isMaximisingPlayer,isGameEnd) {
      if (depth === 0 || isGameEnd === true) {
          return this.evaluation(board);
      }
      var turn="White";
      if(!isMaximisingPlayer) turn="Black";
      var newGameMoves = differentmoves(board,turn);
  
      if (isMaximisingPlayer) { // White To Move
          var bestMove = -9999;
          for (var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i];
            var prevx=newGameMove[0]; 
            var prevy=newGameMove[1]; 
            var currx=newGameMove[2]; 
            var curry=newGameMove[3];
            var currboard=JSON.parse(JSON.stringify(board));
            var isGameEnd=false;
             
            if(currboard[currx][curry].PLAYER === "King") isGameEnd =true;

            currboard[currx][curry]={TEAMNAME:currboard[prevx][prevy].TEAMNAME,PLAYER:currboard[prevx][prevy].PLAYER};
            
            currboard[prevx][prevy]={TEAMNAME:"Empty" ,PLAYER:"Empty"}; 
            
            bestMove = Math.max(bestMove, this.minimax(depth - 1, board, alpha, beta, !isMaximisingPlayer,isGameEnd));
            
            alpha = Math.max(alpha, bestMove);
              if (beta <= alpha) {
                  return bestMove;
              }
          }
          return bestMove;
      } else { // Black To Move.
          var bestMove = 9999;
          for (var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i];
            var prevx=newGameMove[0]; 
            var prevy=newGameMove[1]; 
            var currx=newGameMove[2]; 
            var curry=newGameMove[3];
            var currboard=JSON.parse(JSON.stringify(board));

            var isGameEnd=false;
             
            if(currboard[currx][curry].PLAYER === "King") isGameEnd =true;

            currboard[currx][curry]={TEAMNAME:currboard[prevx][prevy].TEAMNAME,PLAYER:currboard[prevx][prevy].PLAYER};
            
            currboard[prevx][prevy]={TEAMNAME:"Empty" ,PLAYER:"Empty"};
            
            bestMove = Math.min(bestMove,this.minimax(depth - 1, board, alpha, beta, !isMaximisingPlayer,isGameEnd));
              
            beta = Math.min(beta, bestMove);
              if (beta <= alpha) {
                  return bestMove;
              }
          }
          return bestMove;
      }
  };
   

      // Clicked function Starts

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
            if (this.state.whosTurn === "White") { // Computer's Turn
              swal.fire({
                position: 'center',
                text: 'Its Computers Turn',
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
            else if(arr[xx][yy].TEAMNAME =="A"){ // you are moving white piece which is wrong.
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
          play === "Pawn" 
        ) {
          play = "PawnBlack";
        }
        play = new_moves[play];
        let clicked_array = SetToSpecifiedValue(
          this.state.prevx,
          this.state.prevy,
          play,
          1,
          this.state.board
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
            swal.fire({
              position: 'center',
              allowOutsideClick: false,
              text: "You Won Computer loses!",
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
          this.setState({ isgameOver: 1 });
          }
          arr[xx][yy] = arr[this.state.prevx][this.state.prevy];
          arr[this.state.prevx][this.state.prevy] = {
            TEAMNAME: "Empty",
            PLAYER: "Empty"
          };
          // I reach here only when whosTurn is Black
          this.setState({
            board: arr,
            prevx: -1,
            prevy: -1,
            currentCount: 60,
            whosTurn: "White"
          });
        }
        // Now starts the logic of Minimax Algorithm and alpha-beta pruning..
        var whatomove=this.minimaxRoot(2,true);
        var prevx=whatomove[0]; 
        var prevy=whatomove[1]; 
        var currx=whatomove[2]; 
        var curry=whatomove[3];
        let new_arr=this.state.board;
        if (new_arr[currx][curry].PLAYER === "King") {
          swal.fire({
            position: 'center',
            allowOutsideClick: false,
            text: "Computer Won you loses!",
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
        this.setState({ isgameOver: 1 });
        }
        new_arr[currx][curry] = new_arr[prevx][prevy];
        new_arr[prevx][prevy] = {
          TEAMNAME: "Empty",
          PLAYER: "Empty"
        };
        this.setState({
          board: new_arr,
          prevx: -1,
          prevy: -1,
          currentCount: 60,
          whosTurn: "Black"
        });
      }

      // Clicked Function Ends
      
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
  Leave(x, y) {
    const xx = diffboard();
    this.setState({ TEAMA: xx, TEAMB: xx });
}
  Hover(x,y){
    const now = this.state.board[x][y];
    let piecename = now.PLAYER;
    if (piecename !== "Empty") {
      if (now.TEAMNAME === "A") {
        const get = SetToSpecifiedValue(x, y, new_moves[piecename], 1,this.state.board);
        this.setState({ TEAMA: get }); 
      } else {
        if (piecename === "Pawn") {
          piecename = "PawnBlack";
        }
        const get = SetToSpecifiedValue(x, y, new_moves[piecename], 1,this.state.board);
        this.setState({ TEAMB: get });
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



export default Computer;