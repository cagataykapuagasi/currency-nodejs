// const choices = (sequelize, DataTypes) => {
//   const Choices = sequelize.define("choices", {
//     a: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     b: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     c: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     d: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     e: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   });

//   return Choices;
// };

// const question = (sequelize, DataTypes) => {
//   const Question = sequelize.define("question", {
//     context: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     choices: {
//       type: choices,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//   });

//   return Question;
// };
// module.exports = question;
