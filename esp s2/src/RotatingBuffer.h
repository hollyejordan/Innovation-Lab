#include <vector>

struct Buffer
{
    // Data
    char *buffer;

    // Not max size, but number of useful bytes within buffer
    int size;

    // If this buffer can be reused
    bool free;

    // Will init
    Buffer(int p_size);
};

class RotatingBuffer
{
    std::vector<Buffer *> buffers;
    int buffer_size;

    Buffer *buffers_find_first_free();

    Buffer *buffer_create_new();

  public:
    RotatingBuffer(int p_buffer_size);
    Buffer *get_buffer();
    int get_buffer_size();
};