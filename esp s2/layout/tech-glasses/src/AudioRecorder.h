#pragma once

// Placeholder
typedef int Buffer;
typedef int RotatingBuffer;

// Normally I would use functional but I believe it wont exist in ESP
typedef void (*BufferCallback)(const Buffer*);



class AudioRecorder
{
	// We have to use a rotating buffer
	// The one I used for the MVP added a new buffer automatically if none were available,
	// this is more memory efficient, but a little more resource intensive (tiny bit).
	// Im not sure what we should do for esp
	RotatingBuffer buffer;


public:
	// Event called whenever the current audio buffer is full
	void on_buffer_full(BufferCallback* p_buf);


	// Setup. set config, ect
	void init();


	// Toggle recording
	void start();
	void stop();
};