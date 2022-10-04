import scedule from './Sced.js';
var d = new Date();
var date=String(String((d.getDate()<10)?'0'+String(d.getDate()):d.getDate()))+'-'+String(((d.getMonth()<10)?'0'+String(d.getMonth()):d.getMonth())+1)+'-'+String(d.getFullYear());
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
  let listE=document.querySelector("#selF");
  let lst=0.0;
  var slot = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","l"];
  let table=document.getElementById("scedT");
  let c=0;
  for(let x=0;x<12;x++){
    let tr=document.createElement("tr");
    let td1=document.createElement("td");
    let td2=document.createElement("td");
    let ip=document.createElement("input");
    let opt=document.createElement("option");
    opt.value=lst;
    listE.appendChild(opt);
    lst+=0.5;
    ip.type="checkbox";
    ip.setAttribute("id",slot[x]);
    ip.checked = Boolean(scedule[x]);
    ip.disabled = true;
    td1.innerText=((c<10)?("0"+c):c)+"_"+((c+2<10)?("0"+(c+2)):c+2);
    c+=2;
    td2.appendChild(ip);
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.append(tr);
  }
  if (
    window.innerWidth < 600
  ) {
    document.getElementById("bdy").style =
      "overflow:auto;  overflow-x: hidden;";
      document.getElementById("wrapper2").style = "display:block;height:20px;width:100px";
      document.getElementById("wrapper2").innerHTML = "<a href=\"/rep/\" class=\"genericText\">Report</a>";
  } else {
    document.getElementById("bdy").style = "overflow: hidden;";
      let y=document.createElement("script");
      y.src="./report.js";
      document.body.appendChild(y);
  }
}
window.onload = Do;
