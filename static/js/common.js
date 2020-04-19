$('#menu-btn').on('click', () => {
    $('.menu-background').removeClass('hidden');
})

$('.menu-background').on('click', function(ev) {
    console.log(ev.target === this);
    console.log(this);
    if (ev.target === this) $(this).addClass('hidden');
});