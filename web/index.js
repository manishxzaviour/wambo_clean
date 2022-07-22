import scedule from './Sced.js';
var d = new Date();
var date=String(d.getDate())+'-'+String((d.getMonth()<10)?'0'+String(d.getMonth()):d.getMonth())+'-'+String(d.getFullYear());
document.getElementById("d").value=date;
function refT() {
  var ref = String(new Date());
  document.getElementById("time").value = ref.substring(0,24);
}
setInterval(refT, 1000);
function sendC() {
  document.getElementById("input").style = "background-color:#00ff00";
}
var frm = document.getElementById("fromIP");
var till = document.getElementById("forIP");
function check() {
  let x = document.f1.from1;
  let y = document.f1.for2;
  sendC();
  if (isNaN(parseFloat(x.value)) || isNaN(parseFloat(y.value))) {
    x.value=0.0;
    y.value=0.0;
    alert("input should be a number");
  } else if (
    x.value.charAt(0) == "." ||
    y.value.charAt(0) == "." ||
    x.value.split(".").length > 2 ||
    y.value.split(".").length > 2
  ) {
    x.value=0.0;
    y.value=0.0;
    alert("invalid input");
  }
}
frm.onfocus = function () {
  frm.value = "";
};
till.onfocus = function () {
  till.value = "";
};
document.f1.addEventListener('submit',check);
function Do() {
  var slot = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","l"];
  for (let i = 0; i < 12; i++) {
    var x = document.getElementById(slot[i]);
    x.checked = Boolean(scedule[i]);
    x.disabled = true;
  }
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    document.getElementById("bdy").style =
      "overflow:auto;  overflow-x: hidden;";
  } else {
    document.getElementById("bdy").style = "overflow: hidden;";
  }
}
window.onload = Do;
