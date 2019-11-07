const LazyLoadRetry = (fn, retriesLeft = 5, interval = 1000) => new Promise((resolve, reject) => {
  fn()
    .then(resolve)
    .catch((error) => {
      setTimeout(() => {
        if (retriesLeft === 1) {
          reject(error); // reject('maximum retries exceeded');
          return;
        }
        console.log('retry', retriesLeft);
        LazyLoadRetry(fn, retriesLeft - 1, interval).then(resolve, reject);
      }, interval);
    });
});

export default LazyLoadRetry;
