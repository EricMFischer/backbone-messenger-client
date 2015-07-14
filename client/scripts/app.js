// YOUR CODE HERE:

$(document).ready(function () {
  $('#send').on('submit', function (event) {
    app.handleSubmit();
    $('#message').val('');
    event.preventDefault();
  });
  $('#addroom').on('click', function () {
    var roomName = $('#roomname').val();
    app.addRoom(roomName);
  });
  $('#roomSelect').on('change', function () {
    app.updateMessages();
  });
  app.init();
});

var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.messages;
app.friends = {};

app.init = function () {
  app.fetch();
};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function (data) {
      app.messages = data.results;
      app.updateMessages();
      setTimeout(app.fetch, 30000);
    }
  });
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addMessage = function (message) {
  var html = [
    '<div data-username="' + message.username + '">',
      '<span class="username">' + message.username + '</span>',
      ': ' + app.sanitizeInput(message.text || ''),
    '</div>'
  ];
  html = html.join('');
  var $html = $(html);
  if (app.friends[message.username] === true) $html.addClass('friend'); // As we add individual messages, check to see if that message was sent by a friend
  $('#chats').append($html);
  $html.find('.username').on('click', function() { // We are anticipatorily adding click hander events to every $html message added to the DOM.
    app.addFriend(message.username);               // In the event you click on a username for a particular message, that person gets added to friends
  });
};

app.addRoom = function (roomName) {
  var html = [
    '<option value="' + roomName + '">',
      roomName,
    '</option>'
  ];
  html = html.join('');
  $('#roomSelect').append(html);
  $('#roomSelect').val(roomName);
  $('#roomSelect').trigger('change');
};

app.addFriend = function (friend) {
  app.friends[friend] = true;
  $('[data-username="'+friend+'"]').addClass('friend');
};

app.handleSubmit = function () {
  var message = {};
  message.username = $('#send #username').val();
  message.text = $('#send #message').val();
  message.roomname = $('#roomSelect').val();
  app.send(message);
};

app.sanitizeInput = function (input) {
  var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<[\/\!]*?[^<>]*?>/gi, '')
    .replace(/<style[^>]*?>.*?<\/style>/gi, '')
    .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
  return output;
};

app.filterByRoom = function () {
  var roomName = $('#roomSelect').val();
  if (!roomName) return app.messages;
  return _.filter(app.messages, function(message) {
    return message.roomname === roomName;
  });
};

app.updateMessages = function () {
  app.clearMessages();
  var messages = app.filterByRoom();
  messages.forEach(function (message) {
    app.addMessage(message);
  });
};
