var parser = new DOMParser();
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(pie);
function pie() {
    var xmlDoc = parser.parseFromString(String(DataXml), "text/xml");
    var on = xmlDoc.getElementsByTagName("ton");
    var off = xmlDoc.getElementsByTagName("toff");
    var onT=0;
    var offT=0;
    for (var x = 0; x < on.length; x++) {
        onT=onT+parseInt(on[0].childNodes[0].nodeValue);
        offT=offT+parseInt(off[0].childNodes[0].nodeValue);
    }
    var pieOpt = {
        title: "Distribution",
        is3D: true,
      };
      var pie = new google.visualization.PieChart(document.getElementById("d1"));
      var pieD = google.visualization.arrayToDataTable([
        ["distribution", "duration"],
        ["onTime", onT],
        ["offTime", offT],
      ]);
      pie.draw(pieD, pieOpt);
    console.log(onT,offT);
  }

//average from xml
// get average of ton and toff
