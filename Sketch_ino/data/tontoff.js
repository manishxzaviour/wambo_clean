var parser = new DOMParser();
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(pie);
function pie() {
    var xmlDoc = parser.parseFromString(String(DataXml), "text/xml");
    var on = xmlDoc.getElementsByTagName("ton");
    var off = xmlDoc.getElementsByTagName("toff");
    console.log(on,off);
    var onT=0;
    var offT=0;
    for (var x = 0; x < on.length; x++) {
        onT=onT+parseFloat(on[x].childNodes[0].nodeValue);
        offT=offT+parseFloat(off[x].childNodes[0].nodeValue);
        console.log(onT,offT);
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
  }

