const db = require("../data/dbConfig.js");
const mappers = require("./mappers");

module.exports = {
  get,
  insertAction,
  insertProject,
  getProjectActions
};

function get(id) {
  let query = db("projects as p");

  if (id) {
    query.where("p.id", id).first();

    const promises = [query, this.getProjectActions(id)]; // [ projects, actions ]

    return Promise.all(promises).then(function(results) {
      let [project, actions] = results;

      if (project) {
        project.actions = actions;

        return mappers.projectToBody(project);
      } else {
        return null;
      }
    });
  }

  return query.then(projects => {
    return projects.map(project => mappers.projectToBody(project));
  });
}

function insertAction(action) {
  return db("actions")
    .insert(action)
    .then(ids => ({ id: ids[0] }));
}

function insertProject(project) {
  return db("projects")
    .insert(project)
    .then(ids => ({ id: ids[0] }));
}

function getProjectActions(projectId) {
  return db("actions")
    .where("project_id", projectId)
    .then(actions => actions.map(action => mappers.actionToBody(action)));
}
