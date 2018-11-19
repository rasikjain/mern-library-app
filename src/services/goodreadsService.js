/* eslint-disable arrow-parens */
const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });

function goodReadsService() {
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://www.goodreads.com/book/show/${id}.xml?key=XXXXX`)
        .then(response => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch(error => {
          debug(error);
          reject(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodReadsService();
