
#include <FS.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
  IPAddress staticIP(192, 168, 0, 184); // static ip creating problems
  IPAddress subnet(255, 255, 0, 0);
  IPAddress gateway(192, 168, 0, 1);
  IPAddress primaryDNS(8, 8, 8, 8);
String ssid;
String password;
const char *ssid_ap = "Wambo_ap";
const int pin = 12;
const int btn = 14;
const int led = LED_BUILTIN;
bool stat=true;
bool flag=false;
float RemT = 0;
double CT ;
double setP;
double startT ;
double refresh1;    
float from;
float For;
String date;
String timeH;
int timeScedM;
int scedP[]={0,2,4,6,8,10,12,14,16,18,20,22,24};
int T = 0; // h*24*60*60*1000+m*60*1000
int scedule[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0};
String GotData;
int EleRate;
int EleSupply;
float ton=0;
float toff=0;
String xS = "<";
String xC = ">";
String xE = "</";
String xPC = "</data>";
float savedE = 0;
float savedM = 0;
int periodTog=true;
char xCh[][10] = {"D", "from", "for", "ton", "toff", "rate", "supply", "savedE", "savedM", "date"};
ESP8266WebServer server(80);

void Blink()
{
	digitalWrite(led, LOW);
	delay(500);
	digitalWrite(led, HIGH);
	delay(500);
}
void wifi()
{
	WiFi.mode(WIFI_STA);
	WiFi.config(staticIP, gateway, subnet, primaryDNS);
	WiFi.begin(ssid, password);
	while (WiFi.status() != WL_CONNECTED)
	{
		Serial.println(ssid);
		Serial.println(password);
		Blink();
	}
	Serial.println(WiFi.localIP());
	Blink();
}
void ap()
{
	WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(staticIP, gateway, subnet);
	WiFi.softAP(ssid_ap);
	Serial.println("AP_mode:");
	Serial.print(WiFi.softAPIP());
	Blink();
	Blink();
}
void ota()
{
	ArduinoOTA.setHostname("wambo");
	ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_FS
      type = "filesystem";
    }
	SPIFFS.end();
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
	ESP.restart();
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      Serial.println("Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      Serial.println("Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      Serial.println("Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      Serial.println("Receive Failed");
    } else if (error == OTA_END_ERROR) {
      Serial.println("End Failed");
    }
  });
  ArduinoOTA.begin();
}
void rFile(char *f, int a)
{ // file name  0,1,2,3 <html,css,js,text>
	File file = SPIFFS.open(f, "r");
	if (file)
	{
		String s;
		while (file.available())
		{
			s += char(file.read());
		}
		switch (a)
		{
		case 0:
			server.send(200, "text/html", s);
			break;
		case 1:
			server.send(200, "text/css", s);
			break;
		case 2:
			server.send(200, "text/javascript", s);
			break;
		case 3:
			server.send(200, "text/plain", s);
			break;
   		case 4:
    		 server.send(200, "text/xml", s+"</data>");
    		 break;
  		  }
		file.close();
	}
	else
	{
		server.send(200, "text/html", "Error: File does not exist");
	}
}
void wFile(int m, String d)
{ // write file f d 1,2, txt js
	switch (m)
	{
	case 0:
	{
		File file = SPIFFS.open("/Data.xml", "r");
		if (file)
		{
		String s;
		while (file.available())
		{
			s += char(file.read());
		}
		s+="\n"+(xS + xCh[0] + xC);
		s+="\n"+(xS + xCh[1] + xC);
		s+=(from);
		s+=(xE + xCh[1] + xC);
		s+="\n"+(xS + xCh[2] + xC);
		s+=(For);
		s+=(xE + xCh[2] + xC);
		s+="\n"+(xS + xCh[3] + xC);
		s+=(ton);
		s+=(xE + xCh[3] + xC);
		s+="\n"+(xS + xCh[4] + xC);
		s+=(toff);
		s+=(xE + xCh[4] + xC);
		s+="\n"+(xS + xCh[5] + xC);
		s+=(EleRate);
		s+=(xE + xCh[5] + xC);
		s+="\n"+(xS + xCh[6] + xC);
		s+=(EleSupply);
		s+=(xE + xCh[6] + xC);
		s+="\n"+(xS + xCh[7] + xC);
		s+=(savedE);
		s+=(xE + xCh[7] + xC);
		s+="\n"+(xS + xCh[8] + xC);
		s+=(savedM);
		s+=(xE + xCh[8] + xC);
		s+="\n"+(xS + xCh[9] + xC);
		s+=(date);
		s+=(xE + xCh[9] + xC);
		s+=(xE + xCh[0] + xC);
		Serial.println(s);
		file.close();
		file = SPIFFS.open("/Data.xml", "w");
		file.print(s);
		file.close();
		s=" ";
		}
	}
	case 1:
	{
		File file = SPIFFS.open("/memmo.txt", "w");
		file.print(d);
		file.close();
		break;
	}
	case 2:
	{
		File file = SPIFFS.open("/Sced.js", "w");
		file.print("var scedule=[");
		for (int x = 0; x < 12; x++)
		{
			file.print(scedule[x]);
			file.print(',');
		}
		file.print("];");
		file.println("export default scedule;");
		file.close();
		break;
	}
	}
}
void sced(int x)
{
    if(scedule[x]){
			stat=true;
		}else{
			stat=false;
			toff+=2;
			}
}
void hIndex()
{
	rFile("/Index.html", 0);
	Blink();
	Serial.println("Index");
}
void hIndexJs()
{
	rFile("/index.js", 2);
}
void hScedJs()
{
	rFile("/Sced.js", 2);
}
void hSM()
{
	rFile("/map.html", 0);
	Serial.println("SM");
}
void hAbt()
{
	rFile("/abt.html", 0);
	Serial.println("abt");
}
void hMsg()
{
	rFile("/Memmo.html", 0);
	Serial.println("memmo");
}
void hMsgGot()
{
	if (server.method() != HTTP_POST)
	{
		Serial.println(405);
		server.send(405, "text/plain", "Method Not Allowed");
	}
	else
	{
		Serial.println("GOT");
		GotData = server.arg("plain");
		rFile("/Ok.html", 0);
		// memmo=manish+%0D%0Apatil%0D%0A+++++pqrst
		//< > . , [ ] { } ! @ # $ % ^ & * ( ) - _ + / \ ` ~
		//%3C %3E . %2C %5B %5D %7B %7D %21 %40 %23 %24 %25 %5E %26 * %28 %29 - _ %2B %2F %5C %60 %7E
		char to[][25] = {"<", ">", ",", "[", "]", "{", "}", "!", "@", "#", "$", "%", "^", "&", "(", ")", "+", "/", "\\", "`", "~", "\"", "\'", "=", ":"};
		char frm[][25] = {"%3C", "%3E", "%2C", "%5B", "%5D", "%7B", "%7D", "%21", "%40", "%23", "%24", "%25", "%5E", "%26", "%28", "%29", "%2B", "%2F", "%5C", "%60", "%7E", "%22", "%27", "%3D", "%3A"};
		GotData = GotData.substring(6, GotData.length());
		GotData.replace('+', ' ');
		for (int x = 0; x < 25; x++)
		{
			GotData.replace(frm[x], to[x]);
		}
		GotData.replace("%0D%0A", "\n");
		Serial.println(GotData);
		wFile(1, GotData);
	}
}
void hMsgC()
{
	rFile("/memmo.txt", 3);
}
void set()
{
	double x = from * 60 * 60 * 1000;
	Serial.println(x);
	CT = millis();
	digitalWrite(pin, HIGH);
	WiFi.mode(WIFI_OFF);
	for (uint32_t tStart = millis(); (millis() - tStart) < x;)
	{
		RemT = ((millis() - CT) / x) * 100;
		Serial.println(RemT);
	}
	double tonn = millis() - setP;
	ton = tonn / (1000 * 60 * 60); // hr
	toff = For;
	savedE = (EleSupply-0.3) * toff;
	savedM = EleRate * (EleSupply-0.3)*230* toff/1000;
	wFile(0, " ");
	x = For * 60 * 60 * 1000;
	Serial.println(x);
	CT = millis();
	for (uint32_t tStart = millis(); (millis() - tStart) < x;)
	{
		RemT = ((millis() - CT) / x) * 100;
		Serial.println(RemT);
		digitalWrite(pin, LOW);
	}
	digitalWrite(pin, HIGH);
	WiFi.mode(WIFI_STA);
	WiFi.begin(ssid, password);
	WiFi.config(staticIP, gateway, subnet, primaryDNS);
	while (WiFi.status() != WL_CONNECTED)
	{
		delay(500);
		Serial.print(".");
	}
}
void hGot()
{
	Blink();
	if (server.method() != HTTP_POST)
	{
		Serial.println(405);
		server.send(405, "text/plain", "Method Not Allowed");
	}
	else
	{
		Serial.println("GOT");
		GotData = server.arg("plain");
		rFile("/Ok.html", 0);
   		delay(1000);
		from = GotData.substring(GotData.indexOf("1=") + 2, GotData.indexOf("&")).toFloat(); // from1=00&for2=00
		For = GotData.substring(GotData.indexOf("2=") + 2, GotData.indexOf("&T")).toFloat(); // from1=0.0&for2=8.0&Time
		// from1=0.0&for2=8.0&d=16-06-2022&t=Sat+Jul+16+2022+15%3A10%3A02
		//  Fri Jul 15 2022 14:16:58 : %3A
		date = GotData.substring(GotData.indexOf("&d=") + 3, GotData.indexOf("&t"));
		timeH = GotData.substring(GotData.length() - 12, GotData.length());
		timeH.replace("%3A", ":");
		Serial.println(GotData);
		set();
	}
}
void hUpd()
{
	rFile("/Upd.html", 0);
	Serial.println("Upd");
}
void hUpdGot()
{
	if (server.method() != HTTP_POST)
	{
		Serial.println(405);
		server.send(405, "text/plain", "Method Not Allowed");
	}
	else
	{
		Serial.println("GOT");
		GotData = server.arg("plain");
		char s[][13] = {"00_02", "02_04", "04_06", "06_08", "08_10", "10_12", "12_14", "14_16", "16_18", "18_20", "20_22","22_24","*Check"};
		for (int x = 0; x < 13; x++)
		{
			if (GotData.substring(GotData.indexOf(s[x]) + 6, GotData.indexOf(s[x + 1]) - 1) == "on")
			{
				scedule[x] = 1;
			}
			else
			{
				scedule[x] = 0;
			}
		}
		if (GotData.substring(GotData.indexOf("reset") + 6, GotData.length()) == "Y")
			{
				File file = SPIFFS.open("/Data.xml", "w");
				file.print("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
				file.println("<data>");
				file.close();
				Serial.println("Reset");
			}
		Serial.println(GotData.substring(GotData.indexOf("Check") + 6, GotData.indexOf("SSID") - 1));
		if (GotData.substring(GotData.indexOf("Check") + 6, GotData.indexOf("SSID") - 1) == "1111")
			{
			String z = GotData.substring(GotData.indexOf("SSID") + 5, GotData.indexOf("PWD") - 1);
			String w = GotData.substring(GotData.indexOf("PWD") + 4, GotData.indexOf("ElectricPrice") - 1);
			EleRate = GotData.substring(GotData.indexOf("Price") + 6, GotData.indexOf("ElectricSupply") - 1).toInt();
			EleSupply = GotData.substring(GotData.indexOf("Supply") + 7, GotData.indexOf("reset") - 1).toInt();
			File file = SPIFFS.open("/const.txt", "w");
			Serial.println(GotData.substring(GotData.indexOf("Price") + 6, GotData.indexOf("ElectricSupply") - 1));
			Serial.println(GotData.substring(GotData.indexOf("Supply") + 7, GotData.indexOf("reset") - 1));
			Serial.println(z);
			Serial.println(w);
			if (w.length() >= 8)
			{
				file.print("//ssid//");
				file.print(z);
				file.print("//pwd//");
				file.print(w);
				file.print("//end");
			}
			else{
				file.print("//ssid//");
				file.print(ssid);
				file.print("//pwd//");
				file.print(password);
				file.print("//end");
			}
			file.print("//EleR//");
			file.print(EleRate);
			file.print("//EleSuply//");
			file.print(EleSupply);
			file.print("//eend");
			file.close();
		}
		Serial.println(GotData);
		wFile(2, " ");
		rFile("/Ok.html", 0);
	}
 delay(1000);
 ESP.restart();
}
void hCss()
{
	rFile("/index.css", 1);
	Serial.println("css");
}
void hSced()
{
	rFile("/Sced.js", 2);
	Serial.println("js");
}
void hReportJs()
{
  rFile("/report.js", 2);
  Serial.println("js");
}
void hDrawJs()
{
  rFile("/draw.js", 2);
  Serial.println("js");
}
void hTonToffJs()
{
  rFile("/tontoff.js", 2);
  Serial.println("js");
}
void hUsageDataJs()
{
  rFile("/UsageData.js", 2);
  Serial.println("js");
}
void hSavingsDataJs()
{
  rFile("/SavingsData.js", 2);
  Serial.println("js");
}
void hSendJs()
{
  rFile("/send.js", 2);
  Serial.println("js");
}
void hData()
{
  rFile("/Data.xml", 4);
  Serial.println("js");
}
void hRep()
{
  rFile("/report.html", 0);
  Serial.println("js");
}
void hNF()
{
	server.send(404, "text/plain", "404:FNF");
	Serial.println(404);
}
void hStat()
{
  if(stat){server.send(200, "text/plain", "Stat : on");}
  else{server.send(200, "text/plain", "Stat : off");}
}
void hConst(){
	rFile("/const.txt", 3);
}
void handleRequest()
{
	server.begin();
	server.on("/", hIndex);
	server.on("/indexjs", hIndexJs);
	server.on("/Sced", hScedJs);
  	server.on("/reportjs", hReportJs);
  	server.on("/draw", hDrawJs);
  	server.on("/tontoff", hTonToffJs);
  	server.on("/UsageData", hUsageDataJs);
  	server.on("/SavingsData", hSavingsDataJs);
  	server.on("/send", hSendJs);
  	server.on("/Data", hData);
  	server.on("/rep/", hRep);
	server.on("/sm/", hSM);
	server.on("/abt/", hAbt);
	server.on("/msg/", hMsg);
	server.on("/msg/a", hMsgGot);
	server.on("/memmo", hMsgC);
	server.on("/wambo", hGot);
	server.on("/upd/", hUpd);
	server.on("/css", hCss);
	server.on("/scd", hSced);
	server.on("/upd/a", hUpdGot);
	server.on("/stat", hStat);
	// server.on("/const", hConst);
	server.onNotFound(hNF);
}
void getDate(){
  if ((WiFi.status() == WL_CONNECTED))
  {
    WiFiClient client;
    HTTPClient http;
    String x;
    stat=true;
    if (http.begin(client, "http://worldtimeapi.org/api/timezone/Asia/Kolkata"))
    {
      int httpCode = http.GET();
      if (httpCode > 0)
      {
        x = http.getString();
        //"datetime":"2022-07-17T14:49:38.276886+05:30
        //"datetime":"2022-07-17T11:09:39.686372+05:30
        x = x.substring(x.indexOf("datetime") + 22, x.indexOf("+05:30") - 10);
        timeScedM = x.substring(0, 3).toInt() * 60 + x.substring(3, 5).toInt();
        Serial.println(timeScedM);
        flag=true;
      }
      else
      {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    }
    else
    {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }}
void setup()
{
	setP=millis();
	pinMode(pin, OUTPUT);
	pinMode(led, OUTPUT);
	pinMode(btn, INPUT);
	digitalWrite(pin, HIGH);
	Serial.begin(115200);
  	delay(3000);
	SPIFFS.begin();
	File file = SPIFFS.open("/const.txt", "r");
	String s;
	while (file.available())
	{
		s += char(file.read());
	}
	ssid = s.substring(s.indexOf("ssid//") + 6, s.indexOf("//pwd"));
	password = s.substring(s.indexOf("pwd//") + 5, s.indexOf("//end"));
	EleRate = s.substring(s.indexOf("EleR//") + 6, s.indexOf("//EleSuply")).toInt();
	EleSupply = s.substring(s.indexOf("EleSuply//") + 10, s.indexOf("//eend")).toInt();
	file.close();
	file = SPIFFS.open("/Sced.js", "r");
	String ss;
	while (file.available())
	{
		ss += char(file.read());
	}
	String im=ss.substring(ss.indexOf("var scedule=[")+13,ss.indexOf("];"));
  String a="";
	for(int x=0;x<23;x++){
		if(x%2==0){a+=im[x];}
	}
  for(int x=0;x<13;x++){scedule[x]=String(a[x]).toInt();}
	file.close();
	MDNS.begin("Wambo");
	MDNS.addService("http","tcp", 80);
	 if (digitalRead(btn) == HIGH)
	 {
	 	ap();
	 }
	 else
	 {
	 	wifi();
	 }
 ota();
 startT=millis();
 getDate();
 Serial.println("scedule");
 for(int x=0;x<12;x++){
  Serial.print(scedule[x]);
  }
 Serial.println(" ");
 handleRequest();
}
void loop()
{
	server.handleClient();
	MDNS.update();
	ArduinoOTA.handle();
	if(flag){
	  int y=timeScedM+millis()/(1000*60);
  for(int x=0;x<13;x++){
    if((y-scedP[x]*60)<120&&(y-scedP[x]*60)>0){
      sced(x);
      if(x==12){
		getDate();
		savedE = EleSupply * toff;
		savedM = EleRate * EleSupply*230* toff/1000;
		double tonn=millis()-setP;
		ton=tonn/(1000 * 60 * 60);
		wFile(0, " ");
		if(!periodTog){
			setP=millis();
			toff=0;
		}
		periodTog=!periodTog;
		}
      }
  }}
  else{
    refresh1=millis();
    if(refresh1-startT>5*60*1000){
      getDate();
      startT=millis();
      }
    }
 if(stat){digitalWrite(pin,HIGH);}
 else{digitalWrite(pin,LOW);}
}
