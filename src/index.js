import bookmark from './bookmark';
import api from './api';
import store from './store';
import './index.css';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

const main = function() {
  bookmark.bindEventListeners();
  bookmark.render();
  console.log('Renderer ran');

  api
    .getBookmarks()
    .then(items => {
      items.forEach(bookmark => store.addItem(bookmark));
      bookmark.render();
    })
    .catch(error => console.log(error.message));
};

$(main);
