import { describe, it, expect } from 'vitest';
import { TRUEX_RF, TRUEX_RNF, getTruexReqCounts } from '../truex_reqs.js';

describe('TrueX requerimientos funcionales', () => {
  it('son 18 con los números originales del equipo', () => {
    expect(TRUEX_RF.length).toBe(18);
    expect(TRUEX_RF.map((r) => r.id)).toEqual([1, 2, 4, 5, 7, 8, 10, 18, 19, 20, 22, 27, 28, 29, 30, 31, 32, 34]);
  });

  it('cada uno tiene título y detalle', () => {
    for (const r of TRUEX_RF) {
      expect(r.title).toBeTruthy();
      expect(r.detail).toBeTruthy();
    }
  });
});

describe('TrueX requerimientos no funcionales', () => {
  it('son 11 con los números originales del equipo', () => {
    expect(TRUEX_RNF.length).toBe(11);
    expect(TRUEX_RNF.map((r) => r.id)).toEqual([3, 6, 9, 11, 12, 13, 14, 15, 16, 21, 24]);
  });

  it('cada uno tiene título y detalle', () => {
    for (const r of TRUEX_RNF) {
      expect(r.title).toBeTruthy();
      expect(r.detail).toBeTruthy();
    }
  });
});

describe('getTruexReqCounts', () => {
  it('18 + 11 = 29 en total', () => {
    expect(getTruexReqCounts()).toEqual({ rf: 18, rnf: 11, total: 29 });
  });
});
