#include <iostream>
#include <set>
#include <thread>
#include <chrono>
#include <string>
#include <functional>
#include <boost/bind/bind.hpp>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <windows.h>
#include <fstream>
#pragma comment(lib, "winmm.lib")

#define PORT 9002

namespace WS = websocketpp;

// Need this to store cons in a set, as they do not have a compare operator already
struct ConnectionCompareOperator
{
	bool operator()(const WS::connection_hdl& a, const WS::connection_hdl& b) const;
};

enum LogType
{
	NONE = 0,
	INFO = 1,
	ERRORS = 2,
	OUTGOING = 4,
	INCOMING = 8
};

class WSManager
{
	// wspp server. Using async in/out
	WS::server<WS::config::asio> server{};

	// Active connections
	std::set<WS::connection_hdl, ConnectionCompareOperator> connections{};

	// Log
	unsigned int log_mode{};

	// Handlers
	std::function<void(std::string)> handler_received{};

	// Events

	// Client connects
	void event_connect(WS::connection_hdl p_hdl);

	// Client disconnects
	void event_disconnect(WS::connection_hdl p_hdl);

	// Client message received
	void event_message(WS::connection_hdl p_hdl, WS::server<WS::config::asio>::message_ptr p_msg);

	// Gets readble ip from connection
	std::string get_con_ip(WS::connection_hdl p_hdl);

	// Logs based on type
	void log(std::string p_msg, unsigned int p_log_type);

public:

	WSManager(unsigned int p_log_bitfield);

	void start();
	void stop();

	// Sends message to all clients
	void send_all(char* p_buffer, uint32_t p_size);

	// For now, it doesnt matter where the message is from
	void on_message_received(std::function<void(std::string)> p_handler);

};

