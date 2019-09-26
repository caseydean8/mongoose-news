$(document).on("click", ".comment", function() {
    const thisId = $(this).attr("data-id");
    });

    $(document).on("click", "#get-new", function() {
        console.log("get new articles button clicked");
        $("#get-new").html("searching . . . .");
    });