//Include WiFi
#include <WiFi.h>
#include <WebServer.h>

//Used to disable the brownout connection - if not here, there's some really weird results outputted to the serial monitor
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

//Wepages
#include "homepage.h"
#include "login.h"
#include "appHomepage.h"

// Set web server port number to 80
WebServer server(80);

// Variable to store the HTTP request
String header;

//Template usernames and passwords
String templateUsername = "SmartGlasses";
String templatePassword = "Password";

//WiFi credentials
const char* ssid = "iPhone (80)";
const char* password = "MadisonsIphone80";

//Main page
void handleRoot(){
  Serial.println("GET /");
  server.send(200, "text/html", homepage);
}

//Login Page
void handleLogin(){
  //Checks to see if the server has the username 
  if (server.hasArg("USERNAME")){
    Serial.println("Username: " + server.arg("USERNAME"));
    String enteredUsername = server.arg("USERNAME");
    //IF HAS PASSWORD
    if (server.hasArg("PASSWORD")){
      String enteredPassword = server.arg("PASSWORD");
      //Checks entered credentials against accepted credentials
      if (templatePassword == enteredPassword && templateUsername == enteredUsername){
        Serial.println("Login Accepted");
        //Switch to app homepage
        handleAppHomepage();
      } else {
        //Continue printing login page
        Serial.println("Login Failed");
        Serial.println("GET /login");
        server.send(200, "text/html", login);
      }
    }
  }

  //Used to continuously print the webpage
  Serial.println("GET /login");
  server.send(200, "text/html", login);
  
}

//App homepage
void handleAppHomepage(){
  Serial.println("GET /appHomepage");
  server.send(200, "text/html", appHomepage);
}


void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector
  Serial.begin(921600); 

  //Connect to WiFI
  WiFi.begin(ssid, password);

  //Until connected
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("\nConnecting...");
  }

  //prints the local ID which is used to connect to the webpage
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  //Webpages - every time a new webpage is added, it HAS to be added here
  server.on("/", handleRoot);
  server.on("/login", handleLogin);
  server.on("/appHomepage", handleAppHomepage);

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  //Continuously handle client on loop until disconnected
  server.handleClient();
}
