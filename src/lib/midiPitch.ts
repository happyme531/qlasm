
const midiNoteNames = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const simplifiedNotationToPitchOffset = [
    0, 2, 4, 5, 7, 9, 11
];

/**
 * 无效的MIDI音高.
 */
export class InvalidMidiPitchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidMidiPitchError';
    }
}
/**
 * 找不到频率对应的MIDI音高. 也许需要增加允许误差/epsilon.
 */
export class NoSuchMidiPitchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoSuchMidiPitchError';
    }
}

// Midi中定义的音高.
export class MidiPitch {
    public index: number;

    constructor(index: number) {
        if (index < 0 || index > 127) {
            throw new InvalidMidiPitchError(`MIDI音高的index必须在0到127之间, 当前值为${index}.`);
        }
        this.index = index;
    }

    public static fromIndex(index: number): MidiPitch {
        return new MidiPitch(index);
    }

    public static fromFrequency(frequency: number, baseFrequency: number = 440, epsilon: number = 0.001): MidiPitch {
        const index = Math.round(12 * Math.log2(frequency / baseFrequency) + 69);
        const frequency2 = MidiPitch.fromIndex(index).frequency(baseFrequency);
        if (Math.abs(frequency - frequency2) / frequency > epsilon) {
            throw new NoSuchMidiPitchError(`频率${frequency}Hz在基频${baseFrequency}Hz下不是一个有效的MIDI音高.`);
        }
        return new MidiPitch(index);
    }

    public static fromName(name: string): MidiPitch {
        const match = name.match(/^([A-G])(#|b?)(-?\d+)$/);
        if (!match) {
            throw new InvalidMidiPitchError(`无效的MIDI音高名称: ${name}`);
        }
        const noteName = match[1];
        const accidental = match[2];
        const octave = parseInt(match[3], 10);
        const index = midiNoteNames.indexOf(noteName) + 12 * (octave + 1) + (accidental === '#' ? 1 : 0) + (accidental === 'b' ? -1 : 0);
        return new MidiPitch(index);
    }

    /**
     * 从简谱音高表示法创建MidiPitch对象.
     * @param key 调号. eg. 'F', 'C', 'Bb'
     * @param simplifiedNotation 简谱音高表示法. 使用1-7表示音高, 高音用`表示, 低音用,表示. eg. '1', '2`', '3,'
     */
    public static fromSimplifiedNotation(key: string, simplifiedNotation: string): MidiPitch {
        const match = simplifiedNotation.match(/^(\d)([`,]*)$/);
        if (!match) {
            throw new InvalidMidiPitchError(`无效的简谱音高表示法: ${simplifiedNotation}`);
        }
        const pitch = parseInt(match[1], 10);
        const octaveOffset = match[2].length;
        const octaveOffsetSign = match[2][0] === '`' ? 1 : -1;
        const keyIndex = midiNoteNames.indexOf(key);
        if (keyIndex === -1) {
            throw new InvalidMidiPitchError(`无效的调号: ${key}`);
        }
        const index = 60 + keyIndex + simplifiedNotationToPitchOffset[pitch - 1] + 12 * octaveOffset * octaveOffsetSign;
        return new MidiPitch(index);
    }

    public frequency(baseFrequency: number = 440): number {
        return baseFrequency * Math.pow(2, (this.index - 69) / 12);
    }

    public name(): string {
        const index = this.index;
        const noteName = midiNoteNames[index % 12];
        const octave = Math.floor(index / 12) - 1;
        return `${noteName}${octave}`;
    }

    public toString(): string {
        return this.name();
    }

    public toSimplifiedNotation(key: string): string {
        const index = this.index;
        const keyIndex = midiNoteNames.indexOf(key);
        if (keyIndex === -1) {
            throw new InvalidMidiPitchError(`无效的调号: ${key}`);
        }
        const pitchOffset = index - keyIndex;
        const octaveOffset = Math.floor(pitchOffset / 12);
        const pitch = simplifiedNotationToPitchOffset.indexOf(pitchOffset % 12);
        if (pitch === -1) {
            throw new InvalidMidiPitchError(`无法将MIDI音高${this.toString()}转换为简谱音高表示法.`);
        }
        const octaveOffsetSign = octaveOffset >= 0 ? '`'.repeat(octaveOffset) : ','.repeat(-octaveOffset);
        return `${pitch + 1}${octaveOffsetSign}`;
    }

    // 获取频率是当前音符的factor倍的音符.
    public mul(factor: number, epsilon: number = 0.001): MidiPitch {
        return MidiPitch.fromFrequency(this.frequency() * factor, 440, epsilon);
    }

    // 获取比当前音符高n个半音的音符.
    public add(n: number): MidiPitch {
        return MidiPitch.fromIndex(this.index + n);
    }
}
