#include "WSMessageFactory.h"
#include "WSMessages.h"
#include <ArduinoJson.h>

WSMessage *WSMessageFactory::construct(String &p_raw_message)
{
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, p_raw_message);

    // Failed to deserialise
    if (error) return nullptr;

    // Invalid obj
    if (doc["type"].isNull() || !doc["type"].is<int>()) return nullptr;

    // Get the type of the message
    u_char type = doc["type"].as<u_char>();

    // I have read that its not so good to use the new operator a lot
    // in microprocessors, so if this becomes a problem then this
    // class will store all objects created, and instead of using delete once
    // a message has been used, it will have the used flag set to true
    // and then when a message is constructed, if an unused object exists
    // for this type, it will be reused.

    // Switch on the content type, i construct the object and return it
    // directly.
    switch (type)
    {
    case WSMessageType::Transcription:
    {
        return construct_transcription_msg(doc);
    }
    case WSMessageType::SettingUpdate:
    {
        // Settings update will have a different object
        // depending on the type of value it is updating
        if (doc["new_value"].is<int>())
        {
            return construct_settings_int_msg(doc);
        }
        else if (doc["new_value"].is<float>())
        {
            return construct_settings_float_msg(doc);
        }
        else if (doc["new_value"].is<String>())
        {
            return construct_settings_string_msg(doc);
        }
        else if (doc["new_value"].is<bool>())
        {
            return construct_settings_bool_msg(doc);
        }
        else return nullptr;
    }
    case WSMessageType::SetRecording:
    {
        return construct_set_recording_msg(doc);
    }
    default:
        return nullptr;
    }
}

// Standalone construction methods from json
// I do no extra checks on the json, I will assume the server
// in sending valid data for now

// Transcription incoming
WSM_Transcription *WSMessageFactory::construct_transcription_msg(JsonDocument &p_json)
{
    WSM_Transcription *obj = new WSM_Transcription;
    obj->type = WSMessageType::Transcription;
    obj->text = p_json["text"].as<String>();
    obj->diarized = p_json["diarized"].as<DiarizedText>();
    return obj;
}

// Settings with different types

// INT
WSM_SettingUpdate<int> *WSMessageFactory::construct_settings_int_msg(JsonDocument &p_json)
{
    WSM_SettingUpdate<int> *obj = new WSM_SettingUpdate<int>;
    obj->type = WSMessageType::SettingUpdate;
    obj->new_value = p_json["new_value"].as<int>();
    obj->setting_id = p_json["setting_id"];
    return obj;
}

// FLOAT
WSM_SettingUpdate<float> *WSMessageFactory::construct_settings_float_msg(JsonDocument &p_json)
{
    WSM_SettingUpdate<float> *obj = new WSM_SettingUpdate<float>;
    obj->type = WSMessageType::SettingUpdate;
    obj->new_value = p_json["new_value"].as<float>();
    obj->setting_id = p_json["setting_id"];
    return obj;
}

// STRING
WSM_SettingUpdate<String> *WSMessageFactory::construct_settings_string_msg(JsonDocument &p_json)
{
    WSM_SettingUpdate<String> *obj = new WSM_SettingUpdate<String>;
    obj->type = WSMessageType::SettingUpdate;
    obj->new_value = p_json["new_value"].as<String>();
    obj->setting_id = p_json["setting_id"];
    return obj;
}

// BOOL
WSM_SettingUpdate<bool> *WSMessageFactory::construct_settings_bool_msg(JsonDocument &p_json)
{
    WSM_SettingUpdate<bool> *obj = new WSM_SettingUpdate<bool>;
    obj->type = WSMessageType::SettingUpdate;
    obj->new_value = p_json["new_value"].as<bool>();
    obj->setting_id = p_json["setting_id"];
    return obj;
}

// Set Recording, (play/pause)
WSM_SetRecording *WSMessageFactory::construct_set_recording_msg(JsonDocument &p_json)
{
    WSM_SetRecording *obj = new WSM_SetRecording;
    obj->type = WSMessageType::SetRecording;
    obj->is_recording = p_json["is_recording"];
    return obj;
}
