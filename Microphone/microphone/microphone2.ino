#include <driver/i2s.h>

#define SAMPLE_BUFFER_SIZE 512
#define SAMPLE_RATE 8000
// most microphones will probably default to left channel but you may need to tie the L/R pin low
#define I2S_MIC_CHANNEL I2S_CHANNEL_FMT_ONLY_LEFT

#define I2S_MIC_SERIAL_CLOCK GPIO_NUM_32
#define I2S_MIC_LEFT_RIGHT_CLOCK GPIO_NUM_25
#define I2S_MIC_SERIAL_DATA GPIO_NUM_33

i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0};

i2s_pin_config_t i2s_mic_pins = {
    .bck_io_num = 17,       //14 (old num)           // BCKL
    .ws_io_num = 16,        //15 (old num)           // LRCL
    .data_out_num = I2S_PIN_NO_CHANGE,    // not used (only for speakers)
    .data_in_num = 14     //32 (old num)           // DOUT
    }; // DOUT

void setup()
{
  Serial.begin(115200);
  // start up the I2S peripheral
  i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
}

int32_t raw_samples[SAMPLE_BUFFER_SIZE];
void loop()
{
  size_t bytes_read = 0;
  i2s_read(I2S_NUM_0, raw_samples, sizeof(int32_t) * SAMPLE_BUFFER_SIZE, &bytes_read, portMAX_DELAY);
  int samples_read = bytes_read / sizeof(int32_t);

  // Compress 32-bit samples to 16-bit (reduces bandwidth by half)
  for (int i = 1; i < samples_read; i+=2) {
    int16_t compressed = raw_samples[i] >> 16;  // Take most significant 16 bits
    Serial.write((uint8_t*)&compressed, sizeof(int16_t));
  }
}