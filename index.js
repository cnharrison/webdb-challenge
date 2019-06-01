const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());

require("dotenv").config();
const db = require("./helpers/helpers.js");

const port = process.env.PORT || 9090;

server.listen(9090, () => {
  console.log("we out here listening");
});

server.post("/api/projects", (req, res) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    res.status(400).json({
      errorMessage: "Please provide name and description for the project"
    });
  }
  db.insertProject({
    name,
    description,
    completed
  })
    .then(addedProject => {
      console.log(addedProject);
      res.status(201).json(addedProject);
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the project to the database"
      })
    );
});

server.post("/api/actions", (req, res) => {
  const { id, project_id, name, description, notes, completed } = req.body;
  if (!project_id || !description || !notes || !name) {
    res.status(400).json({
      errorMessage:
        "Please provide name description, notes and a name for the action"
    });
  }
  db.insertAction({
    id,
    project_id,
    name,
    description,
    notes,
    completed
  })
    .then(addedAction => {
      res.status(201).json(addedAction);
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the action to the database"
      })
    );
});

server.get("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(project => {
      if (!project) {
        res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
      }
      res.status(201).json(project);
    })
    .catch(err =>
      res.status(500).send({ error: "The project could not be retrieved." })
    );
});
