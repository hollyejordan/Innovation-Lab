#pragma once

#include <Arduino.h>

// A circular queue class
template <typename T>
class Queue
{
    T *elements;
    size_t front{0}, back{0}, size{0};

  public:
    Queue(size_t p_pool_size);
    ~Queue();
    bool pop(T &p_out);
    bool push(T &p_in);
    bool peek(T &p_out);
    bool is_empty();
};

// A circular queue class
template <typename T>
inline Queue<T>::Queue(size_t p_pool_size) : size(p_pool_size), elements(new T[p_pool_size])
{
}

template <typename T>
inline Queue<T>::~Queue()
{
    delete[] elements;
}
// Removes the front element of the queue and updates p_out. Returns true if an element existed, otherwise false.
template <typename T>
inline bool Queue<T>::pop(T &p_out)
{
    // Empty
    if (is_empty()) return false;
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
inline bool Queue<T>::push(T &p_in)
{
    // Full
    if ((back + 1) % size == front) return false;

    // Set element
    elements[back] = p_in;

    // Update back pos
    if (back == size - 1) back = 0;
    else back++;

    return true;
}

// Check if the queue is empty
template <typename T>
inline bool Queue<T>::is_empty()
{
    return front == back;
}

// Peeks at the front of the queue
template <typename T>
inline bool Queue<T>::peek(T &p_out)
{
    // Empty
    if (is_empty()) return false;
    else
    {
        // Found
        p_out = elements[front];
        return true;
    }
}