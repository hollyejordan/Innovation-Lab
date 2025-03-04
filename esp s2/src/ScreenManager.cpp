#include "ScreenManager.h"

void ScreenManager::init() {

    delay(250); // Wait for the screen to power up
    display.begin(0x3C, true); // Address 0x3C default

    // Clear the buffer
    display.clearDisplay();
    display.display();

    // Set text settings
    display.setRotation(1);
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(0,0);

    display.println("Welcome."); // Display welcome message
    display.display(); // Update screen to display changes
}

/*
void ScreenManager::screen_set_text(const String& p_text) {

    tft.fillScreen(TFT_BLACK); // Sets the screen to black
    tft.setCursor(10, 10); // Reset the cursor
    tft.print(p_text); // Print the text to the screen
}
*/

void ScreenManager::screen_clear() {

    display.clearDisplay(); // Clear the screen
    display.setCursor(0,0); // Reset the cursor
    display.display(); // Update the screen
}