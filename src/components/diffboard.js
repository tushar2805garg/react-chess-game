function   diffboard() {
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

  export default diffboard;