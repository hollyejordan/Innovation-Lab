#include "AudioRecorder.h"

#define SAMPLE_BUFFER_SIZE 512
// most microphones will probably default to left channel but you may need to tie the L/R pin low
#define I2S_MIC_CHANNEL I2S_CHANNEL_FMT_ONLY_LEFT

#define I2S_MIC_SERIAL_CLOCK GPIO_NUM_32
#define I2S_MIC_LEFT_RIGHT_CLOCK GPIO_NUM_25
#define I2S_MIC_SERIAL_DATA GPIO_NUM_33

AudioRecorder *AudioRecorder::singleton_instance;

void AudioRecorder::on_buffer_full(BufferCallback p_buf)
{
    callback = p_buf;
}

int32_t buf[SAMPLE_BUFFER_SIZE];
bool AudioRecorder::record_buffer(int16_t *p_dest, size_t &p_samples_count)
{
    int read_result = i2s_read(I2S_NUM_0, buf, sizeof(int32_t) * SAMPLE_BUFFER_SIZE, &p_samples_count, portMAX_DELAY);

    if (read_result != ESP_OK)
    {
        Serial.println("I2S read failed");
        return false;
    }
    else
    {
        int samples_read = p_samples_count / sizeof(int32_t);

        for (int i = 1; i < samples_read; i += 2)
        {
            p_dest[(i - 1) / 2] = (int16_t)(buf[i] >> 16);
        }

        p_samples_count = samples_read / 2;

        // Serial.write((uint8_t *)p_dest, sizeof(int16_t) * (samples_read / 2));

        return true;
    }
}

void AudioRecorder::init()
{
    i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
    i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
}

void AudioRecorder::start()
{
}

void AudioRecorder::stop()
{
    enable_recording = false;
}

// Size is sample rate in bytes
AudioRecorder::AudioRecorder() : buffer(SAMPLE_BUFFER_SIZE)
{
}

AudioRecorder *AudioRecorder::instance()
{
    if (singleton_instance == nullptr) singleton_instance = new AudioRecorder;
    return singleton_instance;
}
