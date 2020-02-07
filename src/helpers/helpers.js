import {
  DEFAULT_URLID,
  DEFAULT_PREFIX,
} from './configs';


export const getConfig = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlid = urlParams.get('id') || DEFAULT_URLID;
  const prefix = urlParams.get('prefix') || DEFAULT_PREFIX;
  return { urlid, prefix };
}

export const debounce = (func, wait, immediate) => {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
	    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};


export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
