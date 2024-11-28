import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    createdBy: {
      type: String, // Ahora usamos el email en lugar del ObjectId
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;
