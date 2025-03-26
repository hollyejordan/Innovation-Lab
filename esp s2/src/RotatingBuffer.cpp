#include "RotatingBuffer.h"

// Initialises, and allocates the buffer
Buffer::Buffer(int p_size) : free(true), size(0), buffer(new int32_t[p_size])
{
}

Buffer::~Buffer()
{
    // Free the buffer
    delete[] buffer;
}

Buffer *RotatingBuffer::buffers_find_first_free()
{
    // Check all buffers for a free one
    for (int i = 0; i < buffers.size(); i++)
    {
        // Found a free one
        if (buffers[i]->free) return buffers[i];
    }
    return nullptr;
}

Buffer *RotatingBuffer::buffer_create_new()
{
    Serial.println("Created buffer");
    Serial.println(this->buffer_size);
    return new Buffer(buffer_size);
}

RotatingBuffer::RotatingBuffer(int p_buffer_size) : buffer_size(p_buffer_size)
{
}

RotatingBuffer::~RotatingBuffer()
{
    // Free all the buffers
    for (auto buf : buffers)
    {
        delete buf;
    }
}

Buffer *RotatingBuffer::get_buffer()
{
    Buffer *buf = buffers_find_first_free();

    // Found a free one
    if (buf != nullptr) return buf;

    // No free buffers, create one and return it
    Buffer *new_buffer = buffer_create_new();
    buffers.push_back(new_buffer);
    return new_buffer;
}

int RotatingBuffer::get_buffer_size()
{
    return buffer_size;
}
