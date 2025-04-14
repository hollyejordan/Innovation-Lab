#include "ScreenManager.h"
#define QUEUE_SIZE 180

ScreenManager::ScreenManager() : queue(sizeof(String*), QUEUE_SIZE, FIFO) {

}

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

void ScreenManager::queue_text(String p_text) {

    Serial.println("HELLO");
    Serial.println(p_text);

    p_text += " ";

    int last_word_start = 0;

    for (int i = 0; i < p_text.length(); i++)
    {
        if (p_text[i] == ' ') {


            String* word = new String;
            *word = p_text.substring(last_word_start, i);

            queue.push(word);
            last_word_start = i+1;
        }
    }

    
    String **test;
    queue.pop(&test);

    Serial.println(**test);


    /*
    String * test;

    for (unsigned int i = 0 ; i < 3 ; i++)
	{
		queue.pop(&test);
		//test->remove(0, 4);
		Serial.println(*test);
	}
        */
}

void ScreenManager::queue_text(String p_text) {

    Serial.println("HELLO");
    Serial.println(p_text);

    p_text += " ";

    int last_word_start = 0;

    for (int i = 0; i < p_text.length(); i++)
    {
        if (p_text[i] == ' ') {


            String* word = new String;
            *word = p_text.substring(last_word_start, i);

            queue.push(word);
            last_word_start = i+1;
        }
    }

    
    String **test;
    queue.pop(&test);

    Serial.println(**test);


    /*
    String * test;

    for (unsigned int i = 0 ; i < 3 ; i++)
	{
		queue.pop(&test);
		//test->remove(0, 4);
		Serial.println(*test);
	}
        */
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