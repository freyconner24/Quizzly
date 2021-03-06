/**
 * CourseController
 *
 * @description :: Server-side logic for managing Courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
  user: function(req, res) {
    console.log("req.session", req.session);
    if(req.session.user) {
      console.log("session is set");
      return res.json(req.session.user);
    } else {
      console.log("session isn't set");
    }
  },
  session: function(req, res) {
    console.log("Session::req.session", req.session);
    if(req.session.user) {
      console.log("session is set");
      return res.json(req.session.user);
    } else {
      console.log("redirect: session isn't set");
      // return res.redirect('/entrance');
      res.status(400).send('No session');
    }
  },
  login: function(req, res) {
    var data = req.params.all();
    Promise.all([
      Professor.find({email: data.email, password: data.password}),
      Student.find({email: data.email, password: data.password})
    ]).spread(function(professor, student){
      console.log("professor", professor);
      console.log("student", student);
      var user = {};
      if(professor.length > 0) {
        user = professor[0];
      } else if(student.length > 0) {
        user = student[0];
        if(data.channelID) {
          Student.update({channelID: data.channelID}, {channelID: null, deviceType: null}).exec(function(err, updated) {
            Student.update({email: data.email}, {channelID: data.channelID, deviceType: data.deviceType}).exec(function(err, updated) {
              console.log("Updated " + updated[0]);
            });
          });

        }

      } else {
        res.status(400).send('That user was not found!');
      }

      user.password = "";
      delete user.password;

      req.session.user = user;
      console.log("req.session", req.session);
      res.json(user);
    }).catch(function(){
      console.log("error is encountered");
    }).done(function(){
      console.log("promise call is done");
    });
  },
  signup: function(req, res) {
    var data = req.params.all();
    console.log(data);
    var UserType = {};
    if(data.isProfessor == 'true' || data.isProfessor == 'YES') {
      console.log("signed up professor");
      UserType = Professor;
    } else {
      console.log("signed up student");
      UserType = Student;
    }

    UserType.create({email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName})
    .exec(function(err, user) {
      console.log("signed up user", user);
      user.password = "";
      delete user.password;

      req.session.user = user;
      console.log("req.session", req.session);
      res.json(user);
    });
  },
  logout: function(req, res) {
    delete req.session.user;
    res.ok();
  }
};
