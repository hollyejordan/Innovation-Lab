#pragma once
#pragma comment(lib, "winmm.lib")
#include <windows.h>
#include <mmsystem.h>
#include <iostream>
#include <vector>
#include <functional>
#include <deque>

// IK this never changes but I dont like 8 alone
#define BITS_PER_BYTE 8

// The point at which to warn
#define BUFFER_WARNING_THRESHOLD 20

class Buffer
{
	WAVEHDR header{};

	// Buffer & size
	char* buffer{};
	size_t size;

	// Manually locked
	bool locked{};

	// If this buffer has be unprepared
	bool deletable;

public:

	Buffer(size_t p_size);

	~Buffer();

	WAVEHDR* get_header();
	char* get_buffer();

	// Will not be reused for recording until it is no longer locked
	void set_locked(bool p_locked);

	bool is_locked();

	// If this is in use or locked
	bool available();

	// This should be called before use and reuse
	bool prepare(HWAVEIN p_device);

	// Same as the prepare function but revrse I assume, no clue why
	// Must be called before deletion
	bool cleanup(HWAVEIN p_device);
};




class BufferedRecorder
{
	WAVEFORMATEX audio_format{};
	HWAVEIN audio_device{};

	const size_t buffer_size{};
	const int samples_per_sec{}, bytes_per_sample{};

	// Buffer cycler, may be unnecessary
	std::deque<Buffer*> buffers;

	// If no errors occured during init
	bool ready{};

	// Event once buffer is full
	std::function<void(Buffer*)> event_buffer_full{};

	// Callbacks for this must be static / not member functions
	// including this in the class allows me to access private members within
	static void CALLBACK audio_in_static(HWAVEIN p_device, UINT p_msg, DWORD_PTR p_class_ptr);

	// For use with the static callback
	void wave_open_callback();
	void wave_close_callback();
	void buffer_full_callback();

	// Internal funcs
	bool open_audio_device();

	// Adds a buffer to wave for recording
	void add_buffer_to_wave(Buffer* p_buffer);

	// Adds a new buffer to the front of the queue
	void allocate_new_buffer_front();

public:

	BufferedRecorder(int p_callback_interval_ms, int p_samples_per_sec, int p_bytes_per_sample);
	~BufferedRecorder();

	void on_buffer_full(std::function<void(Buffer*)> p_handler);

	bool is_ready();
	int get_buffer_size();

	// Needs to be called before this can begin
	bool init();

	// Can be called multiple times, whenever
	void start_recording();
	void stop_recording();
};


