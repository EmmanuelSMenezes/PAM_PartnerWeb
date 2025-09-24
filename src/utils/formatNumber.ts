import numeral from 'numeral';

// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function maskCpfCnpj(value: string) {
  if (value) {
    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (value.length <= 11) {
      // Se for um CPF
      value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 3 primeiros dígitos
      value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 6 primeiros dígitos
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen depois dos 9 primeiros dígitos
    } else {
      // Se for um CNPJ
      value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 2 primeiros dígitos
      value = value.replace(/^(\d{2}).(\d{3})(\d)/, '$1.$2.$3'); // Adiciona o ponto depois dos 5 primeiros dígitos
      value = value.replace(/.(\d{3})(\d)/, '.$1/$2'); // Adiciona a barra depois dos 8 primeiros dígitos
      value = value.replace(/(\d{4})(\d)/, '$1-$2'); // Adiciona o hífen depois dos 12 primeiros dígitos
    }
  }
  return value;
}

export function maskZipCode(value: string) {
  value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  value = value?.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen depois dos primeiros 5 dígitos
  return value;
}

export function maskPhone(value: string) {
  // value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  // value = value.substring(0, 11); // Restringe o máximo de 11 dígitos
  // value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

  return value
    ?.replace(/[\D]/g, '')
    ?.replace(/(\d{2})(\d)/, '($1) $2')
    ?.replace(/(\d{5})(\d)/, '$1-$2')
    ?.replace(/(-\d{4})(\d+?)/, '$1'); // Adiciona a máscara
}

export function formatValue(value: any) {
  if (String(value).includes('.')) {
    const formatedValue = String(value).replace('.', ',');

    const index = formatedValue.indexOf(',');
    const checkDecimals = formatedValue.slice(index + 1, 10);
    if (checkDecimals.length === 1) {
      return formatedValue.concat('0');
    }

    return formatedValue;
  }
  const formatedValue = String(value).concat(',00');
  return formatedValue;
}

export function removeSpecialCharacter(value: string) {
  return value.replace(/\D/g, '');
}

export function calculateFee(value: number, fee: number) {
  const feeValue = value * fee;
  const finalPrice = value + feeValue;

  return ((finalPrice * 100) / (100 - feeValue)).toFixed(2);
}

export function discountFee(value: number, fee: number) {
  const feeValue = value * fee;
  const finalPrice = value - feeValue;

  return finalPrice.toFixed(2);
}
