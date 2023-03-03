export function convertNumberToRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number);
}

export function limitText(text, limit = 100) {
  if (!(typeof text === 'string')) {
    throw new Error('Parameter text harus bertipe string');
  }

  if (text.length <= limit) {
    return text;
  }

  let omission = '...';
  const concatenatedText = text.slice(0, limit);
  return concatenatedText.concat(omission);
}