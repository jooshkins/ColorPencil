const $ = require('jquery');
const powershell = require('powershell');

$(document).ready(() => {

    function RunGetUsers() {
        
        let scriptPath = require("path").resolve(__dirname, './ps/change-share.ps1')
        var cmd = `${scriptPath} -getUsr`
        
        let ps = new powershell(cmd, {
            executionPolicy: 'Bypass',
            noProfile: true,
        })
        // Handle process errors (e.g. powershell not found) // only runs when error
        ps.on("error", err => {
            console.error(err);
        });
        // Stdout // always runs
        ps.on("output", data => {
            if (data) {
                obj = JSON.parse(data);
                for (let usr of obj){
                    $("#usrBin").append(`<option>${usr}</option>`); // add users to drop down list
                }
            }
        });
        // Stderr // only runs when error
        ps.on("error-output", data => {
            console.error(data);
        });
    };

    RunGetUsers();

    $('#GetDirPer').click(() => {
        let dir = document.getElementById("dir").files[0].path;
        
        let scriptPath = require("path").resolve(__dirname, './ps/change-share.ps1')
        var cmd = `${scriptPath} -getPer -dir "${dir}"`
        
        let ps = new powershell(cmd, {
            executionPolicy: 'Bypass',
            noProfile: true,
        })
        // Handle process errors (e.g. powershell not found) // only runs when error
        ps.on("error", err => {
            console.error(err);
        });
        // Stdout // always runs
        ps.on("output", data => {
            if (data) {
                $("#Per").html(data);
                $("#Per").children().addClass("table");
                $("#CurPer").modal(); 
            }
        });
        // Stderr // only runs when error
        ps.on("error-output", data => {
            console.error(data);
        });
    })

    $('#SetPer').click(() => {
        let dir = document.getElementById("dir").files[0].path;
        let usr = $("#usrBin option:selected").text()
    
        var per
        let r = $('#read').prop('checked')
        let m = $('#modify').prop('checked');
        let x = $('#remove').prop('checked')

        if (r) {per = 'r'}
        if (m) {per = 'm'}
        if (x) {per = 'x'}
        
        let scriptPath = require("path").resolve(__dirname, './ps/change-share.ps1');
        var cmd = `${scriptPath} -setPer "${dir}" "${usr}" "${per}"`;

        let ps = new powershell(cmd, {
            executionPolicy: 'Bypass',
            noProfile: true,
        })
        // Handle process errors (e.g. powershell not found) // only runs when error
        ps.on("error", err => {
            console.error(err);
        });
        // Stdout // always runs
        ps.on("output", data => {
            if (data) {
                console.log(data);
                $("#Per").html(`<div class="alert alert-success"><strong>Success!</strong>User permissions applied.</div>`);
                $("#CurPer").modal(); 
            }
        });
        // Stderr // only runs when error
        ps.on("error-output", data => {
            console.error(data);
        });
    })
})


