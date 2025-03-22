import serial
import struct
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import wave
import argparse
import time

def save_to_wav(samples, filename, sample_rate):
    """Save the received samples as a WAV file"""
    with wave.open(filename, 'w') as wav_file:
        # Setup WAV file parameters (mono, 16-bit, 8kHz)
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 2 bytes for 16-bit audio
        wav_file.setframerate(sample_rate)
        
        # Convert 32-bit samples to 16-bit for WAV compatibility
       # samples_16bit = (samples >> 16).astype(np.int16)
        wav_file.writeframes(samples.tobytes())
    
    print(f"Saved {len(samples)} samples to {filename}")

def main():
    parser = argparse.ArgumentParser(description="ESP32 I2S Microphone Data Receiver")
    parser.add_argument("--port", default="COM8", help="Serial port (default: COM3)")
    parser.add_argument("--baud", type=int, default=115200, help="Baud rate (default: 115200)")
    parser.add_argument("--buffer", type=int, default=512, help="Buffer size on ESP32 (default: 512)")
    parser.add_argument("--duration", type=int, default=5, help="Recording duration in seconds (default: 5)")
    parser.add_argument("--plot", action="store_true", help="Show real-time plot")
    parser.add_argument("--save", default="test.wav", help="Save to WAV file")
    args = parser.parse_args()
    
    # Connect to the serial port
    try:
        ser = serial.Serial(args.port, args.baud, timeout=1)
        print(f"Connected to {args.port} at {args.baud} baud")
    except serial.SerialException as e:
        print(f"Error opening serial port: {e}")
        return
    
    # Flush any existing data
    ser.reset_input_buffer()
    
    # Calculate how many samples we expect in total
    sample_rate = 8000
    total_samples = sample_rate * args.duration
    samples = np.zeros(total_samples, dtype=np.int16)
    
    # For real-time plotting
    if args.plot:
        plt.ion()
        fig, ax = plt.subplots()
        line, = ax.plot(np.zeros(1000))
        ax.set_ylim(-2**31, 2**31-1)
        plt.title("ESP32 Microphone Data")
        plt.xlabel("Sample")
        plt.ylabel("Amplitude")
    
    # Start reading data
    print(f"Recording for {args.duration} seconds...")
    start_time = time.time()
    samples_received = 0
    bytes_per_sample = 2
    
    while time.time() - start_time < args.duration:
        # Read one complete buffer at a time
        if ser.in_waiting >= args.buffer * bytes_per_sample:
            data = ser.read(args.buffer * bytes_per_sample)
            
            # Convert bytes to samples
            chunk = np.frombuffer(data, dtype=np.int16)
            chunk_size = len(chunk)
            
            # Store samples
            if samples_received + chunk_size <= total_samples:
                samples[samples_received:samples_received+chunk_size] = chunk
            else:
                # In case we get more samples than expected
                samples[samples_received:total_samples] = chunk[:total_samples-samples_received]
                
            samples_received += chunk_size
            
            # Update the plot every 1000 samples if plotting is enabled
            if args.plot and samples_received % 1000 < chunk_size:
                end_idx = min(samples_received, 1000)
                line.set_ydata(samples[samples_received-end_idx:samples_received])
                line.set_xdata(range(end_idx))
                ax.relim()
                ax.autoscale_view()
                plt.draw()
                plt.pause(0.01)
                
            # Print progress
            elapsed = time.time() - start_time
            if elapsed > 0:
                print(f"\rReceived {samples_received} samples ({samples_received/elapsed:.2f} samples/sec)", end="")
    
    print("\nDone recording!")
    actual_duration = time.time() - start_time
    print(f"Received {samples_received} samples in {actual_duration:.2f} seconds")
    print(f"Effective sample rate: {samples_received/actual_duration:.2f} Hz")
    
    # Trim the array to the actual number of samples received
    samples = samples[:samples_received]
    
    # Save to WAV file if requested
    if args.save:
        sample_rate = samples_received / actual_duration
        save_to_wav(samples, args.save, sample_rate)
    
    # If plotting, switch to a static plot of the full recording
    if args.plot:
        plt.ioff()
        plt.figure(figsize=(10, 6))
        plt.plot(samples)
        plt.title(f"ESP32 Microphone Recording ({samples_received} samples)")
        plt.xlabel("Sample")
        plt.ylabel("Amplitude")
        plt.tight_layout()
        plt.show()
    
    ser.close()

if __name__ == "__main__":
    main()