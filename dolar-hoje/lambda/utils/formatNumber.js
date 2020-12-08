function formatNumberToBRL(number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(
    number
  );
}

module.exports = formatNumberToBRL;
