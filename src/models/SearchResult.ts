import { Model, DataTypes } from 'sequelize';
import sequelize from '../db'; // Import your Sequelize instance

class SearchResult extends Model {
  public id!: number;
  public searchId!: number;
  public position!: string;
  public company!: string;
  public location!: string;
  public date!: string;
  public salary!: string;
  public jobUrl!: string;
}

SearchResult.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    searchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SearchResult',
  }
);

export default SearchResult;
