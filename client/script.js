let field = document.getElementById("field"),
    chat = document.getElementById("chat");
let ws = new WebSocket("ws://192.168.10.106:591/");
//let ws = new WebSocket(" 192.168.1.68");
ws.onmessage = function(message) {
  chat.value = message.data + "\n" + chat.value;
};
ws.onopen = function() {
  field.addEventListener("keydown", function(event) {
    if(event.which === 13) {
      ws.send(field.value);
      field.value ="";
    }
  });
};
