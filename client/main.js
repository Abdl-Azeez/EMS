import {
    Template
} from 'meteor/templating';
import './main.html';
import './templates/employees.html';
import './templates/charts.html';
import './templates/login.html';
import {
    EmployeesDetails
} from '../lib/collection.js';
var Highcharts = require('highcharts');




Template.employees.helpers({
    employeesDetails: function () {
        return EmployeesDetails.find({}, {
            sort: {
                createdAt: -1
            }
        })
    }

});

Template.charts.helpers({
    createChart: function () {

        let total = EmployeesDetails.find().count();
        let maleemp = EmployeesDetails.find({
            gender: "Male"
        }).count();
        let femaleemp = EmployeesDetails.find({
            gender: "Female"
        }).count();
        let sales = EmployeesDetails.find({
            department: "Sales"
        }).count();
        let mkt = EmployeesDetails.find({
            department: "Marketing"
        }).count();
        let admin = EmployeesDetails.find({
            department: "Administration"
        }).count();
        let it = EmployeesDetails.find({
            department: "IT"
        }).count();
        let finance = EmployeesDetails.find({
            department: "Finance"
        }).count();
        let rad = EmployeesDetails.find({
            department: "Research and Development"
        }).count();


        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('chartContainer', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },

                title: {
                    text: 'Employees Department Chart'
                },
                tooltip: {
                    pointFormat: '{series.data.name} : <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        colors: ['#255d5b', '#90ed7c', '#35b957'],
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        // showInLegend: true
                    }
                },
                series: [{
                    name: 'Employees',
                    colorByPoint: true,
                    data: [{
                        name: 'Sales',
                        y: sales,
                        sliced: true,
                        // selected: true
                    }, {
                        name: 'IT',
                        y: it,
                        sliced: true,
                    }, {
                        name: 'Marketing',
                        y: mkt,
                        sliced: true,
                    }, {
                        name: 'Research and Development',
                        y: rad,
                        sliced: true,
                    }, {
                        name: 'Finance',
                        y: finance,
                        sliced: true,
                    }, {
                        name: 'Administration',
                        y: admin,
                        sliced: true,
                    }]
                }]
            });

            Highcharts.chart('chart2Container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Employees Gender Chart'
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: ['Total Employees (' + total + ')<br>'],
                    },
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Nova Square, cursive',
                            color: 'black'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ' ',
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Percentage from total: <b>{point.y:.1f}%</b>'
                },
                series: [{
                    data: [
                        ['<b>Male</>', maleemp],
                        ['<b>Female</b>', femaleemp]

                    ],
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#000',
                        align: 'center',
                        format: '{point.y:.1f}', // one decimal
                        y: 1, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Nova Square, cursive'
                        }
                    }
                }]
            });
        });
    }

});

Template.employees.events({
    'click #empdelete': function (event) {

        let comfirmation = confirm("Do you want to really delete this employee?");
        let empid = this._id;
        if (comfirmation) {

            $("#" + empid).hide('slow', function () {
                EmployeesDetails.remove({
                    "_id": empid
                });
            })


        }
    },

    'submit .editform': function (event) {

        event.preventDefault();
        const empid = this._id;

        const target = event.target;
        let imagesrc = target.empphoto.value;

        if (imagesrc == '') {
            imagesrc = "https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png";
        }

        let editedValues = {
            name: target.empname.value,
            age: target.empage.value,
            imagelink: imagesrc,
            gender: target.empgender.value,
            nationality: target.empnationality.value,
            department: target.empdepartment.value
        }


        EmployeesDetails.update({
                "_id": empid
            }, editedValues,
            function (err) {
                if (err) {
                    Bert.alert("Error : " + err.reason, "danger", 'growl-top-right', 'fa fa-exclamation');
                } else {
                    Bert.alert("Updated Successfully", "success", 'growl-top-right', 'fa fa-check');
                    $('#id04' + empid).fadeOut(700);
                }
            });


        return false;
    }

});

Template.login.events({

    'submit #AddEmployee': function (event) {
        event.preventDefault();
        const target = event.target;
        const name = target.empname.value;
        const age = target.empage.value;
        const gender = target.empgender.value;
        const nationality = target.empnationality.value;
        const department = target.empdepartment.value;
        let imagelink = target.empphoto.value;

        if (imagelink == '') {
            imagelink = "https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png";
        }

        EmployeesDetails.insert({
            imagelink,
            name,
            createdAt: new Date(),
            age,
            gender,
            nationality,
            department
        }, function (err) {
            if (err) {
                Bert.alert("Error : " + err.reason, "danger", 'growl-top-right', 'fa fa-exclamation');
            } else {
                Bert.alert(name + "  Added Successfully", "success", 'growl-top-right', 'fa fa-check');
                $('#id03').fadeOut(700);
            }
        });

        //To clear the form
        target.empname.value = "";
        target.empage.value = '';
        target.empgender.value = '';
        target.empdepartment.value = '';
        target.empnationality.value = '';
        target.empphoto.value = "";

        return false;
    },

    'submit #signupForm': function (event) {
        const target = event.target;
        const username = target.username.value;
        const psw = target.psw.value;
        const psw2 = target.psw2.value;

        if (psw !== psw2) {
            Bert.alert('The two passwords are not equal', 'warning', 'growl-top-right', 'fa fa-exclamation-triangle');
            return false;
        } else {
            event.preventDefault();

            var registerData = {
                username: username,
                password: psw2
            }

            Accounts.createUser(registerData, function (error) {

                if (Meteor.user()) {
                    console.log(Meteor.userId());
                    Bert.alert("Successful added user with  " + Meteor.userId(), 'success', 'growl-top-right', 'fa fa-check');

                    $('#id02').fadeOut(700);
                } else {
                    console.log("ERROR: " + error.reason);
                    Bert.alert("ERROR: " + error.reason, 'danger', 'growl-top-right', 'fa fa-exclamation');
                }
            });
        }

        target.username.value = "";
        target.psw.value = '';
        target.psw2.value = '';

        return false

    },

    'click #logout': function (event) {
        event.preventDefault();
        Meteor.logout();
        Bert.alert("Logged Out " + Meteor.user().username, "warning", 'fixed-top', 'fa fa-exclamation-triangle');
    },

    'submit #loginform': function (event) {
        event.preventDefault();
        const target = event.target;
        const username = target.uname.value;
        const password = target.pass.value;

        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                Bert.alert("Error: " + err.reason, "danger", 'growl-top-right', 'fa fa-exclamation');
                return false;
            } else {
                Bert.alert("Logged in as " + Meteor.user().username, "success", 'growl-top-right', 'fa fa-check');
                $('#id01').fadeOut(700);
                return true;
            }
        });

        target.uname.value = "";
        target.pass.value = '';

        return false

    }
});