(function () {
  const imgurRequest = (albumId) => {
    return new Promise((resolve, reject) => {

      let request = new XMLHttpRequest();
      request.open('GET', window.imgurPlugin.api.url + albumId, true);
      request.setRequestHeader('Authorization', `Client-ID ${window.imgurPlugin.api.clientId}`);
      request.onload = () => {

        try {
          resolve(
            JSON.parse(request.responseText)
          );
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = reject;
      request.send();
    })
  };

  const insertPhoto = (itemBox, title, imageId) => {
    itemBox.insertAdjacentHTML('beforeend', `
      <div class=item>
        <a href="https://i.imgur.com/${image.id}h.jpg" target="_blank" data-caption="${title}">
          <img src="https://i.imgur.com/${image.id}b.jpg" alt="${title}" />
        </a>
      </div>
    `);
  };

  const hideMatureContent = (itemBox, album) => {
    // set the NSFW message
    let message = album.getAttribute('data-nsfw-message') || 'Mature Content has been hidden.';
    let link = album.getAttribute('data-nsfw-link') || 'Unhide Content';

    // setup NSFW banner with option for custom message
    album.insertAdjacentHTML('beforeend', `
      <div class=nsfw-message>
        <p>${message}.<br><small><b>${link}</b></small></p>
      </div>
    `);

    // Hide the images
    itemBox.style.display = 'none';

    // grab the message box
    let nsfwMessage = album.querySelector('.nsfw-message');

    // listen for event to show images
    nsfwMessage.addEventListener('click', event => {

      // hide NSFW message
      nsfwMessage.style.display = 'none';

      // show images
      itemBox.style.display = '';
    });
  }

  const buildAlbum = (response) => {
    let albumData = response.data;

    // Setup the Title / Desc
    if(album.getAttribute('data-title') !== false) {
      album.insertAdjacentHTML('beforeend', `
        <h2 class=title>
          ${albumData.title}
          <small>(${albumData.images_count})</small>
        </h2>
      `);

      if(albumData.description) {
        album.insertAdjacentHTML('beforeend', `
          <p class=description>${albumData.description}</p>
        `);
      }
    }

    // create album thumb container
    const itemBox = document.createElement('div').className = `imgur-item-box imgur-gallery-${i}`;
    
    // add album thumbnails to container
    Array.prototype.forEach.call(albumData.images, (image, k) => {
      insertPhoto(itemBox, (image.description || `${albumData.title} (${k})`), image.id);
    });
  
    // Setup NSFW overlay
    if(album.getAttribute('data-nsfw')) {
      hideMatureContent(itemBox, album);
    }

    // add thumbnails to album
    album.appendChild(itemBox);
  }

  // setup the photo albums
  const setupAlbums = (imgurPlugin) => {
    // get all album on the page
    let albums = document.querySelectorAll('.imgur-album');

    // loop over each album
    Array.prototype.forEach.call(albums, (album, i) => {

      // get the album src and ID
      let albumID = album.getAttribute('data-id');

      // build album thumbnails
      imgurRequest(albumID).then(buildAlbum).catch(err => {
        // Hide album if unable to get data
        album.style.display = 'none';
        // log the error
        console.debug(err);
      });
    });
  };

  // Setup Photo Captions
  const setupCaptions = () => {
    const images = document.querySelectorAll('.imgur-album img.imgur-photo');

    // loop over all photos
    Array.prototype.forEach.call(images, (image, i) => {

      // check for a caption
      let caption = image.getAttribute('alt');

      if(caption) {
        // add caption if present
        image.insertAdjacentHTML('afterend', `<div class="imgur-photo-caption">${caption}</div>`);
      }
    });
  };

  const ready = fn => {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // wait for DOM to be loaded before running
  ready(() => {
    const imgurPlugin = window.imgurPlugin;

    if (!imgurPlugin) {
      return;
    }

    setupAlbums(imgurPlugin);
    setupCaptions(imgurPlugin);

    // init the lightbox(s)
    if (!imgurPlugin.customLightbox) {
      const albums = document.body.querySelectorAll('.imgur-item-box');
      Array.prototype.forEach.call(albums, (album, i) => {
        baguetteBox.run(`.imgur-gallery-${i}`);
      })
    }
  });

}) ();
