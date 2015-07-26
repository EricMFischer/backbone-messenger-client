// Backbone refactor

/*
Create your Models.
Create your views (which, at this stage, should only render initial states of their Models and not change their states).
Bind your Views to Model events (make sure Views update themselves when their Models’ states are updated).
Test your Views (update your Model state manually through console and see how the Views respond)
Create your controls (which modify model state)
*/
var Message = Backbone.Model.extend({
  initialize: function(message) {
    if (message !== undefined) {
      this.set('username', message.username),
      this.set('text', message.text),
      this.set('roomname', message.roomname)
    }
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



// var MessageView = Backbone.View.extend({
//   initialize: function() {
//     this.model.on('change', this.render, this);
//   },

//   render: function() {
//     var html = [
//       '<div>',
//         '<span class="username">',
//           this.model.get('username'),
//         '<span>',
//         '<span class="messagetext">',
//           this.model.get('text'),
//         '</span>',
//         '</br>',
//       '</div>'
//     ].join('');
//   }
// });

var MessagesView = Backbone.View.extend({
  initialize: function() {
    this.model.on('sync', this.render, this);
  },

  render: function () {
    var html = '';
    this.model.each(function(message) {
      html += message.get('text');
    })
    this.$el.append(html);
    return this.$el;
  }
});

// Create a new message model using our Message model class
// var message = new Message('This is a message');

// Create a view and associate it with this model: message
var messages = new Messages();
var messagesView = new MessagesView({model: messages});
$(document).ready(function () {
  $('body').append(messagesView.render());
});

// var commentList = [
//   new Comment('Doug!'), // default to 0 votes
//   new Comment('Doug?', 1),
//   new Comment('Doug.', 2),
//   new Comment('"Doug".', 3),
//   new Comment('Doug?!', 4)]; // See line 22

// // Add all of these to a new collection:
// var comments = new Comments(commentList); // see line 74