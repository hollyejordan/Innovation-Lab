#include "BufferedRecorder.h"

Buffer::Buffer(size_t p_size) : size(p_size), deletable(true)
{
	buffer = new char[size];
	header.lpData = buffer;
	header.dwBufferLength = size;
}

Buffer::~Buffer()
{
	// Deallocate
	delete[] buffer;

	// To double check this never happens
	if (!deletable) std::cerr << "Buffer deleted improperly\n";
}

WAVEHDR* Buffer::get_header()
{
	return &header;
}

char* Buffer::get_buffer()
{
	return buffer;
}

bool Buffer::prepare(HWAVEIN p_device)
{
	if (waveInPrepareHeader(p_device, &header, sizeof(WAVEHDR)) != MMSYSERR_NOERROR)
	{
		return false;
	}
	// Not deletable if it is prepared
	else
	{
		deletable = false;
		return true;
	}
}

bool Buffer::cleanup(HWAVEIN p_device)
{
	if (waveInUnprepareHeader(p_device, &header, sizeof(WAVEHDR)) != MMSYSERR_NOERROR)
	{
		deletable = false;
		return false;
	}

	// Once its been unprepared it can be deleted safely
	else
	{
		deletable = true;
		return true;
	}
}

void CALLBACK BufferedRecorder::audio_in_static(HWAVEIN p_device, UINT p_msg, DWORD_PTR p_class_ptr)
{
	// If no class is supplied
	if (p_class_ptr == NULL) return;

	switch (p_msg)
	{
	case WIM_OPEN:
		((BufferedRecorder*)p_class_ptr)->wave_open_callback();
		break;
	case WIM_CLOSE:
		((BufferedRecorder*)p_class_ptr)->wave_close_callback();
		break;
	case WIM_DATA:
		// Buffer full
		((BufferedRecorder*)p_class_ptr)->buffer_full_callback();
		break;
	}
}

void BufferedRecorder::wave_open_callback()
{
	std::cout << "Wave open\n";
}

void BufferedRecorder::wave_close_callback()
{
	std::cout << "Wave closed\n";
}

void BufferedRecorder::buffer_full_callback()
{
	// This function can pass the wave header, however as I have wrapped this,
	// and i dont want to have to map headers to buffers, nor rewrite stuff, I will just use the queue

	// Buffer at front of queue is the one full
	Buffer* full_buffer = buffers.front();
	buffers.pop_front();

	// Lock the buffer, so it does not get used until the event is done with it
	full_buffer->set_locked(true);

	// If there is a event, call it with the buffer
	if (event_buffer_full != nullptr) event_buffer_full(full_buffer);

	// If queue is empty or first is in use, create a new buffer to use, this should only happen a few times
	// flags is bitfield
	if (buffers.empty() || !buffers.front()->available())
	{
		allocate_new_buffer_front();
	}

	// Add old buffer to back of queue after preparing it
	full_buffer->prepare(audio_device);
	buffers.push_back(full_buffer);

	// Send next buffer in
	add_buffer_to_wave(buffers.front());
}

bool BufferedRecorder::open_audio_device()
{
	// Opens the device handle I believe, required to record audio
	return waveInOpen(&audio_device, WAVE_MAPPER, &audio_format, (DWORD_PTR)audio_in_static, (DWORD_PTR)this, CALLBACK_FUNCTION) == MMSYSERR_NOERROR;
}

void BufferedRecorder::add_buffer_to_wave(Buffer* p_buffer)
{
	waveInAddBuffer(audio_device, (LPWAVEHDR)(p_buffer->get_header()), sizeof(WAVEHDR));
}

BufferedRecorder::BufferedRecorder(int p_callback_interval_ms, int p_samples_per_sec, int p_bytes_per_sample)
	:
	ready(false),
	samples_per_sec(p_samples_per_sec),
	bytes_per_sample(p_bytes_per_sample),
	buffer_size((p_samples_per_sec* p_bytes_per_sample* p_callback_interval_ms) / 1000)
{
}

BufferedRecorder::~BufferedRecorder()
{
	// Free buffers
	while (!buffers.empty())
	{
		buffers.front()->cleanup(audio_device);
		delete buffers.front();
		buffers.pop_front();
	}
}

// This function must unlock the buffer once done
void BufferedRecorder::on_buffer_full(std::function<void(Buffer*)> p_handler)
{
	event_buffer_full = p_handler;
}

bool BufferedRecorder::is_ready()
{
	return ready;
}

int BufferedRecorder::get_buffer_size()
{
	return buffer_size;
}

void BufferedRecorder::allocate_new_buffer_front()
{
	Buffer* buffer = new Buffer(buffer_size);
	buffer->prepare(audio_device);
	buffers.push_front(buffer);

	if (buffers.size() > BUFFER_WARNING_THRESHOLD)
	{
		std::cerr << "Buffer count exceeded warning threshold (" << buffers.size() << ")\n";
	}
}

bool BufferedRecorder::init()
{
	// Just gotta set data about how the data will be set
	// Im pretty sure PCM is what we will be using in the ESP
	audio_format.wFormatTag = WAVE_FORMAT_PCM;
	// Mono audio, dont need left/right
	audio_format.nChannels = 1;
	audio_format.nSamplesPerSec = samples_per_sec;
	audio_format.nAvgBytesPerSec = samples_per_sec * bytes_per_sample;
	audio_format.nBlockAlign = bytes_per_sample;
	audio_format.wBitsPerSample = bytes_per_sample * BITS_PER_BYTE;

	// Open device
	if (!open_audio_device())
	{
		std::cerr << "Failed to open audio device\n";
		ready = false;
		return false;
	}

	// Allocate first buf
	allocate_new_buffer_front();
	add_buffer_to_wave(buffers.front());

	ready = true;
	return true;
}

void BufferedRecorder::start_recording()
{
	if (!ready)
	{
		std::cerr << "Cannot begin recording, initialised\n";
		return;
	}

	waveInStart(audio_device);
}

void BufferedRecorder::stop_recording()
{
	waveInStop(audio_device);
}

bool Buffer::available()
{
	return !locked && !(header.dwFlags & WHDR_INQUEUE);
}

void Buffer::set_locked(bool p_locked)
{
	locked = p_locked;
}

bool Buffer::is_locked()
{
	return locked;
}
