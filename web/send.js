var xmL = new XMLHttpRequest();
var DataXml;
  xmL.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      DataXml=this.responseText;
    }
  };
xmL.open("GET", "./Data.xml", true);
xmL.send();
