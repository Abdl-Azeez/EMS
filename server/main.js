import { Meteor } from 'meteor/meteor';

import { EmployeesDetails } from '../lib/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
  // console.log(EmployeesDetails.find({nationality:'$'}).fetch());
  console.log(EmployeesDetails.find({department:"Research and Development"}).count());
});
