export const delay = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
