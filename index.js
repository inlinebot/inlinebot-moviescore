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
      if (res.body.Response === 'False') {
        context.sendText(res.body.Error)
        return;
      }

      const multipleMessages = new MultipleMessages();

      const result = res.body.Title + ' (' + res.body.Year + ')' +
        '\nby ' + res.body.Director +
        '\nIMDB: ' + res.body.imdbRating +
        '\nTomato Meter: ' + res.body.tomatoMeter + '%' +
        '\nMetascore: ' + res.body.Metascore;

      multipleMessages
        .addImage(res.body.Poster, res.body.Poster)
        .addText(result);

      context.sendMultipleMessages(multipleMessages);
      return;
    });
});
