import fs from 'fs';
import path from 'path';
import { buffer } from 'stream/consumers';
import superagent from 'superagent';

//Promise Wrapper for fs.readFile

function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Promise wrapper for fs.writeFile
function writeFilePromise(filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'binary', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//Using the Promise wrappers
readFilePromise(path.resolve('dog.txt'))
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    const imageUrl = res.body.message;
    console.log(imageUrl);
    return superagent.get(imageUrl).responseType('arraybuffer');
  })
  .then((imageRes) => {
    const dir = path.resolve('photos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const filePath = path.resolve(dir, 'dog-image.jpg');
    return writeFilePromise(filePath, Buffer.from(imageRes.body));
  })
  .then(() => {
    console.log('Random Dog image saved to file!');
  })
  .catch((err) => {
    console.error('Error', err.message);
  });
