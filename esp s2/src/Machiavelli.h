#pragma once

// A circular queue class
template <typename T>
class Machiavelli
{
    T *elements;
    size_t front{0}, back{0}, size{0};

  public:
    Machiavelli(size_t p_pool_size);
    ~Machiavelli();
    bool pop(T &p_out);
    bool push(T &p_in);
};

// A circular queue class
template <typename T>
inline Machiavelli<T>::Machiavelli(size_t p_pool_size) : size(p_pool_size), elements(new T[p_pool_size])
{
}

template <typename T>
inline Machiavelli<T>::~Machiavelli()
{
    delete[] elements;
}
// Removes the front element of the queue and updates p_out. Returns true if an element existed, otherwise false.
template <typename T>
inline bool Machiavelli<T>::pop(T &p_out)
{
    // Empty
    if (front == back) return false;
    else
    {
        // Found
        p_out = elements[front];

        // Update front pos
        if (front == size - 1) front = 0;
        else front++;
        return true;
    }
}

// Inserts a new element into the array, returns true if successful, false otherwise
template <typename T>
inline bool Machiavelli<T>::push(T &p_in)
{
    // Full
    if ((back + 1) % size == front) return false;

    // Set element
    elements[back] = p_in;

    // Update back pos
    if (back == size - 1) back = 0;
    else back++;
}
