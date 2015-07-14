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
    app.appendMessages(app.messages);
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
      var messages = data.results;
      app.messages = messages;
      app.appendMessages(messages);
      setTimeout(app.fetch, 30000);
    }
  });
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addMessage = function (message) {
  var html = '<span data-username="';
  html += message.username;
  html += '">';
  html += '<span class="username">';
  html += message.username;
  html += '</span>';
  html += ': ';
  html += app.sanitizeInput(message.text || '');
  html += '</span>';
  html += '<br />';
  var $html = $(html);
  $('#chats').append($html);
  $html.on('click', function() {
    app.addFriend(message.username);
  });
};

app.addRoom = function (roomName) {
  var html = '<option value="';
  html += roomName;
  html += '">';
  html += roomName;
  html += '</option>';
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

app.filterByRoom = function (messages) {
  var roomName = $('#roomSelect').val();
  if (!roomName) return messages;
  return _.filter(messages, function(message) {
    return message.roomname === roomName;
  });
};

app.appendMessages = function (messages) {
  app.clearMessages();
  messages = app.filterByRoom(messages);
  messages.forEach(function (message) {
    app.addMessage(message);
  });
  $('[data-username="'+friend+'"]').addClass('friend');
};
