#pragma once
#include "RotatingBuffer.h"
#include "soc/i2s_reg.h"
#include <Arduino.h>
#include <driver/i2s.h>

#define SAMPLE_RATE 22050
#define BITS_PER_SAMPLE I2S_BITS_PER_SAMPLE_32BIT
#define BUFFER_SIZE 256

// Normally I would use functional but I believe it wont exist in ESP
typedef void (*BufferCallback)(Buffer *);

// SUPER UGLY
static const i2s_port_t i2s_num = I2S_NUM_0; // i2s port number
static const i2s_config_t i2s_config = {.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
                                        .sample_rate = SAMPLE_RATE,
                                        .bits_per_sample = BITS_PER_SAMPLE,
                                        .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
                                        .communication_format =
                                            (i2s_comm_format_t)(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
                                        .intr_alloc_flags = 0, // default interrupt priority
                                        .dma_buf_count = 8,
                                        .dma_buf_len = 64,
                                        .use_apll = false};

static const i2s_pin_config_t pin_config = {
    .bck_io_num = 14, // BCKL
    .ws_io_num = 15,  // LRCL
    .data_in_num = 32 // DOUT
};

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

    static void record_buffer(void *_);

    // Setup. set config, ect
    void init();

    // Toggle recording
    void start();
    void stop();

    static AudioRecorder *instance();
};