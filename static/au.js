var snum=0;
var num=0;

$(document).ready(function(){
    $(".himg").mouseenter(function(){
       $(this).animate({opacity:"1"},1000);
    });
    $(".himg").mouseleave(function(){
        $(this).animate({opacity:"0"},1000);
      });
   $("#ha").click(function(){
        $("html,body").animate({scrollTop:$(document).height()},500);
      });
      $(".himg").bind('click',function(e){
          if(snum!=0)
          {
            $('#i'+snum).fadeOut('slow');
            snum=0;
          }
           num= parseInt($(this).attr('id').substr(1));
          snum=25-num;
          console.log('#i'+snum);
        $('#i'+snum).fadeIn('slow');
        event.stopImmediatePropagation();
        
      });

  });
  $(document).bind('click',function(e) {
    var target = e.target;

    if (!$(target).is('#i'+snum)&&snum!=0 &&snum!=1 ) {
        $('#i'+snum).fadeOut('slow');
        snum=0;
        event.stopImmediatePropagation();
    }
});


  
