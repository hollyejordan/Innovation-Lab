#include "AppConnection.h"
#include "AudioRecorder.h"
#include "ScreenManager.h"
#include "WiFi.h"
#include <Arduino.h>

const char *ssid = "Dnt";                                 // Enter SSID
const char *password = "bingus123";                       // Enter Password
const char *websockets_server = "ws://10.47.249.90:8080"; // server adress and port

AppConnection *conn = new AppConnection;
ScreenManager *screen = new ScreenManager;
AudioRecorder *recorder = new AudioRecorder();

void onmsg(const char *msg)
{
    Serial.println(msg);
    screen->set_text(String(msg));
}

void setup()
{
    Serial.begin(115200);
    screen->init();
    WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
    {
        Serial.print(".");
        delay(1000);
    }

    Serial.print("CONNECTED");

    recorder->init();

    // recorder->on_buffer_full(callback);

    conn->init();

    conn->on_received_message(onmsg);
}

void loop()
{
    // conn->loop();
    int16_t buf[SAMPLE_BUFFER_SIZE];
    size_t samples{};
    recorder->record_buffer(buf, samples);
    conn->app_send_buffer(buf, samples);
    conn->loop();
    //  for (int i = 0; i < buf->size; i++)
    //  {
    //  Serial.println(buf->buffer[i]);
    // }
    //  buf->free = true;
}