const formatCurrency = (value: string) => {
  const isNegative = Number(value) < 0;

  if (value === "" || value === "R$ " || value === " ") {
    return "";
  }

  value = value.replace(".", "").replace(",", "").replace(/\D/g, "");

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(value) / 100
  );

  if (isNegative) {
    return "-R$ " + result;
  }

  return "R$ " + result;
};

const unformatCurrency = (value: string) => {
  const isNegative = value.startsWith("-");
  if (isNegative) {
    value = value.replace("-", "");
  }

  const newNumber = Number(
    value.replace("R$ ", "").replace(".", "").replace(",", "")
  );
  return isNegative ? newNumber * -1 : newNumber;
};

const formatCep = (value: string) => {
  const formattedValue = value
    .replace(/[^\d]/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");

  if (formattedValue.length === 10) {
    return formattedValue.slice(0, 9);
  }

  return formattedValue;
};
const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  digits = digits.slice(0, 11);

  if (digits.length < 3) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length < 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatPercentage = (value: string) => {
  if (!value || value === "% " || value === " ") {
    return "";
  }

  let valueFormatted = value;

  valueFormatted = valueFormatted.replace(/\D/g, "");
  valueFormatted = valueFormatted.replace(/(\d)(\d{2})$/, "$1,$2");
  valueFormatted = valueFormatted.replace(/(?=(\d{3})+(\D))\B/g, ".");

  return valueFormatted;
};

const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const formatCpf = (value: string) => {
  const formattedValue = value
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  if (formattedValue.length === 15) {
    return formattedValue.slice(0, 14);
  }

  return formattedValue;
};

const formatDate = (value: string) => {
  let formattedValue = value.replace(/[^\d]/g, "");

  if (formattedValue.length > 2) {
    formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "$1/$2");
  }
  if (formattedValue.length > 5) {
    formattedValue = formattedValue.replace(
      /^(\d{2})\/(\d{2})(\d)/,
      "$1/$2/$3"
    );
  }
  if (formattedValue.length > 10) {
    formattedValue = formattedValue.slice(0, 10);
  }

  return formattedValue;
};

const formatTime = (value: string) => {
  let formattedValue = value.replace(/[^\d]/g, "");

  if (formattedValue.length > 2) {
    formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "$1:$2");
  }
  if (formattedValue.length > 5) {
    formattedValue = formattedValue.slice(0, 5);
  }

  return formattedValue;
};

export const masks = {
  formatCurrency,
  unformatCurrency,
  formatCep,
  formatPhone,
  formatPercentage,
  formatCpf,
  formatCnpj,
  formatDate,
  formatTime,
};
