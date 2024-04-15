const express = require('express');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const videoRouter = express.Router();

// function for reading data in videos.json
const readFile = () => {
  const videosData = fs.readFileSync('./data/videos.json');
  return JSON.parse(videosData);
};

// function for writing data in videos.json
const writeFile = (videosData) => {
  fs.writeFileSync('./data/videos.json', JSON.stringify(videosData, null, 2));
};

// get request for videoList (short version)
videoRouter.get('/', (_req, res) => {
  let videosData = readFile();
  videosData = videosData.map((video) => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    };
  });
  res.status(200).send(videosData);
});

// get request with videoId for videoDetails
videoRouter.get('/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  let videosData = readFile();
  const video = videosData.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).send('Video not found');
  }
  return res.status(200).json(video);
});

// post request for adding comments
videoRouter.post('/:videoId/comments', (req, res) => {
  const { comment } = req.body;
  let videoId = req.params.videoId;
  const videosData = readFile();
  let selectedVideo = videosData.find((video) => video.id === videoId);

  const newComment = {
    name: 'Kate Polyakov',
    comment: comment,
    id: uuid(),
    timestamp: Date.now(),
  };

  selectedVideo.comments.unshift(newComment);
  writeFile(videosData);
  return res.status(200).send(videosData);
});

// post request for upload form
videoRouter.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send('Please add Title and Description');
  }

  const uploadVideo = {
    id: uuid(),
    title: title,
    channel: 'Sahar Khyabani',
    image: 'http://localhost:8080/images/image9.jpg',
    description: description,
    views: 45,
    likes: 38,
    duration: '03:06',
    timestamp: Date.now(),
    comments: [
      {
        name: 'Hannah Jenkins',
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere diam nec justo suscipit suscipit. Nam non ornare dolor. Curabitur hendrerit euismod nisi, in eleifend velit blandit sed. Sed vulputate dolor dolor, id molestie dolor accumsan vel. Vestibulum magna elit, semper vel sagittis in, ullamcorper venenatis tellus.',
        likes: 0,
        timestamp: Date.now(),
      },
    ],
  };

  const videosData = readFile();
  videosData.unshift(uploadVideo);
  writeFile(videosData);

  return res.status(201).json(uploadVideo);
});

module.exports = videoRouter;
