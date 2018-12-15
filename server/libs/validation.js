module.exports = (name, price, filename, size) => {
  let response;

  if (name === '') {
    response = {
      mes: 'Не указано название проекта',
      status: 'Error',
    };
  }

  if (price === '') {
    response = {
      mes: 'Не указано описание проекта',
      status: 'Error',
    };
  }

  if (filename === '' || size === 0) {
    response = {
      mes: 'Не загружена картинка',
      status: 'Error',
    };
  }

  return response;
};