$(document).ready(() => {
  const socket = io();

  function sanitize(input) {
    return input.replace(/(<([^>]+)>)/ig, '');
  }

  const username = sanitize(window.prompt('Enter username: '));

  $('#topic-btn').click(() => {
    socket.emit('ask-topic', null);
  });

  socket.on('currentTopic', (data) => {
    $('#topic').html(data);
  });

  const chatText = $('#chat-text');
  const chatInput = $('#chat-input');
  const chatForm = $('#chat-form');

  let typing = false;
  chatInput.focus();

  // add a chat cell to our chat list view, and scroll to the bottom
  socket.on('addToChat', (data) => {
    console.log('got a chat message');
    chatText.append(`<div class='chat-cell'>${data}</div>`);
    $('html, body').scrollTop($(document).height());
  });

  chatForm.submit((e) => {
    // prevent the form from refreshing the page
    e.preventDefault();
    // call sendMsgToServer socket function, with form text value as argument
    socket.emit('sendMsgToServer', `<span class='username'>${username}</span><span class='msg'>${sanitize(chatInput.val())}</span><span class='right'></span>`);
    chatInput.val('');
  });

    $(document).on('DOMContentLoaded', () => {
    chatInput.on('focus', () => {
      typing = true;
    });
    chatInput.on('blur', () => {
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
