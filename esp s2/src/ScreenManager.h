#pragma once
#include "Queue.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <cppQueue.h>

// Placeholder
typedef int DiarizedText;
typedef int RGBColor;

// Settings, placeholder
struct ScreenManagerSettings
{
    // Defaults
    unsigned char font_size = 5;

    // If we have diff color modes for accessibility
    unsigned char color_scheme = 1;

    // Text must be displayed for at least this time (May not be necessary, but I think it may be)
    // Max ~32k
    unsigned short min_display_time = 4000;

    // 32

    // Just to play around with. Probably not needed tbh
    unsigned char margin = 0;

    // Wrapping
    bool word_break = true;

    // Break words with a dash
    bool dash_break = false;

    // If the screen should only display one speaker at a time
    bool single_speaker = false;

    int screen_char_width = 15;
    int screen_char_height = 7;

    // 64

    int ms_per_char = 80;
};

// This manages the screen & display logic, such as when the next text is displayed,
// how long for, coloring and ect
class ScreenManager
{
    // Im not sure of the classes and ect required to control the screen, but they go here

    Queue<String> queue;

    ScreenManagerSettings settings{};

    // Util funcs to get screen info //
    // May be moved out of the class

    // Gets the number of lines without any text, based on font size
    void screen_get_lines_free();

    // Gets the number of lines a string of text will take up, once it has been wrapped with the
    // current wrapping settings, accounting for margin & fontsize
    void text_wrapped_get_lines();

    // Low level functions for controlling the screen //

    // Directly sets the text. Should clear the screen first, so that only p_text is displayed
    void screen_set_text(const String &p_text);

    void set_formatted_text(const String &p_text, const char p_margin_left, const char p_margin_right);

    // Completely clears the screen
    void screen_clear();

    // Check if there is queued text to display
    int check_queue();

    static void check_queue_loop(void *p);

  public:
    // TFT_eSPI tft = TFT_eSPI(); // Create TFT object
    Adafruit_SH1107 display = Adafruit_SH1107(64, 128, &Wire);

    // Screen probably has some setup stuff idk
    void init();

    // Adds text to the queue
    void queue_text(String p_text);

    // For other use cases where the text must be set, such as loading or pairing
    void set_text(const String &p_text);

    // Updates time per char
    void set_time_per_char(int p_ms);

    int get_time_per_char();

    ScreenManager();
};
