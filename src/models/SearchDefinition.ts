import { Model, DataTypes } from 'sequelize';
import sequelize from '../db'; // Import your Sequelize instance

class SearchDefinition extends Model {
  public id!: number;
  public keyword!: string;
  public location!: string;
  public refreshInterval!: number;
}

SearchDefinition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SearchDefinition',
  }
);

export default SearchDefinition;
