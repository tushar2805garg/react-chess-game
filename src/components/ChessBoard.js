function ChessBoard(turn){
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
      // This is the condition which is used for flipping the board.
      if(turn==="A" && Teamname !=="Empty"){
         Teamname = Teamname === "A" ? "B" :"A";
      }
      // End of condition.
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


export default ChessBoard;