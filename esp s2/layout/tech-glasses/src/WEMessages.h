#pragma once
#include <ArduinoJson.h>

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

// Builds the message from json
// Returns nullptr if failed
const WSMessage *construct_message(const String &p_json);