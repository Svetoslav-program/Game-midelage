
class Block {
    constructor(x, y, w, h, col) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.col = col;
    }

    draw() {
      ctx.fillStyle = "rgb" + this.col;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  }

  class Snake {
    constructor(x, y, w, h, col, col2, name, ins) {
      this.bod = [];
      this.h = h;
      this.w = w;
      this.name = name;
      this.killed = false;
      this.spd = 25;
      this.vel = [0, 0];
      this.col = col;
      this.col2 = col2;
      this.bod.push(new Block(x, y, w, h, col))
      this.ins = ins;
    }
  // Зачет выйгрыша
    win() {
      ctx.textAlign = "center";
      ctx.clearRect(0, 0, width, height);
      ctx.font = "100px Oswald";
      ctx.fillStyle = "rgb" + this.col;
      ctx.fillText(this.name + " WINS!", width / 2, height / 2);
      setTimeout(() => {
        location.reload();
        //ws.send("pw1")
      }, 1000)
    }

    draw() {
      for (var x = 0; x < this.bod.length; x++) {
        this.bod[x].draw();
      }
    }

    move(tx, ty) {
      this.bod[0].x += tx
      this.bod[0].y += ty;
    }

    isBack(tx, ty) {
      return this.bod[0].x + tx == this.bod[1].x && this.bod[0].y + ty == this.bod[1].y
    }

    grow(pos_x, pos_y) {
      this.bod.push(new Block(pos_x, pos_y, this.w, this.h, this.col2));
    }

    handle(inp, ins) {
      ins = ins || this.ins;
      var old_vel = this.vel;
      switch(inp) {
        case ins[0]:
          this.vel = [-this.spd, 0];
          break;
        case ins[1]:
          this.vel = [0, -this.spd];
          break;
        case ins[2]:
          this.vel = [this.spd, 0];
          break;
        case ins[3]:
          this.vel = [0, this.spd]
          break
        default:
          this.vel = old_vel;
      }
      if (this.bod.length > 2) {
        if (this.isBack(this.vel[0], this.vel[1])) {
          this.vel = old_vel
        }
      }
    }

    update() {
      if (this.bod[0].x == food.x && this.bod[0].y == food.y) {
        this.grow(food.x, food.y);
        food.x = Math.floor(Math.random() * 19) * 25;
        food.y = Math.floor(Math.random() * 19) * 25
      }
      for (var i = this.bod.length - 1; i > 0; i--){
        this.bod[i].x = this.bod[i - 1].x;
        this.bod[i].y = this.bod[i - 1].y;
      }
      this.move(this.vel[0], this.vel[1]);
      if (this.bod[0].x > width - this.bod[0].w || this.bod[0].x < 0 || this.bod[0].y > height - this.bod[0].h || this.bod[0].y < 0 || this.isInside(this.bod[0])) {
        this.killed = true;
      }
    }

    isInside(obj) {
      for (var i = 1; i < this.bod.length; i++) {
        if (obj.x == this.bod[i].x && obj.y == this.bod[i].y) {
          return true;
        }
      }
      return false;
    }
  }
  function init_position(r1,r2,r3,r4,r5,r6) {
    ply1 = new Snake(Math.floor(r1),Math.floor(r2), 25, 25, "(25, 150, 25)", "(0, 255, 0)", "GREEN",[37, 38, 39, 40]);
    ply2 = new Snake(Math.floor(r3),Math.floor(r4), 25, 25, "(25, 25, 150)", "(0, 0, 255)", "BLUE", [65, 87, 68, 83]);
    food = new Block(Math.floor(r5),Math.floor(r6), 25, 25, "(255, 0, 0)");
  }
  function init() {
    canvas = document.getElementById("display");
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    time = 60;
    key_state = [];
    key_stat2 = [];
    start = false;

    addEventListener("keydown", (e) => {
      if (e.keyCode == 32) {
        //start = true;
        //Math.floor(Math.random() * 19) * 25
        mass=[];
        mass.push(1);
        mass.push(Math.floor(Math.random() * 19) * 25);
        mass.push(Math.floor(Math.random() * 19) * 25);
        mass.push(Math.floor(Math.random() * 19) * 25);
        mass.push(Math.floor(Math.random() * 19) * 25);
        mass.push(Math.floor(Math.random() * 19) * 25);
        mass.push(Math.floor(Math.random() * 19) * 25);
        ws.send(JSON.stringify(mass));
        //ws.send("s1");

      } else if (e.keyCode == 72) {
        location.replace("/")

      } else if ([37, 38, 39, 40].includes(e.keyCode)) {
        //key_state.push(e.keyCode);
        mass=[];
        mass.push(2);
        mass.push(e.keyCode);
        ws.send(JSON.stringify(mass));
        //ws.send("v1");
      } else if ([87, 65, 83, 68].includes(e.keyCode)) {
        //key_stat2.push(e.keyCode);
        mass=[];
        mass.push(3);
        mass.push(e.keyCode);
        ws.send(JSON.stringify(mass));
      }
    })
    loop = setInterval(menu);
  }

  function showWinner(winner) {
    clearInterval(frames);
    setTimeout(() => {
      winner.win();
      //ws.send("w1");
    }, 1000);
  }

  function parseSecs(t) {
    if (isNaN(t)) {
      return t;
    }
    var mins = Math.floor(t/60).toString();
    var secs = (t%60).toString();
    if (secs.length < 2) {
      secs = "0" + secs;
    }
    if (mins.length < 2) {
      mins = "0" + mins;
    }
    return mins + ":" + secs;
  }

  function menu() {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "75px Oswald"
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fillText("Basically Snake", width/2, height * 1/3);
    ctx.font = "25px Oswald";
    ctx.fillText("wasd for blue | arrow keys for green", width / 2, height * 2/4);
    ctx.fillText("space to start", width/2, height * 2/3)
    if (start) {
      clearInterval(loop);
      timing = setInterval(() => {
        time -= 1;
      }, 1000)
      frames = setInterval(frame, 100);
    }
  }

  function drawAll() {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "25px Oswald";
    ctx.fillStyle = "rgb" + ply1.col;
    ctx.textAlign = "left";
    ctx.fillText(ply1.name + ": " + ply1.bod.length, 25, 25);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillText("Time: " + parseSecs(time), width / 2, 25)
    ctx.fillStyle = "rgb" + ply2.col;
    ctx.textAlign = "right";
    ctx.font = "25px Oswald";
    ctx.fillText(ply2.name + ": " + ply2.bod.length, width - 25, 25);
    ply1.draw();
    ply2.draw();
    food.draw();
  }

  function frame() {
    ply1.update();
    ply2.update();
    ply1.handle(key_state[0])
    key_state.pop();
    ply2.handle(key_stat2[0]);
    key_stat2.pop();
    ply2.handle()
    drawAll();
    if (ply2.killed) {
      showWinner(ply1);
    } else if (ply1.killed) {
      showWinner(ply2);

    }
    if (time < 1) {
      clearInterval(timing);
      time = "OVERTIME";
      if (ply1.bod.length > ply2.bod.length) {
        showWinner(ply1);
      } else if (ply2.bod.length > ply1.bod.length) {
        showWinner(ply2);
      }
    }
  }


  //window.onload = init;
  //let field = document.getElementById("field"),
      //chat = document.getElementById("chat");
  let ws = new WebSocket("ws://localhost:591/");
  //let ws = new WebSocket(" 192.168.1.68");
  ws.onmessage = function(message) {
    var gg = JSON.parse(message.data);
    console.log(gg[0]);
    if (gg[0] == 1) {
      init_position(parseInt(gg[1]),parseInt(gg[2]),parseInt(gg[3]),parseInt(gg[4]),parseInt(gg[5]),parseInt(gg[6]));
      start = true;
      console.log(gg[1]);
      console.log(gg[2]);
      console.log(gg[3]);
      console.log(gg[4]);
      console.log(gg[5]);
      console.log(gg[6]);
    }
    //chat.value = message.data + "\n" + chat.value;
if(gg[0]== 2) {
    key_state.push(gg[1]);
    console.log(gg[1]);
}

if(gg[0]== 3) {
  key_stat2.push(gg[1]);
  console.log(gg[1]);
}
};
  ws.onopen = function() {
    /*field.addEventListener("keydown", function(event) {
      if(event.which === 13) {
        ws.send(field.value);
        field.value ="";
      }
    });*/
    init();
  };
