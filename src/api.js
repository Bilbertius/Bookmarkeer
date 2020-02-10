const BASE_URL = 'https://thinkful-list-api.herokuapp.com/bilbertius';

//Error handling

const apiFetcher = function (...args) {
  let error;
  return fetch(...args)
    .then(response => {
      if (!response.ok) {
        error = { code: response.status };
      }
      return response.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

const getBookmarks = function () {
  return apiFetcher(`${BASE_URL}/bookmarks`);
};

const createBookmark = function (title, url, desc, rating) {
  let newBookmark = JSON.stringify({
    title: title,
    url: url,
    desc: desc,
    rating: rating
  });
  return apiFetcher(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
};

const deleteBookmark = function (id) {
  return apiFetcher(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark
};
