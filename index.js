const STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const ITEMS_URL = 'https://hacker-news.firebaseio.com/v0/item/';
const main = document.getElementById("main");

const getStoryIds = async () => {
  const response = await fetch(STORIES_URL);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const result = await response.json();
  return result;
};

const getTopStories = async (ids) => {
  const itemsResponse = await Promise.all(
    ids.map((id) => fetch(ITEMS_URL + id + '.json'))
  );
  const stories = await Promise.all(itemsResponse.map((story) => story.json()));

  return stories;
};

const limiter = 20;
const createStoryCard = ({title, by, url}) => {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const site = document.createElement('a');
    const author = document.createElement('p');
    h2.textContent = title;
    author.textContent = 'By: ' + by;
    site.textContent = url;
    site.setAttribute('href', url)
    div.appendChild(h2);
    div.appendChild(author);
    div.appendChild(site);
    return div;
}

(async () => {
  const ids = await getStoryIds();
  const stories = await getTopStories(ids.slice(0, limiter));
    const topStories = stories.map((story) => {
    ({ title, by, url } = story);
    return { title, by, url};
    });
    
    topStories.forEach(story => {
        main.appendChild(createStoryCard(story))
    })
})();
