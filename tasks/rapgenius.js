var rapgeniusClient = require('rapgenius-js');

module.exports = function (grunt) {
    grunt.registerTask('rapgenius', 'Rap Genius', function () {
        var rg = this,
            artists = this.options().artists || require('../artists.json'),
            done = this.async(),
            artistIndex = Math.floor(Math.random() * artists.length);

        rg.artist = artists[artistIndex];

        function searchArtistCallback(err, artist) {
            if (err) {
                grunt.log.writeln('Could not find artist [' + rg.artist + ']');
                done();
            } else {
                var songs = artist.songs,
                    songIndex = Math.floor(Math.random() * songs.length),
                    garbagePrefix = 'http://rapgenius.com',
                    song = songs[songIndex],
                    link = song.link.substr(song.link.indexOf(garbagePrefix) + garbagePrefix.length);

                grunt.log.writeln(artist.name + ' - ' + song.name);
                grunt.log.writeln();
                grunt.log.writeln();

                rapgeniusClient.searchLyricsAndExplanations(link, 'rap', searchLyricsAndExplanationsCallback);
            }
        }

        function searchLyricsAndExplanationsCallback(err, lyricsAndExplanations) {
            if (err) {
                grunt.log.writeln(err);
            } else {
                var lyrics = lyricsAndExplanations.lyrics,
                    sections = lyrics.sections,
                    verses,
                    verse;

                for (var i = 0; i < sections.length; i++) {
                    verses = sections[i].verses;
                    for (var j = 0; j < verses.length; j++) {
                        verse = verses[j];
                        grunt.log.writeln(verse.content);
                    }
                }
            }
            done();
        }

        rapgeniusClient.searchArtist(rg.artist, 'rap', searchArtistCallback);
    });
};
