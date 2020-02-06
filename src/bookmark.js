import store from './store';
import api from './api';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

/*
~~~~~~~~~~~~~~~~~~~GENERATORS~~~~~~~~~~~~~~~~~~~~~~
  The following 3 functions generate html that is populated
  with data from the store.
*/
const generateNewBookmarkForm = function() {
  return `
      <form id="form-new-bookmark">
        <h2>New Bookmark</h2>
        <div class="input-label">
            <label for="bookmark-title" class="bookmark-title">Bookmark Title</label>
            </br>
            <input type="text" id="bookmark-title" name="title" placeholder="Enter title" class="form-input" required>
        </div>
        <div class="input-label">
            <label for="bookmark-url">URL</label>
            </br>
            <input type="url" id="bookmark-url" name="url" value="http://www." class="form-input" required>
        </div>
       <div class="input-label">
            <label for="bookmark-description">Description</label>
            </br>
            <textarea rows="2" cols="30" id="bookmark-description" name="description" placeholder="Enter bookmark description" class="form-input-description" required></textarea>
        </div>
        <div class="input-label">
            <label for="bookmark-rating">Please rate (1 to 5 stars):</label>
            </br>
            <select id="bookmark-rating" class="rating">
              <option value="1">★☆☆☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="3">★★★☆☆</option>
              <option value="4">★★★★☆</option>
              <option value="5">★★★★★</option>
            </select>
        </div>
        <div class="form-buttons">
            <button type="submit" name="create-bookmark" class="create-bookmark-button form-button">ADD</button>
            <button type="button" name="cancel-bookmark" class="cancel-bookmark-button form-button">CANCEL</button>
        </div>
      </form>`;
};

const generateBookmarkElement = function(bookmark) {
  const starRating =
    bookmark.rating === 1
      ? '★☆☆☆☆'
      : bookmark.rating === 2
      ? '★★☆☆☆'
      : bookmark.rating === 3
      ? '★★★☆☆'
      : bookmark.rating === 4
      ? '★★★★☆'
      : '★★★★★';
  if (bookmark.expanded) {
    return `
      <li data-item-id="${bookmark.id}" class="bookmark-item expanded">
        <h2 class="bookmark-name">${bookmark.title}</h2>
        <p class="description">${bookmark.desc}</p>
        <h3 class="rating">Rating: ${starRating}</h3>
        <div class="visit-site">
          <a href="${bookmark.url}">Visit Site</a>
        </div>
        <div class="bookmark-controls">
          <button class="collapse-button" type="button">Collapse</button>
          <button class="delete-button" type="button">Delete</button>
        </div>
      </li>`;
  } else {
    return `
      <li data-item-id="${bookmark.id}" class="bookmark-item">
        <h2 class="bookmark-name">${bookmark.title}</h2>
        <h3 class="rating">${starRating}</h3>
        <div class="bookmark-controls">
          <button class="expand-button" type="button">Expand</button>
          <button class="delete-button" type="button">Delete</button>
        </div>
      </li>`;
  }
};

const generateBookmarkString = function(bookmarkList) {
  return bookmarkList
    .map(bookmark => generateBookmarkElement(bookmark))
    .join('');
};

/*~~~~~~~~~~~~~~~~~~END GENERATORS~~~~~~~~~~~~~~~~ */

/*~~~~~~~~~~~~~~~~~~~RENDERER~~~~~~~~~~~~~~~~~~~~~ 
  The following function renders the view with data provided by the store. 
*/

const render = function() {
  if (store.creatingBookmark === true) {
    $('.add-form').html(generateNewBookmarkForm());
  } else {
    $('.add-form').html(`
        <div class="add">
          <button type="button" class="add-button">Add Bookmark</button>    
        </div>`);
    $('.filter-container').html(
      `<select name = "filter" id = "filter-rating" >
        <option value="0">Filter rating: </option>
        <option value="1">★☆☆☆☆</option>
        <option value="2">★★☆☆☆</option>
        <option value="3">★★★☆☆</option>
        <option value="4">★★★★☆</option>      
        <option value="5">★★★★★</option>
        </select >`
    );
  }

  if (store.error.message === true) {
    $('.error').append(store.error.message);
  } else {
    $('.error').empty();
  }

  let bookmarks = [...store.bookmarks];
  let filteredBookmarks = bookmarks.filter(
    bookmark => bookmark.rating >= store.filterRating
  );

  let htmlString = generateBookmarkString(filteredBookmarks);
  $('.list-bookmarks').html(htmlString);
};

/*~~~~~~~~~~~~~~~~~~~~HANDLERS~~~~~~~~~~~~~~~~~~~~ 


    The following functions handle various events passing incoming data to the api which in turn makes changes to the store and finally the view is rendered with the updated data. 

*/
const getBookmarkIdFromElement = function(bookmark) {
  return $(bookmark)
    .closest('li')
    .data('item-id');
};
const handleDeleteBookmark = function() {
  $('.list-bookmarks').on('click', '.delete-button', function(event) {
    // console.log('Am I deleting?');
    const id = getBookmarkIdFromElement(event.currentTarget);
    api.deleteBookmark(id).then(() => {
      store.findAndDelete(id);
      render();
    });
  });
};

const handleAddBookmarkForm = function() {
  $('.add-form').on('submit', '#form-new-bookmark', function(event) {
    event.preventDefault();
    const title = $('#bookmark-title').val();
    const url = $('#bookmark-url').val();
    const desc = $('#bookmark-description').val();
    const rating = $('#bookmark-rating').val();
    api
      .createBookmark(title, url, desc, rating)
      .then(newBookmark => {
        store.addItem(newBookmark);
        store.creatingBookmark = false;
        store.error.message = null;
        console.log(newBookmark);

        render();
      })
      .catch(err => {
        store.addErrorToStore(err.message);
        render();
      });
  });
};

const handleAddBookmark = function() {
  $('.add-form').on('click', '.add-button', function(event) {
    event.preventDefault();
    // console.log(store.creatingBookmark);
    store.creatingBookmark = true;
    $('.add-button').addClass('hidden');
    render();
  });
};

const handleCancelAddBookmark = function() {
  $('.add-form').on('click', '.cancel-bookmark-button', function(event) {
    event.preventDefault();
    store.creatingBookmark = false;
    render();
  });
};

const handleFilterButton = function() {
  $('.filter-container').on('change', '#filter-rating', function(event) {
    event.preventDefault();
    const ratingValue = $(event.currentTarget).val();

    store.filterRating = ratingValue;
    render();
  });
};
const handleExpandButton = function() {
  $('.list-bookmarks').on('click', '.expand-button', function(event) {
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    bookmark.expanded = true;
    render();
  });
};

const handleCollapseButton = function() {
  $('.list-bookmarks').on('click', '.collapse-button', function(event) {
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    bookmark.expanded = false;

    render();
  });
};

const bindEventListeners = function() {
  handleAddBookmark();
  handleAddBookmarkForm();
  handleCancelAddBookmark();
  handleDeleteBookmark();
  handleExpandButton();
  handleCollapseButton();
  handleFilterButton();
};

export default {
  bindEventListeners,
  render
};
