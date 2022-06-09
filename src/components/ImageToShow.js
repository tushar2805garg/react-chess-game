import piece from "../piece";

function   ImagetoShow(TeamName,Player) {
    if (TeamName === "A") {
      const name = Player;
      return piece[name][0];
    } else if (TeamName === "B") {
      const name = Player;
      return piece[name][1];
    } else {
      return "";
    }
  }
  export default ImagetoShow;