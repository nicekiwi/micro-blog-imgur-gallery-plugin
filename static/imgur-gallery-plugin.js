(function () {
  const pluginOptions = window.imgurGalleryPlugin;

  if (!pluginOptions) {
    return;
  }

  const imgurAlbumRequest = (albumId) => {
    return new Promise((resolve, reject) => {

      let request = new XMLHttpRequest();
      request.open('GET', pluginOptions.api.url + albumId, true);
      request.setRequestHeader('Authorization', `Client-ID ${pluginOptions.api.clientId}`);
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

  const createPhoto = (title, imageId) => {
    return `
      <div class=thumbnail>
        <a href="https://i.imgur.com/${imageId}h.jpg" target="_blank" data-caption="${title}">
          <img src="https://i.imgur.com/${imageId}b.jpg" alt="${title}" />
        </a>
      </div>
    `;
  };

  const hideMatureContent = (thumbnailBox, gallery) => {
    // set the NSFW message
    let message = gallery.getAttribute('data-nsfw-message') || 'Gallery images have been hidden';
    let link = gallery.getAttribute('data-nsfw-link') || 'Click here to reveal images';

    // setup NSFW banner with option for custom message
    gallery.insertAdjacentHTML('beforeend', `
      <div class=nsfw-message>
        <p>${message}<br><small><b>${link}</b></small></p>
      </div>
    `);

    // Hide the images
    thumbnailBox.style.display = 'none';

    // grab the message box
    let nsfwMessage = gallery.querySelector('.nsfw-message');

    // listen for event to show images
    nsfwMessage.addEventListener('click', event => {

      // hide NSFW message
      nsfwMessage.style.display = 'none';

      // show images
      thumbnailBox.style.display = '';
    });
  }

  const buildGallery = (gallery, index, response) => {
    const albumData = response.data;
    let thumbnailBox = document.createElement('div');
    thumbnailBox.className = `thumbnail-box thumbnail-box-${index}`;

    // Remove loading message
    gallery.querySelector('.loading-message').remove();

     // Setup the Title / Desc
    if(gallery.getAttribute('data-title')) {
      let titleBox = document.createElement('div');
      titleBox.className = 'title-box';

      titleBox.insertAdjacentHTML('beforeend', `
        <div class=title>
          <b>${gallery.getAttribute('data-title-text') || albumData.title || 'Photo Gallery'}</b>
          <span class="count">(${albumData.images_count})</span>
        </div>
      `);

      gallery.appendChild(titleBox);
    }

    // if empty, stop here
    if (!albumData.images.length) {
      return;
    }
    
    // add album thumbnails to container
    albumData.images.forEach((image, k) => {
      thumbnailBox.insertAdjacentHTML('beforeend', 
        createPhoto((image.description || `${albumData.title} (${k})`), image.id)
      );
    });
  
    // Setup NSFW overlay
    if(gallery.getAttribute('data-nsfw')) {
      hideMatureContent(thumbnailBox, gallery);
    }

    // insert thumbnail box
    gallery.appendChild(thumbnailBox);

    // init lightbox
    if (!pluginOptions.customLightbox) {
      baguetteBox.run(`.thumbnail-box-${index}`);
    }
  }

  // inset galleries
  const insertGalleries = () => {
    // get all gallery elements on the page
    const galleries = document.querySelectorAll('.imgur-gallery');

    // loop over each album
    galleries.forEach((gallery, index) => {

      // get the album src and ID
      const albumId = gallery.getAttribute('data-id');

      // add loading message
      gallery.innerHTML = `<div class="loading-message">${gallery.getAttribute('data-loading-message') || "Loading..."}</div>`;

      imgurAlbumRequest(albumId)
        .then(response => buildGallery(gallery, index, response))
        .catch(error => {
        // Hide album if unable to get data
        gallery.style.display = 'none';
        // log the error
        console.error(error);
      });
    });
  };

  const ready = fn => {
    if (document.readyState != 'loading'){
      setTimeout(fn, 10);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // wait for DOM to be loaded before running
  ready(insertGalleries);
}) ();
