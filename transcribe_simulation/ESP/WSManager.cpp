#include "WSManager.h"

void WSManager::event_connect(WS::connection_hdl p_con)
{
    // Add connection
    connections.insert(p_con);

    log("[" + get_con_ip(p_con) + "] Client connected", LogType::INFO);
}

void WSManager::event_disconnect(WS::connection_hdl p_con)
{
    // Remove connection
    connections.erase(p_con);

    log("[" + get_con_ip(p_con) + "] Client disconnected", LogType::INFO);

    std::string test = "[{\"text\":\"hello\"}]";

    std::string text = test.substr(18, test.length() - 18);
    text = text.substr(0, text.find("\""));

}

void WSManager::event_message(WS::connection_hdl p_con, WS::server<WS::config::asio>::message_ptr p_msg)
{
    log("[<- " + get_con_ip(p_con) + "]: " + p_msg.get()->get_payload(), LogType::INCOMING);

    // Call custom handler
    if (handler_received != nullptr)
    {
        handler_received(p_msg.get()->get_payload());
    }
}

std::string WSManager::get_con_ip(WS::connection_hdl p_con)
{
    return server.get_con_from_hdl(p_con).get()->get_remote_endpoint();
}

void WSManager::log(std::string p_msg, unsigned int p_log_type)
{
    if (log_mode & p_log_type) std::cout << p_msg << '\n';
}

WSManager::WSManager(unsigned int p_log_bitfield)
    :log_mode(p_log_bitfield)
{
    // IDFK does stuff to start the sever
    server.init_asio();

    // Register the event functions
    server.set_message_handler([this](WS::connection_hdl p_con, WS::server<WS::config::asio>::message_ptr p_msg)
        {
            // Forward to my function
            event_message(p_con, p_msg);
        });

    server.set_open_handler([this](WS::connection_hdl p_con)
        {
            // Forward to my function
            event_connect(p_con);
        });

    server.set_close_handler([this](WS::connection_hdl p_con)
        {
            // Forward to my function
            event_disconnect(p_con);
        });

    // It kept logging random stuff to console, this stops it
    server.clear_access_channels(WS::log::alevel::frame_header | WS::log::alevel::frame_payload);
}

void WSManager::start()
{
    //server.set_reuse_addr(true);
    server.listen(PORT);

    // IDFK
    server.start_accept();

    // Run the server on a seperate thread. Detached so it can continue once this object is deleted
    // Also using a lambda to wrap the method, as this constructor accepts a function (not method)
    std::thread([this]() { server.run(); }).detach();

    log("Server hosted on ws://localhost:" + PORT, LogType::INFO);
}

void WSManager::stop()
{
    server.stop();
}

void WSManager::send_all(char* p_buffer, uint32_t p_size)
{
    // Send msg to all connections
    for (auto c : connections)
    {
        log("[" + get_con_ip(c) + " <-]: " + std::to_string(p_size) + "bytes", LogType::OUTGOING);
        server.send(c, p_buffer, p_size, websocketpp::frame::opcode::binary);
    }
}

void WSManager::on_message_received(std::function<void(std::string)> p_handler)
{
    handler_received = p_handler;
}

bool ConnectionCompareOperator::operator()(const WS::connection_hdl& a, const WS::connection_hdl& b) const
{
    // Compare the full ptr
    return a.owner_before(b);
}
