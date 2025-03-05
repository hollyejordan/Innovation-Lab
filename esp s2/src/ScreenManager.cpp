#include "ScreenManager.h"

void ScreenManager::init()
{

    delay(250);                // Wait for the screen to power up
    display.begin(0x3C, true); // Address 0x3C default

    // Set text settings
    display.setRotation(1);
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);

    this->screen_set_text("Welcome"); // Display a welcome message
}

void ScreenManager::screen_set_text(const String &p_text)
{

    this->screen_clear();    // Clear and reset the screen
    display.println(p_text); // Display the text on the screen
    display.display();
}

void ScreenManager::screen_clear()
{

    display.clearDisplay();  // Clear the screen
    display.setCursor(0, 0); // Reset the cursor
    display.display();       // Update the screen
}