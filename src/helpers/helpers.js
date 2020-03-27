import { DEFAULT_PRODUCT } from './configs';

export const isLocal = () => window.location.href.includes('localhost');

export const getModelPath = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product') || DEFAULT_PRODUCT;
  const folderName = isLocal() ? 'cbfowler4' : 'uncut-pipes';
  return `https://${folderName}.s3.amazonaws.com/pipes/${productName}.glb`;
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
