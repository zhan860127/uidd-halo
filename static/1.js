function re() {
   var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
   var h = w*1.77;
   $("html, body").css({"width":w,"height":h});
};
 $(document).ready(function(){

     $("#si2").mouseenter(function(){
        $(this).animate({opacity:"1"},300);
        console.log('signin_2');

     });


     $("#si2").mouseleave(function(){
        $(this).animate({opacity:"0"},300);
      });

     $("#su2").mouseenter(function(){
        $(this).animate({opacity:"1"},300);
        console.log('signup_2');
     });
     $("#su2").mouseleave(function(){
        $(this).animate({opacity:"0"},300);
      });
    });

    