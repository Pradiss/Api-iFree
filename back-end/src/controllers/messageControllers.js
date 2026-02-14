const { User, Message } = require("../models");

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_user_id, content } = req.body;

    if (!receiver_user_id) {
      return res.status(400).json({
        error: "receiver_user_id is required"
      });
    }

    const receiver = await User.findByPk(receiver_user_id);

    if (!receiver) {
      return res.status(404).json({
        error: "Receiver user not found"
      });
    }

    const message = await Message.create({
      sender_user_id: req.user.id,
      receiver_user_id,
      content
    });

    return res.status(201).json(message);

  } catch (error) {
    return res.status(500).json({
      error: "Error Sending Message",
      details: error.message
    });
  }
};

exports.messageAll = async (req, res) => {
  try {
   const message = await Message.findAll()
   res.status(200).json(message)
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching messages"
    });
  }
};