#include "AppConnection.h"
#include "AudioRecorder.h"
#include "ScreenManager.h"
#include "WSMessageFactory.h"
#include "WiFi.h"
#include <Arduino.h>

const char *ssid = "";                                 // Enter SSID
const char *password = "";                       // Enter Password
const char *websockets_server = "ws://:9067"; // server adress and port

AppConnection *conn = new AppConnection;
ScreenManager *screen = new ScreenManager;
AudioRecorder *recorder = new AudioRecorder();

void onmsg(const char *msg)
{
    Serial.println(msg);
    String str(msg);

    WSMessage *parsed = WSMessageFactory::construct(str);
    Serial.println("Got msg, type: " + String(parsed->type));

    if (parsed->type == WSMessageType::Transcription)
    {
        WSM_Transcription *m = (WSM_Transcription *)parsed;

        Serial.println("Text: " + m->text);
        Serial.println("Diarized: " + String(m->diarized));
    }

    else if (parsed->type == WSMessageType::SetRecording)
    {
        WSM_SetRecording *m = (WSM_SetRecording *)parsed;

        Serial.println("is_recording: " + String(m->is_recording));
    }

    delete parsed;

    // screen->set_text(String(msg));
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
    conn->loop();
    int16_t buf[SAMPLE_BUFFER_SIZE];
    size_t samples{};
    recorder->record_buffer(buf, samples);
    conn->app_send_buffer(buf, samples);
    // for (int i = 0; i < buf->size; i++)
    // {
    // Serial.println(buf->buffer[i]);
    //}
    // buf->free = true;

    screen->queue_text("Hello this is some cool text and it's really long so i can test if it cuts off. here is even more text to make it even longer");
    
}