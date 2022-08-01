// eslint-disable-next-line object-curly-newline
const { addBookHandler, getAllBookHandler, getDetailBookhandler, updateBookhandler, deleteBookHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getDetailBookhandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookhandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookHandler,
  },
];

module.exports = routes;
