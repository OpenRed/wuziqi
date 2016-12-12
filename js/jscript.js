var me = true;    //定义变量me的值为true，代表黑棋
var over = false;   //定义over变量，初始值为false表示棋局没有结束

var chessBoard = [];    //定义二维数组存放棋子的位置
for (var i=0 ; i<15 ; i++) {
  chessBoard[i] = [];
  for (var j=0 ; j<15 ; j++) {
    chessBoard[i][j] = 0;   //初始化为0，没有落子
  }
}

var  wins = [];     //定义三维数组存放赢法
for (var i=0 ; i<15 ; i++) {
  wins[i] = [];
  for (var j=0 ; j<15 ; j++) {
    wins[i][j] = [];
  }
}

var count = 0;
//所有的横线赢法
for (var i=0 ; i<15　; i++) {
  for (var j=0 ; j<11 ; j++) {
    //wins[0][0][0] = true;
    for (var k=0 ; k<5 ; k++) {
      wins[i][j+k][count] = true;
    }
    count++;
  }
}
//所有的竖线赢法
for (var i=0 ; i<15　; i++) {
  for (var j=0 ; j<11 ; j++) {
    for (var k=0 ; k<5 ; k++) {
      wins[j+k][i][count] = true;
    }
    count++;
  }
}
//所有的斜线赢法
for (var i=0 ; i<11　; i++) {
  for (var j=0 ; j<11 ; j++) {
    for (var k=0 ; k<5 ; k++) {
      wins[i+k][j+k][count] = true;
    }
    count++;
  }
}
//所有的反斜线赢法
for (var i=0 ; i<11　; i++) {
  for (var j=14 ; j>3 ; j--) {
    for (var k=0 ; k<5 ; k++) {
      wins[i+k][j-k][count] = true;
    }
    count++;
  }
}
console.log("赢法种数："+count);     //输出赢法种数

var myWin = [];         //统计我方赢数
var cpuWin = [];        //统计电脑赢数
for (var i=0 ; i<count ; i++)　{
  myWin[i] = 0;
  cpuWin[i] = 0;
}


var chess = document.getElementById("chess");
var context = chess.getContext("2d");

context.strokeStyle = "#BFBFBF";

var logo = new Image();
logo.src = "images/bg.jpg";
logo.onload = function() {
  context.drawImage(logo,0,0,450,450);
  drawChessBoard();

  // 画出一根对角线
  // context.moveTo(0,0);
  // context.lineTo(450,450);
  // context.stroke();
}

var drawChessBoard = function() {
  for (var i=0 ; i < 15 ; i++)
  {
    //画横线
    context.moveTo(15 + i*30 , 15);
    context.lineTo(15 + i*30 , 435);
    context.stroke();   //context.stroke()用来描边

    //画竖线
    context.moveTo(15 , 15 + i*30);
    context.lineTo(435 , 15 + i*30);
    context.stroke();
  }
}

var onestep = function(i, j ,me) {
  //i,j索引，me代表黑棋或者白棋
  //画圆（棋子）
  context.beginPath();
  context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);
  context.closePath();

  //画出黑白渐变色
  var gradient = context.createRadialGradient(15+i*30+2 ,15+j*30-2 ,13 ,15+i*30+2 ,15+j*30-2 ,0);
  if (me) {     //黑棋
    gradient.addColorStop(0, "#0A0A0A");  //黑
    gradient.addColorStop(1, "#636766");  //白
  }
  else {        //白棋
    gradient.addColorStop(0, "#D1D1D1");  //白
    gradient.addColorStop(1, "#F9F9F9");  //黑
  }

  context.fillStyle = gradient;
  context.fill();   //context.fill()用来填充
}

chess.onclick = function(e) {
  if (over) { //判断棋局是否结束
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x/30);
  var j = Math.floor(y/30);
  // if (chessBoard[i][j] == 0) {
  //   onestep(i, j ,me);
  //   if (me) {
  //     chessBoard[i][j] = 1;
  //   }
  //   else {
  //     chessBoard[i][j] = 2;
  //   }
  // }
  // me = !me;
  if (chessBoard[i][j] == 0) {
    onestep(i, j ,me);
    chessBoard[i][j] = 1;
    for (var k=0 ; k<count ; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        cpuWin[k] = 6;
        if (myWin[k] == 5) {
          window.alert("You win!你赢了！");
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
      cpuAI();
    }
  }

  // for (var k=0 ; k<count ; k++) {
  //   if (wins[i][j][k]) {
  //     myWin[k]++;
  //     cpuWin[k] = 6;
  //     if (myWin[k] == 5) {
  //       window.alert("You win!你赢了！");
  //       over = true;
  //     }
  //   }
  // }
  // if (!over) {
  //   me = !me;
  //   cpuAI();
  // }
}

var cpuAI = function() {
  var myScore = [];
  var cpuScore = [];
  var max = 0;
  var u=0, v=0;
  for (var i=0 ; i<15 ; i++) {
    myScore[i] = [];
    cpuScore[i] = [];
    for (var j=0 ; j<15 ; j++) {
      myScore[i][j] = 0;
      cpuScore[i][j] = 0;
    }
  }
  for (var i=0 ; i<15 ; i++) {
    for (var j=0 ; j<15 ;j++) {
      if (chessBoard[i][j] == 0) {
        for (var k=0 ; k<count ; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 200;
            }
            else if (myWin[k] == 2) {
              myScore[i][j] += 400;
            }
            else if (myWin[k] == 3) {
              myScore[i][j] += 2000;
            }
            else if (myWin[k] == 4) {
              myScore[i][j] += 10000;
            }

            if (cpuWin[k] == 1) {
              cpuScore[i][j] += 220;
            }
            else if (cpuWin[k] == 2) {
              cpuScore[i][j] += 420;
            }
            else if (cpuWin[k] == 3) {
              cpuScore[i][j] += 2100;
            }
            else if (cpuWin[k] == 4) {
              cpuScore[i][j] +=20000;
            }
          }
        }
        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (cpuScore[i][j] > cpuScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if  (cpuScore[i][j] > max) {
          max = cpuScore[i][j];
          u = i;
          v = j;
        } else if (cpuScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }
  onestep(u,v,false);
  chessBoard[u][v] = 2;
  for (var k=0 ; k<count ; k++) {
    if (wins[u][v][k]) {
      cpuWin[k]++;
      myWin[k] = 6;
      if (cpuWin[k] == 5) {
        window.alert("You lost!计算机赢了！");
        over = true;
      }
    }
  }
  if (!over) {
    me = !me;
  }
}
