#include <TFT_eSPI.h>  // Include the TFT_eSPI library

TFT_eSPI tft = TFT_eSPI();  // Create TFT object

void setup() {
  tft.begin();              // Initialize the TFT screen
  tft.setRotation(3);       // Set rotation (optional)
  tft.fillScreen(TFT_BLACK);  // Fill the screen with black color
  tft.setTextColor(TFT_WHITE);  // Set text color to white
  tft.setTextSize(2);         // Set text size
  tft.setCursor(10, 10);      // Set the cursor position
  tft.print("Hello, World!"); // Print a test message
}

void loop() {
  // Your code here
}