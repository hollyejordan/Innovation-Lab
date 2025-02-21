#include "AppConnection.h"

void AppConnection::init() {

    socket = new WebsocketsClient;

    const char *websockets_server = "ws://10.189.219.90:9067"; // server adress and port

    socket->connect(websockets_server);

    socket->onMessage([this](WebsocketsMessage message){
        this->messageHandler(nullptr);
    });
   // client.onEvent(onEventsCallback);
   // client.connect(websockets_server);

}

bool AppConnection::on_received_message(MessageHandler p_message) {

    if (messageHandler != nullptr) {

        messageHandler = p_message;
    }

    return true;
}

void AppConnection::loop()
{
    socket->poll();
}
