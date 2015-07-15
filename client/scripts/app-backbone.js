// Backbone refactor

var Message = Backbone.Model.extend({
  initialize: function(message) {
    this.set('username', message.username),
    this.set('text', message.text),
    this.set('roomname', message.roomname)
  }
});



// Pulls things from the API and sends them to the Model
var Messages = Backbone.Collection.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  model: Message,
  initialize: function (message) {
    this.fetch();
  },
  parse: function(response) {
    return response.results;
  }
});



var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change: ', this.render, this);
  },

  render: function() {
    var html = [
      '<div>',
        '<span class="username">',
          this.model.get('username'),
        '<span>',
        '<span class="messagetext">',
          this.model.get('text'),
        '</span>',
        '</br>',
      '</div>'
    ].join('');
  }

});

var messages = new Messages([]);

// var commentList = [
//   new Comment('Doug!'), // default to 0 votes
//   new Comment('Doug?', 1),
//   new Comment('Doug.', 2),
//   new Comment('"Doug".', 3),
//   new Comment('Doug?!', 4)]; // See line 22

// // Add all of these to a new collection:
// var comments = new Comments(commentList); // see line 74