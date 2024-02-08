import mongoose from "mongoose";
const listSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;
