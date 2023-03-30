function fetchRottenTomatoesRating(id) {
  chrome.storage.local.get('apiToken', function (data) {
    var token = data.apiToken;
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${token}`
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        for (var i = 0; i < data.Ratings.length; i++) {
          displayRating(data.Title, data.Ratings[i]);
        }
      });
  });
}

function titleToSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '_') // Replace whitespace with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with a single underscore
    .replace(/^_+/, '') // Remove underscores from the beginning of the string
    .replace(/_+$/, ''); // Remove underscores from the end of the string
}

function displayRating(title, rating) {
  if (rating.Source == "Internet Movie Database") {
    return;
  }

  const copyFrom = document.querySelector('[data-testid="hero-rating-bar__popularity"]');
  const ratingContainer = copyFrom.parentElement;

  var tomatoesItem = copyFrom.cloneNode(true);
  tomatoesItem.firstChild.innerText = rating.Source.toUpperCase();
  tomatoesItem.querySelector('a').target = "_blank";
  tomatoesItem.querySelector('a').href = getUrl(title, rating);
  tomatoesItem.querySelector('[data-testid="hero-rating-bar__popularity__score"]').innerText = rating.Value;
  tomatoesItem.querySelector('[data-testid="hero-rating-bar__popularity__delta"]').remove();

  var svgElement = tomatoesItem.querySelector('svg');
  var newIconElement = createIcon(rating);
  svgElement.parentNode.appendChild(newIconElement);
  svgElement.remove();

  ratingContainer.appendChild(tomatoesItem);
}

function getUrl(title, rating) {
  var id = titleToSlug(title);
  switch (rating.Source) {
    case "Rotten Tomatoes":
      return `https://www.rottentomatoes.com/m/${id}`;
    case "Metacritic":
      id = id.replace(/_/g, '-');
      return `https://www.metacritic.com/movie/${id}`;
    default:
      return "#";
  }
}

function createIcon(rating) {
  var iconElement = document.createElement('span');
  iconElement.style.width = "24px";
  iconElement.style.height = "24px";
  switch (rating.Source) {
    case "Rotten Tomatoes":
      iconElement.style.background = 'top left / contain no-repeat url("https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/certified_fresh-notext.56a89734a59.svg")';
      return iconElement;
    case "Metacritic":
      var score = rating.Value.split('/')[0];
      if (score >= 60) {
        iconElement.style.backgroundColor = '#6c3';
      } else if (score >= 40) {
        iconElement.style.backgroundColor = '#fc3';
      } else {
        iconElement.style.backgroundColor = '#f00';
      }
      return iconElement;
    default:
      return iconElement;
  }
}

function getTomatoUrl(title) {
  const tomatoId = titleToSlug(title);
  return `https://www.rottentomatoes.com/m/${tomatoId}`;
}

(async () => {
  const id = window.location.href.match(/(tt\d{5,})/)[1];
  fetchRottenTomatoesRating(id);
})();
