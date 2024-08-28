import express, { response } from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// Retrieves and returns all recipes stored in the RecipeModel collection.

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

// Create a new recipe
router.post("/:userID", async (req, res) => {
  const { userID } = req.params;
  const recipe = new RecipeModel({
    ...req.body,
    userOwner: userID,
  });

  try {
    const response = await recipe.save();
    res.status(201).json(response);  // 201 for created
  } catch (err) {
      res.status(500).json({ message: "Error creating recipe", error: err });
  }
});

 
// Save a Recipe ( Adds a recipe to a user's list of saved recipes and saves it to the database)
router.put("/", async (req, res) => {
  try {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// Get id of saved recipes ( Returns the IDs of recipes saved by the user specified by userID)
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// Get saved recipes(Retrieves the full details of recipes that the user has saved)

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.json({ savedRecipes});
  } catch (err) {    
    res.json(err);
  }
});

export { router as recipesRouter };