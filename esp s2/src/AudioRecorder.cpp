#include "AudioRecorder.h"

AudioRecorder *AudioRecorder::singleton_instance;

void AudioRecorder::on_buffer_full(BufferCallback p_buf)
{
    callback = p_buf;
}
#define BUFLEN 256
int32_t audio_buf[BUFLEN];
void AudioRecorder::record_buffer(void *_)
{
    while (true)
    {
        Serial.println("HI");
        size_t bytes_read;
        i2s_read(i2s_num, audio_buf, sizeof(audio_buf), &bytes_read, portMAX_DELAY);
        int32_t cleanBuf[BUFLEN / 2]{0};
        int cleanBufIdx = 0;
        for (int i = 0; i < BUFLEN; i++)
        {
            if (audio_buf[i] != 0) // Exclude values from other channel
            {
                cleanBuf[cleanBufIdx] = audio_buf[i] >> 14;
                cleanBufIdx++;
            }
        }
        float meanval = 0;
        int volCount = 0;
        for (int i = 0; i < BUFLEN / 2; i++)
        {
            if (cleanBuf[i] != 0)
            {
                meanval += cleanBuf[i];
                volCount++;
            }
        }
        meanval /= volCount;

        // subtract it from all sapmles to get a 'normalized' output
        for (int i = 0; i < volCount; i++)
        {
            cleanBuf[i] -= meanval;
        }

        // find the 'peak to peak' max
        float maxsample, minsample;
        minsample = 100000;
        maxsample = -100000;
        for (int i = 0; i < volCount; i++)
        {
            minsample = _min(minsample, cleanBuf[i]);
            maxsample = _max(maxsample, cleanBuf[i]);
        }
        Serial.print("Volume: ");
        Serial.println(maxsample - minsample);
        vTaskDelay(500 / portTICK_PERIOD_MS);
        AudioRecorder *bingus = (reinterpret_cast<AudioRecorder *>(_));
        if (bingus->callback != nullptr)
        {

            Buffer *bingus2 = bingus->buffer.get_buffer();
            bingus2->size = bytes_read;
            memcpy(bingus2->buffer, audio_buf, bytes_read);
            bingus->callback(bingus2);
        }
    }
}

void AudioRecorder::init()
{
    // Bunch of random stuff idfk
    pinMode(22, INPUT);
    i2s_driver_install(i2s_num, &i2s_config, 0, NULL);
    REG_SET_BIT(I2S_TIMING_REG(i2s_num), BIT(9));
    REG_SET_BIT(I2S_CONF_REG(i2s_num), I2S_RX_MSB_SHIFT);
    i2s_set_pin(i2s_num, &pin_config);

    // AudioRecorder::record_buffer(nullptr);

    xTaskCreate(AudioRecorder::record_buffer, "Recording Task", 2048, this, 1, NULL);
}

void AudioRecorder::start()
{
    enable_recording = true;
}

void AudioRecorder::stop()
{
    enable_recording = false;
}

AudioRecorder::AudioRecorder() : buffer(2048)
{
    init();
}

AudioRecorder *AudioRecorder::instance()
{
    if (singleton_instance == nullptr) singleton_instance = new AudioRecorder;
    return singleton_instance;
}
