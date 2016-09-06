const express = require('express');
const app = express();
const config = require('./config.json');
const path = require('path');
const S = require('string');

const DiscourseService = require('./services/discourse');
const discourse = new DiscourseService(config.discourse.base_uri, config.discourse.announcement_category_id);

app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'static')));
app.get('/', function(req, res) {
    discourse.getAnnouncementThreads().then(function(listing) {
        const topics = listing.topic_list.topics;
        const latestTwo = (topics.length <= 2 ? topics : topics.slice(topics.length - 2)).reverse();
        // fetch these topics
        const promises = [];
        latestTwo.forEach(function(topic) {
            promises.push(discourse.getTopicById(topic.id));
        });

        return Promise.all(promises);
    }).then(function(topics) {
        // massage the response for rendering purposes
        const topicsFound = topics.map(function(topic) {
            return {
                id: topic.id,
                title: S(topic.title).truncate(32).s,
                excerpt: S(topic.post_stream.posts[0].cooked).stripTags().truncate(200).s
            };
        });

        return res.render('home', { announcements: topicsFound, discourse_base_uri: config.discourse.base_uri });
    }).catch(function(err) {
        console.error(err);
        res.status(500).render('server_error');
    });
});

app.listen(8081);