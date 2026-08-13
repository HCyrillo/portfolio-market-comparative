const { expect } = require('chai');
const { isValidMoney, toCents, fromCents } = require('../../src/utils/money');

describe('money', () => {
  const validationCases = [
    { value: -0.01, expected: false, scenario: 'TS-PRC-004' },
    { value: 0, expected: false, scenario: 'TS-PRC-002' },
    { value: 0.01, expected: true, scenario: 'TS-PRC-003' },
    { value: 8.9, expected: true, scenario: 'TS-PRC-001' },
    { value: 8.999, expected: false, scenario: 'TS-PRC-005' },
    { value: '8.90', expected: false, scenario: 'TS-PRC-009' },
    { value: null, expected: false, scenario: 'EXP-001' }
  ];

  for (const { value, expected, scenario } of validationCases) {
    it(`[${scenario}][RSK-003] valida preço ${JSON.stringify(value)}`, () => {
      expect(isValidMoney(value)).to.equal(expected);
    });
  }

  it('[RSK-001] converte reais para centavos', () => {
    expect(toCents(8.9)).to.equal(890);
    expect(toCents(0.01)).to.equal(1);
  });

  it('[RSK-001] converte centavos para reais', () => {
    expect(fromCents(950)).to.equal(9.5);
  });
});
