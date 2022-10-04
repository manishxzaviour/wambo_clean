var parser = new DOMParser();
var usageD = [["Day", "Active-Time"]];
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawLine);
function drawLine() {
  var xmlDoc = parser.parseFromString(String(DataXml), "text/xml");
  var from = xmlDoc.getElementsByTagName("from");
  var foR = xmlDoc.getElementsByTagName("for");
  var dateT = xmlDoc.getElementsByTagName("date");
  var act = [];
  var date = [];
  var dateM = [];
  for (var x = 0; x < from.length; x++) {
    act[x] =
      parseInt(from[x].childNodes[0].nodeValue) +
      parseInt(foR[x].childNodes[0].nodeValue);
    date[x] = parseInt(dateT[x].childNodes[0].nodeValue.substring(0, 2));
    dateM[x] = parseInt(dateT[x].childNodes[0].nodeValue.substring(3, 5));
    if (dateM[x]==1) {
      date[x]=date[x]+0;
    } else if (dateM[x]==2) {
      date[x]=date[x]+31;
    } else if (dateM[x]==3) {
      date[x]=date[x]+31+28;
    } else if (dateM[x]==4) {
      date[x]=date[x]+31+28+31;
    } else if (dateM[x]==5) {
      date[x]=date[x]+31+28+31+30;
    } else if (dateM[x]==6) {
      date[x]=date[x]+31+28+31+30+31;
    } else if (dateM[x]==7) {
      date[x]=date[x]+31+28+31+30+31+30;
    } else if (dateM[x]==8) {
      date[x]=date[x]+31+28+31+30+31+30+31;
    } else if (dateM[x]==9) {
      date[x]=date[x]+31+28+31+30+31+30+31+31;
    } else if (dateM[x]==10) {
      date[x]=date[x]+31+28+31+30+31+31+30+31+30;
    } else if (dateM[x]==11) {
      date[x]=date[x]+31+28+31+30+31+31+30+31+30+30;
    }else if (dateM[x]==12) {
      date[x]=date[x]+31+28+31+30+31+31+30+31+30+30+31;
    } 
    usageD[x + 1] = [date[x], act[x]];
  }
  var pointD = google.visualization.arrayToDataTable(usageD);
  var pointOpt = {
    title: "Active-Time vs Day",
    hAxis: { title: "Period-Day", minValue: 1, maxValue: 365 },
    vAxis: { title: "Time-24H", minValue: 0, maxValue: 24 },
    legend: "none",
  };
  var point = new google.visualization.LineChart(document.getElementById("d2"));
  point.draw(pointD, pointOpt);
}