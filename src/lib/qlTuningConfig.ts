
import { MidiPitch } from "./midiPitch"
import { XianPos, HuiPos, QlToneSoundType } from "./qlPos";

// 定弦配置
export class QlTuningConfig {
    private _tunings: MidiPitch[];

    constructor(tunings: MidiPitch[]) {
        this._tunings = tunings;
    }

    public static fromCommonTuning(key: string = 'F'): QlTuningConfig {
        switch (key) {
            case 'F':
                return new QlTuningConfig([
                    MidiPitch.fromName('C2'),
                    MidiPitch.fromName('D2'),
                    MidiPitch.fromName('F2'),
                    MidiPitch.fromName('G2'),
                    MidiPitch.fromName('A2'),
                    MidiPitch.fromName('C3'),
                    MidiPitch.fromName('D3'),
                ]);
            case 'C':
                return new QlTuningConfig([
                    MidiPitch.fromName('C2'),
                    MidiPitch.fromName('D2'),
                    MidiPitch.fromName('E2'),
                    MidiPitch.fromName('G2'),
                    MidiPitch.fromName('A2'),
                    MidiPitch.fromName('C3'),
                    MidiPitch.fromName('D3'),
                ]);
            case 'bB':
            case 'Bb':
                return new QlTuningConfig([
                    MidiPitch.fromName('C2'),
                    MidiPitch.fromName('D2'),
                    MidiPitch.fromName('F2'),
                    MidiPitch.fromName('G2'),
                    MidiPitch.fromName('Bb2'),
                    MidiPitch.fromName('C3'),
                    MidiPitch.fromName('D3'),
                ]);
            case 'G':
                return new QlTuningConfig([
                    MidiPitch.fromName('B1'),
                    MidiPitch.fromName('D2'),
                    MidiPitch.fromName('E2'),
                    MidiPitch.fromName('G2'),
                    MidiPitch.fromName('A2'),
                    MidiPitch.fromName('B2'),
                    MidiPitch.fromName('D3'),
                ]);
            case 'bE':
            case 'Eb':
                return new QlTuningConfig([
                    MidiPitch.fromName('C2'),
                    MidiPitch.fromName('Eb2'),
                    MidiPitch.fromName('F2'),
                    MidiPitch.fromName('G2'),
                    MidiPitch.fromName('Bb2'),
                    MidiPitch.fromName('C3'),
                    MidiPitch.fromName('Eb3'),
                ]);
            default:
                throw new Error(`未定义的常用定弦: ${key}`);
        }
    }

    public get tunings(): MidiPitch[] {
        return this._tunings;
    }
    /**
     * 根据指定的弦位和徽位, 以及音色类型, 计算出音高.
     * @param xianPos 弦
     * @param huiPos 徽位
     * @param type 音色类型
     * @returns 音高
     * @note 不靠查表实现, 因此结果是精确值, 但查表反而是近似值, 因此可能会有精度对不上的问题. eps = 0.1
     */
    public getPositionPitch(xianPos: XianPos, huiPos: HuiPos | undefined, type: QlToneSoundType): MidiPitch {
        switch (type) {
            case QlToneSoundType.San:
                return this._tunings[xianPos.index - 1];
            case QlToneSoundType.An:
                if (!huiPos) {
                    throw new Error('按音必须指定徽位');
                }
                return this._tunings[xianPos.index - 1].mul(1 / huiPos.getLengthRatio(), 0.1);
            case QlToneSoundType.Fan:
                if (!huiPos) {
                    throw new Error('泛音必须指定徽位');
                }
                return this._tunings[xianPos.index - 1].mul(huiPos.getHarmonicMultiplier(), 0.1);
        }
    }
}

