import new_moves from "../new_moves";
import SetToSpecifiedValue from "./SetToSpecifiedValue";
function differentmoves(board,turn){
var arr=[];
for(var i=0;i<8;i++){
    for(var j=0;j<8;j++){   
            if(board[i][j].TEAMNAME === "A" && turn === "White") {// White piece and its to move.
                   var piecename=board[i][j].PLAYER;
                   if(piecename === "Empty") continue;
                   var curr=SetToSpecifiedValue(i,j,new_moves[piecename],1,board);
                   for(var k=0;k<8;k++){
                       for(var l=0;l<8;l++){
                           if(curr[k][l]!=0){
                                var new_arr=[];   
                                new_arr.push(i);    new_arr.push(j);
                                new_arr.push(k);    new_arr.push(l);
                                arr.push(new_arr); 
                           }
                       }
                   }
            }
            if(board[i][j].TEAMNAME === "B" && turn === "Black") {// Black piece and its to move.
                var piecename=board[i][j].PLAYER;
                if(piecename === "Empty") continue;

                if(piecename === "Pawn"){
                     piecename="PawnBlack";
                }
                var curr=SetToSpecifiedValue(i,j,new_moves[piecename],1,board);
                   for(var k=0;k<8;k++){
                       for(var l=0;l<8;l++){
                           if(curr[k][l]!=0){
                                var new_arr=[];   
                                new_arr.push(i);    new_arr.push(j);
                                new_arr.push(k);    new_arr.push(l);
                                arr.push(new_arr); 
                           }
                       }
                   }
            }
    }
}
return arr;
}

export default differentmoves;