#include "ScreenManager.h"
#define QUEUE_SIZE 180
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

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

    
    queue_text("Welcome to VocalEyes"); // Display a welcome message

    BaseType_t xReturned;
        TaskHandle_t xHandle = NULL;

        xReturned = xTaskCreate(
            check_queue_loop,       /* Function that implements the task. */
            "NAME",          /* Text name for the task. */
            2048,      /* Stack size in words, not bytes. */
            this,    /* Parameter passed into the task. */
            tskIDLE_PRIORITY,/* Priority at which the task is created. */
            nullptr );
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

            while (word.length() > settings.screen_char_width) {

                String subword = word.substring(0, settings.screen_char_width - 1);
                subword += "-";
                queue.push(subword);
                word = word.substring(settings.screen_char_width - 1, word.length());
            }
            queue.push(word); // Push the word to the queue
            last_word_start = i+1; // Change last word's start index to start of the next word
        }
    }
}

void ScreenManager::check_queue() {


    
    String textToDisplay;
    String nextWord;
    int cursorLine = 1;
    
    while (!queue.is_empty()) {

        textToDisplay = "";

        while ((queue.peek(nextWord)) && (cursorLine <= settings.screen_char_height)) {

            if ((textToDisplay + nextWord).length() <= (settings.screen_char_width * cursorLine)) {
                
                queue.pop(nextWord);
                textToDisplay += nextWord;
                textToDisplay += " ";
            }
            else {

                while (textToDisplay.length() <= (settings.screen_char_width * cursorLine)) {
                    
                    textToDisplay += " ";
                }
                textToDisplay += "\n";
                cursorLine++;

                queue.pop(nextWord);
                textToDisplay += nextWord;
                textToDisplay += " ";
            }
        }
        screen_set_text(textToDisplay);
        cursorLine = 1;
        vTaskDelay(4000 / portTICK_PERIOD_MS);
       
    }
}

void ScreenManager::check_queue_loop(void* p) {

    ScreenManager* screen = (ScreenManager*)p;

    while (true) {

        screen->check_queue();
        vTaskDelay(4000 / portTICK_PERIOD_MS);
    }
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