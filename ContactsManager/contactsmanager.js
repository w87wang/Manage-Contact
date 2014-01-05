var currentImageBlob;

$(document).ready(function () {
    $('#pickButton').click(function () {
        var pick = new MozActivity({
            name: 'pick',
            data: {
                type: ["image/png", "image/jpg", "image/jpeg"]
            }
        });
        pick.onsuccess = function () {
            currentImageBlob = this.result.blob;
            var img = $('<img />').attr({ 'id': 'contactImage', 'src': window.URL.createObjectURL(currentImageBlob), 'width': '100px' });
            $('#contactImage').replaceWith(img);
        };
    });

    $('#saveButton').click(function () {
        var person = new mozContact();
        person.givenName = $('#firstName').val();
        person.familyName = $('#lastName').val();
        person.photo = [currentImageBlob];

        var saving = navigator.mozContacts.save(person);

        saving.onsuccess = function () {
            console.log('Contact saved!');
        };

        saving.onerror = function () {
            console.log('Failed to save contact!');
        };
    });

    $('#searchForm').keypress(function (e) {
        if (e.which != 13)
            return;
        e.preventDefault();
        var options = {
            filterValue: $('#searchInput').val(),
            filterBy: ['givenName'],
            filterOp: 'contains',
            filterLimit: 1,
            sortBy: 'givenName',
            sortOrder: 'ascending'
        };

        var search = navigator.mozContacts.find(options);

        search.onsuccess = function () {
            if (search.result.length == 1) {
                var person = search.result[0];

                console.log("Found:" + person.givenName[0] + " " + person.familyName[0]);

                $('#firstName').val(person.givenName[0]);
                $('#lastName').val(person.familyName[0]);

                var img = $('<img />').attr({ 'id': 'contactImage', 'src': window.URL.createObjectURL(person.photo[0]), 'width': '100px' });
                $('#contactImage').replaceWith(img);
            } else {
                console.log('Could not find contact');
            }
        };
    });
});
