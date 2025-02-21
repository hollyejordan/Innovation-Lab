#include <Arduino.h>
#include "WiFi.h"
#include <AppConnection.h>

const char *ssid = "Dnt";                                   // Enter SSID
const char *password = "bingus123";                         // Enter Password
const char *websockets_server = "ws://192.168.182.90:9067"; // server adress and port

AppConnection* conn = new AppConnection;

void test(const WSMessage*) {

  Serial.println("Hello");
}

void setup()
{
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("CONNECTED");
  

  
  conn->init();
  conn->on_received_message(test);
}

void loop()
{
  conn->loop();
}