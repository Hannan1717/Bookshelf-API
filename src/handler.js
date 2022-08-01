/* eslint-disable object-curly-newline */
/* eslint-disable no-else-return */
const { params } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  //   Jika nama kosong
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const newbook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newbook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const isExist = books.length > 0;

  //   Mengambil Buku yang sedang dibaca
  if (reading !== undefined) {
    const bookReading = books.filter((b) => Number(b.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: bookReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    // Mengambil buku yang sudah selesai dibaca
    const bookFinished = books.filter((b) => Number(b.finished) === Number(finished));
    const response = h.response({
      status: 'success',
      data: {
        books: bookFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (name !== undefined) {
    // Mengambil buku berdasarkan namanya
    const bookName = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (!isExist) {
    // Menampilan Array buku jika kosong
    const bookName = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  } else {
    // Mengambil semua buku
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getDetailBookhandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  //   jika buku tersedia
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookhandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  //   Jika nama kosong
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // mencari lokasi index berdasarkan ID yang sama
  const index = books.findIndex((note) => note.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        bookId: id,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line max-len
module.exports = { addBookHandler, getAllBookHandler, getDetailBookhandler, updateBookhandler, deleteBookHandler };
