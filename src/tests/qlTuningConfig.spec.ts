import test from 'ava';

import { QlTuningConfig } from '../lib/qlTuningConfig';
import { HuiPos, QlToneSoundType, XianPos } from '../lib/qlPos';
import { MidiPitch } from '../lib/midiPitch';

test('qlTuningConfig', t => {
    let config = QlTuningConfig.fromCommonTuning('C');
    t.deepEqual(config.tunings.map(p => p.toString()), ['C2', 'D2', 'E2', 'G2', 'A2', 'C3', 'D3']);
    config = QlTuningConfig.fromCommonTuning('bB');
    t.deepEqual(config.tunings.map(p => p.toString()), ['C2', 'D2', 'F2', 'G2', 'A#2', 'C3', 'D3']);
});

test('qlTuningConfig.getPositionPitch', t => {
    const config = QlTuningConfig.fromCommonTuning('F');
    t.deepEqual(config.getPositionPitch(
        XianPos.fromString('一'),
        undefined,
        QlToneSoundType.Unfettered
    ).toString(), 'C2');

    t.deepEqual(config.getPositionPitch(
        XianPos.fromString('一'),
        HuiPos.fromString('一六'),
        QlToneSoundType.Pressed
    ).toString(), 'A4');

    t.deepEqual(config.getPositionPitch(
        XianPos.fromString('六'),
        HuiPos.fromString('十八'),
        QlToneSoundType.Pressed
    ).toString(), 'E3');

    //
    // t.deepEqual(config.getPositionPitch(
    //     XianPos.fromString('七'),
    //     HuiPos.fromString('外'),
    //     QlToneSoundType.Pressed
    // ).toString(), 'E3');

    t.deepEqual(config.getPositionPitch(
        XianPos.fromString('七'),
        HuiPos.fromString('十一'),
        QlToneSoundType.Harmonic
    ).toString(), 'D6');

});


