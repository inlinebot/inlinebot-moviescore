'use strict';

const SDK = require('inline-sdk');
const CommandType = SDK.CommandType;
const MultipleMessages = SDK.MultipleMessages;
const request = require('superagent-promise')(require('superagent'), Promise);

const inline = new SDK();

inline.onCommand((type, payload, context) => {
  if (type !== CommandType.MESSAGE) return;

  const movieName = payload.args.join(' ');

  request
    .get('http://www.omdbapi.com/?tomatoes=true&t=' + movieName)
    .then((res) => {
      console.log(res.body);

      if (res.body.Response === 'False') {
        context.sendText(res.body.Error)
        return;
      }

      const result = res.body.Title + ' (' + res.body.Year + ')' +
        '\nby ' + res.body.Director +
        '\nIMDB: ' + res.body.imdbRating +
        '\nTomato Meter: ' + res.body.tomatoMeter + '%' +
        '\nMetascore: ' + res.body.Metascore;

      context.sendImage(res.body.Poster, res.body.Poster);
      context.sendText(result);
      return;
    })
    .catch((err) => {
      console.error(err);
    });
});
