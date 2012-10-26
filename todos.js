/*localStorage["todos"] = JSON.stringify( [
    { status: 0, text: "get stuff done" },
    { status: 0, text: "other things" },
    { status: 1, text: "something I finished" },
    { status: 0, text: "random stuff to get done" },
    { status: 2, text: "something urgent and stuff" }
] );*/

localStorage["todos"] = localStorage["todos"] || "[]";

function reset() {
    localStorage["todos"] = "[]";
    localStorage["title"] = '';   
}

var todos = JSON.parse( localStorage["todos"] );

var states = [ "due", "done", "urgent" ],
    $todo = $('<li data-status="0" class="due"><div class="check"></div><span contenteditable></span><div class="handle"></div></li>');

$.each( todos, function(i, val) {
    var $new = $todo.clone();
    $('.todo li:last').after( $new );
    $new.attr("data-status", val.status).removeClass("due").addClass( states[ val.status ] ).children('span').text( val.text );
});

$("#title").text( localStorage["title"] || "Click Here To Edit Title" );

function saveTodos() {
    var newTodos = [];
    $(".todo li:not(.new)").each(function(i, todo) {
        newTodos.push( { status: $(todo).attr('data-status'), text: $(todo).children('span').text() } );
    });
    localStorage["todos"] = JSON.stringify( newTodos );
}

$('.check').live('click', function() {
    var $todo = $(this).parent(),
        status = $todo.attr('data-status');
    $todo.removeClass( states[ status++ ] );
    status %= 3;
    $todo.addClass( states[ status ] ).attr('data-status', status);
    saveTodos();
});

$('.todo').sortable({
    handle: ".handle",
    scroll: false,
    update: function() {
        saveTodos();
    }
});

$('.trash').droppable({
    hoverClass: 'hover',
    tolerance: "pointer",
    drop: function(event, ui) {
        ui.draggable.remove();
    }
});

$('.todo li.new span:last').keypress(function(e) {
    if(e.keyCode == 13) {
        var val = $(this).text();
        if( val != "I need to.." && val != '') {
            var $new = $todo.clone();
            $('.todo li.new').after( $new );
            $new.children('span').text( val );
            $(this).text("I need to..").focus();
            saveTodos();
        }
        return false;
    }
}).focus(function() {
    $(this).text('');
}).blur(function() {
    if( !$(this).text() ) {
        $(this).text("I need to..");
    }
});

$('.todo li:not(.new)').keypress(function(e) {
    if(e.keyCode == 13) {
        saveTodos();
        $(this).blur();
        return false;
    }
});

var saveTitle = function() {
    localStorage['title'] = $('#title').text();
};

$('#title').keypress(function(e) {
    if(e.keyCode == 13) {
        $(this).blur();
        return false;
    }
}).blur( saveTitle );