import {
  DEFAULT_PRODUCT,
  PRODUCT_QS_NAME,
  COLLECTION_QS_NAME,
} from './configs';

export const isLocal = () => window.location.href.includes('localhost');

const getProductName = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(PRODUCT_QS_NAME) || DEFAULT_PRODUCT;
}

const getCollectionName = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(COLLECTION_QS_NAME);
}

export const navigateToProductPage = (search) => {
  if (isLocal()) return;
  const { origin } = window.location;
  const productName = getProductName();
  const collectionName = getCollectionName();
  const collectionPath = collectionName ? `/collections/${collectionName}` : '';
  const url = `${origin}${collectionPath}/products/${productName}?${search}`
  window.location.assign(url);
}
export const getModelPath = () => {
  const productName = getProductName();
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
