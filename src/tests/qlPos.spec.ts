import test from 'ava';

import { HuiPos } from '../lib/qlPos';

test('huiPosFromString', t => {
    let p = HuiPos.fromString('徽外');
    t.deepEqual(p.toIntDecimal(), [14, 0]);
    p = HuiPos.fromString('徽外一');
    t.deepEqual(p.toIntDecimal(), [14, 1]);
    p = HuiPos.fromString('徽外半分');
    t.deepEqual(p.toIntDecimal(), [14, 5]);
    p = HuiPos.fromString('一徽');
    t.deepEqual(p.toIntDecimal(), [1, 0]);
    p = HuiPos.fromString('十三徽');
    t.deepEqual(p.toIntDecimal(), [13, 0]);
    p = HuiPos.fromString('一徽二');
    t.deepEqual(p.toIntDecimal(), [1, 2]);
    p = HuiPos.fromString('十三徽八分');
    t.deepEqual(p.toIntDecimal(), [13, 8]);
    p = HuiPos.fromString('一徽半');
    t.deepEqual(p.toIntDecimal(), [1, 5]);

    p = HuiPos.fromString('四三');
    t.deepEqual(p.toIntDecimal(), [4, 3]);
    p = HuiPos.fromString('十三');
    t.deepEqual(p.toIntDecimal(), [13, 0]);
    p = HuiPos.fromString('十八');
    t.deepEqual(p.toIntDecimal(), [10, 8]);
    p = HuiPos.fromString('十');
    t.deepEqual(p.toIntDecimal(), [10, 0]);

});

test('huiPosToString', t => {
    let p = new HuiPos(14);
    t.deepEqual(p.toString(), '徽外');
    p = new HuiPos(14.5);
    t.deepEqual(p.toString(), '徽外半分');
    p = new HuiPos(1);
    t.deepEqual(p.toString(), '一徽');
    p = new HuiPos(13);
    t.deepEqual(p.toString(), '十三徽');
    p = new HuiPos(1.2);
    t.deepEqual(p.toString(), '一徽二分');
    p = new HuiPos(13.8);
    t.deepEqual(p.toString(), '十三徽八分');
    p = new HuiPos(1.5);
    t.deepEqual(p.toString(), '一徽半分');
    p = new HuiPos(1.5);
    t.deepEqual(p.toString(false), '一徽五分');
});

test('huiPosToSimplifiedString', t => {
    let p = new HuiPos(14);
    t.deepEqual(p.toSimplifiedString(), '徽外');
    p = new HuiPos(14.5);
    t.deepEqual(p.toSimplifiedString(), '徽外半分');
    p = new HuiPos(1);
    t.deepEqual(p.toSimplifiedString(), '一');
    p = new HuiPos(13);
    t.deepEqual(p.toSimplifiedString(), '十三');
    p = new HuiPos(1.2);
    t.deepEqual(p.toSimplifiedString(), '一二');
    p = new HuiPos(13.8);
    t.deepEqual(p.toSimplifiedString(), '十三徽八分');
    p = new HuiPos(10.3);
    t.deepEqual(p.toSimplifiedString(), '十徽三分');
    p = new HuiPos(10.8);
    t.deepEqual(p.toSimplifiedString(), '十八');
    p = new HuiPos(1.5);
    t.deepEqual(p.toSimplifiedString(), '一半');
    p = new HuiPos(1.5);
    t.deepEqual(p.toSimplifiedString(false), '一五');
});



