const express = require('express');
const app = express();
const config = require('./config.json');
const path = require('path');

const DiscourseService = require('./services/discourse');
const discourse = new DiscourseService(config.discourse.base_uri, config.discourse.announcement_category_id);

app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'static')));
app.get('/a', function(req, res) {
    discourse.getAnnouncements(function(err, topics) {
        if (err) {
            throw err;
        }

        return res.json(topics);
    })
});

app.get('/', function(req, res) {
    return res.render('home');
});

app.listen(8081);