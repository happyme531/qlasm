import test from 'ava';

import { MidiPitch } from '../lib/midiPitch.js';

test('fromIndex', (t) => {
    const midiPitch = MidiPitch.fromIndex(60);
    t.is(midiPitch.index, 60);
    t.is(Math.floor(midiPitch.frequency()), 261);
    t.is(midiPitch.name(), 'C4');
});

test('fromFrequency', (t) => {
    const midiPitch = MidiPitch.fromFrequency(440);
    t.is(midiPitch.index, 69);

    const midiPitch2 = MidiPitch.fromFrequency(441, 440, 0.1);
    t.is(midiPitch2.index, 69);
    t.throws(() => {
        MidiPitch.fromFrequency(441, 440, 0.001);
    });
});

test('fromName', (t) => {
    const midiPitch = MidiPitch.fromName('C4');
    t.is(midiPitch.index, 60);

    const midiPitch2 = MidiPitch.fromName('C#4');
    t.is(midiPitch2.index, 61);

    const midiPitch3 = MidiPitch.fromName('A#0');
    t.is(midiPitch3.index, 22);

    t.throws(() => {
        MidiPitch.fromName('Invalid');
    });
});

test('fromSimplifiedNotation', (t) => {
    let p = MidiPitch.fromSimplifiedNotation('C', '1');
    t.is(p.index, 60);
    p = MidiPitch.fromSimplifiedNotation('C', '2');
    t.is(p.index, 62);
    p = MidiPitch.fromSimplifiedNotation('C#', '2');
    t.is(p.index, 63);
    p = MidiPitch.fromSimplifiedNotation('C', '3`');
    t.is(p.index, 76);
    p = MidiPitch.fromSimplifiedNotation('C', '3,');
    t.is(p.index, 52);
});

test('toString', (t) => {
    const midiPitch = new MidiPitch(60);
    t.is(midiPitch.toString(), 'C4');
});