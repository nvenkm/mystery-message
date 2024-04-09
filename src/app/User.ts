import mongoose, { Schema, Document, models } from "mongoose";

//message interface
export interface MessageInterface extends Document {
  content: string;
  createdAt: Date;
}

//message schema
const MessageSchema: Schema<MessageInterface> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

//user interface
export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: MessageInterface[];
}

//user schema
const UserSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify is required!"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required!"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema],
  },
});

const UserModel =
  (mongoose.models.users as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("users", UserSchema);

export default UserModel;
