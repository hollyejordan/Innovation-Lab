#pragma once
#include <ArduinoJson.h>

// Placeholder

struct WSMessage
{
    u_char type;
};

// Example msg
struct WSM_Transcription : public WSMessage
{
    // Text
    String text;
    int id;
};

//
struct WSM_SettingUpdateInt : public WSMessage
{
    // Text
    ;
    int setting_id;
};

// Builds the message from json
// Returns nullptr if failed
const WSMessage *construct_message(const String &p_json);