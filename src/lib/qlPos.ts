

//中文数字转number
const cctoi = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
    '十': 10, '半': 5, '外': 14,
}

const itoqlcc = {
    0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
    5: '五', 6: '六', 7: '七', 8: '八', 9: '九',
    10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '徽外',
}



const throwInvalidHuiPos = (qlString: string) => {
    throw new Error(`无效的徽位表示: ${qlString}`);
}

// 徽位
export class HuiPos {
    // 徽位编号, (1->一徽...13->十三徽, 14->徽外)
    public index: number;

    constructor(index: number) {
        this.index = index;
    }

    static fromIndexNumber(index: number): HuiPos {
        return new HuiPos(index);
    }

    static fromIntDecimal(int: number, decimal: number): HuiPos {
        return new HuiPos(int + decimal / 10);
    }

    static fromString(qlString: string): HuiPos {
        //把类似 "一徽" 的字符串转换为数字
        // eg. "一徽" -> 1, "十三徽" -> 13, "徽外" -> 14
        // eg. "一徽二[分]" -> 1.2, "十三徽八[分]" -> 13.8
        // eg. "一徽半[分]" -> 1.5, "十三徽半[分]" -> 13.5
        // eg. "四三" -> 4.3, "十三" -> 13, "十八" -> 10.8, "十" -> 10

        // 徽外
        if (qlString.startsWith('徽外')) {
            if (qlString.length === 2) {
                return new HuiPos(14);
            } else {
                const extra = cctoi[qlString[2]];
                if (extra === undefined) {
                    throwInvalidHuiPos(qlString);
                }
                return new HuiPos(14 + extra / 10);
            }
        }
        if (qlString.includes('徽')) {
            const parts = qlString.split('徽');
            let int = 0;
            switch (parts[0].length) {
                case 1:
                    int = cctoi[parts[0]];
                    break;
                case 2:
                    if (parts[0][0] === '十') {
                        int = 10 + cctoi[parts[0][1]];
                    } else {
                        throwInvalidHuiPos(qlString);
                    }
                    break;
                default:
                    throwInvalidHuiPos(qlString);
            }
            if (parts[1].length === 0) {
                return new HuiPos(int);
            } else {
                const decimal = cctoi[parts[1][0]];
                if (decimal === undefined ||
                    (parts[1].length === 2 && parts[1][1] !== '分') ||
                    parts[1].length > 3) {
                    throwInvalidHuiPos(qlString);
                }
                return new HuiPos(int + decimal / 10);
            }
        } else {
            //没有徽字的情况
            switch (qlString.length) {
                case 1:
                    return new HuiPos(cctoi[qlString]);
                case 2:
                    if (qlString[0] === '十') {
                        if (cctoi[qlString[1]] <= 3) { //十一,十二,十三
                            return new HuiPos(10 + cctoi[qlString[1]]);
                        } else {
                            return new HuiPos(10 + cctoi[qlString[1]] / 10);
                        }
                    } else {
                        return new HuiPos(cctoi[qlString[0]] + cctoi[qlString[1]] / 10);
                    }
                default:
                    throwInvalidHuiPos(qlString);
            }
        }
        return throwInvalidHuiPos(qlString);
    }

    public toIntDecimal(): [number, number] {
        const index = this.index;
        const int = Math.floor(index);
        const decimal = index - int;
        return [int, Math.round(decimal * 10)];
    }

    public toString(useHalf: boolean = true): string {
        const [int, decimal] = this.toIntDecimal();
        if (int === 14) {
            if (useHalf && decimal === 5) {
                return '徽外半分';
            }
            if (decimal === 0) {
                return '徽外';
            }
            return `徽外${itoqlcc[decimal]}分`;
        } else if (decimal === 0) {
            return `${itoqlcc[int]}徽`;
        } else {
            if (useHalf && decimal === 5) {
                return `${itoqlcc[int]}徽半分`;
            }
            if (decimal === 0) {
                return `${itoqlcc[int]}徽`;
            }
            return `${itoqlcc[int]}徽${itoqlcc[decimal]}分`;
        }
    }

    public toSimplifiedString(useHalf: boolean = true): string {
        const [int, decimal] = this.toIntDecimal();
        if (decimal === 0) {
            return `${itoqlcc[int]}`;
        } else if (int > 10 || (int === 10 && decimal <= 3)) {
            return this.toString(useHalf); //10.1不能简化为"十一"(11.0)
        } else {
            if (useHalf && decimal === 5) {
                return `${itoqlcc[int]}半`;
            }
            return `${itoqlcc[int]}${itoqlcc[decimal]}`;
        }
    }

    public getLengthRatio(): number {
        const RelativeHuiPos = [
            0,
            1 / 8, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 2 / 5, 1 / 2,
            3 / 5, 2 / 3, 3 / 4, 4 / 5, 5 / 6, 7 / 8];
        const [int, decimal] = this.toIntDecimal();
        if (decimal === 0) {
            return RelativeHuiPos[int];
        } else {
            if (int === 14) {
                throw new Error(`Not implemented: ${this.toString()}`);
            }
            const low = RelativeHuiPos[int];
            const high = RelativeHuiPos[int + 1];
            return low + (high - low) * decimal / 10;
        }
    }

    public getHarmonicMultiplier(): number {
        const multipliers = [
            0, 8, 6, 5, 4, 3, 5, 2,
            5, 3, 4, 5, 6, 8];
        const [int, decimal] = this.toIntDecimal();
        if (decimal !== 0 || int === 14) {
            throw new Error(`无效的泛音徽位: ${this.toString()}`);
        }
        return multipliers[int];
    }
}



// 弦
export class XianPos {
    // 弦编号, (1->一弦...7->七弦)
    public index: number;

    constructor(index: number) {
        this.index = index;
    }

    static fromIndexNumber(index: number): XianPos {
        return new XianPos(index);
    }

    //把类似 "一弦" 的字符串转换为数字
    // eg. "一弦" -> 1, "七弦" -> 7
    // eg. "一" -> 1, "七" -> 7
    static fromString(qlString: string): XianPos {
        const index = cctoi[qlString[0]];
        if (index === undefined || index > 7) {
            throw new Error(`无效的弦位表示: ${qlString}`);
        }
        return new XianPos(index);
    }

    public toString(): string {
        return `${itoqlcc[this.index]}弦`;
    }

    public toSimplifiedString(): string {
        return `${itoqlcc[this.index]}`;
    }
}

export enum QlToneSoundType {
    //https://en.wikipedia.org/wiki/Guqin#Playing_technique
    //散音
    San = 0,
    Unfettered = 0,
    //按音
    An = 1,
    Pressed = 1,
    //泛音
    Fan = 2,
    Harmonic = 2,
}
