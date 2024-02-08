import List from "../models/list.model.js";

export async function createList(req, res) {
  const { name } = req.body;
  try {
    // Create a new list
    const list = await List.create({ name });

    // Respond with success message and created list
    res.status(200).json({
      status: 200,
      response: list,
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    res.status(500).json({
      status: "Server error",
      response: error.message,
    });
  }
}

export async function getAllLists(req, res) {
  try {
    // Query the database to get all lists
    const lists = await List.find();

    // Respond with the retrieved lists
    res.status(200).json({
      status: 200,
      response: lists,
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    res.status(500).json({
      status: "Server error",
      response: error.message,
    });
  }
}

// Define deleteList function
export async function deleteList(req, res) {
  const { id } = req.params;

  try {
    // Find the list by ID and delete it
    const deletedList = await List.findByIdAndDelete(id);

    if (!deletedList) {
      return res.status(404).json({
        status: 404,
        response: "List not found",
      });
    }

    // Respond with success message and the deleted list
    res.status(200).json({
      status: 200,
      response: deletedList,
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    res.status(500).json({
      status: "Server error",
      response: error.message,
    });
  }
}

// Define updateList function
export async function updateList(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Find the list by ID and update its name
    const updatedList = await List.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({
        status: 404,
        response: "List not found",
      });
    }

    // Respond with success message and the updated list
    res.status(200).json({
      status: 200,
      response: updatedList,
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    res.status(500).json({
      status: "Server error",
      response: error.message,
    });
  }
}
