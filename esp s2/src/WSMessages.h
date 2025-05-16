#pragma once
#include <ArduinoJson.h>

// bblanchon. (2025). ArduinoJson. [online] Available at:
// https://registry.platformio.org/libraries/bblanchon/ArduinoJson [Accessed 16 May 2025].

// Placeholder
typedef int DiarizedText;

enum WSMessageType
{
    Transcription,
    SettingUpdate,
    SetRecording
};

struct WSMessage
{
    u_char type;
};

// Msg Response
struct WSM_Transcription : public WSMessage
{
    // Text
    // Dupe data here, text may not be neccessary
    String text;
    DiarizedText diarized;
};

// This should be ok to use for initial setting synchronisation
// Considering the audio will be send every few hundered ms,
// sending about 10 or so of these to sync will not be a problem
template <typename SettingType>
struct WSM_SettingUpdate : public WSMessage
{
    // The setting being changed
    u_char setting_id;

    // New value
    SettingType new_value;
};

struct WSM_SetRecording : public WSMessage
{
    bool is_recording;
};