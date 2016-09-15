const fetch = require('node-fetch');
const LRU = require('lru-cache');

function DiscourseService(base, cat) {
    this.baseUri = base;
    this.category = cat;
    // Cache announcements for five minutes
    this.cache = LRU({
        maxAge: 1000 * 60 * 5
    });
}

DiscourseService.prototype.getAnnouncementThreads = function() {
    const cachedResult = this.cache.get('announcements');
    if (cachedResult) {
        return Promise.resolve(cachedResult);
    }
    return fetch(this.baseUri + '/c/' + this.category + '.json').then(function(result) {
        if (result.status != 200) {
            throw new Error("Couldn't get forum data.");
        }

        const jsonBody = result.json();
        this.cache.set('announcements', jsonBody);
        return jsonBody;
    }.bind(this));
};

DiscourseService.prototype.getTopicById = function(id) {
    const cachedResult = this.cache.get('first-post:' + id);
    if (cachedResult) {
        return Promise.resolve(cachedResult);
    }
    return fetch(this.baseUri + '/t/' + id + '.json').then(function(result) {
        if (result.status != 200) {
            throw new Error("Couldn't get forum data.");
        }

        const jsonBody = result.json();
        this.cache.set('first-post:' + id, jsonBody);
        return jsonBody;
    }.bind(this));
};

module.exports = DiscourseService;