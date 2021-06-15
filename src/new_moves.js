// Rook: hathi, Pawn: sainik , Knight: Ghoda, Queen: wazir,
// Bishop: Unth , King : raja
const moves = {
    Rook: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: -1, y: 0 }
    ],
    Pawn: [{ x: 1, y: 0 }], // this means PawnWhite...
    PawnBlack: [{ x: -1, y: 0 }],
    Knight: [
      { x: 2, y: -1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: -2 },
      { x: -2, y: -1 },
      { x: -2, y: 1 },
      { x: -1, y: 2 },
      { x: -1, y: -2 }
    ],
    Queen: [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 }
    ],
    Bishop: [
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 }
    ],
    King: [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 }
    ]
  };
  export default moves;
  