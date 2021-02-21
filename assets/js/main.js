$(document).ready(() => {
  const socket = io();

  const username = window.prompt("Enter username: ");

  $('#topicBtn').click(() => {
    socket.emit('askTopic', null);
  });

  socket.on('currentTopic', (data) => {
    $('#topic').html(data);
  });

  const chatText = $('#chat-text');
  const chatInput = $('#chat-input');
  const chatForm = $('#chat-form');

  let typing = false;

  // add a chat cell to our chat list view, and scroll to the bottom
  socket.on('addToChat', (data) => {
    console.log('got a chat message');
    chatText.append(`<div class='chatCell'>` + data + '</div>');
    $('html, body').scrollTop($(document).height());
  });

  chatForm.submit((e) => {
    // prevent the form from refreshing the page
    e.preventDefault();
    // call sendMsgToServer socket function, with form text value as argument
    socket.emit('sendMsgToServer', username + ':  ' + $('#chat-input').val());
    $('#chat-input').val('');
  });

  $(window).on('load', () => {
    $('#chat-input').on('focus', () => {
      typing = true;
    });
    $('#chat-input').on('blur', () => {
      typing = false;
    });
  });

  $(document).keyup((event) => {
    // user pressed and released enter key
    if (event.keyCode === 13) {
      if (!typing) {
        // user is not already typing, focus our chat text form
        chatInput.focus();
      } else {
        // user sent a message, unfocus our chat form
        chatInput.blur();
      }
    }
  });
});
