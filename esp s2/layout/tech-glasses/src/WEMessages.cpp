#include "WEMessages.h"

const WSMessage *construct_message(const String &p_json)
{
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, p_json);

        if (error)
        {
                return nullptr;
        }

        if (doc["type"].isNull() || !doc["type"].is<int>())
        {
                return nullptr;
        }

        // Get the type of the message
        u_char type = doc["types"].as<u_char>();

        /*
        // Not casting to the enum, as I want the number values to be defined explicitly
        switch (type)
        {
        case 0:
                WSM_UpdateFontSize *obj = new WSM_UpdateFontSize;
                obj->type = static_cast<WSMType>(type);
                obj->size = doc["size"].as<u_char>();
                return obj;
        }*/
        return nullptr;
}