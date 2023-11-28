"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Comments",
      [
        {
          content: "This is a comment on the first post.",
          userId: 1, // Assuming this user exists
          postId: 1, // Assuming this post exists
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "Another comment, on the second post.",
          userId: 1, // Adjust the userId as per your users table
          postId: 2, // Adjust the postId as per your posts table
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more comments as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
