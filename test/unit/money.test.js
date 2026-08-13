const { isValidMoney, toCents, fromCents } = require('../../src/utils/money');

describe('money', () => {
  it('aceita somente números positivos com até duas casas decimais', () => {
    expect(isValidMoney(0.01)).to.equal(true);
    expect(isValidMoney(8.9)).to.equal(true);
    for (const value of [0, -1, 8.999, '8.90', null]) expect(isValidMoney(value)).to.equal(false);
  });

  it('converte reais e centavos sem cálculo monetário em ponto flutuante', () => {
    expect(toCents(8.9)).to.equal(890);
    expect(toCents(0.01)).to.equal(1);
    expect(fromCents(950)).to.equal(9.5);
  });
});
