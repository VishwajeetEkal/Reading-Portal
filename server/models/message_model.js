const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData', 
        required: true,
      },
  participants: [
    {
      type: {
        type: String,
        // enum: ["user", "owner", "admin"],
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
      },
    },
  ],
//   group: {
//     groupId: mongoose.Schema.Types.ObjectId,
//     groupType: {
//       type: String,
//       enum: ["admin", "owner", "customer"],
//     },
//     members: [mongoose.Schema.Types.ObjectId],
//   },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    delivered: Boolean,
    read: Boolean,
  },
});

module.exports = mongoose.model('Message', messageSchema);