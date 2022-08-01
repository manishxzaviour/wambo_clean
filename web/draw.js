google.charts.load("current", { packages: ["table"] });
let weatherW=document.createElement("div");
weatherW.innerHTML=`<div class="tomorrow item"
                        data-location-id="133449"
                        data-language="EN"
                        data-unit-system="METRIC"
                        data-skin="light"
                        data-widget-type="upcoming"						
                        style="width:1400px;padding-top:30px;"
                        id="d6"
                         >
                         </div>`;            
let divv=["d1","d2","d3","d4","d5"];
let rep=document.getElementById("report");
  divv.forEach((a)=>{
  let d=document.createElement("div");
  d.classList.add("item");
  d.setAttribute("id",a);
  rep.append(d);
   });
document.getElementById("d5").append(weatherW);            
function drawTable() {
  var tableD = new google.visualization.DataTable();
  tableD.addColumn("string", "YYYY-MM-DD");
  tableD.addColumn("string", "Temperature");
  tableD.addRows([["Date", "Celcius"]]);
  tableD.addRows(wetherDF);
  var table = new google.visualization.Table(document.getElementById("d4"));
  table.draw(tableD, { showRowNumber: true, width: "100%", height: "100%" });
}
let wetherPune =
  "https://api.tomorrow.io/v4/timelines?location=18.5204303,73.8567437&fields=temperature&units=metric&timesteps=1d&apikey=4eN1LmVG8PWXsdiUiAqVGqDZmV94LQbY";
let wetherD = "";
let wetherDF = [];
format();
$(document).ready(function () {
  try {
    $.get(wetherPune, function (data, status) {
      wetherD = JSON.stringify(data);
      console.log("Data: " + wetherD + "\nStatus: " + status);
      format();
    });
  } catch (err) {
    console.log(err.message);
  }
});
function format() {
  wetherD = wetherD.substring(119, wetherD.length - 4);
  for (let i = 0; i <= wetherD.length; i++) {
    if (wetherD[i] == "{") {
      let a = wetherD.slice(wetherD[i], wetherD.indexOf("}}") + 2);
      wetherDF.push(a);
      i = wetherD.indexOf("}}") + 2;
      wetherD = wetherD.slice(wetherD.indexOf("}}") + 2, wetherD.length);
    }
  }
  console.log(wetherDF);
  let tempDF = [];
  for (let i = 0; i <= wetherDF.length; i++) {
    let a = [];
    let b = String(wetherDF[i]);
    a.push(b.slice(b.indexOf('"startTime":"') + 13, b.indexOf('","') - 10));
    a.push(b.slice(b.indexOf('"temperature":') + 14, b.indexOf("}}")));
    tempDF.push(a);
  }
  tempDF.pop("['', '{v:}']");
  console.log(tempDF);
  wetherDF = tempDF;
  google.charts.setOnLoadCallback(drawTable);
}

(function (d, s, id) {
  if (d.getElementById(id)) {
    if (window.__TOMORROW__) {
      window.__TOMORROW__.renderWidget();
    }
    return;
  }
  const fjs = d.getElementsByTagName(s)[0];
  const js = d.createElement(s);
  js.id = id;
  js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "tomorrow-sdk");

