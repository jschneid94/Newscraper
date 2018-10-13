$(document).ready(function(){
    $("button").on("click", "#deleteComment", function(event) {
        event.preventDefault();
        let link = location.href + "/" + $(this).data("comment");
        $.ajax({
            method:"DELETE",
            url: link
        })
        location.reload();
    });
});