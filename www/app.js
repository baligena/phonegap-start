///////////////////UTILITY
function util_error(message){
   console.log('%c' +message, 'color: red');
}
window.onerror = function(a,b,c){
  alert(a+'\n'+b+'\n'+c);
}


///////////////////////////

//IF MOBILE, LOAD MOBILE FILES
if(!/Chrome/i.test(navigator.userAgent)){
    $.getScript( "js/cordova-2.7.0.js")
    $.getScript( "js/delete.js")
    console.log('this is mobile');
}


// check for internet connection
if(typeof(Storage)!=="undefined")
{
    // var testObject = [
    //   {"id":1, "date":2013, "first_line":'hello world'},
    //   {"id":2, "first_line":'test'},
    // ];
    // // testObject[0]['date'] = 2014;
    // // alert(testObject[0]['date']);
    // // throw new Error("die on line");
    // // Put the object into storage
    // localStorage.setItem('testObject', JSON.stringify(testObject));

    // // Retrieve the object from storage
    // var retrievedObject = localStorage.getItem('testObject');

    // console.log('retrievedObject: ', JSON.parse(retrievedObject));

    // alert(JSON.parse(retrievedObject)[0]['date'] );
  
}
else{
    alert('FSQ ERROR: No localStorage');
}






//http://stackoverflow.com/questions/18204785/phonegap-check-internet-connection
//http://jsfiddle.net/4vTvW/3/
//http://tympanus.net/Tutorials/AnimatedBorderMenus/index5.html
//http://tympanus.net/Development/AnimatedSVGIcons/
//http://livestyle.emmet.io/
//fuzzy search
//http://jsfiddle.net/trevordixon/pXzj3/4/
//https://gist.github.com/freekrai/1903163
//http://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string_search_algorithm
//http://www.php.net/manual/en/function.levenshtein.php
// filename = "includes/cifras.html";
// var load_cifras = $.get( filename, function( data ) {
//   $('main').append(data);
//     fl_length = 50;
//     var songs = new Array();
//     var s;
//     $('pre').each(function(i){
//         s = $('.first_line',this).html().trim().substr(0,50);
//         songs[i] = {
//                 id: i,
//                 first_line: ($('.first_line',this).html().length > fl_length) ? s + '...' : s,
//                 html: $(this).html()
//           }
//     });
//     if($('.cifra-mono').length != $('.first_line').length){
//         alert('Error: number of .first_line doesn\'t equal the number of .cifra-mono \nMeaning there\'s songs that will not show up in the Navigation Page \nCheck  ' +filename )
//     }
//     // sort songs by first line
//     songs.sort(function(a, b) {
//         if(a.first_line.toLowerCase() < b.first_line.toLowerCase()) return -1;
//         if(a.first_line.toLowerCase() > b.first_line.toLowerCase()) return 1;
//         return 0;
//     });

//     var cifras = new Array();
//     $.each( songs, function( key, value ) {
//       cifras.push({
//             id:value['id'], 
//             first_line:value['first_line'],
//             html: value['html']
//           });
//     });
//     app.data.JSON = cifras;
// });

var load_cifras = $.get( "http://mail.baligena.com/convert_music_stand?download", function( data ) {
  app.data.JSON = JSON.parse(data);
});



