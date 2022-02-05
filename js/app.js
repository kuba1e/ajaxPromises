"use strict";
document.addEventListener("DOMContentLoaded", (event) => {
  const idForm = document.querySelector(".id-form");
  const idInput = idForm.elements[0];
  const postContainer = document.querySelector(".post-container");
  const preloaderElement = document.querySelector(
    ".loadingio-spinner-magnify-ikfs0l4ucrk"
  );
  const postBaseUrl = "https://jsonplaceholder.typicode.com/posts/";

  idForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const postId = idInput.value.trim();
    if (doValidation(postId)) {
      addValidStyle(idInput);
      showPreloader(preloaderElement);
      fetchPost(postBaseUrl, postId).catch((error) => {
        hidePreloader(preloaderElement);
        M.toast({
          html: `Ooops, something went wrong. Error: ${error.message}`,
        });
      });
    } else {
      addInvalidStyle(idInput);
    }
  });

  const fetchPost = (baseUrl, id) => {
    return fetch(baseUrl + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((post) => {
        return fetchComments(baseUrl, id, post);
      })
      .then((postMarkUp) => {
        hidePreloader(preloaderElement);
        postContainer.innerHTML=''
        postContainer.insertAdjacentHTML("afterbegin", `${postMarkUp}`);
        M.AutoInit();
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const fetchComments = (postBaseUrl, postId, post) => {
    return fetch(`${postBaseUrl + postId}/comments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((comments) => {
        return new Promise((resolve, reject) => {
          resolve(getPostMarkup(post, comments));
        });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const getPostMarkup = (post, comments) => {
    const { id, title, body } = post;
    return `
    <div class="card" data-id="${id}">
    <div class="card-content">
        <h3>${title}</h3>
      <p>${body}</p>
    </div>
    <div class="card-tabs">
      <ul class="tabs tabs-fixed-width">
      ${getCommentsNavMarkup(comments)}
      </ul>
    </div>
    <div class="card-content grey lighten-4">
      ${getCommentsMarkup(comments)}
    </div>
  </div>
    `;
  };

  const getCommentsMarkup = (commentsArray) => {
    return commentsArray.reduce((acc, element) => {
      const { id, name, email, body } = element;
      acc += `
      <div id="test${id}">
      <div class="col s12 m7" data-id="${id}">
      <h5 class="header">${name}</h5>
      <div class="card horizontal">
        <div class="card-stacked">
          <div class="card-content">
            <p>${body}</p>
          </div>
          <div class="card-action">
            <p>${email}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
      `;
      return acc;
    }, "");
  };

  const getCommentsNavMarkup = (commentsArray) => {
    return commentsArray.reduce((acc, element) => {
      const { id, name } = element;
      acc += `
      <li class="tab"><a href="#test${id}">${getShortTitle(name)}</a></li>
      `;
      return acc;
    }, "");
  };

  const getShortTitle = (title) => {
    const regExp = /^[a-zA-Z]+\s[a-zA-Z]+\s/;
    return `${title.match(regExp)}...`;
  };

  const doValidation = (inputValue) => {
    const regExp = /^[1-9][0-9]{0,2}$/;
    return regExp.test(inputValue) && +inputValue <= 100;
  };

  const addValidStyle = (input) => {
    removeInvalidStyle(input);
    input.classList.add("valid");
  };

  const addInvalidStyle = (input) => {
    removeValidStyle(input);
    input.classList.add("invalid");
  };

  const removeValidStyle = (input) => {
    if (input.classList.contains("valid")) {
      input.classList.remove("valid");
    }
  };

  const removeInvalidStyle = (input) => {
    if (input.classList.contains("invalid")) {
      input.classList.remove("invalid");
    }
  };

  const showPreloader = (preloaderElement) => {
    preloaderElement.classList.add("active");
  };

  const hidePreloader = (preloaderElement) => {
    preloaderElement.classList.remove("active");
  };
});
