#include "AppConnection.h"
#include "AudioRecorder.h"
#include "ScreenManager.h"
#include "WSMessageFactory.h"
#include "WiFi.h"
#include <Arduino.h>

const char *ssid = "Dnt";           // Enter SSID
const char *password = "bingus123"; // Enter Password

AppConnection *conn = new AppConnection;
ScreenManager *screen = new ScreenManager;
AudioRecorder *recorder = new AudioRecorder();

void onmsg(const char *msg)
{
    Serial.println(msg);
    String str(msg);

    WSMessage *parsed = WSMessageFactory::construct(str);
    Serial.println("Got msg, type: " + String(parsed->type));

    switch (parsed->type)
    {
    case WSMessageType::Transcription:
    {
        WSM_Transcription *m = (WSM_Transcription *)parsed;

        Serial.println("Text: " + m->text);
        Serial.println("Diarized: " + String(m->diarized));

        screen->queue_text(m->text);
    }
    break;
    case WSMessageType::SettingUpdate:
    {
        WSM_SettingUpdate<int> *m = (WSM_SettingUpdate<int> *)parsed;
        Serial.println(m->new_value);
        Serial.println(m->setting_id);
        screen->set_time_per_char(m->new_value);
    }
    break;
    default:
        break;
    }

    delete parsed;
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

    //   screen->queue_text("Hello this is some cool text to demonstrate the functionality of the screen. This is long
    //   so that it can display multiple different screens of text");

  //  screen->set_text("Hello children. Welcome to the jungle");
}

void loop()
{
    conn->loop();
    int16_t buf[SAMPLE_BUFFER_SIZE];
    size_t samples{};
    recorder->record_buffer(buf, samples);
    conn->app_send_buffer(buf, samples);
}