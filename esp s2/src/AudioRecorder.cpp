#include "AudioRecorder.h"

#define RECORD_INTERVAL 500 / portTICK_PERIOD_MS

AudioRecorder *AudioRecorder::singleton_instance;

void AudioRecorder::on_buffer_full(BufferCallback p_buf)
{
    callback = p_buf;
}

void AudioRecorder::record_buffer(void *p_recorder)
{
    // Param passed must be cast to the correct type
    AudioRecorder *recorder = (reinterpret_cast<AudioRecorder *>(p_recorder));
    while (true)
    {
        // Only record if it is enabled, and a callback is set.
        // No reason to record without a callback
        if (recorder->enable_recording && recorder->callback != nullptr)
        {
            // Get a buffer
            Buffer *buf = recorder->buffer.get_buffer();

            // Read into it
            i2s_read(i2s_num, buf->buffer, recorder->buffer.get_buffer_size(), &(buf->size), portMAX_DELAY);

            // Buffer is no longer free
            buf->free = false;

            // If a callback is set, call it
            if (recorder->callback != nullptr)
            {
                recorder->callback(buf);

                // Free the buffer once callback has completed
                buf->free = true;
            }
        }

        // We need to figure out the best time for this
        vTaskDelay(RECORD_INTERVAL);
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

    // Begin the recording task

    // Im not sure how large the stack this needs is
    // I use 16 bytes for pointers, not really sure what i2s uses, and I dont know how much each function call uses
    // I am significantly over allocating to be safe

    int stack_allocation = 2048;
    xTaskCreate(AudioRecorder::record_buffer, "Recording Task", stack_allocation, this, 1, NULL);
}

void AudioRecorder::start()
{
    enable_recording = true;
}

void AudioRecorder::stop()
{
    enable_recording = false;
}

AudioRecorder::AudioRecorder() : buffer(BUFFER_SIZE)
{
    init();
}

AudioRecorder *AudioRecorder::instance()
{
    if (singleton_instance == nullptr) singleton_instance = new AudioRecorder;
    return singleton_instance;
}
