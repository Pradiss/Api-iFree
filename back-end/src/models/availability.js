const { DataTypes } = require("sequelize");

module.exports = (connectionBank) => {
  const Availability = connectionBank.define(
    "Availability",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Owner ID is required"
          }
        }
      },
      owner_type: {
        type: DataTypes.ENUM("musician", "band", "establishment"),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Owner type is required"
          },
          isIn: {
            args: [["musician", "band", "establishment"]],
            msg: "Owner type must be musician, band, or establishment"
          }
        }
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Date is required"
          },
          isDate: {
            msg: "Must be a valid date"
          },
          isAfterToday(value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(value);
            
            if (selectedDate < today) {
              throw new Error("Date must be today or in the future");
            }
          }
        }
      },
      
     
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Start time is required"
          },
          is: {
            args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
            msg: "Start time must be in HH:MM or HH:MM:SS format"
          }
        }
      },
      
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "End time is required"
          },
          is: {
            args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
            msg: "End time must be in HH:MM or HH:MM:SS format"
          },
          isAfterStartTime(value) {
            if (this.start_time && value <= this.start_time) {
              throw new Error("End time must be after start time");
            }
          }
        }
      },
      
      
      status: {
        type: DataTypes.ENUM("available", "pending", "booked", "blocked"),
        defaultValue: "available",
        allowNull: false,
        validate: {
          isIn: {
            args: [["available", "pending", "booked", "blocked"]],
            msg: "Invalid status"
          }
        }
      },
      
     
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "Price must be greater than or equal to 0"
          },
          isDecimal: {
            msg: "Price must be a valid decimal number"
          }
        }
      },
      
     
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 1000],
            msg: "Notes must be less than 1000 characters"
          }
        }
      },
    },
    {
      tableName: "availabilities",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["owner_id", "owner_type", "date", "status"]
        },
        {
          fields: ["date", "status"]
        }
      ],
      
      
      hooks: {
        beforeValidate: (availability) => {
         
          if (availability.start_time && !availability.start_time.includes(':')) {
            throw new Error("Start time must include ':'");
          }
          if (availability.end_time && !availability.end_time.includes(':')) {
            throw new Error("End time must include ':'");
          }
        }
      }
    }
  );

  return Availability;
};