import updateUser from './updateUser'
import updateChecked from './updateChecked'
import {combineReducers} from 'redux';
import {persist} from './../presists'
const numberPersistConfig = {
  key: "persistedStore"
  //version: 1
  //migrate: createMigrate(migrations, { debug: MIGRATION_DEBUG })
};
const allReducers= combineReducers({
  persistedStore: persist(numberPersistConfig,updateUser)
  //notPersistedStore: messageReducer
});
export default allReducers;