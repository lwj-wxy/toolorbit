## Morse Code and Binary Communication

Invented in the 1830s, Morse code transmitted language with two signal states: short and long pulses, usually written as dots and dashes. That makes it a useful early example of digital communication.

### 1. The Original Binary Compression
Morse code uses variable-length codes, similar in spirit to Huffman coding. Common English letters get short sequences. The letter "E" is a single dot. The letter "T" is a single dash. Less frequent letters such as "Q" (--.-) take longer to transmit. That choice reduced transmission time over telegraph wires.

### 2. Relevance in Modern Hardware Hacking
Maritime distress signals have moved to satellite systems, but Morse-style blinking still appears in embedded devices. When a developer debugs a headless Raspberry Pi or Arduino board that cannot output to a monitor, the onboard LED can blink an error code with no screen, network, or serial console.

### Conclusion
Morse code shows how much information a system can carry with a small signal vocabulary. Sound and silence, or light and dark, can still communicate useful state when richer interfaces fail.
