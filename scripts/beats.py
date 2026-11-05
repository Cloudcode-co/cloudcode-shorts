# /// script
# requires-python = ">=3.10,<3.14"
# dependencies = ["librosa>=0.10", "soundfile>=0.12"]
# ///
"""Beat map of an audio file for video editing.

Usage: uv run beats.py <audio> [--fps 30] [--meter 4] [--out beats.json]

Prints JSON: bpm, duration_s, fps, beats / downbeats / onsets (seconds + frames),
per-beat energy (0..1), and energy sections with likely drops.
"""
import argparse
import json
import sys
import warnings

warnings.filterwarnings("ignore")

import librosa
import numpy as np


def r(x):
    return round(float(x), 3)


def analyze(path, fps, meter):
    y, sr = librosa.load(path, sr=22050, mono=True)
    duration = librosa.get_duration(y=y, sr=sr)
    hop = 512

    # Percussive part only, so pads and vocals do not smear the onset curve; keep quiet intros (trim=False).
    y_perc = librosa.effects.percussive(y)
    onset_env = librosa.onset.onset_strength(y=y_perc, sr=sr, hop_length=hop, aggregate=np.median)
    tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, hop_length=hop, trim=False)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)
    # librosa's tempo is quantized to its tempogram bins; the tracked beat spacing is exact.
    bpm = 60 / float(np.polyfit(np.arange(len(beat_times)), beat_times, 1)[0]) if len(beat_times) > 1 else float(np.atleast_1d(tempo)[0])

    # Energy per beat interval, normalized.
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    edges = np.concatenate([beat_frames, [len(rms)]])
    beat_energy = np.array([rms[a:b].mean() if b > a else 0 for a, b in zip(edges[:-1], edges[1:])])
    if beat_energy.size:
        beat_energy = beat_energy / (beat_energy.max() or 1)

    # Downbeats: the beat phase (0..meter-1) whose beats carry the most low-end energy + onset strength.
    # Near-ties (kick on 1 and 3) go to the phase holding the biggest energy jump: drops land on the one.
    downbeats, phase = [], 0
    if len(beat_frames) >= meter:
        S = np.abs(librosa.stft(y, hop_length=hop))
        freqs = librosa.fft_frequencies(sr=sr)
        bass = S[freqs < 150].sum(axis=0)
        score = bass[np.minimum(beat_frames, len(bass) - 1)] / (bass.max() or 1) + onset_env[beat_frames] / (onset_env.max() or 1)
        means = np.array([score[p::meter].mean() for p in range(meter)])
        tied = [p for p in range(meter) if means[p] >= means.max() * 0.9]
        phase = tied[0]
        if len(tied) > 1:
            jumps = np.diff(beat_energy, prepend=beat_energy[0])
            phase = max(tied, key=lambda p: jumps[p::meter].max())
        downbeats = beat_times[phase::meter]

    onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, hop_length=hop, backtrack=True)
    onset_times = librosa.frames_to_time(onset_frames, sr=sr, hop_length=hop)

    # Sections: bars (from the downbeat phase; a pickup bar before it) grouped where bar energy changes
    # level; a jump >= 0.25 is a likely drop.
    sections = []
    if beat_energy.size >= meter:
        starts = sorted({0, *range(phase, len(beat_energy), meter)})
        bars = [beat_energy[a:b].mean() for a, b in zip(starts, starts[1:] + [len(beat_energy)])]
        bar_times = beat_times[starts]
        start, level = 0, bars[0]
        for i in range(1, len(bars)):
            if abs(bars[i] - level) >= 0.2:
                sections.append({"start_s": r(bar_times[start]), "end_s": r(bar_times[i]), "energy": r(level)})
                start, level = i, bars[i]
            else:
                level = (level * (i - start) + bars[i]) / (i - start + 1)
        sections.append({"start_s": r(bar_times[start]), "end_s": r(duration), "energy": r(level)})
        for a, b in zip(sections, sections[1:]):
            b["drop"] = b["energy"] - a["energy"] >= 0.25

    to_frames = lambda ts: [int(round(t * fps)) for t in ts]
    return {
        "file": path,
        "bpm": round(bpm, 2),
        "beat_interval_s": r(60 / bpm) if bpm else None,
        "duration_s": r(duration),
        "fps": fps,
        "meter": meter,
        "beats_s": [r(t) for t in beat_times],
        "beats_frame": to_frames(beat_times),
        "downbeats_s": [r(t) for t in downbeats],
        "downbeats_frame": to_frames(downbeats),
        "onsets_s": [r(t) for t in onset_times],
        "onsets_frame": to_frames(onset_times),
        "beat_energy": [r(e) for e in beat_energy],
        "sections": sections,
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("audio")
    p.add_argument("--fps", type=float, default=30)
    p.add_argument("--meter", type=int, default=4)
    p.add_argument("--out")
    a = p.parse_args()
    try:
        result = analyze(a.audio, a.fps, a.meter)
    except Exception as e:  # unreadable codec, missing file
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
    text = json.dumps(result, indent=1)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(text)
        print(f"wrote {a.out}: {result['bpm']} BPM, {len(result['beats_s'])} beats, {len(result['sections'])} sections")
    else:
        print(text)
