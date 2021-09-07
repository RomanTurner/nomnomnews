const STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const ITEMS_URL = 'https://hacker-news.firebaseio.com/v0/item/';
const main = document.getElementById('main');

class App {
  constructor() {
    this.state = {
      storyIds: [],
      topStories: [],
    };
  }

  setState = async (nextState) => {
    this.state = { ...this.state, ...nextState };
    console.log(this.state);
  };
    
  getStoryIds = async () => {
    try {
      const res = await fetch(STORIES_URL);
      if (res.ok) {
        const data = await res.json();
        const result = data.slice(0, 20);
        console.log(result);
        return result;
      } else {
        console.error('status: ', res.status);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  getTopStories = async () => {
    try {
      const ids = await this.getStoryIds();
      const res = await Promise.all(
        ids.map((id) => fetch(ITEMS_URL + id + '.json'))
      );
      const results = await Promise.all(res.map((story) => story.json()));
      results.forEach((story) => {
        main.appendChild(this.createStoryCard(story));
      });
    } catch (error) {
      console.error('error: ', error);
    }
  };
    
  createStoryCard = ({ title, by, url }) => {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const site = document.createElement('a');
    const author = document.createElement('p');
    h2.textContent = title;
    author.textContent = 'By: ' + by;
    site.textContent = url;
    site.setAttribute('href', url);
    div.appendChild(h2);
    div.appendChild(author);
    div.appendChild(site);
    return div;
  };
}

const frontPage = new App();

frontPage.getTopStories();
