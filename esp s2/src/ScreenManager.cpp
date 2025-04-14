#include "ScreenManager.h"
#define QUEUE_SIZE 180

ScreenManager::ScreenManager() : queue(QUEUE_SIZE) {

}

void ScreenManager::init()
{

    Serial.println("screen init");

    delay(250);                // Wait for the screen to power up
    display.begin(0x3C, true); // Address 0x3C default

    display.setRotation(3);

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

void ScreenManager::queue_text(String p_text) {

    p_text += " ";
    int last_word_start = 0;

    for (int i = 0; i < p_text.length(); i++) { // For each char of the string given
        
        if (p_text[i] == ' ') { // If the char is a space

            String word = p_text.substring(last_word_start, i); // Get the next word chunk
            queue.push(word); // Push the word to the queue
            last_word_start = i+1; // Change last word's start index to start of the next word
        }
    }
    check_queue();
}

void ScreenManager::check_queue() {

    Serial.println("checking queue");

    if (queue.is_empty()) return;
    
    String textToDisplay;
    String nextWord;
    
    while (!queue.is_empty()) {

        textToDisplay = "";

        while (queue.peek(nextWord) ) {

            if ((textToDisplay + nextWord).length() <= settings.screen_char_width) {
    
                queue.pop(nextWord);
                textToDisplay += nextWord;
                textToDisplay += " ";
            }
            else {
    
                break;
            }
        }
        Serial.println(textToDisplay);
        screen_set_text(textToDisplay);
        delay(1000);
    }
}


void ScreenManager::pop_queue() {


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

void ScreenManager::set_formatted_text(const String &p_text, const char p_margin_left, const char p_margin_right)
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