//DEFAULTS
window.app = {
  url:''
  ,file:''
  ,cifra: {
    id:undefined,
    history:[]
  }
  ,view:{}
  ,pages:{}
  ,collection:{}
  ,router:{}
  ,data:{}
  ,URN:{
      current:'',
      previous:'',
  }
}



  app.view.page = Backbone.View.extend({
    //DEFAULTS
    el: 'main'
    ,name: 'SET page NAME, CURRENTLY COMING FROM PARENT'
    ,initialize:function(options){
      //initialize runs only once when object is initiated
      this.clear_page();
      this.options = options;
      app.url = document.URL;
      app.file = location.pathname;
      _.bindAll(this, 'render');
      this.render();
    }
    ,set_URN:function(){
      app.URN.previous = app.URN.current;
      app.URN.current = location.hash;
    }
    ,change_page:function(ev){
        $('.controls li').css('background','rgb(0, 26, 3)');

         this.record_history(ev.target.id-1);
         app.cifra.id = ev.target.id-1;
         if(ev.target.className == 'first_line'){
            app.route.navigate('cifra/'+app.cifra.id, {trigger: true});
         }
         else{
            app.route.navigate(ev.target.id, {trigger: true});
            // console.log($(ev.target).html());
            //controls css
            $(ev.target).css('background','grey');
         }
         $('body').animate({ scrollTop: 0 }, 0); //scroll to the top of page

    }
     ,record_history:function(id){ 
         if( isNaN(id) || id == -1){ //only record the cifra pages that has an id set to a number greater than -1
            return false;
         }
         var history =  app.cifra.history;
         var i = history.indexOf(id)
         if( i != -1){ //no duplicates
            history.splice(i, 1);
         }
         history.unshift(id); 
    }
    ,clear_page:function(){
      var deferred = new $.Deferred();
      this.$el.html('');
      deferred.resolve('hello world');
      return deferred;
    }
  });

    app.view.controls = app.view.page.extend({
        el: 'body'
        ,events:{
            'click .controls li': 'change_page'
        }
        ,initialize:function(){
            this.draw_controls();
        }
        ,draw_controls:function(){
            this.$el.append('<li class="null"></li>'); //hack that make the control navigation not overlap/clear
            
            this.$el.append('<ul class="controls"></ul>');
            var ul = $('ul.controls');
            ul.append('<li id="">Alpha</li>');      
            ul.append('<li id="history">History</li>');      
            ul.append('<li id="version">v1.1.8.9</li>');      
        }
    });

  app.view.navigation = app.view.page.extend({
     render: function(){
      this.set_URN();
      this.draw_list();
      return this;
    }
    ,draw_list:function(){
      var that = this;
      var i = 1;
      this.collection.each(function(model){
        that.$el.append('<li class="first_line" id=' + i + '>' + model.get('first_line') + '</li>');
        i++;
      });
    }

  })


  app.view.home_page = app.view.navigation.extend({
    name: 'home' 
     ,events:{
      'click li.first_line': 'change_page'
    }

  });

   app.view.history_page = app.view.navigation.extend({
    //if you load the history page directly theres no events to make the navigation work
        name: 'history'
        ,draw_list:function(){
             var that = this;
             var history = app.cifra.history;
             $.each(history, function(key, value){
                if(value != undefined){
                    that.$el.append('<li class="first_line" id=' + (value+1) + '>' + that.collection.at(value).get('first_line') + '</li>');
                }
         });
        }
   });

  app.view.cifra_page = app.view.page.extend({
    name: 'cifra'
    ,render: function(){
      this.set_URN();
      // $('body').animate({ scrollTop: 0 }, 0); //scroll to the top of page
      this.$el.append('<pre>'+this.collection.at(app.cifra.id).get('html')+'</pre>');
      return this;
    }
  });

  app.collection.cifras = Backbone.Collection.extend({
      // model: Song
  });

  app.router.music_stand = Backbone.Router.extend({
    routes:{
      // "route", "fuction name",
      "": "draw_home",
      "cifra/:id": "draw_cifra", //eg: URL/#/cifra/12
      "history": "draw_history"
    }
    ,initialize:function(){
        new app.view.controls(); 
        app.data.collection = new app.collection.cifras(app.data.JSON);
    } 
    ,draw_home:function(){
      this.initiate('home_page','{collection: app.data.collection}');
    }
    ,draw_cifra: function(id){
      if(app.cifra['id'] == undefined){
        app.route.navigate('', {trigger: true});
        util_error('Custom Warning: app.cifra.id was not set.  May be because you arrived at the previous route incorrectly, therefore the page was redirected.\nFile: '+ app.file+'\nRoute:"'+app.URN.current+'"');
        return false;
      }
      this.initiate('cifra_page','{collection: app.data.collection}');
    }
   ,draw_history:function(){
      this.initiate('history_page','{collection: app.data.collection}');
   }
   ,initiate:function(view, param){
      page = app.pages[view];
      if(!page){  //exist?
        app.pages[view] = eval('new app.view.'+ view + '('+param+')');
      }
      else{
         page.clear_page().done(function(n){
            page.render();
            // console.log(n);
         });
      }
    }

  });
  

load_cifras.done(function(){
   app.route = new app.router.music_stand;



   $(function(){
    Backbone.history.start();
   })
});



