function WhichColorToShow(xx, yy,prevx,prevy,enableHoverState,TeamAValue,TeamBValue) {
    if (prevx === xx && prevy === yy) {
      return "selected";
    }
    if (enableHoverState) {
      if (TeamAValue === 1) {
        return "yellow";
      }
      if (TeamAValue === 2) {
        return "red";
      }
      if (TeamBValue === 1) {
        return "blue";
      }
      if (TeamBValue === 2) {
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
  export default WhichColorToShow;