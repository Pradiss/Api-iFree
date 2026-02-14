const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Message = connectionBank.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      
      sender_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      
      receiver_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Message cannot be empty" },
          len: {
            args: [1, 2000],
            msg: "Message must be between 1 and 2000 characters"
          }
        }
      },
      
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      
      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      tableName: "messages",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["sender_user_id"] },
        { fields: ["receiver_user_id", "is_read"] },
        { fields: ["created_at"] }
      ]
    }
  );

  return Message;
};