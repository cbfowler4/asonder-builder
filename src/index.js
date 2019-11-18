import './loader.css';
import './configurator.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
// import './configurator';
import { App } from './app';

const ReactDOM = window.ReactDOM;
const React = window.React;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
