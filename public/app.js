// $(document).on("click", ".comment", function() {
//     // AJAX POST call to the submit route on the server
//     // This will take the data from the form and send it to the server
//     $.ajax({
//       type: "POST",
//       dataType: "json",
//       url: "/comment",
//       data: {
//         note: $("#note").val(),
//         created: Date.now()
//       }
//     })
//     // If that API call succeeds, add the title and a delete button for the note to the page
//     .then(function(data) {
//         // Add the title and delete button to the #results section
//           $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
//           data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
//           // Clear the note and title inputs on the page
//           $("#note").val("");
//           $("#title").val("");
//         });
//     });

    $(document).on("click", "#get-new", function() {
        console.log("get new articles button clicked");
        $("#get-new").html("searching . . . .");
    });