import mongoose from "mongoose";

const subscriptionSchem = new mongoose.Schema(
  {
    subscriber: {
      // who subscribe
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // whome to subscribe
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchem);
