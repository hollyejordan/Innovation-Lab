#include "AudioRecorder.h"

void AudioRecorder::on_buffer_full(BufferCallback *p_buf)
{

    // TODO
}

void AudioRecorder::record_buffer(void *_)
{
    RotatingBuffer &rb = AudioRecorder::instance()->buffer;
    Buffer *buf = rb.get_buffer();
    buf->free = false;
    i2s_read(i2s_num, buf, rb.get_buffer_size(), (size_t *)(&buf->size), portMAX_DELAY);

    // Do something with buffer
}

void AudioRecorder::init()
{
    // Bunch of random stuff idfk
    pinMode(22, INPUT);
    i2s_driver_install(i2s_num, &i2s_config, 0, NULL);
    REG_SET_BIT(I2S_TIMING_REG(i2s_num), BIT(9));
    REG_SET_BIT(I2S_CONF_REG(i2s_num), I2S_RX_MSB_SHIFT);
    i2s_set_pin(i2s_num, &pin_config);

    xTaskCreate(AudioRecorder::record_buffer, "Recording Task", 1000, NULL, 1, NULL);
}

void AudioRecorder::start()
{
    enable_recording = true;
}

void AudioRecorder::stop()
{
    enable_recording = false;
}

AudioRecorder::AudioRecorder() : buffer(256)
{
    init();
}

AudioRecorder *AudioRecorder::instance()
{
    if (singleton_instance == nullptr) singleton_instance = new AudioRecorder;
    return singleton_instance;
}
