#pragma once
#include "RotatingBuffer.h"
#include "soc/i2s_reg.h"
#include <Arduino.h>
#include <driver/i2s.h>
#define SAMPLE_BUFFER_SIZE 512
#define SAMPLE_RATE 8000

// #define SAMPLE_RATE 22050
// #define BITS_PER_SAMPLE I2S_BITS_PER_SAMPLE_32BIT
// #define BUFFER_SIZE 256

// Normally I would use functional but I believe it wont exist in ESP
typedef void (*BufferCallback)(Buffer *);

// SUPER UGLY
static i2s_config_t i2s_config = {.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
                                  .sample_rate = SAMPLE_RATE,
                                  .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
                                  .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT,
                                  .communication_format = I2S_COMM_FORMAT_STAND_I2S,
                                  .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
                                  .dma_buf_count = 4,
                                  .dma_buf_len = 1024,
                                  .use_apll = false,
                                  .tx_desc_auto_clear = false,
                                  .fixed_mclk = 0};

static i2s_pin_config_t i2s_mic_pins = {
    .bck_io_num = 17,                  // 14 (old num)           // BCKL
    .ws_io_num = 16,                   // 15 (old num)           // LRCL
    .data_out_num = I2S_PIN_NO_CHANGE, // not used (only for speakers)
    .data_in_num = 14                  // 32 (old num)           // DOUT
}; // DOUT

class AudioRecorder
{
    // We have to use a rotating buffer
    RotatingBuffer buffer;

    // If recording is enabled
    bool enable_recording;

    // Only one insance, im not sure what would happen if I was to
    // call i2s_read too often.
  public:
    static AudioRecorder *singleton_instance;

  private:
    BufferCallback callback{};

  public:
    AudioRecorder();

    // Event called whenever the current audio buffer is full
    void on_buffer_full(BufferCallback p_buf);

    bool record_buffer(int16_t *p_dest, size_t &p_samples_count);

    // Setup. set config, ect
    void init();

    // Toggle recording
    void start();
    void stop();

    static AudioRecorder *instance();
};