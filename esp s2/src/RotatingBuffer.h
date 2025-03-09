#include <vector>

struct Buffer
{
    // Data
    char *buffer;

    // Not max size, but number of useful bytes within buffer
    uint32_t size;

    // If this buffer can be reused
    bool free;

    // Will init
    Buffer(int p_size);
    // Frees memory of buffer*
    ~Buffer();
};

class RotatingBuffer
{
    // Stores all buffers created
    std::vector<Buffer *> buffers;

    // This buffer always creates buffers of a constant size once initialised
    int buffer_size;

    // Finds the first buffer with the free flag set to true, nullptr if one is not found
    Buffer *buffers_find_first_free();

    // Creates a new buffer and returns it, does not add it to buffers array
    // If memory is not handled this will lead to a leak
    // Adding it to the buffers array will automatically clean it up when this object is deleted
    Buffer *buffer_create_new();

  public:
    RotatingBuffer(int p_buffer_size);

    // Frees all the memory of buffers inside the array
    ~RotatingBuffer();

    // Returns a free buffer, may be reused
    Buffer *get_buffer();

    // Gets the max size of buffers
    int get_buffer_size();
};