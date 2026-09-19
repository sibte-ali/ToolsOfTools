---
title: "Tone Generator - Online Audio Frequency Sound Generator"
description: "Generate pure audio tones from 20 Hz to 20,000 Hz with Web Audio API. Features sine, square, sawtooth, and triangle waves with hearing safety protection."
h1: "Online Tone Generator - Pure Frequency Audio Synthesizer"
intro: "Synthesize pure audio frequencies from 20 Hz to 20,000 Hz in your browser using the Web Audio API. Test speakers, tune instruments, and explore acoustic waveforms."
primaryKeyword: "tone generator"
formula: "f = Frequency in Hz; λ = c / f (where speed of sound c ≈ 343 m/s at 20°C)"
example: "At 440 Hz (Concert Pitch A4), the tone completes 440 oscillations per second with an acoustic wavelength of 0.7805 meters in room air."
faq:
  - q: "How do I start hearing sound from the tone generator?"
    a: "Modern web browsers require an intentional user click before initializing the Web Audio API AudioContext. Simply click 'Start Tone' or adjust the frequency slider to begin audio playback."
  - q: "What frequency range can the human ear detect?"
    a: "A healthy young human ear typically detects audio frequencies from approximately 20 Hz (deep sub-bass) up to 20,000 Hz (extreme high-frequency treble). High-frequency hearing naturally declines with age."
  - q: "Why is there a volume safety limit on this tool?"
    a: "Pure sinusoidal tones and high-frequency waves can cause permanent hearing fatigue or damage if played at excessive volumes through headphones. For safety, the default volume is kept modest and capped."
  - q: "What is the difference between sine, square, sawtooth, and triangle waves?"
    a: "A sine wave contains only the fundamental pure frequency with zero harmonics. A square wave includes odd harmonics creating a hollow, buzzy electronic sound. A sawtooth wave includes both even and odd harmonics for a bright, brassy timbre. A triangle wave produces soft, muted odd harmonics."
sources:
  - label: "W3C Web Audio API Recommendation Specification"
    url: "https://www.w3.org/TR/webaudio/"
  - label: "Acoustical Society of America - Hearing Conservation & Audio Safety"
    url: "https://acousticalsociety.org"
updated: "2026-03-19"
related:
  - "speed-calculator"
  - "mb-to-kb-converter"
  - "standard-deviation-calculator"
  - "combination-calculator"
disclaimer: "entertainment"
---

## What is a Tone Generator?

An online **tone generator** is an acoustic synthesizer that produces pure periodic electronic waveforms at designated frequencies. Powered by the modern **Web Audio API**, this tool creates real-time sound directly within your web browser using hardware-accelerated oscillators without downloading heavy audio files or streaming external media.

Whether you are tuning an acoustic guitar, calibrating studio monitors, testing subwoofer low-end extension, experimenting with room resonance modes, or checking your personal hearing range, our tone generator gives you precision control across the entire audible audio spectrum from **20 Hz to 20,000 Hz**.

### Hearing Safety Notice and Volume Guidelines

> [!WARNING]
> **Hearing Safety Notice:** Pure continuous test tones can cause rapid auditory fatigue or permanent hearing damage if played at high sound pressure levels (SPL), especially when listening through in-ear monitors or circumaural headphones. 
> 
> - Always begin with your system volume set to a low, comfortable level before pressing Play.
> - High frequencies (above 10,000 Hz) may sound quiet to older listeners while exerting substantial acoustic power. Never raise the volume excessively to hear ultra-high pitches.
> - Avoid listening to continuous test tones for prolonged periods.

### Waveform Characteristics and Harmonic Content

Our synthesizer supports the four fundamental geometric waveforms of analog synthesis:

1. **Sine Wave:** The purest possible acoustic vibration consisting exclusively of a single fundamental frequency without overtones. Ideal for acoustic calibration, pure pitch reference, and sub-bass testing.
2. **Square Wave:** Contains the fundamental frequency plus all odd integer harmonics ($3f, 5f, 7f, \dots$) decreasing at a rate of $1/n$. It produces a distinctive hollow, reedy, retro 8-bit sound.
3. **Sawtooth Wave:** Contains all integer harmonics (both even and odd: $2f, 3f, 4f, \dots$). It possesses the richest, brightest, and most cutting timbre, making it a favorite for synthesizer lead sounds.
4. **Triangle Wave:** Composed solely of odd harmonics like the square wave, but whose amplitudes drop off much faster ($1/n^2$). This results in a mellow, flute-like tone.

### Popular Frequency Presets

- **440 Hz (A4 Concert Pitch):** The international tuning standard for symphony orchestras and modern musical instruments established by the International Organization for Standardization (ISO 16).
- **261.63 Hz (Middle C / C4):** The central musical reference pitch on a standard 88-key piano keyboard.
- **1,000 Hz (1 kHz Reference Tone):** The universal broadcast calibration tone used by recording engineers to set baseline signal levels and check audio chain gain staging.
- **432 Hz (Verdi Pitch):** An alternative tuning pitch mathematically related to whole-number ratios favored by certain classical composers and sound therapy traditions.
- **100 Hz (Subwoofer Test):** A deep bass frequency useful for testing home theater low-frequency effects (LFE) and diagnosing room rattles.
