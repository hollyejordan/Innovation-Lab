#include "WEMessages.h"

const WSMessage *construct_message(const String &p_json)
{
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, p_json);

    if (error) return nullptr;

    if (doc["type"].isNull() || !doc["type"].is<int>()) return nullptr;

    // Get the type of the message
    u_char type = doc["type"].as<u_char>();

    // Not casting to the enum, as I want the number values to be defined explicitly
    // This also assumes that if type is set, the json object contains all required valid values
    // Can be made safer later if needed

    // This is so ugly i hate it
    // I will split in into a factory class later, as this seems to be a cleaner choice
    // Also, it may not be the best to keep recreating these, so if it becomes a problem
    // we may need to reuse these objects, instead of discarding them after use
    switch (type)
    {
    case WSMessageType::Transcription:
    {
        WSM_Transcription *obj = new WSM_Transcription;
        obj->type = type;
        obj->text = doc["text"].as<String>();
        obj->diarized = doc["diarized"].as<DiarizedText>();
        return obj;
    }
    case WSMessageType::SettingUpdate:
    {
        if (doc["new_value"].is<int>())
        {
            WSM_SettingUpdate<int> *obj = new WSM_SettingUpdate<int>;
            obj->type = type;
            obj->new_value = doc["new_value"].as<int>();
            obj->setting_id = doc["setting_id"];
            return obj;
        }
        else if (doc["new_value"].is<float>())
        {
            WSM_SettingUpdate<float> *obj = new WSM_SettingUpdate<float>;
            obj->type = type;
            obj->new_value = doc["new_value"].as<float>();
            obj->setting_id = doc["setting_id"];
            return obj;
        }
        else if (doc["new_value"].is<String>())
        {
            WSM_SettingUpdate<String> *obj = new WSM_SettingUpdate<String>;
            obj->type = type;
            obj->new_value = doc["new_value"].as<String>();
            obj->setting_id = doc["setting_id"];
            return obj;
        }
        else if (doc["new_value"].is<bool>())
        {
            WSM_SettingUpdate<bool> *obj = new WSM_SettingUpdate<bool>;
            obj->type = type;
            obj->new_value = doc["new_value"].as<bool>();
            obj->setting_id = doc["setting_id"];
            return obj;
        }
        else return nullptr;
    }
    case WSMessageType::SetRecording:
    {
        WSM_SetRecording *obj = new WSM_SetRecording;
        obj->type = type;
        obj->is_recording = doc["is_recording"];
        return obj;
    }
    default:
        return nullptr;
    }
}