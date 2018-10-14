$(document).ready(function(){
    $("#deleteComment").on("click", function(event) {
        event.preventDefault();
        console.log("is this working?");
        let link = location.href + "/" + $(this).data("comment");
        $.ajax({
            method:"DELETE",
            url: link
        })
        location.reload();
    });
});