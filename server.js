const http = require('http');
const { v4:uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');
const todo = [];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  if (req.url === '/todo' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todo,
    }));
    res.end();
  } else if (req.url === '/todo' && req.method === 'POST') {
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todoObj = {
            title,
            "id": uuidv4(),
          };
          todo.push(todoObj);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todo,
          }));
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      };
    });
  } else if (req.url === '/todo' && req.method === 'DELETE') {
    todo.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "message": "刪除全部",
    }));
    res.end();
  } else if (req.url.startsWith('/todo/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todo.findIndex(item => item.id === id);
    if (index !== -1) {
      todo.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        data: todo,
      }));
      res.end();
    } else {
      errorHandler(res);
    }
  } else if (req.url.startsWith('/todo/') && req.method === 'PATCH') {
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todo.findIndex(item => item.id ===id);
        if (title !== undefined && index !== -1) {
          todo[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: "success",
            data: todo,
          }));
          res.end();
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
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "error",
      "message": "Nothing here",
    }));
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);