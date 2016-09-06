const request = require('request');
const LRU = require('lru-cache');

function DiscourseService(base, cat) {
    this.baseUri = base;
    this.category = cat;
    // Cache announcements for five minutes
    this.cache = LRU({
        maxAge: 1000 * 60 * 5
    });
}

DiscourseService.prototype.getAnnouncements = function(cb) {
    const cachedResult = this.cache.get('announcements');
    if (cachedResult) {
        return setImmediate(cb, null, cachedResult);
    }
    request.get(this.baseUri + '/c/' + this.category + '.json', { json: true }, function(err, response, body) {
        if (err) {
            cb(err);
        } else {
            if (response.statusCode != 200) {
                return cb(new Error("Couldn't get forum data."));
            }
            const topics = body.topic_list.topics;
            this.cache.set('announcements', topics);
            cb(null, topics);
        }
    }.bind(this));
};

module.exports = DiscourseService;