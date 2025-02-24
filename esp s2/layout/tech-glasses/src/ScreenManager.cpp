#include "ScreenManager.h"

void ScreenManager::init() {

    Serial.println("Initializing TFT...");
    tft.begin(); // Initialize the TFT screen
    Serial.println("TFT Initialized.");

    
    tft.setRotation(3);       // Set rotation (optional)
    tft.fillScreen(TFT_BLACK);  // Fill the screen with black color
    tft.setTextColor(TFT_WHITE);  // Set text color to white
    tft.setTextSize(4);         // Set text size
    tft.setCursor(10, 10);      // Set the cursor position
    tft.print("Welcome."); // Print a test message
}

void ScreenManager::screen_set_text(const String& p_text) {

    tft.fillScreen(TFT_BLACK); // Clear the screen
    tft.setCursor(10, 10); // Reset the cursor
    tft.print(p_text); // Print the text to the screen
}