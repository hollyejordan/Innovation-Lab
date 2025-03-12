#include "AppConnection.h"

void onEventsCallback(WebsocketsEvent event, String data)
{
    if (event == WebsocketsEvent::ConnectionOpened)
    {
        Serial.println("Connnection Opened");
    }
    else if (event == WebsocketsEvent::ConnectionClosed)
    {
        Serial.println("Connnection Closed");
    }
    else if (event == WebsocketsEvent::GotPing)
    {
        Serial.println("Got a Ping!");
    }
    else if (event == WebsocketsEvent::GotPong)
    {
        Serial.println("Got a Pong!");
    }
}

void AppConnection::init()
{

    socket = new WebsocketsClient;

    const char *websockets_server = "ws://10.189.219.90:9067"; // server adress and port

    socket->connect(websockets_server);

    socket->onMessage([this](WebsocketsMessage message) { this->messageHandler(nullptr); });
}

bool AppConnection::app_send_buffer(const Buffer *p_buffer)
{
    socket->sendBinary(p_buffer->buffer, p_buffer->size);
}

bool AppConnection::app_send_text(const String &p_str)
{
    return socket->send(p_str.c_str());
}

bool AppConnection::on_received_message(MessageHandler p_message)
{

    if (messageHandler != nullptr)
    {

        messageHandler = p_message;
    }

    return true;
}

void AppConnection::loop()
{
    socket->poll();
}
