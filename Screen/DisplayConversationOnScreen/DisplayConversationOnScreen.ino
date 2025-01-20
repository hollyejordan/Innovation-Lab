#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();  // Create TFT object

const char *ssid = "Dnt";                              // Enter SSID
const char *password = "bingus123";                    // Enter Password
const char *websockets_server = "ws://192.168.243.90:9067"; // server adress and port

using namespace websockets;

void onMessageCallback(WebsocketsMessage message)
{
  Serial.print("Got Message: ");
  Serial.println(message.data());

  String text = message.data().substring(18, message.data().length() - 18);
  text = text.substring(0, text.indexOf('"'));

  tft.fillScreen(TFT_BLACK);  // Fill the screen with black color
  tft.setCursor(10, 10);      // Set the cursor position
  tft.print(text);
}

void onEventsCallback(WebsocketsEvent event, String data)
{
  if (event == WebsocketsEvent::ConnectionOpened)
  {
    Serial.println("Connnection Opened");
  }
  else if (event == WebsocketsEvent::ConnectionClosed)
  {
    Serial.println("Connnection Closed");
  }
  else if (event == WebsocketsEvent::GotPing)
  {
    Serial.println("Got a Ping!");
  }
  else if (event == WebsocketsEvent::GotPong)
  {
    Serial.println("Got a Pong!");
  }
}

WebsocketsClient client;
void setup()
{
  Serial.begin(115200);

  tft.begin();              // Initialize the TFT screen
  tft.setRotation(3);       // Set rotation (optional)
  tft.fillScreen(TFT_BLACK);  // Fill the screen with black color
  tft.setTextColor(TFT_WHITE);  // Set text color to white
  tft.setTextSize(4);         // Set text size
  tft.setCursor(10, 10);      // Set the cursor position
  tft.print("Welcome."); // Print a test message

  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print(".");
    delay(1000);
  }

  // Setup Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect to server
  client.connect(websockets_server);

  // Send a message
  client.send("Hi Server!");
  // Send a ping
  client.ping();
}

void loop()
{
  client.poll();
}