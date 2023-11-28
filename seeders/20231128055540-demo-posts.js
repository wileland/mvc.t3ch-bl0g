"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Posts",
      [
        {
          title: "First Post",
          content: "This is the content of the first post.",
          userId: 1, // Assuming a user with ID 1 exists
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Second Post",
          content: "Content for the second post goes here.",
          userId: 1, // Adjust the userId as per your users table
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more posts as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
