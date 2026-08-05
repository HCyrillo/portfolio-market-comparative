const isValidMoney = (value) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  return /^\d+(\.\d{1,2})?$/.test(String(value)) && value > 0;
};

const toCents = (value) => {
  const [whole, decimal = ''] = String(value).split('.');
  return (Number(whole) * 100) + Number(decimal.padEnd(2, '0'));
};

const fromCents = (value) => value / 100;

module.exports = { isValidMoney, toCents, fromCents };
