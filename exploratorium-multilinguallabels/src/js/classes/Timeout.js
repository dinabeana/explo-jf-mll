// input:
//  events: array of DOM events that will reset the timeout https://developer.mozilla.org/en-US/docs/Web/Events
//  timeout: ms until timeout
//  timeoutFunction: function called at end of timeout, for example () => {window.location.reload(true);}

class Timeout {
  constructor(events, timeout, timeoutFunction) {
    this.events = events;
    this.timeout = timeout;
    this.timeoutFunction = timeoutFunction;

    this.events.forEach(event => {
      document.body.addEventListener(event, e => {
        this.resetInactivityTimeout();
      });
    });
  }

  inactivityTimeout() {
    this.resetInactivityTimeout();
    this.timeoutFunction();
  }

  resetInactivityTimeout() {
    window.clearTimeout(this.setInactivityTimeoutID);
    this.setInactivityTimeoutID = window.setTimeout(() => { this.inactivityTimeout(); }, this.timeout);
  }
}

export default Timeout
