const { User, FriendRequest } = require('../../models/');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('express').Router();

const app = express();
app.use(bodyParser.json());

app.post('/friend-requests', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const sender = await User.findOne({ where: { id: senderId } });
    const receiver = await User.findOne({ where: { id: receiverId } });
    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentRequest = await FriendRequest.findOne({ 
      where: { senderId, receiverId } 
    });

    if (currentRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }
    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: 'pending'
    });

    res.json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/friend-requests/:id/accept', async (req, res) => {
  const id = req.params.id;
  try {
    const friendRequest = await FriendRequest.findOne({ where: { id } });
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    friendRequest.status = 'accepted';
    await friendRequest.save();
    const sender = await User.findOne({ where: { id: friendRequest.senderId } });
    const receiver = await User.findOne({ where: { id: friendRequest.receiverId } });
    sender.friends.push(receiver.id);
    receiver.friends.push(sender.id);
    await sender.save();
    await receiver.save();

    res.json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/friend-requests/:id/accept', async (req, res) => {  
    try {
      let data = await Post.findByPk(req.params.id, {});
      if (!data) {
        res.status(404).json({ message: `There is no request with this iD` });
        return;
      }
      data = await Post.destroy({
        where: {
          id: req.params.id,
        },});
      const comment = await Comment.destroy({
        where: {
          post_id: req.params.id,
        },});
      if (data)
        res.status(200).json(`The following request has been removed`);
      else
        res.status(200).json(`Request was unable to be removed.`);
    } catch (err) {
      console.log(err);
  
      res.status(500).json(err);
    }
  });

  app.delete('/friend-requests/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const request = await FriendRequest.findOne({ where: { id } });
  
      if (!request) {
        return res.status(404).json({ error: 'Friend request not found' });
      }

      await request.destroy();
  
      res.json({ message: 'The friend request has beem deleted deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

