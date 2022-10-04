var parser = new DOMParser();
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(savingsDF);

function savingsDF() {
  var xmlDoc = parser.parseFromString(String(DataXml), "text/xml");
  var dateT = xmlDoc.getElementsByTagName("date");
  var sE = xmlDoc.getElementsByTagName("savedE");
  var sM = xmlDoc.getElementsByTagName("savedM");
  var savedM = [];
  var savedE = [];
  var date = [];
  var savingsD = [
    ["Month", "Savings in wH", "Savings in Rs"],
    ["Jan-Feb", 0, 0],
    ["Mar-Apr", 0, 0],
    ["May-Jun", 0, 0],
    ["Jul-Aug", 0, 0],
    ["Sep-Oct", 0, 0],
    ["Nov-Dec", 0, 0],
  ];
  for (var x = 0; x < dateT.length; x++) {
    savedE[x] = parseFloat(sE[x].childNodes[0].nodeValue);
    savedM[x] = parseFloat(sM[x].childNodes[0].nodeValue);
    date[x] = parseInt(dateT[x].childNodes[0].nodeValue.substring(3, 5));
    if (date[x] == 1 || date[x] == 2) {
      savingsD[1][1]=savingsD[1][1]+savedE[x];
      savingsD[1][2]=savingsD[1][2]+savedM[x];
    } else if (date[x] == 3 || date[x] == 4) {
      savingsD[2][1]=savingsD[2][1]+savedE[x];
      savingsD[2][2]=savingsD[2][2]+savedM[x];
    } else if (date[x] == 5 || date[x] == 6) {
      savingsD[3][1]=savingsD[3][1]+savedE[x];
      savingsD[3][2]=savingsD[3][2]+savedM[x];
    } else if (date[x] == 7 || date[x] == 8) {
      savingsD[4][1]=savingsD[4][1]+savedE[x];
      savingsD[4][2]=savingsD[4][2]+savedM[x];
    } else if (date[x] == 9 || date[x] == 10) {
      savingsD[5][1]=savingsD[5][1]+savedE[x];
      savingsD[5][2]=savingsD[5][2]+savedM[x];
    } else if (date[x] == 11 || date[x] == 12) {
      savingsD[6][1]=savingsD[6][1]+savedE[x];
      savingsD[6][2]=savingsD[6][2]+savedM[x];
    }
  }
  var barD = google.visualization.arrayToDataTable(savingsD);
  var barOpt = {
    title: "Savings",
  };
  var bar = new google.visualization.BarChart(document.getElementById("d3"));
  bar.draw(barD, barOpt);
  console.log(savingsD);
}

//data date month ele rate ele supply off time?
//bar
// two month period data calculation
// make a seperate xml?
// no need for seperate xml just js
