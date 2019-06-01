exports.up = async function(knex) {
  await knex.schema.createTable("projects", tbl => {
    tbl.increments("id");
    tbl
      .string("name")
      .unique()
      .notNullable();
    tbl.string("description");
    tbl.boolean("completed");
  });

  await knex.schema.createTable("actions", tbl => {
    tbl.increments("id");
    tbl
      .string("name")
      .unique()
      .notNullable();
    tbl.string("description");
    tbl.string("notes");
    tbl.boolean("completed");
    tbl
      .integer("project_id")
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE")
      .notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("projects");
  await knex.schema.dropTableIfExists("actions");
};
