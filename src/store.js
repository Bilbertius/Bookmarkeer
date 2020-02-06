const bookmarks = [];

const addItem = function(bookmark) {
  bookmark.expanded = false;
  this.bookmarks.push(bookmark);
};

const findById = function(id) {
  this.bookmarks.find(bookmark => bookmark.id === id);
};

const findAndDelete = function(id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
};

const error = {
  message: null
};

const addErrorToStore = function(errorMessage) {
  error.message = errorMessage;
  console.log(error.message);
};

export default {
  bookmarks: [...bookmarks],
  creatingBookmark: false,
  filterRating: 0,
  error,
  addItem,
  findById,
  findAndDelete,
  addErrorToStore
};
