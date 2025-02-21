#pragma once

// Placeholder
typedef int JSONObject;


struct WSMessage
{
	int type;
};

// Example msg
struct WSM_Transcription : public WSMessage
{
	// Text

};



// Builds the message from json
// Returns nullptr if failed
const WSMessage* construct_message(const JSONObject& p_json);