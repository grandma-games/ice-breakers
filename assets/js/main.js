$(document).ready(() => {
  const socket = io();

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
    chatText.scrollTop(chatText[0].scrollHeight);
  });

  chatForm.submit((e) => {
    // prevent the form from refreshing the page
    e.preventDefault();

    // call sendMsgToServer socket function, with form text value as argument
    socket.emit('sendMsgToServer', $('#chat-input').val());
    $('#chat-input').val('');
  });

  // $(document).load(() => {
  $(document).on('DOMContentLoaded', () => {
    $('#chat-input').on('focus', () => {
      typing = true;
    });
    $('#chat-input').on('blur', () => {
      typing = false;
    });
  });

  // document.onkeyup = (event) => {
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
