const Sequelize = require("sequelize");

// const sequelize = new Sequelize("database", "cagataykapuagasi", "password", {
//   host: process.env.DATABASE_URL || "localhost",
//   dialect: "postgres",
// });

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/database",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

const Model = Sequelize.Model;
class User extends Model {}
class Question extends Model {}
class Choices extends Model {}
User.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    score: {
      type: Sequelize.STRING,
    },
    deviceId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

Question.init(
  {
    context: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    a: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    b: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    c: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    d: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    e: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    answer: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "question",
  }
);

// Choices.init(
//   {
//     a: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     b: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     c: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     d: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     e: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "choices",
//   }
// );

// Question.hasOne(Choices);
// Choices.belongsTo(Question);

module.exports = {
  User,
  Question,
  sequelize,
};
