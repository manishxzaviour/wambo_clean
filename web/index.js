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
   // add table elements through iteration
  // <tr><td>Period</td><td id="day" style="text-align:center">On?</td></tr>
	// 					<tr><td>04_06</td><td class="sced"><input type="checkbox" class="box" id="a"></td></tr>
	// 					<tr><td>06_08</td><td class="sced"><input type="checkbox" class="box" id="b"></td></tr>
	// 					<tr><td>08_10</td><td class="sced"><input type="checkbox" class="box" id="c"></td></tr>
	// 					<tr><td>10_12</td><td class="sced"><input type="checkbox" class="box" id="d"></td></tr>
	// 					<tr><td>12_14</td><td class="sced"><input type="checkbox" class="box" id="e"></td></tr>
	// 					<tr><td>14_16</td><td class="sced"><input type="checkbox" class="box" id="f"></td></tr>
	// 					<tr><td>16_18</td><td class="sced"><input type="checkbox" class="box" id="g"></td></tr>
	// 					<tr><td>18_20</td><td class="sced"><input type="checkbox" class="box" id="h"></p></td></tr>
	// 					<tr><td>20_22</td><td class="sced"><input type="checkbox" class="box" id="i"></td></tr>
	// 					<tr><td>22_24</td><td class="sced"><input type="checkbox" class="box" id="j"></td></tr>
	// 					<tr><td>24_2</td><td class="sced"><input type="checkbox" class="box" id="k"></p></tr>
	// 					<tr><td>02_04</td><td class="sced"><input type="checkbox" class="box" id="l"></p></tr>
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
  // add inner html array to selF
  // <option value=0.0></option>
	// 						<option value=0.3></option>
	// 						<option value=1.0></option>
	// 						<option value=1.3></option>
	// 						<option value=2.0></option>
	// 						<option value=2.3></option>
	// 						<option value=3.0></option>
	// 						<option value=4.0></option>
	// 						<option value=6.0></option>
	// 						<option value=7.0></option>
	// 						<option value=8.0></option>
	// 						<option value=10.0></option>
}
window.onload = Do;
