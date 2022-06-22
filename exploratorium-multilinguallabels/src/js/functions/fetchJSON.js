// npm-installed polyfills for non-ES2015 browsers
import fetch from 'isomorphic-fetch';
import es6Promise from 'es6-promise';

es6Promise.polyfill();

const fetchJSON = url => fetch(url)
  .then(data => data.json());

export default fetchJSON;
