#include "WSMessages.h"
#include <ArduinoJson.h>

// bblanchon. (2025). ArduinoJson. [online] Available at:
// https://registry.platformio.org/libraries/bblanchon/ArduinoJson [Accessed 16 May 2025].

class WSMessageFactory
{
    // Standalone construction methods from json
    // I do no extra checks on the json, I will assume the server
    // in sending valid data for now

    // Transcription incoming
    static WSM_Transcription *construct_transcription_msg(JsonDocument &p_json);

    // Setting have with different types

    // INT
    static WSM_SettingUpdate<int> *construct_settings_int_msg(JsonDocument &p_json);

    // FLOAT
    static WSM_SettingUpdate<float> *construct_settings_float_msg(JsonDocument &p_json);

    // STRING
    static WSM_SettingUpdate<String> *construct_settings_string_msg(JsonDocument &p_json);

    // BOOL
    static WSM_SettingUpdate<bool> *construct_settings_bool_msg(JsonDocument &p_json);

    // Set Recording, (play/pause)
    static WSM_SetRecording *construct_set_recording_msg(JsonDocument &p_json);

    // Main construction method
    // Parses the json, and returns an object if the json is in a valid format
  public:
    static WSMessage *construct(String &p_raw_message);
};