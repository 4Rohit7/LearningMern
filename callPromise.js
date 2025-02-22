import fs from 'fs';
import superagent from 'superagent';
import path from 'path';

//Unique Filename
const getUniqueFileName = (dir, baseName, ext) => {
  let count = 1;
  let fileName = `${baseName}.${ext}`;
  while (fs.existsSync(path.resolve(dir, fileName))) {
    fileName = `${baseName}${count}.${ext}`;
    count++;
  }
  return fileName;
};

fs.readFile(path.resolve('dog.txt'), 'utf-8', (err, data) => {
  if (err) {
    console.error('Check the file name', err);
  } else {
    console.log(`Breed: ${data}`);
  }

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      let bady = '';
      if (err) {
        console.error(err.message);
      } else {
        bady = res.body.message;
        console.log(`Dog Image URL: ${bady}`);

        superagent
          .get(bady)
          .responseType('arraybuffer')
          .end((err, badyRes) => {
            if (err) {
              console.error('Error downloading image', err.message);
            } else {
              const dir = path.resolve('photos');
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
              //   const filePath = path.resolve(dir, 'dog-image.jpg');
              const fileName = getUniqueFileName(dir, 'dog-image', 'jpg');
              const filePath = path.resolve(dir, fileName);
              fs.writeFile(filePath, badyRes.body, (err) => {
                if (err) {
                  console.error('Error saving image', err.message);
                } else {
                  console.log('Random Dog image saved to file!');
                }
              });
            }
          });
      }
      fs.writeFile('dog-ima.txt', bady, (err, data) => {
        //Data is not necessary
        if (err) {
          console.error(err.message);
        } else {
          console.log('Random Dog image saved to file!');
        }
      });
    });
});

/*
fs.readFile(path.resolve('dog.txt'), 'utf-8', (err, data) => {
  if (err) {
    console.error('Check the file name', err);
  } else {
    console.log(`Breed: ${data}`);
    superagent
      .get(`https://dog.ceo/api/breed/${data}/images/random`)
      .end((err, res) => {
        if (err) {
          console.error(err.message);
        } else {
          const bady = res.body.message;
          console.log(bady);
          fs.writeFile('dog-ima.txt', bady, (err, data) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log('Random Dog image saved to file!');
            }
          });
        }
      });
  }
});
*/
