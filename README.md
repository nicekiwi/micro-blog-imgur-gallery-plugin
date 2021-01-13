# Imgur Gallery Plugin

Built as a plugin for micro.blog blogs.

Pulls in albums from Imgur on the fly via it's API and displays them as thumbnails with a lighbox popup. 

## Features

- Thumbnail gallery
- Simple lightbox
- Caption support
- Option to hide/unhide NFSW content
- Supports custom lightbox
- Supports custom CSS

### Requires a Imgur API Client ID
Add your Imgur App Client ID into the plugin settings (not the secret).

https://api.imgur.com/oauth2/addclient

## Usage

Include the following snippet in a post.  
```
<div class="imgur-gallery" data-id="abcde"></div>
```

### Required Attributes

```
class="imgur-gallery" // The identifier for the script to pickup.
---
data-id="ALBUM_ID" // The ID of the Imgur Album you want to display.
```

### Optional Attributes

```
data-title="true" // Weather or not to display a title above the thumbnails. The Title will be either the contents of the data-title-text attribute, the Imgur ALbum title, or the words "Photo Gallery". The number in the gallery is included after the title. E.g. "Photo Gallery (18)"
---
data-title-text="My Holiday Photos" // A custom Title for the gallery, data-title should be set to true.
---
data-nsfw="true" // Will initially hide the gallery thumbnails and display a message explaining the photos have been hidden and offer a link to reveal them.
---
data-nsfw-message="NFSW Content is hidden." // Specify a custom NSFW message
---
data-nsfw-link="Click here to reveal content" // Specify custom link text to reveal the photos
```

Enjoy! :)