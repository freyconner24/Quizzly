/**
* Year.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    // Primitives
    id: {
   type: 'integer',
   autoIncrement: true,
   primaryKey: true,
   unique: true
    },
    year: {
      type: 'string'
    },
    // Methods
  }
};
