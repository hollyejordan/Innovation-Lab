#include "ScreenManager.h"

void ScreenManager::init()
{

    delay(250);                // Wait for the screen to power up
    display.begin(0x3C, true); // Address 0x3C default

    display.setRotation(1);

    display.display();
    delay(250);

    // Set text settings
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);

    screen_set_text("Welcome to VocalEyes"); // Display a welcome message
}

void ScreenManager::set_text(const String &p_text)
{
    screen_set_text(p_text);
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

void ScreenManager::screen_set_formatted_text(const String &p_text, const char p_margin_left, const char p_margin_right)
{

    String out = "";

    int last_space = -1;
    int line_length = 0;

    for (int i = 0; i < p_text.length(); i++)
    {
        line_length++;
        out += p_text[i];
        if (p_text[i] == ' ') last_space = i;

        if (line_length > 15)
        {
            out[last_space] = '\n';
            line_length = i - last_space;
        }
    }

    screen_set_text(out);
}