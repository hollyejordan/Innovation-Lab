#pragma once

#include "ArduinoWebsockets.h"
#include "AudioRecorder.h"
#include "WSMessages.h"

using namespace websockets;

typedef void (*MessageHandler)(const WSMessage *);

// The data format the websocket uses, converted to a C++ struct
typedef int WebSocket;

// For now this class could handle
// Websocket - audio, incoming transcriptions, actions such as settings change from app
// Initial connection - Connecting to hotspot on phone, (still not sure the best method to do this without
// hardcoding)

void onEventsCallback(WebsocketsEvent event, String data);

class AppConnection
{
    // If the ESP is connected to the app (not websocket)
    bool network_connected;

    // Websocket will be its own class
    WebsocketsClient *socket;

    MessageHandler messageHandler;

  public:
    void init();

    // Input & output

    // Send audio buffer to the app, should be synchronous and return true once its complete
    // false if it failed. The buffer should be locked until this is complete
    bool app_send_buffer(const Buffer *p_buffer);

    // Sends a message to the app, false if failed
    bool app_send_message(const WSMessage &p_message);

    // When the app sends a message, could be a setting change or incoming text transcription
    bool on_received_message(const MessageHandler p_message);

    // If both network and websocket have connected and can communicate
    bool is_connected();

    // Disconnect from the app
    void disconnect();

    // No idea how this will work, just suggestion
    // Scans the available networks until it finds the correct one
    // This could be the app using a hardcoded temp name or something (not secure)
    // Returns false if it timed out / somehow failed
    bool look_for_connection();

    // Loop required by lib
    void loop();

    // WebSocket will need to be deleted, connections closed and ect
    ~AppConnection();
};
