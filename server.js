const http = require('http');
const { v4:uuidv4 } = require('uuid');
const successHandler = require('./successHandler');
const errorHandler = require('./errorHandler');
const todo = [];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  if (req.url === '/todo' && req.method === 'GET') {
    successHandler(res, todo);
  } else if (req.url === '/todo' && req.method === 'POST') {
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        if (title) {
          const todoObj = {
            title,
            "id": uuidv4(),
          };
          todo.push(todoObj);
          successHandler(res, todo);
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      };
    });
  } else if (req.url === '/todo' && req.method === 'DELETE') {
    todo.length = 0;
    successHandler(res, todo);
  } else if (req.url.startsWith('/todo/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todo.findIndex(item => item.id === id);
    if (index !== -1) {
      todo.splice(index, 1);
      successHandler(res, todo);
    } else {
      errorHandler(res);
    }
  } else if (req.url.startsWith('/todo/') && req.method === 'PATCH') {
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todo.findIndex(item => item.id ===id);
        if (title && index !== -1) {
          todo[index].title = title;
          successHandler(res, todo);
        } else {
          errorHandler(res);
        }
      } catch(error) {
        errorHandler(res);
      };
    });
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandler(res, 404);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);