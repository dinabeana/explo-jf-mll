// npm-installed polyfills
import fetch from 'isomorphic-fetch';
import es6Promise from 'es6-promise';

es6Promise.polyfill();

/*
 * This function tests if a given url works or not
 * by executing a fetch. If the fetch works, it will
 * enter the then and will return true.
 * If the fetch does not work (network error, 404, ...)
 * it will enter the catch and will return false.
 */
const testURL = (url, timeout) => {
/*
 * Timeout is not part of the fetch specification
 * so this calls resolve(false) after a timeout of x-milliseconds.
 * This way, we're not waiting forever if the browser hangs.
 */
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(() => resolve(true))
    .catch(() => resolve(false));
    setTimeout(() => resolve(false), timeout);
  });
};

export default testURL;
