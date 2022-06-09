import diffboard from "./diffboard";

function SetToSpecifiedValue(xx, yy, objectt, value,board) {
    let arr = diffboard();
    // console.log(board);
    let player = board[xx][yy];
    // console.log(player);
    player = player.PLAYER; // store name of piece of teamA / teamB;
    for (var i = 0; i < objectt.length; i++) {
      var curx = xx + objectt[i].x;
      var cury = yy + objectt[i].y;
      while (curx < 8 && cury < 8 && curx >= 0 && cury >= 0) {
        if (
          board[curx][cury].TEAMNAME ===
          board[xx][yy].TEAMNAME
        ) {
          break;
        } else {
          if (
            player === "Pawn" &&
            board[curx][cury].PLAYER !== "Empty"
          ) {
            //
          } else {
            if (board[curx][cury].PLAYER === "King") {
              const z = board[curx][cury].PLAYER;
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
          (board[curx - objectt[i].x][cury - objectt[i].y]
            .TEAMNAME !== board[xx][yy].TEAMNAME &&
            board[curx - objectt[i].x][cury - objectt[i].y]
              .TEAMNAME !== "Empty")
        ) {
          break;
        }
      }
    }


     if(player === "Pawn"){
         if(objectt[0].x==1){  // Pawn
             if(xx==1){
                 if(board[xx+2][yy].PLAYER == "Empty" && board[xx+1][yy].PLAYER === "Empty"){
                     arr[xx+2][yy]=Number(value);
                 }
             }
                // right
                if(yy !== 0 && xx!==7 &&  board[xx+1][yy-1].TEAMNAME !== board[xx][yy].TEAMNAME && board[xx+1][yy-1].PLAYER !== "Empty"){
                  if(board[xx+1][yy-1].PLAYER === "King") arr[xx+1][yy-1]=2;    
                  else arr[xx+1][yy-1]=Number(value);
                 }
                 // left
                 if(yy !== 7 && xx!==7 &&  board[xx+1][yy+1].TEAMNAME !== board[xx][yy].TEAMNAME && board[xx+1][yy+1].PLAYER !== "Empty"){
                  if(board[xx+1][yy+1].PLAYER === "King") arr[xx+1][yy+1]=2;    
                  else arr[xx+1][yy+1]=Number(value);
                 }
         } 
         else{  // PawnBlack
              if(xx==6){
                if(board[xx-2][yy].PLAYER === "Empty" && board[xx-1][yy].PLAYER === "Empty"){
                  arr[xx-2][yy]=Number(value);
              }
              }
                // left
                if(yy !== 0 && xx!==0 &&   board[xx-1][yy-1].TEAMNAME !== board[xx][yy].TEAMNAME && board[xx-1][yy-1].PLAYER !== "Empty"){
                  if(board[xx-1][yy-1].PLAYER === "King") arr[xx-1][yy-1]=2;    
                  else arr[xx-1][yy-1]=Number(value);
                 }
                 // right
                 if(yy !== 7 &&   xx!==0 &&  board[xx-1][yy+1].TEAMNAME !== board[xx][yy].TEAMNAME && board[xx-1][yy+1].PLAYER !== "Empty"){
                  if(board[xx-1][yy+1].PLAYER === "King") arr[xx-1][yy+1]=2;    
                  else arr[xx-1][yy+1]=Number(value);
                 }
         }   
     }
    return arr;
  }

  export default SetToSpecifiedValue;