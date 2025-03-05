#include "WSManager.h"
#include <BufferedRecorder.h>
#include "json.hpp"

#define BUFFER_SIZE_IN_MS 200
#define SAMPLES_PER_SEC 44100
#define BYTES_PER_SAMPLE 2

using JSON = nlohmann::json;

int main()
{
	WSManager websocket(LogType::INFO);
	BufferedRecorder recorder(BUFFER_SIZE_IN_MS, SAMPLES_PER_SEC, BYTES_PER_SAMPLE);

	/////////////////
	/// RECORDING ///
	/////////////////

	// Start recording
	recorder.init();
	recorder.start_recording();

	// Whenever an audio buffer is full, send it to any connected devices
	// every ~200ms as defined by BUFFER_SIZE_IN_MS
	recorder.on_buffer_full([&](Buffer* buf)
		{
			websocket.send_all(buf->get_buffer(), recorder.get_buffer_size());

			buf->set_locked(false);
		});

	/////////////////
	/// WEBSOCKET ///
	/////////////////

	// Start the websocket server
	websocket.start();
	
	// When text is received, print it
	websocket.on_message_received([](std::string p_msg)
		{
			// Parse the response
			JSON parsed = JSON::parse(p_msg);

			// If this is a diarized response
			if (parsed["type"].get<int>() != 2)
			{
				std::cout << "Received unknown response\n";
				return;
			}

			// If type is 2, text and diarized do exist
			JSON diarized = parsed["diarized"];

			// Send each sentence
			for (auto& text : diarized)
			{
				// Clean format
				std::cout << "[User " << text["speaker"].get<int>() << "]: " << text["text"].get<std::string>() << '\n';
			}
		});


	// Stop the program when user presses key
	std::cin.get();

	// Stop the socket gracefully (i hope)
	websocket.stop();
}