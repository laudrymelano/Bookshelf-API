const { nanoid } = require("nanoid");
const books = require("./books");

const saveBookHandler = (request, h) => {

    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading
    } = request.payload;

    if(name==null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }

    if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }

    const id = nanoid(16);
    let finished;

    if (pageCount === readPage){ 
        finished = true;
    }else{
        finished = false;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
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

        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
          });
          response.code(500);
          return response;

};

const getAllBooksHandler = (request, h) => {

    const {finished, reading, name} = request.query;

    if (name) {
        const filteredBooksName = books.filter((book) => {
          const searchBook = book.name.toLowerCase().includes(name.toLowerCase());
          return searchBook;
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if(finished){
        const getBookFinished = books.filter((book) => Number(book.finished) === Number(finished));
        
        const response = h.response({
            status: 'success',
            data: {
                books: getBookFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if(reading){
        const getBookReading = books.filter((book) => Number(book.reading) === Number(reading));
        
        const response = h.response({
            status: 'success',
            data: {
                books: getBookReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
          }))
        }
    });
      response.code(200);
      return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const book = books.filter((b) => b.id === bookId)[0];
   
   if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const { 
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading 
    } = request.payload;

    if(name==null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }

    if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }

    const updatedAt = new Date().toISOString();
    let finished;

    if (pageCount === readPage){ 
        finished = true;
    }else{
        finished = false;
    }
   
    const index = books.findIndex((book) => book.id === bookId);
   
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
        reading,
        finished, 
        updatedAt,
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
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

  const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

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



module.exports = { saveBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};