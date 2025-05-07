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

    const char *websockets_server = "ws://10.174.149.90:3067"; // server adress and port

    socket->connect(websockets_server);

    socket->onMessage([this](WebsocketsMessage message) { this->messageHandler(message.c_str()); });
}

bool AppConnection::app_send_buffer(int16_t *p_buffer, size_t p_size)
{
    try
    {
        socket->sendBinary((char *)p_buffer, p_size * sizeof(int16_t));
    }
    catch (const std::exception &e)
    {
        Serial.println(e.what());
        return false;
    }

    return true;
}

bool AppConnection::app_send_text(const String &p_str)
{
    return socket->send(p_str.c_str());
}

bool AppConnection::on_received_message(MessageHandler p_message)
{
    messageHandler = p_message;
    return true;
}

void AppConnection::loop()
{
    socket->poll();
}
