window.$ = require("jquery");
var bootstrap = require('bootstrap');
var jqueryUi = require('webpack-jquery-ui');


$(function () {

    //Plugin jQuery UI autocomplete
    $('#search').autocomplete({

        minLength: 3,

        source: function (req, res) {
            var searchVal = $('#search').val();
            getUsers(searchVal, res);
        }

    });

    //Submit du champ recherche
    $('#seachForm').submit(function (e) {
        e.preventDefault();

        $('#loader').show();
        var searchVal = $('#search').val();

        hideAll();

        getRepos(searchVal);

    })


});

function getUsers(searchVal, res) {

    //hideAll();
    $('#alertMsg').hide();

    $.ajax({
        type: "get",
        url: 'https://api.github.com/search/users?q=' + searchVal,

        success: function (donnees) {
            var results = $.map(donnees.items, function (val, i) {
                var thisVal = Object.values(val)[0]

                return thisVal;
            })

            res(results.slice(0, 5));

        },
        error: function (response) {

            var limit = response.getResponseHeader('X-RateLimit-Remaining')

            if (limit == 0) {
                $('#alertMsg').text("Limite de requête atteinte !")
                
            } else {
                $('#alertMsg').text("Erreur lors de la récupération des données")
            }

            $('#loader').hide();
            $('#alertMsg').show();

        }
    })
}

function getRepos(searchVal) {

    hideAll();

    var listRepo = $('#listRepo');
    listRepo.empty();

    $.ajax({
        type: "get",
        url: 'https://api.github.com/users/' + searchVal + '/repos',

        success: function (donnees) {

            if ($.isEmptyObject(donnees)) {
                $('#alertMsg').text("Cet utilisateur n'a pas de dépôts public")
                $('#loader').hide();
                $('#alertMsg').show();
                return
            }

            var userName = donnees[0].owner.login;
            var userSrc = donnees[0].owner.avatar_url;

            $.each(donnees, function (index, value) {
                listRepo.append('<li class="repo-item hover" data-user="' + userName + '" data-repo="' + donnees[index].name + '">' + donnees[index].name + '</li> <br>')
            })

            $('#userImg').attr('src', userSrc);
            $('#userName').text(userName);

            clickRepo()

            $('#loader').hide();
            $('#resultUser').show()

        },
        error: function (res) {
            var limit = res.getResponseHeader('X-RateLimit-Remaining')

            if (limit == 0) {
                $('#alertMsg').text("Limite de requête atteinte !")
                
            } else {
                $('#alertMsg').text("Erreur lors de la récupération des données")
            }

            $('#loader').hide();
            $('#alertMsg').show();

        }
    })
}

function getOneRepo(user, thisRepo) {

    hideAll();

    $.ajax({
        type: "get",
        url: 'https://api.github.com/repos/' + user + '/' + thisRepo,

        success: function (donnees) {


            var userName = donnees.owner.login;
            var userSrc = donnees.owner.avatar_url;
            var repoSrc = donnees.html_url;
            var repoName = donnees.name;
            var repoTechno = donnees.language;
            var repoResume = donnees.description;

            $('#userImgRepo').attr('src', userSrc);
            $('#userNameRepo').text(userName);
            $('#urlRepo').text(repoSrc);
            $('#urlRepo').attr('href', repoSrc);
            $('#nameRepo').text(repoName);
            $('#technoRepo').text(repoTechno);
            $('#resumeRepo').text(repoResume);
            $('#back').attr('data-user', userName)

            backToList();

            $('#loader').hide();
            $('#resultRepo').show();

        },
        error: function (res) {

            var limit = res.getResponseHeader('X-RateLimit-Remaining')

            if (limit == 0) {
                $('#alertMsg').text("Limite de requête atteinte !")
                
            } else {
                $('#alertMsg').text("Erreur lors de la récupération des données")
            }

            $('#loader').hide();
            $('#alertMsg').show();

        }
    })
}

function clickRepo() {
    $('.repo-item').click(function(e) {
        var selectedRepo = $(e.currentTarget).attr('data-repo');
        var selectedUser = $(e.currentTarget).attr('data-user');

        $('#resultUser').hide()
        $('#loader').show();

        getOneRepo(selectedUser, selectedRepo)
    })

}

function backToList() {
    $('#back').click(function(e) {

        $('#resultRepo').hide();
        $('#resultUser').show();

    })
}

function hideAll() {
    $('#alertMsg').hide();
    $('#resultRepo').hide();
    $('#resultUser').hide()
}